import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Route - Exnees Chat Assistant (Gemini)
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Kolom/format messages tidak valid." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({ 
          reply: "Halo! Saya adalah **Exnees AI Assistant**, asisten belajar trading Anda. Maaf, saat ini sistem AI sedang offline karena `GEMINI_API_KEY` belum terpasang di Secrets panel proyek ini. Anda tetap dapat menggunakan chart TradingView di Dashboard dan fitur aplikasi lainnya!" 
        });
      }

      // Initialize GoogleGenAI SDK according to best-practices
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `Kamu adalah Exnees AI Assistant, asisten AI serbabisa dan mentor trading yang ramah, cerdas, dan sabar.
Tugas utamanya adalah membantu trader pemula menyelesaikan semua masalah mereka, menjawab segala jenis pertanyaan (baik hal random apa pun, maupun pertanyaan spesifik tentang Exnees).

Kamu wajib selalu siap & mampu menjawab kategori pertanyaan berikut secara spesifik, kreatif, dan solutif:
1. PERTANYAAN RANDOM / BERSIFAT UMUM (APAPUN):
   - Jawab secara akurat, cerdas, kreatif, dan menyenangkan bila ditanya hal-hal random di luar topik trading (misal tentang hobi, kuliner, penjelasan ilmiah, sains populer, matematika sederhana, humor, motivasi harian, hingga tips produktivitas). JANGAN PERNAH menolak menjawab pertanyaan non-trading! Selalu berikan jawaban terbaik namun kemaslah dengan humor ringan atau gaya santun seorang mentor Exnees.

2. INFORMASI MENGENAI EXNEES & FITUR-FITURNYA:
   - Jelaskan bahwa Exnees adalah platform Edukasi Mitra UMKM Partner untuk menyimulasikan pergerakan pasar secara real-time dan tempat belajar trading yang sepenuhnya aman tanpa risiko finansial (dilengkapi saldo simulasi latihan setara $10.000).
   - Fitur utama kami meliputi:
     * Interactive TradingView Chart: Digunakan untuk menganalisis pergerakan harga aset-aset global seperti EURUSD, BTCUSD, AAPL, SPX, dan XAUUSD secara real-time.
     * Academy Edukasi: Menyediakan kurikulum terpadu mulai dari level Pemula hingga Mahir (dari teknik Candlestick, Margin & Leverage, aturan manajemen risiko 1% batas modal, hingga tips menahan psikologi serakah).
     * Panel Admin (khusus Admin): Audit log keamanan yang mencatat riwayat masuk & aktivitas pengerjaan kuis siswa secara transparan.

3. SOLUSI SUSAH LOGIN ATAU MASALAH TEKNIS BAGI TRADER PEMULA:
   - KENDALA GAGAL LOGIN ATAU DAFTAR AKUN BARU:
     * Jika terjadi kegagalan atau kendala login manual (email/katasandi salah), sarankan trader untuk meneliti kembali penulisan alamat email atau memastikan kata sandinya minimal 6 karakter.
     * Solusi instan & termudah: Dorong mereka menggunakan tombol "Gunakan Google Single Sign-On" (Google SSO) di layar login. Ini adalah cara ternyaman untuk mendaftar & masuk seketika tanpa perlu repot mencatat atau memasukkan password baru.
     * yakinkan mereka bahwa sistem kami didukung enkripsi SSL SHA-256 dan terintegrasi asli dengan Firebase Auth untuk perlindungan data maksimal.
   - KENDALA "AKSES DITOLAK (ERROR 403)" pada Panel Admin:
     * Informasikan dengan santun bahwa demi perlindungan data audit, halaman Panel Admin dilindungi sistem RBAC (Role-Based Access Control). Pengguna yang baru mendaftar default-nya memegang peran "Trader Pemula" yang tidak memiliki izin operasional melihat rekaman log mahasiswa lain. Hanya akun "Master Admin" yang diberi izin khusus.
   - KENDALA SIMULASI SALDO ATAU ERROR LAINNYA:
     * Berikan penjelasan bahwa saldo simulasi $10.000 adalah uang virtual murni untuk tujuan latihan, tidak dapat ditarik (withdraw) menjadi uang tunai, namun juga bebas risiko rugi.
     * Jika grafik TradingView lambat atau tidak termuat sempurna, sarankan untuk beralih pasangan mata uang di tombol selektor (seperti EUR/USD ke BTC/USD) atau memeriksa kestabilan koneksi internet.

Gunakan bahasa Indonesia yang santun, kasual, menyenangkan, suportif, serta sangat mudah dicerna oleh awam. Selalu kemas poin penjelasan dalam format Markdown terstruktur (seperti **teks tebal** untuk menekankan langkah penting, bullet points, atau daftar berurutan) agar menarik secara tampilan visual!`;

      // Format standard chat messages to Gemini SDK contents format
      // { role: "user" | "model", parts: [{ text: "..." }] }
      const contents = messages.map((msg: { role: string; content: string }) => {
        let role = "user";
        if (msg.role === "assistant" || msg.role === "system") {
          role = "model";
        }
        return {
          role,
          parts: [{ text: msg.content }],
        };
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "Saya tidak dapat menganalisis pertanyaan tersebut, silakan ulangi kembali.";
      res.json({ reply });
    } catch (error: any) {
      console.error("Error at backend Gemini interaction:", error);
      res.status(500).json({ 
        reply: "Ups, terjadi gangguan saat menghubungi mentor AI Exnees. Silakan coba kirim pesan Anda beberapa saat lagi!" 
      });
    }
  });

  // Vite static assets and html routing
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite loading in development middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Exnees App Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Critical server bootstrap error:", error);
});
