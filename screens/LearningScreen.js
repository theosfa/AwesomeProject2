import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, collection, addDoc, getDocs } from 'firebase/firestore';

const LearningScreen = ({ navigation }) => {
    const [lectureTitles, setLectureTitles] = useState([]);
    const [lectureIds, setLectureIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTestTitles, setFilteredTestTitles] = useState([]);
    const [showSearchBar, setShowSearchBar] = useState(false); // State for showing search bar
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
                setFilteredTestTitles(titles);
            } catch (error) { 
            }
            setLoading(false);
        };

        fetchTestTitles();
    }, []);

    const handleTestPress = (id) => {
        // You can navigate to the test details screen passing the title or any other identifier
        navigation.navigate('Лекция', { id });
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filteredTitles = lectureTitles.filter(title =>
            title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTestTitles(filteredTitles);
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => setShowSearchBar(prev => !prev)} style={styles.headerButton}>
                    {/* <Text style={styles.headerButtonText}>{showSearchBar ? 'Скрыть' : 'Поиск'}</Text> */}
                    {showSearchBar ? (<>
                        <Image source={require('../assets/images/search.png')} style={styles.headerButtonText}/> 
                    </>) : (<>
                        <Image source={require('../assets/images/search.png')} style={styles.headerButtonText}/> 
                    </>)}
                </TouchableOpacity>
            ),
        });
    }, [navigation, showSearchBar]);

    return (
        <View style={styles.container}>
            {showSearchBar && (
                <TextInput 
                    style={styles.searchBar} 
                    placeholder="Поиск по названию..." 
                    value={searchQuery} 
                    onChangeText={handleSearch}
                />
            )}
            <ScrollView 
                
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                alignItems={'center'}
                style={styles.scroll}
            >
            {/* <Image
                source={require('../assets/images/tests.png')} // Replace with your actual profile image source
                style={styles.profileImage}
            /> */}
            {filteredTestTitles.map((lecture, index) => (
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
        // padding: 20,
        paddingTop: "2.5%",
        backgroundColor: '#fff'
    },
    scroll: {
        flex: 1,
        paddingTop: '2.5%',
        // paddingBottom: "20%",
        margin: "2.5%",
        marginTop: 0,
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
    },
    headerButton: {
        marginRight: 10,
    },
    headerButtonText: {
        color: 'white',
        fontSize: 16,
        height: 30,
        width: 30,
    },
    searchBar: {
        width: '90%',
        height: 40,
        borderColor: '#ccc',
        // borderColor: '#000',
        // borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 20,
        backgroundColor: '#F0F0F0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default LearningScreen;
