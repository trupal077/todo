import AsyncStorage from "@react-native-async-storage/async-storage"; // for token storage
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import LoginScreen from "./LoginScreen";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); 
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth status", error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Redirect logic based on login state
  if (isLoggedIn === null) {
    // While waiting for the async check, return `null` or some loading UI
    return null;
  }

  return isLoggedIn ? <Redirect href="/home" /> : <LoginScreen />;
}
