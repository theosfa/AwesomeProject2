import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, collection, addDoc, getDocs } from 'firebase/firestore';

const LearningScreen = ({ navigation }) => {
    const lectures = [
        {
            "materials" : [
                {
                title : "Наследование",
                text : "*объемный и интересный текстовый материал*"
                },
                {
                    title : "Инкапсуляция",
                    text : "*объемный и интересный текстовый материал*"
                },
                {
                    title : "Полиморфизм",
                    text : "*объемный и интересный текстовый материал*"
                },
                {
                    title : "Абстракция",
                    text : "*объемный и интересный текстовый материал*"
                },
            ],
            "title" : " Раздел 1. Основные концепции ООП"
        },
     
        {
            "materials" : [
                {
                    title : "Асинхронный JavaScript",
                    text : "*объемный и интересный текстовый материал*"
                },
                {
                    title : "Prototype и ES6 классы",
                    text : "*объемный и интересный текстовый материал*"
                },
                {
                    title : "Работа Event Loop",
                    text : "*объемный и интересный текстовый материал*"
                },
                {
                    title : "Устройство DOM",
                    text : "*объемный и интересный текстовый материал*"
                },
            ],
            "title" : " Раздел 2. Продвинутые концепции ООП"
        },
     
        {
            "materials" : [
                {
                    title : "Шаблоны проектирования",
                    text : "*объемный и интересный текстовый материал*"
                },
                {
                    title : "Архитектура микросервисов",
                    text : "*объемный и интересный текстовый материал*"
                },
                {
                    title : "Модели и диаграммы в ООП",
                    text : "*объемный и интересный текстовый материал*"
                },
                {
                    title : "Бессервисная архитектура",
                    text : "*объемный и интересный текстовый материал*"
                },
            ],
            "title" : " Раздел 3. Проектирование ПО и архитектура"
        },
     
        {
            "materials" : [
                {
                    title : "Будет добавлено в следующем обновлении",
                    text : "*объемный и интересный текстовый материал*"
                },
                {
                    title : "Будет добавлено в следующем обновлении",
                    text : "*объемный и интересный текстовый материал*"
                },
                {
                    title : "Будет добавлено в следующем обновлении",
                    text : "*объемный и интересный текстовый материал*"
                },
                {
                    title : "Будет добавлено в следующем обновлении",
                    text : "*объемный и интересный текстовый материал*"
                },
            ],
            "title" : "Раздел 4. ООП в системной проектировании и интеграции"
        },
     
        {
            "materials" : [
                {
                    title : "Будет добавлено в следующем обновлении",
                    text : "*объемный и интересный текстовый материал*",
                },
                {
                    title : "Будет добавлено в следующем обновлении",
                    text : "*объемный и интересный текстовый материал*",
                },
                {
                    title : "Будет добавлено в следующем обновлении",
                    text : "*объемный и интересный текстовый материал*",
                },
                {
                    title : "Будет добавлено в следующем обновлении",
                    text : "*объемный и интересный текстовый материал*",
                },
                {
                    title : "Будет добавлено в следующем обновлении",
                    text : "*объемный и интересный текстовый материал*",
                },
            ],
            "title" : "Раздел 5. Практическое применение ООП",
        },
     ]

    const handleUpdateProfile = async () => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const lecturesCollectionRef = collection(db, "lectures");
            try {
                // Add new lecture to the "lectures" collection
                lectures.map(async (item) => {
                    await addDoc(lecturesCollectionRef, item);
                });
                Alert.alert("Lecture added");
            } catch (error) {
                console.error("Error adding lecture:", error);
                Alert.alert("Update Failed", error.message);
            }
            navigation.navigate('Обучение');
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Upload Lectures" onPress={handleUpdateProfile} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    button: {
        fontSize: 18,
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5
    }
});

export default LearningScreen;
