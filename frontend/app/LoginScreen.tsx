import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter()

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-Vindo!</Text>

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
                    style={styles.forgotPassword}
                    onPress={() => router.push('/PasswordRecovery')}
                >
                    <Text style={styles.forgotText}>esqueceu a senha?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => {
                        if (email === 'teste@email.com' && password === '123456') {
                           router.push('/HomeScreen')
                        } else {
                            alert('E-mail ou senha inválidos!');
                        }
                    }}
                >
                    <Text style={styles.loginText}>entrar</Text>
                </TouchableOpacity>

                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Text style={styles.registerText}>Ainda não tem Cadastro?</Text>
                    <TouchableOpacity onPress={() => router.push('/RegistrationScreen')}>
                        <Text style={styles.registerLink}>Cadastre-se.</Text>
                    </TouchableOpacity>
                </View>
            </View> 

            <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <Text style={styles.orText}>ou faça login com</Text>
                <View style={styles.separator} />
            </View>

            {/* Botão de login com Google */}
            <TouchableOpacity style={styles.googleButton}>
                <Image
                    source={require('../assets/images/google.png')}
                    style={styles.googleLogo}
                />
            </TouchableOpacity>
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
    title: {
        fontSize: 32,
        color: '#fff',
        marginBottom: 40,
        fontWeight: '300',
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 15,
    },
    forgotText: {
        fontSize: 12,
        color: '#ccc',
        textDecorationLine: 'underline',
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
    registerText: {
        fontSize: 12,
        textAlign: 'center',
        color: '#eee',
    },
    registerLink: {
        color: '#d0c1f7',
        textDecorationLine: 'underline',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 15,
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    orText: {
        marginHorizontal: 10,
        color: '#eee',
        fontSize: 12,
    },
    googleButton: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
        alignSelf: 'center',
        width: 180,
    },
    googleLogo: {
        width: 80,
        height: 20,
        resizeMode: 'contain',
    },
});
