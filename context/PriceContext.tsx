import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { assets } from "../data/assets";

export type Prices = { [id: string]: { usd: number } };

const PriceContext = createContext<{ prices: Prices; loading: boolean }>({
  prices: {},
  loading: true,
});

export const PriceProvider = ({ children }: { children: ReactNode }) => {
  const [prices, setPrices] = useState<Prices>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = assets.map((a) => a.coingeckoId).join(",");
        console.log("Fetching prices for IDs:", ids);
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        const data = await res.json();
        console.log("Received price data:", data);
        setPrices(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prices:", error);
        setLoading(false);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 300000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <PriceContext.Provider value={{ prices, loading }}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrices = () => useContext(PriceContext);
