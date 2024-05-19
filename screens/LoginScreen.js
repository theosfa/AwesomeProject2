import React, { useState } from 'react';
import { View, TextInput, ScrollView, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';  // Ensure this path matches the location of your firebaseConfig.js
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [anyError, setAnyError] = useState(false);

    const navigation = useNavigation();

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigation.navigate('Home'); // Assuming 'Home' is a route in your navigator
            })
            .catch((error) => {
                setAnyError(true);
                setErrorMessage(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
            <View style={styles.container}>
            <Text style={styles.secondText}> Welcome back !</Text>
            <Text style={styles.mainText}> OOP App</Text>
            <Image source={require('../assets/images/preview.png')} style={styles.image} />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            {anyError && (
                <Text style={styles.errorText}>
                    {errorMessage}
                </Text>
            )}
            <TouchableOpacity onPress={handleSignIn} style={styles.register} >
                <Text style={styles.text}>Войти</Text>
            </TouchableOpacity>
            <View style={styles.login}>
            <Text style={styles.textLogin1}>Нет аккаунта? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}  >
                <Text style={styles.textLogin} >Зарегистрироваться</Text>
            </TouchableOpacity>
            </View></View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        backgroundColor: "#fff",
    },
    image:{
        marginTop: 50,
        height: 312,
        width: 312,
        marginBottom: 30,
        // marginTop: 20,
    },
    input: {
        width: '85%',
        height: 45,
        marginVertical: 10,
        // borderWidth: 1,
        borderRadius: 100,
        backgroundColor: "#F0F0F0",
        paddingLeft: 25,
        padding: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    login:{
        flex: 1,
        flexDirection: "row",
        flexWrap: 'nowrap',
        marginTop:5,
    },
    register: {
        backgroundColor: "#000",
        // height: 50,
        maxHeight: 50,
        minHeight: 50,
        width: '85%',
        flex: 1,
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text:{
        color: 'white',
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
    },
    textLogin:{
        color:'#808080'
    },
    textLogin1:{
        color:'#000'
    },
    mainText:{
        color: 'black',
        fontFamily: 'Poppins-Bold',
        fontSize: 40,
        marginBottom:0,
    },
    secondText:{
        color: 'black',
        fontFamily: 'Poppins-Regular',
        fontSize: 25,
        marginTop: 10,
        marginBottom:0,
    },
});

export default SignInScreen;
