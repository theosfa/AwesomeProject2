import React from 'react';
import { View, StyleSheet, Image} from 'react-native';

const LoadingScreen = ({ }) => {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/preview.png')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
});

export default LoadingScreen;
