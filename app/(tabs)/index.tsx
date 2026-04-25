import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Trophy, ArrowRight, ChevronRight, Zap, Shield, Camera } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Mascot } from '../../components/Mascot';

const { width } = Dimensions.get('window');

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
      <LinearGradient colors={['#100A1E', '#090614']} style={StyleSheet.absoluteFill} />
      <View style={s.formCardBorder} />
      <View style={s.formRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.formLabel}>FORMA DO DIA</Text>
          <Text style={[s.formScore, { color }]}>{score}<Text style={s.formScoreUnit}>/100</Text></Text>
          <Text style={s.formSub}>Consistência alta · Tendência de alta ↑</Text>
        </View>
        <View style={s.formRing}>
          <Svg width={64} height={64}>
            <Defs>
              <SvgGradient id="formG" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} />
                <Stop offset="100%" stopColor={color} stopOpacity="0.6" />
              </SvgGradient>
            </Defs>
            <Circle cx={32} cy={32} r={26} stroke="rgba(255,255,255,0.06)" strokeWidth={6} fill="none" />
            <Animated.Text x="32" y="37" textAnchor="middle" fill={color} fontSize="14" fontWeight="bold">
              {score}
            </Animated.Text>
          </Svg>
          <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={[s.formRingNum, { color }]}>{score}</Text>
          </View>
        </View>
      </View>
      <View style={s.streakShield}>
        <Shield size={13} color={Colors.secondary} />
        <Text style={s.shieldText}>Streak protegido · Treine hoje para manter os 47 dias</Text>
      </View>
    </View>
  );
}

function QuickAction({ icon, label, color, onPress }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    onPress?.();
  };
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={press} style={s.quickAction} activeOpacity={0.9}>
        <View style={[s.quickIconBox, { backgroundColor: color + '20', borderColor: color + '35' }]}>
          <Text style={{ fontSize: 22 }}>{icon}</Text>
        </View>
        <Text style={s.quickLabel}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* Header */}
        <Animated.View style={[s.header, entrance(0)]}>
          <View>
            <Text style={s.greeting}>Bom dia 👋</Text>
            <Text style={s.userName}>Capivara</Text>
          </View>
          <View style={s.avatarWrap}>
            <View style={s.avatar}><Text style={{ fontSize: 22 }}>🐹</Text></View>
            <View style={s.levelDot}><Text style={s.levelDotText}>12</Text></View>
          </View>
        </Animated.View>

        {/* XP Bar */}
        <Animated.View style={[s.xpBarWrap, entrance(0)]}>
          <View style={s.xpBarTrack}>
            <LinearGradient colors={[Colors.secondary, Colors.success]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.xpBarFill, { width: `${(xp / 3000) * 100}%` }]} />
          </View>
          <View style={s.gemPill}>
            <Text style={s.gemText}>💎 {gems}</Text>
          </View>
        </Animated.View>

        {/* Forma do Dia */}
        <Animated.View style={entrance(1)}>
          <FormScore score={82} />
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={[s.quickRow, entrance(2)]}>
          <QuickAction icon="📷" label="Check-in" color={Colors.success} />
          <QuickAction icon="🔥" label="Treinar" color={Colors.primary} />
          <QuickAction icon="⚔️" label="Duelo" color={Colors.purple} />
          <QuickAction icon="🏆" label="Liga" color={Colors.gold} />
        </Animated.View>

        {/* Fire Hero Card */}
        <Animated.View style={[s.heroCard, entrance(3)]}>
          <LinearGradient colors={['#200C00', '#140420', '#07090F']} style={StyleSheet.absoluteFill} />
          <View style={s.heroBorder} />
          <View style={s.heroInner}>
            <CircularStreak streak={streak} />
            <View style={s.mascotWrap}>
              <Mascot size={120} mood="happy" />
            </View>
          </View>
        </Animated.View>

        {/* Week */}
        <Animated.View style={entrance(3)}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>ESTA SEMANA</Text>
            <Text style={s.sectionSub}>4 de 7 dias ✓</Text>
          </View>
          <View style={s.weekRow}>
            {DAYS.map((d, i) => (
              <View key={d} style={s.dayCol}>
                <View style={[s.dayDot,
                  i < 4 ? s.dayDone :
                  i === 4 ? s.dayToday :
                  s.dayFuture
                ]}>
                  <Text style={s.dayEmoji}>{i < 4 ? '🔥' : i === 4 ? '•' : ''}</Text>
                </View>
                <Text style={[s.dayLabel, i === 4 && { color: Colors.secondary }]}>{d}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Missions */}
        <Animated.View style={entrance(4)}>
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
  content: { paddingHorizontal: 20, paddingBottom: 130 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greeting: { color: Colors.textDim, fontSize: 13, fontFamily: 'Fredoka_400Regular' },
  userName: { color: Colors.text, fontSize: 28, fontFamily: 'Syne_700', lineHeight: 32 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surfaceElevated, borderWidth: 1.5, borderColor: Colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  levelDot: { position: 'absolute', bottom: -4, right: -4, backgroundColor: Colors.purple, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.background },
  levelDotText: { color: 'white', fontSize: 9, fontFamily: 'Fredoka_700Bold' },

  xpBarWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  xpBarTrack: { flex: 1, height: 5, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden' },
  xpBarFill: { height: '100%', borderRadius: 3 },
  gemPill: { backgroundColor: Colors.goldDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)' },
  gemText: { color: Colors.gold, fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  formCard: { borderRadius: 24, overflow: 'hidden', padding: 18, borderWidth: 1, borderColor: Colors.border, marginBottom: 18 },
  formCardBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(139,92,246,0.12)' },
  formRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  formLabel: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, marginBottom: 4 },
  formScore: { fontSize: 36, fontFamily: 'Syne_700', lineHeight: 40 },
  formScoreUnit: { fontSize: 16, color: Colors.textDim },
  formSub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  formRing: { width: 64, height: 64, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  formRingNum: { fontSize: 18, fontFamily: 'Syne_700' },
  streakShield: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.secondaryDim, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  shieldText: { color: Colors.secondary, fontSize: 11, fontFamily: 'Fredoka_700Bold', flex: 1 },

  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  quickAction: { alignItems: 'center', gap: 6 },
  quickIconBox: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  quickLabel: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', textTransform: 'uppercase', letterSpacing: 0.5 },

  heroCard: { height: 230, borderRadius: 32, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  heroBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,92,34,0.12)' },
  heroInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 8 },
  streakNum: { color: Colors.text, fontSize: 54, fontFamily: 'Syne_700', lineHeight: 58, textAlign: 'center' },
  streakLabel: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginTop: -2 },
  milestonePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.goldDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: 'rgba(245,158,11,0.18)' },
  milestoneText: { color: Colors.gold, fontSize: 10, fontFamily: 'Fredoka_700Bold' },
  mascotWrap: { marginBottom: -10 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase' },
  sectionSub: { color: Colors.textMuted, fontSize: 10, fontFamily: 'Fredoka_400Regular' },

  weekRow: { flexDirection: 'row', gap: 5, marginBottom: 22 },
  dayCol: { flex: 1, alignItems: 'center', gap: 5 },
  dayDot: { width: '100%', height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  dayDone: { backgroundColor: Colors.primaryDim, borderWidth: 1, borderColor: 'rgba(255,92,34,0.22)' },
  dayToday: { backgroundColor: Colors.secondaryDim, borderWidth: 1.5, borderColor: Colors.secondary },
  dayFuture: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  dayEmoji: { fontSize: 16 },
  dayLabel: { color: Colors.textDim, fontSize: 8, fontFamily: 'Fredoka_700Bold', textTransform: 'uppercase', letterSpacing: 0.3 },

  card: { backgroundColor: Colors.surface, borderRadius: 24, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 20 },
  cardDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },

  missionRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  missionIconBox: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  missionTitle: { color: Colors.text, fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  missionSub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 1 },
  xpTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9 },
  xpTagText: { fontSize: 11, fontFamily: 'Fredoka_700Bold' },

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
