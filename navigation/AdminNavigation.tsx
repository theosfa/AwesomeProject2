import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TeachersListScreen from '../screens/TeachersListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateTeacherScreen from '../screens/CreateTeacherScreen';

import {StyleSheet, Image, Text} from 'react-native';

const Tab = createBottomTabNavigator();
const  MainAppTabs = () => {
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
          } else if (route.name === 'Создание') {
            return !focused 
            ? 
            <Image source={require('../assets/images/person-outline.png')} style={styles.iconFocused}/> 
            : 
            <Image source={require('../assets/images/person.png')} style={styles.iconNotFocused}/>;
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
          name="Главная" 
          component={ProfileScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>Главная</Text>
            ),
          }}
        />
      <Tab.Screen 
          name="Создание" 
          component={CreateTeacherScreen} 
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>Создание</Text>
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

export default MainAppTabs;