import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Update this path if necessary
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler'; // Import TouchableOpacity for buttons

const TestScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    useEffect(() => {
        const fetchTestQuestions = async () => {
            try {
                const testRef = doc(db, 'tests', id);
                const testSnapshot = await getDoc(testRef);
                const test = testSnapshot.data();
                if (test) {
                    setQuestions(test.questions);
                    setTitle(test.title);
                } else {
                    Alert.alert('Test not found');
                }
            } catch (error) {
                console.error('Error fetching test questions:', error);
                Alert.alert('Failed to fetch test questions.');
            }
            setLoading(false);
        };

        fetchTestQuestions();
    }, [id]);

    const maxScore = questions.length;
    let percentage = 0;

    const handleAnswer = (selectedAnswer) => {
        const answer = questions[currentQuestionIndex]?.answer;
        if(answer === selectedAnswer){
          setScore((prevScore)=> prevScore+1);
        }
        const nextQuestion = currentQuestionIndex + 1;
        if(nextQuestion < questions.length){
            setCurrentQuestionIndex(nextQuestion);
        }else{
            setShowScore(true);
        }
      }

      const handRestart = () => {
        navigation.navigate('Main');
      }

      const handleUpdateProfile = async () => {
        percentage = score*100/maxScore;
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const userDocRef = doc(db, "users", userId);
            const testRef = doc(db, 'tests', id);
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
                    newTests = [...tests, { id: id, score: Number(percentage.toFixed()), type: 'tests' }];
                    newMarks =  [...marks, { id: userDoc.data().username, score: Number(percentage.toFixed()) }]; // Replace 'test-id' and 'score' with actual values
                } else {
                    newTests = [{ id: id, score: Number(percentage.toFixed()), type: 'tests' }];
                    newMarks =  [{ id: userDoc.data().username, score: Number(percentage.toFixed()) }]  // Replace 'test-id' and 'score' with actual values
                }
                await updateDoc(userDocRef, {
                    tests: newTests,
                });
                await updateDoc(testRef, {
                    marks: newMarks,
                });
            } catch (error) {
                console.error("Error updating user details:", error);
            }
            navigation.navigate('Главная');
        }
    };
    

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            {
            showScore 
            ? 
                
                    <View style={styles.restartContainer}>
                        {/* <View style={styles.restartContainer2}> */}
                        <Text style={styles.showScore}> {Number((score*100/maxScore).toFixed())} % </Text>
                        <TouchableOpacity onPress={handleUpdateProfile} style={styles.restart}>
                            <Text style={styles.showScore2}> Завершить тест</Text>
                        </TouchableOpacity>
                        {/* </View> */}
                    </View> 
                    :
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    // alignItems={'center'}
                    style={styles.scroll}
                >
                    <View>
                    <Text style={styles.title}>{title}</Text>
                    {/* <View style={styles.questionContainer}> */}
                        <Text style={styles.question}>{questions[currentQuestionIndex].question}</Text>
                        {/* <View style={styles.optionsContainer}> */}
                            {questions[currentQuestionIndex]?.options.map((item) => {
                                return <TouchableOpacity onPress={()=> handleAnswer(item)} style={styles.button}>
                                    <Text style={styles.optionStyle}> {item} </Text>
                                </TouchableOpacity>
                            })}
                    </View>
                </ScrollView>
            } 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 20,
        backgroundColor: '#fff'
    },
    scroll: {
        flex: 1,
        padding: '5%'
    },
    button: {
        fontSize: 18,
        // width: '85%',
        minWidth: '95%',
        maxWidth: '95%',
        minHeight: 80,
        marginBottom: "6%",
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
        marginLeft:"2.5%",
    },
    questionContainer: {
        marginBottom: 20
    },
    question: {
        fontSize: 18,
        marginBottom: "10%",
        color: 'black',
        marginLeft:"2.5%",
    },
    optionsContainer: {
        // flex:1,
        // justifyContent: 'center',
        // alignItems: 'flex-start',
        marginLeft: 20,
        backgroundColor: 'black',
    },
    optionButton: {
        minWidth: '95%',
        maxWidth: '95%',
        maxHeight: 80,
        minHeight: 50,
        marginBottom: 10,
        // borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionStyle:{
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        color: 'black',
    },
    restartContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    // restartContainer2:{
    //     borderWidth: 2,
    //     borderRadius: 50,
    //     borderColor: "black",
    // },
    showScore:{
        fontSize:50,
        fontFamily:'Poppins-Bold',
        color: 'black',
    },
    showScore2:{
        fontSize:24,
        fontFamily:'Poppins-Bold',
        color: 'white',
        // backgroundColor:'red',
        alignSelf: 'center',
    },
    restart:{
        backgroundColor: "#000",
        // height: 50,
        maxHeight: 60,
        minHeight: 50,
        width: '85%',
        flex: 1,
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        paddingBottom: 12,
      },
});

export default TestScreen;
