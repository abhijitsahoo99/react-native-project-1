import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BalanceCard from "../components/BalanceCard";
import AssetItem from "../components/AssetItem";
import { RootStackParamList } from "../types/assets";
import { assets } from "../data/assets";
import { usePrices } from "../context/PriceContext";

const WalletHomeContent = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { prices, loading, error, lastUpdated, refetch } = usePrices();

  // Calculate total net worth
  const totalNetWorth = assets.reduce((sum, asset) => {
    const price = prices[asset.coingeckoId]?.usd || 0;
    return sum + price * parseFloat(asset.amount);
  }, 0);

  // Calculate overall 24h change (weighted by asset value)
  const totalValueYesterday = assets.reduce((sum, asset) => {
    const price = prices[asset.coingeckoId]?.usd || 0;
    const change24h = prices[asset.coingeckoId]?.usd_24h_change ?? 0;
    const amount = parseFloat(asset.amount);
    // Calculate yesterday's price: price / (1 + change24h/100)
    const priceYesterday = price / (1 + change24h / 100);
    return sum + priceYesterday * amount;
  }, 0);
  const overallChangePercent =
    totalValueYesterday > 0
      ? ((totalNetWorth - totalValueYesterday) / totalValueYesterday) * 100
      : 0;

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

      {/* Error state */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refetch} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading state */}
      {loading && !error ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#4468fe" />
        </View>
      ) : (
        <>
          <BalanceCard
            netWorth={totalNetWorth}
            loading={loading}
            overallChangePercent={overallChangePercent}
          />

          <View style={styles.assetsContainer}>
            <View style={styles.assetsHeader}>
              <Text style={styles.sectionTitle}>Assets</Text>
              <TouchableOpacity style={styles.dropdown}>
                <Text style={styles.dropdownText}>All Chains</Text>
                <Ionicons name="chevron-down" size={16} color="#4B56AD" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={assets}
              renderItem={({ item }) => {
                const price = prices[item.coingeckoId]?.usd || 0;
                const value = price * parseFloat(item.amount);
                const change24h = prices[item.coingeckoId]?.usd_24h_change ?? 0;
                return (
                  <AssetItem
                    {...item}
                    price={`$${price.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`}
                    value={`$${value.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`}
                    change24h={change24h}
                    onPress={() =>
                      navigation.navigate("Chart", { asset: item })
                    }
                  />
                );
              }}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </>
      )}
    </LinearGradient>
  );
};

const WalletHome = () => <WalletHomeContent />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 28,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 60,
    alignItems: "center",
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "medium",
    marginRight: 4,
    color: "#4B56AD",
  },
  errorContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  errorText: {
    color: "#FF5B5B",
    fontSize: 15,
    marginBottom: 6,
  },
  retryButton: {
    backgroundColor: "#4468fe",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default WalletHome;
