import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Dumbbell, TrendingUp, Trophy, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const TABS = [
  { name: 'index',      label: 'Home',       Icon: Home },
  { name: 'treino',     label: 'Treinar',    Icon: Dumbbell, center: true },
  { name: 'evolucao',   label: 'Stats',      Icon: TrendingUp },
  { name: 'conquistas', label: 'Troféus',    Icon: Trophy },
  { name: 'feed',       label: 'Arena',      Icon: Users },
];

const TAB_ACCENT: Record<string, string> = {
  index:      Colors.volt,
  treino:     Colors.flame,
  evolucao:   Colors.ice,
  conquistas: Colors.trophy,
  feed:       Colors.mystic,
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const scales = useRef(TABS.map(() => new Animated.Value(1))).current;

  const press = (route: any, idx: number, focused: boolean) => {
    Animated.sequence([
      Animated.timing(scales[idx], { toValue: 0.84, duration: 80, useNativeDriver: true }),
      Animated.spring(scales[idx], { toValue: 1, friction: 3, tension: 300, useNativeDriver: true }),
    ]).start();
    if (!focused) navigation.navigate(route.name);
  };

  const tabs = TABS.map(t => {
    const ri = state.routes.findIndex(r => r.name === t.name);
    return { ...t, ri, route: state.routes[ri] };
  }).filter(t => t.route);

  return (
    <View style={st.wrap} pointerEvents="box-none">
      <LinearGradient colors={['transparent', Colors.background + 'DD', Colors.background]} style={st.fade} pointerEvents="none" />
      <View style={st.bar}>
        <LinearGradient colors={['rgba(13,16,23,0.97)', 'rgba(5,6,8,0.99)']} style={[StyleSheet.absoluteFill, { borderRadius: 28 }]} />
        <View style={st.rim} />
        {tabs.map((t, i) => {
          const on = state.index === t.ri;
          const { Icon } = t;
          const c = TAB_ACCENT[t.name] || Colors.flame;
          if (t.center) {
            return (
              <Animated.View key={t.name} style={{ transform: [{ scale: scales[i] }], zIndex: 10 }}>
                <TouchableOpacity onPress={() => press(t.route, i, on)} style={st.cBtn} activeOpacity={0.85}>
                  <LinearGradient colors={on ? [Colors.flame, '#CC3800'] : ['#181D28', '#0E1018']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                  {on && <View style={st.cGlow} />}
                  <Icon size={26} color="white" strokeWidth={on ? 2.5 : 2} />
                </TouchableOpacity>
              </Animated.View>
            );
          }
          return (
            <Animated.View key={t.name} style={[st.tab, { transform: [{ scale: scales[i] }] }]}>
              <TouchableOpacity onPress={() => press(t.route, i, on)} style={st.tabBtn} activeOpacity={0.6}>
                {on && <View style={[st.pill, { backgroundColor: c + '18' }]} />}
                <Icon size={21} color={on ? c : Colors.textDim} strokeWidth={on ? 2.4 : 1.6} />
                <Text style={[st.lbl, on && { color: c }]}>{t.label}</Text>
                {on && <View style={[st.dot, { backgroundColor: c, shadowColor: c }]} />}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const BI = Platform.OS === 'ios' ? 28 : 8;
const st = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', paddingBottom: BI },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 140 },
  bar: { flexDirection: 'row', alignItems: 'center', borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 4, paddingVertical: 6, width: width - 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.8, shadowRadius: 30, elevation: 28 },
  rim: { position: 'absolute', top: 0, left: 16, right: 16, height: 1, backgroundColor: 'rgba(255,255,255,0.10)' },
  tab: { flex: 1, alignItems: 'center' },
  tabBtn: { alignItems: 'center', paddingVertical: 5, paddingHorizontal: 4, minWidth: 48 },
  pill: { ...StyleSheet.absoluteFillObject, borderRadius: 14 },
  lbl: { fontSize: 8, fontFamily: 'Fredoka_700Bold', color: Colors.textDim, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 1 },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 2, shadowOpacity: 0.9, shadowRadius: 4, shadowOffset: { width: 0, height: 0 } },
  cBtn: { width: 60, height: 60, borderRadius: 22, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.14)', marginHorizontal: 2, shadowColor: Colors.flame, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.65, shadowRadius: 18, elevation: 14 },
  cGlow: { ...StyleSheet.absoluteFillObject, borderRadius: 22, borderWidth: 1.5, borderColor: Colors.flame + '50' },
});
