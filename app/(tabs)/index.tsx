import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Trophy, ChevronRight, Zap, Shield, Dumbbell, Flame } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Mascot } from '../../components/Mascot';

const { width } = Dimensions.get('window');

// ── Check-in Banner ────────────────────────────────────────────────────────
function CheckInBanner() {
  const [done, setDone] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.7)).current;
  const checkScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (done) return;
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.35, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.7, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, [done]);

  const handleCheckin = () => {
    Animated.spring(checkScale, { toValue: 1.2, friction: 3, useNativeDriver: true }).start(() => {
      Animated.spring(checkScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    });
    setDone(true);
  };

  if (done) {
    return (
      <View style={ci.doneBanner}>
        <LinearGradient colors={['#071A10', '#040C08']} style={StyleSheet.absoluteFill} />
        <View style={[ci.doneBannerBorder]} />
        <View style={ci.doneLeft}>
          <Text style={ci.doneTitle}>✅ Check-in Confirmado!</Text>
          <Text style={ci.doneSub}>+10 XP · Streak protegido · Missões desbloqueadas</Text>
        </View>
        <View style={ci.doneBadge}><Text style={ci.doneBadgeText}>🔥 47d</Text></View>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handleCheckin} activeOpacity={0.93} style={ci.banner}>
      <LinearGradient colors={['#0A2218', '#061610', '#040C08']} style={StyleSheet.absoluteFill} />
      <View style={ci.bannerBorder} />

      {/* Left: info */}
      <View style={ci.left}>
        <Text style={ci.tag}>📍 VOCÊ ESTÁ NA ACADEMIA?</Text>
        <Text style={ci.title}>Fazer Check-in</Text>
        <Text style={ci.sub}>Ativa o streak · +10 XP · Desbloqueia missões</Text>
        <View style={ci.rewardRow}>
          <View style={ci.rewardPill}><Text style={ci.rewardText}>🔥 Streak</Text></View>
          <View style={ci.rewardPill}><Text style={ci.rewardText}>⚡ +10 XP</Text></View>
          <View style={ci.rewardPill}><Text style={ci.rewardText}>🎯 Missões</Text></View>
        </View>
      </View>

      {/* Right: pulsing button */}
      <View style={ci.btnWrap}>
        <Animated.View style={[ci.pulsRing, { transform: [{ scale: pulse }], opacity: pulseOpacity }]} />
        <Animated.View style={[ci.btn, { transform: [{ scale: checkScale }] }]}>
          <LinearGradient colors={[Colors.success, '#059669']} style={[StyleSheet.absoluteFill, { borderRadius: 36 }]} />
          <Text style={ci.btnEmoji}>📍</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}
const ci = StyleSheet.create({
  banner: { borderRadius: 26, overflow: 'hidden', padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 18, borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)', minHeight: 120 },
  bannerBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 26, borderWidth: 1.5, borderColor: 'rgba(16,185,129,0.15)' },
  left: { flex: 1, marginRight: 16 },
  tag: { color: Colors.success, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, marginBottom: 5 },
  title: { color: Colors.text, fontSize: 22, fontFamily: 'Syne_700', marginBottom: 4 },
  sub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginBottom: 10 },
  rewardRow: { flexDirection: 'row', gap: 6 },
  rewardPill: { backgroundColor: Colors.successDim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  rewardText: { color: Colors.success, fontSize: 10, fontFamily: 'Fredoka_700Bold' },
  btnWrap: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  pulsRing: { position: 'absolute', width: 72, height: 72, borderRadius: 36, borderWidth: 2.5, borderColor: Colors.success },
  btn: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  btnEmoji: { fontSize: 28 },
  doneBanner: { borderRadius: 22, overflow: 'hidden', padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 18, borderWidth: 1, borderColor: Colors.successDim },
  doneBannerBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(16,185,129,0.15)' },
  doneLeft: { flex: 1 },
  doneTitle: { color: Colors.success, fontSize: 15, fontFamily: 'Syne_700', marginBottom: 3 },
  doneSub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular' },
  doneBadge: { backgroundColor: Colors.primaryDim, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  doneBadgeText: { color: Colors.primary, fontSize: 14, fontFamily: 'Syne_700' },
});

// ── Wellness Section ────────────────────────────────────────────────────────
function WellnessSection() {
  const GOAL_WATER = 8; // copos de 250ml
  const [water, setWater] = useState(3);
  const [sleep, setSleep] = useState<number | null>(null);
  const [supps, setSupps] = useState([false, false, false]);
  const [protein, setProtein] = useState(65);
  const PROTEIN_GOAL = 150;
  const SUPPS = ['Protéina 🥣', 'Creatina ⚡', 'Vitamina D ☀️'];
  const SLEEP_OPTS = [5, 6, 7, 8, 9];

  const toggleSupp = (i: number) => {
    const next = [...supps];
    next[i] = !next[i];
    setSupps(next);
  };

  const waterPct = water / GOAL_WATER;
  const waterColor = waterPct >= 1 ? Colors.success : waterPct >= 0.5 ? Colors.secondary : Colors.textDim;
  const sleepColor = !sleep ? Colors.textDim : sleep >= 7 ? Colors.success : sleep >= 6 ? Colors.gold : Colors.danger;
  const sleepLabel = !sleep ? '-- h' : sleep >= 8 ? 'Excelente' : sleep >= 7 ? 'Ótimo' : sleep >= 6 ? 'Regular' : 'Insuficiente';
  const suppsDone = supps.filter(Boolean).length;
  const proteinPct = Math.min(protein / PROTEIN_GOAL, 1);

  return (
    <View style={w.section}>
      <View style={w.header}>
        <Text style={w.title}>BEM-ESTAR DO DIA</Text>
        <View style={w.xpPill}><Text style={w.xpText}>+{(water === GOAL_WATER ? 15 : 0) + suppsDone * 5 + (sleep && sleep >= 7 ? 10 : 0)} XP</Text></View>
      </View>

      {/* Row 1: Água + Sono */}
      <View style={w.row}>

        {/* Água */}
        <View style={[w.card, { flex: 1.3 }]}>
          <LinearGradient colors={['#041824', '#020F18']} style={StyleSheet.absoluteFill} />
          <View style={w.cardTop}>
            <Text style={w.cardLabel}>💧 ÁGUA</Text>
            <Text style={[w.cardVal, { color: waterColor }]}>{water * 250}ml</Text>
          </View>
          {/* Glass dots */}
          <View style={w.glassDots}>
            {Array.from({ length: GOAL_WATER }).map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setWater(i + 1)} style={[w.glassDot, i < water && { backgroundColor: Colors.secondary }]} />
            ))}
          </View>
          <View style={w.waterActions}>
            <TouchableOpacity onPress={() => setWater(v => Math.max(0, v - 1))} style={w.waterBtn}><Text style={w.waterBtnText}>−</Text></TouchableOpacity>
            <Text style={[w.waterGoal, { color: waterColor }]}>{water}/{GOAL_WATER} copos</Text>
            <TouchableOpacity onPress={() => setWater(v => Math.min(GOAL_WATER, v + 1))} style={[w.waterBtn, { backgroundColor: Colors.secondaryDim }]}><Text style={[w.waterBtnText, { color: Colors.secondary }]}>+</Text></TouchableOpacity>
          </View>
          {water >= GOAL_WATER && <Text style={w.goalReached}>✅ Meta atingida! +15 XP</Text>}
        </View>

        {/* Sono */}
        <View style={[w.card, { flex: 1 }]}>
          <LinearGradient colors={['#0D0A20', '#080616']} style={StyleSheet.absoluteFill} />
          <Text style={w.cardLabel}>🌙 SONO</Text>
          <Text style={[w.sleepVal, { color: sleepColor }]}>{sleep ? `${sleep}h` : '--h'}</Text>
          <Text style={[w.sleepLabel, { color: sleepColor }]}>{sleepLabel}</Text>
          <View style={w.sleepBtns}>
            {SLEEP_OPTS.map(h => (
              <TouchableOpacity key={h} onPress={() => setSleep(h)} style={[w.sleepBtn, sleep === h && { backgroundColor: sleepColor }]}>
                <Text style={[w.sleepBtnText, sleep === h && { color: 'white' }]}>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Row 2: Suplementos */}
      <View style={w.card}>
        <LinearGradient colors={['#150A1C', '#0C0613']} style={StyleSheet.absoluteFill} />
        <View style={w.cardTop}>
          <Text style={w.cardLabel}>💊 SUPLEMENTOS</Text>
          <Text style={[w.cardVal, { color: suppsDone === 3 ? Colors.success : Colors.textDim }]}>{suppsDone}/3</Text>
        </View>
        <View style={w.suppRow}>
          {SUPPS.map((name, i) => (
            <TouchableOpacity key={i} onPress={() => toggleSupp(i)} style={[w.suppPill, supps[i] && w.suppPillDone]} activeOpacity={0.8}>
              <Text style={[w.suppText, supps[i] && { color: Colors.success }]}>{supps[i] ? '✓ ' : ''}{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Row 3: Proteína */}
      <View style={w.card}>
        <LinearGradient colors={['#1A0A06', '#100604']} style={StyleSheet.absoluteFill} />
        <View style={w.cardTop}>
          <Text style={w.cardLabel}>🥩 PROTEÍNA</Text>
          <Text style={[w.cardVal, { color: proteinPct >= 1 ? Colors.success : Colors.gold }]}>{protein}g<Text style={{ fontSize: 11, color: Colors.textDim }}>/{PROTEIN_GOAL}g</Text></Text>
        </View>
        <View style={w.protBar}><LinearGradient colors={[Colors.primary, Colors.gold]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[w.protFill, { width: `${proteinPct * 100}%` }]} /></View>
        <View style={w.protBtns}>
          {[20, 30, 40].map(g => (
            <TouchableOpacity key={g} onPress={() => setProtein(v => Math.min(PROTEIN_GOAL, v + g))} style={w.protBtn}>
              <Text style={w.protBtnText}>+{g}g</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setProtein(0)} style={[w.protBtn, { borderColor: Colors.dangerDim }]}><Text style={[w.protBtnText, { color: Colors.danger }]}>Reset</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const w = StyleSheet.create({
  section: { marginBottom: 22 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase' },
  xpPill: { backgroundColor: Colors.goldDim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)' },
  xpText: { color: Colors.gold, fontSize: 10, fontFamily: 'Fredoka_700Bold' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  card: { borderRadius: 22, overflow: 'hidden', padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardLabel: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5 },
  cardVal: { fontSize: 16, fontFamily: 'Syne_700' },
  glassDots: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 12 },
  glassDot: { width: 20, height: 20, borderRadius: 6, backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border },
  waterActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  waterBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  waterBtnText: { color: Colors.text, fontSize: 18, fontFamily: 'Syne_700', lineHeight: 22 },
  waterGoal: { fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  goalReached: { color: Colors.success, fontSize: 10, fontFamily: 'Fredoka_700Bold', marginTop: 8, textAlign: 'center' },
  sleepVal: { fontSize: 32, fontFamily: 'Syne_700', lineHeight: 36 },
  sleepLabel: { fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 0.5, marginBottom: 10 },
  sleepBtns: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  sleepBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border },
  sleepBtnText: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  suppRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  suppPill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border },
  suppPillDone: { backgroundColor: Colors.successDim, borderColor: 'rgba(16,185,129,0.3)' },
  suppText: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_700Bold' },
  protBar: { height: 6, backgroundColor: Colors.surfaceElevated, borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  protFill: { height: '100%', borderRadius: 3 },
  protBtns: { flexDirection: 'row', gap: 8 },
  protBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: Colors.surfaceElevated, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  protBtnText: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
});

// ── Circular Streak ──────────────────────────────────────────────────────

function CircularStreak({ streak }: { streak: number }) {
  const size = 160;
  const trackW = 9;
  const glowW = 20;
  const radius = (size - glowW) / 2;
  const circ = radius * 2 * Math.PI;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const milestones = [15, 30, 45, 60, 100, 180, 365];
  const next = milestones.find(m => m > streak) || 365;
  const prev = [...milestones].reverse().find(m => m <= streak) || 0;
  const progress = Math.min((streak - prev) / (next - prev), 1);
  const daysLeft = next - streak;
  useEffect(() => {
    Animated.timing(progressAnim, { toValue: progress, duration: 1400, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, []);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const dashOffset = progressAnim.interpolate({ inputRange: [0, 1], outputRange: [circ, 0] });
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          <Defs>
            <SvgGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={Colors.primary} />
              <Stop offset="55%" stopColor="#FF8C42" />
              <Stop offset="100%" stopColor={Colors.gold} />
            </SvgGradient>
            <SvgGradient id="gg" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={Colors.primary} stopOpacity="0.2" />
              <Stop offset="100%" stopColor={Colors.gold} stopOpacity="0.04" />
            </SvgGradient>
          </Defs>
          <Circle cx={size/2} cy={size/2} r={radius + trackW/2} stroke="url(#gg)" strokeWidth={glowW} fill="none" />
          <Circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth={trackW} fill="none" />
          <AnimatedCircle cx={size/2} cy={size/2} r={radius} stroke="url(#fg)" strokeWidth={trackW} strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round" fill="none" transform={`rotate(-90 ${size/2} ${size/2})`} />
        </Svg>
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={s.streakNum}>{streak}</Text>
          <Text style={s.streakLabel}>dias de fogo</Text>
        </View>
      </View>
      <View style={s.milestonePill}>
        <Trophy size={10} color={Colors.gold} />
        <Text style={s.milestoneText}>{daysLeft}d para {next}</Text>
      </View>
    </View>
  );
}

function FormScore({ score }: { score: number }) {
  const fillAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fillAnim, { toValue: score / 100, duration: 1200, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, []);
  const color = score >= 75 ? Colors.success : score >= 50 ? Colors.gold : Colors.danger;
  return (
    <View style={s.formCard}>
      <View style={s.formCardBorder} />
      <View style={s.formRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.formLabel}>FORMA DO DIA</Text>
          <Text style={[s.formScore, { color }]}>{score}<Text style={s.formScoreUnit}>/100</Text></Text>
          <Text style={s.formSub}>Consistência alta · Tendência de alta ↑</Text>
        </View>
        <View style={s.formRing}>
          <Text style={[s.formRingNum, { color }]}>{score}</Text>
          <Text style={{ color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 0.5 }}>pts</Text>
        </View>
      </View>
      <View style={s.streakShield}>
        <Shield size={13} color={Colors.secondary} />
        <Text style={s.shieldText}>Streak protegido · Treine hoje para manter os 47 dias</Text>
      </View>
    </View>
  );
}

function QuickAction({ icon, label, sub, gradient, onPress }: any) {
  const sc = useRef(new Animated.Value(1)).current;
  const tap = () => {
    Animated.sequence([
      Animated.timing(sc, { toValue: 0.93, duration: 70, useNativeDriver: true }),
      Animated.spring(sc, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    onPress?.();
  };
  return (
    <Animated.View style={[s.quickCard, { transform: [{ scale: sc }] }]}>
      <TouchableOpacity onPress={tap} activeOpacity={0.9} style={{ flex: 1 }}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 20 }]} />
        <View style={s.quickCardInner}>
          <Text style={s.quickCardEmoji}>{icon}</Text>
          <Text style={s.quickCardLabel}>{label}</Text>
          <Text style={s.quickCardSub}>{sub}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function TodayWorkout() {
  const muscles = ['🫁 Peito', '🦾 Tríceps', '💪 Ombro'];
  return (
    <View style={s.todayCard}>
      <View style={s.todayBorder} />
      <View style={s.todayTop}>
        <View style={{ flex: 1 }}>
          <Text style={s.todayTag}>TREINO RECOMENDADO HOJE</Text>
          <Text style={s.todayTitle}>Peito + Tríceps</Text>
          <View style={s.muscleRow}>
            {muscles.map((m, i) => (
              <View key={i} style={s.musclePill}><Text style={s.musclePillText}>{m}</Text></View>
            ))}
          </View>
        </View>
        <View style={s.todayStats}>
          <View style={s.todayStat}><Text style={s.todayStatVal}>4</Text><Text style={s.todayStatLbl}>exerc.</Text></View>
          <View style={s.todayStatDiv} />
          <View style={s.todayStat}><Text style={s.todayStatVal}>45</Text><Text style={s.todayStatLbl}>min</Text></View>
        </View>
      </View>
      <TouchableOpacity style={s.todayBtn} activeOpacity={0.88}>
        <LinearGradient colors={[Colors.primary, '#C2410C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[StyleSheet.absoluteFill, { borderRadius: 14 }]} />
        <Dumbbell size={15} color="white" />
        <Text style={s.todayBtnText}>INICIAR TREINO</Text>
        <ChevronRight size={15} color="white" />
      </TouchableOpacity>
    </View>
  );
}

function MissionRow({ icon, title, sub, xp, done }: any) {
  return (
    <View style={[s.missionRow, done && { opacity: 0.4 }]}>
      <View style={[s.missionIconBox, { backgroundColor: done ? Colors.successDim : Colors.primaryDim }]}>
        <Text style={{ fontSize: 17 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={[s.missionTitle, done && { textDecorationLine: 'line-through' }]}>{title}</Text>
        <Text style={s.missionSub}>{sub}</Text>
      </View>
      <View style={[s.xpTag, { backgroundColor: done ? Colors.successDim : Colors.goldDim }]}>
        <Text style={[s.xpTagText, { color: done ? Colors.success : Colors.gold }]}>{done ? '✓' : `+${xp}xp`}</Text>
      </View>
    </View>
  );
}

function LeagueRow({ pos, name, xp, streak, color, me }: any) {
  return (
    <View style={[s.leagueRow, me && s.leagueRowMe]}>
      <Text style={[s.leaguePos, { color }]}>{pos}</Text>
      <View style={s.leagueAvatarDot} />
      <Text style={[s.leagueName, me && { color: Colors.secondary }]}>{name}</Text>
      <Text style={s.leagueStreak}>🔥{streak}d</Text>
      <Text style={s.leagueXp}>{xp}xp</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [streak] = useState(47);
  const [xp] = useState(2450);
  const [gems] = useState(128);
  const DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

  // Stagger entrance animations
  const anims = useRef([0, 1, 2, 3, 4, 5].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(90, anims.map(a =>
      Animated.timing(a, { toValue: 1, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true })
    )).start();
  }, []);
  const entrance = (i: number) => ({
    opacity: anims[i],
    transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
  });

  return (
    <View style={s.container}>
      {/* Ambient background glow */}
      <View style={s.bgGlow1} />
      <View style={s.bgGlow2} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* Header */}
        <Animated.View style={[s.header, entrance(0)]}>
          <View>
            <Text style={s.greeting}>Bom dia, atleta 👋</Text>
            <Text style={s.userName}>Capivara</Text>
            <View style={s.userSubRow}>
              <View style={s.levelChip}>
                <Text style={s.levelChipText}>Nível 12</Text>
              </View>
              <View style={s.rankChip}>
                <Text style={s.rankChipText}>⚡ Dedicado</Text>
              </View>
            </View>
          </View>
          <View style={s.avatarWrap}>
            <View style={s.avatarRing}>
              <View style={s.avatar}><Text style={{ fontSize: 24 }}>🐹</Text></View>
            </View>
            <View style={s.levelDot}><Text style={s.levelDotText}>12</Text></View>
          </View>
        </Animated.View>

        {/* XP Bar */}
        <Animated.View style={[s.xpBarWrap, entrance(0)]}>
          <View style={s.xpInfo}>
            <Text style={s.xpLabel}>XP</Text>
            <Text style={s.xpCount}>{xp}<Text style={s.xpMax}> / 3000</Text></Text>
          </View>
          <View style={s.xpBarTrack}>
            <LinearGradient colors={[Colors.secondary, Colors.success, Colors.secondary + '88']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.xpBarFill, { width: `${(xp / 3000) * 100}%` }]} />
            <View style={[s.xpBarShine, { width: `${(xp / 3000) * 100}%` }]} />
          </View>
          <View style={s.gemPill}>
            <Text style={s.gemText}>💎 {gems}</Text>
          </View>
        </Animated.View>

        {/* ── CHECK-IN BANNER (principal) ── */}
        <Animated.View style={entrance(1)}>
          <CheckInBanner />
        </Animated.View>

        {/* Forma do Dia */}
        <Animated.View style={entrance(2)}>
          <FormScore score={82} />
        </Animated.View>

        {/* Fire Hero Card — Dias de Fogo */}
        <Animated.View style={[s.heroCard, entrance(2)]}>
          <LinearGradient colors={['#280D00', '#1A0830', '#07090F']} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />
          <View style={s.heroBorder} />
          <View style={s.heroGlow} />
          <View style={s.heroInner}>
            <CircularStreak streak={streak} />
            <View style={s.mascotWrap}>
              <Mascot size={120} mood="happy" />
            </View>
          </View>
        </Animated.View>

        {/* Treino de Hoje */}
        <Animated.View style={entrance(2)}>
          <TodayWorkout />
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={[s.quickRow, entrance(4)]}>
          <QuickAction icon="🔥" label="Treinar" sub="HOJE" gradient={[Colors.primary, '#C2410C']} />
          <QuickAction icon="⚔️" label="Duelo" sub="ATIVO" gradient={['#4C1D95', '#6D28D9']} />
          <QuickAction icon="🏆" label="Liga" sub="2D 14H" gradient={['#78350F', '#92400E']} />
          <QuickAction icon="💎" label="Loja" sub="128 GEMS" gradient={['#1E3A5F', '#1D4ED8']} />
        </Animated.View>

        {/* Week */}
        <Animated.View style={entrance(3)}>
          <View style={s.sectionHeader}>
            <View style={s.sectionTitleWrap}>
              <View style={[s.sectionAccent, { backgroundColor: Colors.secondary }]} />
              <Text style={s.sectionTitle}>ESTA SEMANA</Text>
            </View>
            <Text style={s.sectionSub}>4 de 7 treinos ✓</Text>
          </View>
          <View style={s.weekRow}>
            {DAYS.map((d, i) => (
              <View key={d} style={s.dayCol}>
                <View style={[s.dayDot,
                  i < 4 ? s.dayDone :
                  i === 4 ? s.dayToday :
                  s.dayFuture
                ]}>
                  <Text style={s.dayEmoji}>{['🫁','🦵','🦾','💪','·','',''][i]}</Text>
                </View>
                <Text style={[s.dayLabel, i === 4 && { color: Colors.secondary }]}>{d}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Bem-estar do Dia */}
        <Animated.View style={entrance(4)}>
          <WellnessSection />
        </Animated.View>

        {/* Missions */}
        <Animated.View style={entrance(4)}>
          <View style={s.sectionHeader}>
            <View style={s.sectionTitleWrap}>
              <View style={[s.sectionAccent, { backgroundColor: Colors.gold }]} />
              <Text style={s.sectionTitle}>MISSÕES</Text>
            </View>
            <Text style={s.sectionSub}>1/3 ✓</Text>
          </View>
          <View style={s.card}>
            <MissionRow icon="💪" title="Completar treino" sub="Peito + Tríceps" xp={50} />
            <View style={s.cardDivider} />
            <MissionRow icon="✅" title="Check-in matinal" sub="Até 10h" xp={10} done />
            <View style={s.cardDivider} />
            <MissionRow icon="👏" title="Reagir a colega" sub="Comunidade" xp={5} />
          </View>
        </Animated.View>

        {/* League */}
        <Animated.View style={entrance(5)}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>LIGA OURO 🥇</Text>
            <View style={s.timerTag}><Text style={s.timerText}>⏳ 2d 14h</Text></View>
          </View>
          <View style={s.card}>
            <LeagueRow pos={1} name="Maria R." xp={890} streak={89} color={Colors.gold} />
            <View style={s.cardDivider} />
            <LeagueRow pos={2} name="João P." xp={720} streak={51} color="#9CA3AF" />
            <View style={s.cardDivider} />
            <LeagueRow pos={4} name="Você ⚡" xp={580} streak={47} color={Colors.secondary} me />
          </View>
          <View style={s.duelBanner}>
            <LinearGradient colors={['#1A0622', '#0E0416']} style={StyleSheet.absoluteFill} />
            <View style={s.duelBannerBorder} />
            <View style={{ flex: 1 }}>
              <Text style={s.duelBannerLabel}>⚔️ DUELO ATIVO</Text>
              <Text style={s.duelBannerTitle}>João P. está 140xp à frente!</Text>
            </View>
            <TouchableOpacity style={s.duelBannerBtn}>
              <Text style={s.duelBannerBtnText}>Atacar</Text>
              <ChevronRight size={14} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 55 },
  bgGlow1: { position: 'absolute', top: -60, right: -80, width: 260, height: 260, borderRadius: 130, backgroundColor: Colors.primary, opacity: 0.04 },
  bgGlow2: { position: 'absolute', top: 180, left: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: Colors.secondary, opacity: 0.035 },
  content: { paddingHorizontal: 20, paddingBottom: 130 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  greeting: { color: Colors.textSub, fontSize: 13, fontFamily: 'Fredoka_400Regular', marginBottom: 2 },
  userName: { color: Colors.text, fontSize: 32, fontFamily: 'Syne_700', lineHeight: 36, letterSpacing: -0.5 },
  userSubRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  levelChip: { backgroundColor: Colors.purpleDim, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: Colors.purple + '30' },
  levelChipText: { color: Colors.purple, fontSize: 10, fontFamily: 'Fredoka_700Bold' },
  rankChip: { backgroundColor: Colors.secondaryDim, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: Colors.secondary + '30' },
  rankChipText: { color: Colors.secondary, fontSize: 10, fontFamily: 'Fredoka_700Bold' },
  avatarWrap: { position: 'relative' },
  avatarRing: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: Colors.primary + '50', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  levelDot: { position: 'absolute', bottom: -4, right: -4, backgroundColor: Colors.purple, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.background },
  levelDotText: { color: 'white', fontSize: 9, fontFamily: 'Fredoka_700Bold' },

  xpBarWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  xpInfo: { alignItems: 'center' },
  xpLabel: { color: Colors.textDim, fontSize: 7, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },
  xpCount: { color: Colors.secondary, fontSize: 12, fontFamily: 'Syne_700' },
  xpMax: { color: Colors.textDim, fontSize: 10 },
  xpBarTrack: { flex: 1, height: 6, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden', position: 'relative' },
  xpBarFill: { height: '100%', borderRadius: 3 },
  xpBarShine: { position: 'absolute', top: 0, left: 0, height: '50%', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3 },
  gemPill: { backgroundColor: Colors.goldDim, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: Colors.gold + '30' },
  gemText: { color: Colors.gold, fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  formCard: { borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginBottom: 16, overflow: 'hidden' },
  formCardBorder: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: Colors.purple, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  formRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 18, paddingBottom: 0 },
  formLabel: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase' },
  formScore: { fontSize: 42, fontFamily: 'Syne_700', lineHeight: 46, letterSpacing: -1 },
  formScoreUnit: { fontSize: 16, color: Colors.textDim, fontFamily: 'Syne_700' },
  formSub: { color: Colors.textSub, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginTop: 3 },
  formRing: { width: 72, height: 72, position: 'relative', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceElevated, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  formRingNum: { fontSize: 20, fontFamily: 'Syne_700' },
  streakShield: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.secondaryDim, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop: 14 },
  shieldText: { color: Colors.secondary, fontSize: 11, fontFamily: 'Fredoka_700Bold', flex: 1 },

  // Today workout card
  todayCard: { borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginBottom: 16, overflow: 'hidden' },
  todayBorder: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: Colors.secondary, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  todayTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, padding: 18, paddingBottom: 0 },
  todayTag: { color: Colors.secondary, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase' },
  todayTitle: { color: Colors.text, fontSize: 22, fontFamily: 'Syne_700', marginBottom: 10, letterSpacing: -0.3 },
  muscleRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  musclePill: { backgroundColor: Colors.surfaceElevated, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  musclePillText: { color: Colors.textSub, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  todayStats: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 },
  todayStat: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  todayStatVal: { color: Colors.text, fontSize: 22, fontFamily: 'Syne_700', letterSpacing: -0.5 },
  todayStatLbl: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  todayStatDiv: { width: 1, height: 32, backgroundColor: Colors.border },
  todayBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, overflow: 'hidden', margin: 14, borderRadius: 14 },
  todayBtnText: { color: 'white', fontSize: 14, fontFamily: 'Syne_700', letterSpacing: 0.5 },

  // Quick actions
  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  quickCard: { flex: 1, height: 100, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  quickCardInner: { flex: 1, padding: 14, justifyContent: 'space-between' },
  quickCardEmoji: { fontSize: 22 },
  quickCardLabel: { color: 'white', fontSize: 13, fontFamily: 'Syne_700', letterSpacing: -0.2 },
  quickCardSub: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },

  heroCard: { height: 200, borderRadius: 24, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: Colors.primary + '25' },
  heroBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 24, borderWidth: 1, borderColor: Colors.primary + '15' },
  heroGlow: { position: 'absolute', bottom: -40, left: '20%', width: 180, height: 180, borderRadius: 90, backgroundColor: Colors.primary, opacity: 0.12 },
  heroInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 28, paddingTop: 4 },
  streakNum: { color: Colors.text, fontSize: 72, fontFamily: 'Syne_700', lineHeight: 76, textAlign: 'center', letterSpacing: -2 },
  streakLabel: { color: Colors.textSub, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 2.5, textTransform: 'uppercase', textAlign: 'center', marginTop: 2 },
  milestonePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.goldDim, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: Colors.gold + '30' },
  milestoneText: { color: Colors.gold, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  mascotWrap: { marginBottom: -8 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionAccent: { width: 3, height: 14, borderRadius: 2 },
  sectionTitle: { color: Colors.textSub, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.8, textTransform: 'uppercase' },
  sectionSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_400Regular' },

  weekRow: { flexDirection: 'row', gap: 6, marginBottom: 22 },
  dayCol: { flex: 1, alignItems: 'center', gap: 6 },
  dayDot: { width: '100%', height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dayDone: { backgroundColor: Colors.primary + '20', borderWidth: 1.5, borderColor: Colors.primary + '40' },
  dayToday: { backgroundColor: Colors.secondary + '20', borderWidth: 2, borderColor: Colors.secondary },
  dayFuture: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  dayEmoji: { fontSize: 17 },
  dayLabel: { color: Colors.textDim, fontSize: 8.5, fontFamily: 'Fredoka_700Bold', textTransform: 'uppercase', letterSpacing: 0.5 },

  card: { backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 16 },
  cardDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 18 },

  missionRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 15 },
  missionIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  missionTitle: { color: Colors.text, fontSize: 15, fontFamily: 'Fredoka_700Bold' },
  missionSub: { color: Colors.textSub, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  xpTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  xpTagText: { fontSize: 12, fontFamily: 'Fredoka_700Bold' },

  leagueRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  leagueRowMe: { backgroundColor: Colors.secondaryDim },
  leagueAvatarDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textMuted, marginRight: 10 },
  leaguePos: { width: 24, fontSize: 15, fontFamily: 'Syne_700', marginRight: 8 },
  leagueName: { flex: 1, color: Colors.text, fontSize: 13, fontFamily: 'Fredoka_700Bold' },
  leagueStreak: { color: Colors.primary, fontSize: 11, fontFamily: 'Fredoka_700Bold', marginRight: 12 },
  leagueXp: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  timerTag: { backgroundColor: 'rgba(239,68,68,0.08)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(239,68,68,0.15)' },
  timerText: { color: Colors.danger, fontSize: 10, fontFamily: 'Fredoka_700Bold' },

  duelBanner: { borderRadius: 20, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: Colors.border },
  duelBannerBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(139,92,246,0.15)' },
  duelBannerLabel: { color: Colors.purple, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1, marginBottom: 3 },
  duelBannerTitle: { color: Colors.text, fontSize: 14, fontFamily: 'Syne_700' },
  duelBannerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.purpleDim, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, gap: 4 },
  duelBannerBtnText: { color: 'white', fontSize: 12, fontFamily: 'Fredoka_700Bold' },
});
