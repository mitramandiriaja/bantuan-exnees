import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Wallet, 
  BookOpen, 
  HelpCircle, 
  Bell, 
  ShieldAlert, 
  ChevronRight, 
  Users2 
} from "lucide-react";
import TradingViewWidget from "./TradingViewWidget";
import { UserSession } from "../types";

interface DashboardViewProps {
  userSession: UserSession;
  onChangeTab: (tab: string) => void;
}

export default function DashboardView({ userSession, onChangeTab }: DashboardViewProps) {
  // Practice balance stored in localStorage to persist user simulation progress
  const [practiceBalance, setPracticeBalance] = useState<number>(() => {
    const saved = localStorage.getItem("exnees_practice_balance");
    return saved ? parseFloat(saved) : 10000;
  });

  const [showTradingConsole, setShowTradingConsole] = useState<boolean>(() => {
    return localStorage.getItem("exnees_show_trading_console") === "true";
  });

  const [isChartWide, setIsChartWide] = useState<boolean>(() => {
    return localStorage.getItem("exnees_chart_is_wide") === "true";
  });

  useEffect(() => {
    localStorage.setItem("exnees_practice_balance", practiceBalance.toString());
  }, [practiceBalance]);

  useEffect(() => {
    localStorage.setItem("exnees_show_trading_console", showTradingConsole ? "true" : "false");
  }, [showTradingConsole]);

  useEffect(() => {
    localStorage.setItem("exnees_chart_is_wide", isChartWide ? "true" : "false");
  }, [isChartWide]);

  const handleWalletCardClick = () => {
    setShowTradingConsole(true);
    setTimeout(() => {
      const element = document.getElementById("tradingview-container-card");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };
  
  return (
    <div className="space-y-6 text-neutral-100 font-sans" id="dashboard-view-root">
      {/* Exnees Banner demanded by spec */}
      <motion.div 
        id="dashboard-brand-banner"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#111111] via-[#141414] to-[#1a1a1a] border border-white/10 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#FFB100]/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-3.5 text-left">
          <span className="text-[10px] font-bold text-black bg-[#FFB100] tracking-widest uppercase font-mono px-3 py-1 rounded-sm">
            Edukasi Mitra UMKM
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight leading-tight mt-2">
            Exnees - Pusat Bantuan Pengguna Aplikasi
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl font-sans mt-2 leading-relaxed">
            Selamat datang kembali, <span className="text-[#FFB100] font-semibold">{userSession.displayName}</span>! Selamat belajar menelaah pergerakan pasar secara real-time. Gunakan instrumen chart interaktif di bawah untuk menganalisis tren harga terkini.
          </p>
        </div>
      </motion.div>

      {/* Overview Analytics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="stats-bento-grid">
        {/* Practice Account Balance (Interactive Card) */}
        <button 
          onClick={handleWalletCardClick}
          className="bg-[#141414] border border-[#FFB100]/20 p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all hover:bg-[#181818] hover:border-[#FFB100]/60 text-left cursor-pointer w-full group relative overflow-hidden" 
          id="card-practice-wallet"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFB100]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="space-y-1.5 text-left relative z-10">
            <span className="text-xs text-[#FFB100] font-semibold font-sans tracking-wide flex items-center gap-1.5">
              Saldo Latihan (Simulasi) <span className="text-[9px] bg-[#FFB100]/10 px-1.5 py-0.5 rounded uppercase font-mono">Buka Konsol Trading</span>
            </span>
            <div className="text-2xl font-bold font-mono tracking-tight text-white group-hover:text-[#FFB100] transition-colors">
              ${practiceBalance.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-neutral-400 font-sans flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Dana pembelajaran tak berisiko - Klik untuk bertransaksi!
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFB100]/10 flex items-center justify-center text-[#FFB100] shrink-0 border border-[#FFB100]/25 group-hover:scale-110 transition-transform relative z-10">
            <Wallet className="w-6 h-6" />
          </div>
        </button>

        {/* Education Progress Banner */}
        <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl cursor-pointer hover:border-[#FFB100]/40 hover:bg-[#181818] transition-all" id="card-dashboard-materials" onClick={() => onChangeTab("edukasi")}>
          <div className="space-y-1.5 text-left">
            <span className="text-xs text-neutral-400 font-sans tracking-wide">Modul Edukasi</span>
            <div className="text-lg font-bold text-white font-sans tracking-tight">
              Dasar & Psikologi Pasar
            </div>
            <div className="text-[10px] text-[#FFB100] font-sans flex items-center gap-1 hover:underline">
              Buka kurikulum belajar
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0 border border-orange-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Role Type Indicator */}
        <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all hover:bg-[#181818] hover:border-white/10" id="card-user-role">
          <div className="space-y-1.5 text-left">
            <span className="text-xs text-neutral-400 font-sans tracking-wide">Sesi Hak Akses (RBAC)</span>
            <div className="text-lg font-extrabold capitalize text-white flex items-center space-x-2 font-mono">
              <span className={`w-2 h-2 rounded-full ${userSession.role === "admin" ? "bg-[#FFB100]" : "bg-emerald-500"}`}></span>
              <span>{userSession.role === "admin" ? "Master Admin" : "Trader Pemula"}</span>
            </div>
            <p className="text-[9px] text-neutral-500 font-sans truncate max-w-[210px]">
              {userSession.role === "admin" ? "Akses menyeluruh panel monitoring" : "Akses modul publik & chart simulasi"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#111111] flex items-center justify-center text-neutral-400 border border-white/5 shrink-0">
            <Users2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main interactive area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="dashboard-body-grid">
        {/* Main TV Widget taking 3 or 4 cols dynamically */}
        <div 
          className={`${isChartWide ? "lg:col-span-4" : "lg:col-span-3"} min-h-[520px] transition-all duration-300`} 
          id="dashboard-col-chart"
        >
          <TradingViewWidget 
            showConsole={showTradingConsole}
            onShowConsoleChange={setShowTradingConsole}
            practiceBalance={practiceBalance}
            onBalanceChange={setPracticeBalance}
            isWide={isChartWide}
            onToggleWide={() => setIsChartWide(!isChartWide)}
          />
        </div>

        {/* Support instructions / alerts */}
        <div 
          className={`${isChartWide ? "lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6" : "lg:col-span-1 space-y-5 flex flex-col justify-between"}`} 
          id="dashboard-col-tips"
        >
          <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl text-left shadow-2xl space-y-4">
            <h4 className="text-sm font-semibold text-neutral-200 border-b border-white/5 pb-2.5 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FFB100]" />
              Panduan Praktik
            </h4>
            
            <div className={`text-xs text-neutral-400 ${isChartWide ? "grid grid-cols-1 sm:grid-cols-3 gap-4" : "space-y-3.5"}`}>
              <div className="space-y-1">
                <span className="font-semibold text-neutral-200 font-sans block text-[#FFB100]">1. Klik Saldo Latihan</span>
                <p className="leading-relaxed">Aktifkan modul trading order simulasi real-time langsung di sebelah kanan chart.</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-neutral-200 font-sans block">2. Analisis & Ambil Posisi</span>
                <p className="leading-relaxed">Gunakan tombol BUY (Beli) atau SELL (Jual) untuk membuka posisi perdagangan dengan data feed real-time.</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-neutral-200 font-sans block">3. Kelola Risiko</span>
                <p className="leading-relaxed">Tutup transaksi Anda saat laba/rugi berjalan sesuai kemauan Anda untuk memperbarui saldo.</p>
              </div>
            </div>
          </div>

          {/* Secure disclaimer */}
          <div className="bg-[#FFB100]/5 border border-[#FFB100]/20 p-5 rounded-2xl text-left flex items-center shadow-xl font-sans" id="financial-disclaimer">
            <div className="flex items-start space-x-3 text-[11px] text-[#FFB100] leading-relaxed">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block font-sans">Peringatan Risiko Penting:</span>
                <p className="mt-1 text-yellow-100/75 leading-relaxed">
                  Seluruh data transaksi dan asisten AI merupakan bentuk modul edukasi eksklusif. Tidak melibatkan modal keuangan rill.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
