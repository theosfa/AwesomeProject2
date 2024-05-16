import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
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
            try {
                const userDoc = await getDoc(userDocRef);
                let newTests = [];
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const tests = userData.tests || [];
                    newTests = [...tests, { id: id, score: Number(percentage.toFixed()) }];  // Replace 'test-id' and 'score' with actual values
                } else {
                    newTests = [{ id: id, score: Number(percentage.toFixed()) }];  // Replace 'test-id' and 'score' with actual values
                }
                await updateDoc(userDocRef, {
                    tests: newTests,
                });
                Alert.alert("Profile Updated", "Your profile has been updated successfully.");
            } catch (error) {
                console.error("Error updating user details:", error);
                Alert.alert("Update Failed", error.message);
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
                <Text style={styles.showScore}> {score}/{maxScore} </Text>
                <TouchableOpacity onPress={handleUpdateProfile} style={styles.restart}>
                    <Text> Завершить тест</Text>
                </TouchableOpacity>
                </View> 
                :
                <View>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.questionContainer}>
                    <Text style={styles.question}>{questions[currentQuestionIndex].question}</Text>
                    <View style={styles.optionsContainer}>
                    {questions[currentQuestionIndex]?.options.map((item) => {
                        return <TouchableOpacity onPress={()=> handleAnswer(item)} style={styles.optionButton}>
                        <Text style={styles.optionStyle}> {item} </Text>
                        </TouchableOpacity>
                    })}
                    </View>
                </View>
                </View>
            } 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    questionContainer: {
        marginBottom: 20
    },
    question: {
        fontSize: 18,
        marginBottom: 10
    },
    optionsContainer: {
        marginLeft: 20
    },
    optionButton: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5
    },
    restartContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    showScore:{
    fontSize:24,
    },
    restart:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height:75,
        backgroundColor:'#F5F5F5',
        borderRadius:10,
        marginBottom:5,
        paddingLeft: 7,
        paddingRight: 15, 
      },
});

export default TestScreen;
