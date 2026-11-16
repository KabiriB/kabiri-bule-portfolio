"""Aethos Decision Lab: bank marketing case study.
Run from repository root: python src/train.py
The score is P(subscription | recorded contact and measured predictors), NOT a causal lift.
"""
import io, json, warnings, zipfile
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss, log_loss, precision_score, recall_score
from joblib import dump

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'data'/'bank+marketing.zip'
OUT=ROOT/'outputs'; OUT.mkdir(parents=True,exist_ok=True)
ART=ROOT/'app'; ART.mkdir(parents=True,exist_ok=True)
SEED=42
CATS=['job','marital','education','default','housing','loan','contact','poutcome']
NUMS=['age','previous','days_since_previous','ever_contacted_previous','emp.var.rate','cons.price.idx','cons.conf.idx','euribor3m','nr.employed']
FEATURES=CATS+NUMS
EXCLUDED={
 'duration':'Recorded after a phone call, impossible to know before outreach (target leakage).',
 'campaign':'Includes the current call and may not be known at targeting time.',
 'month':'Month of the recorded historical contact; avoid treating historical timing as an actionable customer attribute.',
 'day_of_week':'Day of recorded historical contact; not an intrinsic customer attribute.',
 'pdays':'Replaced by a missingness-aware pair of predictors.'
}

def read_source(path=SOURCE):
    """Read nested archive without writing private row-level CSV to the project."""
    with zipfile.ZipFile(path) as outer:
        with zipfile.ZipFile(io.BytesIO(outer.read('bank-additional.zip'))) as inner:
            df=pd.read_csv(inner.open('bank-additional/bank-additional-full.csv'),sep=';')
    return df

def make_X(df):
    frame=df.copy()
    frame['ever_contacted_previous']=(frame['pdays'] != 999).astype(int)
    frame['days_since_previous']=frame['pdays'].where(frame['pdays'] !=999,np.nan)
    # Treat literal 'unknown' as unknown information rather than as an observed status.
    frame[CATS]=frame[CATS].replace('unknown', np.nan)
    return frame[FEATURES]

def make_pipeline(name):
    if name=='Logistic regression':
        pre=ColumnTransformer([
            ('categorical',Pipeline([('missing',SimpleImputer(strategy='most_frequent')),('onehot',OneHotEncoder(handle_unknown='ignore',sparse_output=False))]),CATS),
            ('numeric',Pipeline([('missing',SimpleImputer(strategy='median')),('scaler',StandardScaler())]),NUMS)
        ],sparse_threshold=0)
        clf=LogisticRegression(max_iter=2000,solver='lbfgs',C=1.0,random_state=SEED)
    elif name=='Gradient boosting':
        pre=ColumnTransformer([
            ('categorical',Pipeline([('missing',SimpleImputer(strategy='most_frequent')),('onehot',OneHotEncoder(handle_unknown='ignore',sparse_output=False))]),CATS),
            ('numeric',SimpleImputer(strategy='median'),NUMS)
        ],sparse_threshold=0)
        clf=HistGradientBoostingClassifier(max_iter=140,max_leaf_nodes=15,learning_rate=0.07,l2_regularization=10.0,random_state=SEED,early_stopping=False)
    else: raise ValueError(name)
    return Pipeline([('preprocess',pre),('model',clf)])

def metric(y,probs):
    p=np.clip(np.asarray(probs),1e-6,1-1e-6)
    y=np.asarray(y,dtype=int)
    top_n=max(1,int(np.ceil(len(y)*.20)))
    ix=np.argsort(-p,kind='stable')[:top_n]
    return {
      'n':int(len(y)), 'response_rate':round(float(np.mean(y)),6),
      'roc_auc':round(float(roc_auc_score(y,p)),6),
      'average_precision':round(float(average_precision_score(y,p)),6),
      'brier':round(float(brier_score_loss(y,p)),6),
      'log_loss':round(float(log_loss(y,p)),6),
      'precision_top20':round(float(y[ix].mean()),6),
      'capture_top20':round(float(y[ix].sum()/max(1,y.sum())),6),
      'expected_top20':round(float(p[ix].sum()),4)
    }

def reliability(y,probs,bins=10):
    z=pd.DataFrame({'y':np.asarray(y,dtype=int),'p':np.asarray(probs)})
    z['bin']=pd.cut(z['p'],np.linspace(0,1,bins+1),include_lowest=True,labels=False)
    out=[]
    for k,d in z.groupby('bin',observed=True):
        out.append({'bin':int(k),'n':len(d),'predicted':round(float(d.p.mean()),6),'observed':round(float(d.y.mean()),6)})
    return out

def gain_curve(y,prob):
    y=np.asarray(y,dtype=int);p=np.asarray(prob)
    ys=y[np.argsort(-p,kind='stable')]
    steps=[.05,.10,.15,.20,.25,.30,.40,.50,.60,.70,.80,.90,1.0]
    return [{'fraction':x,'contact_count':min(len(ys),int(np.ceil(len(ys)*x))),
             'captured':round(float(ys[:int(np.ceil(len(ys)*x))].sum()/max(y.sum(),1)),5),
             'observed_rate':round(float(ys[:int(np.ceil(len(ys)*x))].mean()),5)} for x in steps]

def platt_fit(scores,labels):
    """Sigmoid calibration on disjoint calibration data; transform raw p with logit."""
    p=np.clip(scores,1e-6,1-1e-6)
    logits=np.log(p/(1-p)).reshape(-1,1)
    platt=LogisticRegression(C=1000.,max_iter=1000,random_state=SEED)
    platt.fit(logits,labels)
    return platt

def platt_predict(platt,scores):
    p=np.clip(scores,1e-6,1-1e-6)
    return platt.predict_proba(np.log(p/(1-p)).reshape(-1,1))[:,1]

def split_random(df):
    """Approx 60% train / 15% selection / 10% calibration / 15% untouched test.
    Stratification keeps similar base rates; it is NOT a forward prediction test.
    """
    y=df.y.eq('yes').astype(int)
    ids=np.arange(len(df))
    remaining, test=train_test_split(ids,test_size=.15,random_state=SEED,stratify=y)
    remaining, calib=train_test_split(remaining,test_size=10/85,random_state=SEED,stratify=y.iloc[remaining])
    train,valid=train_test_split(remaining,test_size=15/75,random_state=SEED,stratify=y.iloc[remaining])
    return dict(train=train,validation=valid,calibration=calib,test=test)

def demographics_audit(df,ids,scores):
    # A limited descriptive audit, not formal proof of fairness.
    p=df.iloc[ids].copy();p['score']=scores;p['target']=p.y.eq('yes').astype(int)
    audit=[]
    p['age_band']=pd.cut(p.age,bins=[0,29,44,59,130],labels=['18–29','30–44','45–59','60+'])
    for key in ['age_band','marital','education']:
        for value,s in p.groupby(key,observed=True):
            audit.append({'feature':key,'group':str(value),'n':int(len(s)),'actual_rate':round(float(s.target.mean()),4),'mean_score':round(float(s.score.mean()),4)})
    return audit

def run():
    warnings.filterwarnings('ignore',message='X has feature names')
    df=read_source()
    assert len(df)==41188 and set(df.y.unique())=={'yes','no'}
    X=make_X(df); y=df.y.eq('yes').astype(int)
    parts=split_random(df)
    print('Rows:',len(df),'subscribe:',int(y.sum()),'rate:',round(float(y.mean()),4),flush=True)
    print('Splits:',{k:len(v) for k,v in parts.items()},flush=True)
    trained={};validation={}
    for name in ['Logistic regression','Gradient boosting']:
        model=make_pipeline(name)
        model.fit(X.iloc[parts['train']],y.iloc[parts['train']])
        trained[name]=model
        validation[name]=metric(y.iloc[parts['validation']],model.predict_proba(X.iloc[parts['validation']])[:,1])
        print('validation:',name,validation[name],flush=True)
    winner=max(validation,key=lambda k:validation[k]['average_precision'])
    model=trained[winner]
    raw_cal=model.predict_proba(X.iloc[parts['calibration']])[:,1]
    platt=platt_fit(raw_cal,y.iloc[parts['calibration']])
    raw_test=model.predict_proba(X.iloc[parts['test']])[:,1]
    calibrated=platt_predict(platt,raw_test)
    test_y=y.iloc[parts['test']].to_numpy()
    logit_test=trained['Logistic regression'].predict_proba(X.iloc[parts['test']])[:,1]
    boost_test=trained['Gradient boosting'].predict_proba(X.iloc[parts['test']])[:,1]
    performance={
     'Logistic regression':metric(test_y,logit_test),
     'Gradient boosting':metric(test_y,boost_test),
     'Selected raw':metric(test_y,raw_test),
     'Selected calibrated':metric(test_y,calibrated)
    }
    # Non-causal time-shift evaluation; source documentation says CSV is chronologically ordered.
    cut_train=int(.70*len(df));cut_cal=int(.80*len(df))
    forward_model=make_pipeline(winner)
    forward_model.fit(X.iloc[:cut_train],y.iloc[:cut_train])
    forward_cal=platt_fit(forward_model.predict_proba(X.iloc[cut_train:cut_cal])[:,1],y.iloc[cut_train:cut_cal])
    forward_raw=forward_model.predict_proba(X.iloc[cut_cal:])[:,1]
    forward_prob=platt_predict(forward_cal,forward_raw)
    backtest={
      'train_rows':cut_train,'calibration_rows':cut_cal-cut_train,'future_rows':len(df)-cut_cal,
      'train_base_rate':round(float(y.iloc[:cut_train].mean()),6),
      'calibration_base_rate':round(float(y.iloc[cut_train:cut_cal].mean()),6),
      'future_base_rate':round(float(y.iloc[cut_cal:].mean()),6),
      'future_raw':metric(y.iloc[cut_cal:],forward_raw),
      'future_calibrated':metric(y.iloc[cut_cal:],forward_prob),
      'future_mean_calibrated_probability':round(float(np.mean(forward_prob)),6)
    }
    rows=df.iloc[parts['test']].copy()
    rows['probability']=calibrated
    rows['observed']=test_y
    rows['row_id']=parts['test']
    rows['segment']=np.select([rows.poutcome.eq('success'),rows.poutcome.eq('failure')],['Prior campaign success','Prior campaign failure'],'No recorded prior success/failure')
    # Export ONLY anon ID, coarse cohort, ground truth and probability. No names, accounts or personal demographics.
    sample=rows[['row_id','probability','observed','segment']].sort_values('probability',ascending=False,kind='stable')
    sample.to_csv(OUT/'holdout_scores.csv',index=False)
    seg=[]
    for name,part in rows.groupby('segment'):
       seg.append({'name':name,'count':len(part),'response_rate':round(float(part.observed.mean()),5),'mean_score':round(float(part.probability.mean()),5)})
    quality={
      'rows':int(len(df)),'subscribed':int(y.sum()),'response_rate':round(float(y.mean()),6),
      'duplicate_full_rows':int(df.duplicated().sum()),
      'unknown_counts':{c:int(df[c].eq('unknown').sum()) for c in CATS},
      'split_sizes':{k:len(v) for k,v in parts.items()},
      'excluded':EXCLUDED,'used_features':FEATURES,
      'source':'UCI Bank Marketing, bank-additional-full.csv, Moro, Cortez & Rita (2014); records May 2008–Nov 2010.'
    }
    stats={'selected_model':winner,'selection_rule':'Best validation average precision (PR-AUC). No test-set selection.','validation':validation,
       'test':performance,'reliability':reliability(test_y,calibrated),
       'gains':gain_curve(test_y,calibrated), 'segments':seg,'backtest':backtest,'quality':quality,
       'demographic_audit':demographics_audit(df,parts['test'],calibrated),
       'definitions':{'propensity':'Probability of subscribing among historical contacted records given their measured features; not incremental campaign impact.',
        'contribution':'Illustrative analyst-supplied gross contribution per subscription, NOT deposit value.',
        'random_baseline':'Expected number of subscribers under uniformly random targeting within the held-out contacted sample; not no-contact or no-campaign causal counterfactual.',
        'economic_model':'Expected contribution=∑(predicted probabilities of chosen records)×contribution per subscription - number of contacts×contact cost. Assumes same per-subscription contribution and cost.'}}
    (OUT/'metrics.json').write_text(json.dumps(stats,indent=2,ensure_ascii=False),encoding='utf-8')
    (ART/'data.js').write_text('window.AETHOS_DATA = '+json.dumps({
      'metrics':stats,
      'records':[[int(r.row_id),round(float(r.probability),5),int(r.observed),str(r.segment)] for r in sample.itertuples(index=False)]
    },separators=(',',':'),ensure_ascii=False)+';\n',encoding='utf-8')
    dump({'model':model,'calibrator':platt,'features':FEATURES,'source':quality['source']},OUT/'model.joblib')
    print('\nSELECTED:',winner,'\nHOLDOUT:',performance['Selected calibrated'],'\nBACKTEST:',backtest,flush=True)
    return stats

if __name__=='__main__':run()