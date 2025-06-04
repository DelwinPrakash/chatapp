import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!(404)', headerShown: false }} />
      <View style={styles.container}>
        <Text type="title" style={{color: "#eee5d3"}}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
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
