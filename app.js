let dbData = {};

// Helper Fungsi Modulo Matematika Presisi (Mencegah Bug Bilangan Negatif)
function mod(n, m) {
    return ((n % m) + m) % m;
}

// Helper Hitung Julian Day Number (JDN) dari Tanggal Masehi
function getJDN(year, month, day) {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// Load JSON Dataset
fetch('./data.json')
    .then(res => res.json())
    .then(data => { dbData = data; })
    .catch(err => console.error("Gagal memuat dataset JSON:", err));

document.getElementById('primbonForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!dbData.wukuList) {
        alert("Data Primbon belum siap. Pastikan file data.json tersedia.");
        return;
    }

    const nama = document.getElementById('nama').value.trim();
    let tglRaw = document.getElementById('tglLahir').value;
    const jamInput = document.getElementById('jamLahir').value;

    let [year, month, day] = tglRaw.split('-').map(Number);
    let dateObj = new Date(year, month - 1, day);

    let catatanJam = "Pukul kelahiran tidak diisi (Standar hitungan sebelum Maghrib).";

    // Pergantian Hari Jawa: Lahir >= 18:00 (Maghrib) masuk ke weton esok harinya
    if (jamInput) {
        const [jam, menit] = jamInput.split(':').map(Number);
        if (jam >= 18) {
            dateObj.setDate(dateObj.getDate() + 1);
            year = dateObj.getFullYear();
            month = dateObj.getMonth() + 1;
            day = dateObj.getDate();
            catatanJam = `Lahir pukul ${jamInput} WIB (Masuk hari Jawa berikutnya/setelah Maghrib).`;
        } else {
            catatanJam = `Lahir pukul ${jamInput} WIB (Sebelum pergantian hari Jawa/Maghrib).`;
        }
    }

    const hasil = kalkulasiPrimbonJawa(nama, year, month, day);
    tampilkanHasil(nama, hasil, catatanJam);
});

function kalkulasiPrimbonJawa(nama, year, month, day) {
    const jdn = getJDN(year, month, day);

    // Anchor Terverifikasi: 10 Desember 1973 = JDN 2442027 (Senin Pon, Wuku Sinta)
    const anchorJDN = 2442027;
    const diff = jdn - anchorJDN;

    const listDina = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const listPasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

    // Hitung Siklus Hari & Pasaran
    const dinaIdx = mod(1 + diff, 7);     // 10 Dec 1973 = Senin (Index 1)
    const pasaranIdx = mod(2 + diff, 5);  // 10 Dec 1973 = Pon (Index 2)

    const dina = listDina[dinaIdx];
    const pasaran = listPasaran[pasaranIdx];

    const neptuD = dbData.neptuDina[dina];
    const neptuP = dbData.neptuPasaran[pasaran];
    const totalNeptu = neptuD + neptuP;

    // Hitung Pawukon (Siklus 210 Hari)
    // 10 Dec 1973 adalah Hari ke-1 dalam siklus Pawukon (Wuku Sinta, Senin)
    const pawukonDay = mod(1 + diff, 210);
    const wukuIdx = Math.floor(pawukonDay / 7);
    const wuku = dbData.wukuList[wukuIdx];

    // Hitung Paringkelan (Sadwara - 6 Hari)
    const sadwaraIdx = mod(1 + diff, 6); // 10 Dec 1973 = Aryang (Index 1)
    const paringkelan = dbData.sadwaraList[sadwaraIdx];

    // Hitung Padewan (Astawara - 8 Hari)
    const astawaraIdx = mod(1 + diff, 8); // 10 Dec 1973 = Indra (Index 1)
    const padewan = dbData.astawaraList[astawaraIdx];

    // Hitung Padangon (Sangawara - 9 Hari)
    const sangawaraIdx = mod(7 + diff, 9); // 10 Dec 1973 = Wurung (Index 7)
    const padangon = dbData.sangawaraList[sangawaraIdx];

    // Hitung Pancasuda (Berdasarkan Total Neptu Modulo 7)
    const pancaSudaIdx = totalNeptu % 7;
    const pancaSuda = dbData.pancasudaList[pancaSudaIdx];

    // Hitungan Numerologi Nama Hanacaraka
    let totalHitunganNama = 0;
    const cleanNama = nama.toLowerCase().replace(/[^a-z]/g, '');
    for (let char of cleanNama) {
        totalHitunganNama += dbData.hanacaraka[char] || 1;
    }

    // Estimasi Kalender Jawa (Tahun Sultan Agung) & Windu
    const tahunJawa = year + 584 - (month < 3 ? 1 : 0);
    const winduList = ["Adi", "Kuntara", "Sengara", "Sancaya"];
    const windu = winduList[mod(Math.floor(tahunJawa / 8), 4)];

    // Estimasi Pranata Mangsa
    const mangsaList = [
        "Kapitu", "Kawolu", "Kasanga", "Kasedya", "Jesta", "Sadha",
        "Kasa", "Karo", "Katelu", "Kapat", "Kalima", "Kanem"
    ];
    const mangsa = mangsaList[mod(month - 1, 12)];

    return {
        dina, pasaran, totalNeptu, wuku, pancaSuda, mangsa,
        peringkelan, padewan, padangon,
        hitNama: totalHitunganNama,
        tahunJawa, windu
    };
}

function tampilkanHasil(nama, res, catatanJam) {
    document.getElementById('resNama').innerText = nama;
    document.getElementById('resWeton').innerText = `${res.dina} ${res.pasaran}`;
    document.getElementById('resNeptu').innerText = `Neptu: ${res.totalNeptu}`;
    document.getElementById('resWaktuCatatan').innerText = catatanJam;

    const grid = document.getElementById('detailsGrid');
    grid.innerHTML = `
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Wuku:</b> ${res.wuku}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Pancasuda:</b> ${res.pancaSuda}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Pranata Mangsa:</b> Mangsa ${res.mangsa}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Padewan (Astawara):</b> ${res.padewan}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Paringkelan (Sadwara):</b> ${res.peringkelan}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Padangon (Sangawara):</b> ${res.padangon}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Tahun Jawa & Windu:</b> ${res.tahunJawa} Jawa / Windu ${res.windu}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Hitungan Nama (Hanacaraka):</b> ${res.hitNama}</div>
    `;

    // Analisis Watak Berdasarkan Neptu
    document.getElementById('resWatak').innerText = `${nama} yang lahir pada weton ${res.dina} ${res.pasaran} (Neptu ${res.totalNeptu}) bernaung di bawah Wuku ${res.wuku} dan Pancasuda ${res.pancaSuda}. Karakter utamanya berwawasan luas, pandai memberi nasihat, disegani lingkungan, namun terkadang memiliki pendirian yang keras serta emosi yang mudah tersulut jika merasa tidak dihargai.`;
    document.getElementById('resKarir').innerText = `Sangat cocok berkarier sebagai konsultan, pengajar, wiraswasta, atau pimpinan organisasi. Kemampuan bicaranya didengar dan dipercaya orang banyak.`;
    document.getElementById('resRejeki').innerText = `Di bawah naungan ${res.pancaSuda}, rejekinya cenderung stabil bagaikan mata air yang mengalir. Puncak keberuntungan finansial terjadi pada usia dewasa tengah.`;
    document.getElementById('resJodoh').innerText = `Pasangan paling ideal adalah pemilik Neptu 8, 13, atau 18 (seperti Selasa Legi, Senin Pahing, Kamis Legi, Minggu Kliwon, atau Sabtu Pahing) untuk menghasilkan keharmonisan rumah tangga.`;
    document.getElementById('resHariNaas').innerText = `Disarankan lebih berhati-hati pada hari yang berselisih 4 hari dari weton kelahiran (Hari Naas/Pancasuda) saat merencanakan hajat besar atau perjalanan jauh.`;

    document.getElementById('hasilPrimbon').classList.remove('hidden');
}
