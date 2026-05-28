import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { Shield, Eye, EyeOff, Mail, Lock, UserPlus, LogIn, Chrome, CheckCircle2, HelpCircle } from "lucide-react";
import { auth, db } from "../firebase";

interface LoginViewProps {
  onLoginSuccess: (userProfile: any) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setErrorMsg("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up Flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Assign Role: If their email matches ronggoumi@gmail.com, assign "admin", otherwise "user"
        const assignedRole = email.toLowerCase() === "ronggoumi@gmail.com" ? "admin" : "user";
        const displayNameString = name.trim() || email.split("@")[0];

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          email: email.toLowerCase(),
          displayName: displayNameString,
          role: assignedRole,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        });

        // Audit Trail creation matching our rules
        const logDocRef = doc(collection(db, "activity_logs"));
        await setDoc(logDocRef, {
          userId: user.uid,
          email: email.toLowerCase(),
          activity: `Pendaftaran Baru dengan Email (${assignedRole})`,
          timestamp: serverTimestamp()
        });

        setRegisteredSuccess(true);
        setTimeout(() => {
          setIsSignUp(false);
          setRegisteredSuccess(false);
          setPassword("");
        }, 3000);

      } else {
        // Sign In Flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        let userProfileData: any;

        if (userSnapshot.exists()) {
          userProfileData = userSnapshot.data();
          // Force update last login
          await setDoc(userDocRef, {
            ...userProfileData,
            lastLoginAt: serverTimestamp()
          });
        } else {
          // If profile document for some reason was missing, recover it safely
          const assignedRole = email.toLowerCase() === "ronggoumi@gmail.com" ? "admin" : "user";
          userProfileData = {
            email: email.toLowerCase(),
            displayName: user.displayName || email.split("@")[0],
            role: assignedRole,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp()
          };
          await setDoc(userDocRef, userProfileData);
        }

        // Audit Log
        const logDocRef = doc(collection(db, "activity_logs"));
        await setDoc(logDocRef, {
          userId: user.uid,
          email: email.toLowerCase(),
          activity: `Login Berhasil via Email`,
          timestamp: serverTimestamp()
        });

        onLoginSuccess({
          uid: user.uid,
          ...userProfileData
        });
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/email-already-in-use") {
        setErrorMsg("Email sudah terdaftar. Silakan masuk.");
      } else if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        setErrorMsg("Kombinasi Email dan kata sandi keliru.");
      } else if (err.code === "auth/weak-password") {
        setErrorMsg("Kata sandi terlalu lemah (minimal 6 karakter).");
      } else {
        setErrorMsg(err.message || "Terjadi kesalahan sistem, silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg("");
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // Firebase standard signInWithPopup works beautifully inside frame environments
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const userEmail = (user.email || "").toLowerCase();

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      let userProfileData: any;
      const assignedRole = userEmail === "ronggoumi@gmail.com" ? "admin" : "user";

      if (userDocSnapshot.exists()) {
        userProfileData = userDocSnapshot.data();
        await setDoc(userDocRef, {
          ...userProfileData,
          lastLoginAt: serverTimestamp()
        });
      } else {
        userProfileData = {
          email: userEmail,
          displayName: user.displayName || userEmail.split("@")[0],
          role: assignedRole,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        };
        await setDoc(userDocRef, userProfileData);
      }

      // Record entry in audit logs
      const logDocRef = doc(collection(db, "activity_logs"));
      await setDoc(logDocRef, {
        userId: user.uid,
        email: userEmail,
        activity: `Login Berhasil via Google OAuth`,
        timestamp: serverTimestamp()
      });

      onLoginSuccess({
        uid: user.uid,
        ...userProfileData
      });
    } catch (err: any) {
      console.error("Google Auth error:", err);
      // Catch popups closed exceptions gracefully
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMsg("Alur login Google dibatalkan karena jendela ditutup.");
      } else {
        setErrorMsg("Gagal melakukan autentikasi Google. Silakan gunakan metode email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans" id="login-container">
      {/* Background elegant accents */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#FFB100]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#111111] rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        id="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col relative z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8" id="login-brand">
          <div className="w-14 h-14 rounded bg-[#FFB100] flex items-center justify-center font-bold text-black text-2xl shadow-xl mb-4 tracking-wider">
            EX
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight text-center">
            Exnees
          </h2>
          <span className="text-xs text-neutral-400 mt-1 text-center font-sans">
            Pusat Bantuan Pengguna Aplikasi & Edukasi Keuangan
          </span>
        </div>

        {/* Security Alert Header */}
        <div className="bg-[#0a0a0a] rounded-xl px-4 py-3 border border-white/5 mb-6 flex items-start space-x-3" id="security-notice">
          <Shield className="w-5 h-5 text-[#FFB100] shrink-0 mt-0.5" />
          <div className="text-left">
            <span className="block text-xs font-semibold text-neutral-200 font-sans">Autentikasi Terenkripsi</span>
            <p className="text-[10px] text-neutral-500 font-sans leading-normal mt-0.5">
              Setiap aktivitas masuk diverifikasi langsung melalui protokol Firebase Secure Guard secara real-time.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/5 mb-6" id="login-tabs">
          <button
            id="tab-signin-btn"
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(""); }}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors transition-all focus:outline-none cursor-pointer ${
              !isSignUp ? "text-[#FFB100] border-b-2 border-[#FFB100]" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Masuk Akun
          </button>
          <button
            id="tab-signup-btn"
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(""); }}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors transition-all focus:outline-none cursor-pointer ${
              isSignUp ? "text-[#FFB100] border-b-2 border-[#FFB100]" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Success screen for SignUp */}
        {registeredSuccess ? (
          <motion.div 
            id="signup-success-state"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center py-6 text-center"
          >
            <CheckCircle2 className="w-12 h-12 text-[#FFB100] mb-4 animate-bounce" />
            <h3 className="text-base font-bold text-neutral-100 font-sans">Registrasi Berhasil!</h3>
            <p className="text-xs text-neutral-400 mt-2 max-w-[280px] leading-relaxed">
              Akun Anda telah dienkripsi dengan aman. Sistem akan memindahkan Anda ke halaman masuk...
            </p>
          </motion.div>
        ) : (
          <form id="login-form-submit" onSubmit={handleEmailAuth} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-950/40 border border-red-900/60 text-red-350 text-xs px-3.5 py-2.5 rounded-xl text-left" id="login-error-alert">
                {errorMsg}
              </div>
            )}

            {isSignUp && (
              <div className="space-y-1.5" id="group-name">
                <label className="block text-xs font-semibold text-neutral-400">Nama Lengkap</label>
                <div className="relative">
                  <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    id="input-signup-name"
                    required
                    type="text"
                    placeholder="Budi Gunawan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#FFB100] font-sans"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5" id="group-email">
              <label className="block text-xs font-semibold text-neutral-400">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  id="input-login-email"
                  required
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#FFB100] font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5" id="group-password">
              <label className="block text-xs font-semibold text-neutral-400">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  id="input-login-password"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#FFB100] font-sans"
                />
                <button
                  id="toggle-password-btn"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="submit-auth-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFB100] hover:bg-[#e09c00] text-black font-semibold rounded-xl py-2.5 text-xs sm:text-sm transition-colors flex items-center justify-center space-x-2 shadow-lg shrink-0 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4 text-black" />
                  <span>Daftar Sekarang</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-black" />
                  <span>Masuk Akun</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center my-6" id="login-divider">
          <div className="flex-1 h-[1px] bg-white/5" />
          <span className="text-[10px] text-neutral-550 px-3 uppercase tracking-wider font-mono">Atau Masuk via Google</span>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        {/* Google Authentication Button */}
        <button
          id="btn-google-login"
          type="button"
          disabled={loading}
          onClick={handleGoogleAuth}
          className="w-full bg-[#0a0a0a] border border-white/10 hover:bg-[#111111] text-neutral-200 font-sans font-semibold rounded-xl py-2.5 text-xs sm:text-sm transition-colors flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50"
        >
          <Chrome className="w-4 h-4 text-red-500" />
          <span>Gunakan Google Single Sign-On</span>
        </button>

        {/* Help Tip alerting to ChatBot */}
        <div className="mt-5 p-3.5 bg-[#FFB100]/5 border border-[#FFB100]/15 rounded-xl text-left flex items-start space-x-2.5" id="login-ai-tip">
          <HelpCircle className="w-4 h-4 text-[#FFB100] shrink-0 mt-0.5" />
          <div>
            <span className="block text-xs font-bold text-neutral-200">Butuh Bantuan Instan?</span>
            <p className="text-[10px] text-neutral-400 font-sans leading-relaxed mt-0.5">
              Jika Anda mengalami kesulitan login, mendaftar, lupa password, atau ada pertanyaan random sekalipun, silakan tanya langsung pada <span className="text-[#FFB100] font-semibold">Exnees AI Assistant</span> di bagian kanan bawah layar Anda!
            </p>
          </div>
        </div>

        {/* Footer info/tips */}
        <span className="text-[9px] text-neutral-600 text-center mt-6 block leading-normal font-mono uppercase">
          Edukasi Mitra UMKM. Ronggoumi @ 2026. Hak Cipta Dilindungi Undang-Undang.
        </span>
      </motion.div>
    </div>
  );
}
