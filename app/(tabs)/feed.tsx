import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageSquare, Share2, Heart } from 'lucide-react-native';

function FeedCard({ type, user, title, msg, time, avatar, reactions, me }: any) {
  const [liked, setLiked] = useState(false);
  const accentMap: any = {
    RECORD: { color: Colors.gold, bg: Colors.goldDim },
    STREAK: { color: Colors.primary, bg: Colors.primaryDim },
    CHECKIN: { color: Colors.secondary, bg: Colors.secondaryDim },
  };
  const { color, bg } = accentMap[type] || accentMap.CHECKIN;

  return (
    <View style={[s.feedCard, me && { borderColor: Colors.secondaryDim }]}>
      <View style={s.feedTop}>
        <View style={[s.feedAvatar, { backgroundColor: bg }]}>
          <Text style={{ fontSize: 20 }}>{avatar}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.feedUser}>{user} <Text style={s.feedTime}>· {time}</Text></Text>
          <Text style={[s.feedTitle, { color }]}>{title}</Text>
        </View>
        <TouchableOpacity><Share2 size={16} color={Colors.textDim} /></TouchableOpacity>
      </View>
      <Text style={s.feedMsg}>{msg}</Text>
      {!me && reactions && (
        <View style={s.reactionRow}>
          <TouchableOpacity onPress={() => setLiked(!liked)} style={[s.reactBtn, liked && { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
            <Heart size={13} color={liked ? Colors.danger : Colors.textDim} fill={liked ? Colors.danger : 'none'} />
            <Text style={[s.reactNum, liked && { color: Colors.danger }]}>{reactions.claps + (liked ? 1 : 0)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.reactBtn}>
            <Text style={{ fontSize: 13 }}>🔥</Text>
            <Text style={s.reactNum}>{reactions.fire}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.reactBtn}>
            <MessageSquare size={13} color={Colors.textDim} />
          </TouchableOpacity>
        </View>
      )}
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
        <TouchableOpacity style={s.giftBtn}><Text style={{ fontSize: 20 }}>🎁</Text></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* Live ticker */}
        <View style={s.ticker}>
          <View style={s.tickerDot} />
          <Text style={s.tickerText} numberOfLines={1}>
            Maria R. bateu recorde no Agachamento! · João P. subiu para Liga Ouro ✨
          </Text>
        </View>

        {/* Global Challenge */}
        <Text style={s.sectionTitle}>DESAFIO GLOBAL</Text>
        <View style={s.challengeCard}>
          <LinearGradient colors={['#071A10', '#040F09']} style={StyleSheet.absoluteFill} />
          <View style={s.challengeCardBorder} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.chTitle}>Inverno de Ferro ❄️</Text>
              <Text style={s.chSub}>Meta coletiva: {globalGoal.toLocaleString()} treinos</Text>
            </View>
            <View style={s.chPctBadge}>
              <Text style={s.chPct}>{pct}%</Text>
            </View>
          </View>
          <View style={s.chBar}>
            <LinearGradient colors={[Colors.secondary, Colors.success]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.chFill, { width: `${pct}%` }]} />
          </View>
          <View style={s.chFooter}>
            <Text style={s.chCount}>{globalProgress.toLocaleString()} treinos realizados</Text>
            <Text style={s.chReward}>Recompensa: +200💎</Text>
          </View>
        </View>

        {/* Activity Feed */}
        <Text style={s.sectionTitle}>ATIVIDADE RECENTE</Text>

        <FeedCard
          type="RECORD" user="Maria R." title="Novo Recorde! 🏆"
          msg="Bateu 120 kg no Agachamento Livre. Superou a meta de 115 kg!"
          time="12 min" avatar="👩‍🚀" reactions={{ claps: 24, fire: 12 }}
        />
        <FeedCard
          type="STREAK" user="João P." title="Imparável 🔥"
          msg="João completou 100 dias seguidos! Ganhou o título 'Lendário'."
          time="45 min" avatar="🥷" reactions={{ claps: 56, fire: 42 }}
        />
        <FeedCard
          type="CHECKIN" user="Você" title="Presença Confirmada ✅"
          msg="Você acaba de entrar na Academia CapyWorld. Bom treino!"
          time="Agora" avatar="👤" me
        />

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
  giftBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  content: { paddingHorizontal: 20, paddingBottom: 110 },

  ticker: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  tickerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success, marginRight: 10 },
  tickerText: { color: Colors.secondary, fontSize: 11, fontFamily: 'Fredoka_700Bold', flex: 1 },

  sectionTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },

  challengeCard: { borderRadius: 26, overflow: 'hidden', padding: 22, marginBottom: 28, borderWidth: 1, borderColor: Colors.border },
  challengeCardBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 26, borderWidth: 1, borderColor: 'rgba(16,185,129,0.12)' },
  chTitle: { color: Colors.text, fontSize: 20, fontFamily: 'Syne_700', marginBottom: 4 },
  chSub: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular' },
  chPctBadge: { backgroundColor: Colors.successDim, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  chPct: { color: Colors.success, fontSize: 16, fontFamily: 'Syne_700' },
  chBar: { height: 6, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  chFill: { height: '100%', borderRadius: 3 },
  chFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  chCount: { color: Colors.secondary, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  chReward: { color: Colors.gold, fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  feedCard: { backgroundColor: Colors.surface, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 14 },
  feedTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  feedAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  feedUser: { color: Colors.text, fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  feedTime: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular' },
  feedTitle: { fontSize: 15, fontFamily: 'Syne_700', marginTop: 2 },
  feedMsg: { color: Colors.textDim, fontSize: 13, fontFamily: 'Fredoka_400Regular', lineHeight: 20, marginBottom: 14 },
  reactionRow: { flexDirection: 'row', gap: 8 },
  reactBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.surfaceElevated, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  reactNum: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_700Bold' },
});
