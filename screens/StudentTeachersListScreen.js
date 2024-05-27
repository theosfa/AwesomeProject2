import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Update this path if necessary
import { collection, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler'; // Import TouchableOpacity for buttons

const StudentTeachersListScreen = ({ navigation }) => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
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
                console.log(studentData.groups);
                studentData.groups.map( teacher => {
                    console.log(dict[teacher.id].name)
                }
                )
                setUser(studentData.groups);
            } catch (error) {
            }
            setLoading(false);
        };

        fetchTestQuestions();
    }, []);
    

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
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
                justifyContent={'center'}
            >
                {user.length > 0 ? (
                user.map((teacher, index) => (
                    <View  style={styles.button}  key={index} >
                        <TouchableOpacity onPress={()=> handleTestPress(teacher.id)} style={styles.button2} >
                            <Text  style={styles.button_text}>{dictionary[teacher.id].surname} {dictionary[teacher.id].name} </Text>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text>Не найдено преподават0.
                    елей.</Text>
            )}
            </ScrollView>
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
        fontFamily: 'Poppins-Bold',
        fontSize: 23,
        color: 'black',
    }
});

export default StudentTeachersListScreen;
