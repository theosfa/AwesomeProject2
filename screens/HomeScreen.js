import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db } from '../firebaseConfig'; // Update this path if necessary
import { useIsFocused } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'; // Import TouchableOpacity for buttons
import TestScreen from './TestScreen'; // Import TestScreen component

const HomeScreen = ({ navigation }) => {
    const [testTitles, setTestTitles] = useState([]);
    const [testIds, setTestIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchTestTitles = async () => {
            try {
                const testsCollectionRef = collection(db, 'tests');
                const snapshot = await getDocs(testsCollectionRef);
                let newTests = [];
                const titles = snapshot.docs.map(doc => {
                    if(doc.data().privacy != 'teacher') {
                        newTests = [...newTests, doc.data().title ];
                    } 
                });
                let newIds = [];
                const ids = snapshot.docs.map(doc => {
                    if(doc.data().privacy != 'teacher') {
                        newIds = [...newIds, doc.id ];
                    } 
                });
                setTestTitles(newTests);
                setTestIds(newIds);
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
                // alignItems={'center'}
                style={styles.scroll}
            >
            {/* <Image
                source={require('../assets/images/tests.png')} // Replace with your actual profile image source
                style={styles.profileImage}
            /> */}
            {testTitles.map((title, index) => (
                <TouchableOpacity key={index} onPress={() => handleTestPress(testIds[index])}  style={styles.button}>
                    <Text style={styles.button_text}>{title}</Text>
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
        paddingTop: "2.5%",
        backgroundColor: '#fff'
    },
    scroll: {
        flex: 1,
        paddingTop: '2.5%',
        // paddingBottom: "20%",
        margin: "2.5%",
        marginTop: 0,
        // height: "110%",
        // backgroundColor: 'orange'
        
    },
    button: {
        fontSize: 18,
        // width: '85%',
        minWidth: '95%',
        maxWidth: '95%',
        minHeight: 80,
        // marginTop: "2.5%",
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

export default HomeScreen;
