import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Plus, Minus, Check, Timer, ArrowRight, Trophy } from 'lucide-react-native';
import { Mascot } from '../../components/Mascot';
import { ChunkyButton } from '../../components/ChunkyButton';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function WorkoutScreen() {
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [activeSet, setActiveSet] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(70);
  const [setsDone, setSetsDone] = useState([false, false, false, false]);

  const handleSetToggle = (index) => {
    const newSets = [...setsDone];
    newSets[index] = !newSets[index];
    setSetsDone(newSets);
    
    if (newSets[index]) {
      startRest();
    }
  };

  const startRest = () => {
    setResting(true);
    setRestTime(60);
  };

  useEffect(() => {
    let interval;
    if (resting && restTime > 0) {
      interval = setInterval(() => {
        setRestTime(prev => prev - 1);
      }, 1000);
    } else if (restTime === 0) {
      setResting(false);
    }
    return () => clearInterval(interval);
  }, [resting, restTime]);

  // Rest Timer Progress Animation
  const timerAnim = useRef(new Animated.Value(60)).current;

  return (
    <View style={styles.container}>
      {/* Header HUD Style */}
      <View style={styles.hudHeader}>
        <View style={styles.playerInfo}>
          <View style={styles.lvlCircle}>
            <Text style={styles.lvlText}>14</Text>
          </View>
          <View style={{ gap: 2 }}>
            <Text style={styles.headerLabel}>TREINO ATUAL</Text>
            <Text style={styles.headerSub}>Peito + Tríceps</Text>
          </View>
        </View>
        <View style={{ marginTop: 15, marginRight: -10 }}>
           <Mascot size={90} mood="work" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Active Exercise Card */}
        <View style={styles.threeDCard}>
           <View style={[styles.threeDBase, { backgroundColor: Colors.depthBlue, borderRadius: 32 }]} />
           <View style={[styles.threeDTop, { backgroundColor: Colors.card, borderRadius: 32, padding: 20 }]}>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.exTitle}>Supino Reto</Text>
                  <Text style={styles.exSub}>Meta: 4 × 10 reps</Text>
                </View>
                <View style={styles.recordBadge}>
                   <Text style={styles.recordText}>🏆 Recorde: 70kg</Text>
                </View>
              </View>

              {/* Set Tracker (Horizontal Dots) */}
              <View style={styles.trackerRow}>
                {setsDone.map((done, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    onPress={() => handleSetToggle(idx)}
                    style={[styles.setDot, done && styles.setDotDone]}
                  >
                    {done ? <Check size={14} color="white" /> : <Text style={styles.setDotText}>{idx + 1}</Text>}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.ctrlRow}>
                <Text style={styles.ctrlLabel}>CARGA</Text>
                <TouchableOpacity onPress={() => setCurrentWeight(w => Math.max(0, w - 2.5))} style={styles.ctrlBtn}>
                   <Minus size={20} color="white" />
                </TouchableOpacity>
                <View style={styles.ctrlVal}>
                   <Text style={[styles.ctrlValText, currentWeight > 70 && { color: Colors.glowGreen }]}>
                     {currentWeight}
                     <Text style={{fontSize: 12}}> kg</Text>
                   </Text>
                </View>
                <TouchableOpacity onPress={() => setCurrentWeight(w => w + 2.5)} style={styles.ctrlBtn}>
                   <Plus size={20} color="white" />
                </TouchableOpacity>
              </View>

              {currentWeight > 70 && (
                <View style={styles.newRecordAlert}>
                   <Zap size={14} color={Colors.glowGreen} />
                   <Text style={styles.newRecordText}>NOVO RECORDE PESSOAL!</Text>
                </View>
              )}

              <View style={{ marginTop: 10 }}>
                <ChunkyButton 
                  title={setsDone.every(d => d) ? "EXERCÍCIO CONCLUÍDO" : "CONCLUIR SÉRIE"} 
                  onPress={() => {
                    const firstUnfinished = setsDone.findIndex(d => !d);
                    if (firstUnfinished !== -1) handleSetToggle(firstUnfinished);
                  }} 
                  color={setsDone.every(d => d) ? Colors.skyBlue : Colors.glowGreen} 
                  depthColor={setsDone.every(d => d) ? Colors.depthBlue : Colors.depthGreen}
                />
              </View>
           </View>
        </View>

        {/* Rest Timer Overlay/Card */}
        {resting && (
          <View style={styles.restCard}>
            <LinearGradient colors={['#102A16', '#08160E']} style={[StyleSheet.absoluteFill, { borderRadius: 24 }]} />
            <View style={styles.restContent}>
               <Timer size={24} color={Colors.glowGreen} />
               <View style={{flex: 1, marginLeft: 15}}>
                 <Text style={styles.restTitle}>DESCANSO ATIVO</Text>
                 <Text style={styles.restSub}>Respira fundo! Sua capivara está bebendo água...</Text>
               </View>
               <View style={styles.timerCircle}>
                  <Text style={styles.timerNum}>{restTime}s</Text>
               </View>
            </View>
            <TouchableOpacity onPress={() => setResting(false)} style={styles.skipBtn}>
               <Text style={styles.skipText}>PULAR</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Next Exercises (Queue) */}
        <View style={styles.queueHeader}>
           <Text style={styles.queueTitle}>PRÓXIMOS EXERCÍCIOS</Text>
        </View>

        {[
          { title: 'Crucifixo Inclinado', sets: '3 × 12', rec: '14kg' },
          { title: 'Tríceps Pulley', sets: '4 × 15', rec: '30kg' },
          { title: 'Elevação Lateral', sets: '3 × 20', rec: '8kg' },
        ].map((item, i) => (
          <View key={i} style={[styles.threeDCard, { height: 100, opacity: 0.6, marginTop: 12 }]}>
            <View style={[styles.threeDBase, { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24 }]} />
            <View style={[styles.threeDTop, { backgroundColor: Colors.background, borderRadius: 24, padding: 15, justifyContent: 'center' }]}>
              <View style={styles.headerRow}>
                 <View>
                   <Text style={[styles.exTitle, { fontSize: 16 }]}>{item.title}</Text>
                   <Text style={styles.exSub}>{item.sets} reps</Text>
                 </View>
                 <Text style={[styles.recordText, { fontSize: 10 }]}>🏆 {item.rec}</Text>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footerOverlay}>
         <LinearGradient colors={['transparent', Colors.background]} style={StyleSheet.absoluteFill} />
         <TouchableOpacity style={styles.finishWorkout}>
            <LinearGradient colors={[Colors.skyBlue, '#00A0B2']} style={StyleSheet.absoluteFill} />
            <Text style={styles.finishText}>ENCERRAR TREINO</Text>
            <ArrowRight size={20} color="white" />
         </TouchableOpacity>
      </View>
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 150 },

  threeDCard: { height: 280, position: 'relative', marginBottom: 12 },
  threeDBase: { position: 'absolute', top: 8, left: 0, right: 0, bottom: 0 },
  threeDTop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)' },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  exTitle: { fontSize: 20, color: Colors.text, fontFamily: 'Fredoka_700Bold' },
  exSub: { fontSize: 14, color: Colors.textDim, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  recordBadge: { backgroundColor: 'rgba(255,215,0,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  recordText: { fontSize: 11, color: Colors.sunGold, fontFamily: 'Fredoka_700Bold' },

  trackerRow: { flexDirection: 'row', gap: 10, marginVertical: 15 },
  setDot: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  setDotDone: { backgroundColor: Colors.glowGreen, borderColor: Colors.glowGreen },
  setDotText: { color: 'white', fontFamily: 'Fredoka_700Bold' },

  ctrlRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 10 },
  ctrlLabel: { fontSize: 10, fontFamily: 'Fredoka_700Bold', color: Colors.textDim, minWidth: 50 },
  ctrlBtn: { width: 44, height: 44, backgroundColor: Colors.cardLight, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  ctrlVal: { backgroundColor: Colors.background, borderWidth: 2, borderColor: Colors.rim, borderRadius: 12, paddingVertical: 8, width: 100, alignItems: 'center' },
  ctrlValText: { color: Colors.text, fontSize: 20, fontFamily: 'Fredoka_700Bold' },
  
  newRecordAlert: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 15 },
  newRecordText: { fontSize: 10, fontFamily: 'Fredoka_700Bold', color: Colors.glowGreen, letterSpacing: 1 },

  restCard: { height: 80, borderRadius: 24, marginBottom: 20, position: 'relative', overflow: 'hidden' },
  restContent: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  restTitle: { color: Colors.glowGreen, fontSize: 12, fontFamily: 'Fredoka_700Bold' },
  restSub: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: 'Fredoka_400Regular' },
  timerCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.glowGreen },
  timerNum: { color: 'white', fontSize: 16, fontFamily: 'Fredoka_700Bold' },
  skipBtn: { position: 'absolute', right: 70, top: '50%', transform: [{ translateY: -10 }] },
  skipText: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold' },

  queueHeader: { marginVertical: 15 },
  queueTitle: { fontSize: 10, color: Colors.textDim, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },

  footerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, paddingHorizontal: 20, justifyContent: 'center' },
  finishWorkout: { height: 60, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, overflow: 'hidden' },
  finishText: { color: 'white', fontFamily: 'Fredoka_700Bold', fontSize: 16, letterSpacing: 1 },
});
