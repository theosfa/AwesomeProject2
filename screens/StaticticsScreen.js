import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert , Image, TouchableOpacity } from 'react-native';
import {  GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainerRefContext, useIsFocused } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig'; // Ensure this path is correct
import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import {Hr} from 'react-native-hr';

const ProfileScreen = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [userTests, setUserTests] = useState(null);
    const [dictionary, setDictionary] = useState(null);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();


    useEffect(() => {
        const fetchUserProfile = async () => {
            if (auth.currentUser) {
                const testsCollectionRef = collection(db, 'tests');
                const snapshot = await getDocs(testsCollectionRef);
                const dict = snapshot.docs.reduce((acc, doc) => {
                    acc[doc.id] = doc.data().title;
                    return acc;
                  }, {});
                setDictionary(dict);
                const userId = auth.currentUser.uid; // Get current user's UID
                const userDocRef = doc(db, "teacherTests", userId);
                try {
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data());
                        if(userDoc.data().tests){
                          setUserTests(userDoc.data().tests.reverse());
                        }
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            }
            setLoading(false);
        };

        if (isFocused) {
            fetchUserProfile(); // Fetch data when the screen is focused
        }
    }, [isFocused]);


    const checkStatistics = (id) => {
      navigation.navigate('Список оценок', { id });
    }

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            // Alert.alert("Logged Out", "You have successfully logged out.");
        }).catch((error) => {
            // An error happened.
            // Alert.alert("Logout Failed", error.message);
        });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            {userProfile ? (
              <View style={styles.container}>
                <View style={styles.mainInfo}>
                  <View style={styles.profileContainer}>
                    <Image
                      source={require('../assets/images/preview.png')} // Replace with your actual profile image source
                      style={styles.profileImage}
                      />
                  </View>
                  <View style={styles.infoContainer}>
                    <TouchableOpacity  onPress={handleLogout} style={styles.button_logout}>
                        <Text style={styles.headerRight}>Выйти</Text>
                    </TouchableOpacity>
                    <View>
                      <Text style={styles.name}>{userProfile.name} {userProfile.surname}</Text>
                      <Text style={styles.info}>Группа : СП141</Text>
                      <Text style={styles.info}>Преподаватель: Горбадей О. Ю.</Text>
                    </View>
                    
                    
                  </View>
                </View>
                {userTests
                  ?
                  <>
                  <Text style={styles.name}>Последняя активность</Text>
                  <View style={styles.scroll2}>
                    
                  <ScrollView 
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollStyle}
                    >
                      {userTests.map((item, index) => {
                        return <TouchableOpacity onPress={() => checkStatistics(item.id)} style={styles.activity} key={index}>
                            <Text style={styles.activity_text}> {dictionary[item.id]}</Text>
                        </TouchableOpacity>
                      })}
                      
                    </ScrollView>
                  </View>
                  </>
                  :
                  <View style={styles.scroll}>
                    <Text style={styles.name}>Последняя активность</Text>
                    <Text>Последняя активность отсутствует</Text>
                  </View>
                }
              </View>
            ) : (
              <>
                <Text>No user data found</Text>
                <TouchableOpacity  onPress={handleLogout}>
                      <Text style={styles.headerRight2}>Exit</Text>
                    </TouchableOpacity>
              </>
            )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      // flexWrap:'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#fff',
      // backgroundColor: '#ccf3ff',
      
    },
    mainInfo: {
      flex: 1,
      flexDirection: 'row',
      // backgroundColor:'purple'
    },
    scroll:{
      flex:1,
      flexDirection: 'column',
      alignItems:'center',
      // backgroundColor: 'blue',
    },
    scroll2:{
      flex:1,
      flexDirection: 'column',
      // justifyContent:'center',
      maxWidth: '90%',
      minWidth: '90%',
      width: '90%',
      flexGrow:3,
      // width: 'auto',
    },
    scrollStyle:{
      // backgroundColor: 'orange',
      height: '85%',
    },
    activity:{
      flex:1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minWidth: '95%',
      maxWidth: '95%',
      minHeight: 80,
      borderRadius: 20,
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#F0F0F0',
      
    },  
    profileImage: {
        alignSelf: 'center',
        width: 100,
        height: 100,
    },
    button_text:{
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: 'black',
    },
    activity_text:{
      flexGrow:2, 
      fontFamily: 'Poppins-Bold',
      // backgroundColor:'gray',
      maxWidth: '85%',
      minWidth: '85%',
    },
    activity_grade:{
      flex:1,
      flexGrow: 1,
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems:'center',
      fontSize: 15,
      
    },
    activity_grade_text:{
      fontFamily: 'Poppins-Bold',
    },
    profileContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: 30,
      paddingLeft: 30,
      height: 100,
    },
    profileImage: {
      width: 100,
      height: 100,
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: 20,
      paddingTop: 30,
      flexGrow:2,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      color: 'black',

      // backgroundColor: 'green',
    },
    info: {
      fontSize: 16,
      marginBottom: 5,
      color: 'black',
    },
    optionButton: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5
    },
    button_logout: {
      backgroundColor: 'black',
      borderRadius: 100,
      paddingLeft: 10,
      paddingRight: 10,
      alignSelf: 'flex-end',
    },
    headerRight: {
      color: 'white',
      // backgroundColor: 'black',
      padding: 5,
      fontFamily: 'Poppins-Bold',
      // marginLeft: '50%',
    },
    headerRight2: {
      color: 'white',
      backgroundColor: 'black',
      padding: 5,
      fontFamily: 'Poppins-Bold',
      // marginLeft: '50%',
    },
  });

  export default ProfileScreen;
