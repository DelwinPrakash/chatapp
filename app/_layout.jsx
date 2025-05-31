import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" options={{title: "ChatApp", headerStyle:{backgroundColor: "#3e787a"}, headerShadowVisible: false}}/>
        <Stack.Screen name="chat/[id]" options={{title: "Chat 1", headerShown: true, headerStyle:{backgroundColor: "#3e787a"}, headerShadowVisible: false}}/>
        <Stack.Screen name="auth/index"/>
        <Stack.Screen name="new/index" options={{title: "Find Friends", headerShown: true, headerStyle:{backgroundColor: "#1a2f30"}, headerShadowVisible: false, headerTintColor: "#fff"}}/>
      </Stack>
    </AuthProvider>
  );
}
