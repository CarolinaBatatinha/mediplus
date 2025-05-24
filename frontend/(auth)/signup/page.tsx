import { router, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Usuario } from '../../modelos/Usuario';
import { usuarioService } from '../../services/usuarioService';


export default function Singup() {
     const router = useRouter();
     const [name, setName] = useState('');
     const [email, setEmail] = useState('');
     const [phone, setPhone] = useState('');
     const [password, setPassword] = useState('');
     const [showPassword, setShowPassword] = useState(false);

     const handleCadastro = async () => {
          if (password !== confirmPassword) {
               Alert.alert('Erro', 'As senhas não coincidem.');
               return;
          }

          const novoUsuario: Usuario = {
               nome: name,
               email,
               telefone: phone,
               senha_hash: password,
          };

          try {
               await usuarioService.criar(novoUsuario);
               Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
               router.push('/LoginScreen');
          } catch (err: any) {
               console.error(err);
               Alert.alert('Erro', err.message || 'Erro ao cadastrar usuário');
          }
     };

     return (
          <ScrollView contentContainerStyle={styles.container}>
               <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={'#FFF'}></Ionicons>
               </Pressable>

               <View style={styles.slogan}>
                    <Text style={styles.sloganText}>Criar uma conta</Text>
               </View>

               <View style={styles.formContainer}>
                    <View style={styles.inputWrapper}>
                         <Ionicons name="person-outline" size={20} color="#aaa" style={styles.icon} />
                         <TextInput
                              placeholder="nome completo"
                              style={styles.input}
                              value={name}
                              onChangeText={setName}
                         />
                    </View>

                    <View style={styles.inputWrapper}>
                         <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.icon} />
                         <TextInput
                              placeholder="e-mail"
                              style={styles.input}
                              value={email}
                              onChangeText={setEmail}
                         />
                    </View>

                    <View style={styles.inputWrapper}>
                         <Ionicons name="call-outline" size={20} color="#aaa" style={styles.icon} />
                         <TextInput
                              placeholder="telefone"
                              style={styles.input}
                              value={phone}
                              onChangeText={setPhone}
                         />
                    </View>

                    <View style={styles.inputWrapper}>
                         <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.icon} />
                         <TextInput
                              placeholder="senha"
                              style={styles.input}
                              value={password}
                              onChangeText={setPassword}
                              secureTextEntry={!showPassword}
                         />
                         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                              <Ionicons
                                   name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                   size={20}
                                   color="#aaa"
                              />
                         </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.registerButton}>
                         <Text style={styles.registerText} onPress={() => router.push('/')}>cadastrar</Text>
                    </TouchableOpacity>
               </View>
          </ScrollView>
     );
}

const styles = StyleSheet.create({
     container: {
          flexGrow: 1,
          backgroundColor: '#8793FF',
          justifyContent: 'center',
          paddingHorizontal: 10,
          paddingVertical: 40,
     },
     formContainer: {
          backgroundColor: '#ffffff22',
          borderRadius: 25,
          padding: 20,
          alignItems: 'center',
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
          fontSize: 12,
     },
     registerButton: {
          backgroundColor: '#3d3d3d',
          paddingVertical: 12,
          borderRadius: 20,
          alignItems: 'center',
          marginBottom: 10,
          elevation: 4,
          width: '100%',
     },
     registerText: {
          color: '#fff',
          fontWeight: 'bold',
     },
     slogan: {
          marginLeft: 5,
     },
     sloganText: {
          fontSize: 40,
          color: '#fff',
          marginBottom: 30,

          fontWeight: '300',
          textAlign: 'center',
     },
     backButton: {
          backgroundColor: 'rgba(255,255,255, 0.55)',
          position: 'absolute',
          top: 60,
          left: 20,
          padding: 8,
          borderRadius: 30,
          zIndex: 10
     },
});
