import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import TransactionItem from "../components/TransactionItem";
import { RootStackParamList } from "../types/assets";
import { transactions } from "../data/transactions";

type ChartPageRouteProp = RouteProp<RootStackParamList, "Chart">;

const ChartPage = () => {
  const navigation = useNavigation();
  const route = useRoute<ChartPageRouteProp>();
  const asset = route.params?.asset;

  if (!asset) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1A1F3A",
        }}
      >
        <Text style={{ color: "#fff" }}>Error loading asset data.</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#030728", "#050410"]}
      locations={[0, 0.5]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerLeft}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          {typeof asset.icon === "string" ? (
            <Ionicons
              name={asset.icon}
              size={24}
              color="#fff"
              style={styles.assetIcon}
            />
          ) : (
            <Image source={asset.icon} style={styles.assetIcon} />
          )}
          <Text style={styles.assetName}>{asset.name}</Text>
        </View>
        <TouchableOpacity style={styles.headerRight}>
          <Ionicons name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.chainPill}>
        <Text style={styles.chainPillText}>{asset.chain}</Text>
      </View>

      {/* Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceAmount}>
          {asset.amount} <Text style={styles.balanceSymbol}>{asset.name}</Text>
        </Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>${asset.value.replace(/\$/g, "")}</Text>
          <View style={styles.changePill}>
            <Ionicons
              name="arrow-up"
              size={14}
              color="#12C168"
              style={{ marginRight: 2 }}
            />
            <Text style={styles.changeValue}>$2,963.14</Text>
            <Text style={styles.changePercent}> ({asset.change})</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <View style={styles.actionButtonsLabelsRow}>
          <View style={styles.actionCol}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="arrow-up" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Send</Text>
          </View>
          <View style={styles.actionCol}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="arrow-down" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Receive</Text>
          </View>
          <View style={styles.actionCol}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="swap-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Swap</Text>
          </View>
        </View>
      </View>

      {/* Chart and Transactions */}
      <View style={styles.chartSection}>
        
        {/* Top horizontal line */}
        <View style={styles.horizontalLine} />

        <View style={styles.chartHeaderRow}>
          <View>
            <Text style={styles.chartValue}>{asset.price}</Text>
            <View style={styles.chartChangeRow}>
              <Text style={styles.chartPercent}>+12.05%</Text>
              <Ionicons
                name="arrow-up"
                size={14}
                color="#12C168"
                style={{ marginLeft: 2 }}
              />
            </View>
            <Text style={styles.chartDate}>29 Mar</Text>
          </View>
        </View>
        <View style={styles.chartPlaceholder}>
          {/* Chart Placeholder - will be replaced with chart later */}
        </View>

        {/* Bottom horizontal line */}
        <View style={styles.horizontalLine} />

        <View style={styles.chartTabsRow}>
          {["H", "D", "W", "M", "6M", "Y", "All"].map((tab, idx, arr) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.chartTab,
                tab === "M" && styles.chartTabActive,
                idx !== arr.length - 1 && { marginRight: 4 },
              ]}
            >
              <Text
                style={[
                  styles.chartTabText,
                  tab === "M" && styles.chartTabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.transactionsSection}>
        <View style={styles.transactionsHeaderRow}>
          <Text style={styles.transactionsTitle}>Transactions</Text>
          <TouchableOpacity>
            <Ionicons name="options-outline" size={20} color="#8B8B8B" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={transactions}
          renderItem={({ item }) => (
            <View style={styles.transactionItemContainer}>
              <TransactionItem
                type={item.type}
                to={item.to}
                amount={item.amount}
                status={item.status}
              />
            </View>
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
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  headerLeft: {
    width: 32,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  assetIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginBottom: 2,
  },
  assetName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  chainPill: {
    backgroundColor: "#23222B",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: "center",
    marginTop: 2,
  },
  chainPillText: {
    color: "#B0B6D1",
    fontSize: 13,
    fontWeight: "600",
  },
  headerRight: {
    width: 32,
    alignItems: "flex-end",
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: 8,
    marginTop: 32,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  balanceSymbol: {
    color: "#B0B6D1",
    fontSize: 32,
    fontWeight: "600",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  value: {
    color: "#8B8B8B",
    fontSize: 18,
    fontWeight: "500",
    marginRight: 8,
  },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(18,193,104,0.12)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  changeValue: {
    color: "#12C168",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 2,
  },
  changePercent: {
    color: "#12C168",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 2,
  },
  actionRow: {
    marginTop: 18,
    marginBottom: 0,
  },
  actionButtonsLabelsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    paddingHorizontal: 32,
  },
  actionCol: {
    alignItems: "center",
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 32,
    backgroundColor: "#23222B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  actionLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  chartSection: {
    backgroundColor: "transparent",
    marginTop: 20,
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#23222B",
    width: "100%",
    alignSelf: "stretch",
  },
  chartHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginTop: 16,
  },
  chartValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 0,
  },
  chartChangeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 0,
  },
  chartPercent: {
    color: "#12C168",
    fontSize: 15,
    fontWeight: "bold",
  },
  chartDate: {
    color: "#8B8B8B",
    fontSize: 13,
    marginTop: 2,
    marginBottom: 8,
  },
  chartPlaceholder: {
    width: "100%",
    height: 200,
    marginTop: 0,
    overflow: "hidden",
  },
  chartTabsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 8,
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 0,
  },
  chartTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#23222B",
  },
  chartTabActive: {
    backgroundColor: "#4468fe",
  },
  chartTabText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
  },
  chartTabTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  transactionsSection: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  transactionsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  transactionsTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "medium",
    marginBottom: 12,
  },
  transactionItemContainer: {
    backgroundColor: "#181A20",
    borderRadius: 16,
    marginBottom: 12,
    padding: 0,
    overflow: "hidden",
  },
});

export default ChartPage;
