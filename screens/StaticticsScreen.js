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
    const [dictionaryT, setDictionaryT] = useState(null);
    const [dictionaryL, setDictionaryL] = useState(null);
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
              setDictionaryT(dict);
              const testsCollectionRefL = collection(db, 'lectures');
              const snapshotL = await getDocs(testsCollectionRefL);
              const dictL = snapshotL.docs.reduce((acc, doc) => {
                  acc[doc.id] = doc.data().title;
                  return acc;
                }, {});
              setDictionaryL(dictL);
                const userId = auth.currentUser.uid; // Get current user's UID
                const userDocRef = doc(db, "teacherTests", userId);
                const teacherDocRef = doc(db, "users", userId);
                try {
                    const teacherDoc = await getDoc(teacherDocRef);
                    const userDoc = await getDoc(userDocRef);
                    if(userDoc.exists()){
                      setUserTests(userDoc.data().tests.reverse());
                    }
                    if (teacherDoc.exists()) {
                        setUserProfile(teacherDoc.data());
                        
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


    const checkStatistics = (id, type) => {
      navigation.navigate('Список оценок', { id, type });
    }

    const addStudents = () => {
      navigation.navigate('Группы');
    }

    const handleLogout = () => {
        signOut(auth).then(() => {
        }).catch((error) => {
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
                  <View style={styles.mainInfo2}>

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

                      <View style={styles.infoContainer2}>
                        <Text style={styles.name2}>{userProfile.name} {userProfile.surname}</Text>
                      </View>

                    </View>

                  </View>
                  <View style={styles.activitys}>
                    <TouchableOpacity onPress={() => addStudents()} style={styles.activity2}>
                      <Text style={styles.activity_text2}>Работа с группами</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {userTests
                  ?
                  <>
                  <Text style={styles.name}>Просмотр статистики</Text>
                  <View style={styles.scroll2}>
                    
                  <ScrollView 
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollStyle}
                    >
                      {userTests.map((item, index) => {
                        return item.type !== 'lectures' ? (<TouchableOpacity onPress={() => checkStatistics(item.id, item.type)} style={styles.activity} key={index}>
                            {item.type === 'practicum' ? (<>
                              <Text style={styles.activity_text}> {dictionaryL[item.id]}</Text>
                            </>) : (
                            item.type === 'tests' ? (<>
                              <Text style={styles.activity_text}> {dictionaryT[item.id]}</Text>
                            </>) : null)}
                        </TouchableOpacity>) : null
                      })}
                      
                    </ScrollView>
                  </View>
                  </>
                  :
                  <View style={styles.scroll}>
                    <Text style={styles.name}>Просмотр статистики</Text>
                    <Text>Cтатистика отсутствует</Text>
                  </View>
                }
              </View>
            ) : (
              <>
                <Text>Не найдено данных</Text>
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
      // backgroundColor: 'yellow',
      padding: 0,
      margin: 0,
      // backgroundColor: '#ccf3ff',
      
    },
    mainInfo: {
      flex: 1,
      flexDirection: 'column',
      flexGrow:1,
      minWidth:"100%",
      // backgroundColor:'green'
    },
    mainInfo2: {
      flex: 1,
      flexDirection: 'row',
      // backgroundColor:'purple',
      marginBottom: "2.5%",
      flexGrow:2,
      // backgroundColor:'red'
    },
    infoContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingLeft: "2.5%",
      // marginRight: "2.5%",
      paddingTop: '2.5%',
      // paddingTop: 30,
      flexGrow:2,
      // backgroundColor: 'orange',
    },
    infoContainer2: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingLeft: "2.5%",
      // marginRight: "2.5%",
      paddingTop: '2.5%',
      // paddingTop: 30,
      flexGrow:2,
      // backgroundColor: 'purple',
    },
    profileContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: 30,
      paddingLeft: 30,
      height: 100,
      // backgroundColor: "orange",
    },
    activitys: {
      flex: 1,
      // flexDirection: 'row',
      // 
      flexGrow:1,
      justifyContent:"center",
      alignItems:'center',
    },
    scroll:{
      flex:1,
      flexDirection: 'column',
      alignItems:'center',
      flexGrow:2,
      // backgroundColor: 'blue',
    },
    scroll2:{
      flex:1,
      flexDirection: 'column',
      // justifyContent:'center',
      maxWidth: '90%',
      minWidth: '90%',
      width: '90%',
      flexGrow:2,
      // width: 'auto',
    },
    scrollStyle:{
      // backgroundColor: 'orange',
      // height: '85%',
      // backgroundColor:'orange',
      flexGrow:3,
    },
    activity:{
      flex:1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      // backgroundColor: '#F0F0F0',
      flex: 1,
      alignItems: 'center',
      // backgroundColor:'lightgray',
      backgroundColor:'#e6e6e6',
      justifyContent: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      
    },  
    activity2:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      // alignSelf: 'center',
      // width: '85%',
      minWidth: '90%',
      maxWidth: '90%',
      minHeight: 50,
      // marginTop: "2.5%",
      marginBottom: "6%",
      // borderWidth: 1,
      padding: 10,
      marginLeft:"2.5%",
      marginRight:"2.5%",
      borderRadius: 10,
      backgroundColor: 'black',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      
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
      color: "black"
    },
    activity_text2:{
      // flexGrow:2, 
      fontSize: 18,
      fontFamily: 'Poppins-Bold',
      // backgroundColor:'gray',
      color: "white"
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
    
    profileImage: {
      width: 100,
      height: 100,
    },
    
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      // marginTop: "5%",
      marginBottom: "5%",
      color: 'black',

      // backgroundColor: 'green',
    },
    name2: {
      fontSize: 20,
      fontWeight: 'bold',
      // marginTop: "5%",
      marginBottom: "5%",
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
      borderRadius: 10,
      paddingLeft: 10,
      paddingRight: 10,
      marginRight: '4%',
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
