import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { TextInput } from 'react-native-gesture-handler';
import { DateTime } from 'luxon';
import CustomLoader from "@/components/CustomLoader"
import { useRouter } from 'expo-router';

export default function Index(){
  const navigation = useNavigation();
  const { user, userLoading } = useAuth();
  const router = useRouter();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !userLoading) {
      navigation.replace("auth/index");
    }

    if (user) {
      const fetchChats = async () => {
        const { data: viewData, error: viewError } = await supabase
          .from('user_conversations_view')
          .select(`*`)
          .eq('viewer_id', user.id)
          .order('last_message', { ascending: false });

        const { data: unreadCount } = await supabase
          .rpc('get_unread_message_counts', { uid: user.id })

        const unreadMap = new Map(
            unreadCount.map(item => [item.conversation_id, item.unread_count])
        );

        const mergedData = viewData.map(convo => ({
            ...convo,
            unread_count: unreadMap.get(convo.conversation_id) || 0
        }));

        if(viewError) console.log(viewError);

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

        const combined = mergedData?.map((item, index) => ({
            ...item,
            ...data[index]
        }));

        if (!error) {
          setChats(combined.map(convo => ({
            ...convo,
            unreadCount: convo.unread_messages?.length || 0
          })));
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
          },
          (payload) => {
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
      return (
        <CustomLoader/>
      )
  }

  const renderItem = ({ item }) => {
    return (
      (item?.last_message && <TouchableOpacity 
        style={styles.chatItem}
        onPress={() => router.push({pathname: 'chat/[id]', params: {id: item.id}})}
        
        >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: `https://picsum.photos/200/300?random${item.other_user_id}` }}
            style={styles.avatar}
          />
          {item?.online && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <View style={{maxWidth: '80%'}}>
              <Text style={styles.name}>
                {item.other_user_name || 'Unknown'}
              </Text>
            </View>
            {item.messages[item.messages.length-1]?.created_at && <Text style={styles.timestamp}>
              {DateTime.fromISO(item.messages[item.messages.length-1]?.created_at, { zone: 'utc' }).setZone('Asia/Kolkata').hasSame(DateTime.now().setZone('Asia/Kolkata'), 'day') ? DateTime.fromISO(item.messages[item.messages.length-1]?.created_at, { zone: 'utc' }).setZone('Asia/Kolkata').toFormat('HH:mm') : DateTime.fromISO(item.messages[item.messages.length-1]?.created_at, { zone: 'utc' }).setZone('Asia/Kolkata').toFormat('MMM dd')}
            </Text>}
          </View>
          <View style={styles.messageContainer}>
            <Text 
              style={[styles.lastMessage, {fontWeight: item.unread_count ? "bold" : "regular", color: item.unread_count ? "#fff" : "#aaa"}]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.messages[item.messages?.length-1]?.content || 'No messages yet'}
            </Text>
            {item.unread_count > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread_count}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>ChatApp</Text>
          <Pressable onPress={() => navigation.navigate('new/index')}>
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View> */}
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          placeholderTextColor="#aaa"
        />
        
        {loading ? (
          <CustomLoader/>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#262424',
  },
  center: {
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#171616',
    height: 64
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#eee5da',
  },
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
      fontSize: 15,
      fontWeight: 'bold',
      color: "#eee5da",
      // backgroundColor: "red",
      // flexWrap: 'wrap',
      // maxWidth: '85%',
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
      // color: '#aaa',
      marginRight: 8,
  },
  unreadBadge: {
      backgroundColor: '#007AFF',
      borderRadius: 12,
      minWidth: 22,
      height: 22,
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
  searchInput: {
    // backgroundColor: '#262424',
    color: 'white',
    padding: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: '#eee5da',
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
