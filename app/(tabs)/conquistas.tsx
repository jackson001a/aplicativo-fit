import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Zap, Crown, Medal, Check, Flame, Lock } from 'lucide-react-native';

const TITLES = [
  { id: 1, text: '🌱 Novato', unlocked: true },
  { id: 2, text: '⚡ Dedicado', unlocked: true },
  { id: 3, text: '⚔️ Guerreiro', unlocked: false },
  { id: 4, text: '🔥 Imparável', unlocked: false },
  { id: 5, text: '👑 Lendário', unlocked: false },
];

// Unlocked card gets color glow; locked gets blur-style dim overlay
function AchievementCard({ icon, title, sub, progress, unlocked, color, rarity }: any) {
  const isLegendary = rarity === 'LENDÁRIO';
  return (
    <View style={[
      s.achieveCard,
      unlocked && isLegendary && {
        borderColor: color + '50',
        shadowColor: color,
        shadowOpacity: 0.35,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
      },
      unlocked && !isLegendary && { borderColor: color + '30' },
    ]}>
      {unlocked && isLegendary && (
        <LinearGradient
          colors={[color + '10', 'transparent']}
          style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
        />
      )}
      <View style={[s.achieveIconBox, { backgroundColor: color + (unlocked ? '20' : '0A') }]}>
        {icon}
        {unlocked && (
          <View style={[s.checkSeal, isLegendary && { backgroundColor: color }]}>
            <Check size={10} color="white" strokeWidth={3} />
          </View>
        )}
      </View>
      <View style={{ flex: 1, marginLeft: 16, opacity: unlocked ? 1 : 0.5 }}>
        <Text style={s.achieveTitle}>{title}</Text>
        <Text style={s.achieveSub}>{sub}</Text>
        <View style={s.progressTrack}>
          <LinearGradient
            colors={unlocked ? [color, color + 'CC'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[s.progressFill, { width: `${progress}%` }]}
          />
        </View>
      </View>
      {unlocked ? (
        <Text style={[s.progressPct, { color }]}>{progress}%</Text>
      ) : (
        <View style={s.lockIcon}><Lock size={14} color={Colors.textDim} /></View>
      )}
    </View>
  );
}

export default function AchievementsScreen() {
  const [selectedTitle, setSelectedTitle] = useState('⚡ Dedicado');

  const groups = [
    {
      label: 'LENDÁRIO', color: Colors.gold, emoji: '👑',
      items: [
        { icon: <Crown size={24} color={Colors.gold} />, title: 'Mestre de Tudo', sub: 'Colete todas as insígnias', progress: 10, unlocked: false },
        { icon: <Crown size={24} color={Colors.gold} />, title: '365 Dias de Fogo', sub: 'Um ano inteiro de consistência', progress: 12, unlocked: false },
      ]
    },
    {
      label: 'ÉPICO', color: Colors.purple, emoji: '🔮',
      items: [
        { icon: <Flame size={24} color={Colors.purple} />, title: 'Força Bruta', sub: 'Levante 100 kg no supino', progress: 72, unlocked: true },
        { icon: <Medal size={24} color={Colors.purple} />, title: 'Atleta de Elite', sub: 'Chegue à Liga Diamante', progress: 100, unlocked: true },
      ]
    },
    {
      label: 'RARO', color: Colors.secondary, emoji: '⚡',
      items: [
        { icon: <Zap size={24} color={Colors.secondary} />, title: 'Rápido como Raio', sub: 'Check-in antes das 7h', progress: 100, unlocked: true },
        { icon: <Trophy size={24} color={Colors.secondary} />, title: 'Primeira Vitória', sub: 'Vença seu primeiro duelo', progress: 60, unlocked: false },
      ]
    },
  ];

  const totalUnlocked = groups.reduce((acc, g) => acc + g.items.filter(i => i.unlocked).length, 0);
  const total = groups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.headerSub}>PERFIL</Text>
          <Text style={s.headerTitle}>Conquistas</Text>
        </View>
        <View style={s.headerRight}>
          <View style={s.gemTag}><Text style={s.gemText}>💎 48</Text></View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* Streak Hero Banner */}
        <View style={s.heroBanner}>
          <LinearGradient colors={[Colors.primary, '#C2410C', '#7C2D12']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={s.heroGlowCircle} />
          <View style={s.heroLeft}>
            <Text style={s.heroTag}>META DE LONGO PRAZO</Text>
            <Text style={s.heroMain}>60 Dias de Fogo</Text>
            <View style={s.heroBarTrack}>
              <View style={[s.heroBarFill, { width: '78%' }]} />
            </View>
            <Text style={s.heroStat}>47 de 60 dias · 78% completo</Text>
          </View>
          <View style={s.heroRight}>
            <Text style={{ fontSize: 56 }}>🔥</Text>
            <Text style={s.heroRightSub}>13 dias</Text>
          </View>
        </View>

        {/* Progress overview */}
        <View style={s.progressOverview}>
          <View style={s.progressItem}>
            <Text style={s.progressNum}>{totalUnlocked}</Text>
            <Text style={s.progressLbl}>Desbloqueadas</Text>
          </View>
          <View style={s.progressDivider} />
          <View style={s.progressItem}>
            <Text style={s.progressNum}>{total - totalUnlocked}</Text>
            <Text style={s.progressLbl}>Bloqueadas</Text>
          </View>
          <View style={s.progressDivider} />
          <View style={s.progressItem}>
            <Text style={[s.progressNum, { color: Colors.gold }]}>{Math.round((totalUnlocked / total) * 100)}%</Text>
            <Text style={s.progressLbl}>Completadas</Text>
          </View>
        </View>

        {/* Title Card */}
        <Text style={s.sectionTitle}>SEU TÍTULO ATUAL</Text>
        <View style={s.titleCard}>
          <LinearGradient colors={['#1A1238', '#0D0A1C']} style={StyleSheet.absoluteFill} />
          <View style={s.titleCardBorder} />
          <Text style={s.titleDisplay}>{selectedTitle}</Text>
          <Text style={s.titleHint}>Toque em outro título para equipar</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 28 }} contentContainerStyle={{ paddingRight: 20 }}>
          {TITLES.map(t => (
            <TouchableOpacity
              key={t.id}
              disabled={!t.unlocked}
              onPress={() => setSelectedTitle(t.text)}
              style={[
                s.titlePill,
                selectedTitle === t.text && s.titlePillActive,
                !t.unlocked && s.titlePillLocked,
              ]}
            >
              <Text style={[s.titlePillText, selectedTitle === t.text && { color: Colors.background }]}>{t.text}</Text>
              {!t.unlocked && <Lock size={10} color={Colors.textDim} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Achievement Groups */}
        {groups.map(group => (
          <View key={group.label} style={{ marginBottom: 28 }}>
            <View style={s.groupHeader}>
              <View style={[s.rarityPill, { backgroundColor: group.color + '20', borderColor: group.color + '40' }]}>
                <Text style={{ fontSize: 11 }}>{group.emoji}</Text>
                <Text style={[s.groupLabel, { color: group.color }]}>{group.label}</Text>
              </View>
              <Text style={s.groupCount}>{group.items.filter(i => i.unlocked).length}/{group.items.length}</Text>
            </View>
            {group.items.map((item, i) => (
              <AchievementCard key={i} {...item} color={group.color} rarity={group.label} />
            ))}
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 55 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  headerSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5 },
  headerTitle: { color: Colors.text, fontSize: 26, fontFamily: 'Syne_700', lineHeight: 30 },
  headerRight: { flexDirection: 'row', gap: 8 },
  gemTag: { backgroundColor: Colors.goldDim, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)' },
  gemText: { color: Colors.gold, fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  content: { paddingHorizontal: 20, paddingBottom: 120 },

  heroBanner: { borderRadius: 28, overflow: 'hidden', padding: 22, flexDirection: 'row', alignItems: 'center', marginBottom: 16, minHeight: 140 },
  heroGlowCircle: { position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.05)' },
  heroLeft: { flex: 1 },
  heroRight: { alignItems: 'center' },
  heroTag: { color: 'rgba(255,255,255,0.65)', fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, marginBottom: 6 },
  heroMain: { color: 'white', fontSize: 22, fontFamily: 'Syne_700', marginBottom: 12 },
  heroBarTrack: { height: 7, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  heroBarFill: { height: '100%', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 4 },
  heroStat: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  heroRightSub: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontFamily: 'Fredoka_700Bold', textAlign: 'center', marginTop: 4 },

  progressOverview: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, paddingVertical: 14, marginBottom: 24 },
  progressItem: { flex: 1, alignItems: 'center' },
  progressNum: { color: Colors.text, fontSize: 22, fontFamily: 'Syne_700' },
  progressLbl: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  progressDivider: { width: 1, backgroundColor: Colors.border },

  sectionTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },

  titleCard: { borderRadius: 22, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', height: 88, marginBottom: 14, borderWidth: 1, borderColor: Colors.border },
  titleCardBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(139,92,246,0.12)' },
  titleDisplay: { color: Colors.text, fontSize: 28, fontFamily: 'Syne_700' },
  titleHint: { color: Colors.textMuted, fontSize: 9, fontFamily: 'Fredoka_400Regular', marginTop: 4 },
  titlePill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: Colors.surface, marginRight: 8, borderWidth: 1, borderColor: Colors.border },
  titlePillActive: { backgroundColor: Colors.text, borderColor: Colors.text },
  titlePillLocked: { opacity: 0.35 },
  titlePillText: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_700Bold' },

  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  rarityPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  groupLabel: { fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5 },
  groupCount: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  achieveCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 22, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  achieveIconBox: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  checkSeal: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.background },
  achieveTitle: { color: Colors.text, fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  achieveSub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 2, marginBottom: 10 },
  progressTrack: { height: 4, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden', width: '100%' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressPct: { fontSize: 13, fontFamily: 'Syne_700', marginLeft: 12 },
  lockIcon: { marginLeft: 12, opacity: 0.5 },
});
