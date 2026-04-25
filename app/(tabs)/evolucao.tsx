import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Polygon, Circle } from 'react-native-svg';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { Mascot } from '../../components/Mascot';

const { width } = Dimensions.get('window');
const stats = [82, 74, 91, 60, 68];

function RadarChart({ data }: { data: number[] }) {
  const size = 160;
  const center = size / 2;
  const radius = center * 0.72;
  const points = data.map((val, i) => {
    const angle = (i * 2 * Math.PI) / data.length - Math.PI / 2;
    const r = radius * (val / 100);
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });
  const poly = points.map(p => `${p.x},${p.y}`).join(' ');
  const grid = [0.33, 0.66, 1].map(scale => {
    const gPts = data.map((_, i) => {
      const angle = (i * 2 * Math.PI) / data.length - Math.PI / 2;
      return { x: center + radius * scale * Math.cos(angle), y: center + radius * scale * Math.sin(angle) };
    });
    return gPts.map(p => `${p.x},${p.y}`).join(' ');
  });
  return (
    <Svg width={size} height={size}>
      {grid.map((pts, i) => <Polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />)}
      <Polygon points={poly} fill="rgba(61,139,255,0.15)" stroke={Colors.secondary} strokeWidth="2" />
      {points.map((p, i) => <Circle key={i} cx={p.x} cy={p.y} r="4" fill={Colors.secondary} />)}
    </Svg>
  );
}

function CompCard({ label, val, unit, trend, color }: any) {
  const up = trend.startsWith('+');
  return (
    <View style={s.compCard}>
      <Text style={s.compLabel}>{label}</Text>
      <View style={s.compValRow}>
        <Text style={[s.compVal, { color }]}>{val}</Text>
        <Text style={s.compUnit}>{unit}</Text>
      </View>
      <View style={[s.trendBadge, { backgroundColor: up ? Colors.successDim : 'rgba(239,68,68,0.1)' }]}>
        {up ? <TrendingUp size={11} color={Colors.success} /> : <TrendingDown size={11} color={Colors.danger} />}
        <Text style={[s.trendText, { color: up ? Colors.success : Colors.danger }]}>{trend}</Text>
      </View>
    </View>
  );
}

function AttrRow({ label, color, val }: any) {
  return (
    <View style={s.attrRow}>
      <View style={[s.attrDot, { backgroundColor: color }]} />
      <Text style={s.attrLabel}>{label}</Text>
      <Text style={[s.attrVal, { color }]}>{val}</Text>
    </View>
  );
}

export default function CharacterSheetScreen() {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.headerSub}>PERFIL</Text>
          <Text style={s.headerTitle}>Evolução</Text>
        </View>
        <TouchableOpacity style={s.avatarBtn}><Text style={{ fontSize: 22 }}>👤</Text></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* Level Card */}
        <View style={s.levelCard}>
          <LinearGradient colors={['#110E24', '#0A0818']} style={StyleSheet.absoluteFill} />
          <View style={s.levelCardBorder} />
          <View style={s.levelTop}>
            <View>
              <Text style={s.classTag}>GUERREIRO CAPY</Text>
              <Text style={s.levelNum}>Nível 14</Text>
              <Text style={s.xpLine}>18.450 / 25.000 XP • faltam 6.550</Text>
            </View>
            <Mascot size={80} />
          </View>
          <View style={s.xpTrack}>
            <LinearGradient colors={[Colors.secondary, Colors.success]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.xpFill, { width: '74%' }]} />
          </View>
        </View>

        {/* Composition Grid */}
        <Text style={s.sectionTitle}>COMPOSIÇÃO CORPORAL</Text>
        <View style={s.grid}>
          <CompCard label="Peso" val="78.5" unit="kg" trend="+0.5" color={Colors.secondary} />
          <CompCard label="Gordura" val="18.2" unit="%" trend="-0.4" color={Colors.success} />
        </View>
        <View style={s.grid}>
          <CompCard label="Massa Magra" val="64.2" unit="kg" trend="+0.8" color={Colors.purple} />
          <CompCard label="Consistência" val="82" unit="%" trend="+5" color={Colors.gold} />
        </View>

        {/* Radar Chart */}
        <Text style={[s.sectionTitle, { marginTop: 8 }]}>ATRIBUTOS</Text>
        <View style={s.radarCard}>
          <RadarChart data={stats} />
          <View style={s.attrList}>
            <AttrRow label="Força" color={Colors.gold} val="82" />
            <AttrRow label="Vitalidade" color={Colors.success} val="74" />
            <AttrRow label="Agilidade" color={Colors.secondary} val="91" />
            <AttrRow label="Foco" color={Colors.purple} val="60" />
            <AttrRow label="Resistência" color={Colors.primary} val="68" />
          </View>
        </View>

        {/* Consistency Calendar */}
        <View style={s.calHeader}>
          <Text style={s.sectionTitle}>CONSISTÊNCIA — 30 DIAS</Text>
          <Text style={s.calSub}>18 treinos</Text>
        </View>
        <View style={s.calCard}>
          <View style={s.calGrid}>
            {Array.from({ length: 30 }).map((_, i) => (
              <View key={i} style={[s.calDot,
                i < 18 ? { backgroundColor: Colors.success } :
                i === 18 ? { backgroundColor: Colors.secondary } :
                { backgroundColor: Colors.surface }
              ]} />
            ))}
          </View>
          <Text style={s.calNote}>Parabéns! Você treinou 18 de 22 dias planejados. 🎯</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 55 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  headerSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5 },
  headerTitle: { color: Colors.text, fontSize: 26, fontFamily: 'Syne_700', lineHeight: 30 },
  avatarBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  content: { paddingHorizontal: 20, paddingBottom: 110 },

  levelCard: { borderRadius: 28, overflow: 'hidden', padding: 22, marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  levelCardBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(139,92,246,0.15)' },
  levelTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  classTag: { color: Colors.purple, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, marginBottom: 4 },
  levelNum: { color: Colors.text, fontSize: 28, fontFamily: 'Syne_700' },
  xpLine: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 4 },
  xpTrack: { height: 6, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 3 },

  sectionTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },

  grid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  compCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: Colors.border },
  compLabel: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 0.5 },
  compValRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 8 },
  compVal: { fontSize: 30, fontFamily: 'Syne_700' },
  compUnit: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginLeft: 4 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  trendText: { fontSize: 10, fontFamily: 'Fredoka_700Bold' },

  radarCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 24, borderWidth: 1, borderColor: Colors.border, padding: 20, marginBottom: 24, gap: 16 },
  attrList: { flex: 1, gap: 10 },
  attrRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  attrDot: { width: 7, height: 7, borderRadius: 4 },
  attrLabel: { flex: 1, color: Colors.text, fontSize: 12, fontFamily: 'Fredoka_700Bold' },
  attrVal: { fontSize: 13, fontFamily: 'Syne_700' },

  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_400Regular' },
  calCard: { backgroundColor: Colors.surface, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: Colors.border },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 },
  calDot: { width: (width - 120) / 8, height: 14, borderRadius: 4 },
  calNote: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', lineHeight: 18 },
});
