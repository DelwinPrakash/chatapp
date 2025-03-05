import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [message, setMessages] = useState([]);

    useEffect(() => {
        // Add some demo messages on component mount
        setMessages([
        {
            _id: 1,
            text: 'Hello! How are you?',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'John Doe',
            },
        },
        {
            _id: 2,
            text: 'I\'m good, thanks for asking!',
            createdAt: new Date(),
            user: {
                _id: 1,
                name: 'You',
            },
        },
        {
            _id: 3,
            text: 'Great to hear! What have you been up to?',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'John Doe',
            },
        }
    ]);
    }, []);

    const onSend = (newMessages = []) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    };



    return (
        <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1F1A20"}}>
            <StatusBar barStyle={"light-content"} backgroundColor={"#123456"}/>
            <View>
                <Text style={{color: "white"}}>This is the home page of this app</Text>
            </View>
        </SafeAreaView>
    );
}
