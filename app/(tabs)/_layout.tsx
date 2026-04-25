import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../components/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="treino" options={{ title: 'Treinar' }} />
      <Tabs.Screen name="evolucao" options={{ title: 'Evolução' }} />
      <Tabs.Screen name="conquistas" options={{ title: 'Conquistas' }} />
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
    </Tabs>
  );
}
