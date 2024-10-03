import { clientService } from "@/utils/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router: any = useRouter();

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    // Basic validation for empty fields
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter email and password",
      });
      return;
    }

    // Email format validation
    if (!isValidEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address",
      });
      return;
    }

    // Password length validation
    if (!isValidPassword(password)) {
      Toast.show({
        type: "error",
        text1: "Weak Password",
        text2: "Password must be at least 6 characters long",
      });
      return;
    }

    const data = {
      email: email.toLowerCase(),
      password,
    };

    setLoading(true);
    try {
      const res = await clientService.post("login", data);
      if (res?.status) {
        await AsyncStorage.setItem("token", res?.data?.token);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: res?.data?.message,
        });
        router.replace("/home");
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
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/loginimage.png")}
        style={styles.logo}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={[
          styles.input,
          email && !isValidEmail(email) ? styles.errorInput : undefined,
        ]}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {email && !isValidEmail(email) && (
        <Text style={styles.errorText}>Please enter a valid email</Text>
      )}

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={[
          styles.input,
          password && !isValidPassword(password)
            ? styles.errorInput
            : undefined,
        ]}
        secureTextEntry
      />
      {password && !isValidPassword(password) && (
        <Text style={styles.errorText}>
          Password must be at least 6 characters long
        </Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      )}

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>New User?</Text>
        <TouchableOpacity
          onPress={() => router.push("/RegisterScreen")}
          style={styles.registerButton}
        >
          <Text style={styles.registerButtonText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 350, // Set appropriate width
    height: 350, // Set appropriate height
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
  registerContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
