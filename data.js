window.PRIMBON_DATA = {
    // 1. Hari, Pasaran, dan Neptu
    hariList: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    pasaranList: ["Legi", "Pahing", "Pon", "Wage", "Kliwon"],
    neptuHari: { 
        Minggu: 5, 
        Senin: 4, 
        Selasa: 3, 
        Rabu: 7, 
        Kamis: 8, 
        Jumat: 6, 
        Sabtu: 9 
    },
    neptuPasaran: { 
        Legi: 5, 
        Pahing: 9, 
        Pon: 7, 
        Wage: 4, 
        Kliwon: 8 
    },

    // 2. Siklus Makro (Wuku, Tahun, Windu, Sasi)
    wukuList: [
        "Sinta", "Landep", "Wukir", "Kurantil", "Tolu", "Gumbreg", 
        "Warigalit", "Warigagung", "Julungwangi", "Sungsang", "Galungan", "Kuningan", 
        "Langkir", "Mandasiya", "Julungpujud", "Pahang", "Kuruwelut", "Marakeh", 
        "Tambir", "Medangkungan", "Maktal", "Wuye", "Manahil", "Prangbakat", 
        "Bala", "Wugu", "Wayang", "Kulawu", "Dukut", "Watugunung"
    ],
    tahunList: ["Alip", "Ehe", "Jimawal", "Je", "Dal", "Be", "Wawu", "Jimakir"],
    winduList: ["Adi", "Kuntara", "Sengara", "Sancaya"],
    bulanJawaList: [
        "Sura", "Sapar", "Mulud", "Bakdamulud", "Jumadilawal", "Jumadilakir", 
        "Rejeb", "Ruwah", "Pasa", "Sawal", "Dulkangidah", "Besar"
    ],

    // 3. Siklus Mikro & Harian
    lintangList: [
        "Yuyu", "Kuda", "Gajah", "Kiriman", "Tiwa-tiwa", "Lembu", "Patrem", 
        "Kerbau", "Sapi", "Buta", "Kebo", "Asu", "Naga", "Rusa", 
        "Lintah", "Ulat", "Macan", "Kutu", "Baya", "Semut", "Kepiting", 
        "Kerang", "Cacing", "Banteng", "Banyak Angrem", "Babi Hutan", "Harimau", 
        "Anjing", "Ular", "Alap-alap", "Kucing", "Kambing", "Kerbau Bule", "Garuda", "Bintang"
    ],
    padewanList: ["Aring", "Luma", "Wurung", "Lintang", "Watu", "Wogan"],
    paringkelanList: [
        "Aring", "Lumpang", "Wurung", "Panji", "Was", "Maulu", "Tunggal", 
        "Tilu", "Jagur", "Sungsang", "Ginurut", "Manah", "Gembuk", "Surung", 
        "Bumbung", "Kala", "Kuning", "Langkir", "Mandasiya", "Julung", "Pahang", 
        "Kuruwelut", "Marakeh", "Tambir", "Medang", "Maktal", "Wuye"
    ],
    pancasudaList: [
        "Sumur Sinaba", "Bumi Kapetak", "Satria Wibawa", "Satria Wirang", 
        "Satria Wibawa Luhur", "Bumi Kapetak Keras", "Lebu Katiup Angin"
    ],
    ekaJalaRsiList: [
        "Eka Wara - Kinurung Dewa", 
        "Dwi Wara - Papas", 
        "Tri Wara - Paningron", 
        "Catur Wara - Menala"
    ],

    // 4. Pembagian Waktu Jam Kelahiran (Wanci)
    wanciList: [
        { label: "Tengah Malam", range: "00:00 - 02:59", start: 0, end: 2.99 },
        { label: "Sepertiga Malam", range: "03:00 - 04:59", start: 3, end: 4.99 },
        { label: "Pagi", range: "05:00 - 06:59", start: 5, end: 6.99 },
        { label: "Pagi Menjelang Siang", range: "07:00 - 09:59", start: 7, end: 9.99 },
        { label: "Siang", range: "10:00 - 11:59", start: 10, end: 11.99 },
        { label: "Bedug", range: "12:00 - 14:59", start: 12, end: 14.99 },
        { label: "Sore", range: "15:00 - 17:59", start: 15, end: 17.99 },
        { label: "Petang", range: "18:00 - 20:59", start: 18, end: 20.99 },
        { label: "Malam", range: "21:00 - 23:59", start: 21, end: 23.99 }
    ],

    // 5. Pranata Mangsa (Matahari)
    mangsaData: [
        { name: "Kasa", start: { m: 6, d: 22 }, end: { m: 8, d: 1 }, watak: "Pemarah tapi pemberani, berjiwa besar dan suka tantangan." },
        { name: "Karo", start: { m: 8, d: 2 }, end: { m: 8, d: 24 }, watak: "Pendiam, lincah, pandai menyimpan rahasia." },
        { name: "Katelu", start: { m: 8, d: 25 }, end: { m: 9, d: 17 }, watak: "Berhati lembut, gampang kasihan, rejeki mengalir." },
        { name: "Kapat", start: { m: 9, d: 18 }, end: { m: 10, d: 12 }, watak: "Banyak akal, pandai bicara, disukai banyak orang." },
        { name: "Kalima", start: { m: 10, d: 13 }, end: { m: 11, d: 9 }, watak: "Sabar tapi pencemburu, tekun bekerja." },
        { name: "Kanem", start: { m: 11, d: 10 }, end: { m: 12, d: 21 }, watak: "Murah hati, rajin, kadang ceroboh dalam bicara." },
        { name: "Kapitu", start: { m: 12, d: 22 }, end: { m: 2, d: 2 }, watak: "Banyak rejeki tapi boros, berwibawa." },
        { name: "Kawolu", start: { m: 2, d: 3 }, end: { m: 2, d: 26 }, watak: "Baik budi, lembut, sering menjadi penengah." },
        { name: "Kasanga", start: { m: 2, d: 27 }, end: { m: 3, d: 25 }, watak: "Pemaaf, pandangan luas, kadang pelupa." },
        { name: "Kasepuluh", start: { m: 3, d: 26 }, end: { m: 4, d: 18 }, watak: "Berani berkorban, setia kawan, tegas." },
        { name: "Destha", start: { m: 4, d: 19 }, end: { m: 5, d: 11 }, watak: "Keras kepala, pekerja keras, jarang mengeluh." },
        { name: "Sadha", start: { m: 5, d: 12 }, end: { m: 6, d: 21 }, watak: "Tenang, dingin, pandai menyimpan amarah." }
    ],

    // 6. Database Watak Berdasarkan 35 Kombinasi Weton
    watakWeton: {
        "Minggu Legi": "Pancasuda Sumur Sinaba. Berjiwa pemurah, mudah memaafkan, dan kerap dimintai nasihat atau petunjuk oleh orang sekitar.",
        "Minggu Pahing": "Lakunya Rembulan. Memiliki daya pikat tinggi, cerdas, berwawasan luas, namun kadang cenderung angkuh.",
        "Minggu Pon": "Lakunya Bumi. Berhati teguh, dermawan, setia kawan, tetapi jika marah sulit untuk mereda.",
        "Minggu Wage": "Lakunya Angin. Mudah bergaul, berjiwa penolong, tetapi rawan terpengaruh oleh lingkungan sekitar.",
        "Minggu Kliwon": "Lakunya Lintang. Pendiam, penyabar, memiliki ketenangan batin, namun pemikirannya kadang sulit ditebak.",

        "Senin Legi": "Lakunya Angin. Ramah, bertata krama tinggi, pandai mengambil hati orang, namun tidak suka diatur.",
        "Senin Pahing": "Lakunya Bintang. Menyukai ketenangan, pandai menyimpan rahasia, tetapi punya sifat pemalu dan menyendiri.",
        "Senin Pon": "Lakunya Bulan. Cerdas, pekerja keras, berhati lurus, tetapi kemauannya sangat keras dan tidak suka diperintah.",
        "Senin Wage": "Lakunya Api. Bersemangat tinggi, jujur, setia, namun mudah tersulut emosi jika tersinggung.",
        "Senin Kliwon": "Lakunya Gunung. Berkeinginan kuat, ambisius, penuh pertimbangan, namun kadang terlalu waspada.",

        "Selasa Legi": "Lakunya Fire/Api. Tegas, pemberani, berjiwa pemimpin, namun teguh dengan pendirian hingga kadang keras kepala.",
        "Selasa Pahing": "Lakunya Bumi. Sabar, suka penolong, rajin bekerja, namun jika disakiti akan sangat dendam.",
        "Selasa Pon": "Lakunya Lintang. Cerdas, berjiwa puji, hemat, namun sering merasa ragu dalam mengambil keputusan.",
        "Selasa Wage": "Lakunya Angin. Penurut, berhati lembut, suka membantu, tetapi mudah terpengaruh dan kurang percaya diri.",
        "Selasa Kliwon": "Lakunya Gunung. Pandai berbicara, berwibawa, ramah, namun hatinya cenderung keras.",

        "Rabu Legi": "Lakunya Bintang. Menghormati tata krama, jujur, memegang teguh janji, namun suka membantah.",
        "Rabu Pahing": "Lakunya Gunung. Bijaksana, cermat, pandai berhemat, namun punya kecenderungan mencurigai orang lain.",
        "Rabu Pon": "Lakunya Rembulan. Penuh pesona, santun, disukai banyak orang, tetapi kurang tegas dalam mengambil keputusan.",
        "Rabu Wage": "Lakunya Bumi. Pembimbing yang baik, rajin, suka belajar, namun pemalu dan penakut.",
        "Rabu Kliwon": "Lakunya Sun/Matahari. Penuh energi, tegas, menjadi pencerah bagi orang lain, namun tidak suka dikritik.",

        "Kamis Legi": "Lakunya Angin. Mandiri, bercita-cita tinggi, bijaksana, namun tidak suka terikat aturan ketat.",
        "Kamis Pahing": "Lakunya Gunung. Berwawasan luas, rajin, giat mencari rezeki, tetapi mudah tersinggung.",
        "Kamis Pon": "Lakunya Sun/Matahari. Berwibawa, berani membela kebenaran, menjadi tempat perlindungan, tetapi agak hemat berlebihan.",
        "Kamis Wage": "Lakunya Bintang. Penyabar, tahan menderita, penurut, namun mudah bingung jika menghadapi masalah berat.",
        "Kamis Kliwon": "Lakunya Bumi. Berhati emas, suka menolong, setia, tetapi mudah tertipu karena terlalu percaya orang.",

        "Jumat Legi": "Lakunya Air. Menentramkan, berhati jujur, suka memberi, tetapi agak boros dan emosinya tidak stabil.",
        "Jumat Pahing": "Lakunya Sun/Matahari. Berani, pandai bergaul, berjiwa pemimpin, namun kadang pendendam.",
        "Jumat Pon": "Lakunya Bintang. Menyukai kebersihan, rendah hati, berhati lembut, tetapi mudah terpengaruh sanjungan.",
        "Jumat Wage": "Lakunya Gunung. Pendiam, berhati mulia, suka menolong tanpa pamrih, tetapi mudah curiga.",
        "Jumat Kliwon": "Lakunya Rembulan. Memiliki daya tarik magis/pesona, disukai banyak orang, pandai mencuri perhatian.",

        "Sabtu Legi": "Lakunya Angin. Pandai bergaul, berjiwa besar, santai, tetapi kadang kurang disiplin.",
        "Sabtu Pahing": "Lakunya Api. Sangat pemberani, pantang menyerah, dermawan, namun cepat marah dan cepat pula mereda.",
        "Sabtu Pon": "Lakunya Air. Tenang, pandai mengatur keuangan, adil, tetapi kalau marah sulit dimaafkan.",
        "Sabtu Wage": "Lakunya Bintang. Mandiri, jujur, hemat, tidak suka merepotkan orang lain, namun suka menyendiri.",
        "Sabtu Kliwon": "Lakunya Gunung. Keramahan tinggi, lemah lembut, sabar, serta menjadi penengah yang baik."
    },

    // 7. Database Bakat & Kelemahan Berdasarkan Lintang
    watakLintang: {
        Yuyu: { bakat: "Teliti, pandai menjaga harta, setia.", lemah: "Keras kepala, lambat mengambil keputusan." },
        Kuda: { bakat: "Lincah, pekerja keras, suka kebebasan.", lemah: "Mudah bosan, kurang sabar." },
        Gajah: { bakat: "Berbobot, dipercaya orang, memiliki ketahanan tinggi.", lemah: "Lambat bergerak, lambat menerima perubahan." },
        Kiriman: { bakat: "Pandai berdiplomasi, amanah, komunikatif.", lemah: "Sering ragu-ragu dan terlalu banyak menimbang." },
        "Tiwa-tiwa": { bakat: "Kreatif, cermat, pandai memanfaatkan peluang.", lemah: "Cenderung tertutup dan sering merasa cemas." },
        Lembu: { bakat: "Sabar, tekun, fokus pada tujuan jangka panjang.", lemah: "Kaku dalam bersikap, kikir." },
        Patrem: { bakat: "Tegas, cekatan, berani mengambil tindakan.", lemah: "Cenderung ceroboh dan kurang pertimbangan." },
        Kerbau: { bakat: "Kuat fisik dan mental, pekerja keras.", lemah: "Sulit diberi masukan, mudah tersinggung." },
        Sapi: { bakat: "Jujur, polos, berhati lembut.", lemah: "Gampang dimanfaatkan oleh orang lain." },
        Buta: { bakat: "Pantang menyerah, tangguh menghadapi kesulitan.", lemah: "Emosi kurang terkontrol, agresif." },
        Kebo: { bakat: "Ulet, tahan banting, setia pada tugas.", lemah: "Lambat beradaptasi pada situasi baru." },
        Asu: { bakat: "Setia kawan, waspada, pandai menjaga rahasia.", lemah: "Pencurigai, sulit percaya orang lain." },
        Naga: { bakat: "Berwibawa, berpikiran besar, berani.", lemah: "Tinggi hati, egois." },
        Rusa: { bakat: "Peka, memiliki intuisi tajam, cepat belajar.", lemah: "Penakut, gampang cemas." },
        Lintah: { bakat: "Penyabar, ulet, mengikat persaudaraan.", lemah: "Suka bergantung pada orang lain." },
        Ulat: { bakat: "Pandai menyesuaikan diri, hemat.", lemah: "Pendiam, kurang percaya diri." },
        Macan: { bakat: "Berani, mandiri, disegani banyak orang.", lemah: "Keras kepala, mudah emosi." },
        Kutu: { bakat: "Pencermat detail, hemat, tekun.", lemah: "Sering meremehkan hal besar." },
        Baya: { bakat: "Sabar menunggu momen, tenang, tajam.", lemah: "Dingin, pendendam." },
        Semut: { bakat: "Suka bergotong-royong, rajin, disiplin.", lemah: "Mudah panik saat sendirian." },
        Kepiting: { bakat: "Perlindungan kuat pada keluarga, ulet.", lemah: "Suka memendam perasaan." },
        Kerang: { bakat: "Kuat bertahan, hemat, pendiam.", lemah: "Tertutup dan sulit terbuka." },
        Cacing: { bakat: "Rendah hati, jujur, membawa ketenangan.", lemah: "Mudah minder, kurang ambisi." },
        Banteng: { bakat: "Pemberani, pelindung, berpendirian teguh.", lemah: "Tersulut jika diusik." },
        "Banyak Angrem": { bakat: "Penyayang, fokus menjaga stabilitas.", lemah: "Cemas berlebihan pada hal sepele." },
        "Babi Hutan": { bakat: "Pantang mundur, berani menerobos masalah.", lemah: "Kurang perhitungan, ceroboh." },
        Harimau: { bakat: "Wibawa tinggi, disegani, tangkas.", lemah: "Suka memerintah." },
        Anjing: { bakat: "Setia, jujur, cepat paham masalah.", lemah: "Terlalu sensitif." },
        Ular: { bakat: "Cerdas, tenang, taktik bagus.", lemah: "Sulit ditebak, dingin." },
        "Alap-alap": { bakat: "Fokus tinggi, cekatan, mandiri.", lemah: "Kurang bersosialisasi." },
        Kucing: { bakat: "Lincah, menarik hati, pandai adaptasi.", lemah: "Sering berubah pikiran." },
        Kambing: { bakat: "Suka kedamaian, nurut, pekerja lurus.", lemah: "Kurang berani mengambil risiko." },
        "Kerbau Bule": { bakat: "Unik, pemikiran maju, tekun.", lemah: "Merasa diri paling benar." },
        Garuda: { bakat: "Pandangan luas, cita-cita tinggi, berani.", lemah: "Kurang fokus pada detail kecil." },
        Bintang: { bakat: "Menjadi teladan, cerdas, pemikiran jernih.", lemah: "Sering merasa kesepian." }
    }
};
