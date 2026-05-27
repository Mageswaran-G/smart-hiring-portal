export default function ProgressRing({ value=0, size=80, stroke=8, color='#ea580c', bg='rgba(255,255,255,0.22)', textColor='#fff' }) {
  const r=( size-stroke)/2, circ=2*Math.PI*r, offset=circ-(Math.min(100,Math.max(0,value))/100)*circ;
  return (
    <div style={{position:'relative',width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{transition:'stroke-dashoffset 0.6s ease'}}/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <span style={{fontWeight:900,fontSize:size*0.2,color:textColor,lineHeight:1}}>{Math.round(value)}%</span>
        <span style={{fontSize:size*0.11,color:textColor,opacity:0.7,marginTop:1}}>done</span>
      </div>
    </div>
  );
}
