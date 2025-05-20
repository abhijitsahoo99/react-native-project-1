import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Asset } from "../types/assets";

type AssetItemProps = Omit<Asset, "id"> & {
  onPress: () => void;
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
}) => (
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
        <View
          style={[
            styles.chainPill,
            { backgroundColor: chainBg || "transparent" },
          ]}
        >
          <Text style={[styles.chainPillText, { color: chainText }]}>
            {chain}
          </Text>
        </View>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{price}</Text>
        <View style={styles.changeRow}>
          <Ionicons
            name={change.startsWith("-") ? "caret-down" : "caret-up"}
            size={13}
            color={changeColor}
            style={{ marginRight: 2 }}
          />
          <Text style={[styles.change, { color: changeColor }]}>
            {change.replace(/[+-]/, "")}
          </Text>
        </View>
      </View>
    </View>
    <View style={styles.amountCol}>
      <Text style={styles.amount}>{amount}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23222B",
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
  },
  chainPill: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chainPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  price: {
    color: "#B0B6D1",
    fontSize: 15,
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
    fontSize: 19,
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
