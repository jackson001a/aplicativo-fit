import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

interface MascotProps {
  message?: string;
  size?: number;
  mood?: 'happy' | 'work' | 'sleep' | 'zen';
  onPet?: () => void;
}

export function Mascot({ message, size = 80, mood = 'happy', onPet }: MascotProps) {
  const bobAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const heartAlpha = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(bobAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    onPet?.();
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pressAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
        Animated.timing(heartAlpha, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(pressAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
        Animated.timing(heartAlpha, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
    ]).start();
  };

  const translateY = bobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12], // More dramatic bobbing
  });

  const defaultMessages = {
    happy: ["Bora esmagar esse treino?", "Capy está orgulhosa!", "Vamo que vamo!", "Que shape é esse?! 🔥"],
    work: ["Foco total no objetivo!", "Menos conversa, mais peso!", "A constância é a chave!"],
    sleep: ["Zzz... pronto pra amanhã?", "Recuperação é treino também."],
    zen: ["Respirar... e puxar!", "Equilíbrio é tudo, humano."]
  };
  
  const displayMessage = message || defaultMessages[mood][Math.floor(Math.random() * defaultMessages[mood].length)];

  return (
    <View style={styles.container}>
      {/* Cloud Speech Bubble */}
      {displayMessage && (
        <View style={styles.bubbleContainer}>
          <View style={[styles.bubbleBase, { backgroundColor: Colors.depthBlue }]} />
          <View style={styles.bubbleTop}>
            <Text style={styles.bubbleText}>{displayMessage}</Text>
          </View>
          {/* Bubble Tail */}
          <View style={styles.tail} />
        </View>
      )}

      {/* Mascot Image with Interactivity */}
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
        <Animated.View style={[
          styles.imageContainer, 
          { 
            width: size, 
            height: size, 
            transform: [
              { translateY },
              { scale: pressAnim }
            ] 
          }
        ]}>
          <Image 
            source={require('../assets/mascot.png')} 
            style={styles.image}
            resizeMode="contain"
          />
          {/* Heart Particles */}
          <Animated.View style={[styles.hearts, { opacity: heartAlpha }]}>
            <Text style={{ fontSize: 24 }}>❤️</Text>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
    paddingTop: 15,
  },
  bubbleContainer: {
    position: 'absolute',
    top: -55,
    zIndex: 10,
    minWidth: 130,
    maxWidth: 180,
  },
  bubbleBase: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 25, // Very round cloud-like
  },
  bubbleTop: {
    backgroundColor: 'white', // Bright white for pop
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Colors.rim,
  },
  bubbleText: {
    color: '#333',
    fontSize: 11,
    fontFamily: 'Fredoka_700Bold',
    textAlign: 'center',
    lineHeight: 15,
  },
  tail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
    alignSelf: 'center',
    marginTop: -2,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hearts: {
    position: 'absolute',
    top: -20,
    right: -10,
    zIndex: 20,
  },
});
