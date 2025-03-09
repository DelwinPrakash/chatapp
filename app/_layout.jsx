import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" options={{title: "ChatApp", headerShown: true, headerStyle:{backgroundColor: "#3e787a"}, headerShadowVisible: false}}/>
      <Stack.Screen name="chat/index" options={{title: "Chat 1", headerShown: true, headerStyle:{backgroundColor: "#3e787a"}, headerShadowVisible: false}}/>
    </Stack>
  );
}
