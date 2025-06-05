import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useLocalSearchParams, useNavigation, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useAuth } from '../../context/AuthContext';
import { sendMessage } from '../../lib/message';
import { DateTime } from 'luxon';

export default function ChatScreen({ route }) {
    const navigation = useNavigation();
    const { chatId: conversationId } =useLocalSearchParams();
    const { user, userLoading } = useAuth();
    const [messages, setMessages] = useState([]);
    const [title, setTitle] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    useLayoutEffect(() => {
        navigation.setOptions({title: title || 'Chat'});
    }, [navigation, title]);

    useFocusEffect(
        React.useCallback(( ) => {
            const markMessagesAsRead = async () => {
            //     if(!user.id) return;

            //     const { data: unreadMessages } = await supabase
            //         .from('messages')
            //         .select('id')
            //         .eq('conversation_id', conversationId)
            //         // .not('message_reads.user_id', 'eq', user.id);
            //         .neq('sender_id', user.id);
                    
            //     if(unreadMessages?.length > 0){
            //         const reads = unreadMessages.map(msg => ({
            //             message_id: msg.id,
            //             user_id: user.id
            //         }))

            //         await supabase.from("message_reads").upsert(reads);
            //     }
            // }
            // markMessagesAsRead();

                if (!user?.id) return;

                await supabase
                    .from('participants')
                    .update({ last_read_at: new Date().toISOString() })
                    .eq('conversation_id', conversationId)
                    .eq('user_id', user.id);
            }
            markMessagesAsRead();
        }, [conversationId, user?.id])
    );

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) console.error("fetchMessages error:",error);
            else {
                await supabase.from("conversations").update({last_message: data[data.length - 1]?.created_at}).eq("id", conversationId);
                const giftedChatMessages = data.map(msg => ({
                    _id: msg.id, 
                    text: msg.content,
                    // createdAt: new Date(msg.created_at),
                    createdAt: DateTime.fromISO(msg.created_at, { zone: 'utc' }).setZone('Asia/Kolkata').toFormat('yyyy-MM-dd HH:mm:ss'),
                    user: {
                        _id: msg.sender_id,
                        name: msg.sender_name || 'Unknown'
                    }
                })).reverse();
                setMessages(giftedChatMessages);
                
                const { data: convoTitle } = await supabase
                    .from('user_conversations_view')
                    .select('*')
                    .eq('viewer_id', user.id)
                    .eq('conversation_id', conversationId)
                setTitle(convoTitle[0].other_user_name || 'Chat');
            }
        };

        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    if( payload.new.conversation_id === conversationId){
                        fetchMessages();
                    }
                    // const newMessage = {
                    //     _id: payload.new.id, 
                    //     text: payload.new.content,
                    //     createdAt: DateTime.fromISO(payload.new.created_at, { zone: 'utc' }).setZone('Asia/Kolkata').toFormat('yyyy-MM-dd HH:mm:ss'),
                    //     user: {
                    //         _id: payload.new.sender_id,
                    //         name: payload.new.sender_name || 'Unknown'
                    //     }
                    // }
                    // setMessages((prev) => [...prev, newMessage]);
                    // console.log('messageee:', messages);
                }
            )
            .subscribe();
        
        return () => {
            supabase.removeChannel(channel);
        };

    }, [conversationId]);

    if(userLoading){
        return <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1F1A20"}}>
            <ActivityIndicator size="large" color="#00f0ff" />
        </View>
    }

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
            },
            right:{
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
    
    // const renderAvatar = (props) => {
    //     return (
    //         <Image
    //             source={{uri: props.currentMessage.user.avatar}}
    //             style={{ width: 40, height: 40, borderRadius: 20, marginBottom: 5 }}
    //         />
    //     );
    // }

    const onSend = async (newMessages = []) => {
        if(!newMessages || newMessages.length === 0) return;

        setIsSending(true);
        try{
            setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

            const sentMessage = sendMessage({
                conversationId: conversationId,
                senderId: user.id,
                content: newMessages[0].text
            });
            
        }finally{
            setIsSending(false);
        }
    }
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#262424", borderWidth: 1}}>
                <StatusBar barStyle={"light-content"} backgroundColor={"#123456"}/>
                <View style={{flex: 1, width: "100%"}}>
                    <GiftedChat
                        messages={messages}
                        onSend={(newMessages) => onSend(newMessages)}
                        user={{
                            _id: user.id,
                            name: 'You',
                        }}
                        alwaysShowSend={true}
                        renderBubble={renderBubble}
                        renderAvatar={null}
                    />
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}