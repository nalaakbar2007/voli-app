// Master Roster Pemain Tim Voli
// Master Roster Pemain Tim Voli FT (13 Pemain)
const daftarPemain = [
    "Ega (Libero)",
    "Fadhil (Allround)",
    "Aubin (Setter)",
    "Pascal (Open)",
    "Gepri (Setter)",
    "Zidan (Middle Blocker)",
    "Nala (Middle Blocker)",
    "Nawa (Middle Blocker)",
    "Idoz (Libero)",
    "Alif (Allround)",
    "Kais (Open)",
    "Dhany (Allround)",
    "Alqa (Middle Blocker)"
];
// Variable Sementara untuk Sesi yang Lagi Diisi Manajer
let sesiAktif = null;
let presensiSementara = {};

function buatSesiBaru() {
    const tanggal = document.getElementById('input-tanggal').value;
    const jam = document.getElementById('input-jam').value;
    const lokasi = document.getElementById('input-lokasi').value.trim();

    if (!tanggal || !jam || !lokasi) {
        alert("Harap isi Tanggal, Jam, dan Lokasi latihan dulu!");
        return;
    }

    sesiAktif = { tanggal, jam, lokasi };
    presensiSementara = {};

    // Tampilkan Area Input Presensi
    document.getElementById('area-presensi').style.display = 'block';
    document.getElementById('info-sesi').innerText = `${tanggal} | ${jam} @ ${lokasi}`;

    renderTabelInput();
}

function renderTabelInput() {
    const tbody = document.getElementById('tabel-presensi-body');
    tbody.innerHTML = '';

    daftarPemain.forEach((pemain, index) => {
        const status = presensiSementara[pemain];
        let statusHtml = '';

        if (status === 'Hadir') {
            statusHtml = `
                <span class="status-badge badge-hadir">✓ Hadir</span>
                <button class="btn-reset" onclick="resetStatusSementara('${pemain}')">Ubah</button>
            `;
        } else if (status === 'Tidak Hadir') {
            statusHtml = `
                <span class="status-badge badge-izin">✕ Tidak Hadir</span>
                <button class="btn-reset" onclick="resetStatusSementara('${pemain}')">Ubah</button>
            `;
        } else {
            statusHtml = `
                <button class="btn btn-hadir" onclick="pilihStatus('${pemain}', 'Hadir')">Hadir</button>
                <button class="btn btn-izin" onclick="pilihStatus('${pemain}', 'Tidak Hadir')">Tidak Hadir</button>
            `;
        }

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${pemain}</strong></td>
                <td>${statusHtml}</td>
            </tr>
        `;
    });
}

// Fungsi tambahan untuk membatalkan/mengubah pilihan sementara
function resetStatusSementara(pemain) {
    delete presensiSementara[pemain];
    renderTabelInput();
}

function pilihStatus(pemain, status) {
    presensiSementara[pemain] = status;
    renderTabelInput();
}

function simpanPermanen() {
    // Cek apakah semua pemain sudah diisi statusnya
    const belumDiisi = daftarPemain.filter(p => !presensiSementara[p]);
    if (belumDiisi.length > 0) {
        alert("Masih ada pemain yang belum dipilih status kehadirannya!");
        return;
    }

    // Ambil histori lama dari LocalStorage
    let historiLatihan = JSON.parse(localStorage.getItem('histori_latihan')) || [];

    // Tambah data sesi baru ini ke histori
    const dataBaru = {
        sesi: sesiAktif,
        presensi: presensiSementara
    };
    historiLatihan.push(dataBaru);

    // Simpan ke LocalStorage
    localStorage.setItem('histori_latihan', JSON.stringify(historiLatihan));

    alert("Data latihan berhasil di-Save & dikunci ke Database!");

    // Sembunyikan area input & reset
    document.getElementById('area-presensi').style.display = 'none';
    renderHistori();
}

function renderHistori() {
    const historiLatihan = JSON.parse(localStorage.getItem('histori_latihan')) || [];
    const headerRow = document.getElementById('header-histori');
    const bodyTabel = document.getElementById('body-histori');

    // Reset Header & Body
    headerRow.innerHTML = '<th>Nama Pemain</th>';
    bodyTabel.innerHTML = '';

    // Buat Kolom Tanggal di Header
    historiLatihan.forEach(item => {
        headerRow.innerHTML += `<th>${item.sesi.tanggal}<br><small>(${item.sesi.lokasi})</small></th>`;
    });

    // Buat Baris untuk Setiap Pemain
    daftarPemain.forEach(pemain => {
        let rowHtml = `<tr><td><strong>${pemain}</strong></td>`;
        
        historiLatihan.forEach(item => {
            const st = item.presensi[pemain];
            if (st === 'Hadir') {
                rowHtml += `<td><span style="color: green; font-weight: bold;">✓</span></td>`;
            } else {
                rowHtml += `<td><span style="color: red; font-weight: bold;">✕</span></td>`;
            }
        });

        rowHtml += `</tr>`;
        bodyTabel.innerHTML += rowHtml;
    });
}

// Muat histori saat pertama kali buka website
window.onload = function() {
    renderHistori();
};