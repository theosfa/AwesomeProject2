import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Update this path if necessary
import { collection, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler'; // Import TouchableOpacity for buttons

const GroupStudentsListScreen = ({ route }) => {
    const { group } = route.params;
    const [students, setStudents] = useState([]);
    const [username, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchTestQuestions = async () => {
            try {
                const userId = auth.currentUser.uid;
                const teacherRef = doc(db, 'users', userId);
                const teacherSnapshot = await getDoc(teacherRef);
                const teacher = teacherSnapshot.data();
                
                if (teacher) {
                    // Extract marks (student IDs and scores)
                    const marks = teacher.groups.find(mark => mark.id === group).students;
                    console.log(group)
                    console.log(marks)
                    
                    if (marks.length > 0) {
                        const studentIds = [...new Set(marks)];
                        console.log(studentIds)
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
                        
                        const studentsWithScores = marks.map(mark => {
                            const studentData = studentsData.find(student => student.id === dict[mark]);
                            console.log(mark)
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
                }
            } catch (error) {
            }
            setLoading(false);
        };

        fetchTestQuestions();
    }, [refresh]);
    

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const addStudent = async () => {
        const userId = auth.currentUser.uid;
        const userRef = doc(db, 'students', username);
        const teacherRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);
        const teacherSnapshot = await getDoc(teacherRef);
    
        try {
            if (userSnapshot.exists() && teacherSnapshot.exists()) {
                const teacherData = teacherSnapshot.data();
                const GroupT = teacherData.groups || [];
                const userData = userSnapshot.data();
                const GroupS = userData.groups || [];
                
                // Find the group in the teacher's groups
                const groupIndex = GroupT.findIndex(g => g.id === group);
                if (groupIndex === -1) {
                    return;
                }
                
                // Add the student to the group's students array
                const updatedGroup = {
                    ...GroupT[groupIndex],
                    students: [...GroupT[groupIndex].students, username]
                };
    
                // Update the groups array with the modified group
                const updatedGroupsT = [...GroupT];
                updatedGroupsT[groupIndex] = updatedGroup;
                
                // Update the student's group data
                const newGroupS = [...GroupS, { id: userId, group : group }];
    
                // Update the Firestore documents
                await updateDoc(teacherRef, {
                    groups: updatedGroupsT,
                });
                await updateDoc(userRef, {
                    groups: newGroupS,
                });
    
                setUserName('');
                setRefresh(prev => !prev);
            } else {
                Alert.alert("Студент не найден", "Попробуйте ввести другой никнейм");
            }
        } catch (error) {
            Alert.alert("Студент не найден", "Попробуйте ввести другой никнейм");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={styles.scrollStyle}
                alignItems={'center'}
            >
                {students.length > 0 ? (
                students.map((student, index) => (
                    <View style={styles.optionButton} key={index}>
                        <Text  style={styles.optionStyle}>Имя: {student.name}, </Text>
                        <Text  style={styles.optionStyle}>Фамилия: {student.surname} </Text>
                    </View>
                ))
            ) : (
                <Text>Ни один студент не найден.</Text>
            )}
            </ScrollView>
            <View style={styles.inputStyle}>
            <TextInput
                placeholder="Никнейм студента"
                value={username}
                onChangeText={setUserName}
                // secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity onPress={() => addStudent()}  style={styles.register} >
                <Text style={styles.textLogin} >Добавить студента в группу</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        flexWrap: "nowrap",
        backgroundColor: '#fff',
    },
    scrollStyle:{
        // backgroundColor: 'purple',
        minWidth: '100%',
        maxWidth: '100%',
    },
    inputStyle:{
        // backgroundColor:"green",
        minWidth: '100%',
        msxWidth: '100%',
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
      input: {
        minwidth: '100%',
        height: 45,
        // marginVertical: 10,
        // borderWidth: 1,
        borderRadius: 20,
        backgroundColor: "#F0F0F0",
        paddingLeft: 25,
        padding: 10,
    },
      textLogin:{
        color:'#fff',
        fontSize: 20,
        fontFamily: 'Poppins-Bold'
    },
    text :{
        marginLeft:'5%',
        marginBottom:'5%',
    },
    register: {
        backgroundColor: "#000",
        // height: 50,
        maxHeight: 80,
        minHeight: 80,
        minwidth: '100%',
        flex: 1,
        marginTop: '5%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default GroupStudentsListScreen;
