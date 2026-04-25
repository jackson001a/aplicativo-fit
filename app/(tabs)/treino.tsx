import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Minus, Check, Timer, ArrowRight } from 'lucide-react-native';
import { Mascot } from '../../components/Mascot';
import { ChunkyButton } from '../../components/ChunkyButton';
import { Colors } from '../../constants/Colors';

export default function WorkoutScreen() {
  const [restTime, setRestTime] = useState(60);
  const [resting, setResting] = useState(false);
  const [weight, setWeight] = useState(70);
  const [setsDone, setSetsDone] = useState([false, false, false, false]);

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

  const queue = [
    { title: 'Crucifixo Inclinado', sets: '3 × 12', rec: '14kg' },
    { title: 'Tríceps Pulley', sets: '4 × 15', rec: '30kg' },
    { title: 'Elevação Lateral', sets: '3 × 20', rec: '8kg' },
  ];

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerSub}>TREINO ATUAL</Text>
          <Text style={s.headerTitle}>Peito + Tríceps</Text>
        </View>
        <Mascot size={80} mood="work" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* Active Exercise */}
        <View style={s.exCard}>
          <LinearGradient colors={['#131924', '#0D1117']} style={StyleSheet.absoluteFill} />
          <View style={s.exCardBorder} />

          <View style={s.exHeader}>
            <View>
              <Text style={s.exTitle}>Supino Reto</Text>
              <Text style={s.exSub}>Meta: 4 × 10 reps</Text>
            </View>
            <View style={s.recBadge}>
              <Text style={s.recText}>🏆 70 kg</Text>
            </View>
          </View>

          {/* Set tracker */}
          <View style={s.setRow}>
            {setsDone.map((done, idx) => (
              <TouchableOpacity key={idx} onPress={() => toggleSet(idx)} style={[s.setDot, done && s.setDotDone]}>
                {done ? <Check size={14} color="white" strokeWidth={3} /> : <Text style={s.setNum}>{idx + 1}</Text>}
              </TouchableOpacity>
            ))}
          </View>

          {/* Weight control */}
          <View style={s.weightRow}>
            <Text style={s.weightLabel}>CARGA</Text>
            <TouchableOpacity onPress={() => setWeight(w => Math.max(0, w - 2.5))} style={s.weightBtn}>
              <Minus size={18} color={Colors.text} />
            </TouchableOpacity>
            <View style={s.weightDisplay}>
              <Text style={[s.weightVal, PR && { color: Colors.success }]}>{weight}</Text>
              <Text style={s.weightUnit}>kg</Text>
            </View>
            <TouchableOpacity onPress={() => setWeight(w => w + 2.5)} style={s.weightBtn}>
              <Plus size={18} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {PR && (
            <View style={s.prAlert}>
              <Text style={s.prText}>🏆 NOVO RECORDE PESSOAL!</Text>
            </View>
          )}

          <View style={{ marginTop: 12 }}>
            <ChunkyButton
              title={allDone ? 'EXERCÍCIO CONCLUÍDO' : 'CONCLUIR SÉRIE'}
              onPress={() => { const i = setsDone.findIndex(d => !d); if (i !== -1) toggleSet(i); }}
              color={allDone ? Colors.secondary : Colors.success}
              depthColor={allDone ? Colors.depthBlue : Colors.depthGreen}
            />
          </View>
        </View>

        {/* Rest Timer */}
        {resting && (
          <View style={s.restCard}>
            <LinearGradient colors={['#071A10', '#050F0A']} style={[StyleSheet.absoluteFill, { borderRadius: 20 }]} />
            <Timer size={20} color={Colors.success} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.restTitle}>DESCANSO ATIVO</Text>
              <Text style={s.restSub}>Respira fundo! Sua capivara está bebendo água…</Text>
            </View>
            <View style={s.restCircle}>
              <Text style={s.restNum}>{restTime}s</Text>
            </View>
            <TouchableOpacity onPress={() => setResting(false)} style={s.skipBtn}>
              <Text style={s.skipText}>PULAR</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Queue */}
        <Text style={s.queueTitle}>PRÓXIMOS EXERCÍCIOS</Text>
        {queue.map((item, i) => (
          <View key={i} style={s.queueCard}>
            <View style={{ flex: 1 }}>
              <Text style={s.queueName}>{item.title}</Text>
              <Text style={s.queueSets}>{item.sets} reps</Text>
            </View>
            <Text style={s.queueRec}>🏆 {item.rec}</Text>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Finish CTA */}
      <View style={s.footer}>
        <LinearGradient colors={['transparent', Colors.background]} style={StyleSheet.absoluteFill} />
        <TouchableOpacity style={s.finishBtn}>
          <LinearGradient colors={[Colors.secondary, '#2563EB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          <Text style={s.finishText}>ENCERRAR TREINO</Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 55 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 8 },
  headerSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase' },
  headerTitle: { color: Colors.text, fontSize: 24, fontFamily: 'Syne_700', lineHeight: 28 },
  content: { paddingHorizontal: 20, paddingBottom: 140 },

  exCard: { borderRadius: 28, overflow: 'hidden', padding: 22, borderWidth: 1, borderColor: Colors.border, marginBottom: 16, position: 'relative' },
  exCardBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(61,139,255,0.1)' },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  exTitle: { color: Colors.text, fontSize: 22, fontFamily: 'Syne_700' },
  exSub: { color: Colors.textDim, fontSize: 13, fontFamily: 'Fredoka_400Regular', marginTop: 3 },
  recBadge: { backgroundColor: Colors.goldDim, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  recText: { color: Colors.gold, fontSize: 12, fontFamily: 'Fredoka_700Bold' },

  setRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  setDot: { width: 46, height: 46, borderRadius: 14, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  setDotDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  setNum: { color: Colors.textDim, fontSize: 15, fontFamily: 'Syne_700' },

  weightRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  weightLabel: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1, minWidth: 46 },
  weightBtn: { width: 44, height: 44, backgroundColor: Colors.surfaceElevated, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  weightDisplay: { flexDirection: 'row', alignItems: 'baseline', backgroundColor: Colors.surface, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10, borderWidth: 1, borderColor: Colors.borderStrong },
  weightVal: { color: Colors.text, fontSize: 22, fontFamily: 'Syne_700' },
  weightUnit: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginLeft: 4 },

  prAlert: { backgroundColor: Colors.successDim, borderRadius: 10, padding: 10, alignItems: 'center', marginBottom: 4 },
  prText: { color: Colors.success, fontSize: 11, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },

  restCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 16, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.successDim },
  restTitle: { color: Colors.success, fontSize: 11, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },
  restSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  restCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.success, marginLeft: 12 },
  restNum: { color: Colors.text, fontSize: 14, fontFamily: 'Syne_700' },
  skipBtn: { position: 'absolute', right: 70, top: '50%', transform: [{ translateY: -8 }] },
  skipText: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1 },

  queueTitle: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  queueCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, opacity: 0.65 },
  queueName: { color: Colors.text, fontSize: 16, fontFamily: 'Fredoka_700Bold' },
  queueSets: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  queueRec: { color: Colors.gold, fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 110, paddingHorizontal: 20, justifyContent: 'center' },
  finishBtn: { height: 58, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 26, overflow: 'hidden' },
  finishText: { color: 'white', fontSize: 15, fontFamily: 'Syne_700', letterSpacing: 0.5 },
});
