import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

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

  if (isLoggedIn === null) {
    return null;
  }

  return isLoggedIn ? (
    <Redirect href="/home" />
  ) : (
    <Redirect href="/LoginScreen" />
  );
}
