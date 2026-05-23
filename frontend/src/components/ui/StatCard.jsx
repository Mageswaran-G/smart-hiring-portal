// StatCard.jsx — reusable stat card with icon, value, label, sparkline

import Card from '@/components/ui/Card';
import { COLORS } from '../../theme/adminTheme';
import { Sparkline } from '@/components/ui/charts';

const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  color = COLORS.primary,
  trend = [],
  isMobile = false,
}) => (
  <Card style={{ display:'flex', flexDirection:'column', gap:4 }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 14,
    }}>
      <div>
        <p style={{ fontSize:12, color:COLORS.gray500,
          margin:'0 0 5px', fontWeight:600 }}>{label}</p>
        <p style={{ fontSize:isMobile?28:36, fontWeight:900,
          color:COLORS.gray900, margin:0,
          lineHeight:1, letterSpacing:'-1px' }}>{value}</p>
        <p style={{ fontSize:11, color:COLORS.gray400,
          margin:'4px 0 0' }}>{sub}</p>
      </div>
      {Icon && (
        <div style={{
          width:44, height:44, borderRadius:13,
          background: `${color}12`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon size={22} color={color} />
        </div>
      )}
    </div>
    <Sparkline data={trend} color={color} width={108} height={38} />
  </Card>
);

export default StatCard;
