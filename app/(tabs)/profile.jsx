import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

export default function Profile() {
    const { user, logout, userLoading } = useAuth();
    const navigation = useNavigation();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newUsername, setNewUsername] = useState('');
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (!user && !userLoading){
            navigation.replace("auth/index");
        }

        const fetchProfile = async () => {
            if (!user) return;
            
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (!error) setProfile(data);
            setLoading(false);
        };
        
        fetchProfile();
    }, [user, userLoading]);

    const handleSignOut = () => {
        logout();
        setProfile(null);
        navigation.replace('auth/index');
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#00f0ff" />
            </View>
        );
    }

    const changeUsername = async () => {
        if(!newUsername.trim()) {
            Alert.alert("Username cannot be empty");
            return;
        }
        const { error } = await supabase
            .from('profiles')
            .update({ username: newUsername })
            .eq('id', user.id);

        if (error) {
            Alert.alert("Error updating username", error.message);
        }else{
            setProfile({ ...profile, username: newUsername });
            setEditMode(false);
            setNewUsername('');
            Alert.alert("Username updated successfully");
        }
    }

    return (
        <ScrollView contentContainerStyle={[styles.scrollContainer]}>
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: profile?.avatar_url || 'https://i.pravatar.cc/300' }}
                            style={styles.avatar}
                        />
                    </View>            
                    <View style={styles.userDetailsContainer}>
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <View style={{padding: 10}}>
                                <Ionicons name="person" size={18} color="#eee5da" />
                            </View>
                            <View style={{flex: 1, paddingLeft: 10, paddingRight: 10}}>
                                <View>
                                    <Text style={{fontWeight: 'bold', color: "#eee5da"}}>USERNAME</Text>
                                </View>
                                <View>
                                    <Text style={styles.name}>
                                        { profile?.username || 'User'}
                                    </Text>
                                </View>
                            </View>
                            <View style={{padding: 10}}>
                                <TouchableOpacity onPress={() => setEditMode(!editMode)}>
                                    <Ionicons name="pencil" size={18} color="#eee5da" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10}}>
                            <View style={{padding: 10, }}>
                                <Ionicons name="mail" size={18} color="#eee5da" />
                            </View>
                            <View style={{flex: 1, paddingLeft: 10, paddingRight: 10}}>
                                <View>
                                    <Text style={{fontWeight: 'bold', color: "#eee5da"}}>EMAIL</Text>
                                </View>
                                <View>
                                    <Text style={styles.email}>{user?.email}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>       

                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="settings" size={24} color="#3e787a" />
                        <Text style={styles.menuText}>General Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="notifications" size={24} color="#3e787a" />
                        <Text style={styles.menuText}>Notification Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="lock-closed" size={24} color="#3e787a" />
                        <Text style={styles.menuText}>Privacy & Security</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="help-circle" size={24} color="#3e787a" />
                        <Text style={styles.menuText}>Help Center</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="information-circle" size={24} color="#3e787a" />
                        <Text style={styles.menuText}>About ChatApp</Text>
                    </TouchableOpacity>
                </View> */}
                
                <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            {editMode && (
                <View style={styles.overlay}>
                    <View style={styles.editBox}>
                        <Text style={styles.editLabel}>Change Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new username"
                            placeholderTextColor="#999"
                            value={newUsername}
                            onChangeText={setNewUsername}
                        />
                        <View style={styles.editActions}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setEditMode(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={() => {
                                    changeUsername();
                                }}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        padding: 16,
        paddingBottom: 20,
        backgroundColor: '#262424',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#262424',
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    // profileContainer: {
        // alignItems: 'center',
        // marginBottom: 30,
        // backgroundColor: '#171616',
    // },
    avatarContainer: {
        position: 'relative',
        marginTop: 16,
        // backgroundColor: '#171616',
        alignItems: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#eee5da',
    },
    editIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#3e787a',
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userDetailsContainer: {
        marginTop: 100,
        // backgroundColor: '#171616',
    },
    name: {
        fontSize: 15,
        color: '#b5b1b1',
        marginBottom: 4,
    },
    email: {
        fontSize: 15,
        color: '#b5b1b1',
        marginBottom: 4,
    },
    // section: {
    //     marginBottom: 20,
    // },
    // sectionTitle: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    //     color: '#3e787a',
    //     marginBottom: 15,
    //     paddingLeft: 10,
    // },
    // menuItem: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     backgroundColor: '#171616',
    //     padding: 16,
    //     borderRadius: 10,
    //     marginBottom: 12,
    // },
    // menuText: {
    //     fontSize: 16,
    //     color: '#eee5da',
    //     marginLeft: 15,
    // },
    logoutButton: {
        backgroundColor: '#eee5da',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBox: {
        width: '90%',
        backgroundColor: '#171616',
        padding: 20,
        borderRadius: 10,
    },
    editLabel: {
        color: '#eee5da',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#eee5da',
        borderRadius: 8,
        padding: 10,
        color: '#eee5da',
        marginBottom: 20,
    },
    editActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: '#444',
    },
    saveButton: {
        backgroundColor: '#3e787a',
    },
    buttonText: {
        color: '#eee5da',
        fontWeight: 'bold',
    },
});