import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Asset } from "../types/assets";

type AssetItemProps = Omit<Asset, "id"> & {
  onPress: () => void;
  change24h?: number;
};

const AssetItem: React.FC<AssetItemProps> = ({
  name,
  chain,
  amount,
  value,
  change,
  icon,
  changeColor,
  iconBg,
  chainBg,
  chainText,
  price,
  onPress,
  change24h,
}) => {
  const isUp = (change24h ?? 0) >= 0;
  const change24hColor = isUp ? "#12C168" : "#FF5B5B";
  const change24hIcon = isUp ? "caret-up" : "caret-down";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        {typeof icon === "string" ? (
          <Ionicons name={icon} size={28} color="#fff" />
        ) : (
          <Image source={icon} style={styles.iconImage} />
        )}
      </View>
      <View style={styles.assetInfoCol}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.chainPill}>
            <Text style={styles.chainPillText}>{chain}</Text>
          </View>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{price}</Text>
          {change24h !== undefined && (
            <View style={styles.changeRow}>
              <Ionicons
                name={change24hIcon}
                size={13}
                color={change24hColor}
                style={{ marginRight: 2 }}
              />
              <Text style={[styles.change, { color: change24hColor }]}>
                {Math.abs(change24h).toFixed(2)}%
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.amountCol}>
        <Text style={styles.amount}>{amount}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1824",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconImage: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  assetInfoCol: {
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
    letterSpacing: 0.28,
  },
  chainPill: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#2C2B34",
  },
  chainPillText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#A09EA8",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  price: {
    color: "#B0B6D1",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 10,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  change: {
    fontSize: 14,
    fontWeight: "600",
  },
  amountCol: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 80,
  },
  amount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  value: {
    color: "#B0B6D1",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
});

export default AssetItem;
