import { useAuth } from '@/context/AuthContext';
import { Link, Stack, useNavigation } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import CustomLoader from "@/components/CustomLoader";
import { useEffect } from 'react';

export default function NotFoundScreen() {
  const { user, userLoading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if(user){
      navigation.replace("(tabs)");
    }else{
      navigation.navigate("auth/index");
    }
  }, [user, userLoading])
  
  if(userLoading){
    return <CustomLoader/>
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text type="title" style={{color: "#eee5d3"}}>This screen doesn't exist.</Text>
        <Link href="/chat" style={styles.link}>
          <Text type="link">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#262424'
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    color: '#eee5d3',
  },
});
