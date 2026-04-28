import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Minus, Check, Timer, ChevronRight, Zap, Flame, Play } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';

const WORKOUT = {
  name: 'Peito + Tríceps',
  kcal: 340,
  exercises: [
    { title: 'Supino Reto', sets: 4, reps: 10, rec: 70, muscle: '🫁' },
    { title: 'Crucifixo Inclinado', sets: 3, reps: 12, rec: 14, muscle: '💪' },
    { title: 'Tríceps Pulley', sets: 4, reps: 15, rec: 30, muscle: '🦾' },
    { title: 'Elevação Lateral', sets: 3, reps: 20, rec: 8, muscle: '🏋️' },
  ],
};

function SetDot({ done, active, num, onPress }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const tap = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.85, duration: 70, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    onPress();
  };
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity onPress={tap} style={[s.setDot, done && s.setDotDone, active && s.setDotActive]} activeOpacity={0.85}>
        {done ? <Check size={14} color="white" strokeWidth={3} /> : <Text style={[s.setNum, active && { color: Colors.secondary }]}>{num}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function WorkoutScreen() {
  const [exIdx, setExIdx] = useState(0);
  const [setsDone, setSetsDone] = useState<boolean[][]>(WORKOUT.exercises.map(e => Array(e.sets).fill(false)));
  const [weight, setWeight] = useState(WORKOUT.exercises[0].rec);
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [sessionSecs, setSessionSecs] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { const t = setInterval(() => setSessionSecs(s => s + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    if (!resting || restTime <= 0) { if (restTime <= 0) setResting(false); return; }
    const t = setInterval(() => setRestTime(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [resting, restTime]);

  const ex = WORKOUT.exercises[exIdx];
  const exSets = setsDone[exIdx];
  const doneCount = exSets.filter(Boolean).length;
  const allDone = exSets.every(Boolean);
  const PR = weight > ex.rec;
  const sessionTime = `${String(Math.floor(sessionSecs / 60)).padStart(2, '0')}:${String(sessionSecs % 60).padStart(2, '0')}`;
  const kcalBurned = Math.round((sessionSecs / 3600) * WORKOUT.kcal);
  const overallPct = Math.round((setsDone.flat().filter(Boolean).length / setsDone.flat().length) * 100);

  const toggleSet = (i: number) => {
    const next = setsDone.map(arr => [...arr]);
    next[exIdx][i] = !next[exIdx][i];
    setSetsDone(next);
    if (next[exIdx][i]) { setResting(true); setRestTime(60); }
  };

  const nextExercise = () => {
    if (exIdx < WORKOUT.exercises.length - 1) {
      Animated.timing(slideAnim, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(() => {
        slideAnim.setValue(0);
        const ni = exIdx + 1;
        setExIdx(ni);
        setWeight(WORKOUT.exercises[ni].rec);
      });
    }
  };

  const cardTranslate = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -40] });
  const cardOpacity = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerSub}>TREINO ATIVO</Text>
          <Text style={s.headerTitle}>{WORKOUT.name}</Text>
        </View>
        <View style={s.timerBox}>
          <Timer size={12} color={Colors.success} />
          <Text style={s.timerVal}>{sessionTime}</Text>
        </View>
      </View>

      {/* Top stats strip */}
      <View style={s.statsStrip}>
        <View style={s.stripItem}>
          <Text style={s.stripVal}>{exIdx + 1}/{WORKOUT.exercises.length}</Text>
          <Text style={s.stripLabel}>Exercício</Text>
        </View>
        <View style={s.stripDiv} />
        <View style={s.stripItem}>
          <Text style={[s.stripVal, { color: Colors.primary }]}>{overallPct}%</Text>
          <Text style={s.stripLabel}>Treino</Text>
        </View>
        <View style={s.stripDiv} />
        <View style={s.stripItem}>
          <Text style={[s.stripVal, { color: Colors.gold }]}>{kcalBurned} kcal</Text>
          <Text style={s.stripLabel}>Queimadas</Text>
        </View>
      </View>

      {/* Overall progress bar */}
      <View style={s.overallBar}>
        <LinearGradient colors={[Colors.primary, Colors.gold]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.overallFill, { width: `${overallPct}%` }]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* Active exercise card */}
        <Animated.View style={[s.exCard, { opacity: cardOpacity, transform: [{ translateY: cardTranslate }] }]}>
          <LinearGradient colors={['#111827', '#0C1015']} style={StyleSheet.absoluteFill} />
          <View style={s.exCardBorder} />

          <View style={s.exTop}>
            <View style={s.exMuscleBox}><Text style={{ fontSize: 28 }}>{ex.muscle}</Text></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.exTitle}>{ex.title}</Text>
              <Text style={s.exMeta}>{ex.sets} séries · {ex.reps} reps</Text>
            </View>
            <View style={s.recBadge}><Text style={s.recText}>🏆 {ex.rec} kg</Text></View>
          </View>

          {/* Series dots */}
          <Text style={s.setsLabel}>SÉRIES — {doneCount}/{ex.sets}</Text>
          <View style={s.setRow}>
            {exSets.map((done, i) => (
              <SetDot key={i} done={done} active={i === doneCount && !done} num={i + 1} onPress={() => toggleSet(i)} />
            ))}
          </View>

          {/* Weight picker */}
          <View style={s.weightSection}>
            <Text style={s.weightLabel}>CARGA</Text>
            <View style={s.weightRow}>
              <TouchableOpacity onPress={() => setWeight(w => Math.max(0, +(w - 2.5).toFixed(1)))} style={s.weightBtn}>
                <Minus size={18} color={Colors.text} />
              </TouchableOpacity>
              <View style={[s.weightDisplay, PR && { borderColor: Colors.success }]}>
                <Text style={[s.weightVal, PR && { color: Colors.success }]}>{weight}</Text>
                <Text style={s.weightUnit}>kg</Text>
                {PR && <View style={s.prPill}><Zap size={10} color={Colors.success} /><Text style={s.prPillText}>PR</Text></View>}
              </View>
              <TouchableOpacity onPress={() => setWeight(w => +(w + 2.5).toFixed(1))} style={s.weightBtn}>
                <Plus size={18} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={s.stepRow}>
              {[1.25, 2.5, 5].map(step => (
                <TouchableOpacity key={step} onPress={() => setWeight(w => +(w + step).toFixed(2))} style={s.stepBtn}>
                  <Text style={s.stepText}>+{step}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity onPress={allDone ? nextExercise : () => { const i = exSets.findIndex(d => !d); if (i !== -1) toggleSet(i); }} activeOpacity={0.87} style={s.ctaBtn}>
            <LinearGradient colors={allDone ? [Colors.secondary,'#1D4ED8'] : [Colors.success,'#059669']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} />
            <Text style={s.ctaText}>{allDone ? (exIdx < WORKOUT.exercises.length - 1 ? 'PRÓXIMO EXERCÍCIO →' : '🎉 FINALIZAR TREINO') : `CONCLUIR SÉRIE ${doneCount + 1}`}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Rest timer */}
        {resting && (
          <View style={s.restCard}>
            <LinearGradient colors={['#071A10', '#040C08']} style={[StyleSheet.absoluteFill, { borderRadius: 22 }]} />
            <Text style={s.restTitle}>💧 DESCANSO</Text>
            <Text style={s.restSub}>Hidrata! Próxima série em breve</Text>
            <View style={s.restCircleBig}>
              <Text style={s.restNumBig}>{restTime}</Text>
              <Text style={s.restNumUnit}>seg</Text>
            </View>
            <View style={s.restBarTrack}>
              <LinearGradient colors={[Colors.success+'CC', Colors.success+'55']} start={{x:0,y:0}} end={{x:1,y:0}} style={[s.restBarFill, { width: `${(restTime / 60) * 100}%` }]} />
            </View>
            <View style={s.restBtns}>
              <TouchableOpacity onPress={() => setRestTime(t => t + 15)} style={s.restAdjBtn}><Text style={s.restAdjText}>+15s</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setRestTime(t => Math.max(5,t-15))} style={s.restAdjBtn}><Text style={s.restAdjText}>-15s</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setResting(false)} style={s.skipBtn}><LinearGradient colors={[Colors.secondary,'#1D4ED8']} style={[StyleSheet.absoluteFill,{borderRadius:12}]}/><Text style={s.skipText}>PULAR →</Text></TouchableOpacity>
            </View>
          </View>
        )}

        {/* Queue */}
        {WORKOUT.exercises.slice(exIdx + 1).length > 0 && (
          <>
            <Text style={s.queueTitle}>A SEGUIR</Text>
            {WORKOUT.exercises.slice(exIdx + 1).map((item, i) => (
              <View key={i} style={s.queueCard}>
                <View style={s.queueIdx}><Text style={s.queueIdxText}>{exIdx + i + 2}</Text></View>
                <Text style={{ fontSize: 18, marginLeft: 10 }}>{item.muscle}</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={s.queueName}>{item.title}</Text>
                  <Text style={s.queueMeta}>{item.sets} × {item.reps}</Text>
                </View>
                <Text style={s.queueRec}>🏆 {item.rec} kg</Text>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* Footer */}
      <View style={s.footer}>
        <LinearGradient colors={['transparent', Colors.background]} style={StyleSheet.absoluteFill} />
        <TouchableOpacity style={s.finishBtn} activeOpacity={0.9}>
          <LinearGradient colors={['#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />
          <Flame size={16} color={Colors.primary} />
          <Text style={s.finishLabel}>Encerrar Treino</Text>
          <View style={s.finishMeta}>
            <Text style={s.finishMetaText}>{sessionTime} · {kcalBurned} kcal</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 55 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  headerSub: { color: Colors.textDim, fontSize: 10, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5 },
  headerTitle: { color: Colors.text, fontSize: 22, fontFamily: 'Syne_700' },
  timerBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.successDim, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)' },
  timerVal: { color: Colors.success, fontSize: 15, fontFamily: 'Syne_700' },

  statsStrip: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  stripItem: { flex: 1, alignItems: 'center' },
  stripVal: { color: Colors.text, fontSize: 16, fontFamily: 'Syne_700' },
  stripLabel: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  stripDiv: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },

  overallBar: { height: 3, backgroundColor: Colors.surface, marginHorizontal: 20, borderRadius: 2, overflow: 'hidden', marginBottom: 16 },
  overallFill: { height: '100%', borderRadius: 2 },

  content: { paddingHorizontal: 20, paddingBottom: 140 },

  exCard: { borderRadius: 28, overflow: 'hidden', padding: 22, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  exCardBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(61,139,255,0.09)' },
  exTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  exMuscleBox: { width: 54, height: 54, borderRadius: 18, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  exTitle: { color: Colors.text, fontSize: 20, fontFamily: 'Syne_700' },
  exMeta: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginTop: 3 },
  recBadge: { backgroundColor: Colors.goldDim, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  recText: { color: Colors.gold, fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  setsLabel: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, marginBottom: 10 },
  setRow: { flexDirection: 'row', gap: 8, marginBottom: 22 },
  setDot: { width: 48, height: 48, borderRadius: 15, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  setDotDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  setDotActive: { borderColor: Colors.secondary, borderWidth: 2 },
  setNum: { color: Colors.textDim, fontSize: 16, fontFamily: 'Syne_700' },

  weightSection: { marginBottom: 16 },
  weightLabel: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, marginBottom: 10 },
  weightRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  weightBtn: { width: 48, height: 48, backgroundColor: Colors.surfaceElevated, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  weightDisplay: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface, borderRadius: 14, paddingVertical: 12, borderWidth: 1.5, borderColor: Colors.borderStrong, gap: 6 },
  weightVal: { color: Colors.text, fontSize: 28, fontFamily: 'Syne_700' },
  weightUnit: { color: Colors.textDim, fontSize: 14, fontFamily: 'Fredoka_400Regular' },
  prPill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.successDim, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  prPillText: { color: Colors.success, fontSize: 10, fontFamily: 'Fredoka_700Bold' },
  stepRow: { flexDirection: 'row', gap: 8 },
  stepBtn: { flex: 1, backgroundColor: Colors.surfaceElevated, borderRadius: 10, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  stepText: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_700Bold' },

  ctaBtn: { borderRadius: 18, paddingVertical: 16, alignItems: 'center', overflow: 'hidden' },
  ctaText: { color: 'white', fontSize: 15, fontFamily: 'Syne_700', letterSpacing: 0.3 },

  restCard: { borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: Colors.successDim, marginBottom: 20, padding: 20, alignItems: 'center' },
  restTitle: { color: Colors.success, fontSize: 11, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, marginBottom: 4 },
  restSub: { color: Colors.textDim, fontSize: 12, fontFamily: 'Fredoka_400Regular', marginBottom: 18 },
  restCircleBig: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: Colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 18, backgroundColor: 'rgba(16,185,129,0.07)' },
  restNumBig: { color: Colors.text, fontSize: 38, fontFamily: 'Syne_700', lineHeight: 42 },
  restNumUnit: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular' },
  restBarTrack: { height: 5, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 16, width: '100%' },
  restBarFill: { height: '100%', borderRadius: 3 },
  restBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  restAdjBtn: { flex:1, backgroundColor: Colors.surfaceElevated, paddingVertical: 10, borderRadius: 12, alignItems:'center', borderWidth: 1, borderColor: Colors.border },
  restAdjText: { color: Colors.text, fontSize: 13, fontFamily: 'Fredoka_700Bold' },
  skipBtn: { flex:1.4, borderRadius:12, overflow:'hidden', paddingVertical:10, alignItems:'center' },
  skipText: { color: 'white', fontSize: 13, fontFamily: 'Syne_700', letterSpacing: 0.5 },

  queueTitle: { color: Colors.textDim, fontSize: 9, fontFamily: 'Fredoka_700Bold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  queueCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 18, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border, opacity: 0.55 },
  queueIdx: { width: 30, height: 30, borderRadius: 10, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  queueIdxText: { color: Colors.textDim, fontSize: 13, fontFamily: 'Syne_700' },
  queueName: { color: Colors.text, fontSize: 14, fontFamily: 'Fredoka_700Bold' },
  queueMeta: { color: Colors.textDim, fontSize: 11, fontFamily: 'Fredoka_400Regular', marginTop: 2 },
  queueRec: { color: Colors.gold, fontSize: 11, fontFamily: 'Fredoka_700Bold' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 110, paddingHorizontal: 20, justifyContent: 'center' },
  finishBtn: { height: 54, borderRadius: 18, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, overflow: 'hidden', gap: 10, borderWidth: 1, borderColor: Colors.border },
  finishLabel: { flex: 1, color: Colors.text, fontSize: 15, fontFamily: 'Syne_700' },
  finishMeta: { backgroundColor: Colors.primaryDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  finishMetaText: { color: Colors.primary, fontSize: 11, fontFamily: 'Fredoka_700Bold' },
});
