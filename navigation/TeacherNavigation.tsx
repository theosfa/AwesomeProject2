import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreatingTestsScreen from '../screens/CreatingTestsScreen';
import LearningScreen from '../screens/LearningScreen.js';
import StaticticsScreen from '../screens/StaticticsScreen';

import {StyleSheet, Image, Text} from 'react-native';

const Tab = createBottomTabNavigator();
const  TeacherNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName='Статистика'
      screenOptions={({ route }) => ({
        tabBarInactiveBackgroundColor: "#000",
        tabBarStyle: {
          backgroundColor: "#000",
        },
        tabBarIcon: ({ focused }) => {

          if (route.name === 'Тесты') {
            return !focused 
            ? 
            <Image source={require('../assets/images/home-outline.png')} style={styles.iconFocused} /> 
            : 
            <Image source={require('../assets/images/home.png')} style={styles.iconNotFocused}/>;
          } else if (route.name === 'Статистика') {
            return !focused 
            ? 
            <Image source={require('../assets/images/person-outline.png')} style={styles.iconFocused}/> 
            : 
            <Image source={require('../assets/images/person.png')} style={styles.iconNotFocused}/>;
          } else if (route.name === 'Лекции') {
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
          name="Лекции" 
          component={LearningScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>Лекции</Text>
            ),
          }}
        />
      <Tab.Screen 
          name="Статистика" 
          component={StaticticsScreen} 
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>Статистика</Text>
            ),
          }}
        />
      <Tab.Screen
          name="Тесты"
          component={CreatingTestsScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>Тесты</Text>
            ),
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
    backgroundColor: 'green',
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

export default TeacherNavigation;