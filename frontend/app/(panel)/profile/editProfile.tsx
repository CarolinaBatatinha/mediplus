import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { usuarioService } from '../../../services/usuarioService';

export default function EditProfileScreen() {
     const router = useRouter();
     const [name, setName] = useState('');
     const [email, setEmail] = useState('');

     useFocusEffect(
          React.useCallback(() => {
               loadUserData(); 
          }, [])
     );

     const loadUserData = async () => {
          const savedName = await AsyncStorage.getItem('userName');
          const savedEmail = await AsyncStorage.getItem('userEmail');
          if (savedName) setName(savedName);
          if (savedEmail) setEmail(savedEmail);
     };

     const saveProfile = async () => {
          if (!name.trim()) {
               Alert.alert('Erro', 'Por favor, informe seu nome.');
               return;
          }
          if (!email.trim() || !email.includes('@')) {
               Alert.alert('Erro', 'Por favor, informe um e-mail válido.');
               return;
          }

          try {
               const usuarioId = await AsyncStorage.getItem('idUsuario');
               if (!usuarioId) throw new Error('Usuário não identificado.');

               await usuarioService.atualizarParcial(usuarioId, { nome: name.trim(), email: email.trim() });

               await AsyncStorage.multiSet([
                    ['userName', name.trim()],
                    ['userEmail', email.trim()],
               ]);

               Alert.alert('Sucesso', 'Perfil atualizado!', [{
                         text: 'OK', onPress: () => router.push("/(panel)/profile/profile")
                    },
               ]);
          } catch (error) {
               console.error(error);
               Alert.alert('Erro', 'Não foi possível atualizar. Tente novamente.');
          }
     };

     return (
          <View style={styles.container}>
               {/* Cabeçalho */}
               <TouchableOpacity onPress={() => router.back()} style={styles.header}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.headerText}>Editar Perfil</Text>
               </TouchableOpacity>

               {/* Formulário */}
               <View style={styles.form}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                         style={styles.input}
                         value={name}
                         onChangeText={setName}
                         placeholder="Seu nome completo"
                         placeholderTextColor="#aaa"
                         autoCapitalize="words"
                    />

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                         style={styles.input}
                         value={email}
                         onChangeText={setEmail}
                         placeholder="seu@email.com"
                         placeholderTextColor="#aaa"
                         keyboardType="email-address"
                         autoCapitalize="none"
                    />

                    <TouchableOpacity style={styles.button} onPress={saveProfile}>
                         <Text style={styles.buttonText}>Salvar Alterações</Text>
                    </TouchableOpacity>
               </View>
          </View>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#8793FF',
          paddingTop: 100,
          paddingHorizontal: 20,
     },
     header: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 30,
     },
     headerText: {
          color: '#fff',
          fontSize: 20,
          fontWeight: '300',
          marginLeft: 10,
     },
     form: {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 30,
          padding: 20,
     },
     label: {
          color: '#fff',
          fontSize: 16,
          marginBottom: 8,
          marginTop: 15,
     },
     input: {
          backgroundColor: '#fff',
          borderRadius: 30,
          padding: 15,
          fontSize: 16,
          color: '#333',
     },
     button: {
          backgroundColor: '#5A5AFF',
          borderRadius: 30,
          padding: 15,
          alignItems: 'center',
          marginTop: 30,
     },
     buttonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '600',
     },
});