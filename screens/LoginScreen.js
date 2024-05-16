import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';  // Ensure this path matches the location of your firebaseConfig.js
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                Alert.alert("Login Successful", `Welcome back!`);
                navigation.navigate('Home'); // Assuming 'Home' is a route in your navigator
            })
            .catch((error) => {
                Alert.alert("Login Failed", error.message);
            });
    };

    return (
        <View style={styles.container}>
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
            <Button title="Sign In" onPress={handleSignIn} />
            <Button
                title="Don't have an account? Sign Up"
                onPress={() => navigation.navigate('Signup')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    input: {
        width: '90%',
        height: 40,
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
    }
});

export default SignInScreen;
