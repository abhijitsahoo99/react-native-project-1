// SwapPage.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  PanResponder,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import SwapCard from "../components/SwapCard";
import { assets as assetList } from "../data/assets";
import { Easing } from "react-native";

const fetchPrice = async (coingeckoId: string) => {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`
    );
    const data = await res.json();
    return data[coingeckoId]?.usd || 0;
  } catch {
    return 0;
  }
};

const getWalletAmount = (asset: any) => {
  return asset.amount;
};

const SwapPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [countdown, setCountdown] = useState(5);

  // Use asset from params if present, otherwise default to BTC
  const initialFromAsset =
    (route.params as any)?.asset ||
    assetList.find((a) => a.name === "Bitcoin") ||
    assetList[0];
  const [fromAsset, setFromAsset] = useState(initialFromAsset);
  const [toAsset, setToAsset] = useState(
    assetList.find((a) => a.name === "USDT") || assetList[1]
  );
  const [fromAmount, setFromAmount] = useState("0.01");
  const [toAmount, setToAmount] = useState("");
  const [fromUsd, setFromUsd] = useState("-");
  const [toUsd, setToUsd] = useState("-");
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(0);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [sliderX] = useState(new Animated.Value(0));
  const [sliding, setSliding] = useState(false);
  const sliderWidth = 280;
  const sliderCircleSize = 48;
  const slideThreshold = sliderWidth - sliderCircleSize - 8;

  // Fee calculation (0.01% of 'You Pay' USD value)
  const feePercent = 0.0001;
  const payUsd = fromPrice * parseFloat(fromAmount || "0");
  const fee = payUsd * feePercent;
  const feeDisplay = fee ? fee.toFixed(6) : "-";

  // Exchange rate display
  const rate = toPrice ? fromPrice / toPrice : 0;
  const rateDisplay = rate ? rate.toFixed(2) : "-";
  const fromSymbol = fromAsset.symbol.toUpperCase();
  const toSymbol = toAsset.symbol.toUpperCase();
  const fromUsdDisplay = fromPrice
    ? fromPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : "-";

  // PanResponder for slider
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => setSliding(true),
    onPanResponderMove: (evt, gestureState) => {
      let x = Math.max(0, Math.min(gestureState.dx, slideThreshold));
      sliderX.setValue(x);
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > slideThreshold - 10) {
        // Slide complete
        Animated.timing(sliderX, {
          toValue: slideThreshold,
          duration: 120,
          useNativeDriver: false,
          easing: Easing.linear,
        }).start(() => {
          setSliding(false);
          sliderX.setValue(0);
          handleSwap();
        });
      } else {
        // Slide not complete, reset
        Animated.timing(sliderX, {
          toValue: 0,
          duration: 180,
          useNativeDriver: false,
          easing: Easing.linear,
        }).start(() => setSliding(false));
      }
    },
  });

  // Fetch prices
  useEffect(() => {
    let isMounted = true;
    const fetchPrices = async () => {
      const fPrice = await fetchPrice(fromAsset.coingeckoId);
      const tPrice = await fetchPrice(toAsset.coingeckoId);
      if (isMounted) {
        setFromPrice(fPrice);
        setToPrice(tPrice);
      }
    };
    fetchPrices();
    return () => {
      isMounted = false;
    };
  }, [fromAsset, toAsset]);

  // Calculate USD values and toAmount
  useEffect(() => {
    if (!fromPrice || !toPrice || !fromAmount) {
      setFromUsd("-");
      setToUsd("-");
      setToAmount("");
      return;
    }
    const fromVal = parseFloat(fromAmount) * fromPrice;
    setFromUsd(
      `≈ $${fromVal.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} USD`
    );
    // Calculate toAmount based on price ratio
    const toVal = fromVal / toPrice;
    setToAmount(toVal ? toVal.toFixed(4) : "");
    setToUsd(
      `≈ $${(toVal * toPrice).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} USD`
    );
  }, [fromAmount, fromPrice, toPrice]);

  // Handle swap action
  const handleSwap = async () => {
    setSwapLoading(true);
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to Swap",
    });
    setSwapLoading(false);
    if (result.success) {
      setCountdown(5);
      setSwapSuccess(true);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timerRef.current!);
            setSwapSuccess(false);
            (navigation as any).navigate("Main", { screen: "Home" });
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Close success modal
  const closeSuccess = () => {
    setSwapSuccess(false);
    if (timerRef.current) clearInterval(timerRef.current);
    (navigation as any).navigate("Main", { screen: "Home" });
  };

  // Max button
  const handleMax = () => {
    setFromAmount(fromAsset.amount);
  };

  // Prevent selecting same asset for both
  const filteredToAssets = assetList.filter((a) => a.id !== fromAsset.id);
  const filteredFromAssets = assetList.filter((a) => a.id !== toAsset.id);

  // For slider text/arrows animation
  const sliderProgress = sliderX.interpolate({
    inputRange: [0, slideThreshold],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const arrow3Opacity = sliderProgress.interpolate({
    inputRange: [0, 0.33],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const arrow2Opacity = sliderProgress.interpolate({
    inputRange: [0.2, 0.66],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const arrow1Opacity = sliderProgress.interpolate({
    inputRange: [0.5, 0.95],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const textOpacity = sliderProgress.interpolate({
    inputRange: [0.7, 1],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Swap assets handler
  const handleAssetSwap = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
    setFromAmount(toAmount);
    // toAmount will be recalculated by useEffect
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient
        colors={["#030728", "#050410"]}
        locations={[0, 0.2]}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="time-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.swapHeader}>
            <Text style={styles.swapHeaderText}>Swap</Text>
          </View>
          <View style={styles.swapCardsWrapper}>
            <View style={styles.swapCardBg}>
              <SwapCard
                asset={fromAsset}
                amount={fromAmount}
                onAmountChange={setFromAmount}
                onAssetSelect={setFromAsset}
                assetList={filteredFromAssets}
                walletAmount={getWalletAmount(fromAsset)}
                usdValue={fromUsd}
                isFrom={true}
                onMaxPress={handleMax}
              />
            </View>
            <TouchableOpacity
              style={styles.swapIconWrapper}
              onPress={handleAssetSwap}
              activeOpacity={0.8}
            >
              <View style={styles.swapIconCircle}>
                <Ionicons name="swap-vertical" size={32} color="#ffffff" />
              </View>
            </TouchableOpacity>
            <View style={styles.swapCardBg}>
              <SwapCard
                asset={toAsset}
                amount={toAmount}
                onAmountChange={() => {}}
                onAssetSelect={setToAsset}
                assetList={filteredToAssets}
                walletAmount={getWalletAmount(toAsset)}
                usdValue={toUsd}
                isFrom={false}
              />
            </View>
          </View>

          {/* Fee and Rate Row */}
          <View style={styles.feeRow}>
            <Ionicons
              name="flame"
              size={18}
              color="#FF5B5B"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.feeText}>
              Fee: <Text style={styles.feeValue}>{feeDisplay}</Text> {toSymbol}
            </Text>
          </View>

          <View style={styles.rateRow}>
            <Ionicons
              name="time-outline"
              size={16}
              color="#B0B6D1"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.rateText}>
              1 {fromSymbol} = {rateDisplay} {toSymbol} ({fromUsdDisplay} USD)
            </Text>
          </View>

          {/* Slide to Swap */}
          <View style={styles.sliderWrapper}>
            <View style={styles.sliderTrack}>
              <Animated.View
                style={[
                  styles.sliderCircle,
                  {
                    transform: [{ translateX: sliderX }],
                    backgroundColor: "#fff",
                    shadowColor: "#4468fe",
                    shadowOffset: { width: 16, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 20,
                  },
                ]}
                {...panResponder.panHandlers}
              >
                <Ionicons name="checkmark" size={28} color="#171354" />
              </Animated.View>
              <View style={styles.sliderContent} pointerEvents="none">
                <View style={styles.sliderLeftSpace} />
                <Animated.Text
                  style={[styles.sliderText, { opacity: textOpacity }]}
                >
                  Slide to Swap
                </Animated.Text>
                <View style={styles.sliderArrows}>
                  <Animated.View style={{ opacity: arrow1Opacity }}>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#B0B6D1"
                    />
                  </Animated.View>
                  <Animated.View style={{ opacity: arrow2Opacity }}>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#B0B6D1"
                      style={{ marginLeft: -6 }}
                    />
                  </Animated.View>
                  <Animated.View style={{ opacity: arrow3Opacity }}>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#B0B6D1"
                      style={{ marginLeft: -6 }}
                    />
                  </Animated.View>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Success Modal */}
        <Modal
          visible={swapSuccess}
          transparent
          animationType="fade"
          onRequestClose={closeSuccess}
        >
          <View style={styles.successOverlay}>
            <View style={styles.successModal}>
              <TouchableOpacity
                style={styles.successClose}
                onPress={closeSuccess}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <Ionicons
                name="checkmark-circle"
                size={64}
                color="#12C168"
                style={{ marginBottom: 16 }}
              />
              <Text style={styles.successText}>Swap Successful!</Text>
              <Text style={styles.successSubText}>
                This message will close automatically in {countdown} second
                {countdown !== 1 ? "s" : ""}.
              </Text>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 28,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
  },

  iconButton: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 16,
    borderRadius: 50,
  },

  content: {
    flex: 1,
  },

  swapHeader: {
    alignItems: "center",
  },
  swapHeaderText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },

  swapCardsWrapper: {
    position: "relative",
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  swapCardBg: {
    borderRadius: 20,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1A1824",
    marginBottom: 16,
  },

  swapIconWrapper: {
    position: "absolute",
    top: "50%",
    marginTop: -32,
    alignItems: "center",
    zIndex: 2,
  },
  swapIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4468fe",
    shadowOpacity: 1,
    shadowRadius: 8,
    backgroundColor: "#000000",
  },
  swapButton: {
    marginTop: 20,
    backgroundColor: "#4468fe",
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  swapButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successModal: {
    backgroundColor: "#23222B",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: 300,
    position: "relative",
  },
  successClose: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
  },
  successText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  successSubText: {
    color: "#B0B6D1",
    fontSize: 16,
    textAlign: "center",
  },

  feeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  feeText: {
    color: "#B0B6D1",
    fontSize: 15,
    fontWeight: "500",
  },
  feeValue: {
    color: "#fff",
    fontWeight: "bold",
  },

  rateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  rateText: {
    color: "#B0B6D1",
    fontSize: 15,
    fontWeight: "500",
  },

  sliderWrapper: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4468fe",
    borderRadius: 100,
  },
  sliderTrack: {
    width: "100%",
    height: 64,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  sliderCircle: {
    position: "absolute",
    left: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sliderContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 0,
    marginRight: 0,
    width: "100%",
    paddingHorizontal: 24,
  },
  sliderLeftSpace: {
    width: 48,
    height: 1,
  },
  sliderText: {
    color: "#B0B6D1",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
  sliderArrows: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SwapPage;
