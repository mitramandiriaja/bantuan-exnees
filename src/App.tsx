/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, setDoc, serverTimestamp } from "firebase/firestore";
import { 
  TrendingUp, 
  BookOpen, 
  Terminal, 
  LogOut, 
  User, 
  Award, 
  HelpCircle, 
  ChevronRight, 
  ShieldCheck 
} from "lucide-react";
import { auth, db } from "./firebase";
import { UserSession } from "./types";
import LoginView from "./components/LoginView";
import DashboardView from "./components/DashboardView";
import EdukasiView from "./components/EdukasiView";
import AdminView from "./components/AdminView";
import ChatBot from "./components/ChatBot";

export default function App() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [currentTime, setCurrentTime] = useState("");

  // Load fonts dynamically and tick the clock
  useEffect(() => {
    const link1 = document.createElement("link");
    link1.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap";
    link1.rel = "stylesheet";
    document.head.appendChild(link1);

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " GMT+7");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserSession({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: data.displayName || "",
              role: data.role || "user",
              createdAt: data.createdAt ? String(data.createdAt) : "",
              lastLoginAt: data.lastLoginAt ? String(data.lastLoginAt) : ""
            });
          } else {
            // Backup Profile assignment for initial signups
            const assignedRole = (firebaseUser.email || "").toLowerCase() === "ronggoumi@gmail.com" ? "admin" : "user";
            const newProfile: UserSession = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Trader Pemula",
              role: assignedRole,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString()
            };
            
            // Persist
            await setDoc(userDocRef, {
              email: newProfile.email,
              displayName: newProfile.displayName,
              role: newProfile.role,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp()
            });

            setUserSession(newProfile);
          }
        } catch (e) {
          console.error("Gagal menelusuri data profil user:", e);
        }
      } else {
        setUserSession(null);
      }
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!userSession) return;
    
    try {
      // Log logout operation before killing session
      const logDocRef = doc(collection(db, "activity_logs"));
      await setDoc(logDocRef, {
        userId: userSession.uid,
        email: userSession.email,
        activity: "Keluar Akun (Logout) Berhasil",
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.warn("Log write denied or interrupted during logout:", e);
    }

    try {
      await signOut(auth);
      setUserSession(null);
      setActiveTab("dashboard");
    } catch (err) {
      console.error("Logout failure:", err);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center space-y-4" id="app-bootstrap">
        <svg className="animate-spin h-10 w-10 text-[#FFB100]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm text-neutral-400 font-mono">Menyelaraskan kunci enkripsi...</span>
      </div>
    );
  }

  // Not Logged In
  if (!userSession) {
    return (
      <>
        <LoginView 
          onLoginSuccess={(profile) => {
            setUserSession(profile);
            setActiveTab("dashboard");
          }} 
        />
        <ChatBot />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-sans overflow-x-hidden selection:bg-[#FFB100] selection:text-black" id="shell-container" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#111111] shrink-0" id="shell-sidebar">
        <div className="flex items-center gap-3 p-6" id="sidebar-brand">
          <div className="h-8 w-8 rounded bg-[#FFB100] flex items-center justify-center font-bold text-black text-sm shadow-md">
            EX
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-sm font-bold tracking-tighter text-white">EXNEES</span>
            <span className="text-[9px] text-[#FFB100] font-mono mt-0.5 tracking-wider font-bold">UMKM PARTNER</span>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-1.5 px-3" id="sidebar-nav-tabs">
          <button
            id="side-tab-dashboard"
            onClick={() => { setActiveTab("dashboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer text-left ${
              activeTab === "dashboard"
                ? "bg-white/5 text-[#FFB100]"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            id="side-tab-edukasi"
            onClick={() => { setActiveTab("edukasi"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer text-left ${
              activeTab === "edukasi"
                ? "bg-white/5 text-[#FFB100]"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Academy Edukasi</span>
          </button>

          <button
            id="side-tab-admin"
            onClick={() => { setActiveTab("admin"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer text-left ${
              activeTab === "admin"
                ? "bg-white/5 text-[#FFB100]"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Panel Admin</span>
          </button>
        </nav>

        {/* Sidebar User Profile bottom section */}
        <div className="mt-auto border-t border-white/10 p-4" id="sidebar-profile">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#FFB100] to-yellow-600 p-[1px] shrink-0">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-black text-xs font-bold font-mono text-neutral-100">
                {userSession.displayName.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-xs font-semibold text-neutral-100 truncate">{userSession.displayName}</span>
              <span className="text-[9px] text-[#FFB100] font-mono uppercase tracking-widest truncate">{userSession.role === "admin" ? "Master Admin" : "Trader Pemula"}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Main Content Panel */}
      <main className="flex-1 flex flex-col relative min-h-screen bg-[#0a0a0a] overflow-y-auto" id="main-content-panel">
        {/* Navigation Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 px-4 sm:px-8 backdrop-blur-md sticky top-0 z-30" id="main-top-header">
          <div className="flex items-center gap-3">
            {/* Mobile menu logo trigger */}
            <div className="md:hidden flex items-center space-x-2 mr-1">
              <div className="w-8 h-8 rounded bg-[#FFB100] flex items-center justify-center font-bold text-black text-sm">EX</div>
              <span className="text-xs font-extrabold text-white tracking-widest font-sans">EXNEES</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-sans">Sistem Real-Time Aktif</span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right flex flex-col">
              <span className="text-[9px] text-neutral-500 uppercase font-mono tracking-wider">Clock Server</span>
              <span className="text-xs sm:text-sm font-mono text-neutral-300 font-semibold">{currentTime}</span>
            </div>
            <button 
              id="btn-header-logout"
              onClick={handleLogout}
              className="rounded-full border border-[#FFB100]/30 px-3.5 py-1 text-xs font-bold text-[#FFB100] hover:bg-[#FFB100] hover:text-black transition-all cursor-pointer font-sans"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* Content viewport area */}
        <div className="flex-1 px-4 sm:px-8 py-6 pb-24 md:pb-8" id="shell-viewport">
          {activeTab === "dashboard" && (
            <DashboardView 
              userSession={userSession} 
              onChangeTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }} 
            />
          )}
          {activeTab === "edukasi" && (
            <EdukasiView userSession={userSession} />
          )}
          {activeTab === "admin" && (
            <AdminView userSession={userSession} />
          )}
        </div>

        {/* Mobile Navigation Sticky Overlays */}
        <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#111111]/90 backdrop-blur-md border border-white/10 rounded-full py-2 px-6 shadow-2xl z-40 flex items-center space-x-6 shrink-0" id="shell-mobile-nav">
          <button
            id="btn-mobile-dash"
            onClick={() => { setActiveTab("dashboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`flex flex-col items-center space-y-1 text-[9px] font-sans font-semibold cursor-pointer ${
              activeTab === "dashboard" ? "text-[#FFB100]" : "text-neutral-500"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            id="btn-mobile-edu"
            onClick={() => { setActiveTab("edukasi"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`flex flex-col items-center space-y-1 text-[9px] font-sans font-semibold cursor-pointer ${
              activeTab === "edukasi" ? "text-[#FFB100]" : "text-neutral-500"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Academy</span>
          </button>
          
          <button
            id="btn-mobile-adm"
            onClick={() => { setActiveTab("admin"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`flex flex-col items-center space-y-1 text-[9px] font-sans font-semibold cursor-pointer ${
              activeTab === "admin" ? "text-[#FFB100]" : "text-neutral-500"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Clean footer inside right main panel for consistency */}
        <footer className="hidden sm:block py-4 border-t border-white/5 bg-[#0d0d0d] text-center text-[9px] text-neutral-500 uppercase font-mono tracking-widest mt-6" id="shell-footer">
          UMKM Kampus Partner &copy; 2026. Seluruh hak cipta terkunci via SSL SHA-256.
        </footer>
      </main>
      <ChatBot />
    </div>
  );
}
