import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Update this path if necessary
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler'; // Import TouchableOpacity for buttons

const LectureListScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [sections, setSections] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        const fetchTestQuestions = async () => {
            try {
                const testRef = doc(db, 'lectures', id);
                const testSnapshot = await getDoc(testRef);
                if (testSnapshot.exists()){
                    const lecture = testSnapshot.data();
                    setSections(lecture.materials);
                    setTitle(lecture.title);
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

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    

    const handleOpenTitle = (index) => {
        if (selectedIndex == index){
            setSelectedIndex(null);
        } else {
            setSelectedIndex(index);
        }
        
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.questionContainer}>
                    <Text style={styles.question}>{sections.title}</Text>
                    <View style={styles.optionsContainer}>
                    {sections.map((item, index) => {
                        return <View key={index}>
                            <TouchableOpacity onPress={()=> handleOpenTitle(index)} style={styles.optionButton}>
                                <Text style={styles.optionStyle}> {item.title} </Text>
                            </TouchableOpacity>
                            <View
                                style={[
                                    styles.textStyle,
                                    selectedIndex === index && styles.selectedTextStyle
                                ]}
                            >
                            <Text> {item.text} </Text>
                            </View>
                        </View>
                    })}
                    </View>
                </View>
            </View>
        </View>
    );
    // const maxScore = questions.length;
    // let percentage = 0;

    // const handleAnswer = (selectedAnswer) => {
    //     const answer = questions[currentQuestionIndex]?.answer;
    //     if(answer === selectedAnswer){
    //       setScore((prevScore)=> prevScore+1);
    //     }
    //     const nextQuestion = currentQuestionIndex + 1;
    //     if(nextQuestion < questions.length){
    //         setCurrentQuestionIndex(nextQuestion);
    //     }else{
    //         setShowScore(true);
    //     }
    //   }

    //   const handRestart = () => {
    //     navigation.navigate('Main');
    //   }

    //   const handleUpdateProfile = async () => {
    //     percentage = score*100/maxScore;
    //     if (auth.currentUser) {
    //         const userId = auth.currentUser.uid;
    //         const userDocRef = doc(db, "users", userId);
    //         try {
    //             const userDoc = await getDoc(userDocRef);
    //             let newTests = [];
    //             if (userDoc.exists()) {
    //                 const userData = userDoc.data();
    //                 const tests = userData.tests || [];
    //                 newTests = [...tests, { id: id, score: Number(percentage.toFixed()) }];  // Replace 'test-id' and 'score' with actual values
    //             } else {
    //                 newTests = [{ id: id, score: Number(percentage.toFixed()) }];  // Replace 'test-id' and 'score' with actual values
    //             }
    //             await updateDoc(userDocRef, {
    //                 tests: newTests,
    //             });
    //             Alert.alert("Profile Updated", "Your profile has been updated successfully.");
    //         } catch (error) {
    //             console.error("Error updating user details:", error);
    //             Alert.alert("Update Failed", error.message);
    //         }
    //         navigation.navigate('Главная');
    //     }
    // };
    

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
    textStyle: {
        fontSize: 16,
        color: '#333',
        marginTop: 5,
        display: 'none',
        margin: 10,
    },
    selectedTextStyle: {
        fontSize: 16,
        // color: 'blue', // Change the color when selected
        // fontWeight: 'bold', // Change the weight when selected
        display: 'visible',
    }
});

export default LectureListScreen;
