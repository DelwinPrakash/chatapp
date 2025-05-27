import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" options={{title: "ChatApp", headerStyle:{backgroundColor: "#3e787a"}, headerShadowVisible: false}}/>
        <Stack.Screen name="chat/index" options={{title: "Chat 1", headerShown: true, headerStyle:{backgroundColor: "#3e787a"}, headerShadowVisible: false}}/>
        <Stack.Screen name="auth/index"/>
      </Stack>
    </AuthProvider>
  );
}
