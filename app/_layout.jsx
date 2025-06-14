import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from "@/context/AuthContext";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{
          headerShown: false,
        }}/>
      </AuthProvider>
    </SafeAreaProvider>
  );
}


// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';
// import { AuthProvider } from "@/context/AuthContext";

// export default function RootLayout() {
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <AuthProvider>
//       <Stack>
//         <StatusBar style="auto" />
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="auth/index" options={{title: "Login/Register", headerShown: false}}/>
//         <Stack.Screen name="+not-found" options={{title: 'Oops!(404)', headerShown: false }}/>
//       </Stack>
//     </AuthProvider>
//   );
// }