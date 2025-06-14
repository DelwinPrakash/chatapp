import { Tabs, useSegments } from "expo-router";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabLayout() {
    const segments = useSegments();
    return(
        <GestureHandlerRootView>
            <Tabs screenOptions={{
                headerShown: false,
                tabBarLabel: () => false,
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                    },
                    default: {
                        backgroundColor: '#171616',
                        borderTopWidth: 0,
                        elevation: 0,   
                        height: 60,
                        paddingBottom: 10,
                        // display: segments[2] === "[id]" ? "none" : "flex"
                    },
                }),
                tabBarItemStyle: {
                    paddingTop: 10,
                    paddingBottom: 10,
                }
            }}>
                <Tabs.Screen
                    name="chat"
                    options={{
                        tabBarIcon: ({ focused }) => <Ionicons name="chatbubble-ellipses" size={24} color={focused ? '#3e787a' : '#aaa'} />,
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        tabBarIcon: ({ focused }) => <Ionicons name="person" size={24} color={focused ? '#3e787a' : '#aaa'} />,
                    }}
                />
            </Tabs>
        </GestureHandlerRootView>
    );
}