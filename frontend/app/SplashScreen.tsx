import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const router = useRouter();

  useEffect(() => {
      Animated.parallel([
          Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 10,
              friction: 2,
              useNativeDriver: true,
          }),
      ]).start();

      // 👇 nome da rota, igual ao que está no App.js
      const timer = setTimeout(() => {
        router.push('/LoginScreen'); 
      }, 4000);

      return () => clearTimeout(timer);
  }, []);
  
  return (
    <View style={styles.container}>
      <Animated.View
          style={[
              styles.iconContainer,
              {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
              },
          ]}
      >
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.text}>Medi+</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#8793FF',
      alignItems: 'center',
      justifyContent: 'center',
  },
  iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
  },
  logo: {
      width: '100%',
      height: undefined,
      aspectRatio: 1.6, // 👈 ajusta a proporção conforme necessário (ex: 16:10)
      resizeMode: 'contain',
  },
  text: {
      color: '#FFFFFF',
      fontWeight: '300',
      fontSize: 36,
      marginTop: 25,
      letterSpacing: 1,
  },
});