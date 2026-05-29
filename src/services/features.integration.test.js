import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:8080/api/v1';

describe.sequential('IC+ Clinic Management System - Full Features Integration Test', () => {
  let bidanToken = '';
  let pasienToken = '';
  
  let pasienId = 0; // ID of pasien1@gmail.com
  let testPatientId = 0; // ID of newly created patient by Bidan
  let testObatId = 0; // ID of created medicine
  let testInventoriId = 0; // Inventori ID of created medicine
  let testAntrianId = 0; // ID of queue created by Pasien
  let testRekamMedisId = 0; // ID of medical record created by Bidan
  let testJadwalId = 0; // ID of control schedule created by Bidan
  let testNotificationId = 0; // ID of notification in patient's list

  // Helper for requests
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

  // --- 1. AUTHENTICATION & LOGIN ---
  it('should login Bidan successfully', async () => {
    const res = await apiCall('/auth/login', 'POST', null, {
      email: 'bidan@ic-plus.com',
      password: 'bidan123',
    });
    expect(res.status).toBe('success');
    expect(res.data.token).toBeDefined();
    expect(res.data.user.role).toBe('bidan');
    bidanToken = res.data.token;
  });

  it('should login Pasien successfully', async () => {
    const res = await apiCall('/auth/login', 'POST', null, {
      email: 'pasien1@gmail.com',
      password: 'pasien123',
    });
    expect(res.status).toBe('success');
    expect(res.data.token).toBeDefined();
    expect(res.data.user.role).toBe('pasien');
    pasienToken = res.data.token;
  });

  // --- 2. CLINIC HOURS / PRACTISE STATUS ---
  it('should allow Bidan to toggle clinic status to "buka"', async () => {
    const res = await apiCall('/bidan/klinik/status', 'PUT', bidanToken, {
      status: 'buka',
      catatan: 'Klinik buka untuk pemeriksaan rutin & imunisasi',
    });
    expect(res.status).toBe('success');
  });

  it('should allow public access to clinic status and show "buka"', async () => {
    const res = await apiCall('/klinik/status', 'GET', null);
    expect(res.status).toBe('success');
    expect(res.data.status).toBe('buka');
    expect(res.data.catatan).toContain('pemeriksaan rutin');
  });

  // --- 3. PATIENT PROFILE & MANAGEMENT ---
  it('should allow Pasien to access and check profile', async () => {
    const res = await apiCall('/pasien/profile', 'GET', pasienToken);
    expect(res.status).toBe('success');
    expect(res.data.id).toBeDefined();
    expect(res.data.nama_lengkap).toBeDefined();
    pasienId = res.data.id;
  });

  it('should allow Bidan to add a new patient profile manually', async () => {
    const uniqueWa = `08${Math.floor(100000000 + Math.random() * 900000000)}`;
    const res = await apiCall('/bidan/pasien', 'POST', bidanToken, {
      nama_lengkap: 'Pasien Test Integrasi',
      tanggal_lahir: '1995-04-10',
      jenis_kelamin: 'perempuan',
      alamat: 'Jl. Melati No. 10',
      no_wa: uniqueWa,
      golongan_darah: 'O',
    });
    expect(res.status).toBe('success');
    expect(res.data.id).toBeDefined();
    testPatientId = res.data.id;
  });

  it('should allow Bidan to retrieve patient by ID', async () => {
    const res = await apiCall(`/bidan/pasien/${testPatientId}`, 'GET', bidanToken);
    expect(res.status).toBe('success');
    expect(res.data.nama_lengkap).toBe('Pasien Test Integrasi');
  });

  it('should allow Bidan to update patient details', async () => {
    const res = await apiCall(`/bidan/pasien/${testPatientId}`, 'PUT', bidanToken, {
      alamat: 'Jl. Melati No. 12 (Updated)',
    });
    expect(res.status).toBe('success');
    
    const checkRes = await apiCall(`/bidan/pasien/${testPatientId}`, 'GET', bidanToken);
    expect(checkRes.data.alamat).toBe('Jl. Melati No. 12 (Updated)');
  });

  // --- 4. MEDICINE INVENTORY & MUTATIONS ---
  it('should allow Bidan to create a new medicine', async () => {
    const randSuffix = Math.floor(Math.random() * 1000);
    const res = await apiCall('/bidan/obat', 'POST', bidanToken, {
      nama_obat: `Paracetamol Test ${randSuffix}`,
      kategori: 'analgesik',
      satuan: 'tablet',
      stok_minimum: 15,
      batas_stok_kritis: 10,
      jumlah_stok: 50,
      tanggal_kadaluarsa: '2027-12-31',
      batch_number: 'BCH123',
    });
    expect(res.status).toBe('success');
    expect(res.data.id).toBeDefined();
    testObatId = res.data.id;
  });

  it('should locate the created medicine in inventory to get inventori_id', async () => {
    const res = await apiCall('/bidan/inventori', 'GET', bidanToken);
    expect(res.status).toBe('success');
    expect(res.data.items).toBeDefined();
    
    const item = res.data.items.find(i => i.obat_id === testObatId);
    expect(item).toBeDefined();
    expect(item.jumlah_stok).toBe(50);
    testInventoriId = item.id;
  });

  it('should allow Bidan to update medicine properties', async () => {
    const res = await apiCall(`/bidan/obat/${testObatId}`, 'PUT', bidanToken, {
      kategori: 'analgesik-antipiretik',
    });
    expect(res.status).toBe('success');
  });

  it('should record Stock In mutation successfully', async () => {
    const res = await apiCall('/bidan/inventori/stok-masuk', 'POST', bidanToken, {
      inventori_id: testInventoriId,
      jumlah: 20,
      keterangan: 'Restock suplai bulanan',
      tanggal_kadaluarsa: '2028-06-30',
      batch_number: 'BCH124',
    });
    expect(res.status).toBe('success');
    
    // Verify new stock count
    const checkRes = await apiCall('/bidan/inventori', 'GET', bidanToken);
    const item = checkRes.data.items.find(i => i.id === testInventoriId);
    expect(item.jumlah_stok).toBe(70); // 50 + 20
  });

  it('should record Stock Out mutation successfully', async () => {
    const res = await apiCall('/bidan/inventori/stok-keluar', 'POST', bidanToken, {
      inventori_id: testInventoriId,
      jumlah: 5,
      keterangan: 'Pembuangan obat rusak',
    });
    expect(res.status).toBe('success');

    // Verify new stock count
    const checkRes = await apiCall('/bidan/inventori', 'GET', bidanToken);
    const item = checkRes.data.items.find(i => i.id === testInventoriId);
    expect(item.jumlah_stok).toBe(65); // 70 - 5
  });

  it('should output stock transaction history correctly', async () => {
    const res = await apiCall('/bidan/inventori/riwayat', 'GET', bidanToken);
    expect(res.status).toBe('success');
    expect(res.data.items.length).toBeGreaterThanOrEqual(2);
    
    const stockInLog = res.data.items.find(i => i.inventori_id === testInventoriId && i.jenis_transaksi === 'masuk');
    expect(stockInLog).toBeDefined();
    expect(stockInLog.jumlah).toBe(20);
  });

  // --- 5. QUEUE / VISIT REGISTRATION (ONLINE) ---
  it('should allow Pasien to register for a queue online', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const res = await apiCall('/pasien/antrian', 'POST', pasienToken, {
      tanggal_kunjungan: dateStr,
      keluhan: 'Demam tinggi dan sakit kepala hebat',
    });
    expect(res.status).toBe('success');
    expect(res.data.id).toBeDefined();
    expect(res.data.nomor_antrian).toBeDefined();
    testAntrianId = res.data.id;
  });

  it('should allow Pasien to retrieve their queue details', async () => {
    const res = await apiCall(`/pasien/antrian/${testAntrianId}`, 'GET', pasienToken);
    expect(res.status).toBe('success');
    expect(res.data.keluhan).toBe('Demam tinggi dan sakit kepala hebat');
  });

  it('should allow Bidan to view today/upcoming queue lists', async () => {
    const res = await apiCall('/bidan/antrian', 'GET', bidanToken);
    expect(res.status).toBe('success');
    expect(res.data.items).toBeDefined();
    
    const patientQueue = res.data.items.find(q => q.id === testAntrianId);
    expect(patientQueue).toBeDefined();
  });

  // --- 6. MEDICAL RECORD EXAMINATION & PRESCRIPTION DEDUCTION ---
  it('should allow Bidan to complete examination and create medical record with prescription', async () => {
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
    expect(res.status).toBe('success');
    expect(res.data.rekam_medis_id).toBeDefined();
    testRekamMedisId = res.data.rekam_medis_id;
  });

  it('should automatically deduct stock from inventory for prescribed medicine', async () => {
    const res = await apiCall('/bidan/inventori', 'GET', bidanToken);
    const item = res.data.items.find(i => i.id === testInventoriId);
    expect(item.jumlah_stok).toBe(55); // 65 (previous stock) - 10 (prescribed)
  });

  it('should allow Pasien to digital-access their new medical record details', async () => {
    const res = await apiCall(`/pasien/rekam-medis/${testRekamMedisId}`, 'GET', pasienToken);
    expect(res.status).toBe('success');
    expect(res.data.rekam_medis.keluhan_utama).toBe('Demam tinggi 3 hari');
    expect(res.data.resep.items[0].nama_obat).toContain('Paracetamol');
  });

  it('should show new medical record in Patient list of records', async () => {
    const res = await apiCall('/pasien/rekam-medis', 'GET', pasienToken);
    expect(res.status).toBe('success');
    expect(res.data.items).toBeDefined();
    
    const record = res.data.items.find(r => r.id === testRekamMedisId);
    expect(record).toBeDefined();
  });

  // --- 7. CONTROL SCHEDULE MANAGEMENT ---
  it('should allow Bidan to create a control schedule for a patient', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateStr = futureDate.toISOString().split('T')[0];

    const res = await apiCall('/bidan/jadwal-kontrol', 'POST', bidanToken, {
      pasien_id: pasienId,
      tanggal_kontrol: dateStr,
      keterangan: 'Kontrol cek darah lanjutan demam',
    });
    expect(res.status).toBe('success');
    expect(res.data.id).toBeDefined();
    testJadwalId = res.data.id;
  });

  it('should allow Bidan to view all control schedules', async () => {
    const res = await apiCall('/bidan/jadwal-kontrol', 'GET', bidanToken);
    expect(res.status).toBe('success');
    expect(res.data.items).toBeDefined();
    
    const schedule = res.data.items.find(s => s.id === testJadwalId);
    expect(schedule).toBeDefined();
  });

  it('should allow Pasien to see their scheduled control in list', async () => {
    const res = await apiCall('/pasien/jadwal-kontrol', 'GET', pasienToken);
    expect(res.status).toBe('success');
    expect(res.data.items).toBeDefined();
    
    const schedule = res.data.items.find(s => s.id === testJadwalId);
    expect(schedule).toBeDefined();
    expect(schedule.keterangan).toBe('Kontrol cek darah lanjutan demam');
  });

  it('should allow Bidan to update the control schedule details', async () => {
    const res = await apiCall(`/bidan/jadwal-kontrol/${testJadwalId}`, 'PUT', bidanToken, {
      keterangan: 'Kontrol cek darah lanjutan demam (Cepat/Pagi)',
    });
    expect(res.status).toBe('success');

    // Verify change
    const checkRes = await apiCall('/pasien/jadwal-kontrol', 'GET', pasienToken);
    const schedule = checkRes.data.items.find(s => s.id === testJadwalId);
    expect(schedule.keterangan).toBe('Kontrol cek darah lanjutan demam (Cepat/Pagi)');
  });

  // --- 8. NOTIFICATIONS & WA WHATSAPP REMINDERS ---
  it('should fetch patient notifications from the backend database history', async () => {
    const res = await apiCall('/pasien/notifikasi', 'GET', pasienToken);
    expect(res.status).toBe('success');
    expect(res.data.items).toBeDefined();
    
    // If notifications exist, locate the first one to test "mark as read"
    if (res.data.items.length > 0) {
      testNotificationId = res.data.items[0].id;
      expect(res.data.items[0].is_read).toBeDefined();
    }
  });

  it('should allow Pasien to mark notification as read', async () => {
    if (testNotificationId > 0) {
      const res = await apiCall(`/pasien/notifikasi/${testNotificationId}/read`, 'PUT', pasienToken);
      expect(res.status).toBe('success');
      
      // Verify notification is read
      const checkRes = await apiCall('/pasien/notifikasi', 'GET', pasienToken);
      const item = checkRes.data.items.find(i => i.id === testNotificationId);
      expect(item.is_read).toBe(true);
    }
  });

  // --- 9. MONITORING, DASHBOARD & REPORTING ---
  it('should load Bidan dashboard statistics accurately', async () => {
    const res = await apiCall('/bidan/dashboard', 'GET', bidanToken);
    expect(res.status).toBe('success');
    expect(res.data.total_pasien).toBeDefined();
    expect(res.data.obat_kritis).toBeDefined();
    expect(res.data.antrian_menunggu).toBeDefined();
  });

  it('should load Bidan visit history reports with filters', async () => {
    const res = await apiCall('/bidan/monitor-kunjungan', 'GET', bidanToken);
    expect(res.status).toBe('success');
    expect(res.data.items).toBeDefined();
    
    // Verify that our completed examination is recorded in visit history
    const visit = res.data.items.find(v => v.antrian_id === testAntrianId);
    expect(visit).toBeDefined();
    expect(visit.nama_pasien).toBeDefined();
  });

  // --- 10. CLEAN UP / DELETE OPTIONAL ENTRIES ---
  it('should clean up the created control schedule', async () => {
    const res = await apiCall(`/bidan/jadwal-kontrol/${testJadwalId}`, 'DELETE', bidanToken);
    expect(res.status).toBe('success');
  });

  it('should clean up the created test medicine', async () => {
    const res = await apiCall(`/bidan/obat/${testObatId}`, 'DELETE', bidanToken);
    expect(res.status).toBe('success');
  });
});
