document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('primbonForm');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const DATA = window.PRIMBON_DATA;

        // Validasi ketersediaan data dari data.js
        if (!DATA || !DATA.neptuHari || !DATA.neptuPasaran) {
            alert("Terjadi kesalahan: Data primbon (data.js) belum terisolasi atau gagal dimuat.");
            return;
        }

        // Ambil elemen input
        const namaInput = document.getElementById('nama');
        const tglLahirInput = document.getElementById('tglLahir');
        const jamLahirInput = document.getElementById('jamLahir');

        const nama = namaInput ? namaInput.value.trim() : "";
        const tglLahir = tglLahirInput ? tglLahirInput.value : "";
        const jamInput = jamLahirInput ? jamLahirInput.value : "";

        if (!tglLahir) {
            alert("Silakan pilih tanggal lahir terlebih dahulu.");
            return;
        }

        // Penanganan Tanggal & Epoch (8 Juli 1633)
        let dateObj = new Date(tglLahir + "T00:00:00");
        const utcDate = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        const epoch1633 = Date.UTC(1633, 6, 8); 
        const hariSejakEpoch = Math.floor((utcDate - epoch1633) / 86400000);

        // 1. Hari, Pasaran, Neptu, & Weton
        const hariIdx = dateObj.getDay();
        const namaHari = DATA.hariList[hariIdx] || DATA.hariList[0]; 
        
        const pasaranIdx = ((hariSejakEpoch % 5) + 5) % 5;
        const namaPasaran = DATA.pasaranList[pasaranIdx] || DATA.pasaranList[0];
        
        const neptuH = DATA.neptuHari[namaHari] || 0;
        const neptuP = DATA.neptuPasaran[namaPasaran] || 0;
        const neptuTotal = neptuH + neptuP;
        const wetonStr = `${namaHari} ${namaPasaran}`;

        // 2. Siklus Wuku (30 Wuku)
        const wukuIdx = (((Math.floor(hariSejakEpoch / 7) + 22) % 30) + 30) % 30;
        const wuku = DATA.wukuList[wukuIdx] || "-";

        // 3. Lintang (35 Siklus)
        const lintangIdx = Math.abs((neptuTotal + wukuIdx + dateObj.getDate()) % 35);
        const lintangNama = DATA.lintangList[lintangIdx] || "-";
        const lintangDetail = DATA.watakLintang[lintangNama] || { bakat: "-", lemah: "-" };

        // 4. Siklus Mikro (Padewan, Paringkelan, Pancasuda, Eka Jala Rsi)
        const padewan = DATA.padewanList[neptuTotal % 6] || "-";
        const paringkelan = DATA.paringkelanList[(neptuTotal + wukuIdx) % 27] || "-";
        const pancasuda = DATA.pancasudaList[neptuTotal % 7] || "-";
        const ekaJala = DATA.ekaJalaRsiList[neptuTotal % 4] || "-";

        // 5. Wanci (Jam Kelahiran)
        let wanci = "Tidak diketahui (jam tidak diisi)";
        if (jamInput) {
            const jamNum = parseFloat(jamInput.split(':')[0]) + (parseFloat(jamInput.split(':')[1]) / 60);
            const wanciObj = DATA.wanciList.find(w => jamNum >= w.start && jamNum <= w.end) || DATA.wanciList[0];
            wanci = `${wanciObj.label} (${wanciObj.range})`;
        }

        // 6. Pranata Mangsa
        const bulan = dateObj.getMonth() + 1;
        const tanggal = dateObj.getDate();
        let mangsaObj = DATA.mangsaData[6]; // Default fallback
        for (let m of DATA.mangsaData) {
            let startBulan = m.start.m, startTgl = m.start.d;
            let endBulan = m.end.m, endTgl = m.end.d;
            let crossYear = (startBulan > endBulan) || (startBulan === endBulan && startTgl > endTgl);
            let isAfterStart = (bulan > startBulan) || (bulan === startBulan && tanggal >= startTgl);
            let isBeforeEnd = (bulan < endBulan) || (bulan === endBulan && tanggal <= endTgl);
            
            if (!crossYear && (isAfterStart && isBeforeEnd)) mangsaObj = m;
            else if (crossYear && (isAfterStart || isBeforeEnd)) mangsaObj = m;
        }

        // 7. Numerologi Nama
        let bobotNamaStr = "Nama tidak diisi";
        if (nama) {
            const cleanName = nama.toUpperCase().replace(/[^A-Z]/g, "");
            let hitunganNama = 0;
            for (let char of cleanName) hitunganNama += char.charCodeAt(0) - 64;
            let mod5 = hitunganNama % 5;
            let kategoriNama = (mod5 === 0 || mod5 === 1) ? "Baik" : (mod5 === 2 || mod5 === 3) ? "Sedang" : "Perlu Tirakat";
            bobotNamaStr = `${hitunganNama} (${kategoriNama})`;
        }

        // Watak Weton
        const watakWetonTeks = DATA.watakWeton[wetonStr] || "Karakter umum berdasarkan kombinasi neptu hari dan pasaran.";

        // Menggabungkan Seluruh Hasil
        const hasil = {
            nama: nama || "Tanpa Nama",
            tglLahir: tglLahir,
            weton: wetonStr,
            neptu: `${neptuTotal} (Hari: ${neptuH}, Pasaran: ${neptuP})`,
            wuku: wuku,
            lintang: lintangNama,
            bakatLintang: lintangDetail.bakat,
            lemahLintang: lintangDetail.lemah,
            padewan: padewan,
            paringkelan: paringkelan,
            pancasuda: pancasuda,
            ekaJala: ekaJala,
            wanci: wanci,
            mangsa: mangsaObj.name,
            watakMangsa: mangsaObj.watak,
            bobotNama: bobotNamaStr,
            watakWeton: watakWetonTeks
        };

        // Render ke DOM
        tampilkanHasil(hasil);
    });

    // Fungsi Render Output ke HTML
    function tampilkanHasil(data) {
        const container = document.getElementById('hasilPrimbon');
        if (!container) {
            console.log("Kalkulasi Selesai:", data);
            return;
        }

        container.innerHTML = `
            <div class="result-card">
                <h2>Hasil Perhitungan Pawukon</h2>
                <p><strong>Nama:</strong> ${data.nama}</p>
                <p><strong>Tanggal Lahir:</strong> ${data.tglLahir}</p>
                <hr>
                <p><strong>Weton:</strong> ${data.weton}</p>
                <p><strong>Neptu:</strong> ${data.neptu}</p>
                <p><strong>Wuku:</strong> ${data.wuku}</p>
                <p><strong>Pranata Mangsa:</strong> ${data.mangsa}</p>
                <p><strong>Wanci Kelahiran:</strong> ${data.wanci}</p>
                <p><strong>Lintang (Bintang):</strong> ${data.lintang}</p>
                <hr>
                <h3>Siklus & Elemen</h3>
                <ul>
                    <li><strong>Padewan:</strong> ${data.padewan}</li>
                    <li><strong>Paringkelan:</strong> ${data.paringkelan}</li>
                    <li><strong>Pancasuda:</strong> ${data.pancasuda}</li>
                    <li><strong>Eka Jala Rsi:</strong> ${data.ekaJala}</li>
                    <li><strong>Bobot Nama:</strong> ${data.bobotNama}</li>
                </ul>
                <hr>
                <h3>Gambaran Watak & Karakter</h3>
                <p><strong>Watak Weton:</strong> ${data.watakWeton}</p>
                <p><strong>Watak Mangsa:</strong> ${data.watakMangsa}</p>
                <p><strong>Kelebihan (Lintang):</strong> ${data.bakatLintang}</p>
                <p><strong>Kelemahan (Lintang):</strong> ${data.lemahLintang}</p>
            </div>
        `;
        container.style.display = 'block';
    }
});
