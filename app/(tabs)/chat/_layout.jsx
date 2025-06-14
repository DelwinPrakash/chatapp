import { Stack, useRouter } from "expo-router";
import { Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';


export default function Layout(){
    const router = useRouter();
    return(
        <Stack>
            <Stack.Screen name="index"options={{
                title: "ChatApp",
                headerShown: true,
                headerStyle:{backgroundColor: "#171616"},
                headerShadowVisible: false,
                headerTintColor: "#eee5da",
                headerRight: () => {
                    return (
                        <TouchableOpacity>
                            <Pressable onPress={() => router.push({pathname: 'chat/new'})}>
                                <Ionicons name="add" size={24} color="white" />
                            </Pressable>
                        </TouchableOpacity>
                    );
                }
            }}/>
            <Stack.Screen name="[id]" options={{title: "Chat 1", headerShown: true, headerStyle:{backgroundColor: "#171616"}, headerShadowVisible: false, headerTintColor: "#eee5da"}}/>
            <Stack.Screen name="new/index" options={{title: "Find Friends", headerShown: true, headerStyle:{backgroundColor: "#171616"}, headerShadowVisible: false, headerTintColor: "#eee5da"}}/>
        </Stack>
    );
}
