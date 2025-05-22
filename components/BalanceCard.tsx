import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/assets";

interface BalanceCardProps {
  netWorth: number;
  loading: boolean;
  overallChangePercent?: number;
}

const BalanceCard = ({
  netWorth,
  loading,
  overallChangePercent,
}: BalanceCardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Determine color and icon for overall change
  const isUp = (overallChangePercent ?? 0) >= 0;
  const changeColor = isUp ? "#85FF8F" : "#FF5B5B";
  const changeIcon = isUp ? "arrow-up" : "arrow-down";

  return (
    <View style={styles.balanceCardWrapper}>
      <LinearGradient
        colors={["#1c2486", "#171354"]}
        style={styles.balanceCard}
      >
        <Ionicons
          name="settings-outline"
          size={22}
          color="#B0B6D1"
          style={styles.balanceSettingsIcon}
        />
        <View style={styles.balanceLabelRow}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.usdBadge}>USD</Text>
        </View>
        <View style={styles.balanceRow}>
          {loading ? (
            <ActivityIndicator size="large" color="#4468fe" />
          ) : (
            <>
              <Text style={styles.balanceMain}>
                {`$${Math.floor(netWorth).toLocaleString()}`}
              </Text>
              <Text style={styles.balanceDecimal}>
                {`.${(netWorth % 1).toFixed(2).slice(2)}`}
              </Text>
            </>
          )}
        </View>
        <View style={styles.balanceChangeRow}>
          <Ionicons
            name={changeIcon}
            size={14}
            color={changeColor}
            style={{ marginRight: 2 }}
          />
          <Text style={[styles.balanceChangeValue, { color: changeColor }]}>
            {overallChangePercent !== undefined
              ? `${isUp ? "+" : ""}${overallChangePercent.toFixed(2)}%`
              : "--"}
          </Text>
        </View>
        <View style={styles.actionButtonsRow}>
          <View style={styles.actionButtonCard}>
            <Ionicons name="arrow-up" size={24} color="#fff" />
          </View>
          <View style={styles.actionButtonCard}>
            <Ionicons name="arrow-down" size={24} color="#fff" />
          </View>
          <TouchableOpacity
            style={styles.actionButtonCard}
            onPress={() => navigation.navigate("Swap", {})}
          >
            <Ionicons name="swap-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.actionButtonCard}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
          </View>
        </View>
        <View style={styles.actionLabelsRow}>
          <Text style={styles.actionLabel}>Send</Text>
          <Text style={styles.actionLabel}>Receive</Text>
          <Text style={styles.actionLabel}>Swap</Text>
          <Text style={styles.actionLabel}>More</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceCardWrapper: {
    marginTop: 16,
    marginBottom: 24,
  },
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: "relative",
  },
  balanceSettingsIcon: {
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 2,
  },
  balanceLabelRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
    gap: 4,
  },
  balanceLabel: {
    color: "#B0B6D1",
    fontSize: 20,
    fontWeight: "500",
  },
  usdBadge: {
    color: "#B0B6D1",
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: "#2B2A79",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  balanceMain: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  balanceDecimal: {
    color: "#B0B6D1",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 2,
    marginLeft: 2,
  },
  balanceChangeRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(133,255,143,0.12)",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 18,
  },
  balanceChangeValue: {
    color: "#85FF8F",
    fontSize: 16,
    fontWeight: "medium",
    marginLeft: 2,
  },
  balanceChangePercent: {
    color: "#85FF8F",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 2,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 0,
  },
  actionButtonCard: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionLabel: {
    color: "#B0B6D1",
    fontSize: 14,
    fontWeight: "500",
    width: 56,
    textAlign: "center",
  },
});

export default BalanceCard;
