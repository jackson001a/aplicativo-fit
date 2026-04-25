import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Minus, Check, Timer, ArrowRight, Zap } from 'lucide-react-native';
import { Mascot } from '../../components/Mascot';
import { ChunkyButton } from '../../components/ChunkyButton';
import { Colors } from '../../constants/Colors';

const EXERCISES = ['Supino Reto', 'Crucifixo Inclinado', 'Tríceps Pulley', 'Elevação Lateral'];

export default function WorkoutScreen() {
  const [restTime, setRestTime] = useState(60);
  const [resting, setResting] = useState(false);
  const [weight, setWeight] = useState(70);
  const [setsDone, setSetsDone] = useState([false, false, false, false]);
  const [sessionSecs, setSessionSecs] = useState(0);
  const [currentEx] = useState(0);

  // Session timer
  useEffect(() => {
    const t = setInterval(() => setSessionSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const sessionTime = `${String(Math.floor(sessionSecs / 60)).padStart(2, '0')}:${String(sessionSecs % 60).padStart(2, '0')}`;

  const toggleSet = (i: number) => {
    const next = [...setsDone];
    next[i] = !next[i];
    setSetsDone(next);
    if (next[i]) { setResting(true); setRestTime(60); }
  };

  useEffect(() => {
    if (!resting || restTime <= 0) { if (restTime <= 0) setResting(false); return; }
    const t = setInterval(() => setRestTime(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [resting, restTime]);

  const allDone = setsDone.every(Boolean);
  const PR = weight > 70;
  const doneCount = setsDone.filter(Boolean).length;

  return (
    <View style={s.container}>
      {/* Header with session timer */}
      <View style={s.header}>
        <View>
          <Text style={s.headerSub}>TREINO EM ANDAMENTO</Text>
          <Text style={s.headerTitle}>Peito + Tríceps</Text>
        </View>
        <View style={s.sessionTimer}>
          <Timer size={13} color={Colors.success} />
          <Text style={s.sessionTime}>{sessionTime}</Text>
        </View>
      </View>

      {/* Exercise progress bar */}
      <View style={s.progressBarWrap}>
        <View style={s.progressBarTrack}>
          <LinearGradient colors={[Colors.primary, Colors.gold]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.progressBarFill, { width: `${((currentEx + (allDone ? 1 : 0)) / EXERCISES.length) * 100}%` }]} />
        </View>
        <Text style={s.progressBarLabel}>Exercício {currentEx + 1} de {EXERCISES.length}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* Active Exercise */}
        <View style={s.exCard}>
          <LinearGradient colors={['#111827', '#0D1117']} style={StyleSheet.absoluteFill} />
          <View style={s.exCardBorder} />

          <View style={s.exHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.exTitle}>Supino Reto</Text>
              <Text style={s.exSub}>4 × 10 reps</Text>
            </View>
            <View style={s.recBadge}><Text style={s.recText}>🏆 70 kg</Text></View>
          </View>

          {/* Set tracker */}
          <View style={s.setRow}>
            {setsDone.map((done, idx) => (
              <TouchableOpacity key={idx} onPress={() => toggleSet(idx)} style={[s.setDot, done && s.setDotDone]} activeOpacity={0.8}>
                {done ? <Check size={15} color="white" strokeWidth={3} /> : <Text style={s.setNum}>{idx + 1}</Text>}
              </TouchableOpacity>
            ))}
            <View style={s.setProgress}>
              <Text style={s.setProgressText}>{doneCount}/4</Text>
              <Text style={s.setProgressSub}>séries</Text>
            </View>
          </View>

          {/* Weight control */}
          <View style={s.weightRow}>
            <Text style={s.weightLabel}>CARGA</Text>
            <TouchableOpacity onPress={() => setWeight(w => Math.max(0, w - 2.5))} style={s.weightBtn}>
              <Minus size={18} color={Colors.text} />
            </TouchableOpacity>
            <View style={[s.weightDisplay, PR && { borderColor: Colors.success }]}>
              <Text style={[s.weightVal, PR && { color: Colors.success }]}>{weight}</Text>
              <Text style={s.weightUnit}>kg</Text>
            </View>
            <TouchableOpacity onPress={() => setWeight(w => w + 2.5)} style={s.weightBtn}>
              <Plus size={18} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {PR && (
            <View style={s.prAlert}>
              <Zap size={13} color={Colors.success} />
              <Text style={s.prText}>NOVO RECORDE PESSOAL!</Text>
            </View>
          )}

          <View style={{ marginTop: 14 }}>
            <ChunkyButton
              title={allDone ? 'PRÓXIMO EXERCÍCIO →' : 'CONCLUIR SÉRIE'}
              onPress={() => { const i = setsDone.findIndex(d => !d); if (i !== -1) toggleSet(i); }}
              color={allDone ? Colors.secondary : Colors.success}
              depthColor={allDone ? Colors.depthBlue : Colors.depthGreen}
            />
          </View>
        </View>

        {/* Rest Timer */}
        {resting && (
          <View style={s.restCard}>
            <LinearGradient colors={['#071A10', '#040C08']} style={[StyleSheet.absoluteFill, { borderRadius: 20 }]} />
            <View style={s.restInner}>
              <Timer size={20} color={Colors.success} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={s.restTitle}>DESCANSO ATIVO</Text>
                <Text style={s.restSub}>Respira fundo! Sua capivara está hidratando…</Text>
              </View>
              <View style={s.restCircle}><Text style={s.restNum}>{restTime}s</Text></View>
            </View>
            {/* Rest progress bar */}
            <View style={s.restBarTrack}>
              <View style={[s.restBarFill, { width: `${(restTime / 60) * 100}%` }]} />
            </View>
            <TouchableOpacity onPress={() => setResting(false)} style={s.skipBtn}>
              <Text style={s.skipText}>PULAR DESCANSO</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Queue */}
        <Text style={s.queueTitle}>PRÓXIMOS</Text>
        {[
          { title: 'Crucifixo Inclinado', sets: '3 × 12', rec: '14 kg' },
          { title: 'Tríceps Pulley', sets: '4 × 15', rec: '30 kg' },
          { title: 'Elevação Lateral', sets: '3 × 20', rec: '8 kg' },
        ].map((item, i) => (
          <View key={i} style={s.queueCard}>
            <View style={s.queueNum}><Text style={s.queueNumText}>{i + 2}</Text></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.queueName}>{item.title}</Text>
              <Text style={s.queueSets}>{item.sets}</Text>
            </View>
            <Text style={s.queueRec}>🏆 {item.rec}</Text>
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={s.footer}>
        <LinearGradient colors={['transparent', Colors.background]} style={StyleSheet.absoluteFill} />
        <TouchableOpacity style={s.finishBtn} activeOpacity={0.9}>
          <LinearGradient colors={[Colors.secondary, '#1D4ED8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          <Text style={s.finishLabel}>ENCERRAR TREINO</Text>
          <View style={s.finishTimeTag}><Text style={s.finishTimeText}>{sessionTime}</Text></View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 55 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  headerSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5 },
  headerTitle: { color: Colors.text, fontSize: 24, fontFamily: 'Syne_700', lineHeight: 28 },
  sessionTimer: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.successDim, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)' },
  sessionTime: { color: Colors.success, fontSize: 16, fontFamily: 'Syne_700' },

  progressBarWrap: { paddingHorizontal: 20, marginBottom: 16 },
  progressBarTrack: { height: 4, backgroundColor: Colors.surface, borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  progressBarFill: { height: '100%', borderRadius: 2 },
  progressBarLabel: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 0.5 },

  content: { paddingHorizontal: 20, paddingBottom: 140 },

  exCard: { borderRadius: 28, overflow: 'hidden', padding: 22, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  exCardBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(61,139,255,0.08)' },
  exHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  exTitle: { color: Colors.text, fontSize: 22, fontFamily: 'Syne_700' },
  exSub: { color: Colors.textDim, fontSize: 13, fontFamily: 'Fredoka_400Regular', marginTop: 3 },
  recBadge: { backgroundColor: Colors.goldDim, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  recText: { color: Colors.gold, fontSize: 12, fontFamily: 'Fredoka_700Bold' },

  setRow: { flexDirection: 'row', gap: 8, marginBottom: 20, alignItems: 'center' },
  setDot: { width: 46, height: 46, borderRadius: 14, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  setDotDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  setNum: { color: Colors.textDim, fontSize: 16, fontFamily: 'Syne_700' },
  setProgress: { marginLeft: 'auto', alignItems: 'center' },
  setProgressText: { color: Colors.text, fontSize: 18, fontFamily: 'Syne_700' },
  setProgressSub: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold' },

  weightRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  weightLabel: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1, minWidth: 44 },
  weightBtn: { width: 44, height: 44, backgroundColor: Colors.surfaceElevated, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  weightDisplay: { flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', backgroundColor: Colors.surface, borderRadius: 12, paddingVertical: 10, borderWidth: 1.5, borderColor: Colors.borderStrong },
  weightVal: { color: Colors.text, fontSize: 26, fontFamily: 'Syne_700' },
  weightUnit: { color: Colors.textDim, fontSize: 13, fontFamily: 'Fredoka_400Regular', marginLeft: 4 },

  prAlert: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.successDim, borderRadius: 10, padding: 10, marginBottom: 4 },
  prText: { color: Colors.success, fontSize: 11, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },

  restCard: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.successDim, marginBottom: 20, padding: 16 },
  restInner: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  restTitle: { color: Colors.success, fontSize: 11, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },
  restSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  restCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.success },
  restNum: { color: Colors.text, fontSize: 14, fontFamily: 'Syne_700' },
  restBarTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', marginBottom: 10 },
  restBarFill: { height: '100%', backgroundColor: Colors.success, borderRadius: 2 },
  skipBtn: { alignSelf: 'center' },
  skipText: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },

  queueTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  queueCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 18, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border, opacity: 0.6 },
  queueNum: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  queueNumText: { color: Colors.textDim, fontSize: 14, fontFamily: 'Syne_700' },
  queueName: { color: Colors.text, fontSize: 15, fontFamily: 'Fredoka_700Bold' },
  queueSets: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  queueRec: { color: Colors.gold, fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 110, paddingHorizontal: 20, justifyContent: 'center' },
  finishBtn: { height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, overflow: 'hidden' },
  finishLabel: { color: 'white', fontSize: 15, fontFamily: 'Syne_700' },
  finishTimeTag: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  finishTimeText: { color: 'white', fontSize: 13, fontFamily: 'Syne_700' },
});
