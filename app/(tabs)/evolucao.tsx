import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Polygon, Line, G, Circle } from 'react-native-svg';
import { Shield, Zap, TrendingUp, Heart, Swords, Brain, Trophy, Activity } from 'lucide-react-native';
import { Mascot } from '../../components/Mascot';

const { width } = Dimensions.get('window');
const stats = [82, 74, 91, 12, 60];

export default function CharacterSheetScreen() {
  return (
    <View style={styles.container}>
      {/* Header HUD Style */}
      <View style={styles.hudHeader}>
        <View style={styles.playerInfo}>
          <View style={styles.lvlCircle}>
            <Text style={styles.lvlText}>14</Text>
          </View>
          <View style={{ gap: 2 }}>
            <Text style={styles.headerLabel}>EVOLUÇÃO</Text>
            <Text style={styles.headerSub}>Sua jornada épica</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.avatarBtn}>
           <Text style={{fontSize: 24}}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. Level Progress Card (Sync with HTML) */}
        <View style={styles.levelCard}>
           <LinearGradient colors={['#1A1238', '#13102A']} style={StyleSheet.absoluteFill} />
           <View style={styles.levelHeader}>
              <View>
                 <Text style={styles.classLabel}>Guerreiro Capy</Text>
                 <Text style={styles.levelTitle}>Nível 14</Text>
              </View>
              <Mascot size={80} />
           </View>
           <View style={styles.xpTrackLarge}>
              <LinearGradient colors={[Colors.skyBlue, Colors.glowGreen]} start={{x:0, y:0}} end={{x:1, y:0}} style={[styles.xpFillLarge, { width: '75%' }]} />
           </View>
           <View style={styles.xpStats}>
              <Text style={styles.xpStatText}>18.450 / 25.000 XP</Text>
              <Text style={styles.xpStatText}>Faltam 6.550 para o Nv. 15</Text>
           </View>
        </View>

        {/* 2. Composition Cards (Grid) */}
        <View style={styles.gridRow}>
           <CompCard label="Peso Atual" val="78.5" unit="kg" trend="+0.5" color={Colors.skyBlue} />
           <CompCard label="Gordura Corporal" val="18.2" unit="%" trend="-0.4" color={Colors.glowGreen} />
        </View>
        <View style={styles.gridRow}>
           <CompCard label="Massa Magra" val="64.2" unit="kg" trend="+0.8" color={Colors.joyPink} />
           <CompCard label="Consistência" val="82" unit="%" trend="+5" color={Colors.sunGold} />
        </View>

        {/* 3. Radar Chart Attributes */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>ATRIBUTOS DO PERSONAGEM</Text>
        </View>
        <View style={styles.radarCard}>
          <View style={styles.glassInner}>
            <RadarChart data={stats} />
            <View style={styles.radarLabels}>
               <AttrItem label="FOR" color={Colors.sunGold} val="82" />
               <AttrItem label="VIT" color={Colors.glowGreen} val="74" />
               <AttrItem label="AGI" color={Colors.skyBlue} val="91" />
               <AttrItem label="FOC" color={Colors.joyPink} val="60" />
            </View>
          </View>
        </View>

        {/* 4. Consistency History (Grid 30 days) */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>CONSISTÊNCIA MENSAL</Text>
           <Text style={styles.viewLink}>Ver histórico total</Text>
        </View>
        <View style={styles.calendarCard}>
           <View style={styles.calGrid}>
              {Array.from({ length: 30 }).map((_, i) => (
                <View key={i} style={[styles.calDot, i < 18 ? { backgroundColor: Colors.glowGreen } : { backgroundColor: 'rgba(255,255,255,0.05)' }]} />
              ))}
           </View>
           <Text style={styles.calResult}>Parabéns! Você treinou 18 de 22 dias planejados.</Text>
        </View>

        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
}

function CompCard({ label, val, unit, trend, color }) {
  return (
    <View style={styles.compCard}>
      <View style={styles.glassInner}>
        <Text style={styles.compLabel}>{label}</Text>
        <View style={styles.compValRow}>
           <Text style={styles.compVal}>{val}</Text>
           <Text style={styles.compUnit}>{unit}</Text>
        </View>
        <View style={[styles.trendBadge, { backgroundColor: trend.includes('+') ? 'rgba(112,214,60,0.1)' : 'rgba(255,61,92,0.1)' }]}>
           <Text style={[styles.trendText, { color: trend.includes('+') ? Colors.glowGreen : '#FF3D5C' }]}>
             {trend.includes('+') ? '↑' : '↓'} {trend}
           </Text>
        </View>
      </View>
    </View>
  );
}

function AttrItem({ label, color, val }) {
  return (
    <View style={styles.attrItem}>
       <View style={[styles.attrDot, { backgroundColor: color }]} />
       <Text style={styles.attrLabel}>{label}: </Text>
       <Text style={styles.attrVal}>{val}</Text>
    </View>
  );
}

function RadarChart({ data }) {
  const size = 150;
  const center = size / 2;
  const radius = center * 0.7;
  const points = data.map((val, i) => {
    const angle = (i * 2 * Math.PI) / data.length - Math.PI / 2;
    const r = radius * (val / 100);
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });
  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <Svg width={size} height={size}>
      <Circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <Polygon points={polyPoints} fill="rgba(0,229,255,0.2)" stroke={Colors.skyBlue} strokeWidth="2" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 50 },
  hudHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
  playerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lvlCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.capyBrown, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.1)' },
  lvlText: { color: Colors.text, fontFamily: 'Fredoka_700Bold', fontSize: 18 },
  headerLabel: { color: Colors.text, fontSize: 15, fontFamily: 'Fredoka_700Bold' },
  headerSub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular' },
  avatarBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.cardLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.rim },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },
  
  levelCard: { height: 180, borderRadius: 32, overflow: 'hidden', padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(157,78,221,0.2)' },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  classLabel: { color: Colors.skyBlue, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },
  levelTitle: { color: 'white', fontSize: 24, fontFamily: 'Fredoka_700Bold' },
  xpTrackLarge: { height: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden', marginBottom: 12 },
  xpFillLarge: { height: '100%', borderRadius: 6 },
  xpStats: { flexDirection: 'row', justifyContent: 'space-between' },
  xpStatText: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_400Regular' },

  gridRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  compCard: { flex: 1, height: 120, borderRadius: 24, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  glassInner: { padding: 15, flex: 1 },
  compLabel: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 0.5 },
  compValRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 8 },
  compVal: { color: 'white', fontSize: 28, fontFamily: 'Fredoka_700Bold' },
  compUnit: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginLeft: 4 },
  trendBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  trendText: { fontSize: 10, fontFamily: 'Fredoka_700Bold' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
  sectionTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },
  viewLink: { color: Colors.skyBlue, fontSize: 10, fontFamily: 'Fredoka_700Bold' },

  radarCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 32, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  radarLabels: { gap: 8, marginLeft: 20 },
  attrItem: { flexDirection: 'row', alignItems: 'center' },
  attrDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  attrLabel: { color: 'white', fontSize: 13, fontFamily: 'Fredoka_700Bold' },
  attrVal: { color: Colors.textDim, fontSize: 13, fontFamily: 'Fredoka_400Regular' },

  calendarCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 32, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 15 },
  calDot: { width: (width - 120) / 7.5, height: 12, borderRadius: 3 },
  calResult: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', lineHeight: 18 },
});
