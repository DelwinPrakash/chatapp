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
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

export default function Index(){
  const navigation = useNavigation();
  const { user, userLoading } = useAuth();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("hello",user);

  useEffect(() => {
    if (!user && !userLoading) {
      navigation.replace("auth/index");
    }

    if (user) {
      const fetchChats = async () => {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            id,
            title,
            last_message,
            participants!inner(user_id),
            messages(
              content, 
              created_at
            )
          `)
          .eq('participants.user_id', user.id)
          .order('last_message', { ascending: false });

        console.log('DATA:', data);
        console.log('ERROR:', error);

        if (!error) {
          setChats(data);
        }
        setLoading(false);
      };

      fetchChats();

      // Realtime subscription
      const channel = supabase
        .channel('conversations')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'conversations',
            filter: `participants.user_id=eq.${user.id}`
          },
          (payload) => {
            // Update chats list when changes occur
            fetchChats();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, userLoading])

  if(userLoading){
      return <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#00f0ff" />
      </View>
  }
  
  // const mokeChats = [
  //   {
  //     id: '1',
  //     name: 'John Doe',
  //     lastMessage: 'Hey, how are you?',
  //     timestamp: '10:30 AM',
  //     unreadCount: 2,
  //     online: true,
  //   },
  //   {
  //     id: '2',
  //     name: 'Jane Smith',
  //     lastMessage: 'See you tomorrow!',
  //     timestamp: '9:45 AM',
  //     unreadCount: 0,
  //     online: false,
  //   },
  //   {
  //     id: '3',
  //     name: 'Mike Johnson',
  //     lastMessage: 'Thanks for the help!',
  //     timestamp: 'Yesterday',
  //     unreadCount: 1,
  //     online: true,
  //   },
  // ];


  // const renderItem = ({ item }) => (
  //   <TouchableOpacity 
  //     style={styles.chatItem}
  //     onPress={() => navigation.navigate('chat/index', { chatId: item.id })}      //TODO
  //   >
  //     <View style={styles.avatarContainer}>
  //       <View style={styles.avatar}>
  //         {/* You can replace this with actual image */}
  //         <Image
  //           source={`https://picsum.photos/200/300?random=${item.id}`}
  //           style={{ width: 50, height: 50, borderRadius: 25 }}
  //         />
  //         {/* <Text style={styles.avatarText}>{item.name[0]}</Text> */}
  //       </View>
  //       {item.online && <View style={styles.onlineIndicator} />}
  //     </View>

  //     <View style={styles.chatContent}>
  //       <View style={styles.chatHeader}>
  //         <Text style={styles.name}>{item.name}</Text>
  //         <Text style={styles.timestamp}>{item.timestamp}</Text>
  //       </View>
  //       <View style={styles.messageContainer}>
  //         <Text 
  //           style={styles.lastMessage}
  //           numberOfLines={1}
  //           ellipsizeMode="tail"
  //         >
  //           {item.lastMessage}
  //         </Text>
  //         {item.unreadCount > 0 && (
  //           <View style={styles.unreadBadge}>
  //             <Text style={styles.unreadText}>{item.unreadCount}</Text>
  //           </View>
  //         )}
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );

  const renderItem = ({ item }) => {
    const otherParticipant = item.participants.find(p => p.user_id !== user.id);
    
    return (
      <TouchableOpacity 
        style={styles.chatItem}
        // onPress={() => navigation.navigate('chat/index', { chatId: item.id })}
        onPress={() => navigation.navigate('chat/[id]', { chatId: item.id })}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: otherParticipant?.avatar_url || 'https://picsum.photos/200/300?random' }}
            style={styles.avatar}
          />
          {otherParticipant?.online && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.name}>
              {item.title || otherParticipant?.username || 'Unknown'}
            </Text>
            <Text style={styles.timestamp}>
              {item.messages[0]?.created_at.replace("T", " ").split(".")[0]}
            </Text>
          </View>
          <View style={styles.messageContainer}>
            <Text 
              style={styles.lastMessage}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.messages[0]?.content || 'No messages yet'}
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
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
        </TouchableOpacity>
      </View> */}

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ChatApp</Text>
          <Pressable onPress={() => navigation.navigate('chat/new')}>
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          placeholderTextColor="#aaa"
        />
        
        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          <FlatList
            data={chats}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No conversations yet</Text>
            }
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>

      {/* <FlatList
        data={mokeChats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      /> */}
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
  // avatarText: {
  //     color: 'white',
  //     fontSize: 20,
  //     fontWeight: 'bold',
  // },
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
      color: "#fff"
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a2f30',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchInput: {
    backgroundColor: '#1a2f30',
    color: 'white',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  loader: {
    marginTop: 40,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
