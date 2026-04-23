import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Mascot } from '../../components/Mascot';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Star, Zap, Flame, Crown, Medal, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const TITLES = [
  { id: 1, text: '🌱 Novato', unlocked: true },
  { id: 2, text: '⚡ Dedicado', unlocked: true },
  { id: 3, text: '⚔️ Guerreiro', unlocked: false },
  { id: 4, text: '🔥 Imparável', unlocked: false },
  { id: 5, text: '👑 Lendário', unlocked: false },
];

export default function AchievementsScreen() {
  const [selectedTitle, setSelectedTitle] = useState('⚡ Dedicado');

  return (
    <View style={styles.container}>
      {/* Header HUD Style */}
      <View style={styles.hudHeader}>
        <View style={styles.playerInfo}>
          <View style={styles.lvlCircle}>
            <Text style={styles.lvlText}>14</Text>
          </View>
          <View style={{ gap: 2 }}>
             <Text style={styles.headerLabel}>CONQUISTAS</Text>
             <Text style={styles.headerSub}>4 obtidas · 12 para desbloquear</Text>
          </View>
        </View>
        <View style={styles.gemPill}>
           <Text style={styles.gemText}>💎 48</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. Selected Title Section */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>SEU TÍTULO ATUAL</Text>
        </View>
        <View style={styles.titleCard}>
           <LinearGradient colors={['#1A1238', '#13102A']} style={StyleSheet.absoluteFill} />
           <Text style={styles.titleDisplay}>{selectedTitle}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.titlePicker}>
           {TITLES.map(title => (
             <TouchableOpacity 
               key={title.id} 
               disabled={!title.unlocked}
               onPress={() => setSelectedTitle(title.text)}
               style={[
                 styles.titlePill, 
                 selectedTitle === title.text && styles.titlePillActive,
                 !title.unlocked && styles.titlePillLocked
               ]}
             >
               <Text style={[styles.titlePillText, !title.unlocked && { opacity: 0.3 }]}>{title.text}</Text>
               {!title.unlocked && <Star size={10} color="rgba(255,255,255,0.2)" />}
             </TouchableOpacity>
           ))}
        </ScrollView>

        {/* 2. Streak Progress Hero (HTML style) */}
        <View style={styles.heroCard}>
           <LinearGradient colors={[Colors.lavaOrange, Colors.joyPink]} start={{x:0, y:0}} end={{x:1, y:1}} style={StyleSheet.absoluteFill} />
           <View style={styles.heroContent}>
              <View style={styles.heroText}>
                 <Text style={styles.heroSubtitle}>META DE LONGO PRAZO</Text>
                 <Text style={styles.heroMainTitle}>60 Dias de Fogo</Text>
                 <View style={styles.heroBarContainer}>
                    <View style={[styles.heroBarFill, { width: '78%' }]} />
                 </View>
                 <Text style={styles.heroStats}>47 de 60 dias (78%)</Text>
              </View>
              <Mascot size={100} mood="zen" />
           </View>
        </View>

        {/* 3. Rarities Grid */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>CONQUISTAS POR RARIDADE</Text>
        </View>
        
        {/* Legendary achievements */}
        <AchievementGroup title="Lendário" color={Colors.sunGold}>
           <AchievementItem icon={<Crown size={22} color={Colors.sunGold} />} title="Mestre de Tudo" sub="Colete todas as insignias" progress={10} />
           <AchievementItem icon={<Crown size={22} color={Colors.sunGold} />} title="365 Dias" sub="Um ano de consistência" progress={12} />
        </AchievementGroup>

        {/* Epic achievements */}
        <AchievementGroup title="Épico" color={Colors.joyPink}>
           <AchievementItem icon={<Flame size={22} color={Colors.joyPink} />} title="Força Bruta" sub="Levante 100kg no supino" progress={72} unlocked />
           <AchievementItem icon={<Medal size={22} color={Colors.joyPink} />} title="Atleta de Elite" sub="Chegue à Liga Diamante" progress={100} unlocked />
        </AchievementGroup>

        {/* Rare achievements */}
        <AchievementGroup title="Raro" color={Colors.skyBlue}>
           <AchievementItem icon={<Zap size={22} color={Colors.skyBlue} />} title="Rápido como Raio" sub="Faça um check-in antes das 7h" progress={100} unlocked />
        </AchievementGroup>

        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
}

function AchievementGroup({ title, color, children }) {
  return (
    <View style={styles.groupContainer}>
       <View style={[styles.groupBadge, { backgroundColor: color + '20' }]}>
          <Text style={[styles.groupTitle, { color }]}>{title.toUpperCase()}</Text>
       </View>
       {children}
    </View>
  );
}

function AchievementItem({ icon, title, sub, progress, unlocked }) {
  return (
    <View style={[styles.achieveCard, !unlocked && { opacity: 0.6 }]}>
       <View style={styles.achieveIcon}>{icon}</View>
       <View style={{flex: 1, marginLeft: 15}}>
          <Text style={styles.achieveTitle}>{title}</Text>
          <Text style={styles.achieveSub}>{sub}</Text>
          <View style={styles.achieveProgBar}><View style={[styles.achieveProgFill, { width: `${progress}%`, backgroundColor: unlocked ? Colors.glowGreen : Colors.skyBlue }]} /></View>
       </View>
       {unlocked && <View style={styles.checkSeal}><Check size={12} color="white" /></View>}
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
  gemPill: { backgroundColor: 'rgba(255,215,0,0.1)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  gemText: { color: Colors.sunGold, fontSize: 14, fontFamily: 'Fredoka_700Bold' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },
  
  sectionHeader: { marginVertical: 15 },
  sectionTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },

  titleCard: { height: 100, borderRadius: 32, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  titleDisplay: { color: 'white', fontSize: 32, fontFamily: 'Fredoka_700Bold' },
  
  titlePicker: { marginBottom: 24 },
  titlePill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', marginRight: 10, borderWidth: 1, borderColor: 'transparent' },
  titlePillActive: { backgroundColor: 'white' },
  titlePillLocked: { opacity: 0.5 },
  titlePillText: { fontSize: 14, fontFamily: 'Fredoka_700Bold', color: '#666' },
  titlePillActiveText: { color: '#000' },

  heroCard: { height: 160, borderRadius: 32, overflow: 'hidden', padding: 25, marginBottom: 24 },
  heroContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 },
  heroSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },
  heroMainTitle: { color: 'white', fontSize: 24, fontFamily: 'Fredoka_700Bold', marginVertical: 4 },
  heroBarContainer: { height: 10, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 5, width: 140, overflow: 'hidden', marginTop: 10 },
  heroBarFill: { height: '100%', backgroundColor: 'white', borderRadius: 5 },
  heroStats: { color: 'white', fontSize: 10, fontFamily: 'Fredoka_700Bold', marginTop: 8 },

  groupContainer: { marginBottom: 24 },
  groupBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 12 },
  groupTitle: { fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },

  achieveCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 18, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  achieveIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' },
  achieveTitle: { color: 'white', fontSize: 16, fontFamily: 'Fredoka_700Bold' },
  achieveSub: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  achieveProgBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginTop: 10 },
  achieveProgFill: { height: '100%', borderRadius: 3 },
  checkSeal: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.glowGreen, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 18, right: 18 },
});
