import { EducationMaterial } from "./types";

export const EDUCATIONAL_MATERIALS: EducationMaterial[] = [
  {
    id: "m1",
    title: "Lesson 1: Dasar Klasik Malaysian SNR (MSNR) - Pola 'A' dan 'V'",
    category: "Dasar",
    level: "Pemula",
    readTime: "5 menit membaca",
    content: `### Pengantar Malaysian Support & Resistance (MSNR)
Malaysian Support & Resistance (MSNR) adalah metode analisis teknikal berbasis perilaku pasar institusional yang sangat presisi. Perbedaan mendasar MSNR dengan SNR biasa terletak pada fokus penetapan level kunci (key level). 

Untuk akurasi maksimal, MSNR menggunakan **Line Chart** untuk mendeteksi 'A' dan 'V' shape dan mengabaikan sumbu lilin (wicks) saat mengukur tingkat signifikansi.

---

### Cara Mengidentifikasi Level Klasik MSNR:
1. **Pola Hambatan (Classic 'A' - Resistance):** 
   - Konversi chart Anda ke **Line Chart**.
   - Identifikasi puncak tajam berbentuk huruf **'A'**. 
   - Tarik garis horizontal melintasi harga penutupan (Close) lilin Bullish pertama ke harga pembukaan (Open) lilin Bearish berikutnya. Abaikan ekor/wick.
   - Puncak tajam 'A' mewakili penolakan harga atas nilai yang lebih mahal karena adanya pasokan (supply) institusi yang masuk pesat.

2. **Pola Dukungan (Classic 'V' - Support):** 
   - Identifikasi dasar tajam berbentuk huruf **'V'** pada Line Chart.
   - Tarik garis melintasi harga Close lilin Bearish pertama ke harga Open lilin Bullish berikutnya. Abaikan ekor/wick.
   - Lembah tajam 'V' mewakili area di mana pembeli skala besar menyerap pesanan jual (liquidating sellers).

---

### Perbedaan Penting: Candlestick Chart vs Line Chart
- **Line Chart:** Hanya menampilkan harga penutupan rata-rata body candlestick. Berguna untuk melihat visual murni struktur pasar tanpa gangguan 'kebisingan' sumbu manipulasi.
- **Candlestick Chart:** Menunjukkan emosi detail pasar (Open, High, Low, Close). Berguna setelah menggambar garis di Line Chart untuk melihat konfirmasi sumbu candle menyentuh area pertahanan.`,
    summary: "MSNR menggunakan Line Chart untuk melacak pola 'A' (Resistance) dan 'V' (Support) berdasarkan titik Close-Open tubuh candle tanpa wick untuk presisi garis horizontal."
  },
  {
    id: "m2",
    title: "Lesson 2: Fresh vs Unfresh SNR & Flipped Levels (SBR dan RBS)",
    category: "Teknis",
    level: "Pemula",
    readTime: "6 menit membaca",
    content: `### Mengapa Status Kunci SNR Sangat Penting?
Dalam MSNR, area support dan resistance diibaratkan seperti *salju segar*. Salju yang belum terinjak oleh siapa pun adalah jalur paling kokoh dan murni.

1. **Fresh SNR (Tingkat Segar):**
   - Garis pertahanan yang **belum pernah disentuh atau ditembus** sama sekali oleh sumbu (wick) maupun tubuh (body) lilin setelah terbentuk.
   - Menghasilkan reaksi pembalikan arah (rejection) paling kuat dan andal karena menimbun pesanan yang belum tereksekusi (*uncollected institutional liquidity*).

2. **Unfresh SNR (Tingkat Kadaluwarsa):**
   - Area yang **sudah pernah disentuh (ditabrak)** oleh ekor lilin. 
   - Tingkat ini dinilai lemah karena likuiditas institusi sudah berkurang/diambil, sehingga rawan ditembus sewaktu-waktu.

---

### Siklus Flipped Levels (Penembusan Sempurna)
Ketika level SNR kokoh berhasil ditembus oleh tubuh lilin penuh (bukan sekadar diusap sumbu), peran level itu mengalami **cleansing (penyucian)** dan lahir kembali dengan fungsi terbalik:

- **SBR (Support Becomes Resistance):** 
  Sebuah dasar 'V' (Support) tertembus ke bawah oleh body lilin yang kuat. Saat harga memantul kembali ke level tersebut, ia berubah fungsi murni menjadi tempat aksi Jual yang kuat (Resistance).
  
- **RBS (Resistance Becomes Support):** 
  Sebuah puncak 'A' (Resistance) tertembus ke atas oleh body lilin penuh. Saat harga kembali turun menyentuh puncak tersebut, ia berubah fungsi murni menjadi tempat aksi Beli yang kuat (Support).

---

### Aturan Eksekusi Flipped Zone:
Tunggu hingga harga benar-benar kembali melakukan penarikan balik (*pullback*) ke arah garis RBS/SBR yang fresh, lalu cari konfirmasi sumbu candle menyapu liqudity sebelum mengambil posisi beli/jual secara presisi.`,
    summary: "Fresh SNR adalah level murni yang belum disentuh dan menyimpan daya pantul tinggi. Flipped SBR & RBS berfungsi sebagai konfirmasi masuk saat retest ulang."
  },
  {
    id: "m3",
    title: "Lesson 3: Storyline Trading dan Analisis Multi-Timeframe (MTF)",
    category: "Teknis",
    level: "Menengah",
    readTime: "6 menit membaca",
    content: `### Apa itu Storyline dalam Trading?
Dalam mazhab Malaysian SNR, **Storyline** adalah benang merah arah pergerakan harga yang diantisipasi dari satu level kunci ke level kunci lainnya. Storyline didesain khusus agar trader tidak tersesat dalam fluktuasi acak jangka pendek.

- **Hukum Utama Storyline:** 
  *"Awal cerita (storyline) baru di satu arah adalah akhir dari cerita ke arah sebaliknya. Akhir dari suatu cerita adalah awal bagi cerita yang berlawanan."*

---

### Pembagian Skala Multi-Timeframe (MTF):
Arah pergerakan market yang sesungguhnya ditentukan oleh struktur kerangka waktu tinggi (Higher Timeframe - HTF).
- **Weekly (Mingguan):** Menentukan arah peta utama yang paling dominan saat ini (*main direction*).
- **Daily (Harian):** Merupakan area koreksi (*retracement*) atau penghalang jalannya Weekly direction.
- **H4 (4 Jam):** Menyediakan konfirmasi perubahan arah jangka menengah (*setup confirmation*).
- **H1 / M30 (1 Jam/30 Menit):** Sangat krusial karena di sinilah harga memutuskan validitas tren melalui sumbu lilin atau GAP.
- **M15 / M5 (15/5 Menit):** Digunakan untuk menemukan titik masuk yang sangat halus (*refined entry*).

---

### Aturan Konfirmasi 2 Tiang Waktu (Rule of 2 TFs):
Jika harga menyentuh area support/resistance penting kerangka waktu HTF, Anda wajib memantau kerangka waktu dua tingkat di bawahnya untuk konfirmasi penembusan struktur (*breakout*):
- **Weekly Setup:** Konfirmasi validasi ditunggu di **H4**.
- **Daily Setup:** Konfirmasi validasi ditunggu di **H1**.

Jika harga menguji level Daily support, maka storyline buy baru valid bila kerangka H1 mencatatkan penembusan struktur resisten internal secara definitif.`,
    summary: "Storyline melacak target pergerakan harga antar level kunci HTF. Aturan konfirmasi mensyaratkan perpindahan struktur 2 timeframe di bawahnya."
  },
  {
    id: "m4",
    title: "Lesson 4: Siklus Manipulasi Sesi Pasar (Asia, London & New York)",
    category: "Manajemen Risiko",
    level: "Pemula",
    readTime: "6 menit membaca",
    content: `### Membaca Pergerakan Algoritma Berdasarkan Sesi Pasar
Market tidak bergerak acak 24 jam. Pergerakan harga diatur oleh algoritma perbankan global berdasarkan waktu sesi pusat keuangan dunia:

1. **Sesi Asia (09:00 - 16:00 WIB) - Akumulasi Terbatas:**
   Sesi ini kerap bergerak datar membentuk koridor tertutup (sideways). Tujuan Sesi Asia adalah mengumpulkan/memancing pesanan (*accumulate liquidity*) di atas dan di bawah rentang harganya.

2. **Sesi London (17:00 - 18:00 WIB) - Manipulasi Pertama:**
   Saat London dibuka, volatilitas melonjak. Algoritma akan melakukan dorongan instan yang menipu (*false move*) dengan berlawanan dari tren asli harian untuk memicu kerugian dini trader retail (menembus batas stop loss atas/bawah Asia). 

3. **Sesi New York (22:00 WIB) - Distribusi Riil:**
   New York merupakan sesi puncak volume pembalikan atau kelanjutan rill harian. Ia menyapu likuiditas sisa dari London lalu meluncur deras ke target rill harian institusional.

---

### Khasanah Pergerakan Sesi:
- **Asian Whipsaw (AWS):** Kasus di mana London menyapu bersih sisi tertinggi Asia, memantul cepat (*V-shaped recovery*), lalu menyapu sisi terendah Asia sebelum melesat tinggi di New York.
- **Asian Continuation:** Terjadi jika rentang pips Asia sangat lebar (40+ pips). Di sesi ini, London biasanya hanya melakukan retest ke garis tengah (*midline*) Asia sebelum melanjutkan tren impulsif.

---

### Aturan Waktu Terbaik Trading (Magic Minute Mitigations - MMM):
Momentum mitigasi orderblock validitas tinggi biasanya terjadi pada **1.5 Jam setelah pembukaan sesi London** dan **1.5 Jam setelah pembukaan sesi New York**. Hindari melakukan transaksi di tengah rentang pengetatan akumulasi Asia.`,
    summary: "Sesi Asia berakumulasi, London menyapu manipulasi, dan New York meluncurkan distribusi volume utama. Manfaatkan zona retensi 1.5 jam pasca buka sesi."
  },
  {
    id: "m5",
    title: "Lesson 5: Teorema Induksi 2-Fase (2-Phase Inducement Trap Theorem)",
    category: "Teknis",
    level: "Menengah",
    readTime: "7 menit membaca",
    content: `### Apa itu Konsep Inducement (Induksi)?
Inducement (Induksi) adalah jebakan likuiditas fraktal yang direkayasa oleh bank besar tepat di atas atau di bawah area orderblock murni untuk memancing pedagang retail masuk terlalu dini (*early buyers/sellers*).

Teorema Induksi 2-Fase menegaskan bahwa pembalikan arah (*reversal*) yang sehat dan berkelanjutan **wajib** melewati dua fase jebakan sebelum Anda boleh memasang pesanan:

---

### Fase 1: Jebakan Rantai Palsu (Mitigation Inducement)
- Harga membuat struktur pasokan/permintaan palsu (*false supply/demand chain*) yang terlepas tipis beberapa pips di bawah Orderblock murni Anda.
- Trader retail mengira rantai ini adalah support/resistent yang kuat, sehingga mereka membuka posisi beli/jual di sana.
- **Tujuan Fase 1:** Melacak penumpukan dana limit stop loss milik retail di area sempit tersebut.

---

### Fase 2: Penyapuan Likuiditas & Tap-In (The Final Sweep)
- Harga melakukan lonjakan tajam sekejap (Vector Candle) guna menyapu bersih stop-loss di Fase 1 dan langsung menyentuh (*tap-in*) Orderblock murni kita yang tersembunyi.
- Setelah Fase 2 selesai menyapu bersih seluruh rintangan ritel, harga akan berbalik arah dengan akselerasi ekspansif yang sangat kencang.

---

### Tipe Konfirmasi Post-Tap Fase 2:
1. **ChoCh Inducement (Kategori Paling Aman):**
   Setelah harga menyentuh orderblock kita, harga wajib menembus pertahanan internal terdekat (*Change of Character*), menciptakan satu zona buatan baru, lalu menyapu induksi terkecil zona baru tersebut sebelum berjalan menjauh.
   
2. **Resting Liquidity / Smart Money Trap (SMT):**
   Kondisi di mana likuiditas pembeli murni gagal bertahan dan langsung ditabrak habis oleh ekperimen volume institusional karena ketidaksediaan struktur induksi pra-penyentuhan.`,
    summary: "Teorema 2-Fase mengajarkan Anda menunggu terkumpulnya likuiditas palsu (Fase 1) dan penyapuan definitif (Fase 2) sebelum memasang limit order murni."
  },
  {
    id: "m6",
    title: "Lesson 6: Formula Power of 3 (AMD: Accumulation, Manipulation, Distribution)",
    category: "Psikologi",
    level: "Menengah",
    readTime: "5 menit membaca",
    content: `### Kerangka Kerja Algoritma Bank Sentral
Semua pelaku pasar institusi besar menggunakan satu formula pergerakan tiga babak utama yang dinamakan **Power of 3 (AMD)**. Memahami formula ini akan merubah total psikologi bertransaksi Anda dari korban manipulasi menjadi pengikut arus bank besar.

---

### Tiga Babak Utama Power of 3:

1. **Babak 1: Accumulation (Akumulasi):**
   - Harga bergerak sempit dalam koridor horizontal datar (sideways).
   - Di babak ini, investor ritel dipancing untuk menempatkan perintah Jual (Bells) dan Beli (Buys) tepat di tepi luar wilayah datar ini bersama stop loss mereka.
   - **Karakter Psikologi:** Konsolidasi jenuh yang lama, memancing ketidaksabaran ritel.

2. **Babak 2: Manipulation (Manipulasi):**
   - Terjadi lonjakan lilin kencang dan dramatis menembus batas akumulasi secara palsu.
   - Skenario ini memicu aksi panik ritel (mereka berasumsi breakout telah terjadi, lalu ikut mengejar lonjakan tersebut), padahal bank besar sedang mengambil likuiditas mereka dan menempatkan counter-order skala raksasa.
   - **Karakter Psikologi:** Rasa panik, ketakutan tertinggal momentum (FOMO).

3. **Babak 3: Distribution / Expansion (Distribusi):**
   - Harga berbalik arah secara instan, meninggalkan korban manipulasi, lalu melesat kencang searah tren asli yang diinginkan bank besar.
   - Di babak inilah gerakan berkelanjutan rill dinikmati.

---

### Cara Kita Membuka Posisi Berbasis AMD:
Jangan pernah bertransaksi sewaktu harga berada di babak akumulasi. Duduk dengan santai dan biarkan babak manipulasi terjadi menyapu salah satu ujung terjauh akumulasi. Begitu sumbu lilin memantul tajam meninggalkan ekor menyapu likuiditas, masuklah searah dengan babak distribusi.`,
    summary: "Power of 3 memetakan siklus pergerakan harian: Akumulasi jenuh, Manipulasi sapu bersih stop loss lawan, dan Distribusi ekspansi kencang searah bank."
  },
  {
    id: "m7",
    title: "Lesson 7: Teori Rentang Lilin (Candle Range Theory - CRT)",
    category: "Teknis",
    level: "Menengah",
    readTime: "6 menit membaca",
    content: `### Dasar Candle Range Theory (CRT)
Candle Range Theory (CRT) adalah teknik membaca perilaku satu lilin dominan berukuran besar di skala kerangka waktu tinggi (HTF) untuk menentukan area batas transaksi harian scalping yang mutakhir.

Dalam CRT, kita mengincar satu lilin penentu arah tren yang disebut **CRT Candle**.

---

### Syarat Sahnya Lilin Kategori A+ CRT Candle:
1. **Badan Tebal (High-Volume Body):** Tubuh lilin (body) wajib dominan, kokoh, dan tebal, mencerminkan pesanan mutlak institusi yang terarah.
2. **Sumbu Tipis (Low-Volume Wicks):** Ekor sumbu atas dan bawah lilin harus sangat tipis / pendek, mengindikasikan ketiadaan penolakan ekstrim di sisa waktu sesi tersebut.

---

### Struktur Anatomi Penting CRT:
Begitu Anda menemukan lilin CRT valid pada kerangka waktu harian atau **H1 (1 Jam)**, tarik garis penanda batas horizontal penting berikut:
- **CRTH (CRT High):** Ujung ekor tertinggi lilin CRT.
- **CRTL (CRT Low):** Ujung ekor terendah lilin CRT.
- **50% Equilibrium (Median):** Garis tengah tepat pembagi tubuh lilin CRT menjadi dua bagian seimbang.

---

### Aturan Peta Tren CRT:
- **Zona Premium (Di atas level 50% hingga CRTH):** Wilayah mahal, kami hanya berfokus mencari peluang penolakan untuk beraksi **Jual (SELL)**.
- **Zona Diskon (Di bawah level 50% hingga CRTL):** Wilayah murah/diskon, kami hanya berfokus mencari peluang tolakan untuk beraksi **BELI (BUY)**.
- Hindari membuka transaksi baru tepat di garis tengah 50% karena rawan guncangan harga dua arah.`,
    summary: "CRT mencari satu lilin bertubuh tebal di HTF (H1) lalu membagi strukturnya: High (CRTH), Low (CRTL), dan Median 50% untuk filter area Jual/Beli murni."
  },
  {
    id: "m8",
    title: "Lesson 8: Formula Turtle Body Soup (TBS) & Konfirmasi Model #1",
    category: "Teknis",
    level: "Menengah",
    readTime: "6 menit membaca",
    content: `### Menyatukan CRT dengan Turtle Body Soup (TBS)
Turtle Body Soup (TBS) adalah puncak teoretis scalping kilat paling mematikan. TBS secara spesifik melacak momen manipulasi lilin di kerangka waktu mikro **LTF 1 Menit (M1)** yang terjadi pada batas-batas kritis CRT (CRTH/CRTL).

---

### Perbedaan Krusial: TBS vs TWS
1. **TBS (Turtle Body Soup - Akurasi Tinggi / A+):**
   - Terjadi ketika lilin manipulasi pertama melesat melintasi batas CRTH/CRTL, dan ditutup dengan **Tubuh Lilin (Body Close)** nyata melintasi garis tersebut.
   - Skenario ini memicu perangkap emosional ritel yang menyangka harga breakout besar, padahal ia sedang diumpan sebelum likuiditasnya disapu.

2. **TWS (Turtle Wick Soup - Akurasi Rendah):**
   - Terjadi saat lilin hanya sempat menembus garis dengan sumbu (wick) tipis lalu ditarik mundur sebelum penutupan lilin. Ini berisiko tinggi karena daya manipulasi institusinya tumpul.

---

### Langkah Konfirmasi Model #1 (Langkah Masuk Transaksi):
Jangan langsung membuka transaksi saat TBS terbentuk harian. Selalu tunggu kemunculan **Model #1**:

1. Setelah Lilin TBS (Body Close melintasi CRTH/CRTL) selesai, tunggu lilin berikutnya meluncur deras kembali masuk ke dalam rentang CRT semula.
2. Lilin pembalikan arah ini wajib berukuran besar dan kokoh (**Thick Orderblock Candle**). Ini dinamakan **Model #1 Candle**.
3. **Trigger Titik Masuk (Entry):** Masuklah seketika tepat pada penutupan lilin Model #1 tersebut.
4. **Target Keuntungan (Take Profit):**
   - **TP 1:** Garis tengah 50% Equilibrium CRT (pasti tercapai dengan rasio keandalan 90%).
   - **TP 2:** Ujung batas terjauh CRTL / CRTH (100% Retracement).

---

### Manajemen Risiko Berbasis TBS:
Letakkan Stop Loss Anda beberapa pips tipis saja di atas/bawah ekor lilin TBS. Aturan ini sangat aman karena jika mitigasi Model #1 gagal, kerugian Anda sangat kecil (rasio RR minimal mencapai 1:3 hingga 1:10+).`,
    summary: "TBS melacak manipulasi penutupan body candle (Body Close) di LTF (1m) di atas CRTH/CRTL. Masuklah secepatnya pasca lilin pembalikan Model #1 terbentuk."
  }
];
