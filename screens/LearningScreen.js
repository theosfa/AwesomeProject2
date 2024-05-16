import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
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
        {lectureTitles.map((lecture, index) => (
            <TouchableOpacity key={index} onPress={() => handleTestPress(lectureIds[index])}>
                <Text style={styles.button}>{lecture}</Text>
            </TouchableOpacity>
        ))}
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    button: {
        fontSize: 18,
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5
    }
});

export default LearningScreen;
