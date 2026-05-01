import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Polygon, Circle, Polyline } from 'react-native-svg';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react-native';
import { Mascot } from '../../components/Mascot';

const { width } = Dimensions.get('window');
const stats = [82, 74, 91, 60, 68];

// ── Sparkline mini chart ───────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const W = 52, H = 22;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const [lx, ly] = pts.split(' ').pop()!.split(',').map(Number);
  return (
    <Svg width={W} height={H}>
      <Polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <Circle cx={lx} cy={ly} r="2.5" fill={color} />
    </Svg>
  );
}

// ── Radar chart ────────────────────────────────────────────────────────────
function RadarChart({ data }: { data: number[] }) {
  const size = 160, center = size / 2, radius = center * 0.72;
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
      <Polygon points={poly} fill="rgba(61,139,255,0.12)" stroke={Colors.secondary} strokeWidth="2" />
      {points.map((p, i) => <Circle key={i} cx={p.x} cy={p.y} r="4" fill={Colors.secondary} />)}
    </Svg>
  );
}

// ── Composition card with sparkline ────────────────────────────────────────
function CompCard({ label, val, unit, trend, color, spark }: any) {
  const up = !trend.startsWith('-');
  return (
    <View style={s.compCard}>
      <Text style={s.compLabel}>{label}</Text>
      <View style={s.compValRow}>
        <Text style={[s.compVal, { color }]}>{val}</Text>
        <Text style={s.compUnit}>{unit}</Text>
      </View>
      <View style={s.compBottom}>
        <View style={[s.trendBadge, { backgroundColor: up ? Colors.successDim : 'rgba(239,68,68,0.1)' }]}>
          {up ? <TrendingUp size={10} color={Colors.success} /> : <TrendingDown size={10} color={Colors.danger} />}
          <Text style={[s.trendText, { color: up ? Colors.success : Colors.danger }]}>{trend}</Text>
        </View>
        <Sparkline data={spark} color={color} />
      </View>
    </View>
  );
}

// ── Attribute row ──────────────────────────────────────────────────────────
function AttrRow({ label, color, val }: any) {
  const barW = (val / 100) * 80;
  return (
    <View style={s.attrRow}>
      <View style={[s.attrDot, { backgroundColor: color }]} />
      <Text style={s.attrLabel}>{label}</Text>
      <View style={s.attrBarTrack}>
        <View style={[s.attrBarFill, { width: barW, backgroundColor: color }]} />
      </View>
      <Text style={[s.attrVal, { color }]}>{val}</Text>
    </View>
  );
}

// ── Personal record row ────────────────────────────────────────────────────
function PRRow({ icon, exercise, weight, date, isNew }: any) {
  return (
    <View style={s.prRow}>
      <View style={s.prIconBox}><Text style={{ fontSize: 18 }}>{icon}</Text></View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={s.prExercise}>{exercise}</Text>
        <Text style={s.prDate}>{date}</Text>
      </View>
      <View style={s.prWeightWrap}>
        <Text style={s.prWeight}>{weight}</Text>
        {isNew && <View style={s.prNewTag}><Text style={s.prNewText}>PR</Text></View>}
      </View>
    </View>
  );
}

// ── Goals Section ───────────────────────────────────────────────────────────
function GoalBar({ pct, color }: { pct: number; color: string }) {
  const safe = Math.min(Math.max(pct, 0), 1);
  return (
    <View style={g.barWrap}>
      <View style={g.barTrack}>
        <LinearGradient colors={[color + 'CC', color + '55']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[g.barFill, { width: `${safe * 100}%` }]} />
      </View>
      <Text style={[g.barPct, { color }]}>{Math.round(safe * 100)}%</Text>
    </View>
  );
}

function GoalsSection() {
  // Pre-configured from onboarding: objetivo = Emagrecer
  const [currentWeight, setCurrentWeight] = useState(78.5);
  const targetWeight = 73.0;
  const initialWeight = 80.0;
  const currentFat = 18.2; const targetFat = 14.0;
  const currentStreak = 47; const streakGoal = 60;
  const currentWeekly = 4; const weeklyGoal = 5;
  const [showLog, setShowLog] = useState(false);
  const [logInput, setLogInput] = useState('');

  const weightDiff = Math.abs(currentWeight - targetWeight);
  const weightPct = Math.abs(initialWeight - currentWeight) / Math.abs(initialWeight - targetWeight);
  const fatPct = (19.0 - currentFat) / (19.0 - targetFat);

  const logWeight = () => {
    const val = parseFloat(logInput);
    if (!isNaN(val) && val > 30 && val < 250) setCurrentWeight(val);
    setLogInput(''); setShowLog(false);
  };

  return (
    <View style={g.section}>
      {/* Header */}
      <View style={g.header}>
        <Text style={g.title}>METAS PESSOAIS</Text>
        <View style={g.objBadge}>
          <Text style={g.objEmoji}>🔥</Text>
          <Text style={g.objLabel}>Emagrecer</Text>
        </View>
      </View>

      {/* Peso */}
      <View style={g.card}>
        <LinearGradient colors={['#1A0808', '#0E0404']} style={StyleSheet.absoluteFill} />
        <View style={g.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={g.cardLabel}>⚖️ META DE PESO</Text>
            <Text style={g.cardMain}>{currentWeight} kg</Text>
            <Text style={[g.cardSub, { color: Colors.danger }]}>
              {currentWeight <= targetWeight ? '✅ Meta atingida!' : `Faltam ${weightDiff.toFixed(1)} kg para ${targetWeight} kg`}
            </Text>
          </View>
          <View style={g.targetBox}>
            <Text style={g.targetLabel}>ALVO</Text>
            <Text style={[g.targetVal, { color: Colors.danger }]}>{targetWeight}</Text>
            <Text style={g.targetUnit}>kg</Text>
          </View>
        </View>
        <GoalBar pct={weightPct} color={Colors.danger} />
        <View style={g.statsRow}>
          <View style={g.stat}>
            <Text style={g.statVal}>-{Math.abs(initialWeight - currentWeight).toFixed(1)} kg</Text>
            <Text style={g.statLabel}>perdidos</Text>
          </View>
          <View style={g.statDiv} />
          <View style={g.stat}>
            <Text style={g.statVal}>{weightDiff.toFixed(1)} kg</Text>
            <Text style={g.statLabel}>restando</Text>
          </View>
          <View style={g.statDiv} />
          <View style={g.stat}>
            <Text style={g.statVal}>~{Math.ceil(weightDiff / 0.5)} sem</Text>
            <Text style={g.statLabel}>estimado</Text>
          </View>
          <TouchableOpacity onPress={() => setShowLog(true)} style={g.logBtn}>
            <Text style={g.logBtnText}>+ Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Gordura */}
      <View style={g.card}>
        <LinearGradient colors={['#131006', '#0C0B04']} style={StyleSheet.absoluteFill} />
        <View style={g.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={g.cardLabel}>📊 GORDURA CORPORAL</Text>
            <Text style={g.cardMain}>{currentFat}%</Text>
            <Text style={[g.cardSub, { color: Colors.gold }]}>
              Faltam {(currentFat - targetFat).toFixed(1)}% para {targetFat}%
            </Text>
          </View>
          <View style={g.targetBox}>
            <Text style={g.targetLabel}>ALVO</Text>
            <Text style={[g.targetVal, { color: Colors.gold }]}>{targetFat}</Text>
            <Text style={g.targetUnit}>%</Text>
          </View>
        </View>
        <GoalBar pct={fatPct} color={Colors.gold} />
      </View>

      {/* Streak + Consistência */}
      <View style={g.smallRow}>
        <View style={[g.smallCard, { flex: 1 }]}>
          <LinearGradient colors={['#180800', '#0E0500']} style={StyleSheet.absoluteFill} />
          <Text style={g.cardLabel}>🔥 STREAK META</Text>
          <Text style={g.smallVal}>{currentStreak}<Text style={g.smallUnit}>/{streakGoal}d</Text></Text>
          <GoalBar pct={currentStreak / streakGoal} color={Colors.primary} />
          <Text style={[g.smallSub, { color: Colors.primary }]}>Faltam {streakGoal - currentStreak} dias</Text>
        </View>
        <View style={[g.smallCard, { flex: 1 }]}>
          <LinearGradient colors={['#0A1810', '#050F08']} style={StyleSheet.absoluteFill} />
          <Text style={g.cardLabel}>📅 CONSISTÊNCIA</Text>
          <Text style={g.smallVal}>{currentWeekly}<Text style={g.smallUnit}>/{weeklyGoal}x/sem</Text></Text>
          <GoalBar pct={currentWeekly / weeklyGoal} color={Colors.success} />
          <Text style={[g.smallSub, { color: Colors.success }]}>{weeklyGoal - currentWeekly} treino restando</Text>
        </View>
      </View>

      {/* Modal registrar peso */}
      <Modal visible={showLog} transparent animationType="fade">
        <View style={g.modalOverlay}>
          <View style={g.modalCard}>
            <LinearGradient colors={['#161024', '#0E0A1A']} style={StyleSheet.absoluteFill} />
            <Text style={g.modalTitle}>Registrar Peso</Text>
            <Text style={[g.cardLabel, { marginBottom: 16, letterSpacing: 0 }]}>Informe seu peso atual em kg</Text>
            <TextInput style={g.modalInput} value={logInput} onChangeText={setLogInput}
              keyboardType="decimal-pad" placeholder="Ex: 77.5" placeholderTextColor={Colors.textDim} autoFocus />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => setShowLog(false)} style={g.modalCancel}>
                <Text style={{ color: Colors.textDim, fontSize: 13, fontFamily: 'Fredoka_700Bold' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={logWeight} style={g.modalSave}>
                <LinearGradient colors={[Colors.danger, '#B91C1C']} style={[StyleSheet.absoluteFill, { borderRadius: 14 }]} />
                <Text style={{ color: 'white', fontSize: 13, fontFamily: 'Syne_700' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const g = StyleSheet.create({
  section: { marginBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase' },
  objBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(239,68,68,0.12)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)' },
  objEmoji: { fontSize: 12 },
  objLabel: { color: Colors.danger, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  card: { borderRadius: 24, overflow: 'hidden', padding: 18, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  cardLabel: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, marginBottom: 4 },
  cardMain: { color: Colors.text, fontSize: 30, fontFamily: 'Syne_700', lineHeight: 34 },
  cardSub: { fontSize: 11, fontFamily: 'Fredoka_700Bold', marginTop: 4 },
  targetBox: { alignItems: 'center', backgroundColor: Colors.surfaceElevated, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: Colors.border, minWidth: 64 },
  targetLabel: { color: Colors.textDim, fontSize: 8, fontFamily: 'Fredoka_700Bold', letterSpacing: 1, marginBottom: 2 },
  targetVal: { fontSize: 22, fontFamily: 'Syne_700' },
  targetUnit: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_400Regular', marginTop: 1 },
  barWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  barTrack: { flex: 1, height: 6, backgroundColor: Colors.surfaceElevated, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  barPct: { fontSize: 11, fontFamily: 'Syne_700', width: 34, textAlign: 'right' },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stat: { alignItems: 'center' },
  statVal: { color: Colors.text, fontSize: 13, fontFamily: 'Syne_700' },
  statLabel: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_400Regular' },
  statDiv: { width: 1, height: 26, backgroundColor: Colors.border },
  logBtn: { marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(239,68,68,0.4)' },
  logBtnText: { color: Colors.danger, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  smallRow: { flexDirection: 'row', gap: 10 },
  smallCard: { borderRadius: 22, overflow: 'hidden', padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  smallVal: { color: Colors.text, fontSize: 24, fontFamily: 'Syne_700', marginBottom: 4, marginTop: 6 },
  smallUnit: { fontSize: 12, color: Colors.textDim },
  smallSub: { fontSize: 10, fontFamily: 'Fredoka_700Bold', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', alignItems: 'center', justifyContent: 'center', padding: 30 },
  modalCard: { width: '100%', borderRadius: 28, overflow: 'hidden', padding: 24, borderWidth: 1, borderColor: Colors.border },
  modalTitle: { color: Colors.text, fontSize: 22, fontFamily: 'Syne_700', marginBottom: 6 },
  modalInput: { backgroundColor: Colors.surfaceElevated, borderRadius: 16, padding: 16, color: Colors.text, fontSize: 22, fontFamily: 'Syne_700', borderWidth: 1, borderColor: Colors.borderStrong, marginBottom: 16, textAlign: 'center' },
  modalCancel: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: Colors.surface, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  modalSave: { flex: 1, paddingVertical: 14, borderRadius: 14, overflow: 'hidden', alignItems: 'center' },
});

// ── Main Screen ────────────────────────────────────────────────────────────
export default function CharacterSheetScreen() {
  const spark = {
    peso: [78.1, 78.3, 77.9, 78.0, 78.4, 78.5, 78.5],
    gordura: [18.9, 18.7, 18.6, 18.5, 18.3, 18.2, 18.2],
    massa: [63.2, 63.5, 63.6, 63.8, 63.9, 64.1, 64.2],
    consist: [70, 72, 75, 76, 78, 80, 82],
  };

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
          <LinearGradient colors={['#100E20', '#08061A']} style={StyleSheet.absoluteFill} />
          <View style={s.levelCardBorder} />
          <View style={s.levelTop}>
            <View style={{ flex: 1 }}>
              <Text style={s.classTag}>GUERREIRO CAPY · LVL 14</Text>
              <Text style={s.levelNum}>Nível 14</Text>
              <Text style={s.xpLine}>18.450 XP · faltam 6.550 para Nv. 15</Text>
            </View>
            <Mascot size={76} />
          </View>
          <View style={s.xpBarRow}>
            <View style={s.xpTrack}>
              <LinearGradient colors={[Colors.volt, Colors.ice]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.xpFill, { width: '74%' }]} />
            </View>
            <Text style={s.xpPct}>74%</Text>
          </View>
          <View style={s.levelStats}>
            <View style={s.levelStatItem}>
              <Text style={s.levelStatVal}>47</Text>
              <Text style={s.levelStatLabel}>streak</Text>
            </View>
            <View style={s.levelStatDivider} />
            <View style={s.levelStatItem}>
              <Text style={s.levelStatVal}>182</Text>
              <Text style={s.levelStatLabel}>treinos</Text>
            </View>
            <View style={s.levelStatDivider} />
            <View style={s.levelStatItem}>
              <Text style={s.levelStatVal}>2.4k</Text>
              <Text style={s.levelStatLabel}>XP semana</Text>
            </View>
          </View>
        </View>

        {/* Metas Pessoais */}
        <GoalsSection />

        {/* Composition Grid with Sparklines */}
        <Text style={s.sectionTitle}>COMPOSIÇÃO CORPORAL</Text>
        <View style={s.grid}>
          <CompCard label="Peso" val="78.5" unit="kg" trend="+0.5" color={Colors.secondary} spark={spark.peso} />
          <CompCard label="Gordura" val="18.2" unit="%" trend="-0.4" color={Colors.success} spark={spark.gordura} />
        </View>
        <View style={s.grid}>
          <CompCard label="Massa Magra" val="64.2" unit="kg" trend="+0.8" color={Colors.purple} spark={spark.massa} />
          <CompCard label="Consistência" val="82" unit="%" trend="+5" color={Colors.gold} spark={spark.consist} />
        </View>

        {/* Personal Records */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>RECORDES PESSOAIS</Text>
          <TouchableOpacity style={s.seeAllBtn}>
            <Text style={s.seeAllText}>Ver todos</Text>
            <ChevronRight size={12} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
        <View style={s.card}>
          <PRRow icon="🏋️" exercise="Supino Reto" weight="70 kg" date="15 Abr" isNew />
          <View style={s.cardDivider} />
          <PRRow icon="🦵" exercise="Agachamento Livre" weight="90 kg" date="10 Abr" />
          <View style={s.cardDivider} />
          <PRRow icon="💪" exercise="Terra" weight="120 kg" date="8 Abr" />
        </View>

        {/* Attributes */}
        <Text style={s.sectionTitle}>ATRIBUTOS DO PERSONAGEM</Text>
        <View style={s.radarCard}>
          <RadarChart data={stats} />
          <View style={s.attrList}>
            <AttrRow label="Força" color={Colors.gold} val={82} />
            <AttrRow label="Vitalidade" color={Colors.success} val={74} />
            <AttrRow label="Agilidade" color={Colors.secondary} val={91} />
            <AttrRow label="Foco" color={Colors.purple} val={60} />
            <AttrRow label="Resistência" color={Colors.primary} val={68} />
          </View>
        </View>

        {/* Consistency Calendar */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>CONSISTÊNCIA — 30 DIAS</Text>
          <Text style={s.calSub}>18 treinos</Text>
        </View>
        <View style={s.calCard}>
          <View style={s.calGrid}>
            {Array.from({ length: 30 }).map((_, i) => (
              <View key={i} style={[s.calDot,
                i < 18 ? { backgroundColor: Colors.success } :
                i === 18 ? { backgroundColor: Colors.secondary, borderWidth: 1.5, borderColor: Colors.secondary } :
                { backgroundColor: Colors.surface }
              ]} />
            ))}
          </View>
          <View style={s.calLegend}>
            <View style={[s.calLegDot, { backgroundColor: Colors.success }]} />
            <Text style={s.calLegText}>Treino feito</Text>
            <View style={[s.calLegDot, { backgroundColor: Colors.secondary }]} />
            <Text style={s.calLegText}>Hoje</Text>
            <View style={[s.calLegDot, { backgroundColor: Colors.surface }]} />
            <Text style={s.calLegText}>Sem treino</Text>
          </View>
          <Text style={s.calNote}>Parabéns! 18 de 22 dias planejados — consistência de 82% 🎯</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 55 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  headerSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5 },
  headerTitle: { color: Colors.text, fontSize: 30, fontFamily: 'Syne_700', lineHeight: 34, letterSpacing: -0.5 },
  avatarBtn: { width: 46, height: 46, borderRadius: 16, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  content: { paddingHorizontal: 20, paddingBottom: 120 },

  levelCard: { borderRadius: 30, overflow: 'hidden', padding: 22, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(168,85,247,0.22)', shadowColor: Colors.purple, shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: { width: 0, height: 6 } },
  levelCardBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 30, borderWidth: 1.5, borderColor: 'rgba(168,85,247,0.14)' },
  levelTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  classTag: { color: Colors.purple, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, marginBottom: 4 },
  levelNum: { color: Colors.text, fontSize: 32, fontFamily: 'Syne_700', letterSpacing: -0.5 },
  xpLine: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 3 },
  xpBarRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  xpTrack: { flex: 1, height: 8, backgroundColor: Colors.surfaceElevated, borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  xpFill: { height: '100%', borderRadius: 4 },
  xpPct: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold' },
  levelStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 14 },
  levelStatItem: { flex: 1, alignItems: 'center' },
  levelStatVal: { color: Colors.text, fontSize: 22, fontFamily: 'Syne_700' },
  levelStatLabel: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  levelStatDivider: { width: 1, backgroundColor: Colors.border },

  sectionTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { color: Colors.secondary, fontSize: 10, fontFamily: 'Fredoka_700Bold' },

  grid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  compCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: Colors.border },
  compLabel: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 0.5, textTransform: 'uppercase' },
  compValRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 6 },
  compVal: { fontSize: 28, fontFamily: 'Syne_700' },
  compUnit: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginLeft: 3 },
  compBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7 },
  trendText: { fontSize: 9, fontFamily: 'Fredoka_700Bold' },

  card: { backgroundColor: Colors.surface, borderRadius: 24, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 24 },
  cardDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
  prRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  prIconBox: { width: 40, height: 40, borderRadius: 13, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  prExercise: { color: Colors.text, fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  prDate: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  prWeightWrap: { alignItems: 'flex-end', gap: 4 },
  prWeight: { color: Colors.text, fontSize: 16, fontFamily: 'Syne_700' },
  prNewTag: { backgroundColor: Colors.primaryDim, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  prNewText: { color: Colors.primary, fontSize: 9, fontFamily: 'Fredoka_700Bold' },

  radarCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 24, borderWidth: 1, borderColor: Colors.border, padding: 18, marginBottom: 24, gap: 12 },
  attrList: { flex: 1, gap: 10 },
  attrRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  attrDot: { width: 7, height: 7, borderRadius: 4 },
  attrLabel: { color: Colors.text, fontSize: 11, fontFamily: 'Fredoka_700Bold', width: 72 },
  attrBarTrack: { flex: 1, height: 4, backgroundColor: Colors.surfaceElevated, borderRadius: 2, overflow: 'hidden' },
  attrBarFill: { height: '100%', borderRadius: 2 },
  attrVal: { fontSize: 12, fontFamily: 'Syne_700', width: 28, textAlign: 'right' },

  calSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_400Regular' },
  calCard: { backgroundColor: Colors.surface, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: Colors.border },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  calDot: { width: (width - 120) / 8, height: 13, borderRadius: 4 },
  calLegend: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  calLegDot: { width: 8, height: 8, borderRadius: 2 },
  calLegText: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_400Regular' },
  calNote: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', lineHeight: 18, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
});
