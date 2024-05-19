import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Update this path if necessary
import { collection, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler'; // Import TouchableOpacity for buttons

const StudentsMarksListScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [students, setStudents] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestQuestions = async () => {
            try {
                // Fetch the test document
                const testRef = doc(db, 'tests', id);
                const testSnapshot = await getDoc(testRef);
                const test = testSnapshot.data();
                
                if (test) {
                    setTitle(test.title);
                    
                    // Extract marks (student IDs and scores)
                    const marks = test.marks;
                    const studentIds = [...new Set(marks.map(mark => mark.id))];
                    
                    if (studentIds.length > 0) {
                        const studentsCollectionRef = collection(db, 'students');
                        const q = query(studentsCollectionRef, where('__name__', 'in', studentIds));
                        const querySnapshot = await getDocs(q);
                        
                        const studentsData = querySnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));

                        const testsCollectionRef = collection(db, 'students');
                        const snapshot = await getDocs(testsCollectionRef);
                        const dict = snapshot.docs.reduce((acc, doc) => {
                            acc[doc.id] = doc.data().id;
                            return acc;
                        }, {});
                        console.log(dict)
                        
                        const studentsWithScores = marks.map(mark => {
                            const studentData = studentsData.find(student => student.id === dict[mark.id]);
                            // console.log(studentData)
                            return {
                                ...studentData,
                                score: mark.score
                            };
                        });
                        
                        setStudents(studentsWithScores.reverse());
                    } else {
                        setStudents([]);
                    }
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Название теста: {title}</Text>
            {students.length > 0 ? (
                students.map((student, index) => (
                    <View style={styles.optionButton} key={index}>
                        <Text  style={styles.optionStyle}>Имя: {student.name}, </Text>
                        <Text  style={styles.optionStyle}>Фамилия: {student.surname}, </Text>
                        <Text  style={styles.optionStyle}>Оценка: {student.score}</Text>
                    </View>
                ))
            ) : (
                <Text>No students found.</Text>
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
        marginBottom: 20,
        color: 'black',
    },
    questionContainer: {
        marginBottom: 20
    },
    question: {
        fontSize: 18,
        marginBottom: 10,
        color: 'black',
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
    restartContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    showScore:{
        fontSize:40,
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

export default StudentsMarksListScreen;
