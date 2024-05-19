import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, collection, addDoc, getDocs } from 'firebase/firestore';

const LearningScreen = ({ navigation }) => {
    const [lectureTitles, setLectureTitles] = useState([]);
    const [lectureIds, setLectureIds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestTitles = async () => {
            try {
                const testsCollectionRef = collection(db, 'lectures');
                const snapshot = await getDocs(testsCollectionRef);
                const titles = snapshot.docs.map(doc => doc.data().title);
                const ids = snapshot.docs.map(doc => doc.id);
                setLectureTitles(titles);
                setLectureIds(ids);
            } catch (error) {
                console.error('Error fetching test titles:', error);
                Alert.alert('Failed to fetch test titles.');
            }
            setLoading(false);
        };

        fetchTestTitles();
    }, []);

    const handleTestPress = (id) => {
        // You can navigate to the test details screen passing the title or any other identifier
        navigation.navigate('Лекция', { id });
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
            <Image
                source={require('../assets/images/tests.png')} // Replace with your actual profile image source
                style={styles.profileImage}
            />
            {lectureTitles.map((lecture, index) => (
                <TouchableOpacity key={index} onPress={() => handleTestPress(lectureIds[index])}  style={styles.button}>
                    <Text style={styles.button_text}>{lecture}</Text>
                </TouchableOpacity>
            ))}
            </ScrollView>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
    button: {
        fontSize: 18,
        // width: '85%',
        minWidth: '95%',
        maxWidth: '95%',
        minHeight: 80,
        marginBottom: 10,
        // borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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

export default LearningScreen;
