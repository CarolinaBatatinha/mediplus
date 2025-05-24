import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

export default function Login() {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [showPassword, setShowPassword] = useState(false);

     const router = useRouter();

     const fadeAnim = useRef(new Animated.Value(0)).current;
     const scaleAnim = useRef(new Animated.Value(0.5)).current;

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
     }, []);

     return (
          <View style={styles.container}>
               <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                    <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                    <Text style={styles.appName}>Medi+</Text>
               </Animated.View>

               <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                         <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.icon} />
                         <TextInput
                              placeholder="e-mail"
                              placeholderTextColor="#999"
                              value={email}
                              onChangeText={setEmail}
                              style={styles.input}
                         />
                    </View>

                    <View style={styles.inputWrapper}>
                         <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.icon} />
                         <TextInput
                              placeholder="senha"
                              placeholderTextColor="#999"
                              secureTextEntry={!showPassword}
                              value={password}
                              onChangeText={setPassword}
                              style={styles.input}
                         />
                         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                              <Ionicons
                                   name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                   size={20}
                                   color="#aaa"
                              />
                         </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                         style={styles.loginButton}
                         onPress={() => {
                              if (email === 'teste@email.com' && password === '123456') {
                                   router.push('/(panel)/profile/home');
                              } else {
                                   alert('E-mail ou senha inválidos!');
                              }
                         }}
                    >
                         <Text style={styles.loginText}>entrar</Text>
                    </TouchableOpacity>

                    <Link href='/(auth)/signup/page' style={styles.link}>
                         <Text style={styles.linkText}>Ainda não possui uma conta? Cadastre-se.</Text>
                    </Link>
               </View>
          </View>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#8793FF',
          paddingHorizontal: 30,
          justifyContent: 'center',
     },
     header: {
          alignItems: 'center',
          marginBottom: 30,
     },
     logo: {
          width: 240,
          height: 200,
          marginBottom: 18,
     },
     appName: {
          fontSize: 40,
          color: '#fff',
          marginBottom: 40,
          fontWeight: '300',
          textAlign: 'center',
     },
     inputContainer: {
          backgroundColor: '#ffffff22',
          padding: 20,
          borderRadius: 25,
     },
     inputWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 20,
          paddingHorizontal: 10,
          marginBottom: 15,
     },
     icon: {
          marginRight: 8,
     },
     input: {
          flex: 1,
          height: 45,
          color: '#333',
     },
     loginButton: {
          backgroundColor: '#3d3d3d',
          paddingVertical: 12,
          borderRadius: 20,
          alignItems: 'center',
          marginBottom: 15,
          elevation: 4,
     },
     loginText: {
          color: '#fff',
          fontWeight: 'bold',
     },
     link: {
          marginTop: 16,
          textAlign: 'center',
     },
     linkText: {
          color: '#FFF',
     }
});
