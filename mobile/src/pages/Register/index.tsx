import React,{ useContext,useState } from 'react';

import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

// Routes
import { useNavigation } from '@react-navigation/native';
import { StackParamsList } from '../../routes/auth.routes';
import { StackNavigationProp } from '@react-navigation/stack';

export default function Register(){

    const { error,loadingAuth,authRegister } = useContext(AuthContext);

    const navigation = useNavigation<StackNavigationProp<StackParamsList>>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = () => {
        
        const data = {
            name,
            email,
            password,
            confirmPassword
        }

        authRegister(data);

    }

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>ReactGram</Text>
            <Text style={styles.paragrafo}>Faça seu login</Text>
            
            <View style={styles.form}>
                {error && (
                    <Text style={styles.error}>{error}</Text>
                )}
                <View style={styles.label}>
                    <Text style={styles.span}>Nome:</Text>
                    <TextInput 
                        placeholder='Digite seu nome'
                        style={styles.input}
                        placeholderTextColor="#aaa"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.label}>
                    <Text style={styles.span}>Email:</Text>
                    <TextInput 
                        keyboardType='email-address'
                        placeholder='Digite seu email'
                        style={styles.input}
                        placeholderTextColor="#aaa"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.label}>
                    <Text style={styles.span}>Senha:</Text>
                    <TextInput 
                        placeholder='Digite sua senha'
                        style={styles.input}
                        placeholderTextColor="#aaa"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <View style={styles.label}>
                    <Text style={styles.span}>Confirma sua senha:</Text>
                    <TextInput 
                        placeholder='Digite seu email'
                        secureTextEntry={true}
                        style={styles.input}
                        placeholderTextColor="#aaa"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>
                <TouchableOpacity style={styles.button} disabled={loadingAuth} onPress={handleSubmit}>
                    {loadingAuth ? (
                        <ActivityIndicator size={25} color="#fff" /> 
                    ) : (
                        <Text style={styles.textButton}>Entrar</Text>
                    )}
                    {/* <Text style={styles.textButton}>Entrar</Text> */}
                </TouchableOpacity>
            </View>
            <Text style={styles.link} onPress={() => navigation.navigate("SignIn")}>Já possui cadastro? Clique Aqui!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        color: "#fafafa"
    },
    logo: {
        fontSize: 40,
        fontWeight: 'bold',
        color: "#fafafa",
        marginBottom: 20,
    },
    paragrafo: {
        color: "#fafafa",
        marginBottom: 15,
        fontSize: 18
    },
    error: {
        paddingVertical: 15,
        paddingHorizontal: 8,
        width: "100%",
        textAlign: 'center',
        backgroundColor: '#F8D7DA',
        color: "#842029",
        marginBottom: 10,
        borderRadius: 5
    },
    form: {
        width: "80%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    label: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 10
    },
    span: {
        color: '#fafafa',
        fontSize: 15,
        marginBottom: 5
    },
    input: {
        width: '100%',
        backgroundColor: "#3b3b3b",
        borderColor: "#5555",
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 10,
        color: '#fff'
    },
    button: {
        width: "100%",
        paddingVertical: 12,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#0094f6",
        borderRadius: 5
    },
    textButton: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold"
    },
    link: {
        marginTop: 40,
        color: '#fafafa',
        textAlign: "left",
        fontSize: 15
    }
})