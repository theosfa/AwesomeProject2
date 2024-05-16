import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db } from '../firebaseConfig'; // Update this path if necessary
import { collection, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler'; // Import TouchableOpacity for buttons
import TestScreen from './TestScreen'; // Import TestScreen component

const HomeScreen = ({ navigation }) => {
    const [testTitles, setTestTitles] = useState([]);
    const [testIds, setTestIds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestTitles = async () => {
            try {
                const testsCollectionRef = collection(db, 'tests');
                const snapshot = await getDocs(testsCollectionRef);
                const titles = snapshot.docs.map(doc => doc.data().title);
                const ids = snapshot.docs.map(doc => doc.id);
                setTestTitles(titles);
                setTestIds(ids);
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
        navigation.navigate('Test', { id });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            {testTitles.map((title, index) => (
                <TouchableOpacity key={index} onPress={() => handleTestPress(testIds[index])}>
                    <Text style={styles.button}>{title}</Text>
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

export default HomeScreen;
