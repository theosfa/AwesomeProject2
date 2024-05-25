import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Update this path if necessary
import { collection, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler'; // Import TouchableOpacity for buttons

const StudentTeachersListScreen = ({ navigation }) => {
    const [user, setUsers] = useState([]);
    const [username, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [dictionary, setDictionary] = useState(null);

    useEffect(() => {
        const fetchTestQuestions = async () => {
            try {
                const userId = auth.currentUser.uid;
                const userRef = doc(db, 'users', userId);
                const userSnapshot = await getDoc(userRef);
                const userData = userSnapshot.data()
                // setUsers(userData);
                console.log(userData.username);
                const username = userData.username;
                
                const studentRef = doc(db, 'students', username);
                const studentSnapshot = await getDoc(studentRef);
                const studentData = studentSnapshot.data()

                const testsCollectionRef = collection(db, 'users');
                const snapshot = await getDocs(testsCollectionRef);
                const dict = snapshot.docs.reduce((acc, doc) => {
                    acc[doc.id] = { name : doc.data().name, surname : doc.data().surname};
                    return acc;
                  }, {});
                setDictionary(dict);
                console.log(dict["1KbSwveKrMe0QF7Q2ip9XOftzH23"].name);
                console.log(studentData.groups)
                setUsers(studentData.groups);

                // if (user) {
                //     // Extract marks (student IDs and scores)
                //     const marks = user.group;
                //     const studentIds = [...new Set(marks.map(mark => mark.id))];
                    
                //     if (studentIds.length > 0) {
                //         const studentsCollectionRef = collection(db, 'students');
                //         const q = query(studentsCollectionRef, where('__name__', 'in', studentIds));
                //         const querySnapshot = await getDocs(q);
                        
                //         const studentsData = querySnapshot.docs.map(doc => ({
                //             id: doc.id,
                //             ...doc.data(),
                //         }));

                //         const testsCollectionRef = collection(db, 'students');
                //         const snapshot = await getDocs(testsCollectionRef);
                //         const dict = snapshot.docs.reduce((acc, doc) => {
                //             acc[doc.id] = doc.data().id;
                //             return acc;
                //         }, {});
                //         console.log(dict)
                        
                //         const studentsWithScores = marks.map(mark => {
                //             const studentData = studentsData.find(student => student.id === dict[mark.id]);
                //             // console.log(studentData)
                //             return {
                //                 ...studentData,
                //                 score: mark.score
                //             };
                //         });
                        
                //         setStudents(studentsWithScores.reverse());
                //     } else {
                //         setStudents([]);
                //     }
                // } else {
                //     Alert.alert('Test not found');
                // }
            } catch (error) {
                console.error('Error fetching test questions:', error);
                Alert.alert('Failed to fetch test questions.');
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
            let newGroupT = [];
            let newGroupS = [];
            if (userSnapshot.exists()) {
                const teacherData = teacherSnapshot.data();
                const GroupT = teacherData.groups || [];
                const userData = userSnapshot.data();
                const GroupS = userData.teacher || [];
                console.log(userData)
                newGroupT = [...GroupT, { id: username }];
                newGroupS =  [...GroupS, { id: userId }]; // Replace 'test-id' and 'score' with actual values
                await updateDoc(teacherRef, {
                    group: newGroupT,
                });
                await updateDoc(userRef, {
                    group: newGroupS,
                });
                setUserName('');
                setRefresh(prev => !prev);
            } else {
                Alert.alert("Студент не найден", "Попробуйте ввести другой никнейм");
            }
        } catch (error) {
            Alert.alert("Студент не найден", "Попробуйте ввести другой никнейм");
        }
    }

    const handleTestPress = (id) => {
        // You can navigate to the test details screen passing the title or any other identifier
        console.log(id)
        navigation.navigate('Тесты', { id });
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={styles.scrollStyle}
                alignItems={'center'}
            >
                {user.length > 0 ? (
                user.map((teacher, index) => (
                    <View style={styles.optionButton} >
                        <TouchableOpacity onPress={()=> handleTestPress(teacher.id)} style={styles.touchable}>
                            <Text  style={styles.optionStyle}>{dictionary[teacher.id].name} </Text>
                            <Text  style={styles.optionStyle}>{dictionary[teacher.id].surname} </Text>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text>No students found.</Text>
            )}
            </ScrollView>
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
    touchable: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
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
        maxHeight: 50,
        minHeight: 50,
        minwidth: '100%',
        flex: 1,
        marginTop: '5%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default StudentTeachersListScreen;
