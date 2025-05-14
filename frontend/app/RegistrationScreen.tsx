import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RegistrationScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Image source={require('../assets/images/user-icon.png')} style={styles.avatar} />

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
          <Ionicons name="calendar-outline" size={20} color="#aaa" style={styles.icon} />
          <TextInput
            placeholder="data de nascimento"
            style={styles.input}
            value={birthDate}
            onChangeText={setBirthDate}
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

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.icon} />
          <TextInput
            placeholder="confirme a senha"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>

        <View style={styles.terms}>
          <Text style={styles.termsText}>
            <Text style={styles.checkbox}>☑</Text> Concordo com as{' '}
            <Text style={styles.link}>Condições</Text> e{' '}
            <Text style={styles.link}>Termos de Uso</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerText}>cadastrar</Text>
        </TouchableOpacity>

        <Text style={styles.loginRedirect}>
          Já possui Cadastro?{' '}
          <Text style={styles.link} onPress={() => router.push('/LoginScreen')}>
            Faça Login
          </Text>
        </Text>
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
  avatar: {
    alignSelf: 'center',
    width: 90,
    height: 90,
    marginBottom: 25,
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
  terms: {
    marginBottom: 15,
  },
  checkbox: {
    color: '#fff',
    marginRight: 5,
  },
  termsText: {
    fontSize: 12,
    color: '#eee',
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
    color: '#d0c1f7',
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
  loginRedirect: {
    fontSize: 12,
    textAlign: 'center',
    color: '#eee',
  },
});
