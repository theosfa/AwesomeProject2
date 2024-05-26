import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Update this path if necessary
import { useIsFocused } from '@react-navigation/native';
import { collection, getDocs, getDoc,doc } from 'firebase/firestore';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'; // Import TouchableOpacity for buttons
import TestScreen from './TestScreen'; // Import TestScreen component

const TeacherTestsListScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTests, setIsTests] = useState(false);
    const isFocused = useIsFocused();
    const [dictionary, setDictionary] = useState(null);
    const [group, setGroup] = useState('');

    useEffect(() => {
        const fetchTestTitles = async () => {
            try {
                const userId = auth.currentUser.uid;
                const userRef = doc(db, 'users', userId);
                const userSnapshot = await getDoc(userRef);
                const studentRef = doc(db, 'students', userSnapshot.data().username) ;
                const groups = await getDoc(studentRef);
                setGroup(groups.data().groups[groups.data().groups.findIndex(g => g.id === id)].group);
                const testsCollectionRef = collection(db, 'tests');
                const snapshot = await getDocs(testsCollectionRef);
                const dict = snapshot.docs.reduce((acc, doc) => {
                    acc[doc.id] = doc.data().title;
                    return acc;
                  }, {});
                setDictionary(dict);
                console.log(id);
                const teacherCollectionRef = doc(db, 'teacherTests', id);
                const teacherSnapshot = await getDoc(teacherCollectionRef);
                if (teacherSnapshot.exists()){
                    const tests = teacherSnapshot.data().tests;
                    console.log(tests);
                    setTests(tests);
                    setIsTests(true);
                }
            } catch (error) {
                console.error('Error fetching test titles:', error);
                Alert.alert('Failed to fetch test titles.');
            }
            setLoading(false);
        };

        if (isFocused) {
            fetchTestTitles(); // Fetch data when the screen is focused
        }
    }, [isFocused]);

    const handleTestPress = (id) => {
        // You can navigate to the test details screen passing the title or any other identifier
        navigation.navigate('Тест', { id });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                justifyContent={'center'}
                style={styles.scroll}
            >
                {isTests ? (<>
                    {tests.map((test, index) => (
                        (group === test.group) ? (<>
                            <TouchableOpacity key={index} onPress={() => handleTestPress(test.id)}  style={styles.button}>
                            <Text style={styles.button_text}>{dictionary[test.id]}</Text>
                        </TouchableOpacity>
                            </>) : null
                        
                    ))}
                </>) : (<>
                    <Text>Преподаватель еще не добавил тестов.</Text>
                </>)}
            
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
    profileImage: {
        alignSelf: 'center',
    },
    button_text:{
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: 'black',
    }
});

export default TeacherTestsListScreen;
