let dbData = {};

// Load JSON Dataset saat pertama buka
fetch('./data.json')
    .then(res => res.json())
    .then(data => { dbData = data; })
    .catch(err => console.error("Gagal memuat dataset JSON:", err));

document.getElementById('primbonForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!dbData.wukuList) {
        alert("Data Primbon belum siap. Pastikan file data.json ada.");
        return;
    }

    const nama = document.getElementById('nama').value.trim();
    let tglInput = new Date(document.getElementById('tglLahir').value);
    const jamInput = document.getElementById('jamLahir').value;

    let catatanJam = "Pukul kelahiran tidak diisi (Perhitungan standar sebelum Maghrib).";
    
    // Cek Perubahan Hari Jawa jika lahir >= 18:00 (Maghrib)
    if (jamInput) {
        const [jam, menit] = jamInput.split(':').map(Number);
        if (jam >= 18) {
            tglInput.setDate(tglInput.getDate() + 1);
            catatanJam = `Lahir pukul ${jamInput} WIB (Masuk pergantian hari Jawa/setelah Maghrib).`;
        } else {
            catatanJam = `Lahir pukul ${jamInput} WIB (Sebelum pergantian hari Jawa).`;
        }
    }

    const hasil = kalkulasiPrimbon(nama, tglInput);
    tampilkanHasil(nama, hasil, catatanJam);
});

function kalkulasiPrimbon(nama, dateObj) {
    // Julian Day Number Algorithm untuk akurasi Kalender
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Anchor: 1 Jan 2000 = Sabtu Kliwon (JDN: 2451545)
    const diff = jdn - 2451545;

    const listDina = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const listPasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

    const dinaIdx = ((6 + (diff % 7)) % 7 + 7) % 7;
    const pasaranIdx = ((4 + (diff % 5)) % 5 + 5) % 5;

    const dina = listDina[dinaIdx];
    const pasaran = listPasaran[pasaranIdx];

    const neptuD = dbData.neptuDina[dina];
    const neptuP = dbData.neptuPasaran[pasaran];
    const totalNeptu = neptuD + neptuP;

    // Hitungan Wuku (Siklus 210 Hari)
    // Reference Wuku: 1 Jan 2000 = Wuku Wayang (Index 26)
    const wukuIdx = Math.abs((26 + Math.floor((diff % 210 + 210) / 7)) % 30);
    const wuku = dbData.wukuList[wukuIdx];

    // Hitungan Numerologi Nama (Hanacaraka)
    let totalHitunganNama = 0;
    const cleanNama = nama.toLowerCase().replace(/[^a-z]/g, '');
    for (let char of cleanNama) {
        totalHitunganNama += dbData.hanacaraka[char] || 1;
    }

    // Panca Suda & Padewan Formula
    const pancaSudaIdx = (totalNeptu % 5 === 0) ? 4 : (totalNeptu % 5) - 1;
    const pancaSuda = dbData.pancaSuda[pancaSudaIdx];

    // Pranata Mangsa Sederhana
    const mangsaIdx = Math.floor((month - 1) % 12);
    const mangsa = dbData.pranataMangsa[mangsaIdx];

    return {
        dina, pasaran, totalNeptu, wuku, pancaSuda, mangsa,
        hitNama: totalHitunganNama,
        tahunJawa: 1957 + (year - 2024), // Estimasi Tahun Jawa (Tahun Jimawal/Za)
        windu: "Sengara",
        padewan: (totalNeptu % 8 === 0) ? "Guru" : "Indra",
        peringkelan: (totalNeptu % 6 === 0) ? "Tulus" : "Mawas",
        ekaJalaRsi: (totalNeptu % 7 === 0) ? "Kama Suka" : "Langgeng"
    };
}

function tampilkanHasil(nama, res, catatanJam) {
    document.getElementById('resNama').innerText = nama;
    document.getElementById('resWeton').innerText = `${res.dina} ${res.pasaran}`;
    document.getElementById('resNeptu').innerText = `Neptu: ${res.totalNeptu}`;
    document.getElementById('resWaktuCatatan').innerText = catatanJam;

    const grid = document.getElementById('detailsGrid');
    grid.innerHTML = `
        <div class="bg-amber-50/50 p-3 rounded-lg border"><b>Wuku:</b> ${res.wuku}</div>
        <div class="bg-amber-50/50 p-3 rounded-lg border"><b>Pranata Mangsa:</b> ${res.mangsa.nama} (${res.mangsa.rentang})</div>
        <div class="bg-amber-50/50 p-3 rounded-lg border"><b>Panca Suda:</b> ${res.pancaSuda}</div>
        <div class="bg-amber-50/50 p-3 rounded-lg border"><b>Padewan:</b> ${res.padewan}</div>
        <div class="bg-amber-50/50 p-3 rounded-lg border"><b>Paringkelan:</b> ${res.peringkelan}</div>
        <div class="bg-amber-50/50 p-3 rounded-lg border"><b>Eka Jala Rsi:</b> ${res.ekaJalaRsi}</div>
        <div class="bg-amber-50/50 p-3 rounded-lg border"><b>Tahun Jawa & Windu:</b> ${res.tahunJawa} Jawa / Windu ${res.windu}</div>
        <div class="bg-amber-50/50 p-3 rounded-lg border"><b>Hitungan Nama (Hanacaraka):</b> ${res.hitNama}</div>
    `;

    // Watak & Prediksi berdasarkan Neptu
    document.getElementById('resWatak').innerText = `Individu kelahiran ${res.dina} ${res.pasaran} (Neptu ${res.totalNeptu}) berada di bawah naungan Wuku ${res.wuku} dan Panca Suda ${res.pancaSuda}. Berkarakter kuat, teguh pada pendirian, memikat, namun perlu mengontrol emosi ketika merasa terdesak.`;
    document.getElementById('resKarir').innerText = `Sangat cocok berkarier di bidang kepemimpinan, perdagangan, atau kewirausahaan mandiri dibanding menjadi bawahan.`;
    document.getElementById('resRejeki').innerText = `Rejeki cenderung stabil dan cenderung meningkat pesat di usia dewasa menengah (puncak keberuntungan di bawah naungan ${res.pancaSuda}).`;
    document.getElementById('resJodoh').innerText = `Cocok berpasangan dengan individu ber-neptu 7, 12, atau 17 (seperti Senin Kliwon, Selasa Pahing, Sabtu Kliwon).`;
    document.getElementById('resHariNaas').innerText = `Hari naas jatuh pada weton berselisih 4 hari (pancasuda), disarankan berhati-hati saat membuat keputusan besar di hari tersebut.`;

    document.getElementById('hasilPrimbon').classList.remove('hidden');
}
