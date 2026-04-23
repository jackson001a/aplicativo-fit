import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, G, Text as SvgText, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Camera, ArrowRight, CheckCircle2, MessageCircle, Dumbbell, User, Check, Zap, Target, Star, Swords, Gift, Coffee, Heart, Trophy } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { Mascot } from '../../components/Mascot';
import { ChunkyButton } from '../../components/ChunkyButton';
import React, { useState, useEffect, useRef } from 'react';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  
  // Game States (Sync with HTML values)
  const [streak, setStreak] = useState(47);
  const [xp, setXp] = useState(2450);
  const [gems, setGems] = useState(128);

  const handlePet = () => {
    // Interactive mascot feedback
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.gameView} contentContainerStyle={styles.content}>
        {/* 1. XP HEADER */}
        <View style={styles.xpHeader}>
          <View style={styles.headerItem}>
             <Text style={styles.headerEmoji}>🔥</Text>
             <Text style={styles.headerVal}>{streak}</Text>
          </View>
          <View style={styles.xpTrack}>
             <LinearGradient colors={[Colors.skyBlue, Colors.glowGreen]} start={{x:0, y:0}} end={{x:1, y:0}} style={[styles.xpFill, { width: '65%' }]} />
          </View>
          <Text style={styles.xpText}>{xp} XP</Text>
          <View style={styles.lvlBadge}>
             <Text style={styles.lvlBadgeText}>LVL 12</Text>
          </View>
          <View style={styles.gemPill}>
             <Text style={styles.gemText}>💎 {gems}</Text>
          </View>
        </View>

        {/* 2. GREETING */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.grName}>Olá, Capivara!</Text>
            <Text style={styles.grSub}>Pronto para o treino de hoje?</Text>
          </View>
          <TouchableOpacity style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🐹</Text>
          </TouchableOpacity>
        </View>

        {/* 3. HERO STREAK (CIRCULAR + MASCOT) */}
        <View style={styles.heroSection}>
          <LinearGradient colors={['#13102A', '#1A1238', '#1E1028']} style={styles.heroBg} />
          <View style={styles.heroContent}>
            <View style={styles.streakWrapper}>
               <CircularStreak streak={streak} />
            </View>
            <View style={styles.mascotWrapper}>
               <Mascot size={130} onPet={handlePet} mood="happy" />
            </View>
          </View>
        </View>

        {/* 4. MINI FLAMES (WEEKLY PROGRESS) */}
        <View style={styles.secHeader}>
          <Text style={styles.secTitle}>ESSA SEMANA</Text>
          <Text style={styles.secStats}>2/3 Treinos feitos</Text>
        </View>
        <View style={styles.miniFlamesGrid}>
          {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'].map((d, i) => (
            <View key={d} style={styles.smFlCol}>
              <View style={[styles.smFlBox, i < 4 ? styles.smFlDone : i === 4 ? styles.smFlToday : styles.smFlFuture]}>
                 <Text style={styles.smFlEmoji}>{i < 4 ? '🔥' : ''}</Text>
                 <Text style={styles.smFlLabel}>{d.toLowerCase()}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.smBonusRow}>
          <BonusPill val={`${streak}🔥`} label="streak" color={Colors.lavaOrange} />
          <BonusPill val="3/3" label="semana" color={Colors.glowGreen} />
          <BonusPill val="+5💎" label="bônus" color={Colors.skyBlue} />
          <BonusPill val="Nv.7" label="nível" color={Colors.joyPink} />
        </View>

        {/* 5. HEATMAP */}
        <View style={styles.secHeader}>
          <Text style={styles.secTitle}>ÚLTIMOS 30 DIAS</Text>
          <Text style={styles.secStats}>18 treinos</Text>
        </View>
        <View style={styles.cardGlass}>
          <View style={styles.heatmapGrid}>
             {Array.from({ length: 30 }).map((_, i) => (
               <View key={i} style={[styles.heatDot, i % 5 === 0 && styles.heatDotActive, i % 3 === 0 && i % 5 !== 0 && styles.heatDotPartial, i === 29 && styles.heatDotCurrent]} />
             ))}
          </View>
          <View style={styles.heatLegend}>
            <Text style={styles.legendText}>menos</Text>
            <View style={[styles.heatDot, { width: 8, height: 8 }]} />
            <View style={[styles.heatDot, { width: 8, height: 8, backgroundColor: 'rgba(112, 214, 60, 0.4)' }]} />
            <View style={[styles.heatDot, { width: 8, height: 8, backgroundColor: Colors.glowGreen }]} />
            <Text style={styles.legendText}>mais</Text>
          </View>
        </View>

        {/* 6. DESAFIO DIÁRIO */}
        <TouchableOpacity style={styles.dailyCard}>
          <LinearGradient colors={['#0E1A20', '#12222A']} style={StyleSheet.absoluteFill} />
          <Text style={styles.dailyHeader}>⚡ DESAFIO DE HOJE</Text>
          <Text style={styles.dailyTitle}>🎯 Quebrar o recorde no supino</Text>
          <Text style={styles.dailySub}>Tente 72,5kg — você está a 2,5kg do próximo recorde</Text>
          <View style={styles.dailyFooter}>
            <View style={styles.dailyProgress}><View style={[styles.dailyFill, { width: '40%' }]} /></View>
            <Text style={styles.dailyXp}>+150xp 🏆</Text>
          </View>
        </TouchableOpacity>

        {/* 7. TERMÔMETRO DE FORMA */}
        <View style={styles.secHeader}>
          <Text style={styles.secTitle}>🌡️ TERMÔMETRO DE FORMA</Text>
        </View>
        <View style={styles.cardGlass}>
           <View style={styles.thermHeader}>
              <Text style={styles.thermStatus}>Em forma 🔥</Text>
              <Text style={styles.thermVal}>82%</Text>
           </View>
           <View style={styles.thermTrack}>
              <LinearGradient 
                colors={[Colors.lavaOrange, Colors.glowGreen]} 
                start={{x:0, y:0}} end={{x:1, y:0}} 
                style={[styles.thermFill, { width: '82%' }]} 
              />
           </View>
           <Text style={styles.thermDesc}>Sua melhor forma este mês! Tendência: ↑</Text>
           <View style={styles.sparkRow}>
              {[20, 45, 60, 30, 55, 82, 70, 75, 82].map((h, i) => (
                <View key={i} style={[styles.sparkBar, i === 5 && styles.sparkHigh, i === 8 && styles.sparkCurrent, { height: h / 3 }]} />
              ))}
           </View>
        </View>

        {/* 8. CHECK-IN CTA */}
        <TouchableOpacity style={styles.checkinCta}>
          <LinearGradient colors={[Colors.glowGreen, '#94CC20']} style={StyleSheet.absoluteFill} />
          <View style={styles.checkinIcon}><Text style={{fontSize: 24}}>📷</Text></View>
          <View style={{flex: 1}}>
            <Text style={styles.checkinTitle}>Fazer check-in agora</Text>
            <Text style={styles.checkinSub}>Escaneie o QR da academia · 3 segundos</Text>
          </View>
          <ArrowRight size={20} color="rgba(0,0,0,0.4)" />
        </TouchableOpacity>

        {/* 9. MISSÕES */}
        <View style={styles.secHeader}>
          <Text style={styles.secTitle}>MISSÕES DE HOJE</Text>
        </View>
        <MissionCard icon="💪" title="Completar treino" sub="Peito + Tríceps" xp={50} color={Colors.skyBlue} />
        <MissionCard icon="✅" title="Check-in matinal" sub="Abrir o app até 10h" xp={10} color={Colors.glowGreen} done />
        <MissionCard icon="👏" title="Reagir a um colega" sub="Comunidade" xp={5} color={Colors.joyPink} />

        {/* 10. LIGA MINI */}
        <View style={styles.secHeader}>
          <Text style={styles.secTitle}>LIGA OURO · SEMANA</Text>
        </View>
        <View style={styles.cardGlass}>
           <View style={styles.leagueHeader}>
              <View>
                <Text style={styles.leagueTitle}>Liga Ouro 🥇</Text>
                <Text style={styles.leagueSub}>Top 3 sobem para Diamante</Text>
              </View>
              <View style={styles.leagueTimer}><Text style={styles.timerText}>2d 14h</Text></View>
           </View>
           <LeagueRow pos={1} name="Maria R." xp={890} streak={89} color={Colors.sunGold} />
           <LeagueRow pos={2} name="João P." xp={720} streak={51} color="#C0C0C0" />
           <LeagueRow pos={4} name="Você ⚡" xp={580} streak={47} color={Colors.skyBlue} me />
        </View>

        {/* 11. DUELO */}
        <View style={styles.secHeader}>
          <Text style={styles.secTitle}>⚔️ DUELO ATIVO</Text>
        </View>
        <TouchableOpacity style={styles.duelCard}>
          <LinearGradient colors={['#160810', '#1E0E18']} style={StyleSheet.absoluteFill} />
          <View style={styles.duelContent}>
             <View style={styles.duelFighter}>
                <Text style={styles.duelName}>Você</Text>
                <Text style={styles.duelXp}>580</Text>
             </View>
             <Text style={styles.vsText}>VS</Text>
             <View style={styles.duelFighter}>
                <Text style={styles.duelName}>João P.</Text>
                <Text style={styles.duelXpRed}>620</Text>
             </View>
          </View>
          <View style={styles.duelBarBg}><View style={[styles.duelBarFill, { width: '48%' }]} /></View>
          <Text style={styles.duelStatus}>Perdendo por 40xp — treina agora 👊</Text>
        </TouchableOpacity>

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

// Helper Components
function BonusPill({ val, label, color }) {
  return (
    <View style={styles.bonusPill}>
      <Text style={[styles.bonusVal, { color }]}>{val}</Text>
      <Text style={styles.bonusLabel}>{label}</Text>
    </View>
  );
}

function MissionCard({ icon, title, sub, xp, color, done }) {
  return (
    <View style={[styles.missionCard, done && { opacity: 0.5 }]}>
      <View style={[styles.missionIcon, { backgroundColor: color + '20' }]}>
        <Text style={{fontSize: 20}}>{icon}</Text>
      </View>
      <View style={{flex: 1, marginLeft: 12}}>
        <Text style={styles.missionTitle}>{title}</Text>
        <Text style={styles.missionSub}>{sub}</Text>
      </View>
      <View style={[styles.missionXpPill, { backgroundColor: color + '20' }]}>
        <Text style={[styles.missionXpText, { color }]}>+{xp}xp</Text>
      </View>
    </View>
  );
}

function LeagueRow({ pos, name, xp, streak, color, me }) {
  return (
    <View style={[styles.leagueRow, me && styles.leagueRowMe]}>
      <Text style={[styles.leaguePos, { color }]}>{pos}</Text>
      <Text style={[styles.leagueName, me && { color: Colors.skyBlue }]}>{name}</Text>
      <Text style={styles.leagueStreak}>🔥{streak}d</Text>
      <Text style={styles.leagueXp}>{xp}xp</Text>
    </View>
  );
}

function CircularStreak({ streak }) {
  const size = 150;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Animation hooks
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Milestones logic
  const milestones = [15, 30, 45, 60, 100];
  const nextMilestone = milestones.find(m => m > streak) || 365;
  const prevMilestone = [...milestones].reverse().find(m => m <= streak) || 0;
  const progressVal = Math.min((streak - prevMilestone) / (nextMilestone - prevMilestone), 1);
  const daysLeft = nextMilestone - streak;

  useEffect(() => {
    // Smooth entrance animation
    Animated.timing(progressAnim, {
      toValue: progressVal,
      duration: 1200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [progressVal]);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size + 50, alignItems: 'center' }}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          <Defs>
            <SvgGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={Colors.lavaOrange} />
              <Stop offset="100%" stopColor={Colors.sunGold} />
            </SvgGradient>
          </Defs>
          
          {/* Subtle Inner Glow */}
          <Circle cx={size/2} cy={size/2} r={radius} fill="rgba(255,168,32,0.02)" />
          
          {/* Background Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Animated Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#coreGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
           <Text style={{ color: 'white', fontSize: 52, fontFamily: 'Fredoka_700Bold' }}>{streak}</Text>
           <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Fredoka_700Bold', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: -6 }}>Dias de Fogo</Text>
        </View>
      </View>

      <View style={styles.milestoneIndicator}>
         <Trophy size={12} color={Colors.sunGold} />
         <Text style={styles.milestoneText}>PRÓXIMO MARCO: {nextMilestone} DIAS ({daysLeft} RESTANTES)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 50 },
  gameView: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 110 },

  // Super Hero Header (Fire First)
  // XP Header
  xpHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, marginBottom: 15 },
  headerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerEmoji: { fontSize: 16 },
  headerVal: { color: Colors.lavaOrange, fontFamily: 'Fredoka_700Bold', fontSize: 14 },
  xpTrack: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 3 },
  xpText: { color: Colors.skyBlue, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  lvlBadge: { backgroundColor: 'rgba(157,78,221,0.1)', borderWidth: 1, borderColor: 'rgba(157,78,221,0.3)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  lvlBadgeText: { color: '#9D4EDD', fontSize: 10, fontFamily: 'Fredoka_700Bold' },
  gemPill: { backgroundColor: 'rgba(255,168,32,0.1)', borderWidth: 1, borderColor: 'rgba(255,168,32,0.3)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  gemText: { color: Colors.sunGold, fontSize: 10, fontFamily: 'Fredoka_700Bold' },

  // Greeting
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  grName: { color: 'white', fontSize: 22, fontFamily: 'Fredoka_700Bold' },
  grSub: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  avatarCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.skyBlue, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white' },
  avatarEmoji: { fontSize: 18 },

  // Hero Section
  heroSection: { height: 240, borderRadius: 40, overflow: 'hidden', marginBottom: 20, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)' },
  heroBg: { ...StyleSheet.absoluteFillObject },
  heroContent: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, justifyContent: 'space-between' },
  streakWrapper: { alignItems: 'center', justifyContent: 'center', marginTop: 15 },
  mascotWrapper: { marginRight: -10, marginTop: 20 },
  milestoneIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginTop: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  milestoneText: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 0.5 },

  // Mini Flames
  secHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginVertical: 15 },
  secTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },
  secStats: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_400Regular' },
  miniFlamesGrid: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  smFlCol: { flex: 1 },
  smFlBox: { height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  smFlDone: { backgroundColor: 'rgba(255,168,32,0.1)', borderColor: 'rgba(255,168,32,0.3)' },
  smFlToday: { backgroundColor: 'rgba(0,229,255,0.1)', borderColor: Colors.skyBlue },
  smFlFuture: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'transparent' },
  smFlEmoji: { fontSize: 16 },
  smFlLabel: { fontSize: 7, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: 4, fontFamily: 'Fredoka_700Bold' },
  smBonusRow: { flexDirection: 'row', gap: 8 },
  bonusPill: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 8, alignItems: 'center' },
  bonusVal: { fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  bonusLabel: { fontSize: 8, color: Colors.textDim, textTransform: 'uppercase', marginTop: 2, fontFamily: 'Fredoka_400Regular' },

  // Heatmap
  cardGlass: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  heatDot: { width: (width - 100) / 7.5, height: 10, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.05)' },
  heatDotActive: { backgroundColor: Colors.glowGreen },
  heatDotPartial: { backgroundColor: 'rgba(112,214,60,0.3)' },
  heatDotCurrent: { borderWidth: 1, borderColor: Colors.skyBlue },
  heatLegend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 10 },
  legendText: { fontSize: 8, color: Colors.textDim, fontFamily: 'Fredoka_400Regular' },

  // Daily Challenge
  dailyCard: { borderRadius: 24, overflow: 'hidden', padding: 20, borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)', marginVertical: 10 },
  dailyHeader: { fontSize: 9, fontFamily: 'Fredoka_700Bold', color: Colors.skyBlue, letterSpacing: 1, marginBottom: 8 },
  dailyTitle: { color: 'white', fontSize: 16, fontFamily: 'Fredoka_700Bold' },
  dailySub: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginTop: 4 },
  dailyFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  dailyProgress: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginRight: 15, overflow: 'hidden' },
  dailyFill: { height: '100%', backgroundColor: Colors.skyBlue, borderRadius: 3 },
  dailyXp: { color: Colors.skyBlue, fontSize: 12, fontFamily: 'Fredoka_700Bold' },

  // Thermometer
  thermHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  thermStatus: { color: Colors.glowGreen, fontSize: 12, fontFamily: 'Fredoka_700Bold' },
  thermVal: { color: Colors.glowGreen, fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  thermTrack: { height: 10, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 5, overflow: 'hidden' },
  thermFill: { height: '100%', borderRadius: 5 },
  thermDesc: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_400Regular', marginTop: 8 },
  sparkRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 30, marginTop: 10 },
  sparkBar: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
  sparkHigh: { backgroundColor: Colors.glowGreen },
  sparkCurrent: { backgroundColor: Colors.skyBlue },

  // Checkin
  checkinCta: { flexDirection: 'row', alignItems: 'center', borderRadius: 24, padding: 18, overflow: 'hidden', marginVertical: 15 },
  checkinIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  checkinTitle: { color: '#101C00', fontSize: 16, fontFamily: 'Fredoka_700Bold' },
  checkinSub: { color: 'rgba(16,28,0,0.5)', fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 2 },

  // Missions
  missionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  missionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  missionTitle: { color: 'white', fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  missionSub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  missionXpPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  missionXpText: { fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  // League
  leagueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  leagueTitle: { color: 'white', fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  leagueSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_400Regular' },
  leagueTimer: { backgroundColor: 'rgba(255,61,92,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  timerText: { color: '#FF3D5C', fontSize: 10, fontFamily: 'Fredoka_700Bold' },
  leagueRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  leagueRowMe: { backgroundColor: 'rgba(0,229,255,0.05)', marginHorizontal: -15, paddingHorizontal: 15, borderRadius: 12, borderBottomWidth: 0 },
  leaguePos: { width: 30, fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  leagueName: { flex: 1, color: 'white', fontSize: 13, fontFamily: 'Fredoka_700Bold' },
  leagueStreak: { color: Colors.lavaOrange, fontSize: 10, fontFamily: 'Fredoka_400Regular', marginRight: 15 },
  leagueXp: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold' },

  // Duel
  duelCard: { borderRadius: 24, overflow: 'hidden', padding: 20, borderWidth: 1, borderColor: 'rgba(255,61,92,0.2)', marginBottom: 20 },
  duelContent: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 15 },
  duelFighter: { alignItems: 'center' },
  duelName: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular' },
  duelXp: { color: Colors.skyBlue, fontSize: 32, fontFamily: 'Fredoka_700Bold' },
  duelXpRed: { color: '#FF3D5C', fontSize: 32, fontFamily: 'Fredoka_700Bold' },
  vsText: { color: '#FF3D5C', fontSize: 24, fontFamily: 'Fredoka_700Bold' },
  duelBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  duelBarFill: { height: '100%', backgroundColor: '#FF3D5C', borderRadius: 3 },
  duelStatus: { color: '#FF3D5C', fontSize: 11, textAlign: 'center', marginTop: 10, fontFamily: 'Fredoka_700Bold' },
});
