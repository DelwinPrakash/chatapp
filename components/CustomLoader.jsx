import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function CustomLoader() {
    const rotateAimate = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAimate, {
                toValue: 20,
                duration: 10000,
                useNativeDriver: true
            })
        ).start();
    }, [rotateAimate]);

    const spin = rotateAimate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#262424" }}>
            {/* <Text style={{ color: '#eee3d5' }}>Loading...</Text> */}
            <Animated.View style={[styles.box, {transform: [{rotate: spin}]}]}/>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        height: 25,
        width: 25,
        borderColor: '#eee3d5',
        borderWidth: 2,
        borderRadius: 15,
        borderBottomWidth: 0,
        backgroundColor: 'none'
    },
});