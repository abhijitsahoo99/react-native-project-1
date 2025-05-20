import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WalletHome = () => {
  return (
    <View style={styles.container}>
      <Text>WalletHome</Text>
    </View>
  );
};

export default WalletHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
