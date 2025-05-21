import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BalanceCard from "../components/BalanceCard";
import AssetItem from "../components/AssetItem";
import { RootStackParamList } from "../types/assets";
import { assets } from "../data/assets";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WalletHome = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <LinearGradient
      colors={["#030728", "#050410"]}
      locations={[0, 0.2]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Image
          source={require("../assets/profile.jpg")}
          style={styles.profileImage}
        />
        <View style={styles.headerIcons}>
          <Ionicons
            name="scan-outline"
            size={24}
            color="white"
            style={styles.icon}
          />
          <Ionicons
            name="notifications-outline"
            size={24}
            color="white"
            style={styles.icon}
          />
        </View>
      </View>

      <BalanceCard />

      <View style={styles.assetsContainer}>
        <View style={styles.assetsHeader}>
          <Text style={styles.sectionTitle}>Assets</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>All Chains</Text>
            <Ionicons name="chevron-down" size={16} color="#253adb" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={assets}
          renderItem={({ item }) => (
            <AssetItem
              name={item.name}
              chain={item.chain}
              amount={item.amount}
              value={item.value}
              change={item.change}
              icon={item.icon}
              changeColor={item.changeColor}
              iconBg={item.iconBg}
              chainBg={item.chainBg}
              chainText={item.chainText}
              price={item.price}
              onPress={() => navigation.navigate("Chart", { asset: item })}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 28,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 60,
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 15,
    borderWidth: 1,
    borderColor: "gray",
    padding: 16,
    borderRadius: 50,
  },
  assetsContainer: {
    flex: 1,
  },
  assetsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dropdownText: {
    fontSize: 18,
    fontWeight: "medium",
    marginRight: 5,
    color: "#253adb",
  },
});

export default WalletHome;
