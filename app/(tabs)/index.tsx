import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Bell, Trophy, ArrowRight, ChevronRight, Zap, Star } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Mascot } from '../../components/Mascot';

const { width } = Dimensions.get('window');

// ─── Circular Streak HUD ───────────────────────────────────────────────────
function CircularStreak({ streak }: { streak: number }) {
  const size = 176;
  const trackWidth = 10;
  const glowWidth = 22;
  const radius = (size - glowWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const milestones = [15, 30, 45, 60, 100, 180, 365];
  const next = milestones.find(m => m > streak) || 365;
  const prev = [...milestones].reverse().find(m => m <= streak) || 0;
  const progress = Math.min((streak - prev) / (next - prev), 1);
  const daysLeft = next - streak;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const dashOffset = progressAnim.interpolate({ inputRange: [0, 1], outputRange: [circumference, 0] });

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          <Defs>
            <SvgGradient id="fireG" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={Colors.primary} />
              <Stop offset="55%" stopColor="#FF8C42" />
              <Stop offset="100%" stopColor={Colors.gold} />
            </SvgGradient>
            <SvgGradient id="glowG" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={Colors.primary} stopOpacity="0.18" />
              <Stop offset="100%" stopColor={Colors.gold} stopOpacity="0.04" />
            </SvgGradient>
          </Defs>
          {/* Outer ambient glow */}
          <Circle cx={size / 2} cy={size / 2} r={radius + trackWidth / 2} stroke="url(#glowG)" strokeWidth={glowWidth} fill="none" />
          {/* Background track */}
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth={trackWidth} fill="none" />
          {/* Progress arc */}
          <AnimatedCircle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="url(#fireG)"
            strokeWidth={trackWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={s.streakNum}>{streak}</Text>
          <Text style={s.streakLabel}>dias de fogo</Text>
        </View>
      </View>
      <View style={s.milestonePill}>
        <Trophy size={11} color={Colors.gold} />
        <Text style={s.milestoneText}>{daysLeft}d para {next} dias</Text>
      </View>
    </View>
  );
}

// ─── Helper Components ─────────────────────────────────────────────────────
function StatBadge({ icon, value, label, color }: any) {
  return (
    <View style={s.statBadge}>
      {icon}
      <Text style={[s.statValue, { color }]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function MissionRow({ icon, title, sub, xp, done }: any) {
  return (
    <View style={[s.missionRow, done && { opacity: 0.45 }]}>
      <View style={[s.missionIconBox, { backgroundColor: done ? Colors.successDim : Colors.primaryDim }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={s.missionTitle}>{title}</Text>
        <Text style={s.missionSub}>{sub}</Text>
      </View>
      <View style={[s.xpTag, { backgroundColor: done ? Colors.successDim : Colors.goldDim }]}>
        <Text style={[s.xpTagText, { color: done ? Colors.success : Colors.gold }]}>+{xp}xp</Text>
      </View>
    </View>
  );
}

function LeagueRow({ pos, name, xp, streak, color, me }: any) {
  return (
    <View style={[s.leagueRow, me && s.leagueRowMe]}>
      <Text style={[s.leaguePos, { color }]}>{pos}</Text>
      <Text style={[s.leagueName, me && { color: Colors.secondary }]}>{name}</Text>
      <Text style={s.leagueStreak}>🔥{streak}d</Text>
      <Text style={s.leagueXp}>{xp}xp</Text>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [streak] = useState(47);
  const [xp] = useState(2450);
  const [gems] = useState(128);

  const DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Bom dia 👋</Text>
            <Text style={s.userName}>Capivara</Text>
          </View>
          <View style={s.avatarWrap}>
            <View style={s.avatar}><Text style={{ fontSize: 22 }}>🐹</Text></View>
            <View style={s.levelDot}><Text style={s.levelDotText}>12</Text></View>
          </View>
        </View>

        {/* ── XP bar ── */}
        <View style={s.xpBarWrap}>
          <View style={s.xpBarTrack}>
            <LinearGradient colors={[Colors.secondary, Colors.success]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.xpBarFill, { width: `${(xp / 3000) * 100}%` }]} />
          </View>
          <Text style={s.xpText}>{xp} / 3000 XP</Text>
        </View>

        {/* ── Fire Hero Card ── */}
        <View style={s.heroCard}>
          <LinearGradient colors={['#1C0B02', '#110520', '#07090F']} style={StyleSheet.absoluteFill} />
          <View style={s.heroBorder} />
          <View style={s.heroInner}>
            <CircularStreak streak={streak} />
            <View style={s.mascotWrap}>
              <Mascot size={130} mood="happy" />
            </View>
          </View>
        </View>

        {/* ── Stat Badges ── */}
        <View style={s.statsRow}>
          <StatBadge icon={<Text style={{ fontSize: 14 }}>🔥</Text>} value={streak} label="Streak" color={Colors.primary} />
          <View style={s.statDivider} />
          <StatBadge icon={<Zap size={14} color={Colors.purple} />} value={`${xp}`} label="XP Total" color={Colors.purple} />
          <View style={s.statDivider} />
          <StatBadge icon={<Text style={{ fontSize: 14 }}>💎</Text>} value={gems} label="Gemas" color={Colors.gold} />
        </View>

        {/* ── Weekly Progress ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>ESTA SEMANA</Text>
          <Text style={s.sectionSub}>4/7 dias</Text>
        </View>
        <View style={s.weekRow}>
          {DAYS.map((d, i) => (
            <View key={d} style={s.dayCol}>
              <View style={[s.dayDot, i < 4 ? s.dayDone : i === 4 ? s.dayToday : s.dayFuture]}>
                <Text style={s.dayEmoji}>{i < 4 ? '🔥' : ''}</Text>
              </View>
              <Text style={s.dayLabel}>{d}</Text>
            </View>
          ))}
        </View>

        {/* ── Daily Challenge ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>DESAFIO DE HOJE</Text>
        </View>
        <TouchableOpacity style={s.challengeCard} activeOpacity={0.85}>
          <LinearGradient colors={['#0A1A24', '#091220']} style={StyleSheet.absoluteFill} />
          <View style={s.challengeTop}>
            <View style={s.challengeTag}>
              <Text style={s.challengeTagText}>⚡ ATIVO</Text>
            </View>
            <Text style={s.challengeXp}>+150xp</Text>
          </View>
          <Text style={s.challengeTitle}>🎯 Supino — Novo Recorde</Text>
          <Text style={s.challengeSub}>Tente 72,5 kg · você está a 2,5 kg do recorde</Text>
          <View style={s.challengeBar}>
            <LinearGradient colors={[Colors.secondary, Colors.success]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.challengeBarFill, { width: '40%' }]} />
          </View>
          <View style={s.challengeFooter}>
            <Text style={s.challengeBarLabel}>40% concluído</Text>
            <ChevronRight size={16} color={Colors.textDim} />
          </View>
        </TouchableOpacity>

        {/* ── Check-in CTA ── */}
        <TouchableOpacity style={s.checkinBtn} activeOpacity={0.85}>
          <LinearGradient colors={[Colors.success, '#0EA472']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          <Text style={{ fontSize: 22 }}>📷</Text>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.checkinTitle}>Fazer check-in agora</Text>
            <Text style={s.checkinSub}>Escaneie o QR da academia · 3 segundos</Text>
          </View>
          <ArrowRight size={18} color="rgba(0,0,0,0.4)" />
        </TouchableOpacity>

        {/* ── Missions ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>MISSÕES DE HOJE</Text>
          <Text style={s.sectionSub}>1/3 feitas</Text>
        </View>
        <View style={s.card}>
          <MissionRow icon="💪" title="Completar treino" sub="Peito + Tríceps" xp={50} />
          <View style={s.cardDivider} />
          <MissionRow icon="✅" title="Check-in matinal" sub="Abrir o app até 10h" xp={10} done />
          <View style={s.cardDivider} />
          <MissionRow icon="👏" title="Reagir a um colega" sub="Comunidade" xp={5} />
        </View>

        {/* ── League ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>LIGA OURO</Text>
          <View style={s.timerTag}><Text style={s.timerText}>2d 14h</Text></View>
        </View>
        <View style={s.card}>
          <LeagueRow pos={1} name="Maria R." xp={890} streak={89} color={Colors.gold} />
          <View style={s.cardDivider} />
          <LeagueRow pos={2} name="João P." xp={720} streak={51} color="#C0C0C0" />
          <View style={s.cardDivider} />
          <LeagueRow pos={4} name="Você ⚡" xp={580} streak={47} color={Colors.secondary} me />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 55 },
  content: { paddingHorizontal: 20, paddingBottom: 110 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { color: Colors.textDim, fontSize: 13, fontFamily: 'Fredoka_400Regular' },
  userName: { color: Colors.text, fontSize: 26, fontFamily: 'Syne_700', lineHeight: 30 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.surfaceElevated, borderWidth: 1.5, borderColor: Colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  levelDot: { position: 'absolute', bottom: -4, right: -4, backgroundColor: Colors.purple, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.background },
  levelDotText: { color: 'white', fontSize: 9, fontFamily: 'Fredoka_700Bold' },

  // XP Bar
  xpBarWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 22 },
  xpBarTrack: { flex: 1, height: 5, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden' },
  xpBarFill: { height: '100%', borderRadius: 3 },
  xpText: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold' },

  // Hero Card
  heroCard: { height: 250, borderRadius: 32, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  heroBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,92,34,0.15)' },
  heroInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  streakNum: { color: Colors.text, fontSize: 58, fontFamily: 'Syne_700', lineHeight: 62, textAlign: 'center' },
  streakLabel: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginTop: -4 },
  milestonePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.goldDim, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)' },
  milestoneText: { color: Colors.gold, fontSize: 10, fontFamily: 'Fredoka_700Bold' },
  mascotWrap: { marginBottom: -10 },

  // Stats
  statsRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 24, paddingVertical: 16 },
  statBadge: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 20, fontFamily: 'Syne_700' },
  statLabel: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  statDivider: { width: 1, backgroundColor: Colors.border },

  // Section headers
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase' },
  sectionSub: { color: Colors.textMuted, fontSize: 10, fontFamily: 'Fredoka_400Regular' },

  // Week
  weekRow: { flexDirection: 'row', gap: 6, marginBottom: 24 },
  dayCol: { flex: 1, alignItems: 'center', gap: 6 },
  dayDot: { width: '100%', height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dayDone: { backgroundColor: Colors.primaryDim, borderWidth: 1, borderColor: 'rgba(255,92,34,0.25)' },
  dayToday: { backgroundColor: Colors.secondaryDim, borderWidth: 1.5, borderColor: Colors.secondary },
  dayFuture: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  dayEmoji: { fontSize: 18 },
  dayLabel: { color: Colors.textDim, fontSize: 8, fontFamily: 'Fredoka_700Bold', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Challenge card
  challengeCard: { borderRadius: 24, overflow: 'hidden', padding: 20, borderWidth: 1, borderColor: Colors.secondaryDim, marginBottom: 16 },
  challengeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  challengeTag: { backgroundColor: Colors.secondaryDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  challengeTagText: { color: Colors.secondary, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },
  challengeXp: { color: Colors.gold, fontSize: 13, fontFamily: 'Syne_700' },
  challengeTitle: { color: Colors.text, fontSize: 18, fontFamily: 'Syne_700', marginBottom: 6 },
  challengeSub: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginBottom: 16 },
  challengeBar: { height: 5, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  challengeBarFill: { height: '100%', borderRadius: 3 },
  challengeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  challengeBarLabel: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_400Regular' },

  // Check-in
  checkinBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 18, overflow: 'hidden', marginBottom: 24 },
  checkinTitle: { color: '#071A0F', fontSize: 16, fontFamily: 'Syne_700' },
  checkinSub: { color: 'rgba(7,26,15,0.5)', fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 2 },

  // Generic card
  card: { backgroundColor: Colors.surface, borderRadius: 24, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 24 },
  cardDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 20 },

  // Missions
  missionRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  missionIconBox: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  missionTitle: { color: Colors.text, fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  missionSub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 1 },
  xpTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  xpTagText: { fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  // League
  leagueRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  leagueRowMe: { backgroundColor: Colors.secondaryDim },
  leaguePos: { width: 28, fontSize: 16, fontFamily: 'Syne_700' },
  leagueName: { flex: 1, color: Colors.text, fontSize: 13, fontFamily: 'Fredoka_700Bold' },
  leagueStreak: { color: Colors.primary, fontSize: 11, fontFamily: 'Fredoka_700Bold', marginRight: 14 },
  leagueXp: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  timerTag: { backgroundColor: 'rgba(239,68,68,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  timerText: { color: Colors.danger, fontSize: 10, fontFamily: 'Fredoka_700Bold' },
});
