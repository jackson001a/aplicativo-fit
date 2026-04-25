import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageSquare, Share2, Heart, Sword, ChevronRight, Users } from 'lucide-react-native';

const STORIES = [
  { user: 'Maria R.', avatar: '👩‍🚀', color: Colors.gold, active: true, type: '🏆' },
  { user: 'João P.', avatar: '🥷', color: Colors.primary, active: true, type: '🔥' },
  { user: 'Ana C.', avatar: '🧘', color: Colors.success, active: false, type: '✅' },
  { user: 'Pedro L.', avatar: '🏋️', color: Colors.purple, active: false, type: '💪' },
  { user: 'Carol S.', avatar: '🦸‍♀️', color: Colors.secondary, active: true, type: '⚡' },
];

const LEAGUE = [
  { pos: 1, name: 'Maria R.', avatar: '👩‍🚀', xp: 890, streak: 89, color: Colors.gold },
  { pos: 2, name: 'João P.', avatar: '🥷', xp: 720, streak: 51, color: '#9CA3AF' },
  { pos: 3, name: 'Carol S.', avatar: '🦸‍♀️', xp: 610, streak: 33, color: '#CD7F32' },
  { pos: 4, name: 'Você ⚡', avatar: '👤', xp: 580, streak: 47, color: Colors.secondary, me: true },
  { pos: 5, name: 'Pedro L.', avatar: '🏋️', xp: 430, streak: 22, color: Colors.textDim },
];

function StoryBubble({ user, avatar, color, active, type }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity onPress={press} style={s.storyItem} activeOpacity={0.9}>
        <View style={[s.storyRing, { borderColor: active ? color : Colors.border }]}>
          <View style={[s.storyInner, { backgroundColor: color + '20' }]}>
            <Text style={{ fontSize: 22 }}>{avatar}</Text>
          </View>
          {active && (
            <View style={[s.storyBadge, { backgroundColor: color }]}>
              <Text style={{ fontSize: 8 }}>{type}</Text>
            </View>
          )}
        </View>
        <Text style={[s.storyName, active && { color: Colors.text }]} numberOfLines={1}>{user.split(' ')[0]}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function FeedCard({ type, user, title, msg, time, avatar, reactions, me }: any) {
  const [liked, setLiked] = useState(false);
  const [fireCount, setFireCount] = useState(reactions?.fire ?? 0);
  const [fired, setFired] = useState(false);
  const accentMap: any = {
    RECORD: { color: Colors.gold, bg: Colors.goldDim, icon: '🏆' },
    STREAK: { color: Colors.primary, bg: Colors.primaryDim, icon: '🔥' },
    CHECKIN: { color: Colors.secondary, bg: Colors.secondaryDim, icon: '✅' },
    LEVEL: { color: Colors.purple, bg: Colors.purpleDim, icon: '⬆️' },
  };
  const { color, bg, icon } = accentMap[type] || accentMap.CHECKIN;
  return (
    <View style={[s.feedCard, me && { borderColor: Colors.secondaryDim }]}>
      {me && <LinearGradient colors={['rgba(61,139,255,0.04)', 'transparent']} style={[StyleSheet.absoluteFill, { borderRadius: 24 }]} />}
      <View style={s.feedTop}>
        <View style={[s.feedAvatar, { backgroundColor: bg }]}>
          <Text style={{ fontSize: 20 }}>{avatar}</Text>
          <View style={[s.feedBadge, { backgroundColor: color }]}>
            <Text style={{ fontSize: 8 }}>{icon}</Text>
          </View>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.feedUser}>{user} {me && <Text style={[s.youTag]}>você</Text>}</Text>
          <Text style={s.feedTime}>{time}</Text>
        </View>
        <TouchableOpacity style={s.shareBtn}><Share2 size={14} color={Colors.textDim} /></TouchableOpacity>
      </View>
      <Text style={[s.feedTitle, { color }]}>{title}</Text>
      <Text style={s.feedMsg}>{msg}</Text>
      {!me && (
        <View style={s.reactionRow}>
          <TouchableOpacity onPress={() => setLiked(l => !l)} style={[s.reactBtn, liked && s.reactBtnActive]}>
            <Heart size={13} color={liked ? Colors.danger : Colors.textDim} fill={liked ? Colors.danger : 'none'} />
            <Text style={[s.reactNum, liked && { color: Colors.danger }]}>{(reactions?.claps ?? 0) + (liked ? 1 : 0)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setFired(f => !f); setFireCount(c => fired ? c - 1 : c + 1); }} style={[s.reactBtn, fired && { backgroundColor: Colors.primaryDim, borderColor: 'rgba(255,92,34,0.25)' }]}>
            <Text style={{ fontSize: 12 }}>🔥</Text>
            <Text style={[s.reactNum, fired && { color: Colors.primary }]}>{fireCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.reactBtn}>
            <MessageSquare size={13} color={Colors.textDim} />
            <Text style={s.reactNum}>Comentar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function LeagueRow({ pos, name, avatar, xp, streak, color, me }: any) {
  return (
    <View style={[s.leagueRow, me && s.leagueRowMe]}>
      <Text style={[s.leaguePos, { color }]}>{pos}</Text>
      <View style={[s.leagueAvatar, { backgroundColor: color + '20' }]}>
        <Text style={{ fontSize: 14 }}>{avatar}</Text>
      </View>
      <Text style={[s.leagueName, me && { color: Colors.secondary }]}>{name}</Text>
      <Text style={s.leagueStreak}>🔥{streak}</Text>
      <Text style={[s.leagueXp, me && { color: Colors.secondary }]}>{xp}xp</Text>
    </View>
  );
}

export default function CommunityScreen() {
  const [globalProgress] = useState(4250);
  const globalGoal = 5000;
  const pct = Math.round((globalProgress / globalGoal) * 100);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.headerSub}>ACADEMIA CAPYWORLD</Text>
          <Text style={s.headerTitle}>Comunidade</Text>
        </View>
        <View style={s.headerActions}>
          <TouchableOpacity style={s.iconBtn}><Users size={18} color={Colors.textDim} /></TouchableOpacity>
          <TouchableOpacity style={s.iconBtn}><Text style={{ fontSize: 18 }}>🎁</Text></TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* Stories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.storiesRow} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {STORIES.map((story, i) => <StoryBubble key={i} {...story} />)}
        </ScrollView>

        {/* Live ticker */}
        <View style={s.ticker}>
          <View style={s.tickerDot} />
          <Text style={s.tickerText} numberOfLines={1}>
            🔴 AO VIVO · Maria bateu 120 kg · João subiu para Liga Ouro ✨ · Carol fez check-in
          </Text>
        </View>

        {/* Duel banner */}
        <View style={s.duelBanner}>
          <LinearGradient colors={['#1A0622', '#0E0316']} style={StyleSheet.absoluteFill} />
          <View style={s.duelBannerBorder} />
          <Sword size={18} color={Colors.purple} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.duelLabel}>DUELO EM ANDAMENTO</Text>
            <Text style={s.duelTitle}>João P. está 140 xp à frente!</Text>
            <Text style={s.duelSub}>Você tem 18h para virar o jogo 💪</Text>
          </View>
          <TouchableOpacity style={s.duelBtn}>
            <Text style={s.duelBtnText}>Atacar</Text>
            <ChevronRight size={13} color="white" />
          </TouchableOpacity>
        </View>

        {/* Mini league */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>LIGA OURO</Text>
          <View style={s.countdownTag}><Text style={s.countdownText}>⏳ 2d 14h</Text></View>
        </View>
        <View style={s.leagueCard}>
          {LEAGUE.map((row, i) => (
            <View key={i}>
              {i > 0 && <View style={s.leagueDivider} />}
              <LeagueRow {...row} />
            </View>
          ))}
        </View>

        {/* Global challenge */}
        <Text style={s.sectionTitle}>DESAFIO GLOBAL</Text>
        <View style={s.challengeCard}>
          <LinearGradient colors={['#071A10', '#040F09']} style={StyleSheet.absoluteFill} />
          <View style={s.challengeBorder} />
          <View style={s.challengeTop}>
            <View style={{ flex: 1 }}>
              <Text style={s.chTitle}>Inverno de Ferro ❄️</Text>
              <Text style={s.chSub}>Meta coletiva: {globalGoal.toLocaleString()} treinos</Text>
            </View>
            <View style={s.chPct}><Text style={s.chPctText}>{pct}%</Text></View>
          </View>
          <View style={s.chBar}>
            <LinearGradient colors={[Colors.secondary, Colors.success]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.chFill, { width: `${pct}%` }]} />
          </View>
          <View style={s.chFooter}>
            <Text style={s.chCount}>{globalProgress.toLocaleString()} realizados</Text>
            <Text style={s.chReward}>Recompensa: +200💎</Text>
          </View>
        </View>

        {/* Feed */}
        <Text style={s.sectionTitle}>ATIVIDADE RECENTE</Text>
        <FeedCard type="RECORD" user="Maria R." title="Novo Recorde! 🏆" msg="Bateu 120 kg no Agachamento. Superou a meta pessoal de 115 kg!" time="12 min" avatar="👩‍🚀" reactions={{ claps: 24, fire: 12 }} />
        <FeedCard type="LEVEL" user="João P." title="Subiu para Nível 18! ⬆️" msg="200 treinos completos, 100 dias de streak. Simplesmente lendário." time="28 min" avatar="🥷" reactions={{ claps: 56, fire: 42 }} />
        <FeedCard type="STREAK" user="Carol S." title="Imparável 🔥" msg="33 dias seguidos! Ela não para nunca. Siga o exemplo!" time="1h" avatar="🦸‍♀️" reactions={{ claps: 18, fire: 30 }} />
        <FeedCard type="CHECKIN" user="Você" title="Presença confirmada ✅" msg="Você entrou na CapyWorld. Bom treino hoje! A capivara conta com você." time="Agora" avatar="👤" me />

        <View style={{ height: 130 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 55 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  headerSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5 },
  headerTitle: { color: Colors.text, fontSize: 26, fontFamily: 'Syne_700' },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 42, height: 42, borderRadius: 13, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  content: { paddingBottom: 120 },

  storiesRow: { marginBottom: 16 },
  storyItem: { alignItems: 'center', gap: 6, width: 60 },
  storyRing: { width: 56, height: 56, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  storyInner: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  storyBadge: { position: 'absolute', top: -5, right: -5, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.background },
  storyName: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', textAlign: 'center', textTransform: 'uppercase' },

  ticker: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 13, marginBottom: 16, borderWidth: 1, borderColor: Colors.border, marginHorizontal: 20 },
  tickerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.danger, marginRight: 10 },
  tickerText: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_700Bold', flex: 1 },

  duelBanner: { borderRadius: 22, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: Colors.border, marginHorizontal: 20, marginBottom: 24 },
  duelBannerBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(139,92,246,0.18)' },
  duelLabel: { color: Colors.purple, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, marginBottom: 2 },
  duelTitle: { color: Colors.text, fontSize: 14, fontFamily: 'Syne_700' },
  duelSub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  duelBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.purple, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  duelBtnText: { color: 'white', fontSize: 12, fontFamily: 'Fredoka_700Bold' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase', paddingHorizontal: 20, marginBottom: 12 },
  countdownTag: { backgroundColor: Colors.dangerDim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  countdownText: { color: Colors.danger, fontSize: 10, fontFamily: 'Fredoka_700Bold' },

  leagueCard: { backgroundColor: Colors.surface, borderRadius: 24, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginHorizontal: 20, marginBottom: 24 },
  leagueRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13 },
  leagueRowMe: { backgroundColor: Colors.secondaryDim },
  leagueDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
  leaguePos: { width: 22, fontSize: 15, fontFamily: 'Syne_700', marginRight: 10 },
  leagueAvatar: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  leagueName: { flex: 1, color: Colors.text, fontSize: 13, fontFamily: 'Fredoka_700Bold' },
  leagueStreak: { color: Colors.primary, fontSize: 11, fontFamily: 'Fredoka_700Bold', marginRight: 12 },
  leagueXp: { color: Colors.textDim, fontSize: 12, fontFamily: 'Syne_700' },

  challengeCard: { borderRadius: 26, overflow: 'hidden', padding: 20, marginBottom: 24, borderWidth: 1, borderColor: Colors.border, marginHorizontal: 20 },
  challengeBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 26, borderWidth: 1, borderColor: 'rgba(16,185,129,0.1)' },
  challengeTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  chTitle: { color: Colors.text, fontSize: 18, fontFamily: 'Syne_700', marginBottom: 3 },
  chSub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular' },
  chPct: { backgroundColor: Colors.successDim, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  chPctText: { color: Colors.success, fontSize: 16, fontFamily: 'Syne_700' },
  chBar: { height: 6, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  chFill: { height: '100%', borderRadius: 3 },
  chFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  chCount: { color: Colors.secondary, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  chReward: { color: Colors.gold, fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  feedCard: { backgroundColor: Colors.surface, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: Colors.border, marginBottom: 12, marginHorizontal: 20, overflow: 'hidden' },
  feedTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  feedAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  feedBadge: { position: 'absolute', bottom: -4, right: -4, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.background },
  feedUser: { color: Colors.text, fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  youTag: { color: Colors.secondary, fontSize: 10, fontFamily: 'Fredoka_700Bold' },
  feedTime: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_400Regular', marginTop: 1 },
  shareBtn: { padding: 4 },
  feedTitle: { fontSize: 16, fontFamily: 'Syne_700', marginBottom: 6 },
  feedMsg: { color: Colors.textDim, fontSize: 13, fontFamily: 'Fredoka_400Regular', lineHeight: 20, marginBottom: 14 },
  reactionRow: { flexDirection: 'row', gap: 8 },
  reactBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.surfaceElevated, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: Colors.border },
  reactBtnActive: { backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' },
  reactNum: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
});
