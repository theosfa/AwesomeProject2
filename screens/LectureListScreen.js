import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Update this path if necessary
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler'; // Import TouchableOpacity for buttons

const LectureListScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [sections, setSections] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isPracticum, setIsPracticum] = useState();
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const fetchLectureData = async () => {
            try {
                const lectureRef = doc(db, 'lectures', id);
                const lectureSnapshot = await getDoc(lectureRef);
                if (lectureSnapshot.exists()){
                    const lecture = lectureSnapshot.data();
                    setSections(lecture.materials);
                    setTitle(lecture.title);
                    setIsPracticum(lecture.privacy);
                    setAnswers(lecture.materials.map(() => "")); // Initialize answers array
                } else {
                }
            } catch (error) {
            }
            setLoading(false);
        };
        
        fetchLectureData();
    }, [id]);

    const handleOpenTitle = (index) => {
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    const handleAnswerChange = (index, text) => {
        const newAnswers = [...answers];
        newAnswers[index] = text;
        setAnswers(newAnswers);
    };

    const handleSubmitAnswers = async () => {
        let score = 0;
        sections.forEach((section, index) => {
            if (section.correctAnswer === answers[index]) {
                score += 1;
            }
        });
        const percentage = (score / sections.length) * 100;

        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const userDocRef = doc(db, "users", userId);
            const testRef = doc(db, 'lectures', id);
            try {
                const testSnapshot = await getDoc(testRef);
                const userDoc = await getDoc(userDocRef);
                let newTests = [];
                let newMarks = [];
                if (userDoc.exists()) {
                    const testData = testSnapshot.data();
                    const marks = testData.marks || [];
                    const userData = userDoc.data();
                    const tests = userData.tests || [];
                    newTests = [...tests, { id: id, score: Number(percentage.toFixed()), type: 'lectures' }];
                    newMarks =  [...marks, { id: userDoc.data().username, score: Number(percentage.toFixed()) }]; // Replace 'test-id' and 'score' with actual values
                } else {
                    newTests = [{ id: id, score: Number(percentage.toFixed()), type: 'lectures' }];
                    newMarks =  [{ id: userDoc.data().username, score: Number(percentage.toFixed()) }]  // Replace 'test-id' and 'score' with actual values
                }
                await updateDoc(userDocRef, {
                    tests: newTests,
                });
                await updateDoc(testRef, {
                    marks: newMarks,
                });
            } catch (error) {
                console.error("Не удалось добавить оценку", "Если ошибка повториться, обратитесь к администратору");
            }
            navigation.navigate('Главная');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                {sections.map((item, index) => (
                    <View key={index}>
                        <TouchableOpacity onPress={() => handleOpenTitle(index)} style={styles.optionButton}>
                            <Text style={styles.optionStyle}>{item.title}</Text>
                        </TouchableOpacity>
                        {selectedIndex === index && (
                            <View style={styles.selectedTextStyle}>
                                <Text>{item.text}</Text>
                                {isPracticum === 'with' && (
                                    <>  
                                        <Text style={styles.title2}>Задача для проверки заний</Text>
                                        <Text style={styles.question}>{item.practicumQuestion}</Text>
                                        <TextInput
                                            placeholder="Ответ к задаче"
                                            value={answers[index]}
                                            onChangeText={(text) => handleAnswerChange(index, text)}
                                            style={styles.input}
                                        />
                                    </>
                                )}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
            {isPracticum === 'with' && (
                <TouchableOpacity onPress={handleSubmitAnswers} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Завершить практикум</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: '8%',
        color: 'black',
    },
    title2: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: '4%',
        marginTop: '8%',
        color: 'black',
    },
    question: {
        fontSize: 15,
        fontWeight: 'regular',
        marginBottom: '4%',
        color: 'black',
    },
    input: {
        minWidth: '95%',
        height: 45,
        marginVertical: 10,
        borderRadius: 20,
        backgroundColor: "#F0F0F0",
        paddingLeft: 25,
        padding: 10,
    },
    optionButton: {
        // minWidth: '98%',
        // maxWidth: '98%',
        maxHeight: 80,
        minHeight: 50,
        // padding: 10,
        // borderRadius: 20,
        // backgroundColor: '#F0F0F0',
        // flex: 1,
        // margin: '1%',
        // alignItems: 'center',
        // justifyContent: 'center',
        fontSize: 18,
        // width: '85%',
        minWidth: '95%',
        maxWidth: '95%',
        // minHeight: 80,
        marginBottom: "5%",
        // borderWidth: 1,
        padding: 10,
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
    optionStyle: {
        color: 'black',
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
        padding: 10,
    },
    submitButton: {
        backgroundColor: '#000',
        height: 50,
        width: '85%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 20,
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
    }
});

export default LectureListScreen;

