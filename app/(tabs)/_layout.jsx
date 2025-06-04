import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
    return(
        <Tabs screenOptions={{
            // tabBarActiveTintColor: 'black',
            headerShown: false,
            // tabBarButton: HapticTab,
            // tabBarBackground: TabBarBackground,
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
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Chat",
                    // tabBarIcon: ({ color }) => <TabIcon name="chatbubble-ellipses" color={color} />,
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
                    title: "Profile",
                    // tabBarIcon: ({ color }) => <TabIcon name="person" color={color} />,
                }}
            />
        </Tabs>
    );
}