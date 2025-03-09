import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, KeyboardAvoidingView, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GiftedChat, Bubble, InputToolbar, Composer } from "react-native-gifted-chat";
import { useRoute } from '@react-navigation/native';

export default function Index() {
  const [message, setMessages] = useState([]);

    // const route = useRoute();
    // const { chatId } = route.params;

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
            // tick={true}
            />
        );
    }
    
    const renderAvatar = (props) => {
        return (
            <Image
                source={{uri: props.currentMessage.user.avatar}}
                style={{ width: 40, height: 40, borderRadius: 20, marginBottom: 5 }}
            />
        );

    }

    const onSend = (newMessages = []) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1F1A20", borderWidth: 1}}>
                <StatusBar barStyle={"light-content"} backgroundColor={"#123456"}/>
                <View style={{flex: 1, width: "100%"}}>
                    <GiftedChat
                        messages={message}
                        onSend={(newMessages) => onSend(newMessages)}
                        user={{
                            _id: 1, // Set your user ID (can be dynamic later when using a real auth system)
                            name: 'You',
                        }}
                        alwaysShowSend={true}
                        renderBubble={renderBubble}
                        renderAvatar={renderAvatar}
                    />
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
