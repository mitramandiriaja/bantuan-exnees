import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Award, Filter, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { EDUCATIONAL_MATERIALS } from "../data";
import { EducationMaterial, UserSession } from "../types";
import { db } from "../firebase";
import { doc, collection, setDoc, serverTimestamp } from "firebase/firestore";

interface EdukasiViewProps {
  userSession: UserSession;
}

export default function EdukasiView({ userSession }: EdukasiViewProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<EducationMaterial | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("Semua");
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  // Filter materials based on selected filter
  const categories = ["Semua", "Dasar", "Teknis", "Psikologi", "Manajemen Risiko"];

  const filteredMaterials = filterCategory === "Semua" 
    ? EDUCATIONAL_MATERIALS 
    : EDUCATIONAL_MATERIALS.filter(m => m.category === filterCategory);

  const handleSelectMaterial = async (material: EducationMaterial) => {
    setSelectedMaterial(material);
    setFeedbackSent(false);
    setUserFeedback("");

    // Audit activities whenever a student reads a material
    try {
      const logDocRef = doc(collection(db, "activity_logs"));
      await setDoc(logDocRef, {
        userId: userSession.uid,
        email: userSession.email,
        activity: `Membaca Materi: ${material.title}`,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Gagal melakukan penulisan log aktivitas:", e);
    }
  };

  const submitFeedback = async (e: FormEvent) => {
    e.preventDefault();
    if (!userFeedback.trim() || !selectedMaterial) return;

    try {
      // Log the feedback action as part of audited logs
      const logDocRef = doc(collection(db, "activity_logs"));
      await setDoc(logDocRef, {
        userId: userSession.uid,
        email: userSession.email,
        activity: `Mengirim Umpan Balik Materi "${selectedMaterial.title}": "${userFeedback.substring(0, 80)}"`,
        timestamp: serverTimestamp()
      });

      setFeedbackSent(true);
      setUserFeedback("");
    } catch (e) {
      console.error("Error logging feedback", e);
    }
  };

  return (
    <div className="space-y-6 text-neutral-100 font-sans" id="edukasi-view-root">
      {/* Academy Banner */}
      <div className="bg-gradient-to-br from-[#111111] via-[#141414] to-[#1a1a1a] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl" id="edukasi-header-card">
        <div className="space-y-1 text-left">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#FFB100]" />
            Exnees Trading Academy
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Kurikulum khusus pemula hasil kolaborasi dan bimbingan terintegrasi asisten finansial.
          </p>
        </div>
        <div className="px-4 py-2 bg-[#FFB100]/10 border border-[#FFB100]/30 rounded-xl flex items-center space-x-2 shrink-0">
          <Award className="w-5 h-5 text-[#FFB100]" />
          <span className="text-xs text-neutral-200 font-semibold font-sans">Sertifikasi Tugas UMKM</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedMaterial ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
            id="materi-list-container"
          >
            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2 bg-[#111111] p-2 rounded-xl border border-white/5" id="filter-controls">
              <div className="flex items-center space-x-2 text-neutral-400 text-xs px-2">
                <Filter className="w-3.5 h-3.5 text-[#FFB100]" />
                <span className="font-sans font-medium">Saring:</span>
              </div>
              {categories.map((cat) => (
                <button
                  id={`btn-filter-${cat.replace(/\s+/g, "-")}`}
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                    filterCategory === cat
                      ? "bg-[#FFB100] text-black shadow-lg font-bold"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="materials-grid">
              {filteredMaterials.map((mat) => (
                <div
                  id={`material-card-${mat.id}`}
                  key={mat.id}
                  onClick={() => handleSelectMaterial(mat)}
                  className="bg-[#141414] border border-white/5 hover:border-[#FFB100]/40 hover:bg-[#181818] p-5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between shadow-2xl hover:scale-[1.01] text-left"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB100] bg-[#FFB100]/10 px-2.5 py-0.5 rounded-sm font-mono">
                        {mat.category}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {mat.readTime}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white hover:text-[#FFB100] transition-colors leading-snug">
                      {mat.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                      {mat.content}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-4">
                    <span className="text-[11px] font-medium text-neutral-500 font-sans">
                      Tingkat: <span className="text-neutral-300 font-semibold">{mat.level}</span>
                    </span>
                    <span className="text-xs text-[#FFB100] font-semibold flex items-center gap-1 hover:underline">
                      Baca materi
                      <span>&rarr;</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            id="materi-reader-container"
          >
            {/* Reading window takes 2 cols */}
            <div className="lg:col-span-2 space-y-6 bg-[#141414] border border-white/5 p-6 sm:p-8 rounded-2xl relative text-left shadow-2xl">
              <button
                id="btn-back-to-materials"
                onClick={() => setSelectedMaterial(null)}
                className="flex items-center space-x-2 text-xs text-neutral-400 hover:text-white bg-[#0a0a0a] px-3 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Kurikulum</span>
              </button>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FFB100] bg-[#FFB100]/10 px-3 py-1 rounded-sm font-mono">
                    {selectedMaterial.category}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">
                    {selectedMaterial.readTime}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {selectedMaterial.title}
                </h1>
                <div className="w-full h-[1px] bg-white/5 my-4" />
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMaterial.content}
                </p>
              </div>

              {/* Secure feedback area */}
              <div className="bg-[#0a0a0a] rounded-2xl p-5 border border-white/5 mt-8" id="feedback-form-box">
                <h4 className="text-xs sm:text-sm font-bold text-neutral-200 font-sans tracking-tight mb-1">
                  Uji Pemahaman / Catatan Mahasiswa
                </h4>
                <p className="text-[10px] sm:text-xs text-neutral-500 font-sans mb-4 leading-normal">
                  Kirimkan satu tanggapan singkat Anda mengenai prinsip di atas untuk dicatat sebagai partisipasi belajar aktif mahasiswa.
                </p>

                {feedbackSent ? (
                  <div className="flex items-center space-x-2 text-[#FFB100] py-3 text-xs sm:text-sm bg-[#FFB100]/10 px-4 rounded-xl border border-[#FFB100]/20" id="feedback-success">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>Sukses! Tanggapan pemahaman Anda tercatat di log audit administratif admin.</span>
                  </div>
                ) : (
                  <form onSubmit={submitFeedback} className="space-y-3" id="form-learning-feedback">
                    <textarea
                      id="feedback-text-area"
                      required
                      placeholder="Tuliskan pemahaman pokok yang Anda petik dari materi ini... (contoh: Selalu memasang Stop Loss di tiap aksi beli)"
                      value={userFeedback}
                      onChange={(e) => setUserFeedback(e.target.value)}
                      className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#FFB100] h-20 resize-none font-sans"
                      maxLength={150}
                    />
                    <div className="flex justify-end">
                      <button
                        id="submit-feedback-btn"
                        type="submit"
                        className="bg-[#FFB100] hover:bg-[#e09c00] text-black font-semibold text-xs py-2 px-4 rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-black" />
                        <span>Kirim Tanggapan</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Side pane for dynamic recommendations */}
            <div className="space-y-5" id="reader-side-panel">
              {/* Box 1: Summary */}
              <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl text-left shadow-2xl">
                <h3 className="text-xs font-bold text-[#FFB100] uppercase tracking-wider font-mono mb-2">
                  Kesimpulan Pokok
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {selectedMaterial.summary}
                </p>
              </div>

              {/* Box 2: Smart recommendation */}
              <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl text-left shadow-2xl space-y-3.5">
                <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-sans border-b border-white/5 pb-2">
                  Latihan Praktis
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Buka tab <strong>Dashboard</strong> kembali, lalu cari pergerakan aset forex EUR/USD atau btc di chart TradingView untuk mengidentifikasi keberadaan pola di atas saat ini.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
