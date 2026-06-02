import React, { useState } from 'react';
import { 
    StyleSheet, View, Text, TextInput, TouchableOpacity, 
    ScrollView, Image, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createClient } from '@vercel/kv';

// Configuração do banco de dados KV (Upstash)
const db = createClient({
    url: 'https://relieved-rattler-139617.upstash.io', 
    token: 'gQAAAAAAAiFhAAIgcDJhNDY1ZGIxMTJkMjI0ODU1YmQ1OTI0NzU2Njc5ZmU3MA==',
});

export default function RegisterScreen({ navigation }) {
    // Dados do formulário
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Estados de controle da tela
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('error'); 
    const [hidePass, setHidePass] = useState(true);
    const [hideConfirm, setHideConfirm] = useState(true);

    // Máscara simples para o telefone
    const formatPhone = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 11);
        if (!digits) return '';
        if (digits.length <= 2) return `(${digits}`;
        
        const ddd = digits.slice(0, 2);
        const rest = digits.slice(2);
        
        if (rest.length <= 4) return `(${ddd}) ${rest}`;
        return `(${ddd}) ${rest.slice(0, rest.length - 4)}-${rest.slice(-4)}`;
    };

    const handleRegister = async () => {
        setMsg('');

        // Validação básica de campos vazios
        if (!name || !phone || !email || !address || !password) {
            setMsgType('error');
            setMsg('⚠️ Preencha todos os campos obrigatórios.');
            return;
        }

        if (password !== confirmPassword) {
            setMsgType('error');
            setMsg('❌ As senhas digitadas não batem.');
            return;
        }

        try {
            const cleanEmail = email.toLowerCase().trim();
            const userKey = `user:${cleanEmail}`;
            const userData = { name, phone, email: cleanEmail, address, password };

            // Salva no banco Vercel KV
            await db.set(userKey, JSON.stringify(userData));

            setMsgType('success');
            setMsg('Conta criada com sucesso! Redirecionando...');

            // Limpa o formulário e navega após delay
            setTimeout(() => {
                setName('');
                setPhone('');
                setEmail('');
                setAddress('');
                setPassword('');
                setConfirmPassword('');
                setMsg('');
                navigation.navigate('Login');
            }, 2000);

        } catch (err) {
            console.log("Erro no registro: ", err);
            setMsgType('error');
            setMsg('Erro ao conectar com o servidor.');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logo}
                    />

                    <Text style={styles.title}>Criar Conta</Text>
                    <Text style={styles.subtitle}>
                        Cadastre-se para pedir suas comidas favoritas
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome completo"
                        value={name}
                        onChangeText={setName}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Telefone"
                        value={phone}
                        onChangeText={(txt) => setPhone(formatPhone(txt))}
                        keyboardType="phone-pad"
                        maxLength={15}
                    />

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
                        placeholder="Endereço de entrega"
                        value={address}
                        onChangeText={setAddress}
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Senha"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={hidePass}
                        />
                        <TouchableOpacity onPress={() => setHidePass(!hidePass)}>
                            <Ionicons
                                name={hidePass ? 'eye' : 'eye-off'}
                                size={22}
                                color="#777"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Confirmar senha"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={hideConfirm}
                        />
                        <TouchableOpacity onPress={() => setHideConfirm(!hideConfirm)}>
                            <Ionicons
                                name={hideConfirm ? 'eye' : 'eye-off'}
                                size={22}
                                color="#777"
                            />
                        </TouchableOpacity>
                    </View>

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

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Criar Conta</Text>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Já possui uma conta?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginButtonText}>Entrar</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flexGrow: 1,
        padding: 12,
        backgroundColor: '#fff',
        paddingBottom: 20
    },
    scrollView: {
        flex: 1
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
        color: '#222'
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 18,
        marginTop: 6
    },
    input: {
        height: 48,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
        fontSize: 15
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
        height: 48
    },
    passwordInput: {
        flex: 1,
        fontSize: 15
    },
    button: {
        backgroundColor: '#ff6600',
        height: 50,
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25
    },
    loginText: {
        color: '#555'
    },
    loginButtonText: {
        color: '#ff6600',
        fontWeight: 'bold',
        marginLeft: 5
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