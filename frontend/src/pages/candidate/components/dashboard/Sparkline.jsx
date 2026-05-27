export default function Sparkline({ data=[], color='#ea580c', w=90, h=36, id='c' }) {
  if (!data||data.length<2) return null;
  const max=Math.max(...data),min=Math.min(...data),range=max-min||1;
  const pts=data.map((v,i)=>({x:+((i/(data.length-1))*w).toFixed(1),y:+((h-4)-((v-min)/range)*(h-8)).toFixed(1)}));
  const line='M '+pts.map(p=>p.x+' '+p.y).join(' L ');
  const area=line+' L '+pts[pts.length-1].x+' '+h+' L 0 '+h+' Z';
  return (
    <svg width={w} height={h} style={{display:'block',overflow:'visible'}}>
      <defs><linearGradient id={'sg'+id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.18"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <path d={area} fill={'url(#sg'+id+')'}/>
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="3" fill={color}/>
    </svg>
  );
}
