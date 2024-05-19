import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert,TouchableOpacity, ScrollView } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, collection, addDoc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';

/* 
Создать тест с n колвом ответов
Создать тест с полем для ввода ответа
*/

const LearningAddingScreen = ({ navigation }) => {
    const [questionTitle, setQuestionTitle] = useState('');
    const [ans1, setAns1] = useState('');
    const [ans2, setAns2] = useState('');
    const [ans3, setAns3] = useState('');
    const [ans4, setAns4] = useState('');
    const [ans, setAns] = useState('');
    const [title, setTitle] = useState('');
    const [isTest, setIsTest] = useState(false);
    const [test, setTest] = useState([])
    const [inputHeight, setInputHeight] = useState(45); 

    
    const updateTest = async () => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const testsCollectionRef = collection(db, "tests");
            const userDocRef = doc(db, "teacherTests", userId);
            try {
                const userDoc = await getDoc(userDocRef);
                const docRef = await addDoc(testsCollectionRef, { questions: test, title: title });
                let newTests = [];
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const tests = userData.tests || [];
                    newTests = [...tests, { id: docRef.id }];
                    await updateDoc(userDocRef, {
                        tests: newTests,
                    });  // Replace 'test-id' and 'score' with actual values
                } else {
                    newTests = [{ id: docRef.id }];
                    await setDoc(userDocRef, {
                        tests: newTests,
                    });  // Replace 'test-id' and 'score' with actual values
                }
                
                Alert.alert("Lecture added");
            } catch (error) {
                console.error("Error adding lecture:", error);
                Alert.alert("Update Failed", error.message);
            }
            setTest([])
            setTitle('')
            setIsTest(false);
            navigation.navigate('Статистика');
        }
    };
    
   

    const createTest = () => {
        setIsTest(true);
        console.log('Hello')
    }

    const addQuestion = () => {
        const newQuestion = { question : questionTitle, answer : ans, options : [ans1, ans2, ans3, ans4] };
        setTest(prevTest => [...prevTest, newQuestion]);
        setQuestionTitle('')
        
        setAns('')
        setAns1('')
        setAns2('')
        setAns3('')
        setAns4('')
        console.log(test)
    }
    

    return (
        <View style={styles.container}>
        {isTest ? (<>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={styles.scroll}
                justifyContent={'center'}
                padding={0}
                margin={0}
            >
        <Text style={styles.text}>{title}</Text>
            <TextInput
            placeholder="Текст вопроса"
            value={questionTitle}
            onChangeText={setQuestionTitle}
            style={[styles.input, { height: inputHeight }, {borderRadius: 20}]}
            multiline={true}
            onContentSizeChange={(event) => setInputHeight(event.nativeEvent.contentSize.height)}
        />
        <TextInput
            placeholder="Ответ 1"
            value={ans1}
            onChangeText={setAns1}
            style={styles.input}
        />
        <TextInput
            placeholder="Ответ 2"
            value={ans2}
            onChangeText={setAns2}
            style={styles.input}
        />
        <TextInput
            placeholder="Ответ 3"
            value={ans3}
            onChangeText={setAns3}
            style={styles.input}
            autoCapitalize="none"
        />
        <TextInput
            placeholder="Ответ 4"
            value={ans4}
            onChangeText={setAns4}
            // secureTextEntry
            style={styles.input}
        />
         <TextInput
            placeholder="Правильний ответ"
            value={ans}
            onChangeText={setAns}
            // secureTextEntry
            style={styles.input}
        />
            <TouchableOpacity onPress={addQuestion} style={styles.register} >
                <Text style={styles.textLogin} >Добавить вопрос</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={updateTest} style={styles.register} >
                <Text style={styles.textLogin} >Сформировать тест</Text>
            </TouchableOpacity>
            </ScrollView>
        </>) : (<>
            <TextInput
                placeholder="Название теста"
                value={title}
                onChangeText={setTitle}
                // secureTextEntry
                style={styles.inputMain}
            />
            <TouchableOpacity onPress={createTest} style={styles.registerMain} >
                <Text style={styles.textLogin} >Создать тест</Text>
            </TouchableOpacity>
        </>)}
        
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 20,
        padding: 0,
        margin: 0,
        backgroundColor: '#fff',
    },
    scroll: {
        // flex: 1,
        width: '80%',
        margin: 0,
        
        // backgroundColor: 'green'
    },
    button: {
        fontSize: 18,
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        minwidth: '100%',
    },
    textLogin:{
        color:'#fff',
        fontSize: 20,
        fontFamily: 'Poppins-Bold'
    },
    text :{
        marginLeft:'5%',
        marginBottom:'5%',
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color:'#000'
    },
    register: {
        backgroundColor: "#000",
        // height: 50,
        maxHeight: 50,
        minHeight: 50,
        minwidth: '100%',
        flex: 1,
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerMain: {
        backgroundColor: "#000",
        // height: 50,
        maxHeight: 50,
        minHeight: 50,
        // flex: 1,
        minWidth: '80%',
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
      },
      input: {
        minwidth: '100%',
        height: 45,
        marginVertical: 10,
        // borderWidth: 1,
        borderRadius: 100,
        backgroundColor: "#F0F0F0",
        paddingLeft: 25,
        padding: 10,
    },
    inputMain: {
        minWidth: '80%',
        height: 45,
        marginVertical: 10,
        // borderWidth: 1,
        borderRadius: 100,
        backgroundColor: "#F0F0F0",
        paddingLeft: 25,
        padding: 10,
    },
});

export default LearningAddingScreen;
