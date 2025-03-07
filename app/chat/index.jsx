import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

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
                avatar: "https://picsum.photos/200/300?random=2"
            },
        },
        {
            _id: 2,
            text: 'I\'m good, thanks for asking!',
            createdAt: new Date(),
            user: {
                _id: 1,
                name: 'You',
                avatar: "https://picsum.photos/200/300?random=1"
            },
        },
        {
            _id: 3,
            text: 'Great to hear! What have you been up to?',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'John Doe',
                avatar: "https://picsum.photos/200/300?random=2"
            },
        }
    ]);
    }, []);

    const renderBubble = (props) => {
        return (
        <Bubble
            {...props}
            wrapperStyle={{
            right: {
                backgroundColor: "#443051",
                // marginBottom: 5,
            },
            left: {
                backgroundColor: "#826723",
                // marginBottom: 5,
            }
            }}
            textStyle={{
            left:{
                color: "#fff",
            }
            }}
            containerStyle={{
                right: { marginBottom: 5 },
                left: { marginBottom: 5 },
            }} 
            renderAvatar={(props) => {
                return <Image source={{uri: props.currentMessage.user.avatar}}/>
            }}
            // tick={true}
        />
        );
    }


    const onSend = (newMessages = []) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1F1A20"}}>
                <StatusBar barStyle={"light-content"} backgroundColor={"#123456"}/>
                {/* <View>
                    <Text style={{color: "white"}}>This is the home page of this app</Text>
                </View> */}
                <GiftedChat
                    messages={message}
                    onSend={(newMessages) => onSend(newMessages)}
                    user={{
                        _id: 1, // Set your user ID (can be dynamic later when using a real auth system)
                        name: 'You',
                    }}
                    alwaysShowSend={true}
                    renderBubble={renderBubble}
                />
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

// import React, { useState } from 'react';
// import { View, TextInput, KeyboardAvoidingView, Platform, Text, StyleSheet } from 'react-native';
// import { GiftedChat } from 'react-native-gifted-chat';

// const Index = () => {
//   const [messages, setMessages] = useState([]);

//   const onSend = (newMessages = []) => {
//     setMessages(GiftedChat.append(messages, newMessages));
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <GiftedChat
//         messages={messages}
//         onSend={onSend}
//         user={{
//           _id: 1, // Example user ID
//         }}
//       />
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#123456"
//   },
// });

// export default Index;
