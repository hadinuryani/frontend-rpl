/**
 * IC+ Clinic Management System
 * Comprehensive Integration Test Suite
 * 
 * Run with: node src/services/run-integration-tests.js
 */

const BASE_URL = 'http://localhost:8080/api/v1';

// Colors for terminal
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';

let bidanToken = '';
let pasienToken = '';

let pasienId = 0;
let testPatientId = 0;
let testObatId = 0;
let testInventoriId = 0;
let testAntrianId = 0;
let testAntrianTanggal = '';
let testRekamMedisId = 0;
let testJadwalId = 0;
let testJadwalTanggal = '';
let testNotificationId = 0;

// Print header
console.log(`\n${BOLD}${CYAN}================================================================${RESET}`);
console.log(`${BOLD}${CYAN}     IC+ CLINIC MANAGEMENT SYSTEM INTEGRATION TESTS             ${RESET}`);
console.log(`${BOLD}${CYAN}================================================================${RESET}\n`);

async function apiCall(endpoint, method, token, body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const options = {
    method,
    headers,
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`API error ${response.status} on ${method} ${endpoint}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function runTest(name, fn) {
  process.stdout.write(`⏳ Testing: ${name}... `);
  try {
    await fn();
    console.log(`${GREEN}✔ PASS${RESET}`);
  } catch (error) {
    console.log(`${RED}✘ FAIL${RESET}`);
    console.error(`\n${RED}Error detail in "${name}":${RESET}`, error.message || error);
    console.log(`\n${BOLD}${RED}Testing aborted due to critical failure.${RESET}\n`);
    process.exit(1);
  }
}

async function main() {
  // --- 1. AUTHENTICATION & LOGIN ---
  console.log(`${BOLD}${YELLOW}[1/9] Verifikasi Autentikasi & Login${RESET}`);
  
  await runTest('Login Bidan (bidan@ic-plus.com / bidan123)', async () => {
    const res = await apiCall('/auth/login', 'POST', null, {
      email: 'bidan@ic-plus.com',
      password: 'bidan123',
    });
    if (!res.success || !res.data.token || res.data.user.role !== 'bidan') {
      throw new Error('Gagal login bidan: data tidak sesuai');
    }
    bidanToken = res.data.token;
  });

  await runTest('Login Pasien (pasien1@gmail.com / pasien123)', async () => {
    const res = await apiCall('/auth/login', 'POST', null, {
      email: 'pasien1@gmail.com',
      password: 'pasien123',
    });
    if (!res.success || !res.data.token || res.data.user.role !== 'pasien') {
      throw new Error('Gagal login pasien: data tidak sesuai');
    }
    pasienToken = res.data.token;
  });

  // --- 2. CLINIC HOURS / PRACTISE STATUS ---
  console.log(`\n${BOLD}${YELLOW}[2/9] Verifikasi Status & Jam Buka Praktik Klinik${RESET}`);

  await runTest('Bidan mengatur status klinik menjadi "buka"', async () => {
    const res = await apiCall('/bidan/klinik/status', 'PUT', bidanToken, {
      status: 'buka',
      catatan: 'Klinik buka untuk pemeriksaan rutin & imunisasi',
    });
    if (!res.success) throw new Error('Gagal mengubah status klinik');
  });

  await runTest('Pasien melihat status operasional klinik (Public API)', async () => {
    const res = await apiCall('/klinik/status', 'GET', null);
    if (!res.success || res.data.status !== 'buka') {
      throw new Error(`Status klinik tidak sesuai, dapet: ${res.data.status}`);
    }
  });

  // --- 3. PATIENT PROFILE & MANAGEMENT ---
  console.log(`\n${BOLD}${YELLOW}[3/9] Verifikasi Profil & Manajemen Pasien${RESET}`);

  await runTest('Pasien membaca data profil pribadinya', async () => {
    const res = await apiCall('/pasien/profile', 'GET', pasienToken);
    if (!res.success || !res.data.id) throw new Error('Gagal mendapatkan profil pasien');
    pasienId = res.data.id;
  });

  await runTest('Bidan menambahkan pasien baru secara manual', async () => {
    const uniqueWa = `08${Math.floor(100000000 + Math.random() * 900000000)}`;
    const res = await apiCall('/bidan/pasien', 'POST', bidanToken, {
      nama_lengkap: 'Pasien Test Integrasi',
      tanggal_lahir: '1995-04-10',
      jenis_kelamin: 'perempuan',
      alamat: 'Jl. Melati No. 10',
      no_wa: uniqueWa,
      golongan_darah: 'O',
    });
    if (!res.success || !res.data.id) throw new Error('Bidan gagal tambah pasien');
    testPatientId = res.data.id;
  });

  await runTest('Bidan mencari & mengambil detail data pasien berdasarkan ID', async () => {
    const res = await apiCall(`/bidan/pasien/${testPatientId}`, 'GET', bidanToken);
    if (res.data.nama_lengkap !== 'Pasien Test Integrasi') throw new Error('Nama pasien tidak sesuai');
  });

  await runTest('Bidan memperbarui (update) alamat pasien', async () => {
    const res = await apiCall(`/bidan/pasien/${testPatientId}`, 'PUT', bidanToken, {
      alamat: 'Jl. Melati No. 12 (Updated)',
    });
    if (!res.success) throw new Error('Gagal update alamat');
    
    const checkRes = await apiCall(`/bidan/pasien/${testPatientId}`, 'GET', bidanToken);
    if (checkRes.data.alamat !== 'Jl. Melati No. 12 (Updated)') throw new Error('Data tidak terupdate');
  });

  // --- 4. MEDICINE INVENTORY & MUTATIONS ---
  console.log(`\n${BOLD}${YELLOW}[4/9] Verifikasi Inventori & Pencatatan Stok Obat${RESET}`);

  await runTest('Bidan mendaftarkan obat baru', async () => {
    const randSuffix = Math.floor(Math.random() * 1000);
    const res = await apiCall('/bidan/obat', 'POST', bidanToken, {
      nama_obat: `A Paracetamol Test ${randSuffix}`,
      kategori: 'analgesik',
      satuan: 'tablet',
      stok_minimum: 15,
      batas_stok_kritis: 10,
      jumlah_stok: 50,
      tanggal_kadaluarsa: '2027-12-31',
      batch_number: 'BCH123',
    });
    if (!res.success || !res.data.id) throw new Error('Gagal tambah obat');
    testObatId = res.data.id;
  });

  await runTest('Bidan melihat daftar inventori dan mencocokkan obat baru', async () => {
    const res = await apiCall('/bidan/inventori?limit=100', 'GET', bidanToken);
    const item = (res.data || []).find(i => i.obat_id === testObatId);
    if (!item) throw new Error('Obat baru tidak ditemukan di inventori');
    if (item.jumlah_stok !== 50) throw new Error(`Stok tidak sesuai: ${item.jumlah_stok}`);
    testInventoriId = item.id;
  });

  await runTest('Bidan mengubah kategori data obat', async () => {
    const res = await apiCall(`/bidan/obat/${testObatId}`, 'PUT', bidanToken, {
      kategori: 'analgesik-antipiretik',
    });
    if (!res.success) throw new Error('Gagal update obat');
  });

  await runTest('Bidan mencatat Mutasi Stok Masuk (+20)', async () => {
    const res = await apiCall('/bidan/inventori/stok-masuk', 'POST', bidanToken, {
      inventori_id: testInventoriId,
      jumlah: 20,
      keterangan: 'Restock suplai bulanan',
      tanggal_kadaluarsa: '2028-06-30',
      batch_number: 'BCH124',
    });
    if (!res.success) throw new Error('Gagal stok masuk');

    const checkRes = await apiCall('/bidan/inventori?limit=100', 'GET', bidanToken);
    const item = (checkRes.data || []).find(i => i.id === testInventoriId);
    if (item.jumlah_stok !== 70) throw new Error(`Jumlah stok salah: ${item.jumlah_stok} (harus 70)`);
  });

  await runTest('Bidan mencatat Mutasi Stok Keluar (-5)', async () => {
    const res = await apiCall('/bidan/inventori/stok-keluar', 'POST', bidanToken, {
      inventori_id: testInventoriId,
      jumlah: 5,
      keterangan: 'Pembuangan obat rusak',
    });
    if (!res.success) throw new Error('Gagal stok keluar');

    const checkRes = await apiCall('/bidan/inventori?limit=100', 'GET', bidanToken);
    const item = (checkRes.data || []).find(i => i.id === testInventoriId);
    if (item.jumlah_stok !== 65) throw new Error(`Jumlah stok salah: ${item.jumlah_stok} (harus 65)`);
  });

  await runTest('Bidan memeriksa riwayat mutasi obat', async () => {
    const res = await apiCall('/bidan/inventori/riwayat?limit=100', 'GET', bidanToken);
    const stockInLog = (res.data || []).find(i => i.inventori_id === testInventoriId && i.jenis_transaksi === 'masuk');
    if (!stockInLog || stockInLog.jumlah !== 20) throw new Error('Riwayat mutasi masuk tidak valid');
  });

  await runTest('Bidan memeriksa notifikasi obat kritis (stok habis/kadaluarsa)', async () => {
    const res = await apiCall('/bidan/notifikasi', 'GET', bidanToken);
    if (!res.success || !Array.isArray(res.data)) {
      throw new Error('Endpoint notifikasi bidan gagal mengembalikan list');
    }
  });


  // --- 5. QUEUE / VISIT REGISTRATION (ONLINE) ---
  console.log(`\n${BOLD}${YELLOW}[5/9] Verifikasi Pendaftaran Antrian Online${RESET}`);

  await runTest('Pasien melakukan pendaftaran kunjungan online', async () => {
    // Generate date string based on Asia/Jakarta timezone
    testAntrianTanggal = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

    const res = await apiCall('/pasien/antrian', 'POST', pasienToken, {
      tanggal_kunjungan: testAntrianTanggal,
      keluhan: 'Demam tinggi dan sakit kepala hebat',
    });
    if (!res.success || !res.data.id) throw new Error('Pasien gagal daftar kunjungan');
    testAntrianId = res.data.id;
  });

  await runTest('Pasien mengecek antrian pribadinya (Nomor Antrian)', async () => {
    const res = await apiCall(`/pasien/antrian/${testAntrianId}`, 'GET', pasienToken);
    if (res.data.keluhan !== 'Demam tinggi dan sakit kepala hebat' || !res.data.no_antrian) {
      throw new Error('Detail antrian tidak sesuai');
    }
  });

  await runTest('Bidan melihat antrian pasien masuk di dashboard antrian hari ini', async () => {
    const res = await apiCall(`/bidan/antrian?tanggal=${testAntrianTanggal}&limit=100`, 'GET', bidanToken);
    const patientQueue = (res.data || []).find(q => q.id === testAntrianId);
    if (!patientQueue) throw new Error('Antrian pasien tidak muncul di panel Bidan');
  });

  // --- 6. MEDICAL RECORD EXAMINATION & PRESCRIPTION DEDUCTION ---
  console.log(`\n${BOLD}${YELLOW}[6/9] Verifikasi Kelola Catatan Rekam Medis & Auto-potong Stok Resep${RESET}`);

  await runTest('Bidan memeriksa pasien (membuat rekam medis digital & resep)', async () => {
    const res = await apiCall('/bidan/rekam-medis', 'POST', bidanToken, {
      antrian_id: testAntrianId,
      keluhan_utama: 'Demam tinggi 3 hari',
      tekanan_darah: '120/80',
      berat_badan: 55.5,
      tinggi_fundus_uteri: 0,
      kondisi_janin: 'Tidak Hamil',
      catatan_tambahan: 'Pasien disarankan istirahat total',
      resep: [
        {
          obat_id: testObatId,
          jumlah: 10,
          dosis: '3x1',
          aturan_pakai: 'Sesudah makan',
          catatan: 'Habiskan',
        }
      ],
      perlu_kontrol: false,
    });
    if (!res.success || !res.data.rekam_medis_id) throw new Error('Gagal membuat rekam medis');
    testRekamMedisId = res.data.rekam_medis_id;
  });

  await runTest('Sistem otomatis mengurangi stok obat di inventori (-10)', async () => {
    const res = await apiCall('/bidan/inventori?limit=100', 'GET', bidanToken);
    const item = (res.data || []).find(i => i.id === testInventoriId);
    if (item.jumlah_stok !== 55) {
      throw new Error(`Stok obat tidak terpotong! Sekarang: ${item.jumlah_stok} (seharusnya 55)`);
    }
  });

  await runTest('Pasien mengakses data Rekam Medis & Resep Obat miliknya secara digital', async () => {
    const res = await apiCall(`/pasien/rekam-medis/${testRekamMedisId}`, 'GET', pasienToken);
    if (res.data.rekam_medis.keluhan_utama !== 'Demam tinggi 3 hari' || !res.data.resep || res.data.resep.details.length === 0) {
      throw new Error('Detail rekam medis / resep di pasien tidak sesuai');
    }
  });

  // --- 7. CONTROL SCHEDULE MANAGEMENT ---
  console.log(`\n${BOLD}${YELLOW}[7/9] Verifikasi Pengelolaan Jadwal Kontrol Bidan & Pasien${RESET}`);

  await runTest('Bidan membuat jadwal kontrol baru untuk Pasien', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    testJadwalTanggal = futureDate.toISOString().split('T')[0];

    const res = await apiCall('/bidan/jadwal-kontrol', 'POST', bidanToken, {
      pasien_id: pasienId,
      tanggal_kontrol: testJadwalTanggal,
      catatan: 'Kontrol cek darah lanjutan demam',
    });
    if (!res.success || !res.data.id) throw new Error('Bidan gagal membuat jadwal kontrol');
    testJadwalId = res.data.id;
  });

  await runTest('Pasien melihat jadwal kontrol yang dijadwalkan bidan', async () => {
    const res = await apiCall('/pasien/jadwal-kontrol?limit=100', 'GET', pasienToken);
    const schedule = (res.data || []).find(s => s.id === testJadwalId);
    if (!schedule || schedule.catatan !== 'Kontrol cek darah lanjutan demam') {
      throw new Error('Jadwal kontrol tidak ditemukan di pasien');
    }
  });

  await runTest('Bidan mengupdate keterangan jadwal kontrol', async () => {
    const res = await apiCall(`/bidan/jadwal-kontrol/${testJadwalId}`, 'PUT', bidanToken, {
      tanggal_kontrol: testJadwalTanggal,
      catatan: 'Kontrol cek darah lanjutan demam (Cepat/Pagi)',
    });
    if (!res.success) throw new Error('Gagal update jadwal kontrol');

    const checkRes = await apiCall('/pasien/jadwal-kontrol?limit=100', 'GET', pasienToken);
    const schedule = (checkRes.data || []).find(s => s.id === testJadwalId);
    if (schedule.catatan !== 'Kontrol cek darah lanjutan demam (Cepat/Pagi)') {
      throw new Error('Data jadwal kontrol di pasien tidak berubah');
    }
  });

  // --- 8. NOTIFICATIONS & WA WHATSAPP REMINDERS ---
  console.log(`\n${BOLD}${YELLOW}[8/9] Verifikasi Notifikasi Riwayat Pengiriman WA Pasien${RESET}`);

  await runTest('Pasien mengakses menu Notifikasi di web (membaca data riwayat WA)', async () => {
    const res = await apiCall('/pasien/notifikasi?limit=100', 'GET', pasienToken);
    if (!res.success) throw new Error('Gagal mengambil notifikasi');
    if ((res.data || []).length > 0) {
      testNotificationId = res.data[0].id;
    }
  });

  await runTest('Pasien menandai notifikasi sebagai telah dibaca ("read")', async () => {
    if (testNotificationId > 0) {
      const res = await apiCall(`/pasien/notifikasi/${testNotificationId}/read`, 'PUT', pasienToken);
      if (!res.success) throw new Error('Gagal menandai telah dibaca');

      const checkRes = await apiCall('/pasien/notifikasi?limit=100', 'GET', pasienToken);
      const item = (checkRes.data || []).find(i => i.id === testNotificationId);
      if (item.is_read !== true) throw new Error('Status notifikasi belum menjadi read');
    } else {
      console.log('(Skip - Tidak ada notifikasi yang tersedia)');
    }
  });

  // --- 9. MONITORING, DASHBOARD & REPORTING & CLEANUP ---
  console.log(`\n${BOLD}${YELLOW}[9/9] Verifikasi Dashboard Bidan, Monitor Kunjungan & Cleanup${RESET}`);

  await runTest('Bidan memantau statistik dashboard clinic real-time', async () => {
    const res = await apiCall('/bidan/dashboard', 'GET', bidanToken);
    if (!res.success || typeof res.data.total_pasien_hari_ini === 'undefined') {
      throw new Error('Gagal memuat dashboard');
    }
  });

  await runTest('Bidan memantau riwayat monitor kunjungan pasien dengan filter', async () => {
    const res = await apiCall(`/bidan/monitor-kunjungan?to=${testAntrianTanggal}&limit=100`, 'GET', bidanToken);
    const visit = (res.data || []).find(v => v.id === testAntrianId);
    if (!visit || !visit.nama_pasien) throw new Error('Kunjungan pasien tadi tidak tercatat');
  });

  await runTest('Cleanup: Bidan menghapus jadwal kontrol test', async () => {
    const res = await apiCall(`/bidan/jadwal-kontrol/${testJadwalId}`, 'DELETE', bidanToken);
    if (!res.success) throw new Error('Gagal hapus jadwal kontrol');
  });


  console.log(`\n${BOLD}${GREEN}================================================================${RESET}`);
  console.log(`${BOLD}${GREEN}     SEMUA FITUR PASIEN DAN BIDAN TELAH DIUJI DENGAN SUKSES!   ${RESET}`);
  console.log(`${BOLD}${GREEN}================================================================${RESET}\n`);
}

main().catch(err => {
  console.error('Fatal error outside test block:', err);
  process.exit(1);
});
