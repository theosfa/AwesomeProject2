import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db } from '../firebaseConfig'; // Update this path if necessary
import { useIsFocused } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'; // Import TouchableOpacity for buttons

const HomeScreen = ({ navigation }) => {
    const [testTitles, setTestTitles] = useState([]);
    const [testIds, setTestIds] = useState([]);
    const [filteredTestTitles, setFilteredTestTitles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false); // State for showing search bar
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchTestTitles = async () => {
            try {
                const testsCollectionRef = collection(db, 'tests');
                const snapshot = await getDocs(testsCollectionRef);
                let newTests = [];
                let newIds = [];
                snapshot.docs.forEach(doc => {
                    if (doc.data().privacy !== 'teacher') {
                        newTests.push(doc.data().title);
                        newIds.push(doc.id);
                    }
                });
                setTestTitles(newTests);
                setTestIds(newIds);
                setFilteredTestTitles(newTests); // Initialize filtered titles with all titles
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch test titles.');
            }
            setLoading(false);
        };

        if (isFocused) {
            fetchTestTitles(); // Fetch data when the screen is focused
        }
    }, [isFocused]);

    const handleTestPress = (id) => {
        navigation.navigate('Тест', { id });
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filteredTitles = testTitles.filter(title =>
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

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

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
                style={styles.scroll}
            >
                {filteredTestTitles.map((title, index) => (
                    <TouchableOpacity key={index} onPress={() => handleTestPress(testIds[testTitles.indexOf(title)])} style={styles.button}>
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
    scroll: {
        flex: 1,
        paddingTop: '2.5%',
        margin: "2.5%",
        marginTop: 0,
    },
    button: {
        fontSize: 18,
        minWidth: '95%',
        maxWidth: '95%',
        minHeight: 80,
        marginBottom: "6%",
        padding: 10,
        marginLeft: "2.5%",
        marginRight: "2.5%",
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
    button_text: {
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
    }
});

export default HomeScreen;
