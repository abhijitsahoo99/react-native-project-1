import React from "react";
import AppNavigator from "./navigation/AppNavigator";
import { PriceProvider } from "./context/PriceContext";

export default function App() {
  return (
    <PriceProvider>
      <AppNavigator />
    </PriceProvider>
  );
}
