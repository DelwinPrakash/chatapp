// import { Link } from 'expo-router';
// import { View, Text, Pressable, StyleSheet } from 'react-native';

// function createStyles(){
//     return StyleSheet.create({
//         center: {
//             justifyContent: "center",
//             alignItems: "center",
//             textAlign: "center"
//         }
//     })
// }

// export default function Index(){
//     const styles = createStyles();
//     return(
//         <View style={[{flex: 1, backgroundColor: "#1F1A30"}, styles.center]}>
//             {/* <Text style={{color: "white"}}>This is the Home page!</Text> */}
//             <View>
//                 <Link href="/chat" asChild>
//                     <Pressable>
//                         <Text style={[{width:120, backgroundColor: "#826730", padding: 10, marginTop: 10, color: "white", borderRadius: 20}, styles.center]}>Go to Chat</Text>
//                     </Pressable>
//                 </Link>
//             </View>
//         </View>
//     );
// }

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function Index(){
  // Mock data for demonstration
  
  const chats = [
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: '10:30 AM',
      unreadCount: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'See you tomorrow!',
      timestamp: '9:45 AM',
      unreadCount: 0,
      online: false,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      lastMessage: 'Thanks for the help!',
      timestamp: 'Yesterday',
      unreadCount: 1,
      online: true,
    },
  ];

  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => navigation.navigate('chat/index', { chatId: item.id })}      //TODO
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          {/* You can replace this with actual image */}
          <Image
            source={`https://picsum.photos/200/300?random=${item.id}`}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
          {/* <Text style={styles.avatarText}>{item.name[0]}</Text> */}
        </View>
        {item.online && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text 
            style={styles.lastMessage}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
        </TouchableOpacity>
      </View> */}

      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
        {/* <View style={[styles.center, {flex: 1}]}>
            <Text style={{color: "white"}}>This is the Home page!</Text>
            <View>
                <Link href="/chat" asChild>
                    <Pressable>
                        <Text style={[{width:120, backgroundColor: "#826730", padding: 10, marginTop: 10, color: "white", borderRadius: 20}, styles.center]}>Go to Chat</Text>
                    </Pressable>
                </Link>
            </View>
        </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#233a3b',
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    // header: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     padding: 16,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#eee',
    // },
    // headerTitle: {
    //     fontSize: 40,
    //     fontWeight: 'bold',
    // },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    avatarContainer: {
        marginRight: 16,
        position: 'relative',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    onlineIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CD964',
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderWidth: 2,
        borderColor: 'white',
    },
    chatContent: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
    },
    messageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        flex: 1,
        color: '#aaa',
        marginRight: 8,
    },
    unreadBadge: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        paddingHorizontal: 6,
    },
    separator: {
        height: 1,
        backgroundColor: 'gray',
        marginHorizontal: 12,
    },
});
