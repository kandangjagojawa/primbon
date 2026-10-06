let dbData = {};

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

// Load Dataset JSON
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

    let catatanJam = "Pukul kelahiran tidak diisi (Standar hitungan sebelum Maghrib/Surup).";

    // Paugeran Betaljemur: Pergantian Hari Jawa terjadi saat Maghrib (>= 18:00 WIB)
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

function kalkulasiPrimbonBetaljemur(nama, year, month, day) {
    const jdn = getJDN(year, month, day);

    // Anchor Terverifikasi Betaljemur: 10 Desember 1973 = JDN 2442027 (Senin Pon, Wuku Sinta)
    const anchorJDN = 2442027;
    const diff = jdn - anchorJDN;

    const listDina = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const listPasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

    // 1. Weton & Neptu
    const dinaIdx = mod(1 + diff, 7);
    const pasaranIdx = mod(2 + diff, 5);
    const dina = listDina[dinaIdx];
    const pasaran = listPasaran[pasaranIdx];

    const neptuD = dbData.neptuDina[dina];
    const neptuP = dbData.neptuPasaran[pasaran];
    const totalNeptu = neptuD + neptuP;

    // 2. Wuku (Siklus Pawukon 210 Hari)
    const pawukonDay = mod(1 + diff, 210);
    const wukuIdx = Math.floor(pawukonDay / 7);
    const wuku = dbData.wukuList[wukuIdx];

    // 3. Sadwara / Paringkelan (6 Hari)
    const sadwaraIdx = mod(1 + diff, 6);
    const paringkelan = dbData.sadwaraList[sadwaraIdx];

    // 4. Astawara / Padewan (8 Hari)
    const astawaraIdx = mod(1 + diff, 8);
    const padewan = dbData.astawaraList[astawaraIdx];

    // 5. Sangawara / Padangon (9 Hari)
    const sangawaraIdx = mod(7 + diff, 9);
    const padangon = dbData.sangawaraList[sangawaraIdx];

    // 6. Pancasuda (Pitung Parangan Betaljemur: Neptu % 7)
    const pancaSudaIdx = totalNeptu % 7;
    const pancaSuda = dbData.pancasudaBetaljemur[pancaSudaIdx];

    // 7. Pranata Mangsa (Presisi Berdasarkan Surya/Tanggal Masehi Betaljemur)
    const mangsa = getPranataMangsaBetaljemur(month, day);

    // 8. Hitung Tahun Jawa Sultan Agung & Windu
    // Drift lunar Sultan Agung ~0.0307 per tahun dari tahun 1633 M (1555 Jawa)
    const lunarDrift = (year - 1633) * 0.0307;
    const tahunJawaVal = Math.floor(1555 + (year - 1633) + lunarDrift);
    
    const namaTahunJawa = dbData.tahunJawaList[mod(tahunJawaVal - 1, 8)];
    const windu = dbData.winduList[mod(Math.floor((tahunJawaVal - 1) / 8), 4)];

    // 9. Hitungan Nama (Aksara Jawa Hanacaraka)
    let totalHitunganNama = 0;
    const cleanNama = nama.toLowerCase().replace(/[^a-z]/g, '');
    for (let char of cleanNama) {
        totalHitunganNama += dbData.hanacaraka[char] || 1;
    }

    return {
        dina, pasaran, totalNeptu, wuku, pancaSuda, mangsa,
        peringkelan, padewan, padangon,
        hitNama: totalHitunganNama,
        tahunJawa: `${tahunJawaVal} Jawa (Tahun ${namaTahunJawa})`,
        windu: `Windu ${windu}`
    };
}

// Fungsi Pranata Mangsa Baku Betaljemur Adammakna
function getPranataMangsaBetaljemur(m, d) {
    if ((m === 6 && d >= 22) || (m === 7) || (m === 8 && d <= 1)) return "Kasa (22 Jun - 1 Ags)";
    if ((m === 8 && d >= 2) || (m === 8 && d <= 24)) return "Karo (2 Ags - 24 Ags)";
    if ((m === 8 && d >= 25) || (m === 9 && d <= 17)) return "Katelu (25 Ags - 17 Sep)";
    if ((m === 9 && d >= 18) || (m === 10 && d <= 12)) return "Kapat (18 Sep - 12 Okt)";
    if ((m === 10 && d >= 13) || (m === 11 && d <= 8)) return "Kalima (13 Okt - 8 Nov)";
    if ((m === 11 && d >= 9) || (m === 12 && d <= 21)) return "Kanem (9 Nov - 21 Des)";
    if ((m === 12 && d >= 22) || (m === 1) || (m === 2 && d <= 2)) return "Kapitu (22 Des - 2 Feb)";
    if ((m === 2 && d >= 3) || (m === 2 && d <= 28) || (m === 2 && d <= 29)) return "Kawolu (3 Feb - 28/29 Feb)";
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
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Pranata Mangsa:</b> ${res.mangsa}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Padewan (Astawara):</b> ${res.padewan}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Paringkelan (Sadwara):</b> ${res.peringkelan}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Padangon (Sangawara):</b> ${res.padangon}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Tahun Jawa & Windu:</b> ${res.tahunJawa} / ${res.windu}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Bobot Nama (Hanacaraka):</b> ${res.hitNama}</div>
    `;

    document.getElementById('resWatak').innerText = `${nama} yang lahir pada weton ${res.dina} ${res.pasaran} (Neptu ${res.totalNeptu}) berada di bawah naungan Wuku ${res.wuku} serta Pancasuda ${res.pancaSuda}. Memiliki karakter teguh, berwawasan luas, serta disegani sesama menurut kitab Betaljemur Adammakna.`;
    document.getElementById('resKarir').innerText = `Sangat serasi memimpin, berwiraswasta, atau menjadi penasihat/konsultan sesuai watak Pancasuda-nya.`;
    document.getElementById('resRejeki').innerText = `Siklus rejeki berjalan stabil dan mengalami peningkatan di usia matang.`;
    document.getElementById('resJodoh').innerText = `Cocok berpasangan dengan weton ber-Neptu 8, 13, atau 18 (seperti Selasa Legi, Kamis Legi, atau Sabtu Pahing).`;
    document.getElementById('resHariNaas').innerText = `Disarankan lebih berhati-hati saat membuat hajat besar pada hari naas (pancasuda selisih 4 hari dari hari lahir).`;

    document.getElementById('hasilPrimbon').classList.remove('hidden');
}
