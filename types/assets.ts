import { ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  coingeckoId: string;
  chain: string;
  amount: string;
  value: string;
  change: string;
  icon: keyof typeof Ionicons.glyphMap | ImageSourcePropType;
  changeColor: string;
  iconBg: string;
  chainBg?: string;
  chainText: string;
  price: string;
}

export type RootStackParamList = {
  Chart: { asset: Asset };
  Swap: { asset?: Asset };
};
