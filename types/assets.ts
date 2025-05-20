import { ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type RootStackParamList = {
  Chart: undefined;
};

export interface Asset {
  id: string;
  name: string;
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
