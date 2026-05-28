import { useEffect, useRef, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  CheckCircle2, 
  Play, 
  Flame, 
  Coins,
  Maximize2,
  Minimize2,
  Search
} from "lucide-react";

interface TradingViewWidgetProps {
  showConsole: boolean;
  onShowConsoleChange: (val: boolean) => void;
  practiceBalance: number;
  onBalanceChange: (newBal: number) => void;
  isWide?: boolean;
  onToggleWide?: () => void;
}

interface Position {
  id: string;
  symbol: string;
  symbolLabel: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  size: number; // lots or units
  timestamp: string;
}

// Config for real-time premium feed simulation across all primary TradingView markets
const ASSET_CONFIGS: Record<string, { basePrice: number; multiplier: number; decimals: number; pipStep: number }> = {
  // Forex
  "FX:EURUSD": { basePrice: 1.08450, multiplier: 100000, decimals: 5, pipStep: 0.0001 },
  "OANDA:EURUSD": { basePrice: 1.08455, multiplier: 100000, decimals: 5, pipStep: 0.0001 },
  "FX:GBPUSD": { basePrice: 1.25820, multiplier: 100000, decimals: 5, pipStep: 0.0001 },
  "OANDA:GBPUSD": { basePrice: 1.25825, multiplier: 100000, decimals: 5, pipStep: 0.0001 },
  "FX:USDJPY": { basePrice: 156.42, multiplier: 100000, decimals: 3, pipStep: 0.01 },
  "OANDA:USDJPY": { basePrice: 156.44, multiplier: 100000, decimals: 3, pipStep: 0.01 },
  "FX:AUDUSD": { basePrice: 0.66510, multiplier: 100000, decimals: 5, pipStep: 0.0001 },
  "OANDA:AUDUSD": { basePrice: 0.66515, multiplier: 100000, decimals: 5, pipStep: 0.0001 },
  "OANDA:GBPJPY": { basePrice: 198.50, multiplier: 100000, decimals: 3, pipStep: 0.01 },
  "OANDA:USDCAD": { basePrice: 1.36230, multiplier: 100000, decimals: 5, pipStep: 0.0001 },
  "OANDA:USDCHF": { basePrice: 0.91120, multiplier: 100000, decimals: 5, pipStep: 0.0001 },
  "OANDA:EURGBP": { basePrice: 0.85240, multiplier: 100000, decimals: 5, pipStep: 0.0001 },
  
  // Cryptocurrencies (Crypto)
  "BINANCE:BTCUSDT": { basePrice: 67540.0, multiplier: 1, decimals: 2, pipStep: 1.0 },
  "BITSTAMP:BTCUSD": { basePrice: 67530.0, multiplier: 1, decimals: 2, pipStep: 1.0 },
  "BITSTAMP:ETHUSD": { basePrice: 3540.0, multiplier: 1, decimals: 2, pipStep: 0.1 },
  "BINANCE:ETHUSDT": { basePrice: 3540.5, multiplier: 1, decimals: 2, pipStep: 0.1 },
  "BINANCE:SOLUSDT": { basePrice: 174.20, multiplier: 1, decimals: 2, pipStep: 0.05 },
  "BINANCE:BNBUSDT": { basePrice: 592.80, multiplier: 1, decimals: 2, pipStep: 0.1 },
  "BINANCE:XRPUSDT": { basePrice: 0.5210, multiplier: 1000, decimals: 4, pipStep: 0.0001 },
  "BINANCE:DOGEUSDT": { basePrice: 0.1520, multiplier: 1000, decimals: 4, pipStep: 0.0001 },
  "BINANCE:ADAUSDT": { basePrice: 0.4850, multiplier: 1000, decimals: 4, pipStep: 0.0001 },

  // Commodities (Komoditas)
  "PYTH:XAUUSD": { basePrice: 2415.50, multiplier: 100, decimals: 2, pipStep: 0.10 },
  "OANDA:XAUUSD": { basePrice: 2415.40, multiplier: 100, decimals: 2, pipStep: 0.10 },
  "OANDA:XAGUSD": { basePrice: 30.50, multiplier: 50, decimals: 2, pipStep: 0.01 },
  "TVC:USOIL": { basePrice: 78.20, multiplier: 100, decimals: 2, pipStep: 0.01 },
  "TVC:UKOIL": { basePrice: 82.50, multiplier: 100, decimals: 2, pipStep: 0.01 },

  // Stock Indices (Indeks)
  "SP:SPX": { basePrice: 5290.50, multiplier: 10, decimals: 2, pipStep: 0.50 },
  "NASDAQ:IXIC": { basePrice: 18620.00, multiplier: 10, decimals: 2, pipStep: 1.0 },
  "DJ:DJI": { basePrice: 39120.00, multiplier: 10, decimals: 1, pipStep: 1.0 },
  "INDEX:DAX": { basePrice: 18450.00, multiplier: 10, decimals: 1, pipStep: 1.0 },
  "TSE:NI225": { basePrice: 38500.00, multiplier: 10, decimals: 1, pipStep: 1.0 },

  // Major Global Stocks (Saham)
  "IDX:BBCA": { basePrice: 9475.0, multiplier: 10, decimals: 1, pipStep: 25.0 },
  "IDX:BBRI": { basePrice: 4720.0, multiplier: 10, decimals: 1, pipStep: 10.0 },
  "IDX:BBNI": { basePrice: 4500.0, multiplier: 10, decimals: 1, pipStep: 10.0 },
  "IDX:TLKM": { basePrice: 3210.0, multiplier: 10, decimals: 1, pipStep: 10.0 },
  "IDX:ASII": { basePrice: 4620.0, multiplier: 10, decimals: 1, pipStep: 10.0 },
  "NASDAQ:TSLA": { basePrice: 179.20, multiplier: 10, decimals: 2, pipStep: 0.05 },
  "NASDAQ:NVDA": { basePrice: 948.50, multiplier: 10, decimals: 2, pipStep: 0.10 },
  "NASDAQ:AAPL": { basePrice: 189.80, multiplier: 10, decimals: 2, pipStep: 0.05 },
  "NASDAQ:MSFT": { basePrice: 421.30, multiplier: 10, decimals: 2, pipStep: 0.05 },
  "NASDAQ:GOOGL": { basePrice: 175.40, multiplier: 10, decimals: 2, pipStep: 0.05 },
  "NASDAQ:META": { basePrice: 472.20, multiplier: 10, decimals: 2, pipStep: 0.10 },

  // Funds / Futures / Bonds/ Economy (New Categories for rich listing matching the screenshot)
  "AMEX:VOO": { basePrice: 485.40, multiplier: 10, decimals: 2, pipStep: 0.10 },
  "AMEX:QQQ": { basePrice: 442.20, multiplier: 10, decimals: 2, pipStep: 0.10 },
  "CME:ES1!": { basePrice: 5310.25, multiplier: 50, decimals: 2, pipStep: 0.25 },
  "NYMEX:CL1!": { basePrice: 78.40, multiplier: 100, decimals: 2, pipStep: 0.01 },
  "TVC:US10Y": { basePrice: 4.425, multiplier: 1000, decimals: 3, pipStep: 0.001 },
  "TVC:ID10Y": { basePrice: 6.850, multiplier: 1000, decimals: 3, pipStep: 0.001 },
  "ECONOMY:USIR": { basePrice: 5.50, multiplier: 1, decimals: 2, pipStep: 0.01 },
  "ECONOMY:IDGNP": { basePrice: 5.11, multiplier: 1, decimals: 2, pipStep: 0.01 },
  "CBOE:SPXW": { basePrice: 12.50, multiplier: 100, decimals: 2, pipStep: 0.05 }
};

interface TVSymbol {
  symbol: string;
  ticker: string;
  label: string;
  category: string;
  exchange: string;
  exchangeSub: string;
  iconType: string;
}

const ALL_SYMBOLS: TVSymbol[] = [
  // Crypto
  { symbol: "BITSTAMP:BTCUSD", ticker: "BTCUSD", label: "Bitcoin / U.S. dollar", category: "Crypto", exchange: "BITSTAMP", exchangeSub: "spot crypto defi", iconType: "BTC" },
  { symbol: "OANDA:USDJPY", ticker: "USDJPY", label: "USD / JPY", category: "Forex", exchange: "OANDA", exchangeSub: "forex", iconType: "USDJPY" },
  { symbol: "PYTH:XAUUSD", ticker: "XAUUSD", label: "GOLD / US DOLLAR", category: "Komoditas", exchange: "PYTH", exchangeSub: "commodity crypto oracle", iconType: "GOLD" },
  { symbol: "OANDA:EURUSD", ticker: "EURUSD", label: "EUR / USD", category: "Forex", exchange: "OANDA", exchangeSub: "forex", iconType: "EURUSD" },
  { symbol: "FX:USDJPY", ticker: "USDJPY", label: "US Dollar/Japanese Yen", category: "Forex", exchange: "FX", exchangeSub: "forex", iconType: "USDJPY" },
  { symbol: "OANDA:AUDUSD", ticker: "AUDUSD", label: "AUD / USD", category: "Forex", exchange: "OANDA", exchangeSub: "forex", iconType: "AUDUSD" },
  { symbol: "OANDA:XAUUSD", ticker: "XAUUSD", label: "Gold", category: "Komoditas", exchange: "OANDA", exchangeSub: "commodity cfd", iconType: "GOLD" },
  { symbol: "OANDA:GBPJPY", ticker: "GBPJPY", label: "GBP / JPY", category: "Forex", exchange: "OANDA", exchangeSub: "forex", iconType: "GBPJPY" },
  { symbol: "IDX:BBCA", ticker: "BBCA", label: "PT Bank Central Asia Tbk", category: "Saham", exchange: "IDX", exchangeSub: "stock", iconType: "BBCA" },
  { symbol: "BINANCE:BTCUSDT", ticker: "BTCUSDT", label: "Bitcoin / TetherUS", category: "Crypto", exchange: "BINANCE", exchangeSub: "spot crypto defi", iconType: "BTC" },
  { symbol: "BITSTAMP:ETHUSD", ticker: "ETHUSD", label: "Ethereum / U.S. dollar", category: "Crypto", exchange: "BITSTAMP", exchangeSub: "spot crypto defi", iconType: "ETH" },
  { symbol: "BINANCE:ETHUSDT", ticker: "ETHUSDT", label: "Ethereum / TetherUS", category: "Crypto", exchange: "BINANCE", exchangeSub: "spot crypto defi", iconType: "ETH" },
  { symbol: "BINANCE:SOLUSDT", ticker: "SOLUSDT", label: "Solana / TetherUS", category: "Crypto", exchange: "BINANCE", exchangeSub: "spot crypto defi", iconType: "SOL" },
  { symbol: "BINANCE:BNBUSDT", ticker: "BNBUSDT", label: "BNB / TetherUS", category: "Crypto", exchange: "BINANCE", exchangeSub: "spot crypto defi", iconType: "BNB" },

  // Forex additional
  { symbol: "FX:GBPUSD", ticker: "GBPUSD", label: "GBP / USD", category: "Forex", exchange: "FX", exchangeSub: "forex", iconType: "GBPUSD" },
  { symbol: "OANDA:USDCAD", ticker: "USDCAD", label: "USD / CAD", category: "Forex", exchange: "OANDA", exchangeSub: "forex", iconType: "USDCAD" },
  { symbol: "OANDA:USDCHF", ticker: "USDCHF", label: "USD / CHF", category: "Forex", exchange: "OANDA", exchangeSub: "forex", iconType: "USDCHF" },
  { symbol: "OANDA:EURGBP", ticker: "EURGBP", label: "EUR / GBP", category: "Forex", exchange: "OANDA", exchangeSub: "forex", iconType: "EURGBP" },

  // Commodities additional
  { symbol: "OANDA:XAGUSD", ticker: "XAGUSD", label: "Perak / Silver", category: "Komoditas", exchange: "OANDA", exchangeSub: "commodity cfd", iconType: "SILVER" },
  { symbol: "TVC:USOIL", ticker: "USOIL", label: "Minyak US (USOil)", category: "Komoditas", exchange: "TVC", exchangeSub: "commodity cfd", iconType: "OIL" },
  { symbol: "TVC:UKOIL", ticker: "UKOIL", label: "Minyak Brent (UKOil)", category: "Komoditas", exchange: "TVC", exchangeSub: "commodity cfd", iconType: "OIL" },

  // Stock Indices
  { symbol: "SP:SPX", ticker: "SPX", label: "S&P 500 Index", category: "Indeks", exchange: "SP", exchangeSub: "index cfd", iconType: "SP" },
  { symbol: "NASDAQ:IXIC", ticker: "IXIC", label: "NASDAQ 100", category: "Indeks", exchange: "NASDAQ", exchangeSub: "index cfd", iconType: "IXIC" },
  { symbol: "DJ:DJI", ticker: "DJI", label: "Dow Jones 30", category: "Indeks", exchange: "DJ", exchangeSub: "index cfd", iconType: "DJ" },
  { symbol: "INDEX:DAX", ticker: "DAX", label: "DAX 40 Jerman", category: "Indeks", exchange: "INDEX", exchangeSub: "index cfd", iconType: "INDEX" },
  { symbol: "TSE:NI225", ticker: "NI225", label: "Nikkei 225", category: "Indeks", exchange: "TSE", exchangeSub: "index", iconType: "TSE" },

  // Saham Additional (IDX + US)
  { symbol: "IDX:BBRI", ticker: "BBRI", label: "PT Bank Rakyat Indonesia Tbk", category: "Saham", exchange: "IDX", exchangeSub: "stock", iconType: "BBRI" },
  { symbol: "IDX:BBNI", ticker: "BBNI", label: "PT Bank Negara Indonesia Tbk", category: "Saham", exchange: "IDX", exchangeSub: "stock", iconType: "BBNI" },
  { symbol: "IDX:TLKM", ticker: "TLKM", label: "PT Telkom Indonesia Tbk", category: "Saham", exchange: "IDX", exchangeSub: "stock", iconType: "TLKM" },
  { symbol: "IDX:ASII", ticker: "ASII", label: "PT Astra International Tbk", category: "Saham", exchange: "IDX", exchangeSub: "stock", iconType: "ASII" },
  { symbol: "NASDAQ:TSLA", ticker: "TSLA", label: "Tesla Inc", category: "Saham", exchange: "NASDAQ", exchangeSub: "stock", iconType: "TSLA" },
  { symbol: "NASDAQ:NVDA", ticker: "NVDA", label: "NVIDIA Corp", category: "Saham", exchange: "NASDAQ", exchangeSub: "stock", iconType: "NVDA" },
  { symbol: "NASDAQ:AAPL", ticker: "AAPL", label: "Apple Inc", category: "Saham", exchange: "NASDAQ", exchangeSub: "stock", iconType: "AAPL" },
  { symbol: "NASDAQ:MSFT", ticker: "MSFT", label: "Microsoft Corp", category: "Saham", exchange: "NASDAQ", exchangeSub: "stock", iconType: "MSFT" },
  { symbol: "NASDAQ:GOOGL", ticker: "GOOGL", label: "Alphabet Inc", category: "Saham", exchange: "NASDAQ", exchangeSub: "stock", iconType: "GOOGL" },
  { symbol: "NASDAQ:META", ticker: "META", label: "Meta Platforms Inc", category: "Saham", exchange: "NASDAQ", exchangeSub: "stock", iconType: "META" },

  // Dana / ETFs
  { symbol: "AMEX:VOO", ticker: "VOO", label: "Vanguard S&P 500 ETF", category: "Dana", exchange: "AMEX", exchangeSub: "fund etf", iconType: "VOO" },
  { symbol: "AMEX:QQQ", ticker: "QQQ", label: "Invesco QQQ Trust ETF", category: "Dana", exchange: "AMEX", exchangeSub: "fund etf", iconType: "QQQ" },

  // Kontrak Berjangka / Futures
  { symbol: "CME:ES1!", ticker: "ES1!", label: "E-mini S&P 550 Futures", category: "Kontrak Berjangka", exchange: "CME", exchangeSub: "futures cfd", iconType: "ES1" },
  { symbol: "NYMEX:CL1!", ticker: "CL1!", label: "Minyak US Crude Futures", category: "Kontrak Berjangka", exchange: "NYMEX", exchangeSub: "futures energy", iconType: "OIL" },

  // Obligasi / Bonds
  { symbol: "TVC:US10Y", ticker: "US10Y", label: "Imbal Hasil AS 10-Tahun", category: "Obligasi", exchange: "TVC", exchangeSub: "bond yields", iconType: "US10Y" },
  { symbol: "TVC:ID10Y", ticker: "ID10Y", label: "Indonesia 10Y Government Bond", category: "Obligasi", exchange: "TVC", exchangeSub: "bond yields", iconType: "ID10Y" },

  // Ekonomi
  { symbol: "ECONOMY:USIR", ticker: "USIR", label: "Suku Bunga Federal AS", category: "Ekonomi", exchange: "ECONOMY", exchangeSub: "economy rates", iconType: "USIR" },
  { symbol: "ECONOMY:IDGNP", ticker: "IDGNP", label: "Pertumbuhan GDP Riil Indonesia", category: "Ekonomi", exchange: "ECONOMY", exchangeSub: "economy metrics", iconType: "IDGNP" },

  // Opsi
  { symbol: "CBOE:SPXW", ticker: "SPXW", label: "SPX S&P500 Index Weekly Options", category: "Opsi", exchange: "CBOE", exchangeSub: "index options", iconType: "SPXW" }
];

export default function TradingViewWidget({ 
  showConsole, 
  onShowConsoleChange, 
  practiceBalance, 
  onBalanceChange,
  isWide = false,
  onToggleWide
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSymbol, setSelectedSymbol] = useState("BITSTAMP:BTCUSD");
  const [activeCategory, setActiveCategory] = useState("Crypto");

  const [searchQuery, setSearchQuery] = useState("");
  const [customSymbols, setCustomSymbols] = useState<TVSymbol[]>(() => {
    const saved = localStorage.getItem("exnees_custom_user_symbols");
    return saved ? JSON.parse(saved) : [];
  });

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalActiveCategory, setModalActiveCategory] = useState("Seluruhnya");

  const symbols = [...ALL_SYMBOLS, ...customSymbols];
  
  // High fidelity visual flag/emblem graphics as shown in the TradingView popup!
  const renderVisualBadge = (iconType: string, ticker: string) => {
    switch (iconType) {
      case "EURUSD":
        return (
          <div className="flex -space-x-1.5 items-center justify-center h-5 w-5 shrink-0 select-none">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-neutral-900 flex items-center justify-center text-[7px] text-white font-bold select-none">🇪🇺</div>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-neutral-900 flex items-center justify-center text-[7px] text-black font-bold select-none">🇺🇸</div>
          </div>
        );
      case "GBPUSD":
        return (
          <div className="flex -space-x-1.5 items-center justify-center h-5 w-5 shrink-0 select-none">
            <div className="w-3.5 h-3.5 rounded-full bg-indigo-700 border border-neutral-900 flex items-center justify-center text-[7px] text-white font-bold select-none">🇬🇧</div>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-neutral-900 flex items-center justify-center text-[7px] text-black font-bold select-none">🇺🇸</div>
          </div>
        );
      case "USDJPY":
        return (
          <div className="flex -space-x-1.5 items-center justify-center h-5 w-5 shrink-0 select-none">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-neutral-900 flex items-center justify-center text-[7px] text-black font-bold select-none">🇺🇸</div>
            <div className="w-3.5 h-3.5 rounded-full bg-white border border-neutral-900 flex items-center justify-center text-[7px] text-red-600 font-bold select-none">🇯🇵</div>
          </div>
        );
      case "AUDUSD":
        return (
          <div className="flex -space-x-1.5 items-center justify-center h-5 w-5 shrink-0 select-none">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-900 border border-neutral-900 flex items-center justify-center text-[7px] text-white font-bold select-none">🇦🇺</div>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-neutral-900 flex items-center justify-center text-[7px] text-black font-bold select-none">🇺🇸</div>
          </div>
        );
      case "GBPJPY":
        return (
          <div className="flex -space-x-1.5 items-center justify-center h-5 w-5 shrink-0 select-none">
            <div className="w-3.5 h-3.5 rounded-full bg-indigo-700 border border-neutral-900 flex items-center justify-center text-[7px] text-white font-bold select-none">🇬🇧</div>
            <div className="w-3.5 h-3.5 rounded-full bg-white border border-neutral-900 flex items-center justify-center text-[7px] text-red-600 font-bold select-none">🇯🇵</div>
          </div>
        );
      case "USDCAD":
        return (
          <div className="flex -space-x-1.5 items-center justify-center h-5 w-5 shrink-0 select-none">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-neutral-900 flex items-center justify-center text-[7px] text-black font-bold select-none">🇺🇸</div>
            <div className="w-3.5 h-3.5 rounded-full bg-red-600 border border-neutral-900 flex items-center justify-center text-[7px] text-white font-bold select-none">🇨🇦</div>
          </div>
        );
      case "BTC":
        return (
          <div className="w-5 h-5 rounded-full bg-[#f7931a]/15 text-[#f7931a] flex items-center justify-center font-bold text-[10px] border border-[#f7931a]/30 select-none font-mono">
            ₿
          </div>
        );
      case "ETH":
        return (
          <div className="w-5 h-5 rounded-full bg-[#627eea]/15 text-[#627eea] flex items-center justify-center font-bold text-[10px] border border-[#627eea]/30 select-none font-mono">
            Ξ
          </div>
        );
      case "SOL":
        return (
          <div className="w-5 h-5 rounded-full bg-[#14f195]/15 text-[#14f195] flex items-center justify-center font-bold text-[9px] border border-[#14f195]/30 select-none font-mono">
            S
          </div>
        );
      case "BNB":
        return (
          <div className="w-5 h-5 rounded-full bg-[#f3ba2f]/15 text-[#f3ba2f] flex items-center justify-center font-bold text-[9px] border border-[#f3ba2f]/30 select-none font-mono">
            B
          </div>
        );
      case "GOLD":
        return (
          <div className="w-5 h-5 rounded-full bg-[#e5c158]/15 text-[#e5c158] flex items-center justify-center font-bold text-[8px] border border-[#e5c158]/30 select-none font-mono">
            AU
          </div>
        );
      case "SILVER":
        return (
          <div className="w-5 h-5 rounded-full bg-[#a6a9b6]/15 text-[#a6a9b6] flex items-center justify-center font-bold text-[8px] border border-[#a6a9b6]/30 select-none font-mono">
            AG
          </div>
        );
      case "OIL":
        return (
          <div className="w-5 h-5 rounded-full bg-[#FFB100]/5 text-[#FFB100] flex items-center justify-center font-bold text-[8px] border border-[#FFB100]/20 select-none font-mono">
            🛢️
          </div>
        );
      case "BBCA":
      case "BBRI":
      case "BBNI":
      case "TLKM":
      case "ASII":
        return (
          <div className="w-5 h-5 rounded-full border border-white/10 flex flex-col items-center justify-center overflow-hidden shrink-0 select-none">
            <div className="w-full h-[50%] bg-[#e52a32]" />
            <div className="w-full h-[50%] bg-white" />
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 flex items-center justify-center font-sans font-black text-[8px] uppercase select-none">
            {ticker.substring(0, 2)}
          </div>
        );
    }
  };


  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const filtered = symbols.filter((s) => s.category === category);
    if (filtered.length > 0) {
      setSelectedSymbol(filtered[0].symbol);
    }
  };

  const handleAddNewSymbol = (tickerCode: string) => {
    const formatted = tickerCode.trim().toUpperCase();
    if (!formatted) return;

    // Check if it already exists
    const exists = symbols.find((s) => s.symbol.toUpperCase() === formatted);
    if (!exists) {
      const parts = formatted.split(":");
      let exchangeName = "KUSTOM";
      let tickerName = formatted;
      if (parts.length > 1) {
        exchangeName = parts[0];
        tickerName = parts[1];
      }
      
      const newCustomItem: TVSymbol = {
        symbol: formatted,
        ticker: tickerName,
        label: tickerName,
        category: "Kustom",
        exchange: exchangeName,
        exchangeSub: "custom user asset",
        iconType: tickerName
      };

      const updated = [...customSymbols, newCustomItem];
      setCustomSymbols(updated);
      localStorage.setItem("exnees_custom_user_symbols", JSON.stringify(updated));
      setActiveCategory("Kustom");
      setSelectedSymbol(formatted);
    } else {
      setActiveCategory(exists.category);
      setSelectedSymbol(exists.symbol);
    }
    setSearchQuery("");
    setModalSearchQuery("");
    setIsSearchModalOpen(false);
  };

  // Live prices for ALL symbols to calculate running position P&Ls continuously
  const [livePrices, setLivePrices] = useState<Record<string, number>>(() => {
    const initPrices: Record<string, number> = {};
    Object.entries(ASSET_CONFIGS).forEach(([key, conf]) => {
      initPrices[key] = conf.basePrice;
    });
    return initPrices;
  });

  // LOT size selector state
  const [tradeSize, setTradeSize] = useState<number>(1.0);
  
  // Custom alerts state
  const [tradeAlert, setTradeAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load positions from localStorage to avoid session wiped out on reload
  const [positions, setPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem("exnees_open_positions");
    return saved ? JSON.parse(saved) : [];
  });

  // Save positions
  useEffect(() => {
    localStorage.setItem("exnees_open_positions", JSON.stringify(positions));
  }, [positions]);

  // EMBED TRADINGVIEW CHART SCRIPT WITH GRACEFUL IFRAME CLEANUP
  useEffect(() => {
    if (!containerRef.current) return;

    // Gracefully shut down existing iframes to release their contentWindow threads
    const activeIframes = containerRef.current.querySelectorAll("iframe");
    activeIframes.forEach((iframe) => {
      try {
        iframe.src = "about:blank";
      } catch (e) {
        // Suppress cross-origin security context details
      }
    });

    // Clear previous widget
    containerRef.current.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.id = "tradingview_chart_embed";
    widgetDiv.className = "w-full h-full";
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: selectedSymbol,
      interval: "1",
      timezone: "Asia/Jakarta",
      theme: "dark",
      style: "1",
      locale: "id",
      enable_publishing: false,
      allow_symbol_change: false,
      calendar: true,
      hide_side_toolbar: false,
      show_popup_button: false,
      support_host: "https://www.tradingview.com"
    });

    widgetDiv.appendChild(script);

    return () => {
      if (containerRef.current) {
        const iframes = containerRef.current.querySelectorAll("iframe");
        iframes.forEach((iframe) => {
          try {
            iframe.src = "about:blank";
          } catch (e) {
            // Silently swallow cross-boundary violations
          }
        });
        containerRef.current.innerHTML = "";
      }
    };
  }, [selectedSymbol]);

  // LIVE TICK FLUCTUATION REACTION LOOP
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices((prev) => {
        const next = { ...prev };
        
        // Loop over predefined configurations
        Object.entries(ASSET_CONFIGS).forEach(([sym, config]) => {
          const current = prev[sym] || config.basePrice;
          const direction = Math.random() > 0.49 ? 1 : -1;
          const scale = Math.random() * 3 + 1; // 1-4 units of movement
          const swing = direction * config.pipStep * scale;
          
          next[sym] = parseFloat((current + swing).toFixed(config.decimals));
        });

        // Also update any custom selected symbols dynamically so prices don't break
        const dynamicSymbols = [selectedSymbol, ...positions.map(p => p.symbol), ...customSymbols.map(c => c.symbol)];
        dynamicSymbols.forEach((sym) => {
          if (ASSET_CONFIGS[sym]) return; // already updated in the loop above
          
          // Generate realistic placeholder values for newly added ticker symbols
          const isLargeVal = sym.includes("BTC") || sym.includes("ETH") || sym.includes("GOLD") || sym.includes("SPX");
          const fallbackBase = isLargeVal ? 3000.0 : 150.0;
          const current = prev[sym] || fallbackBase;
          const direction = Math.random() > 0.49 ? 1 : -1;
          const pipStep = isLargeVal ? 1.0 : 0.05;
          const swing = direction * pipStep * (Math.random() * 3 + 1);
          
          next[sym] = parseFloat((current + swing).toFixed(2));
        });

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSymbol, positions, customSymbols]);

  // Handle Trade Execution
  const executeTrade = (type: "BUY" | "SELL") => {
    const config = ASSET_CONFIGS[selectedSymbol] || { basePrice: 150.0, multiplier: 10, decimals: 2, pipStep: 0.05 };
    const currentPrice = livePrices[selectedSymbol] || config.basePrice;
    const activeSymbolLabel = symbols.find((s) => s.symbol === selectedSymbol)?.label || selectedSymbol;

    // Minimum trading risk prevention checks
    if (tradeSize <= 0) {
      setTradeAlert({ type: "error", text: "Ukuran transaksi harus lebih besar dari 0!" });
      return;
    }

    const newPosition: Position = {
      id: Math.random().toString(36).substring(2, 9),
      symbol: selectedSymbol,
      symbolLabel: activeSymbolLabel,
      type,
      entryPrice: currentPrice,
      size: tradeSize,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setPositions((prev) => [newPosition, ...prev]);
    setTradeAlert({
      type: "success",
      text: `Order ${type} sebanyak ${tradeSize} Lot di harga ${currentPrice} berhasil terpasang!`,
    });

    // Auto dismiss alert
    setTimeout(() => setTradeAlert(null), 4000);
  };

  // Close Specific Position and update practiceBalance in real-time
  const closePosition = (pos: Position) => {
    const currentPrice = livePrices[pos.symbol] || pos.entryPrice;
    const config = ASSET_CONFIGS[pos.symbol];
    
    // Formula for Floating Profit in Forex & Crypto Contract sizes
    const priceDiff = currentPrice - pos.entryPrice;
    const directionMultiplier = pos.type === "BUY" ? 1 : -1;
    const contractMultiplier = config.multiplier;
    const floatingProfit = parseFloat((priceDiff * pos.size * directionMultiplier * contractMultiplier).toFixed(2));

    const finalBalance = parseFloat((practiceBalance + floatingProfit).toFixed(2));
    onBalanceChange(finalBalance);

    // Filter out position
    setPositions((prev) => prev.filter((p) => p.id !== pos.id));

    setTradeAlert({
      type: "success",
      text: `Posisi ${pos.type} ${pos.symbolLabel} ditutup! Hasil simulasi: ${floatingProfit >= 0 ? "+" : ""}$${floatingProfit.toLocaleString("id-ID")}`,
    });

    setTimeout(() => setTradeAlert(null), 4000);
  };

  // Calculate Cumulative positions P&L and total margin
  const calculateTotalPNL = () => {
    let total = 0;
    positions.forEach((pos) => {
      const currentPrice = livePrices[pos.symbol] || pos.entryPrice;
      const config = ASSET_CONFIGS[pos.symbol];
      if (!config) return;
      const priceDiff = currentPrice - pos.entryPrice;
      const directionMultiplier = pos.type === "BUY" ? 1 : -1;
      const contractMultiplier = config.multiplier;
      total += priceDiff * pos.size * directionMultiplier * contractMultiplier;
    });
    return parseFloat(total.toFixed(2));
  };

  const cumulativePNL = calculateTotalPNL();
  const currentSymbolConfig = ASSET_CONFIGS[selectedSymbol] || { basePrice: 150.0, multiplier: 10, decimals: 2, pipStep: 0.05 };
  const currentSymbolPrice = livePrices[selectedSymbol] || currentSymbolConfig.basePrice;
  const currentDecimals = currentSymbolConfig.decimals;

  // Filter symbols for quick quick pills hotbar (inline tab selector)
  const filteredSymbolsForDisplay = symbols.filter(item => item.category === activeCategory);

  // Filter symbols for advanced full modal overlay
  const modalFilteredSymbols = symbols.filter(item => {
    // Text search query matching ticker, label, exchange or exchange sub category
    const query = modalSearchQuery.trim().toLowerCase();
    const matchesText = !query || 
      item.symbol.toLowerCase().includes(query) ||
      item.ticker.toLowerCase().includes(query) ||
      item.label.toLowerCase().includes(query) ||
      item.exchange.toLowerCase().includes(query) ||
      item.exchangeSub.toLowerCase().includes(query);
      
    if (!matchesText) return false;

    // Category pill filter
    if (modalActiveCategory === "Seluruhnya") return true;
    return item.category === modalActiveCategory;
  });

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#141414] border border-white/5 overflow-hidden shadow-2xl relative" id="tradingview-container-card">
      
      {/* GORGEOUS NATIVE TRADINGVIEW STYLE SYMBOL SEARCH MODAL OVERLAY */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-[6px] z-50 flex items-center justify-center p-4 transition-all duration-200" id="tv-symbol-search-backdrop">
          <div 
            className="flex flex-col w-full max-w-3xl bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl h-[580px] overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150" 
            id="tv-symbol-search-modal"
          >
            {/* Modal Title Banner and Close Trigger */}
            <div className="px-6 py-4.5 border-b border-white/5 flex items-center justify-between bg-[#1f1f22]">
              <h2 className="text-base font-extrabold text-neutral-100 font-sans tracking-tight">Pencarian simbol</h2>
              <button 
                onClick={() => {
                  setIsSearchModalOpen(false);
                  setModalSearchQuery("");
                }}
                className="text-neutral-400 hover:text-white bg-[#2c2c2f] hover:bg-[#38383c] p-1.5 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Search Bar Inside Modal */}
            <div className="p-4 bg-[#141416] border-b border-white/5 relative">
              <div className="relative flex items-center group">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-neutral-500 group-focus-within:text-[#FFB100] transition-colors" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Simbol, ISIN, atau CUSIP (e.g. BTCUSD, USDJPY, BBCA, NVDA)"
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-3 bg-[#1e1e20] border border-white/5 rounded-xl text-xs font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFB100] focus:bg-[#202022] transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && modalSearchQuery.trim()) {
                      // Grab first matching item if available or load as custom
                      if (modalFilteredSymbols.length > 0) {
                        const selectedItem = modalFilteredSymbols[0];
                        setSelectedSymbol(selectedItem.symbol);
                        setActiveCategory(selectedItem.category);
                        setIsSearchModalOpen(false);
                        setModalSearchQuery("");
                      } else {
                        handleAddNewSymbol(modalSearchQuery);
                      }
                    }
                  }}
                />
                
                {modalSearchQuery && (
                  <button 
                    onClick={() => setModalSearchQuery("")}
                    className="absolute right-4 text-[10.5px] bg-[#29292d] hover:bg-[#39393d] border border-white/5 px-2.5 py-1 rounded text-neutral-400 hover:text-white transition-all cursor-pointer font-sans"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Market Filters (Pills/Tabs Matching Official TradingView Screenshot) */}
            <div className="px-4 py-3 bg-[#161618] border-b border-white/5 flex items-center overflow-x-auto scrollbar-none gap-1.5" id="tv-modal-filter-tabs">
              {[
                { id: "Seluruhnya", label: "Seluruhnya" },
                { id: "Saham", label: "Saham" },
                { id: "Dana", label: "Dana" },
                { id: "Kontrak Berjangka", label: "Kontrak Berjangka" },
                { id: "Forex", label: "Forex" },
                { id: "Crypto", label: "Crypto" },
                { id: "Indeks", label: "Indeks" },
                { id: "Obligasi", label: "Obligasi" },
                { id: "Ekonomi", label: "Ekonomi" },
                { id: "Opsi", label: "Opsi" },
                ...(customSymbols.length > 0 ? [{ id: "Kustom", label: "⭐ Kustom" }] : [])
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setModalActiveCategory(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-sans rounded-lg font-bold cursor-pointer transition-all border whitespace-nowrap ${
                    modalActiveCategory === tab.id
                      ? "bg-white text-black border-white"
                      : "bg-[#202022] border-white/5 text-neutral-400 hover:text-neutral-200 hover:bg-[#28282c]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Interactive Scrollable List Feed Matching TradingView precisely */}
            <div className="flex-1 overflow-y-auto bg-[#141416] divide-y divide-white/5 scrollbar-thin">
              {modalFilteredSymbols.length > 0 ? (
                modalFilteredSymbols.map((item) => {
                  const isCurrent = selectedSymbol === item.symbol;
                  return (
                    <div
                      key={item.symbol}
                      onClick={() => {
                        setSelectedSymbol(item.symbol);
                        setActiveCategory(item.category === "Kustom" ? "Kustom" : item.category);
                        setIsSearchModalOpen(false);
                        setModalSearchQuery("");
                      }}
                      className={`px-5 py-3 flex items-center justify-between hover:bg-[#202022]/60 cursor-pointer transition-all ${
                        isCurrent ? "bg-[#FFB100]/5 border-l-2 border-[#FFB100]" : ""
                      }`}
                    >
                      {/* Left: Flag Icon Circle + Ticker + Description */}
                      <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                        {renderVisualBadge(item.iconType, item.ticker)}
                        
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-4 min-w-0">
                          {/* Ticker Symbol */}
                          <span className="text-[13px] font-black font-mono text-white tracking-wide shrink-0">
                            {item.ticker}
                          </span>
                          {/* Label Description */}
                          <span className="text-xs text-neutral-400 font-sans truncate pr-2">
                            {item.label}
                          </span>
                        </div>
                      </div>

                      {/* Right: Category badge + Exchange badge */}
                      <div className="flex items-center space-x-3 shrink-0 text-right">
                        {/* Sub Category e.g. "spot crypto defi", "forex cfd" */}
                        <span className="hidden md:inline text-[10.5px] font-mono text-neutral-500 lowercase">
                          {item.exchangeSub}
                        </span>
                        
                        {/* Exchange badge e.g. BITSTAMP, OANDA, IDX */}
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[11px] font-black font-mono text-neutral-300">
                            {item.exchange}
                          </span>
                          
                          {/* Green TradingView checked status emblem or currency tag */}
                          <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold text-black border ${
                            item.exchange === "BITSTAMP" || item.exchange === "BINANCE"
                              ? "bg-emerald-500 border-emerald-600 text-white"
                              : "bg-[#0052ff] border-blue-600 text-white"
                          }`}>
                            {item.exchange.substring(0, 1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center flex flex-col justify-center items-center">
                  <Search className="w-10 h-10 text-neutral-600 mb-3 animate-pulse" />
                  <p className="text-neutral-400 text-xs font-sans max-w-sm mb-4 leading-relaxed">
                    Tidak menemukan instrumen "{modalSearchQuery}" di database bursa default.
                  </p>
                  
                  {modalSearchQuery.trim() && (
                    <button
                      onClick={() => handleAddNewSymbol(modalSearchQuery)}
                      className="px-4 py-2 bg-[#FFB100] text-black text-xs font-black rounded-xl hover:bg-amber-400 active:scale-95 transition-all shadow-md cursor-pointer animate-bounce"
                    >
                      ✨ Tambahkan & Hubungkan Bursa: "{modalSearchQuery.toUpperCase()}"
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Info Banner */}
            <div className="px-6 py-3.5 bg-[#1a1a1c] border-t border-white/5 text-center shrink-0">
              <span className="text-[10.5px] text-neutral-400 font-sans tracking-wide">
                Cari menggunakan kode bursa langsung (Contoh: <code className="bg-[#121214] px-1.5 py-0.5 rounded border border-white/5 text-white text-[10px] font-mono">BINANCE:ETHUSDT</code> atau <code className="bg-[#121214] px-1.5 py-0.5 rounded border border-white/5 text-white text-[10px] font-mono">IDX:BBRI</code>)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Ticker Selector Header */}
      <div className="flex flex-col bg-[#111111] border-b border-white/5" id="tv-header">
        {/* Row 1: Title Info & Toggle Wide */}
        <div className="px-4 py-3 sm:px-5 sm:py-3 flex items-center justify-between border-b border-white/5 gap-4" id="tv-header-top">
          <div className="flex items-center space-x-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="font-sans font-bold text-sm text-neutral-200 flex items-center gap-2">
              Pergerakan Pasar Real-Time 
              <span className="hidden xs:inline-block text-[10px] text-[#FFB100] bg-[#FFB100]/10 px-2.5 py-1 rounded-full font-mono border border-[#FFB100]/15 uppercase tracking-wider animate-pulse">
                Simulasi Live Feed
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2" id="tv-header-top-actions">
            {onToggleWide && (
              <button
                id="tv-btn-toggle-wide"
                onClick={onToggleWide}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-sans rounded-xl border border-white/5 bg-[#0a0a0a] text-neutral-300 hover:text-white hover:bg-white/5 hover:border-white/15 transition-all cursor-pointer font-bold shadow-md"
                title={isWide ? "Tampilan Layar Standar" : "Tampilan Layar Lebar"}
              >
                {isWide ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-[#FFB100]" />
                    <span className="text-[11px]">Layar Standar</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#FFB100]" />
                    <span className="text-[11px]">Layar Lebar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Trigger Bar (Official Style Search Box inside Header that pops up the comprehensive modal) */}
        <div className="px-4 py-2.5 sm:px-5 bg-[#0e0e0e] border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fade-in" id="tv-header-search-bar">
          <div 
            onClick={() => {
              setIsSearchModalOpen(true);
              setModalActiveCategory("Seluruhnya");
            }}
            className="relative flex-1 group cursor-pointer"
          >
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-500 group-hover:text-[#FFB100] transition-colors" />
            <div className="w-full pl-10 pr-24 py-2.5 bg-[#141416] hover:bg-[#18181a] border border-white/5 rounded-xl text-left text-xs text-neutral-400 font-sans transition-all flex items-center select-none shadow-sm capitalize">
              🔍 Klik untuk Cari Market... (EURUSD, BTC, BBCA, NVDA, XAUUSD...)
            </div>
            <div className="absolute right-3.5 top-2.5 bg-[#FFB100]/10 text-[#FFB100] border border-[#FFB100]/20 font-black text-[9px] font-sans px-2.5 py-1 rounded-md uppercase tracking-wider animate-pulse">
              Pencarian Simbol
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0" id="tv-search-meta">
            <button
              onClick={() => {
                setIsSearchModalOpen(true);
                setModalActiveCategory("Seluruhnya");
              }}
              className="px-4 py-2 bg-[#FFB100] hover:bg-amber-400 text-black text-xs font-sans font-black rounded-lg active:scale-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 shrink-0 text-black font-black" />
              <span>Cari Semua Market (TradingView Search)</span>
            </button>
          </div>
        </div>

        {/* Row 2: Market Category Tab Row */}
        <div className="px-4 py-2 sm:px-5 bg-[#0a0a0a] border-b border-white/5 flex items-center overflow-x-auto scrollbar-none gap-2" id="tv-category-tabs">
          <div className="flex gap-1">
            {[
              { id: "Forex", label: "🌍 Forex" },
              { id: "Crypto", label: "🪙 Crypto" },
              { id: "Komoditas", label: "📦 Komoditas" },
              { id: "Indeks", label: "📊 Indeks" },
              { id: "Saham", label: "📈 Saham" },
              ...(customSymbols.length > 0 ? [{ id: "Kustom", label: "⭐ Kustom" }] : [])
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 text-xs font-sans rounded-lg font-bold cursor-pointer transition-all border whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-[#FFB100]/10 border-[#FFB100]/30 text-[#FFB100]"
                    : "border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-[#111111]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Filtered Assets Roster Pills */}
        <div className="px-4 py-2.5 sm:px-5 bg-[#0d0d0d] flex items-center overflow-x-auto scrollbar-none gap-2" id="tv-asset-selectors-row">
          <div className="flex gap-1.5">
            {filteredSymbolsForDisplay.length > 0 ? (
              filteredSymbolsForDisplay.map((item) => (
                <button
                  id={`tv-btn-${item.symbol.replace(":", "-")}`}
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  className={`px-3 py-1.5 text-[11px] font-mono rounded-lg transition-all cursor-pointer whitespace-nowrap border ${
                    selectedSymbol === item.symbol
                      ? "bg-[#FFB100] text-black border-[#FFB100] font-black shadow-md shadow-[#FFB100]/5"
                      : "bg-[#141414] border-white/5 text-neutral-400 hover:text-neutral-200 hover:bg-[#1c1c1c]"
                  }`}
                >
                  {item.ticker}
                </button>
              ))
            ) : (
              <span className="text-[11px] text-neutral-500 py-1 font-sans">
                Tidak menemukan hasil. Tekan tombol kustom di atas untuk menghubungkan bursa baru!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Split Layout: Chart (Left) + Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 relative min-h-[480px]" id="tv-split-workspace">
        {/* Left Side: Dynamic Widget Frame */}
        <div className={`${showConsole ? "lg:col-span-8" : "lg:col-span-12"} flex flex-col relative bg-[#0a0a0a] border-r border-white/5`} id="tv-iframe-container">
          <div className="flex-1 w-full relative min-h-[380px]" ref={containerRef} id="tv-chart-root">
            {/* Loading Cover */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2.5 text-neutral-500 z-0 bg-[#0d0d0d]">
              <svg className="animate-spin h-7 w-7 text-[#FFB100]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs font-mono tracking-wider">Menghubungkan arus data bursa FXCM & Binance...</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Order Execution Console */}
        {showConsole && (
          <div className="lg:col-span-4 bg-[#111111] p-5 flex flex-col text-left space-y-4 overflow-y-auto max-h-[600px] border-t lg:border-t-0 border-white/5 scrollbar-thin" id="tv-trading-panel">
            {/* Console Title & Toggle */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-[#FFB100] animate-bounce" />
                <span className="text-xs font-extrabold uppercase font-mono tracking-wider text-white">
                  Konsol Trading Simulasi
                </span>
              </div>
              <button 
                onClick={() => onShowConsoleChange(false)}
                className="p-1 rounded bg-[#0a0a0a] border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer"
                title="Sembunyikan Konsol"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Simulated Capital Panel */}
            <div className="bg-[#0c0c0c] rounded-xl p-3.5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400 font-sans">Saldo Simulasi Latihan</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded">
                  Demo
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-xl font-black font-mono text-white">
                  ${practiceBalance.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {positions.length > 0 && (
                  <div className={`text-xs font-mono font-bold ${cumulativePNL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    PnL Berjalan: {cumulativePNL >= 0 ? "+" : ""}${cumulativePNL.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Multi-ticker Live Pricing Display */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono font-bold block">
                Arus Feed Harga - {symbols.find((s) => s.symbol === selectedSymbol)?.label || selectedSymbol}
              </span>
              <div className="flex items-center justify-between bg-[#0a0a0a] rounded-xl p-3 border border-white/5">
                <div className="text-2xl font-black font-mono text-[#FFB100] tracking-tight">
                  {currentSymbolPrice.toFixed(currentDecimals)}
                </div>
                <div className="text-[10px] text-neutral-400 font-sans text-right">
                  <span className="block text-white font-mono font-bold uppercase">LOT KONTRAK</span>
                  <span>1 Lot = {ASSET_CONFIGS[selectedSymbol]?.multiplier.toLocaleString("id-ID") || 10} Unit</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive Alert System */}
            {tradeAlert && (
              <div 
                className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs font-sans ${
                  tradeAlert.type === "success" 
                    ? "bg-emerald-950/25 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-950/25 border-rose-500/30 text-rose-300"
                }`}
              >
                {tradeAlert.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                <p className="leading-relaxed">{tradeAlert.text}</p>
              </div>
            )}

            {/* Interactive Lot Controller */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 tracking-wide font-sans block">Volume Transaksi (Lot)</label>
              <div className="grid grid-cols-4 gap-1.5 bg-[#0a0a0a] p-1.5 rounded-xl border border-white/5">
                {[0.1, 0.5, 1.0, 5.0].map((size) => (
                  <button
                    key={size}
                    onClick={() => setTradeSize(size)}
                    className={`py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer transition-all ${
                      tradeSize === size 
                        ? "bg-[#FFB100] text-black" 
                        : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {size} Lot
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-[10px] text-neutral-400 font-sans">Kustom Lot:</span>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0.01"
                  max="50"
                  value={tradeSize}
                  onChange={(e) => setTradeSize(Math.max(0.01, parseFloat(e.target.value) || 0.1))}
                  className="w-20 bg-[#0a0a0a] border border-white/10 rounded-md px-2 py-0.5 text-xs font-mono text-white text-center focus:outline-none focus:border-[#FFB100]"
                />
              </div>
            </div>

            {/* EXECUTION BUTTONS */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* BUY button */}
              <button
                onClick={() => executeTrade("BUY")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer flex flex-col items-center justify-center space-y-1"
              >
                <div className="flex items-center space-x-1 font-extrabold uppercase text-xs tracking-wider">
                  <ArrowUpRight className="w-4.5 h-4.5" />
                  <span>BELI (BUY)</span>
                </div>
                <span className="text-[10px] font-mono opacity-80">
                  Ask: {(currentSymbolPrice * 1.00015).toFixed(currentDecimals)}
                </span>
              </button>

              {/* SELL button */}
              <button
                onClick={() => executeTrade("SELL")}
                className="bg-rose-600 hover:bg-rose-500 text-white p-3.5 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer flex flex-col items-center justify-center space-y-1"
              >
                <div className="flex items-center space-x-1 font-extrabold uppercase text-xs tracking-wider">
                  <ArrowDownRight className="w-4.5 h-4.5" />
                  <span>JUAL (SELL)</span>
                </div>
                <span className="text-[10px] font-mono opacity-80">
                  Bid: {(currentSymbolPrice * 0.99985).toFixed(currentDecimals)}
                </span>
              </button>
            </div>

            {/* OPEN POSITIONS QUEUE */}
            <div className="flex-1 space-y-2.5">
              <span className="text-[11px] text-neutral-400 font-extrabold uppercase tracking-widest font-mono block border-b border-white/5 pb-1">
                Posisi Terbuka ({positions.length})
              </span>

              {positions.length === 0 ? (
                <div className="h-28 flex flex-col justify-center items-center rounded-xl bg-[#0a0a0a] border border-white/5 border-dashed p-4 text-center">
                  <Coins className="w-6 h-6 text-neutral-600 mb-2" />
                  <p className="text-[10px] text-neutral-400 leading-normal max-w-[200px]">
                    Belum ada instrumen trading aktif. Analisis tren di chart dan klik tombol BUY / SELL!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {positions.map((pos) => {
                    const priceOfAsset = livePrices[pos.symbol] || pos.entryPrice;
                    const cnf = ASSET_CONFIGS[pos.symbol] || { multiplier: 1 };
                    
                    const priceDiff = priceOfAsset - pos.entryPrice;
                    const isBuy = pos.type === "BUY";
                    const runningPNL = priceDiff * pos.size * (isBuy ? 1 : -1) * cnf.multiplier;

                    return (
                      <div 
                        key={pos.id} 
                        className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 flex items-center justify-between"
                      >
                        <div className="space-y-1.5 text-left">
                          <div className="flex items-center space-x-1.5">
                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded font-mono ${
                              isBuy ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                            }`}>
                              {pos.type}
                            </span>
                            <span className="text-[11px] font-black text-white font-sans">{pos.symbolLabel}</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono space-y-0.5">
                            <div>Vol: <span className="text-white font-bold">{pos.size} Lot</span></div>
                            <div>Entry: <span className="text-white">{pos.entryPrice.toFixed(currentDecimals)}</span></div>
                            <div>Live: <span className="text-white">{priceOfAsset.toFixed(currentDecimals)}</span></div>
                          </div>
                        </div>

                        {/* Floating PnL Display & Close Trigger */}
                        <div className="flex flex-col items-end space-y-1.5">
                          <span className={`text-xs font-mono font-black ${
                            runningPNL >= 0 ? "text-emerald-400" : "text-rose-400"
                          }`}>
                            {runningPNL >= 0 ? "+" : ""}${runningPNL.toFixed(2)}
                          </span>
                          <button
                            onClick={() => closePosition(pos)}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[9px] uppercase px-2.5 py-1.5 rounded-md cursor-pointer tracking-wider"
                          >
                            Tutup
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
