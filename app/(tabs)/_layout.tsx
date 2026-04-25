import { Tabs } from 'expo-router';
import { Home, Dumbbell, TrendingUp, Trophy, Users } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(7,9,15,0.97)',
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 26 : 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textDim,
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: 'Fredoka_700Bold',
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: ({ color, focused }) => <Home size={22} color={color} strokeWidth={focused ? 2.5 : 1.5} /> }} />
      <Tabs.Screen name="treino" options={{ title: 'Treino', tabBarIcon: ({ color, focused }) => <Dumbbell size={22} color={color} strokeWidth={focused ? 2.5 : 1.5} /> }} />
      <Tabs.Screen name="evolucao" options={{ title: 'Evolução', tabBarIcon: ({ color, focused }) => <TrendingUp size={22} color={color} strokeWidth={focused ? 2.5 : 1.5} /> }} />
      <Tabs.Screen name="conquistas" options={{ title: 'Conquistas', tabBarIcon: ({ color, focused }) => <Trophy size={22} color={color} strokeWidth={focused ? 2.5 : 1.5} /> }} />
      <Tabs.Screen name="feed" options={{ title: 'Feed', tabBarIcon: ({ color, focused }) => <Users size={22} color={color} strokeWidth={focused ? 2.5 : 1.5} /> }} />
    </Tabs>
  );
}
