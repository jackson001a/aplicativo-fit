import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageSquare, Flame, Trophy, Check, Crown, Heart, Share2 } from 'lucide-react-native';
import { Mascot } from '../../components/Mascot';

const { width } = Dimensions.get('window');

export default function CommunityScreen() {
  const [globalProgress, setGlobalProgress] = useState(4250);
  const globalGoal = 5000;

  return (
    <View style={styles.container}>
      {/* Header HUD Style */}
      <View style={styles.hudHeader}>
        <View style={styles.playerInfo}>
          <View style={styles.lvlCircle}>
            <Text style={styles.lvlText}>14</Text>
          </View>
          <View style={{ gap: 2 }}>
            <Text style={styles.headerLabel}>COMunidade</Text>
            <Text style={styles.headerSub}>Academia CapyWorld</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.giftBtn}>
           <Text style={{fontSize: 22}}>🎁</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. Live Ticker */}
        <View style={styles.tickerCard}>
           <View style={styles.tickerDot} />
           <Text style={styles.tickerText}>Maria R. bateu recorde no Agachamento! · João P. subiu para Liga Ouro ✨</Text>
        </View>

        {/* 2. Global Challenge (Community Goal) */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>DESAFIO GLOBAL DA ACADEMIA</Text>
        </View>
        <View style={styles.challengeCard}>
           <LinearGradient colors={['#102A16', '#0E1A12']} style={StyleSheet.absoluteFill} />
           <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1}}>
                 <Text style={styles.chTitle}>Inverno de Ferro ❄️</Text>
                 <Text style={styles.chSub}>Meta: 5.000 treinos coletivos</Text>
              </View>
              <Mascot size={70} />
           </View>
           <View style={styles.chTrack}>
              <LinearGradient colors={[Colors.skyBlue, Colors.glowGreen]} start={{x:0, y:0}} end={{x:1, y:0}} style={[styles.chFill, { width: `${(globalProgress/globalGoal)*100}%` }]} />
           </View>
           <View style={styles.chFooter}>
              <Text style={styles.chStats}>{globalProgress} / {globalGoal} treinos</Text>
              <Text style={styles.chBonus}>Recompensa: +200💎</Text>
           </View>
        </View>

        {/* 3. Feed List */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>ATIVIDADE RECENTE</Text>
        </View>

        <FeedItem 
          type="RECORD"
          user="Maria R." 
          title="Novo Recorde! 🏆" 
          msg="Bateu 120kg no Agachamento Livre. Superou a meta de 115kg!"
          time="Há 12 min"
          avatar="👩‍🚀"
          reactions={{ claps: 24, fire: 12 }}
        />

        <FeedItem 
          type="STREAK"
          user="João P." 
          title="Imparável 🔥" 
          msg="João completou 100 dias seguidos de treino! Ganhou o título 'Lendário'."
          time="Há 45 min"
          avatar="🥷"
          reactions={{ claps: 56, fire: 42 }}
        />

        <FeedItem 
          type="CHECKIN"
          user="Você" 
          title="Presença Confirmada ✅" 
          msg="Você acaba de entrar na Academia CapyWorld. Bom treino!"
          time="Agora"
          avatar="👤"
          me
        />

        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
}

function FeedItem({ type, user, title, msg, time, avatar, reactions, me }) {
  const getColors = () => {
    if (type === 'RECORD') return [Colors.sunGold, 'rgba(255,168,32,0.1)'];
    if (type === 'STREAK') return [Colors.lavaOrange, 'rgba(255,125,0,0.1)'];
    return [Colors.skyBlue, 'rgba(0,229,255,0.1)'];
  };

  const [color, bgColor] = getColors();

  return (
    <View style={[styles.feedCard, me && styles.feedCardMe]}>
       <View style={styles.feedTop}>
          <View style={[styles.avatarBox, { backgroundColor: bgColor }]}>
             <Text style={{fontSize: 20}}>{avatar}</Text>
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
             <Text style={styles.feedUser}>{user} <Text style={styles.feedTime}>· {time}</Text></Text>
             <Text style={[styles.feedTitle, { color }]}>{title}</Text>
          </View>
          <TouchableOpacity><Share2 size={18} color={Colors.textDim} /></TouchableOpacity>
       </View>
       <Text style={styles.feedMsg}>{msg}</Text>
       {!me && reactions && (
          <View style={styles.reactionRow}>
             <TouchableOpacity style={styles.reactBtn}><Text style={styles.reactEmoji}>👏</Text><Text style={styles.reactNum}>{reactions.claps}</Text></TouchableOpacity>
             <TouchableOpacity style={styles.reactBtn}><Text style={styles.reactEmoji}>🔥</Text><Text style={styles.reactNum}>{reactions.fire}</Text></TouchableOpacity>
             <TouchableOpacity style={styles.reactBtn}><MessageSquare size={14} color={Colors.textDim} /></TouchableOpacity>
          </View>
       )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 50 },
  hudHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
  playerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lvlCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.capyBrown, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.1)' },
  lvlText: { color: Colors.text, fontFamily: 'Fredoka_700Bold', fontSize: 18 },
  headerLabel: { color: Colors.text, fontSize: 15, fontFamily: 'Fredoka_700Bold' },
  headerSub: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular' },
  giftBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.cardLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.rim },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },

  tickerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 16, marginBottom: 20 },
  tickerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.glowGreen, marginRight: 10 },
  tickerText: { color: Colors.skyBlue, fontSize: 10, fontFamily: 'Fredoka_500Medium', flex: 1 },

  sectionHeader: { marginVertical: 15 },
  sectionTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },

  challengeCard: { borderRadius: 32, overflow: 'hidden', padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(112, 214, 60, 0.2)' },
  chTitle: { color: 'white', fontSize: 20, fontFamily: 'Fredoka_700Bold' },
  chSub: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginTop: 4 },
  chTrack: { height: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 6, overflow: 'hidden', marginVertical: 15 },
  chFill: { height: '100%', borderRadius: 6 },
  chFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  chStats: { color: Colors.skyBlue, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
  chBonus: { color: Colors.sunGold, fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  feedCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 32, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 16 },
  feedCardMe: { borderColor: 'rgba(0,229,255,0.2)', backgroundColor: 'rgba(0,229,255,0.02)' },
  feedTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatarBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  feedUser: { color: 'white', fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  feedTime: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular' },
  feedTitle: { fontSize: 16, fontFamily: 'Fredoka_700Bold', marginTop: 2 },
  feedMsg: { color: Colors.textDim, fontSize: 14, fontFamily: 'Fredoka_400Regular', lineHeight: 20, marginBottom: 15 },
  reactionRow: { flexDirection: 'row', gap: 10 },
  reactBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  reactEmoji: { fontSize: 14 },
  reactNum: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_700Bold' },
});
