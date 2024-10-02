import { clientService } from "@/utils/services";
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

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loader state
  const router = useRouter();

  const handleRegister = async () => {
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
      password: password,
    };

    setLoading(true); // Show loader during registration
    try {
      const response = await clientService.post("register", data);
      if (response?.data?.status) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: response?.data?.message,
        });

        router.push("/LoginScreen");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response?.data?.message || "Registration failed",
        });
      }
    } catch (error: any) {
      console.error("API error:", error);

      if (error?.response) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.response?.data?.message || "Something went wrong",
        });
      } else if (error?.request) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No response from server. Please check the network.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Something went wrong during the request.",
        });
      }
    } finally {
      setLoading(false); // Hide loader after registration attempt
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Register</Text>

      <Text>Email:</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none" // Disable auto-capitalization for email
      />

      <Text>Password:</Text>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} /> // Loader while registering
      ) : (
        <Button title="Register" onPress={handleRegister} />
      )}
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
