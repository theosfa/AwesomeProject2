import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert , Image, TouchableOpacity } from 'react-native';
import {  GestureHandlerRootView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
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
                console.log(dictL);
                const userId = auth.currentUser.uid; // Get current user's UID
                const userDocRef = doc(db, "users", userId);
                try {
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data());
                        if(userDoc.data().tests){
                          console.log(userDoc.data().tests.reverse())
                          setUserTests(userDoc.data().tests.reverse());
                        }
                        
                    } else {
                    }
                } catch (error) {
                }
            }
            setLoading(false);
        };

        if (isFocused) {
            fetchUserProfile();
        }
    }, [isFocused]);

    const handleLogout = () => {
        signOut(auth).then(() => {
        }).catch((error) => {
        });
    };

    const openTeachersList = () => {
      navigation.navigate("Преподаватели");
    }

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
                      <Text style={styles.name3}>{userProfile.name} {userProfile.surname}</Text>
                      <Text style={styles.name}>{userProfile.username}</Text>
                      <TouchableOpacity  onPress={openTeachersList} style={styles.headerRight3}>
                        <Text style={styles.headerRight2}>Преподаватели</Text>
                      </TouchableOpacity>
                    </View>
                    
                    
                  </View>

                </View>
                {userTests
                  ?
                  <>
                  <Text style={styles.name2}>Последняя активность</Text>
                  <View style={styles.scroll2}>
                    
                  <ScrollView 
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollStyle}
                    >
                      {userTests.map((item, index) => {
                        return <View style={styles.activity} key={index}>
                            {item.type === 'lectures' ? (<>
                              <Text style={styles.activity_text}> {dictionaryL[item.id]}</Text>
                            </>) : (<>
                              <Text style={styles.activity_text}> {dictionaryT[item.id]}</Text>
                            </>)}
                            
                            
                              {(item.score <= 35) ? (<>
                                <View style={styles.activity_grade1}>
                                <Text style={styles.activity_grade_text}>{item.score}</Text>
                                </View>
                              </>) : ( <>
                                {item.score <= 75 ? (<>
                                  <View style={styles.activity_grade2}>
                                  <Text style={styles.activity_grade_text}>{item.score}</Text>
                                  </View>
                                </>) : (<>
                                  <View style={styles.activity_grade3}>
                                  <Text style={styles.activity_grade_text}>{item.score}</Text>
                                  </View>
                                </>)}</>)}
                              
                            
                        </View>
                      })}
                      
                    </ScrollView>
                  </View>
                  </>
                  :
                  <View style={styles.scroll}>
                    <Text style={styles.name2}>Последняя активность</Text>
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
      // alignItems: 'center',
      maxWidth: '100%',
      minWidth: '100%',
      width: '90%',
      flexGrow:3,
      // width: 'auto',
    },
    scrollStyle:{
      // backgroundColor: 'orange',
      height: '85%',
      paddingLeft: "5%", 
      paddingRight: "5%", 
    },
    activity:{
      flex:1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      // gap: "5%",
      alignItems: 'center',
      minWidth: '100%',
      maxWidth: '100%',
      minHeight: 80,
      borderRadius: 20,
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#F0f0f0',
      paddingRight: "4%",
      // borderColor: 'gray',
      // borderWidth: 1,
      
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
      fontSize: 18,
      // backgroundColor:'gray',
      maxWidth: '85%',
      minWidth: '85%',
      color: "black",
      paddingRight: "3%",
    },
    activity_grade1:{
      flex:1,
      flexGrow: 1,
      // flexDirection: 'row',
      // flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems:'center',
      fontSize: 15,
      padding: 0,
      minWidth: 55,
      maxWidth: 55,
      minHeight: 55,
      maxHeight: 55,
      borderRadius: 30,
      borderColor: '#ff8080',
      // backgroundColor: '#ff8080',
      borderWidth: 2,
    },
    activity_grade2:{
      flex:1,
      flexGrow: 1,
      // flexDirection: 'row',
      // flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems:'center',
      fontSize: 15,
      padding: 0,
      minWidth: 55,
      maxWidth: 55,
      minHeight: 55,
      maxHeight: 55,
      borderRadius: 30,
      // borderCurve: 
      borderColor: '#ffcc33',
      // backgroundColor: '#ffff80',
      borderWidth: 2,
    },
    activity_grade3:{
      flex:1,
      flexGrow: 1,
      // flexDirection: 'row',
      // flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems:'center',
      fontSize: 15,
      padding: 0,
      minWidth: 55,
      maxWidth: 55,
      minHeight: 55,
      maxHeight: 55,
      borderRadius: 30,
      borderColor: '#5cd65c',
      // backgroundColor: '#80ff80',
      borderWidth: 2,
    },
    activity_grade_text:{
      fontFamily: 'Poppins-Bold',
      color: "black",
      fontSize: 18,
      // padding: 10,
      borderRadius: 25,
      // borderColor: '#ff8080',
      // backgroundColor: '#ff8080',
      // borderWidth: 2,
    },
    activity_grade_text3:{
      fontFamily: 'Poppins-Bold',
      color: "black",
      // padding: 10,
      // paddingBottom: 0,
      borderRadius: 25,
      
      // borderColor: '#80ff80',
      // backgroundColor: '#80ff80',
      // borderWidth: 2,
      // backgroundColor: "green",
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
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingLeft: "2.5%",
      // marginRight: "2.5%",
      paddingTop: '2.5%',
      // paddingTop: 30,
      flexGrow:2,
      // backgroundColor: 'purple',
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: '7.5%',
      color: 'black',

      // backgroundColor: 'green',
    },
    name3: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: '2.5%',
      color: 'black',

      // backgroundColor: 'green',
    },
    name2: {
      fontSize: 23,
      fontWeight: 'bold',
      marginBottom: '5%',
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
      // backgroundColor: 'black',
      fontFamily: 'Poppins-Bold',
      // marginLeft: '50%',
    },
    headerRight3: {
      // color: 'white',
      backgroundColor: 'black',
      flex: 1,
      minHeight: 30,
      maxHeight: 30,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  export default ProfileScreen;
