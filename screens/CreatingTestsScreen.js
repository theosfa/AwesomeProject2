import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert,TouchableOpacity, ScrollView } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { useIsFocused } from '@react-navigation/native';
import { doc, collection, addDoc, getDoc, updateDoc, setDoc, setIndexConfiguration } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import { set } from 'firebase/database';

/* 
Создать тест с n колвом ответов
Создать тест с полем для ввода ответа
*/

const LearningAddingScreen = ({ navigation }) => {
    const [teacherGroups, setTeacherGroups] = useState([]);
    const [questionTitle, setQuestionTitle] = useState('');
    const [answers, setAnswers] = useState([]);
    const [ans, setAns] = useState('');
    const [title, setTitle] = useState('');
    const [isTest, setIsTest] = useState(false);
    const [test, setTest] = useState([])
    const [inputHeight, setInputHeight] = useState(45);
    const [privacy, setPrivacy] = useState('teacher'); 
    const [isPrivacy, setIsPrivacy] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [group, setGroup] = useState('');
    const [isGroup, setIsGroup] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchTestQuestions = async () => {
            try {
                const userId = auth.currentUser.uid;
                const teacherRef = doc(db, 'users', userId);
                const teacherSnapshot = await getDoc(teacherRef);
                const teacher = teacherSnapshot.data();
                
                if (teacher) {
                    // Extract marks (student IDs and scores)
                    const groups = teacher.groups;
                    console.log(groups);
                    // const studentIds = [...new Set(marks.map(mark => mark.id))];
                    if (groups){
                        console.log(groups);
                        const teacherGroups = groups.map(group => group.id);
                        setTeacherGroups(teacherGroups);
                    }
                } else {
                }
            } catch (error) {
            }
        };

        if (isFocused) {
            fetchTestQuestions();
        }
    }, [isFocused]);


    
    const updateTest = async () => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const testsCollectionRef = collection(db, "tests");
            const userDocRef = doc(db, "teacherTests", userId);
            try {
                const userDoc = await getDoc(userDocRef);
                let docRef;
                if (privacy === 'teacher'){
                    docRef = await addDoc(testsCollectionRef, { questions: test, title: title, privacy: privacy, group: group });
                } else {
                    docRef = await addDoc(testsCollectionRef, { questions: test, title: title, privacy: privacy });
                }
                let newTests = [];
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const tests = userData.tests || [];
                    if (privacy === 'teacher'){
                        newTests = [...tests, { id: docRef.id, group: group, type: 'tests' }];
                    } else {
                        newTests = [...tests, { id: docRef.id, type: 'tests' }];
                    }
                    await updateDoc(userDocRef, {
                        tests: newTests,
                    });  // Replace 'test-id' and 'score' with actual values
                } else {
                    if (privacy === 'teacher'){
                        newTests = [{ id: docRef.id, group: group, type: 'tests' }];
                    } else {
                        newTests = [{ id: docRef.id, type: 'tests' }];
                    }
                    await setDoc(userDocRef, {
                        tests: newTests,
                    });  // Replace 'test-id' and 'score' with actual values
                }
                
                Alert.alert("Тест добавлен");
            } catch (error) {
                Alert.alert("Ошибка добавления теста", "Если ошибка повторяется, обратитесь к администратору");
            }
            setTest([])
            setTitle('')
            setIsTest(false);
            setIsPrivacy(false);
            navigation.navigate('Статистика');
        }
    };
    
   

    const createTest = () => {
        setIsTest(true);
        console.log('Hello')
    }

    const addQuestion = () => {
        const newQuestion = { question: questionTitle, answer: correctAnswer, options: answers.map(a => a.text) };
        setTest(prevTest => [...prevTest, newQuestion]);
        setQuestionTitle('');
        setAnswers([{ text: '' }]); // Reset answers
        setCorrectAnswer('');
    }

    const setPrivacyTest = (privacy) => {
        setPrivacy(privacy);
        setIsPrivacy(true);
        if( privacy === 'teacher'){
            setIsGroup(true);
        }
    }

    const addAnswerField = () => {
        setAnswers([...answers, { text: '' }]);
    }

    const updateAnswer = (text, index) => {
        const newAnswers = answers.slice();
        newAnswers[index].text = text;
        setAnswers(newAnswers);
    }

    const chooseGroup = (id) => {
        setGroup(id);
        setIsGroup(false);
    }

    const reset = () => {
        setTest([])
        setTitle('')
        setIsTest(false);
        setIsPrivacy(false);
        setQuestionTitle('');
        setAnswers([{ text: '' }]); // Reset answers
        setCorrectAnswer('');
    }
    

    return (
        <View style={styles.container}>
        {isTest ? (<>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={styles.scroll}
                // justifyContent={'center'}
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
        {answers.map((item, index) => (
            <TextInput
                key={index}
                placeholder={`Ответ ${index + 1}`}
                value={item.text}
                onChangeText={(text) => updateAnswer(text, index)}
                style={styles.input}
            />
        ))}
        <TouchableOpacity onPress={addAnswerField} style={styles.register}>
            <Text style={styles.textLogin}>Добавить вариант ответа</Text>
        </TouchableOpacity>
        <TextInput
                        placeholder="Правильний ответ"
                        value={correctAnswer}
                        onChangeText={setCorrectAnswer}
                        style={styles.input}
                    />
            <TouchableOpacity onPress={addQuestion} style={styles.registerMain} >
                <Text style={styles.textLogin} >Добавить вопрос</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={updateTest} style={styles.registerMain} >
                <Text style={styles.textLogin} >Сформировать тест</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={reset} style={styles.registerMain} >
                        <Text style={styles.textLogin} >Отменить создание</Text>
                    </TouchableOpacity>
            </ScrollView>
        </>) : (<>
            {isPrivacy ? (<>
                {isGroup ? (<>
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={styles.scrollStyle}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        {teacherGroups.length > 0 ? (
                            teacherGroups.map((group, index) => (
                                <View style={styles.button} key={index}>
                                    <TouchableOpacity onPress={() => chooseGroup(group)} style={styles.button2} >
                                        <Text style={styles.button_text} > Группа: {group}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <Text>No group found.</Text>
                        )}
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
                    <TouchableOpacity onPress={reset} style={styles.registerMain} >
                        <Text style={styles.textLogin} >Отменить создание</Text>
                    </TouchableOpacity>
                </>)}
            </>) : (<>
                <TouchableOpacity onPress={() => setPrivacyTest('public')} style={styles.registerMain} >
                    <Text style={styles.textLogin} >Создать публичный тест</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPrivacyTest('teacher')} style={styles.registerMain} >
                    <Text style={styles.textLogin} >Создать приватный тест</Text>
                </TouchableOpacity>
            </>)}
            
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
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    scroll: {
        // flex: 1,
        width: '80%',
        margin: 0,
        
        // backgroundColor: 'green'
    },
    optionButton: {
        minWidth: '95%',
        maxWidth: '95%',
        maxHeight: 100,
        minHeight: 50,
        marginBottom: 10,
        // borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionStyle:{
        color: 'black',
        fontSize: 20,
    },
    // button: {
    //     fontSize: 18,
    //     marginBottom: 10,
    //     borderWidth: 1,
    //     padding: 10,
    //     borderRadius: 5,
    //     minwidth: '100%',
    // },
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
        marginBottom: 25,
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
    textLogin3:{
        color:'#fff',
        fontSize: 20,
        fontFamily: 'Poppins-Bold'
    },
    register3: {
        backgroundColor: "#000",
        // height: 50,
        maxHeight: 50,
        minHeight: 50,
        minwidth: '100%',
        flex: 1,
        marginTop: '5%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // scroll: {
    //     flex: 1,
    //     padding: '5%'
    // },
    button: {
        fontSize: 18,
        // width: '85%',
        minWidth: '95%',
        maxWidth: '95%',
        minHeight: 80,
        marginBottom: "6%",
        // borderWidth: 1,
        // padding: 10,
        marginLeft:"2.5%",
        marginRight:"2.5%",
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    button2: {
        fontSize: 18,
        // width: '85%',
        minWidth: '95%',
        maxWidth: '95%',
        minHeight: 50,
        // marginBottom: "6%",
        // borderWidth: 1,
        // padding: 10,
        // marginLeft:"2.5%",
        // marginRight:"2.5%",
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
    },
    profileImage: {
        alignSelf: 'center',
    },
    button_text:{
        fontFamily: 'Poppins-Regular',
        fontSize: 27,
        color: 'black',
    },
});

export default LearningAddingScreen;
