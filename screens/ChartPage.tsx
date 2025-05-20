import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ChartPage = () => {
  return (
    <View style={styles.container}>
      <Text>ChartPage</Text>
    </View>
  );
};

export default ChartPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
