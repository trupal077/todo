import React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const search = () => {
  return (
    <WebView source={{ uri: "https://www.google.com/" }} style={{ flex: 1 }} />
  );
};

export default search;

const styles = StyleSheet.create({});
