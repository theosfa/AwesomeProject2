import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert,TouchableOpacity, ScrollView } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, collection, addDoc, getDoc, updateDoc, setDoc, setIndexConfiguration } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import { set } from 'firebase/database';

/* 
Создать тест с n колвом ответов
Создать тест с полем для ввода ответа
*/

const CreatingLecturesScreen = ({ navigation }) => {
    const [teacherGroups, setTeacherGroups] = useState([]);
    const [questionTitle, setQuestionTitle] = useState('');
    const [answers, setAnswers] = useState([]);
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [isTest, setIsTest] = useState(false);
    const [test, setTest] = useState([])
    const [inputHeight1, setInputHeight1] = useState(45);
    const [inputHeight2, setInputHeight2] = useState(45);
    const [inputHeight3, setInputHeight3] = useState(45);
    const [privacy, setPrivacy] = useState(''); 
    const [isPracticum, setIsPracticum] = useState(false);
    const [isLecture, setIsLecture] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [practicumQuestion, setPracticumQuestion] = useState('');
    const [group, setGroup] = useState('');
    const [isGroup, setIsGroup] = useState(false);

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

        fetchTestQuestions();
    }, []);


    
    const updateTest = async () => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const testsCollectionRef = collection(db, "lectures");
            const userDocRef = doc(db, "teacherTests", userId);
            try {
                const userDoc = await getDoc(userDocRef);
                const docRef = await addDoc(testsCollectionRef, { materials: test, title: title, privacy: privacy });
                let newTests = [];
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const tests = userData.tests || [];
                    if (privacy === 'with'){
                        newTests = [...tests, { id: docRef.id, type: 'practicum' }];
                    } else {
                        newTests = [...tests, { id: docRef.id, type: 'lectures' }];
                    }
                    await updateDoc(userDocRef, {
                        tests: newTests,
                    });  // Replace 'test-id' and 'score' with actual values
                } else {
                    if (privacy === 'with'){
                        newTests = [ {id: docRef.id, type: 'practicum'} ];
                    } else {
                        newTests = [ {id: docRef.id, type: 'lectures'} ];
                    }
                    await setDoc(userDocRef, {
                        tests: newTests,
                    });  // Replace 'test-id' and 'score' with actual values
                }
                
                Alert.alert("Успешно добавлено");
            } catch (error) {
                Alert.alert("Ошибка добавления", "Если ошибка повторяется, обратитесь к администратору");
            }
            setTest([])
            setTitle('')
            setIsTest(false);
            setIsPracticum(false);
            setIsLecture(false);
            setPrivacy('');
            navigation.navigate('Статистика');
        }
    };
    
   

    
    const addQuestion = () => {
        let newQuestion;
        if (questionTitle !== "" && text !== "" && privacy === "without"){
            newQuestion = {title : questionTitle, text : text};
            setTest(prevTest => [...prevTest, newQuestion]);
            setQuestionTitle('');
            setAnswers([{ text: '' }]); // Reset answers
            setCorrectAnswer('');
            setPracticumQuestion('');
            setInputHeight1(45)
            setInputHeight2(45)
            setInputHeight3(45)
            setText('');
        }else if(questionTitle !== "" && text !== "" && practicumQuestion !== "" && correctAnswer !== ""){
            newQuestion = { title : questionTitle, text : text, practicumQuestion: practicumQuestion, correctAnswer: correctAnswer};
            setTest(prevTest => [...prevTest, newQuestion]);
            setQuestionTitle('');
            setAnswers([{ text: '' }]); // Reset answers
            setCorrectAnswer('');
            setPracticumQuestion('');
            setInputHeight1(45)
            setInputHeight2(45)
            setInputHeight3(45)
            setText('');
        } else {
            Alert.alert("Ошибка", "Заполните все поля");
        }
    }
    
    const setPrivacyTest = (privacy) => {
        setPrivacy(privacy);
        if (privacy === "with") {
            setIsPracticum(true);
        }
    }
    
    const createTest = () => {
        if (title !== ""){
            setIsLecture(true);
        } else {
            Alert.alert("Ошибка", "Заполните поле название");
        }
    }

    const reset = () => {
        setQuestionTitle('');
        setAnswers([{ text: '' }]); // Reset answers
        setCorrectAnswer('');
        setPracticumQuestion('');
        setInputHeight1(45)
        setInputHeight2(45)
        setInputHeight3(45)
        setText('');
        setTest([])
        setTitle('')
        setIsTest(false);
        setIsPracticum(false);
        setIsLecture(false);
        setPrivacy('');
    }
    

    return (
        <View style={styles.container}>
        {isLecture ? (<>
        {isPracticum ? (<>
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
                placeholder="Название темы"
                value={questionTitle}
                onChangeText={setQuestionTitle}
                style={[styles.input, { height: inputHeight1 }, {borderRadius: 20}]}
                multiline={true}
                onContentSizeChange={(event) => setInputHeight1(event.nativeEvent.contentSize.height)}
            />
            <TextInput
                placeholder={`Материал темы`}
                value={text}
                onChangeText={setText}
                style={[styles.input, { height: inputHeight2 }, {borderRadius: 20}]}
                multiline={true}
                onContentSizeChange={(event) => setInputHeight2(event.nativeEvent.contentSize.height)}
            />
            <TextInput
                placeholder={`Задача для практикума`}
                value={practicumQuestion}
                onChangeText={setPracticumQuestion}
                style={[styles.input, { height: inputHeight3 }, {borderRadius: 20}]}
                multiline={true}
                onContentSizeChange={(event) => setInputHeight3(event.nativeEvent.contentSize.height)}
            />
            <TextInput
                placeholder="Ответ к задаче"
                value={correctAnswer}
                onChangeText={setCorrectAnswer}
                style={styles.input}
            />
            <TouchableOpacity onPress={addQuestion} style={styles.register} >
                <Text style={styles.textLogin} >Добавить тему</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={updateTest} style={styles.register} >
                <Text style={styles.textLogin} >Сформировать практикум</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={reset} style={styles.registerMain} >
                    <Text style={styles.textLogin} >Отменить создание</Text>
                </TouchableOpacity>
            </ScrollView>
        </>) : (<>
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
                placeholder="Название темы"
                value={questionTitle}
                onChangeText={setQuestionTitle}
                style={[styles.input, { height: inputHeight1 }, {borderRadius: 20}]}
                multiline={true}
                onContentSizeChange={(event) => setInputHeight1(event.nativeEvent.contentSize.height)}
            />
            <TextInput
                placeholder={`Материал темы`}
                value={text}
                onChangeText={setText}
                style={[styles.input, { height: inputHeight2 }, {borderRadius: 20}]}
                multiline={true}
                onContentSizeChange={(event) => setInputHeight2(event.nativeEvent.contentSize.height)}
            />
            <TouchableOpacity onPress={addQuestion} style={styles.register} >
                <Text style={styles.textLogin} >Добавить тему</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={updateTest} style={styles.register} >
                <Text style={styles.textLogin} >Сформировать лекцию</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={reset} style={styles.registerMain} >
                    <Text style={styles.textLogin} >Отменить создание</Text>
                </TouchableOpacity>
            </ScrollView>
        
        </>)}
        </>) : (<>
            {privacy ? (<>
                <TextInput
                    placeholder="Название"
                    value={title}
                    onChangeText={setTitle}
                    // secureTextEntry
                    style={styles.inputMain}
                />
                <TouchableOpacity onPress={createTest} style={styles.registerMain} >
                    <Text style={styles.textLogin} >Добавить название</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={reset} style={styles.registerMain} >
                    <Text style={styles.textLogin} >Отменить создание</Text>
                </TouchableOpacity>
            </>) : (<>
                <TouchableOpacity onPress={() => setPrivacyTest('without')} style={styles.registerMain} >
                    <Text style={styles.textLogin} >Создать лекцию</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPrivacyTest('with')} style={styles.registerMain} >
                    <Text style={styles.textLogin} >Создать практикум</Text>
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
});

export default CreatingLecturesScreen;
