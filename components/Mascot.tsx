import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

interface MascotProps {
  message?: string;
  size?: number;
  mood?: 'happy' | 'work' | 'sleep' | 'zen' | 'alert';
  onPet?: () => void;
}

function getTimeAwareMessage(mood: string): string {
  const hour = new Date().getHours();

  if (mood === 'alert') {
    return hour >= 20
      ? '⚠️ Ei! Só faltam poucas horas para meia-noite!'
      : '🛡️ Não deixe seu streak quebrar hoje!';
  }

  if (hour >= 5 && hour < 12) {
    const morning = [
      '☀️ Bom dia! Dia de superar limites?',
      '🌅 Manhã ideal pra bater recordes!',
      '💪 Acorda, guerreiro! A capivara já está pronta.',
    ];
    return morning[Math.floor(Math.random() * morning.length)];
  }

  if (hour >= 12 && hour < 18) {
    const afternoon = [
      '🔥 Hora de treinar! Bora esmagar!',
      '⚡ Tarde de rachar! Menos conversa.',
      '🏋️ A capivara tá aquecendo. E você?',
    ];
    return afternoon[Math.floor(Math.random() * afternoon.length)];
  }

  if (hour >= 18 && hour < 22) {
    const evening = [
      '🌙 Último treino do dia — vai com tudo!',
      '🔥 Não durma sem treinar. Foco!',
      '💪 Noite de guerreiro. Bora!',
    ];
    return evening[Math.floor(Math.random() * evening.length)];
  }

  // Late night
  const night = [
    '😴 Recuperação é treino também. Dorme bem!',
    '🌙 Boa noite! Amanhã tem mais!',
    'Zzz... a capivara já foi dormir. Você também!',
  ];
  return night[Math.floor(Math.random() * night.length)];
}

export function Mascot({ message, size = 80, mood = 'happy', onPet }: MascotProps) {
  const bobAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const heartAlpha = useRef(new Animated.Value(0)).current;
  const heartY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(bobAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    onPet?.();
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pressAnim, { toValue: 1.18, duration: 90, useNativeDriver: true }),
        Animated.timing(heartAlpha, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(heartY, { toValue: -20, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(pressAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
        Animated.timing(heartAlpha, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start(() => heartY.setValue(0));
  };

  const translateY = bobAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  const displayMessage = message ?? getTimeAwareMessage(mood);

  return (
    <View style={styles.container}>
      {/* Speech Bubble */}
      {displayMessage && (
        <View style={styles.bubbleContainer}>
          <View style={[styles.bubbleBase, { backgroundColor: Colors.depthBlue }]} />
          <View style={styles.bubbleTop}>
            <Text style={styles.bubbleText}>{displayMessage}</Text>
          </View>
          <View style={styles.tail} />
        </View>
      )}

      {/* Mascot */}
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
        <Animated.View style={[
          styles.imageContainer,
          { width: size, height: size, transform: [{ translateY }, { scale: pressAnim }] }
        ]}>
          <Image source={require('../assets/mascot.png')} style={styles.image} resizeMode="contain" />

          {/* Floating heart particle */}
          <Animated.View style={[styles.hearts, { opacity: heartAlpha, transform: [{ translateY: heartY }] }]}>
            <Text style={{ fontSize: 20 }}>❤️</Text>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', position: 'relative', paddingTop: 15 },
  bubbleContainer: { position: 'absolute', top: -58, zIndex: 10, minWidth: 130, maxWidth: 190 },
  bubbleBase: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: 20 },
  bubbleTop: { backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 2, borderColor: Colors.rim },
  bubbleText: { color: '#1A1A2E', fontSize: 11, fontFamily: 'Fredoka_700Bold', textAlign: 'center', lineHeight: 15 },
  tail: { width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: 'white', alignSelf: 'center', marginTop: -1 },
  imageContainer: { justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  hearts: { position: 'absolute', top: -16, right: -8, zIndex: 20 },
});
