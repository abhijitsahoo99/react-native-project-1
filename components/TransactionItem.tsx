import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface TransactionItemProps {
  type: string;
  to: string;
  amount: string;
  status: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  type,
  to,
  amount,
  status,
}) => (
  <View style={styles.container}>
    <View style={styles.iconCircle}>
      <Ionicons
        name="arrow-up"
        size={24}
        color="#4468fe"
        style={{ transform: [{ rotate: "45deg" }] }}
      />
    </View>
    <View style={styles.details}>
      <View style={styles.typeRow}>
        <Text style={styles.type}>{type}</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>BEP20</Text>
        </View>
      </View>
      <Text style={styles.to}>To: {to}</Text>
    </View>
    <View style={styles.amountContainer}>
      <Text style={styles.amount}>{amount}</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1824",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1D2545",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  type: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 8,
    letterSpacing: 0.28,
  },
  pill: {
    backgroundColor: "#2C2B34",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pillText: {
    color: "#A09EA8",
    fontSize: 12,
    fontWeight: "bold",
  },
  to: {
    color: "#706F78",
    fontSize: 14,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 70,
    marginLeft: 10,
  },
  amount: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  status: {
    color: "#706F78",
    fontSize: 14,
    marginTop: 2,
  },
});

export default TransactionItem;
