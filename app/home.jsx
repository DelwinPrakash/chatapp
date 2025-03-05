// import React, { useState, useEffect } from 'react';
// import { View, SafeAreaView, Text, KeyboardAvoidingView } from 'react-native';
// import { Bubble, GiftedChat } from "react-native-gifted-chat";

// export default function index(){
//   const [messages, setMessages] = useState([{
//         _id: 1,
//         text: 'Hello! How are you?',
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: 'John Doe',
//           avatar: `https://picsum.photos/200/300?random=2`,
//         },
//       },
//       {
//         _id: 2,
//         text: 'I\'m good, thanks for asking!',
//         createdAt: new Date(),
//         user: {
//           _id: 1,
//           name: 'You',
//           avatar: 'https://picsum.photos/200/300?random=1',
//         },
//       },
//       {
//         _id: 3,
//         text: 'Great to hear! What have you been up to?',
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: 'John Doe',
//           avatar: 'https://picsum.photos/200/300?random=2',
//         },
//       }]);
//   // useEffect(() => {
//   //   // Add some demo messages on component mount
//   //   setMessages([
//   //     {
//   //       _id: 1,
//   //       text: 'Hello! How are you?',
//   //       createdAt: new Date(),
//   //       user: {
//   //         _id: 2,
//   //         name: 'John Doe',
//   //       },
//   //     },
//   //     {
//   //       _id: 2,
//   //       text: 'I\'m good, thanks for asking!',
//   //       createdAt: new Date(),
//   //       user: {
//   //         _id: 1,
//   //         name: 'You',
//   //       },
//   //     },
//   //     {
//   //       _id: 3,
//   //       text: 'Great to hear! What have you been up to?',
//   //       createdAt: new Date(),
//   //       user: {
//   //         _id: 2,
//   //         name: 'John Doe',
//   //       },
//   //     },
//   //   ]);
//   // }, []);

//   // Handle sending a new message
//   const onSend = (newMessages = []) => {
//     setMessages((previousMessages) =>
//       GiftedChat.append(previousMessages, newMessages)
//     );
//   };

//   const renderBubble = (props) => {
//     return (
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           right: {
//             backgroundColor: "#443051",
//             // marginBottom: 5,
//           },
//           left: {
//             backgroundColor: "#826723",
//             // marginBottom: 5,
//           }
//         }}
//         textStyle={{
//           left:{
//             color: "#fff",
//           }
//         }}
//         containerStyle={{
//           right: { marginBottom: 5 },
//           left: { marginBottom: 5 },
//         }} 
//         renderAvatar={(props) => {
//           return <Image source={{uri: props.currentMessage.user.avatar}}/>
//         }}
//         // tick={true}
//       />
//     );
//   }

//   return (
//     // <SafeAreaView style={{flex:1, backgroundColor: "#1F1A20"}}>
//     //   {/* <GiftedChat
//     //       messages={messages}
//     //       onSend={(newMessages) => onSend(newMessages)}
//     //       user={{
//     //         _id: 1, // Set your user ID (can be dynamic later when using a real auth system)
//     //         name: 'You',
//     //       }}
//     //       alwaysShowSend={true}
//     //       renderBubble={renderBubble}
//     //   /> */}
//     //   <Text style={{color: "red"}}>Hello there</Text>
//     // </SafeAreaView>
//     <View>
//       <Text style={{color: "red"}}>Hello there</Text>
//     </View>
//   );
// };

