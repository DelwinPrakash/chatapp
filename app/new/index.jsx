import { useState } from 'react';
import { View, TextInput, FlatList, Pressable, Text, Image, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from 'expo-router';

export default function Index() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const { user } = useAuth();
    const navigation = useNavigation();

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        
        setIsSearching(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                // .or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
                // .or(`username.ilike.%${searchTerm}%`)
                .ilike('username', `%${searchTerm}%`)
                .neq('id', user.id)
                .limit(20);

            if (error) throw error;
            setSearchResults(data || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const startNewChat = async (userId) => {
        try{
            const { data: myConversations } = await supabase
                .from('participants')
                .select('conversation_id')
                .eq('user_id', user.id)
                // .contains('conversation_id', {
                //     participants: { user_id: userId }
                // })
                // .maybeSingle();
    
            // console.log("my all convo", myConversations);
            // if(existingChatError) throw existingChatError;
    
            const conversationIds = myConversations.map(p => p.conversation_id)
    
            const { data: existingChat } = await supabase
                .from('participants')
                .select('conversation_id')
                .in('conversation_id', conversationIds)
                .eq('user_id', userId)
                .maybeSingle();

            if (existingChat) {
                navigation.navigate('chat/[id]', { chatId: existingChat.conversation_id });
                return;
            }

            const { data: userProfile, error: profileError } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', userId)
                .single();
            
            if (profileError) throw profileError;

            const { data: newConversation, error } = await supabase
                .from('conversations')
                .insert({title: userProfile.username || 'New Chat'})
                .select()
                .single();
    
            if (error) throw error;
    
            await supabase.from('participants').insert([
                { conversation_id: newConversation.id, user_id: user.id },
                { conversation_id: newConversation.id, user_id: userId }
            ]);
    
            navigation.navigate('chat/[id]', { chatId: newConversation.id });

        }catch(error){
            console.log(error)
        }
    };

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: '#262424'}}>
            <TextInput
                placeholder="Search by email"
                value={searchTerm}
                onChangeText={setSearchTerm}
                onSubmitEditing={handleSearch}
                style={{
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    marginBottom: 16,
                    color: '#fff'
                }}
                placeholderTextColor={'#ddd'}
            />

            {isSearching ? (
                <Text style={{color: "#fff"}}>Searching...</Text>
            ) : (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => startNewChat(item.id)}
                            style={{
                                padding: 16,
                                borderBottomWidth: 1,
                                borderColor: '#eee',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <View style={{ marginRight: 12 }}>
                                <Image
                                    source={{ uri: `https://picsum.photos/200/300?${item.id}` }}
                                    style={{ 
                                        width: 40, 
                                        height: 40, 
                                        borderRadius: 20, 
                                        backgroundColor: '#ddd'
                                    }}
                                />
                            </View>
                            <Text style={{ fontSize: 16, color: '#fff' }}>
                                {item.username || 'No username'}
                            </Text>
                        </Pressable>
                    )}
                />
            )}
        </View>
    );
}