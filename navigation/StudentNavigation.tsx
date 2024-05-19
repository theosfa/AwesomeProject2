import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import LearningScreen from '../screens/LearningScreen.js';
import ProfileScreen from '../screens/ProfileScreen';

import {StyleSheet, Image, Text} from 'react-native';

const Tab = createBottomTabNavigator();
const  StudentNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName='Главная'
      screenOptions={({ route }) => ({
        tabBarInactiveBackgroundColor: "#000",
        tabBarStyle: {
          backgroundColor: "#000",
        },
        tabBarIcon: ({ focused }) => {

          if (route.name === 'Главная') {
            return !focused 
            ? 
            <Image source={require('../assets/images/home-outline.png')} style={styles.iconFocused} /> 
            : 
            <Image source={require('../assets/images/home.png')} style={styles.iconNotFocused}/>;
          } else if (route.name === 'Профиль') {
            return !focused 
            ? 
            <Image source={require('../assets/images/person-outline.png')} style={styles.iconFocused}/> 
            : 
            <Image source={require('../assets/images/person.png')} style={styles.iconNotFocused}/>;
          } else if (route.name === 'Обучение') {
            return !focused 
            ? 
            <Image source={require('../assets/images/learning-outline.png')} style={styles.iconFocused}/> 
            : 
            <Image source={require('../assets/images/learning.png')} style={styles.iconNotFocused}/>;
          }

          return <Image source={require('../assets/images/home.png')} style={styles.iconFocused} />;
        },
        headerStyle: {
          backgroundColor: "#000",
        },
        headerTitleAlign: 'center',
        headerTintColor: '#fff',
        tabBarInactiveTintColor: '#BABABA',
        tabBarActiveTintColor: '#fff',
        style: {
          display: 'flex',
          
        },
      })}
    >
      <Tab.Screen 
          name="Обучение" 
          component={LearningScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>Обучение</Text>
            ),
          }}
        />
      <Tab.Screen 
          name="Главная" 
          component={HomeScreen} 
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>Главная</Text>
            ),
          }}
        />
      <Tab.Screen
          name="Профиль"
          component={ProfileScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>Профиль</Text>
            ),
            // headerRight: () => (
            //   <Button title='Exit' onPress={handleLogout} style={styles.headerTitle} />
            // ),
          }}
        />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconFocused: {
    marginTop: 3,
    height: 25,
    width: 25,
  },
  iconNotFocused: {
    marginTop: 3,
      height: 30,
      width: 30,
  },
  headerLeft: {
    color: 'white',
    backgroundColor: 'green',
    // marginLeft: '50%',
  },
  headerRight: {
    color: 'white',
    backgroundColor: 'Red',
    padding: 5,
    fontFamily: 'Poppins-Bold',
    // marginLeft: '50%',
  },
  headerTitle: {
    color: 'white',
    // backgroundColor: 'green',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    // fontFamily: require('./assets/fonts/YourFontFile.ttf'),
    fontSize: 25
  }
});

export default StudentNavigation;