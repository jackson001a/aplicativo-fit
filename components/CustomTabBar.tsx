import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Dumbbell, TrendingUp, Trophy, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const TABS = [
  { name: 'index',      label: 'Início',     Icon: Home },
  { name: 'treino',     label: 'Treinar',    Icon: Dumbbell, center: true },
  { name: 'evolucao',   label: 'Evolução',   Icon: TrendingUp },
  { name: 'conquistas', label: 'Conquistas', Icon: Trophy },
  { name: 'feed',       label: 'Feed',       Icon: Users },
];

// accent color per tab
const TAB_COLORS: Record<string, string> = {
  index:      Colors.primary,
  treino:     Colors.primary,
  evolucao:   Colors.secondary,
  conquistas: Colors.gold,
  feed:       Colors.purple,
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const scales = useRef(TABS.map(() => new Animated.Value(1))).current;
  const glows  = useRef(TABS.map(() => new Animated.Value(0))).current;

  const handlePress = (route: any, index: number, isFocused: boolean) => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scales[index], { toValue: 0.85, duration: 80, useNativeDriver: true }),
        Animated.spring(scales[index],  { toValue: 1,    friction: 4,  useNativeDriver: true }),
      ]),
      Animated.timing(glows[index], { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
    if (!isFocused) navigation.navigate(route.name);
  };

  const orderedTabs = TABS.map(tab => {
    const routeIndex = state.routes.findIndex(r => r.name === tab.name);
    return { ...tab, routeIndex, route: state.routes[routeIndex] };
  }).filter(t => t.route);

  return (
    <View style={s.wrapper} pointerEvents="box-none">
      {/* fade above */}
      <LinearGradient
        colors={['transparent', Colors.background + 'F0', Colors.background]}
        style={s.fadeGradient}
        pointerEvents="none"
      />

      <View style={s.container}>
        {/* glass layer */}
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={['rgba(20,28,50,0.96)', 'rgba(10,14,28,0.98)']}
            style={[StyleSheet.absoluteFill, { borderRadius: 34 }]}
          />
        </View>
        {/* rim highlight */}
        <View style={s.rimTop} />

        {orderedTabs.map((tab, i) => {
          const isFocused = state.index === tab.routeIndex;
          const { Icon } = tab;
          const accentColor = TAB_COLORS[tab.name] ?? Colors.primary;

          if (tab.center) {
            return (
              <Animated.View key={tab.name} style={{ transform: [{ scale: scales[i] }], zIndex: 10 }}>
                <TouchableOpacity
                  onPress={() => handlePress(tab.route, i, isFocused)}
                  style={s.centerBtn}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={isFocused
                      ? [Colors.primary, '#C2410C', '#7C2D12']
                      : ['#1C2640', '#111827']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  {/* glow ring when active */}
                  {isFocused && (
                    <View style={[StyleSheet.absoluteFill, s.centerGlow]} />
                  )}
                  <Icon size={26} color="white" strokeWidth={isFocused ? 2.5 : 1.8} />
                </TouchableOpacity>
              </Animated.View>
            );
          }

          return (
            <Animated.View key={tab.name} style={[s.tabItem, { transform: [{ scale: scales[i] }] }]}>
              <TouchableOpacity
                onPress={() => handlePress(tab.route, i, isFocused)}
                style={s.tabTouch}
                activeOpacity={0.7}
              >
                {/* active pill bg */}
                {isFocused && (
                  <View style={[s.activePill, { shadowColor: accentColor }]}>
                    <LinearGradient
                      colors={[accentColor + '28', accentColor + '10']}
                      style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
                    />
                  </View>
                )}
                <Icon
                  size={21}
                  color={isFocused ? accentColor : Colors.textDim}
                  strokeWidth={isFocused ? 2.5 : 1.5}
                />
                <Text style={[s.tabLabel, isFocused && { color: accentColor }]}>
                  {tab.label}
                </Text>
                {isFocused && (
                  <View style={[s.activeLine, { backgroundColor: accentColor }]} />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const BOTTOM_INSET = Platform.OS === 'ios' ? 30 : 10;
const BAR_HEIGHT   = 72;

const s = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    alignItems: 'center',
    paddingBottom: BOTTOM_INSET,
  },
  fadeGradient: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: BAR_HEIGHT + BOTTOM_INSET + 50,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 34,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 6,
    paddingVertical: 8,
    width: width - 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 24,
  },
  rimTop: {
    position: 'absolute',
    top: 0, left: 20, right: 20,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabTouch: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 52,
  },
  activePill: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 14,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  tabLabel: {
    fontSize: 8.5,
    fontFamily: 'Fredoka_700Bold',
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  activeLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
    marginTop: 1,
    opacity: 0.8,
  },
  centerBtn: {
    width: 58,
    height: 58,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.14)',
    marginHorizontal: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  centerGlow: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
});
