import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { assets } from "../data/assets";

export type Prices = { [id: string]: { usd: number; usd_24h_change?: number } };

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

const PriceContext = createContext<{
  prices: Prices;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
}>({
  prices: {},
  loading: true,
  error: null,
  lastUpdated: null,
  refetch: () => {},
});

export const PriceProvider = ({ children }: { children: ReactNode }) => {
  const [prices, setPrices] = useState<Prices>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = async () => {
    setLoading(true);
    setError(null);

    try {
      const ids = assets.map((a) => a.coingeckoId).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setPrices(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError("Failed to fetch prices. Please try again.");
      console.error("Error fetching prices:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <PriceContext.Provider
      value={{ prices, loading, error, lastUpdated, refetch: fetchPrices }}
    >
      {children}
    </PriceContext.Provider>
  );
};

export const usePrices = () => useContext(PriceContext);
