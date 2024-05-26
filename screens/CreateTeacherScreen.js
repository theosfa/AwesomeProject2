import React, { useState } from 'react';
import { View, TextInput, ScrollView, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signOut  } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, functions } from '../firebaseConfig';

const CreateTeacherScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [anyError, setAnyError] = useState(false);

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                name: name,
                surname: surname,
                email: email,
                permission: 'teacher',
            });

            // await signOut(auth);
            signInWithEmailAndPassword(auth, 'admin@admin.com', '12345678')
            .then((userCredential) => {
                navigation.navigate('Home'); // Assuming 'Home' is a route in your navigator
            })
            .catch((error) => {
                setAnyError(true);
                setErrorMessage(error.message);
            });
            // const createUser = functions.httpsCallable('createUser');
            // await createUser({
            //     email: email,
            //     password: password,
            //     name: name,
            //     surname: surname,
            //     role: 'teacher',
            // });

            // Alert.alert('Success', 'Teacher account created successfully');
            // navigation.navigate('Главная'); // Navigate to the login screen
        
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
                alignItems={'center'}
                justifyContent={'center'}
            >
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
                <Text style={styles.text}>Добавить преподавателя</Text>
            </TouchableOpacity>
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
    image:{
        marginTop: 50,
        height: 250,
        width: 250,
        marginBottom: 30,
    },
    input: {
        minWidth: '75%',
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
        minWidth: '75%',
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

export default CreateTeacherScreen;
