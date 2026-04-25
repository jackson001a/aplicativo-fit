import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Star, Zap, Crown, Medal, Check, Flame } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const TITLES = [
  { id: 1, text: '🌱 Novato', unlocked: true },
  { id: 2, text: '⚡ Dedicado', unlocked: true },
  { id: 3, text: '⚔️ Guerreiro', unlocked: false },
  { id: 4, text: '🔥 Imparável', unlocked: false },
  { id: 5, text: '👑 Lendário', unlocked: false },
];

function AchievementCard({ icon, title, sub, progress, unlocked, color }: any) {
  return (
    <View style={[s.achieveCard, !unlocked && { opacity: 0.5 }]}>
      <View style={[s.achieveIconBox, { backgroundColor: color + '18' }]}>
        {icon}
        {unlocked && (
          <View style={s.checkSeal}><Check size={10} color="white" strokeWidth={3} /></View>
        )}
      </View>
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={s.achieveTitle}>{title}</Text>
        <Text style={s.achieveSub}>{sub}</Text>
        <View style={s.progressTrack}>
          <LinearGradient
            colors={unlocked ? [Colors.success, '#0EA472'] : [color, color]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[s.progressFill, { width: `${progress}%` }]}
          />
        </View>
      </View>
      <Text style={[s.progressPct, { color: unlocked ? Colors.success : color }]}>{progress}%</Text>
    </View>
  );
}

export default function AchievementsScreen() {
  const [selectedTitle, setSelectedTitle] = useState('⚡ Dedicado');

  const groups = [
    {
      label: 'LENDÁRIO', color: Colors.gold,
      items: [
        { icon: <Crown size={24} color={Colors.gold} />, title: 'Mestre de Tudo', sub: 'Colete todas as insígnias', progress: 10, unlocked: false },
        { icon: <Crown size={24} color={Colors.gold} />, title: '365 Dias', sub: 'Um ano de consistência', progress: 12, unlocked: false },
      ]
    },
    {
      label: 'ÉPICO', color: Colors.purple,
      items: [
        { icon: <Flame size={24} color={Colors.purple} />, title: 'Força Bruta', sub: 'Levante 100 kg no supino', progress: 72, unlocked: true },
        { icon: <Medal size={24} color={Colors.purple} />, title: 'Atleta de Elite', sub: 'Chegue à Liga Diamante', progress: 100, unlocked: true },
      ]
    },
    {
      label: 'RARO', color: Colors.secondary,
      items: [
        { icon: <Zap size={24} color={Colors.secondary} />, title: 'Rápido como Raio', sub: 'Check-in antes das 7h', progress: 100, unlocked: true },
      ]
    },
  ];

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.headerSub}>PERFIL</Text>
          <Text style={s.headerTitle}>Conquistas</Text>
        </View>
        <View style={s.gemTag}>
          <Text style={s.gemText}>💎 48</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* Streak Hero Banner */}
        <View style={s.heroBanner}>
          <LinearGradient colors={[Colors.primary, '#C2410C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={s.heroLeft}>
            <Text style={s.heroTag}>META DE LONGO PRAZO</Text>
            <Text style={s.heroMain}>60 Dias de Fogo</Text>
            <View style={s.heroBarTrack}>
              <View style={[s.heroBarFill, { width: '78%' }]} />
            </View>
            <Text style={s.heroStat}>47 de 60 dias · 78%</Text>
          </View>
          <View style={s.heroRight}>
            <Text style={{ fontSize: 52 }}>🔥</Text>
          </View>
        </View>

        {/* Title Card */}
        <Text style={s.sectionTitle}>SEU TÍTULO ATUAL</Text>
        <View style={s.titleCard}>
          <Text style={s.titleDisplay}>{selectedTitle}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 28 }}>
          {TITLES.map(t => (
            <TouchableOpacity
              key={t.id}
              disabled={!t.unlocked}
              onPress={() => setSelectedTitle(t.text)}
              style={[s.titlePill, selectedTitle === t.text && s.titlePillActive, !t.unlocked && { opacity: 0.35 }]}
            >
              <Text style={[s.titlePillText, selectedTitle === t.text && { color: Colors.background }]}>{t.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Achievement Groups */}
        {groups.map(group => (
          <View key={group.label} style={{ marginBottom: 28 }}>
            <View style={s.groupHeader}>
              <View style={[s.rarityDot, { backgroundColor: group.color }]} />
              <Text style={[s.groupLabel, { color: group.color }]}>{group.label}</Text>
            </View>
            {group.items.map((item, i) => (
              <AchievementCard key={i} {...item} color={group.color} />
            ))}
          </View>
        ))}

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
  gemTag: { backgroundColor: Colors.goldDim, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)' },
  gemText: { color: Colors.gold, fontSize: 15, fontFamily: 'Fredoka_700Bold' },
  content: { paddingHorizontal: 20, paddingBottom: 110 },

  heroBanner: { borderRadius: 28, overflow: 'hidden', padding: 24, flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  heroLeft: { flex: 1 },
  heroRight: {},
  heroTag: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, marginBottom: 6 },
  heroMain: { color: 'white', fontSize: 24, fontFamily: 'Syne_700', marginBottom: 14 },
  heroBarTrack: { height: 8, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 4, overflow: 'hidden', width: 160, marginBottom: 8 },
  heroBarFill: { height: '100%', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 4 },
  heroStat: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  sectionTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },

  titleCard: { backgroundColor: Colors.surface, borderRadius: 22, alignItems: 'center', justifyContent: 'center', height: 90, marginBottom: 14, borderWidth: 1, borderColor: Colors.border },
  titleDisplay: { color: Colors.text, fontSize: 30, fontFamily: 'Syne_700' },
  titlePill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: Colors.surface, marginRight: 10, borderWidth: 1, borderColor: Colors.border },
  titlePillActive: { backgroundColor: Colors.text, borderColor: Colors.text },
  titlePillText: { color: Colors.textDim, fontSize: 13, fontFamily: 'Fredoka_700Bold' },

  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  rarityDot: { width: 8, height: 8, borderRadius: 4 },
  groupLabel: { fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5 },

  achieveCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 22, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  achieveIconBox: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  checkSeal: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.background },
  achieveTitle: { color: Colors.text, fontSize: 15, fontFamily: 'Fredoka_700Bold' },
  achieveSub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 2, marginBottom: 10 },
  progressTrack: { height: 4, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden', width: '100%' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressPct: { fontSize: 13, fontFamily: 'Syne_700', marginLeft: 12 },
});
