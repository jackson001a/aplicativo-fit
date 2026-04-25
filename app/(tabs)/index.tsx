import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Trophy, ChevronRight, Zap, Shield } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

// ── Thin decorative arc (just for atmosphere) ──────────────────────────────
function FireArc({ streak }: { streak: number }) {
  const size = width - 40;
  const cx = size / 2, cy = size / 2;
  const r = (size / 2) - 14;
  const circ = 2 * Math.PI * r;
  const milestones = [15, 30, 45, 60, 100, 180, 365];
  const next = milestones.find(m => m > streak) || 365;
  const prev = [...milestones].reverse().find(m => m <= streak) || 0;
  const progress = Math.min((streak - prev) / (next - prev), 1);
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: progress, duration: 1600, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, []);
  const AnimCircle = Animated.createAnimatedComponent(Circle);
  const dashOff = anim.interpolate({ inputRange: [0, 1], outputRange: [circ, 0] });
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
      <Defs>
        <SvgGradient id="arcG" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={Colors.primary} stopOpacity="0.7" />
          <Stop offset="60%" stopColor="#FF8C42" stopOpacity="0.5" />
          <Stop offset="100%" stopColor={Colors.gold} stopOpacity="0.3" />
        </SvgGradient>
      </Defs>
      <Circle cx={cx} cy={cy} r={r} stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" fill="none" />
      <AnimCircle cx={cx} cy={cy} r={r} stroke="url(#arcG)" strokeWidth="2.5" strokeDasharray={circ} strokeDashoffset={dashOff} strokeLinecap="round" fill="none" transform={`rotate(-90 ${cx} ${cy})`} />
    </Svg>
  );
}

// ── Pulse ring animation ───────────────────────────────────────────────────
function PulseRing({ color }: { color: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.loop(Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.5, duration: 1800, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 1800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
      ]),
    ])).start();
  }, []);
  return (
    <Animated.View style={{ position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: color, transform: [{ scale }], opacity }} />
  );
}

// ── Form score pill ────────────────────────────────────────────────────────
function FormBadge({ score }: { score: number }) {
  const color = score >= 75 ? Colors.success : score >= 50 ? Colors.gold : Colors.danger;
  const label = score >= 75 ? 'Ótimo' : score >= 50 ? 'Moderado' : 'Recuperar';
  return (
    <View style={[fb.wrap, { borderColor: color + '40' }]}>
      <LinearGradient colors={[color + '18', color + '06']} style={StyleSheet.absoluteFill} />
      <View style={fb.left}>
        <Text style={fb.tag}>FORMA DO DIA</Text>
        <Text style={[fb.score, { color }]}>{score}<Text style={fb.scoreMax}>/100</Text></Text>
        <Text style={[fb.label, { color }]}>{label}</Text>
      </View>
      <View style={fb.indicators}>
        <View style={fb.ind}><View style={[fb.indDot, { backgroundColor: Colors.success }]} /><Text style={fb.indText}>Streak OK</Text></View>
        <View style={fb.ind}><View style={[fb.indDot, { backgroundColor: Colors.gold }]} /><Text style={fb.indText}>82% Consist.</Text></View>
        <View style={fb.ind}><View style={[fb.indDot, { backgroundColor: Colors.secondary }]} /><Text style={fb.indText}>1/3 Missões</Text></View>
      </View>
    </View>
  );
}
const fb = StyleSheet.create({
  wrap: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  left: { flex: 1 },
  tag: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, marginBottom: 4 },
  score: { fontSize: 40, fontFamily: 'Syne_700', lineHeight: 44 },
  scoreMax: { fontSize: 16, color: Colors.textDim },
  label: { fontSize: 11, fontFamily: 'Fredoka_700Bold', marginTop: 2 },
  indicators: { gap: 8, alignItems: 'flex-start' },
  ind: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  indDot: { width: 6, height: 6, borderRadius: 3 },
  indText: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold' },
});

// ── Quick action card ──────────────────────────────────────────────────────
function ActionCard({ emoji, title, sub, gradient, onPress }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const tap = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.93, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    onPress?.();
  };
  return (
    <Animated.View style={{ transform: [{ scale }], width: 140 }}>
      <TouchableOpacity onPress={tap} style={ac.card} activeOpacity={0.9}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <Text style={ac.emoji}>{emoji}</Text>
        <Text style={ac.title}>{title}</Text>
        <Text style={ac.sub}>{sub}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
const ac = StyleSheet.create({
  card: { height: 100, borderRadius: 22, overflow: 'hidden', padding: 14, justifyContent: 'space-between' },
  emoji: { fontSize: 26 },
  title: { color: 'white', fontSize: 13, fontFamily: 'Syne_700' },
  sub: { color: 'rgba(255,255,255,0.65)', fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 0.5 },
});

// ── Mission row ────────────────────────────────────────────────────────────
function MissionRow({ icon, title, sub, xp, done }: any) {
  return (
    <View style={[mr.row, done && { opacity: 0.4 }]}>
      <View style={[mr.iconBox, { backgroundColor: done ? Colors.successDim : Colors.primaryDim }]}>
        <Text style={{ fontSize: 17 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={[mr.title, done && { textDecorationLine: 'line-through' }]}>{title}</Text>
        <Text style={mr.sub}>{sub}</Text>
      </View>
      <View style={[mr.xpTag, { backgroundColor: done ? Colors.successDim : Colors.goldDim }]}>
        <Text style={[mr.xpText, { color: done ? Colors.success : Colors.gold }]}>{done ? '✓' : `+${xp}xp`}</Text>
      </View>
    </View>
  );
}
const mr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  iconBox: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  title: { color: Colors.text, fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  sub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 1 },
  xpTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9 },
  xpText: { fontSize: 11, fontFamily: 'Fredoka_700Bold' },
});

// ── League row ─────────────────────────────────────────────────────────────
function LeagueRow({ pos, name, xp, streak, color, me }: any) {
  return (
    <View style={[lr.row, me && lr.me]}>
      <Text style={[lr.pos, { color }]}>{pos}</Text>
      <Text style={[lr.name, me && { color: Colors.secondary }]}>{name}</Text>
      <Text style={lr.streak}>🔥{streak}d</Text>
      <Text style={lr.xp}>{xp}xp</Text>
    </View>
  );
}
const lr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13 },
  me: { backgroundColor: Colors.secondaryDim },
  pos: { width: 26, fontSize: 15, fontFamily: 'Syne_700', marginRight: 8 },
  name: { flex: 1, color: Colors.text, fontSize: 13, fontFamily: 'Fredoka_700Bold' },
  streak: { color: Colors.primary, fontSize: 11, fontFamily: 'Fredoka_700Bold', marginRight: 12 },
  xp: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
});

// ── Main screen ────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [streak] = useState(47);
  const [xp] = useState(2450);
  const DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
  const TYPES = ['🫁', '🦵', '🦾', '💪', '', '', ''];

  // Stagger entrance
  const anims = useRef(Array.from({ length: 6 }, () => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(80, anims.map(a =>
      Animated.timing(a, { toValue: 1, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: true })
    )).start();
  }, []);
  const enter = (i: number) => ({
    opacity: anims[i],
    transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  });

  // Mascot bob
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 2400, useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 2400, useNativeDriver: true }),
    ])).start();
  }, []);
  const bobY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* ── Header ── */}
        <Animated.View style={[s.header, enter(0)]}>
          <View>
            <Text style={s.greeting}>Bom dia 👋</Text>
            <Text style={s.userName}>Capivara</Text>
          </View>
          <View style={s.avatarWrap}>
            <View style={s.avatar}><Text style={{ fontSize: 22 }}>🐹</Text></View>
            <View style={s.levelDot}><Text style={s.levelDotText}>12</Text></View>
          </View>
        </Animated.View>

        {/* ── XP Bar ── */}
        <Animated.View style={[s.xpBarWrap, enter(0)]}>
          <View style={s.xpBarTrack}>
            <LinearGradient colors={[Colors.secondary, Colors.success]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.xpBarFill, { width: `${(xp / 3000) * 100}%` }]} />
          </View>
          <View style={s.gemPill}><Text style={s.gemText}>💎 128</Text></View>
        </Animated.View>

        {/* ── HERO: Full-width streak card (redesigned) ── */}
        <Animated.View style={[s.heroCard, enter(1)]}>
          <LinearGradient colors={['#250800', '#180320', '#07090F']} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />

          {/* Decorative thin arc - full width */}
          <FireArc streak={streak} />

          {/* Flame radial glow at bottom */}
          <View style={s.heroFlameGlow} />

          {/* Center content */}
          <View style={s.heroCenter}>
            {/* Pulse ring behind number */}
            <PulseRing color={Colors.primary} />

            {/* Big number */}
            <View style={s.heroNumWrap}>
              <Text style={s.heroEmoji}>🔥</Text>
              <Text style={s.heroNum}>{streak}</Text>
              <Text style={s.heroDaysLabel}>DIAS DE FOGO</Text>
            </View>
          </View>

          {/* Mascot floating bottom-right */}
          <Animated.View style={[s.mascotFloat, { transform: [{ translateY: bobY }] }]}>
            <Image source={require('../../assets/mascot.png')} style={s.mascotImg} resizeMode="contain" />
          </Animated.View>

          {/* Bottom bar inside card */}
          <View style={s.heroBottom}>
            <View style={s.heroPill}>
              <Trophy size={11} color={Colors.gold} />
              <Text style={s.heroPillText}>{47 - 45}d para 60 dias</Text>
            </View>
            <View style={[s.heroPill, { backgroundColor: Colors.secondaryDim, borderColor: 'rgba(61,139,255,0.2)' }]}>
              <Shield size={11} color={Colors.secondary} />
              <Text style={[s.heroPillText, { color: Colors.secondary }]}>Streak ativo</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Forma do Dia ── */}
        <Animated.View style={enter(2)}>
          <FormBadge score={82} />
        </Animated.View>

        {/* ── Quick Actions (horizontal scroll, card style) ── */}
        <Animated.View style={enter(2)}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>AÇÕES RÁPIDAS</Text>
          </View>
        </Animated.View>
        <Animated.View style={[enter(2), { marginBottom: 24 }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.actionsRow}>
            <ActionCard emoji="📷" title="Check-in" sub="ACADEMIA · 3 SEG" gradient={['#064E3B', '#065F46']} />
            <ActionCard emoji="💪" title="Iniciar Treino" sub="PEITO + TRÍCEPS" gradient={[Colors.primary, '#C2410C']} />
            <ActionCard emoji="⚔️" title="Duelo" sub="JOÃO P. · −140XP" gradient={['#4C1D95', '#6D28D9']} />
            <ActionCard emoji="🏆" title="Liga Ouro" sub="2D 14H RESTANDO" gradient={['#78350F', '#92400E']} />
          </ScrollView>
        </Animated.View>

        {/* ── Week strip ── */}
        <Animated.View style={enter(3)}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>ESTA SEMANA</Text>
            <Text style={s.sectionSub}>4 de 7 dias</Text>
          </View>
          <View style={s.weekRow}>
            {DAYS.map((d, i) => (
              <View key={d} style={s.dayCol}>
                <View style={[s.dayDot, i < 4 ? s.dayDone : i === 4 ? s.dayToday : s.dayFuture]}>
                  <Text style={s.dayEmoji}>{i < 4 ? TYPES[i] : i === 4 ? '·' : ''}</Text>
                </View>
                <Text style={[s.dayLabel, i === 4 && { color: Colors.secondary }]}>{d}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ── Missões ── */}
        <Animated.View style={enter(4)}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>MISSÕES</Text>
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

        {/* ── Liga ── */}
        <Animated.View style={enter(5)}>
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

          {/* Duel CTA */}
          <TouchableOpacity style={s.duelCard} activeOpacity={0.87}>
            <LinearGradient colors={['#1A0622', '#0E0314']} style={StyleSheet.absoluteFill} />
            <View style={s.duelBorder} />
            <View style={{ flex: 1 }}>
              <Text style={s.duelLabel}>⚔️ DUELO EM ANDAMENTO</Text>
              <Text style={s.duelTitle}>João P. está 140xp à frente!</Text>
            </View>
            <View style={s.duelBtn}><Text style={s.duelBtnText}>Atacar</Text><ChevronRight size={13} color="white" /></View>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 130 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 55 },
  content: { paddingHorizontal: 20, paddingBottom: 140 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greeting: { color: Colors.textDim, fontSize: 13, fontFamily: 'Fredoka_400Regular' },
  userName: { color: Colors.text, fontSize: 28, fontFamily: 'Syne_700', lineHeight: 32 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surfaceElevated, borderWidth: 1.5, borderColor: Colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  levelDot: { position: 'absolute', bottom: -4, right: -4, backgroundColor: Colors.purple, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.background },
  levelDotText: { color: 'white', fontSize: 9, fontFamily: 'Fredoka_700Bold' },

  xpBarWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  xpBarTrack: { flex: 1, height: 5, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden' },
  xpBarFill: { height: '100%', borderRadius: 3 },
  gemPill: { backgroundColor: Colors.goldDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)' },
  gemText: { color: Colors.gold, fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  // ── Hero ───────────────────────────────────────────────
  heroCard: { height: 260, borderRadius: 32, overflow: 'hidden', marginBottom: 18, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  heroFlameGlow: { position: 'absolute', bottom: -40, left: '50%', marginLeft: -80, width: 160, height: 160, borderRadius: 80, backgroundColor: Colors.primary, opacity: 0.12 },

  heroCenter: { alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', paddingBottom: 48 },
  heroNumWrap: { alignItems: 'center' },
  heroEmoji: { fontSize: 36, marginBottom: 4 },
  heroNum: { color: Colors.text, fontSize: 86, fontFamily: 'Syne_700', lineHeight: 86, includeFontPadding: false },
  heroDaysLabel: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_700Bold', letterSpacing: 3, textTransform: 'uppercase', marginTop: 4 },

  mascotFloat: { position: 'absolute', bottom: 40, right: 20, width: 80, height: 80 },
  mascotImg: { width: '100%', height: '100%' },

  heroBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 8, padding: 14 },
  heroPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.goldDim, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)' },
  heroPillText: { color: Colors.gold, fontSize: 10, fontFamily: 'Fredoka_700Bold' },

  // ── Common ─────────────────────────────────────────────
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase' },
  sectionSub: { color: Colors.textMuted, fontSize: 10, fontFamily: 'Fredoka_400Regular' },

  actionsRow: { gap: 10, paddingRight: 4 },

  weekRow: { flexDirection: 'row', gap: 5, marginBottom: 22 },
  dayCol: { flex: 1, alignItems: 'center', gap: 5 },
  dayDot: { width: '100%', height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dayDone: { backgroundColor: Colors.primaryDim, borderWidth: 1, borderColor: 'rgba(255,92,34,0.22)' },
  dayToday: { backgroundColor: Colors.secondaryDim, borderWidth: 1.5, borderColor: Colors.secondary },
  dayFuture: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  dayEmoji: { fontSize: 15 },
  dayLabel: { color: Colors.textDim, fontSize: 8, fontFamily: 'Fredoka_700Bold', textTransform: 'uppercase', letterSpacing: 0.3 },

  card: { backgroundColor: Colors.surface, borderRadius: 24, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 20 },
  cardDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },

  timerTag: { backgroundColor: 'rgba(239,68,68,0.08)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: Colors.dangerDim },
  timerText: { color: Colors.danger, fontSize: 10, fontFamily: 'Fredoka_700Bold' },

  duelCard: { borderRadius: 22, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: Colors.border },
  duelBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(139,92,246,0.15)' },
  duelLabel: { color: Colors.purple, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1, marginBottom: 3 },
  duelTitle: { color: Colors.text, fontSize: 14, fontFamily: 'Syne_700' },
  duelBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.purpleDim, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  duelBtnText: { color: 'white', fontSize: 12, fontFamily: 'Fredoka_700Bold' },
});
