import React, { useState } from 'react';
import { View, TextInput, ScrollView, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [anyError, setAnyError] = useState(false);

    const handleSignUp = async () => {
        try {
            // Check if the username already exists
            const testRef = doc(db, 'students', username);
            const testSnapshot = await getDoc(testRef);
            if (testSnapshot.exists()) {
                console.log(testSnapshot.data())
                setAnyError(true);
                setErrorMessage("Никнейм уже занят.");
                return;
            }else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const userRef = doc(db, "users", user.uid);
                await setDoc(userRef, {
                    username: username,
                    name: name,
                    surname: surname,
                    email: email,
                    permission: 'student',
                });
                await setDoc(testRef, {
                    id: user.uid,
                    name: name,
                    surname: surname,
                    username: username,
                });

                navigation.navigate('Login'); // Navigate to the login screen
            }
        
        } catch (error) {
            setAnyError(true);
            setErrorMessage(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                // alignItems={'center'}
                style={styles.scroll}
            >
                <View style={styles.container}>
            <Image source={require('../assets/images/preview.png')} style={styles.image} />

            <TextInput
                placeholder="Никнейм"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Имя"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Фамилия"
                value={surname}
                onChangeText={setSurname}
                style={styles.input}
            />
            <TextInput
                placeholder="Ел. почта"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Пароль"
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
            <TouchableOpacity onPress={handleSignUp} style={styles.register} >
                <Text style={styles.text}>Зарегистрироваться</Text>
            </TouchableOpacity>
            <View style={styles.login}>
            <Text style={styles.textLogin1}>Уже есть аккаунт? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}  >
                <Text style={styles.textLogin} >Войти</Text>
            </TouchableOpacity>
            </View>
            </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 20,
        backgroundColor: "#fff",
    },
    scroll:{
        marginVertical: '10%',
    },
    image:{
        marginTop: 50,
        height: 250,
        width: 250,
        marginBottom: 30,
    },
    input: {
        minWidth: '85%',
        maxWidth: '85%',
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
    }
});

export default SignupScreen;
