import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const auth = getAuth();
    const db = getFirestore();

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // Add a new document in collection "users"
                const userRef = doc(db, "users", user.uid);
                setDoc(userRef, {
                    username: username,
                    name: name,
                    surname: surname,
                    email: email,
                    permission: 'student',
                })
                .then(() => {
                    Alert.alert("User registered successfully!");
                    navigation.navigate('Login'); // Navigate to login screen or anywhere you need
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    Alert.alert("Error adding user details to database.");
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Alert.alert(errorMessage);
            });
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Surname"
                value={surname}
                onChangeText={setSurname}
                style={styles.input}
            />
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
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button
                title="Already have an account? Log In"
                onPress={() => navigation.navigate('Login')}
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

export default SignupScreen;
