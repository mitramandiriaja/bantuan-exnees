import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Terminal, 
  ShieldAlert, 
  RefreshCw, 
  Lock, 
  Database, 
  Search, 
  FileCheck2, 
  Eye,
  EyeOff
} from "lucide-react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { UserSession, ActivityLog } from "../types";

interface AdminViewProps {
  userSession: UserSession;
}

export default function AdminView({ userSession }: AdminViewProps) {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [logsList, setLogsList] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Secret admin password entry states
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem("exnees_admin_auth") === "RONGGOANPS.1922" ||
           sessionStorage.getItem("exnees_admin_auth") === "RONGGOANPS.1922";
  });
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fetchData = async () => {
    if (!isUnlocked) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Fetch Users List
      const usersColPath = "users";
      let fetchedUsers: any[] = [];
      try {
        const usersSnapshot = await getDocs(collection(db, usersColPath));
        usersSnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() });
        });
      } catch (err) {
        // Enforce specific JSON error logging for permissions errors
        handleFirestoreError(err, OperationType.GET, usersColPath);
      }

      // 2. Fetch Activity Logs List (order by timestamp descending, limit to 40)
      const logsColPath = "activity_logs";
      let fetchedLogs: ActivityLog[] = [];
      try {
        const logsQuery = query(collection(db, logsColPath), orderBy("timestamp", "desc"), limit(40));
        const logsSnapshot = await getDocs(logsQuery);
        logsSnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedLogs.push({
            id: doc.id,
            userId: data.userId || "",
            email: data.email || "",
            activity: data.activity || "",
            timestamp: data.timestamp ? (data.timestamp.toDate ? data.timestamp.toDate().toLocaleString("id-ID") : String(data.timestamp)) : ""
          });
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, logsColPath);
      }

      setUsersList(fetchedUsers);
      setLogsList(fetchedLogs);
      setIsAdminAuthorized(true);
    } catch (err: any) {
      console.error("Admin secure fetching failed:", err);
      setErrorMsg("Ditolak oleh Aturan Keamanan Firebase: Autentikasi Admin gagal pada tingkat basis data!");
      setIsAdminAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (adminPassword === "RONGGOANPS.1922") {
      localStorage.setItem("exnees_admin_auth", "RONGGOANPS.1922");
      sessionStorage.setItem("exnees_admin_auth", "RONGGOANPS.1922");
      setIsUnlocked(true);
    } else {
      setPasswordError("Sandi Otoritas salah! Hanya admin utama yang diperbolehkan mengakses.");
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [userSession, isUnlocked]);

  // Handle Search Filtering
  const filteredLogs = logsList.filter(log => 
    log.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.activity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render password screen if locked
  if (!isUnlocked) {
    return (
      <div className="min-h-[500px] flex flex-col justify-center items-center py-12 px-4 text-center text-neutral-100" id="admin-password-gate">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col relative z-20"
        >
          {/* Lock Header */}
          <div className="flex flex-col items-center mb-6" id="admin-gate-header">
            <div className="w-16 h-16 rounded-full bg-[#FFB100]/10 border border-[#FFB100]/25 flex items-center justify-center text-[#FFB100] mb-4 shadow-lg shadow-[#FFB100]/5 animate-pulse">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight text-center">
              Akses Panel Admin Terkunci
            </h2>
            <p className="text-xs text-neutral-400 mt-2 text-center font-sans max-w-[290px] leading-relaxed">
              Anda berupaya mengakses Panel Administrasi. Silakan masukkan Sandi Otoritas Anda untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleVerifyPassword} className="space-y-4 text-left w-full">
            {passwordError && (
              <div className="bg-red-950/40 border border-red-900/60 text-red-300 text-xs px-3.5 py-2.5 rounded-xl text-left font-sans" id="gate-error-alert">
                {passwordError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 tracking-wide font-sans block">Sandi Otoritas Admin</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan katasandi..."
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-4 pr-11 py-3 text-xs sm:text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#FFB100] font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FFB100] hover:bg-[#e09c00] text-black font-semibold rounded-xl py-3 text-xs sm:text-sm font-sans transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer font-bold leading-none uppercase tracking-wide"
            >
              <span>Verifikasi & Buka Panel</span>
            </button>
          </form>

          {/* Security alert footer */}
          <div className="w-full bg-[#0a0a0a] rounded-xl p-3.5 border border-white/5 mt-6 text-left">
            <div className="flex space-x-2 text-[10px] text-neutral-500 font-mono uppercase">
              <ShieldAlert className="w-4 h-4 text-[#FFB100]" />
              <span>Proteksi Cloud Firestore Aktif</span>
            </div>
            <p className="text-[10px] text-neutral-500 leading-normal mt-1 ml-6 font-mono">
              Aturan enkripsi verifikasi telah disematkan di folder `firestore.rules`. Percobaan penembusan jalur dicatat secara otomatis.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // If user does not have permission (Client middleware check / Firestore rejection after bypass attempts)
  if (!isAdminAuthorized) {
    return (
      <div className="min-h-[500px] flex flex-col justify-center items-center py-12 px-4 text-center text-neutral-100" id="admin-forbidden-overlay">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-900/60 flex items-center justify-center text-red-500 mb-6 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-sans font-bold text-white">
            Akses Ditolak (403)
          </h2>
          <p className="text-sm text-neutral-400 mt-2 font-sans leading-relaxed">
            Halaman ini berada di bawah proteksi enkripsi ganda (RBAC). Anda login sebagai peran <span className="text-[#FFB100] font-semibold uppercase font-mono">{userSession.role}</span>, yang mana tidak memiliki otorisasi untuk membaca koleksi sistem.
          </p>
          <div className="w-full bg-[#0a0a0a] rounded-xl p-3.5 border border-white/5 mt-6 text-left">
            <div className="flex space-x-2 text-[10px] text-neutral-500 font-mono uppercase">
              <ShieldAlert className="w-4 h-4 text-[#FFB100]" />
              <span>Proteksi Cloud Firestore Aktif</span>
            </div>
            <p className="text-[10px] text-neutral-500 leading-normal mt-1 ml-6 font-mono">
              Aturan otentikasi verifikasi telah disematkan di folder `firestore.rules`. Percobaan penembusan jalur dicatat secara otomatis.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-neutral-100 font-sans text-left" id="admin-view-root">
      {/* Admin Title Panel */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl" id="admin-header-card">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#FFB100] flex items-center gap-2">
            <Terminal className="w-6 h-6 text-[#FFB100]" />
            Panel Audit Administrasi
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Pemantauan audit pendaftaran mahasiswa, pelaporan status login, dan log aktivitas real-time.
          </p>
        </div>
        <button
          id="btn-admin-refresh"
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2 bg-[#0a0a0a] hover:bg-[#111111] border border-white/10 text-xs text-neutral-300 font-semibold rounded-xl flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#FFB100]" : "text-neutral-400"}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3" id="admin-loading-state">
          <svg className="animate-spin h-8 w-8 text-[#FFB100]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs text-neutral-500 font-mono">Memuat database instan...</span>
        </div>
      ) : (
        <div className="space-y-6" id="admin-loaded-content">
          {/* Summary counters in grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="admin-counters">
            <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl flex items-center justify-between" id="admin-cnt-1">
              <div className="space-y-1">
                <span className="text-xs text-neutral-400 font-sans">Total Mahasiswa Terdaftar</span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {usersList.length} User
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FFB100]/10 flex items-center justify-center text-[#FFB100] border border-[#FFB100]/20">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl flex items-center justify-between" id="admin-cnt-2">
              <div className="space-y-1">
                <span className="text-xs text-neutral-400 font-sans">Aktivitas Diaudit (Total)</span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {logsList.length} Log
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <FileCheck2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl flex items-center justify-between" id="admin-cnt-3">
              <div className="space-y-1">
                <span className="text-xs text-neutral-400 font-sans">Otoritas Enkripsi</span>
                <div className="text-xs font-semibold text-neutral-300 font-mono bg-[#0a0a0a] px-2.5 py-1.5 rounded-lg border border-white/5 flex items-center gap-1.5 leading-none">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  FIRESTORE ENTERPRISE
                </div>
              </div>
              <div className="text-[10px] text-sky-400 font-mono bg-sky-950/30 px-2.5 py-1.5 rounded-lg border border-sky-900/40">
                SSL ACTIVE
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="admin-tables">
            {/* Left table showing users (1/3 cols) */}
            <div className="lg:col-span-1 bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col" id="admin-tbl-users-wrapper">
              <div className="px-5 py-4 bg-[#111111] border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-200 font-sans">Daftar Akun Terdaftar</h3>
                <span className="text-[10px] font-mono bg-[#FFB100]/10 text-[#FFB100] px-2 py-0.5 rounded-sm font-bold">RBAC DB</span>
              </div>
              <div className="p-4 flex-1 overflow-y-auto max-h-[360px] space-y-3.5 scrollbar-thin scrollbar-thumb-neutral-800">
                {usersList.length === 0 ? (
                  <div className="text-center text-xs text-neutral-500 py-6">Belum ada user terdaftar.</div>
                ) : (
                  usersList.map((user) => (
                    <div className="bg-[#0a0a0a] border border-white/5 p-3 rounded-xl flex flex-col space-y-1" key={user.id} id={`user-list-item-${user.id}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-200 leading-none">{user.displayName || "Trader Pemula"}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded leading-none ${user.role === "admin" ? "bg-[#FFB100]/25 text-[#FFB100] font-bold" : "bg-white/5 text-neutral-400"}`}>
                          {user.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">{user.email}</span>
                      <span className="text-[9px] text-neutral-600 font-mono pt-1 text-right">
                        Masuk: {user.lastLoginAt ? (user.lastLoginAt.toDate ? user.lastLoginAt.toDate().toLocaleDateString("id-ID") : String(user.lastLoginAt)) : "Sesi baru"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right table showing audited activity logs (2/3 cols) */}
            <div className="lg:col-span-2 bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col" id="admin-tbl-logs-wrapper">
              <div className="px-5 py-4 bg-[#111111] border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-[#FFB100]" />
                  <h3 className="text-sm font-bold text-neutral-200 font-sans">Log Audit Aktivitas (Masuk & Belajar)</h3>
                </div>
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                  <input
                    id="input-log-search"
                    type="text"
                    placeholder="Cari email / aksi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#FFB100]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto flex-1 max-h-[360px] scrollbar-thin scrollbar-thumb-neutral-800" id="admin-logs-scroll-area">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#111111] text-neutral-450 border-b border-white/10 font-semibold font-sans">
                      <th className="px-4 py-3 font-medium">Waktu</th>
                      <th className="px-4 py-3 font-medium">Identitas User</th>
                      <th className="px-4 py-3 font-medium">Laporan Aktivitas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#0a0a0a]/20">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-xs text-neutral-500 py-10">Tidak ditemukan laporan aktivitas aktivitas yang cocok.</td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr className="hover:bg-white/5 transition-colors" key={log.id} id={`log-row-${log.id}`}>
                           <td className="px-4 py-3.5 font-mono text-neutral-500 text-[10px] whitespace-nowrap">{log.timestamp}</td>
                           <td className="px-4 py-3.5 font-mono text-neutral-200 text-[11px] font-bold">{log.email}</td>
                           <td className="px-4 py-3.5 text-neutral-400 text-[11px] font-sans leading-relaxed">{log.activity}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
