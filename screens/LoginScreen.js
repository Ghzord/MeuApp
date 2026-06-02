import React, { useState } from 'react';
import {
    StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Estados para mensagens de erro/sucesso
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('error'); 

    const handleLogin = async () => {
        setMsg('');

        if (!email || !password) {
            setMsgType('error');
            setMsg('⚠️ Por favor, preencha todos os campos.');
            return;
        }

        try {
            const cleanEmail = email.toLowerCase().trim();
            const userKey = `user:${cleanEmail}`;
            
            // Requisição direta via Fetch para a API REST do Upstash
            const response = await fetch(`https://relieved-rattler-139617.upstash.io/get/${userKey}`, {
                headers: {
                    Authorization: 'Bearer gQAAAAAAAiFhAAIgcDJhNDY1ZGIxMTJkMjI0ODU1YmQ1OTI0NzU2Njc5ZmU3MA=='
                }
            });

            const data = await response.json();

            // Se o result for nulo, a chave do usuário não existe
            if (!data || data.result === null) {
                setMsgType('error');
                setMsg('❌ Este e-mail não está cadastrado.');
                return;
            }

            // Trata o retorno caso ele venha como string do banco
            const userData = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;

            if (userData.password === password) {
                setMsgType('success');
                setMsg(`Bem-vindo, ${userData.name}! Entrando...`);

                // Salva a sessão localmente
                await AsyncStorage.setItem('@user_email', cleanEmail);

                setTimeout(() => {
                    setEmail('');
                    setPassword('');
                    setMsg('');
                    navigation.navigate('Home');
                }, 1500);

            } else {
                setMsgType('error');
                setMsg('🔒 Senha incorreta. Tente novamente.');
            }

        } catch (err) {
            console.log("Erro ao tentar logar: ", err);
            setMsgType('error');
            setMsg('🌐 Erro de conexão com a nuvem.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

            <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
            />

            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Entre para continuar</Text>

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {msg ? (
                <View style={[
                    styles.statusBox, 
                    msgType === 'success' ? styles.successBox : styles.errorBox
                ]}>
                    <Text style={[
                        styles.statusText,
                        msgType === 'success' ? styles.successText : styles.errorText
                    ]}>
                        {msg}
                    </Text>
                </View>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Não tem uma conta?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerButtonText}>Crie uma agora</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 25,
        backgroundColor: '#fff'
    },
    logo: {
        width: 200,
        height: 170,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 15
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#222',
        marginTop: 20
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
        marginTop: 8
    },
    input: {
        height: 55,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
        fontSize: 15
    },
    button: {
        backgroundColor: '#ff6600',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold'
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25
    },
    registerText: {
        color: '#555',
        fontSize: 15
    },
    registerButtonText: {
        color: '#ff6601',
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 15
    },
    statusBox: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    errorBox: {
        backgroundColor: '#ffebee',
        borderWidth: 1,
        borderColor: '#ffcdd2',
    },
    successBox: {
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#c8e6c9',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        color: '#c62828',
    },
    successText: {
        color: '#2e7d32',
    }
});