import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "../types/assets";

interface SwapCardProps {
  asset: Asset;
  amount: string;
  onAmountChange: (val: string) => void;
  onAssetSelect: (asset: Asset) => void;
  assetList: Asset[];
  walletAmount: string;
  usdValue: string;
  isFrom?: boolean;
  onMaxPress?: () => void;
}

const SwapCard: React.FC<SwapCardProps> = ({
  asset,
  amount,
  onAmountChange,
  onAssetSelect,
  assetList,
  walletAmount,
  usdValue,
  isFrom = false,
  onMaxPress,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.cardWrapper}>
      {/* Top Row: Label and Wallet */}
      <View style={styles.cardTopRow}>
        <Text style={styles.labelFaded}>
          {isFrom ? "You Pay" : "You Receive"}
        </Text>
        <View style={styles.walletRow}>
          <Ionicons name="wallet-outline" size={18} color="#B0B6D1" />
          <Text style={styles.walletAmount}>
            {walletAmount} {asset.symbol.toUpperCase()}
          </Text>
          {isFrom && (
            <TouchableOpacity style={styles.maxBtn} onPress={onMaxPress}>
              <Text style={styles.maxBtnText}>Max</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Coin Row */}
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.coinInfoRow}
          onPress={() => setModalVisible(true)}
        >
          <View
            style={[
              styles.coinIconCircle,
              { backgroundColor: asset.iconBg || "#23222B" },
            ]}
          >
            {typeof asset.icon === "string" ? (
              <Ionicons name={asset.icon} size={24} color="#fff" />
            ) : (
              <Image source={asset.icon} style={styles.coinImage} />
            )}
          </View>
          <Text style={styles.coinSymbol}>{asset.symbol.toUpperCase()}</Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color="#fff"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
        <View style={styles.amountCol}>
          {isFrom ? (
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              value={amount}
              onChangeText={onAmountChange}
              placeholder="0.00"
              placeholderTextColor="#B0B6D1"
            />
          ) : (
            <Text style={styles.amountText}>{amount}</Text>
          )}
        </View>
      </View>
      <View style={styles.usdCol}>
        <Text style={styles.usdText}>{usdValue}</Text>
      </View>
      {/* Asset Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={assetList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.assetOption}
                  onPress={() => {
                    setModalVisible(false);
                    onAssetSelect(item);
                  }}
                >
                  <View
                    style={[
                      styles.coinIconCircle,
                      { backgroundColor: item.iconBg || "#23222B" },
                    ]}
                  >
                    {typeof item.icon === "string" ? (
                      <Ionicons name={item.icon} size={24} color="#fff" />
                    ) : (
                      <Image source={item.icon} style={styles.coinImage} />
                    )}
                  </View>
                  <Text style={styles.coinSymbol}>
                    {item.symbol.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: "transparent",
    borderRadius: 20,
    marginBottom: 16,
    padding: 0,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coinInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  coinIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  coinImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  coinSymbol: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  amountCol: {
    alignItems: "flex-end",
  },
  amountInput: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "right",
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
    width: 120,
  },
  amountText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "right",
    width: 120,
  },
  usdCol: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  usdText: {
    color: "#B0B6D1",
    fontSize: 14,
    fontWeight: "500",
  },
  labelFaded: {
    color: "#B0B6D1",
    fontSize: 15,
    fontWeight: "500",
  },
  walletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  walletAmount: {
    color: "#B0B6D1",
    fontSize: 15,
    fontWeight: "500",
  },
  maxBtn: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  maxBtnText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#23222B",
    borderRadius: 16,
    padding: 16,
    width: 260,
    maxHeight: 320,
  },
  assetOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#35323B",
  },
});

export default SwapCard;
