"""Online Retail II reproducible aggregate model (Python + lxml).

Run each annual sheet separately with --only-sheet 2009-10 or 2010-11.
Merge the two period files with merge_periods.py. This avoids double-counting overlapping month windows.
No row-level customer identifiers are exported: only aggregate statistics.
"""
import argparse
import time
import io
import json
from collections import defaultdict, Counter
from datetime import date
from pathlib import Path
from lxml.etree import iterparse
from zipfile import ZipFile

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
BASE = date(1899,12,30).toordinal()
PERIODS = {'Year 2009-2010':'2009-10','Year 2010-2011':'2010-11'}
KEYS = ['invoice','stock','description','qty','day','price','customer','country']
SPECIAL_CODES = {'POST','DOT','M','BANK CHARGES','AMAZONFEE','C2','S','D','CRUK','ADJUST','ADJUST2','B','PADS','DCGS0003','DCGS0004','DCGS0076','DCGS0070'}


def read_shared(z):
    with z.open('xl/sharedStrings.xml') as stream:
        tree = __import__('lxml.etree',fromlist=['']).parse(stream)
    return [''.join(si.itertext()) for si in tree.getroot()]


def records(z, member, shared):
    # Efficient streaming rather than importing a million spreadsheet rows in memory.
    with z.open(member) as fh:
        it=iterparse(fh,events=('start','end'))
        root=None
        for event,elem in it:
            if event=='start' and root is None:
                root=elem
            if event!='end' or elem.tag!=NS+'row':
                continue
            if int(elem.get('r','0'))==1:
                elem.clear();parent=elem.getparent();
                if parent is not None:parent.remove(elem)
                continue
            result=[None]*8
            for c in elem.findall(NS+'c'):
                ref=c.get('r','')
                n=0
                for ch in ref:
                    if 'A'<=ch<='Z':n=n*26+ord(ch)-64
                    else:break
                if not 1<=n<=8:continue
                v=c.find(NS+'v')
                if v is None or v.text is None:continue
                value=v.text
                if c.get('t')=='s':
                    value=shared[int(value)]
                result[n-1]=value
            yield result
            elem.clear()
            parent=elem.getparent()
            if parent is not None:parent.remove(elem)


def obj():return {'value':0.0,'lines':0,'units':0,'invoices':set(),'customers':set()}

def add(bucket,amount,qty,invoice,customer):
    bucket['value']+=amount
    bucket['lines']+=1
    bucket['units']+=qty
    bucket['invoices'].add(invoice)
    if customer: bucket['customers'].add(customer)

def compact(bucket):
    return {'value':round(bucket['value'],2),'lines':bucket['lines'],'units':bucket['units'],
            'invoices':len(bucket['invoices']),'customers':len(bucket['customers'])}

def group_scope(country):
    names=['All markets','United Kingdom' if country=='United Kingdom' else 'International']
    if country in {'Germany','France','EIRE','Spain','Netherlands','Australia'}: names.append(country)
    return names

def month_add(store,key,amount,qty,invoice,customer):
    add(store[key],amount,qty,invoice,customer)

def choose_segment(freq,recency):
    if recency<=90 and freq>=5:return 'High-frequency active'
    if recency<=90 and freq>=2:return 'Repeat active'
    if recency<=90 and freq==1:return 'Recent one-off'
    if recency>90 and freq>=2:return 'Lapsed repeat'
    return 'Older one-off'

def main(source,output,max_records=None,only_sheet=None):
    t0=time.monotonic()
    qa={p:Counter() for p in PERIODS.values()}
    dates={p:[date.max,date.min] for p in PERIODS.values()}
    months=defaultdict(obj)
    periods=defaultdict(obj)
    countries=defaultdict(obj)
    product=defaultdict(lambda:{'value':0.,'units':0,'description':''})
    customers=defaultdict(lambda:{'value':0.,'invoices':set(),'first':date.max,'last':date.min,'countries':Counter()})
    with ZipFile(source) as outer, ZipFile(io.BytesIO(outer.read('online_retail_II.xlsx'))) as z:
        shared=read_shared(z)
        day_cache={}
        scope_cache={}
        for sheet,p in [(1,'2009-10'),(2,'2010-11')]:
            if only_sheet and p != only_sheet:continue
            print('Reading',p,flush=True)
            for row in records(z,f'xl/worksheets/sheet{sheet}.xml',shared):
                stat=qa[p]; stat['total_lines']+=1
                if max_records is not None and stat['total_lines']>max_records:break
                invoice,stock,description,qty_s,date_s,price_s,customer_s,country=row
                invoice=str(invoice or '').strip();stock=str(stock or '').strip()
                description=str(description or '').strip()
                country=str(country or 'Unspecified').strip()
                cid=str(customer_s).strip().removesuffix('.0') if customer_s not in (None,'') else None
                if not cid:stat['missing_customer_id']+=1
                if invoice.upper().startswith('C'):stat['cancel_invoice_lines']+=1
                try:
                    qty=int(float(qty_s));price=float(price_s)
                    dserial=int(float(date_s))
                    day=day_cache.get(dserial)
                    if day is None:
                        day=date.fromordinal(BASE+dserial);day_cache[dserial]=day
                except (TypeError,ValueError,OverflowError):stat['malformed_rows']+=1;continue
                if qty<=0:stat['nonpositive_quantity_lines']+=1
                if price<=0:stat['nonpositive_price_lines']+=1
                if day<dates[p][0]:dates[p][0]=day
                if day>dates[p][1]:dates[p][1]=day
                # Defined positive-line measure. Cancels/refunds are NOT netted or matched.
                if invoice.upper().startswith('C') or qty<=0 or price<=0:
                    stat['excluded_lines']+=1;continue
                amount=qty*price
                if amount<=0 or amount>1e8:stat['invalid_positive_value_lines']+=1;continue
                stat['positive_lines']+=1
                # For all-country and targeted geographic comparisons.
                month=day.isoformat()[:7]
                scopes=scope_cache.get(country)
                if scopes is None:
                    scopes=group_scope(country);scope_cache[country]=scopes
                for scope in scopes:
                    month_add(months,(p,scope,month),amount,qty,invoice,cid)
                    month_add(periods,(p,scope),amount,qty,invoice,cid)
                month_add(countries,(p,country),amount,qty,invoice,cid)
                # Only obviously non-merchandise special codes excluded from product ranking.
                if stock.upper() not in SPECIAL_CODES and not stock.lower().startswith('gift_') and description:
                    ob=product[p,stock];ob['value']+=amount;ob['units']+=qty
                    if not ob['description']:ob['description']=description
                if cid:
                    ob=customers[p,cid]
                    ob['value']+=amount;ob['invoices'].add(invoice)
                    ob['first']=min(day,ob['first']);ob['last']=max(day,ob['last']);ob['countries'][country]+=1
                if stat['total_lines']%50000==0:print(p,stat['total_lines'],'rows at',round(time.monotonic()-t0,1),'sec',flush=True)
        # Build anonymous customer RFM-based activity groups, using each sheet's latest date.
    segment_index=defaultdict(lambda:{'customers':0,'value':0.,'invoices':0,'sample':[]})
    segment_geo=defaultdict(lambda:{'customers':0,'value':0.,'invoices':0})
    for (p,cid),ob in customers.items():
        f=len(ob['invoices']);rec=(dates[p][1]-ob['last']).days
        seg=choose_segment(f,rec)
        scope='United Kingdom' if ob['countries'].most_common(1)[0][0]=='United Kingdom' else 'International'
        for group in ['All markets',scope]:
            dst=segment_geo[p,group,seg]
            dst['customers']+=1;dst['value']+=ob['value'];dst['invoices']+=f
        segobj=segment_index[p,seg]
        segobj['customers']+=1;segobj['value']+=ob['value'];segobj['invoices']+=f
    month_out={}
    for (p,scope,m),v in months.items():month_out.setdefault(p,{}).setdefault(scope,[]).append({'month':m,**compact(v)})
    for p in month_out:
        for scope in month_out[p]:month_out[p][scope].sort(key=lambda x:x['month'])
    total_out={}
    for (p,scope),v in periods.items():total_out.setdefault(p,{})[scope]=compact(v)
    country_out={}
    for (p,country),v in countries.items():country_out.setdefault(p,[]).append({'country':country,**compact(v)})
    for p in country_out: country_out[p].sort(key=lambda o:o['value'],reverse=True)
    prod_out={}
    for (p,stock),o in product.items():prod_out.setdefault(p,[]).append({'sku':stock,'description':o['description'],'value':round(o['value'],2),'units':o['units']})
    for p in prod_out:prod_out[p]=sorted(prod_out[p],key=lambda o:o['value'],reverse=True)[:20]
    seg_out={}
    for (p,scope,seg),o in segment_geo.items():seg_out.setdefault(p,{}).setdefault(scope,[]).append({'segment':seg,'customers':o['customers'],'value':round(o['value'],2),'invoices':o['invoices']})
    order=['High-frequency active','Repeat active','Recent one-off','Lapsed repeat','Older one-off']
    for p in seg_out:
        for scope in seg_out[p]:seg_out[p][scope].sort(key=lambda x:order.index(x['segment']))
    qa_out={}
    for p,stat in qa.items():
        qa_out[p]={'date_min':dates[p][0].isoformat(),'date_max':dates[p][1].isoformat(),**dict(stat),
                   'known_id_customers_positive':len([1 for key in customers if key[0]==p])}
    result={'metadata':{'source':'UCI Online Retail II, two annual worksheets','measure':'positive-line sales value: Quantity × Price for non-cancellation, positive-quantity and positive-price lines','currency':'GBP (dataset uses £)','sheets':{'2009-10':'Year 2009-2010','2010-11':'Year 2010-2011'},
           'customer_segment_rule':'High-frequency active: >=5 distinct invoices and <=90 days since last observed positive transaction; Repeat active: 2-4 and <=90 days; Recent one-off: 1 and <=90 days; Lapsed repeat: >=2 and >90 days; Older one-off: 1 and >90 days. Date anchor: last observed date in each worksheet. Missing IDs excluded from customer segmentation.',
           'caveats':['Positive-line sales value is not net revenue: returns/cancellations not matched or subtracted.','No unique-customer deduplication across worksheets; each period is evaluated independently.','The final month in the latter dataset is incomplete; do not treat it as a full month.','Missing customer IDs are included in transaction aggregates but excluded from segmentation.','Indices of retention, profit, stock and true return rates cannot be identified from this data alone.','Aggregate products may include ambiguous code semantics, despite excluding identified charges and specials.']},
           'qa':qa_out,'totals':total_out,'monthly':month_out,'countries':country_out,'products':prod_out,'segments':seg_out}
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(result,separators=(',',':'),ensure_ascii=False))
    print('RESULT',json.dumps({'qa':qa_out,'totals':{p:v['All markets'] for p,v in total_out.items()},'segments':{p:v['All markets'] for p,v in seg_out.items()}},indent=2))
    print('OUTPUT',output,output.stat().st_size,'bytes')

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--source',type=Path,required=True);p.add_argument('--output',type=Path,required=True)
    p.add_argument('--max-records',type=int)
    p.add_argument('--only-sheet',choices=['2009-10','2010-11'],required=True)
    args=p.parse_args();main(args.source,args.output,args.max_records,args.only_sheet)