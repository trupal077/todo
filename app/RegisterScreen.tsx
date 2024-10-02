import { clientService } from "@/utils/services";
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

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const handleRegister = async () => {
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
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/register.png")} // Update with your image path
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
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      )}

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity
          onPress={() => router.push("/LoginScreen")}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login</Text>
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
    backgroundColor: "#f9f9f9",
  },
  logo: {
    width: 350,
    height: 350,
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
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
  loginContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
