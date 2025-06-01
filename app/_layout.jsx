import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" options={{title: "ChatApp", headerStyle:{backgroundColor: "#171616"}, headerShadowVisible: false}}/>
        <Stack.Screen name="chat/[id]" options={{title: "Chat 1", headerShown: true, headerStyle:{backgroundColor: "#171616"}, headerShadowVisible: false, headerTintColor: "#eee5da"}}/>
        <Stack.Screen name="auth/index"/>
        <Stack.Screen name="new/index" options={{title: "Find Friends", headerShown: true, headerStyle:{backgroundColor: "#171616"}, headerShadowVisible: false, headerTintColor: "#eee5da"}}/>
      </Stack>
    </AuthProvider>
  );
}
