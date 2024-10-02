import { clientService } from "@/utils/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loader state
  const router: any = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter email and password",
      });
      return;
    }
    const data = {
      email: email.toLowerCase(),
      password,
    };

    setLoading(true); // Show loader during login
    try {
      const res = await clientService.post("login", data);
      if (res?.status) {
        AsyncStorage.setItem("token", res?.data?.token);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: res?.data?.message,
        });
        router.push("/home");
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: res?.data?.message || "Invalid email or password",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false); // Hide loader after login attempt
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none" // Ensure the email is not auto-capitalized
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} /> // Loader while logging in
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      <View style={{ marginVertical: 20 }}>
        <Button
          title="Register"
          onPress={() => router.push("/RegisterScreen")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
});
