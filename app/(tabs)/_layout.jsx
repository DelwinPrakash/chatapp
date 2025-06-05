import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    return(
        <Tabs screenOptions={{
            // tabBarActiveTintColor: 'black',
            headerShown: false,
            // tabBarButton: HapticTab,
            // tabBarBackground: TabBarBackground,
            tabBarLabel: () => false,
            tabBarStyle: Platform.select({
                ios: {
                    position: 'absolute',
                },
                default: {
                    backgroundColor: '#171616',
                    borderTopColor: 'transparent',
                    height: 60,
                    paddingBottom: 10,
                },
            }),
            tabBarItemStyle: {
                paddingTop: 10,
                paddingBottom: 10,
            }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => <Ionicons name="chatbubble-ellipses" size={24} color={focused ? '#3e787a' : '#aaa'} />,
                }}
            />
            {/* <Tabs.Screen
                name="../new/index"
                options={{
                    title: "Find Friends",
                    tabBarIcon: ({ color }) => <TabIcon name="search" color={color} />,
                }}
            /> */}
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => <Ionicons name="person" size={24} color={focused ? '#3e787a' : '#aaa'} />,
                }}
            />
        </Tabs>
    );
}