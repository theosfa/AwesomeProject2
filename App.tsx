/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBriefcase, faUser, faList, faPlus, faPerson } from '@fortawesome/free-solid-svg-icons';


// Firebase
import { auth, db } from './firebaseConfig'; // Ensure this path is correct
import { onAuthStateChanged, User } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { doc, collection, getDoc, getDocs } from 'firebase/firestore';

// Screens
import SignInScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import TestScreen from './screens/TestScreen';
import LectureListScreen from './screens/LectureListScreen';
import LoadingScreen from './screens/LoadingScreen';

//Navigation
import StudentNavigation from './navigation/StudentNavigation'
import TeacherNavigation from './navigation/TeacherNavigation';
import AdminNavigation from './navigation/AdminNavigation';



// GestureHandlerRootView
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View, 
  Button,
  Alert,
  Image,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

const Stack = createNativeStackNavigator();






const App = (): React.JSX.Element => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPermission, setUserPermission] = useState('');
  const [profileFetched, setProfileFetched] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        const userId = currentUser.uid;
        const userDocRef = doc(db, "users", userId);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserPermission(userDoc.data().permission);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          //  setLoading(false)// Indicate that user profile data has been fetched
        }
      }
        // setProfileFetched(false);
        
    };

    fetchUserProfile();
  }, [currentUser]);

  // useEffect(() => {
  //   // If the user is logged out and the profile data hasn't been fetched, keep loading
  //   if (!currentUser && !profileFetched) return;

  //   setLoading(true); // Set loading to false when either user is logged out or profile data is fetched
  // }, [currentUser, profileFetched]);

  if (loading) {
    return (
      <GestureHandlerRootView>
        <LoadingScreen />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator>
          {currentUser ? (
            <>
              {userPermission === 'student' ? (
                <>
                  <Stack.Screen name="Home" component={StudentNavigation} options={{ headerShown: false }} />
                  <Stack.Screen name="Test" component={TestScreen} />
                  <Stack.Screen name="Лекция" component={LectureListScreen} />
                </>
              ) : (
                <>
                {userPermission === 'teacher' ? (
                  <>
                    <Stack.Screen name="Home" component={TeacherNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="Test" component={TestScreen} />
                    <Stack.Screen name="Лекция" component={LectureListScreen} />
                  </>
                ) : (
                  <>
                    <Stack.Screen name="Home" component={AdminNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="Test" component={TestScreen} />
                    <Stack.Screen name="Лекция" component={LectureListScreen} />
                  </>
                )}
                </>
              )}
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={SignInScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;
// function Section({children, title}: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }