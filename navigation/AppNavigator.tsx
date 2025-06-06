import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import WalletHome from "../screens/WalletHome";
import ChartPage from "../screens/ChartPage";
import SwapPage from "../screens/SwapPage";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof MaterialIcons.glyphMap;
        if (route.name === "Home") iconName = "home";
        else if (route.name === "NFT") iconName = "image";
        else if (route.name === "History") iconName = "access-time";
        else iconName = "trending-up";
        return <MaterialIcons name={iconName} size={size + 4} color={color} />;
      },
      tabBarActiveTintColor: "#4668ff",
      tabBarInactiveTintColor: "#888888",
      tabBarStyle: {
        backgroundColor: "#050410",
        borderTopWidth: 0,
        paddingTop: 8,
        paddingBottom: 8,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={WalletHome} />
    <Tab.Screen name="NFT" component={WalletHome} />
    <Tab.Screen name="History" component={WalletHome} />
    <Tab.Screen name="Analytics" component={WalletHome} />
  </Tab.Navigator>
);
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Chart" component={ChartPage} />
      <Stack.Screen name="Swap" component={SwapPage} />
    </Stack.Navigator>
  </NavigationContainer>
);
export default AppNavigator;
