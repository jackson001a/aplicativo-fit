import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Dumbbell, TrendingUp, Trophy, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const TABS = [
  { name: 'index', label: 'Início', Icon: Home },
  { name: 'treino', label: 'Treinar', Icon: Dumbbell, center: true },
  { name: 'evolucao', label: 'Evolução', Icon: TrendingUp },
  { name: 'conquistas', label: 'Conquistas', Icon: Trophy },
  { name: 'feed', label: 'Feed', Icon: Users },
];

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const scales = useRef(TABS.map(() => new Animated.Value(1))).current;

  const handlePress = (route: any, index: number, isFocused: boolean) => {
    Animated.sequence([
      Animated.timing(scales[index], { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(scales[index], { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    if (!isFocused) {
      navigation.navigate(route.name);
    }
  };

  // Map route names to our TABS order
  const orderedTabs = TABS.map(tab => {
    const routeIndex = state.routes.findIndex(r => r.name === tab.name);
    return { ...tab, routeIndex, route: state.routes[routeIndex] };
  }).filter(t => t.route);

  return (
    <View style={s.wrapper} pointerEvents="box-none">
      {/* Fade gradient above tab bar */}
      <LinearGradient
        colors={['transparent', Colors.background]}
        style={s.fadeGradient}
        pointerEvents="none"
      />

      <View style={s.container}>
        {orderedTabs.map((tab, i) => {
          const isFocused = state.index === tab.routeIndex;
          const { Icon } = tab;

          if (tab.center) {
            return (
              <Animated.View key={tab.name} style={{ transform: [{ scale: scales[i] }] }}>
                <TouchableOpacity
                  onPress={() => handlePress(tab.route, i, isFocused)}
                  style={s.centerBtn}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={isFocused ? [Colors.primary, '#C2410C'] : ['#1E293B', '#0F172A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
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
                <View style={[s.iconWrap, isFocused && s.iconWrapActive]}>
                  <Icon
                    size={20}
                    color={isFocused ? Colors.primary : Colors.textDim}
                    strokeWidth={isFocused ? 2.5 : 1.5}
                  />
                </View>
                <Text style={[s.tabLabel, isFocused && s.tabLabelActive]}>
                  {tab.label}
                </Text>
                {isFocused && <View style={s.activeDot} />}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const BOTTOM_INSET = Platform.OS === 'ios' ? 28 : 8;
const BAR_HEIGHT = 68;

const s = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: BOTTOM_INSET,
  },
  fadeGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BAR_HEIGHT + BOTTOM_INSET + 40,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(10,12,20,0.95)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 10,
    width: width - 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabTouch: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryDim,
  },
  tabLabel: {
    fontSize: 9,
    fontFamily: 'Fredoka_700Bold',
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 1,
  },
  centerBtn: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
});
