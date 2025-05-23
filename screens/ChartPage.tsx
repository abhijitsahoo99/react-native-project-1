import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import TransactionItem from "../components/TransactionItem";
import { RootStackParamList } from "../types/assets";
import { transactions } from "../data/transactions";
import { usePrices } from "../context/PriceContext";
// @ts-ignore
import { AreaChart, LineChart } from "react-native-svg-charts";
// @ts-ignore
import * as shape from "d3-shape";
import { Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const TAB_OPTIONS = [
  { label: "H", days: 1, interval: "hourly" },
  { label: "D", days: 1, interval: "hourly" },
  { label: "W", days: 7, interval: "daily" },
  { label: "M", days: 30, interval: "daily" },
  { label: "6M", days: 180, interval: "daily" },
  { label: "Y", days: 365, interval: "daily" },
  { label: "All", days: "max", interval: "daily" },
];

type ChartPageRouteProp = RouteProp<RootStackParamList, "Chart">;

const Gradient = () => (
  <Defs>
    <SvgGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
      <Stop offset="0%" stopColor="#4468fe" stopOpacity={0.18} />
      <Stop offset="100%" stopColor="#0c0e26" stopOpacity={0.01} />
    </SvgGradient>
  </Defs>
);

const ChartPage = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ChartPageRouteProp>();
  const asset = route.params?.asset;
  const { prices, loading } = usePrices();

  const [selectedTab, setSelectedTab] = useState("M");
  const [chartData, setChartData] = useState<number[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
  });

  useEffect(() => {
    if (!asset) return;
    const fetchChartData = async () => {
      setLoadingChart(true);
      const tab = TAB_OPTIONS.find((t) => t.label === selectedTab);
      if (!tab) return;
      const url = `https://api.coingecko.com/api/v3/coins/${asset.coingeckoId}/market_chart?vs_currency=usd&days=${tab.days}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("Chart API response:", data);
        setChartData(data.prices ? data.prices.map((p: any) => p[1]) : []);
      } catch (e) {
        setChartData([]);
        setChartError("Error loading chart data. Please try again later.");
      }
      setLoadingChart(false);
    };
    fetchChartData();
  }, [asset?.coingeckoId, selectedTab]);

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

  // Calculate real-time value
  const currentPrice = prices[asset.coingeckoId]?.usd || 0;
  const amount = parseFloat(asset.amount);
  const realTimeValue = (currentPrice * amount).toFixed(2);
  const formattedPrice = `$${currentPrice.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const firstPrice = chartData.length > 0 ? chartData[0] : 0;
  const lastPrice = chartData.length > 0 ? chartData[chartData.length - 1] : 0;
  const percentChange = firstPrice
    ? ((lastPrice - firstPrice) / firstPrice) * 100
    : 0;
  const percentChangeColor = percentChange >= 0 ? "#12C168" : "#FF5B5B";
  const percentChangeIcon = percentChange >= 0 ? "arrow-up" : "arrow-down";

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
          <Ionicons name="sync-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.chainPill}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.chainPillText}>BEP 20</Text>
          <Text
            style={{
              marginLeft: 4,
              marginRight: 4,
              alignSelf: "center",
              color: "#A09EA8",
            }}
          >
            •
          </Text>
          <Text style={styles.chainPillText}>{asset.chain}</Text>
        </View>
      </View>

      {/* Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceAmount}>
          {asset.amount} <Text style={styles.balanceSymbol}>{asset.name}</Text>
        </Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>
            $
            {parseFloat(realTimeValue).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <View style={styles.changePill}>
            <Ionicons
              name={percentChangeIcon}
              size={14}
              color={percentChangeColor}
              style={{ marginRight: 2 }}
            />
            <Text style={[styles.changeValue, { color: percentChangeColor }]}>
              {percentChange >= 0 ? "+" : ""}$
              {Math.abs(
                parseFloat(realTimeValue) -
                  parseFloat(realTimeValue) / (1 + percentChange / 100)
              ).toFixed(2)}{" "}
              ({percentChange >= 0 ? "+" : ""}
              {percentChange.toFixed(2)}%)
            </Text>
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
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Swap", { asset: asset })}
            >
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
            <Text style={styles.chartValue}>{formattedPrice}</Text>
            <View style={styles.chartChangeRow}>
              <Text
                style={[styles.chartPercent, { color: percentChangeColor }]}
              >
                {percentChange >= 0 ? "+" : ""}
                {percentChange.toFixed(2)}%
              </Text>
              <Ionicons
                name={percentChangeIcon}
                size={14}
                color={percentChangeColor}
                style={{ marginLeft: 2, transform: [{ rotate: "45deg" }] }}
              />
            </View>
            <Text style={styles.chartDate}>{formattedDate}</Text>
          </View>
        </View>
        <View style={[styles.chartPlaceholder]}>
          {loadingChart ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#4468fe" />
            </View>
          ) : chartData.length === 0 ? (
            <Text
              style={{ color: "#FF5B5B", textAlign: "center", marginTop: 40 }}
            >
              {chartError}
            </Text>
          ) : (
            <View style={{ height: 200, width: "100%" }}>
              <AreaChart
                style={StyleSheet.absoluteFill}
                data={chartData}
                svg={{
                  fill: "url(#gradient)",
                  strokeWidth: 0, // No border for area
                }}
                contentInset={{ top: 20, bottom: 20 }}
                curve={shape.curveLinear}
              >
                <Gradient />
              </AreaChart>
              <LineChart
                style={StyleSheet.absoluteFill}
                data={chartData}
                svg={{
                  stroke: "#4468fe",
                  strokeWidth: 2,
                }}
                contentInset={{ top: 20, bottom: 20 }}
                curve={shape.curveLinear}
              />
            </View>
          )}
        </View>

        {/* Bottom horizontal line */}
        <View style={styles.horizontalLine} />

        <View style={styles.chartTabsRow}>
          {TAB_OPTIONS.map((tab, idx, arr) => (
            <TouchableOpacity
              key={tab.label}
              style={[
                styles.chartTab,
                selectedTab === tab.label && styles.chartTabActive,
                idx !== arr.length - 1 && { marginRight: 4 },
              ]}
              onPress={() => setSelectedTab(tab.label)}
            >
              <Text
                style={[
                  styles.chartTabText,
                  selectedTab === tab.label && styles.chartTabTextActive,
                ]}
              >
                {tab.label}
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
    paddingHorizontal: 16,
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
    fontWeight: "400",
    marginBottom: 2,
  },
  chainPill: {
    backgroundColor: "#2C2B34",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "center",
    marginTop: 2,
  },
  chainPillText: {
    color: "#A09EA8",
    fontSize: 14,
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
    letterSpacing: 0.64,
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
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 2,
  },
  changePercent: {
    color: "#12C168",
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },

  chartSection: {
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
    paddingHorizontal: 16,
    marginTop: 16,
  },
  chartValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 0,
    letterSpacing: 0.4,
  },
  chartChangeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 0,
  },
  chartPercent: {
    color: "#12C168",
    fontSize: 16,
    fontWeight: "medium",
    letterSpacing: 0.56,
  },
  chartDate: {
    color: "#8B8B8B",
    fontSize: 16,
    marginTop: 2,
    marginBottom: 8,
    letterSpacing: 0.56,
  },
  chartPlaceholder: {
    width: "100%",
    height: 180,
    marginTop: 0,
    overflow: "hidden",
  },
  chartTabsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
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
    fontSize: 18,
    fontWeight: "500",
  },
  chartTabTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  transactionsSection: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  transactionsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
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
