"""Merge independently processed annual worksheet aggregates. Never add sheet totals together."""
import argparse
import json
from pathlib import Path

def main(first,second,output):
    a=json.loads(Path(first).read_text());b=json.loads(Path(second).read_text())
    d={'metadata':b['metadata'],'qa':{},'totals':{},'monthly':{},'countries':{},'products':{},'segments':{}}
    for dataset,period in [(a,'2009-10'),(b,'2010-11')]:
        for k in ('qa','totals','monthly','countries','products','segments'):
            d[k][period]=dataset[k][period]
    d['metadata']['note']='Annual worksheets overlap in December 2010; final December is incomplete. Period totals are separate extracts and must not be summed.'
    d['comparability']={}
    for year,period in [(2010,'2009-10'),(2011,'2010-11')]:
        rows=[x for x in d['monthly'][period]['All markets'] if x['month'].startswith(str(year)+'-') and 1<=int(x['month'][5:])<=11]
        assert len(rows)==11,'Comparable Jan–Nov months must be complete'
        d['comparability'][str(year)]={'months':'Jan–Nov','positive_value':round(sum(x['value'] for x in rows),2),
                                       'positive_lines':sum(x['lines'] for x in rows),'monthly_count':len(rows)}
    prev=d['comparability']['2010']['positive_value'];curr=d['comparability']['2011']['positive_value']
    d['comparability']['yoy_2011_vs_2010_pct']=round(100*(curr/prev-1),2)
    # Aggregate-only outputs contain no invoice numbers or customer IDs.
    Path(output).write_text(json.dumps(d,separators=(',',':'),ensure_ascii=False))
    print('Merged two independently processed workbook sheets:',output)
    print('Comparable Jan–Nov value change:',d['comparability']['yoy_2011_vs_2010_pct'],'%')

if __name__=='__main__':
    a=argparse.ArgumentParser();a.add_argument('--first',required=True);a.add_argument('--second',required=True);a.add_argument('--output',required=True)
    x=a.parse_args();main(x.first,x.second,x.output)