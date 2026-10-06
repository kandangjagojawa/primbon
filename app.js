// Tangkap semua error Global ke layar agar tidak "diam saja"
window.onerror = function(msg, source, line) {
    const errBox = document.getElementById('errorLog');
    if (errBox) {
        errBox.textContent = `CRASH: ${msg} \n(Lokasi: baris ${line})`;
        errBox.classList.remove('hidden');
    }
};

function mod(n, m) { return ((n % m) + m) % m; }

function getJDN(year, month, day) {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('primbonForm');
    const errorLog = document.getElementById('errorLog');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Mencegah halaman me-refresh
        if (errorLog) errorLog.classList.add('hidden'); 

        try {
            // Validasi apakah data.js berhasil diload
            if (typeof window.PRIMBON_DATA === 'undefined') {
                throw new Error("Gagal membaca file data.js. Pastikan penulisan nama file di GitHub sama persis (huruf kecil semua) dan file sudah di-upload.");
            }

            const nama = document.getElementById('nama').value.trim();
            const tglRaw = document.getElementById('tglLahir').value;
            const jamInput = document.getElementById('jamLahir').value;

            if (!tglRaw) throw new Error("Tanggal lahir tidak terbaca.");

            let [year, month, day] = tglRaw.split('-').map(Number);
            let dateObj = new Date(year, month - 1, day);
            let catatanJam = "Pukul kelahiran tidak diisi (Standar hitungan sebelum Maghrib).";

            if (jamInput) {
                const [jam, menit] = jamInput.split(':').map(Number);
                if (jam >= 18) {
                    dateObj.setDate(dateObj.getDate() + 1);
                    year = dateObj.getFullYear();
                    month = dateObj.getMonth() + 1;
                    day = dateObj.getDate();
                    catatanJam = `Lahir pukul ${jamInput} WIB (Masuk pergantian hari Jawa esoknya / setelah Maghrib).`;
                } else {
                    catatanJam = `Lahir pukul ${jamInput} WIB (Sebelum pergantian hari Jawa / sebelum Maghrib).`;
                }
            }

            const hasil = kalkulasiPrimbon(nama, year, month, day);
            tampilkanHasil(nama, hasil, catatanJam);

        } catch (error) {
            if (errorLog) {
                errorLog.textContent = "TERJADI KESALAHAN: " + error.message;
                errorLog.classList.remove('hidden');
            }
            console.error(error);
        }
    });
});

function kalkulasiPrimbon(nama, year, month, day) {
    const DATA = window.PRIMBON_DATA;
    const jdn = getJDN(year, month, day);
    const anchorJDN = 2442027; // 10 Des 1973 = Senin Pon Wuku Sinta
    const diff = jdn - anchorJDN;

    const listDina = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const listPasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

    const dina = listDina[mod(1 + diff, 7)];
    const pasaran = listPasaran[mod(2 + diff, 5)];

    const totalNeptu = DATA.neptuDina[dina] + DATA.neptuPasaran[pasaran];
    const wukuIdx = Math.floor(mod(1 + diff, 210) / 7);

    // Konversi Tahun Jawa
    const lunarDrift = (year - 1633) * 0.0307;
    const tahunJawaVal = Math.floor(1555 + (year - 1633) + lunarDrift);
    const winduObj = DATA.winduList[mod(Math.floor((tahunJawaVal - 1) / 8), 4)];

    // Hanacaraka
    let totalHitunganNama = 0;
    const cleanNama = nama.toLowerCase().replace(/[^a-z]/g, '');
    for (let char of cleanNama) {
        totalHitunganNama += DATA.hanacaraka[char] || 1;
    }

    return {
        dina, pasaran, totalNeptu,
        wuku: DATA.wukuList[wukuIdx],
        paringkelan: DATA.sadwaraList[mod(1 + diff, 6)],
        padewan: DATA.astawaraList[mod(1 + diff, 8)],
        padangon: DATA.sangawaraList[mod(7 + diff, 9)],
        pancaSuda: DATA.pancasudaList[totalNeptu % 7],
        ekaJalaRsi: DATA.ekaJalaRsiList[totalNeptu % 7],
        mangsa: getPranataMangsaBetaljemur(month, day),
        lintang: DATA.lintangJawa[mod(totalNeptu, 10)],
        sasi: DATA.sasiJawa[mod(month - 1, 12)],
        hitNama: totalHitunganNama,
        tahunJawa: `${tahunJawaVal} Jawa (${DATA.tahunJawaList[mod(tahunJawaVal - 1, 8)]})`,
        windu: `Windu ${winduObj.nama} (Lambang ${winduObj.lambang})`
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

    document.getElementById('detailsGrid').innerHTML = `
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Wuku:</b> ${res.wuku}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Pancasuda:</b> ${res.pancaSuda}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Eka Jala Rsi:</b> ${res.ekaJalaRsi}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Pranata Mangsa:</b> ${res.mangsa}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Bintang Jawa:</b> ${res.lintang}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Sasi Jawa:</b> ${res.sasi}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Padewan:</b> ${res.padewan}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Paringkelan:</b> ${res.paringkelan}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Padangon:</b> ${res.padangon}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Tahun Jawa:</b> ${res.tahunJawa} / ${res.windu}</div>
        <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200"><b>Hitungan Nama:</b> ${res.hitNama}</div>
    `;

    document.getElementById('resWatak').innerText = `${nama} berweton ${res.dina} ${res.pasaran} (Neptu ${res.totalNeptu}) memiliki karakter dasar berwawasan luas, tekun, dan disegani lingkungan. Memiliki prinsip yang teguh namun perlu berhati-hati agar tidak terkesan keras kepala.`;
    document.getElementById('resKarir').innerText = `Sangat selaras bila bekerja sebagai ahli, konsultan, pengajar, wirausahawan, atau pimpinan yang memerlukan pemikiran strategis tingkat tinggi.`;
    document.getElementById('resRejeki').innerText = `Di bawah naungan pancasuda tersebut, rejekinya bersifat langgeng dan akan mencapai keemasan pada fase usia dewasa hingga tua.`;
    document.getElementById('resJodoh').innerText = `Sangat cocok berpasangan dengan weton ber-Neptu 8, 13, atau 18 (Contoh: Selasa Legi, Kamis Legi, Minggu Kliwon, atau Sabtu Pahing).`;
    document.getElementById('resHariNaas').innerText = `Hindari mengambil keputusan krusial di hari naas (selisih 4 hari pasaran dari hari lahir) untuk menghindari kesialan.`;

    const container = document.getElementById('hasilPrimbon');
    container.classList.remove('hidden');
    container.scrollIntoView({ behavior: 'smooth' });
}
