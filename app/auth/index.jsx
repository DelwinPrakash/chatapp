import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";
import { ActivityIndicator } from "react-native-web";
import { useAuth } from "../../context/AuthContext";

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();
  const { user } = useAuth();
  console.log("hello",user);

  async function signInWithEmail() {
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error){
      Alert.alert(error.message)
      setError(error.message)
    }else{
      navigation.replace("index");
    }
    setLoading(false)
  }

  async function signUpWithEmail() {
    setError(null)
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error){
      Alert.alert(error.message)
      setError(error.message)
    }
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{login ? "Login" : "Sign Up"}</Text>
        <View style={styles.formContainer}>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <View>
                    <Text style={styles.togglePasswordIcon}>{showPassword ? "Hide" : "Show"}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View>
              <Text style={{ color: "red" }}>{error}</Text>
          </View>

          <TouchableOpacity style={styles.loginButton}
            onPress={() => login ? signInWithEmail() : signUpWithEmail()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>{login ? "Log in" : "Sign Up"}</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
              {login && <Text style={styles.linkText}>Forgot password?</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLogin(!login)}>
              <Text style={styles.linkText}>{login ? "Sign Up" : "Login"}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1a1a1a",
    padding: 16,
    justifyContent: "center",
  },
  innerContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 24,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    borderRadius: 8,
  },
  togglePasswordButton: {
    paddingRight: 5,
  },
  togglePasswordIcon: {
    tintColor: "#fff",
    color: "#aaa",
    position: "absolute",
    right: 5,
    bottom: -9
  },
  loginButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  linkText: {
    color: "#007AFF",
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#666",
  },
  dividerText: {
    color: "#666",
    fontSize: 14,
    marginHorizontal: 8,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#444",
    borderRadius: 8,
    padding: 14,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});