// Helper Modulo Matematika Presisi
function mod(n, m) {
    return ((n % m) + m) % m;
}

// Helper Julian Day Number (JDN)
function getJDN(year, month, day) {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('primbonForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nama = document.getElementById('nama').value.trim();
        const tglRaw = document.getElementById('tglLahir').value;
        const jamInput = document.getElementById('jamLahir').value;

        if (!tglRaw) return;

        let [year, month, day] = tglRaw.split('-').map(Number);
        let dateObj = new Date(year, month - 1, day);

        let catatanJam = "Pukul kelahiran tidak diisi (Standar hitungan sebelum Maghrib/Surup).";

        // Paugeran Betaljemur: Pergantian hari Jawa terjadi saat Maghrib (>= 18:00 WIB)
        if (jamInput) {
            const [jam, menit] = jamInput.split(':').map(Number);
            if (jam >= 18) {
                dateObj.setDate(dateObj.getDate() + 1);
                year = dateObj.getFullYear();
                month = dateObj.getMonth() + 1;
                day = dateObj.getDate();
                catatanJam = `Lahir pukul ${jamInput} WIB (Masuk pergantian hari Jawa/setelah Maghrib).`;
            } else {
                catatanJam = `Lahir pukul ${jamInput} WIB (Sebelum pergantian hari Jawa/Maghrib).`;
            }
        }

        const hasil = kalkulasiPrimbonBetaljemur(nama, year, month, day);
        tampilkanHasil(nama, hasil, catatanJam);
    });
});

function kalkulasiPrimbonBetaljemur(nama, year, month, day) {
    const jdn = getJDN(year, month, day);
    
    // Anchor Terverifikasi Betaljemur: 10 Desember 1973 = JDN 2442027 (Senin Pon, Wuku Sinta)
    const anchorJDN = 2442027;
    const diff = jdn - anchorJDN;

    const listDina = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const listPasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

    // 1. Dina & Pasaran
    const dina = listDina[mod(1 + diff, 7)];
    const pasaran = listPasaran[mod(2 + diff, 5)];

    const neptuD = PRIMBON_DATA.neptuDina[dina];
    const neptuP = PRIMBON_DATA.neptuPasaran[pasaran];
    const totalNeptu = neptuD + neptuP;

    // 2. Pawukon / Wuku
    const wukuIdx = Math.floor(mod(1 + diff, 210) / 7);
    const wuku = PRIMBON_DATA.wukuList[wukuIdx];

    // 3. Paringkelan (Sadwara), Padewan (Astawara), Padangon (Sangawara)
    const paringkelan = PRIMBON_DATA.sadwaraList[mod(1 + diff, 6)];
    const padewan = PRIMBON_DATA.astawaraList[mod(1 + diff, 8)];
    const padangon = PRIMBON_DATA.sangawaraList[mod(7 + diff, 9)];

    // 4. Pancasuda & Eka Jala Rsi
    const pancaSuda = PRIMBON_DATA.pancasudaList[totalNeptu % 7];
    const ekaJalaRsi = PRIMBON_DATA.ekaJalaRsiList[totalNeptu % 7];

    // 5. Pranata Mangsa
    const mangsa = getPranataMangsaBetaljemur(month, day);

    // 6. Lintang Jawa & Sasi Jawa
    const lintang = PRIMBON_DATA.lintangJawa[mod(totalNeptu, 10)];
    const sasi = PRIMBON_DATA.sasiJawa[mod(month - 1, 12)];

    // 7. Tahun Jawa Sultan Agung & Windu + Lambang
    const lunarDrift = (year - 1633) * 0.0307;
    const tahunJawaVal = Math.floor(1555 + (year - 1633) + lunarDrift);
    const namaTahunJawa = PRIMBON_DATA.tahunJawaList[mod(tahunJawaVal - 1, 8)];
    const winduObj = PRIMBON_DATA.winduList[mod(Math.floor((tahunJawaVal - 1) / 8), 4)];

    // 8. Hitungan Numerologi Nama (Hanacaraka)
    let totalHitunganNama = 0;
    const cleanNama = nama.toLowerCase().replace(/[^a-z]/g, '');
    for (let char of cleanNama) {
        totalHitunganNama += PRIMBON_DATA.hanacaraka[char] || 1;
    }

    return {
        dina, pasaran, totalNeptu, wuku, pancaSuda, ekaJalaRsi, mangsa,
        peringkelan, padewan, padangon, lintang, sasi,
        hitNama: totalHitunganNama,
        tahunJawa: `${tahunJawaVal} Jawa (${namaTahunJawa})`,
        windu: `Windu ${winduObj.nama} - Lambang ${winduObj.lambang}`
    };
}

function getPranataMangsaBetaljemur(m, d) {
    if ((m === 6 && d >= 22) || (m === 7) || (m === 8 && d <= 1)) return "Kasa (22 Jun - 1 Ags)";
    if ((m === 8 && d >= 2) || (m === 8 && d <= 24)) return "Karo (2 Ags - 24 Ags)";
    if ((m === 8 && d >= 25) || (m === 9 && d <= 17)) return "Katelu (25 Ags - 17 Sep)";
    if ((m === 9 && d >= 18) || (m === 10 && d <= 12)) return "Kapat (18 Sep - 12 Okt)";
    if ((m === 10 && d >= 13) || (m === 11 && d <= 8)) return "Kalima (13 Okt - 8 Nov)";
    if ((m === 11 && d >= 9) || (m === 12 && d <= 21)) return "Kanem (9 Nov - 21 Des)";
    if ((m === 12 && d >= 22) || (m === 1) || (m === 2 && d <= 2)) return "Kapitu (22 Des - 2 Feb)";
    if ((m === 2 && d >= 3) || (m === 2 && d <= 29)) return "Kawolu (3 Feb - 29 Feb)";
    if ((m === 3 && d >= 1) || (m === 3 && d <= 25)) return "Kasanga (1 Mar - 25 Mar)";
    if ((m === 3 && d >= 26) || (m === 4 && d <= 18)) return "Kasedya (26 Mar - 18 Apr)";
    if ((m === 4 && d >= 19) || (m === 5 && d <= 11)) return "Jesta (19 Apr - 11 Mei)";
    return "Sadha (12 Mei - 21 Jun)";
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
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Eka Jala Rsi:</b> ${res.ekaJalaRsi}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Pranata Mangsa:</b> ${res.mangsa}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Lintang / Bintang Jawa:</b> ${res.lintang}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Bulan Jawa (Sasi):</b> ${res.sasi}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Padewan (Astawara):</b> ${res.padewan}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Paringkelan (Sadwara):</b> ${res.peringkelan}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Padangon (Sangawara):</b> ${res.padangon}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Tahun Jawa & Windu:</b> ${res.tahunJawa} / ${res.windu}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Bobot Nama (Hanacaraka):</b> ${res.hitNama}</div>
    `;

    document.getElementById('resWatak').innerText = `${nama} yang lahir pada ${res.dina} ${res.pasaran} (Neptu ${res.totalNeptu}) memiliki karakter dasar berwawasan luas, tekun, disegani, serta berpendirian kuat menurut kitab Primbon Betaljemur Adammakna.`;
    document.getElementById('resKarir').innerText = `Sangat cocok berkarier sebagai konsultan, pimpinan usaha, pengajar, atau profesi mandiri yang membutuhkan pemikiran strategis.`;
    document.getElementById('resRejeki').innerText = `Naungan ${res.pancaSuda} menunjukkan rejeki yang stabil bagaikan air mengalir dan mencapai keemasan pada usia dewasa matang.`;
    document.getElementById('resJodoh').innerText = `Cocok berpasangan dengan pemilik Neptu 8, 13, atau 18 (seperti Selasa Legi, Kamis Legi, atau Sabtu Pahing).`;
    document.getElementById('resHariNaas').innerText = `Disarankan lebih berhati-hati membuat keputusan besar pada hari naas (selisih 4 hari dari hari kelahiran).`;

    const container = document.getElementById('hasilPrimbon');
    container.classList.remove('hidden');
    container.scrollIntoView({ behavior: 'smooth' });
}
