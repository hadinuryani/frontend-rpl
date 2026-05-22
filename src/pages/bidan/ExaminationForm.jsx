import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconArrowLeft, IconClipboard, IconPill, IconTrash, IconPlus, IconUser, IconMapPin, IconMessageCircle, IconCheckCircle, IconWhatsApp, IconFemale, IconMale } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './BidanPages.css';

export default function ExaminationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const antrianId = query.get('antrian_id');

  const [antrian, setAntrian] = useState(null);
  const [obatList, setObatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    keluhanUtama: '',
    tekananDarahSistol: '',
    tekananDarahDiastol: '',
    beratBadan: '',
    tinggiFundus: '',
    kondisiJanin: '',
    catatanTambahan: '',
    perluKontrol: false,
    tanggalKontrol: '',
    catatanKontrol: ''
  });

  const [medicines, setMedicines] = useState([{ obat_id: '', jumlah: 1, dose: '', usage: '' }]);

  useEffect(() => {
    if (!antrianId) {
      alert("Antrian ID tidak ditemukan");
      navigate('/bidan/queue');
      return;
    }

    const fetchData = async () => {
      try {
        const [antrianRes, obatRes] = await Promise.all([
          api.get(`/bidan/antrian/${antrianId}`),
          api.get('/bidan/obat?limit=100') // Get all medicines for dropdown
        ]);
        
        setAntrian(antrianRes.data);
        setObatList(obatRes.data || []);
        
        // Auto-fill keluhan utama from antrian if available
        if (antrianRes.data && antrianRes.data.keluhan) {
          setForm(prev => ({ ...prev, keluhanUtama: antrianRes.data.keluhan }));
        }
      } catch (err) {
        alert("Gagal memuat data: " + (err.message || 'Error'));
        navigate('/bidan/queue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [antrianId, navigate]);

  const updateForm = (field, val) => setForm({ ...form, [field]: val });

  const addMedicine = () => setMedicines([...medicines, { obat_id: '', jumlah: 1, dose: '', usage: '' }]);
  const removeMedicine = (i) => setMedicines(medicines.filter((_, idx) => idx !== i));
  const updateMedicine = (i, field, val) => { const m = [...medicines]; m[i][field] = val; setMedicines(m); };

  const handleSubmit = async () => {
    if (!form.keluhanUtama) {
      alert('Keluhan utama wajib diisi');
      return;
    }

    const validMedicines = medicines.filter(m => m.obat_id && m.dose && m.usage);
    if (validMedicines.length === 0) {
      alert('Minimal masukkan satu resep obat dengan lengkap');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        antrian_id: parseInt(antrianId),
        keluhan_utama: form.keluhanUtama,
        tekanan_darah: (form.tekananDarahSistol && form.tekananDarahDiastol) ? `${form.tekananDarahSistol}/${form.tekananDarahDiastol}` : undefined,
        berat_badan: form.beratBadan ? parseFloat(form.beratBadan) : undefined,
        tinggi_fundus_uteri: form.tinggiFundus ? parseFloat(form.tinggiFundus) : undefined,
        kondisi_janin: form.kondisiJanin || undefined,
        catatan_tambahan: form.catatanTambahan || undefined,
        resep: validMedicines.map(m => ({
          obat_id: parseInt(m.obat_id),
          jumlah: parseInt(m.jumlah) || 1,
          dosis: m.dose,
          aturan_pakai: m.usage
        })),
        perlu_kontrol: form.perluKontrol,
        tanggal_kontrol: form.perluKontrol ? form.tanggalKontrol : undefined,
        catatan_kontrol: form.perluKontrol ? (form.catatanKontrol || undefined) : undefined
      };

      await api.post('/bidan/rekam-medis', payload);
      alert('Pemeriksaan selesai dan resep berhasil disimpan!');
      navigate('/bidan/queue');
    } catch (err) {
      alert("Gagal menyimpan rekam medis: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="app-layout" id="examination-form">
        <Sidebar variant="bidan" />
        <div className="main-content">
          <Navbar variant="bidan" userName={user?.profile?.nama_lengkap || "Bidan Indah"} />
          <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <p>Memuat data pemeriksaan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout" id="examination-form">
      <Sidebar variant="bidan" />
      <div className="main-content">
        <Navbar variant="bidan" userName={user?.profile?.nama_lengkap || "Bidan Indah"} />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <Link to="/bidan/queue" className="back-btn"><IconArrowLeft size={18}/></Link>
              <h2>Form Pemeriksaan</h2>
            </div>
            <div className="queue-badge">{antrian?.no_antrian || '-'}</div>
          </div>
          <div className="split-layout">
            <div className="exam-patient-panel">
              {(() => {
                const isFemale = antrian?.jenis_kelamin === 'perempuan';
                const isMale = antrian?.jenis_kelamin === 'laki-laki';
                let avatarBg = 'linear-gradient(135deg, var(--color-primary-light), rgba(64,145,108,0.2))';
                let avatarColor = 'var(--color-primary)';
                let AvatarIcon = IconUser;

                if (isFemale) {
                  avatarBg = 'linear-gradient(135deg, #fbcfe8, rgba(236,72,153,0.2))';
                  avatarColor = '#ec4899';
                  AvatarIcon = IconFemale;
                } else if (isMale) {
                  avatarBg = 'linear-gradient(135deg, #bfdbfe, rgba(59,130,246,0.2))';
                  avatarColor = '#3b82f6';
                  AvatarIcon = IconMale;
                }

                return (
                  <div className="glass-card patient-profile-card">
                    <div className="patient-avatar-lg" style={{ background: avatarBg }}>
                      <AvatarIcon size={40} color={avatarColor} />
                    </div>
                    <h3 style={{ marginBottom: '4px' }}>{antrian?.nama_pasien || 'Nama Pasien'}</h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: 'var(--space-4)' }}>
                      {antrian?.umur ? `${antrian.umur} tahun` : '-'} • Gol. Darah: {antrian?.golongan_darah || '-'}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}><IconMapPin size={14} color="var(--color-primary)"/> {antrian?.alamat || '-'}</p>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}><IconWhatsApp size={14} color="#25D366"/> {antrian?.no_wa || '-'}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div>
              <div className="glass-card" style={{ padding: 'var(--space-7)' }}>
                <div className="exam-section-title"><IconClipboard size={20}/> Rekam Medis</div>
                <div className="form-group">
                  <label className="form-label">Keluhan Utama <span style={{color: 'red'}}>*</span></label>
                  <textarea className="form-textarea" placeholder="Keluhan pasien..." rows="3" value={form.keluhanUtama} onChange={(e) => updateForm('keluhanUtama', e.target.value)} disabled={isSubmitting}></textarea>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="form-group"><label className="form-label">Tekanan Darah (Sistol)</label><div className="input-wrapper"><input type="number" className="form-input" placeholder="120" value={form.tekananDarahSistol} onChange={(e) => updateForm('tekananDarahSistol', e.target.value)} disabled={isSubmitting}/><span className="input-action" style={{ cursor: 'default', color: 'var(--color-text-muted)' }}>mmHg</span></div></div>
                  <div className="form-group"><label className="form-label">Tekanan Darah (Diastol)</label><div className="input-wrapper"><input type="number" className="form-input" placeholder="80" value={form.tekananDarahDiastol} onChange={(e) => updateForm('tekananDarahDiastol', e.target.value)} disabled={isSubmitting}/><span className="input-action" style={{ cursor: 'default', color: 'var(--color-text-muted)' }}>mmHg</span></div></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="form-group"><label className="form-label">Berat Badan</label><div className="input-wrapper"><input type="number" className="form-input" placeholder="65" value={form.beratBadan} onChange={(e) => updateForm('beratBadan', e.target.value)} disabled={isSubmitting} /><span className="input-action" style={{ cursor: 'default', color: 'var(--color-text-muted)' }}>kg</span></div></div>
                  <div className="form-group"><label className="form-label">Tinggi Fundus Uteri <span className="form-hint">(Khusus Ibu Hamil)</span></label><div className="input-wrapper"><input type="number" className="form-input" placeholder="28" value={form.tinggiFundus} onChange={(e) => updateForm('tinggiFundus', e.target.value)} disabled={isSubmitting} /><span className="input-action" style={{ cursor: 'default', color: 'var(--color-text-muted)' }}>cm</span></div></div>
                </div>
                <div className="form-group"><label className="form-label">Kondisi Janin <span className="form-hint">(Khusus Ibu Hamil)</span></label><textarea className="form-textarea" placeholder="DJJ, posisi, gerakan..." rows="2" value={form.kondisiJanin} onChange={(e) => updateForm('kondisiJanin', e.target.value)} disabled={isSubmitting}></textarea></div>
                <div className="form-group"><label className="form-label">Catatan Tambahan</label><textarea className="form-textarea" placeholder="Catatan lain..." rows="2" value={form.catatanTambahan} onChange={(e) => updateForm('catatanTambahan', e.target.value)} disabled={isSubmitting}></textarea></div>
                
                {/* Penjadwalan Kontrol Kembali */}
                <div style={{ marginTop: 'var(--space-6)', padding: '16px', background: 'rgba(26, 178, 149, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(26, 178, 149, 0.15)', marginBottom: 'var(--space-5)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      checked={form.perluKontrol} 
                      onChange={(e) => updateForm('perluKontrol', e.target.checked)} 
                      disabled={isSubmitting}
                    />
                    Pasien Membutuhkan Kontrol Kembali?
                  </label>
                  
                  {form.perluKontrol && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="stagger-children">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Tanggal Kontrol Kembali <span style={{color: 'red'}}>*</span></label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={form.tanggalKontrol} 
                          onChange={(e) => updateForm('tanggalKontrol', e.target.value)} 
                          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Min tomorrow
                          required={form.perluKontrol}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0, marginTop: 'var(--space-3)' }}>
                        <label className="form-label">Catatan / Keperluan Kontrol <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(opsional)</span></label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Contoh: Imunisasi, Kontrol Kehamilan (kosongkan untuk Kontrol Rutin)" 
                          value={form.catatanKontrol} 
                          onChange={(e) => updateForm('catatanKontrol', e.target.value)} 
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="exam-section-title" style={{ marginTop: 'var(--space-7)' }}><IconPill size={20}/> Resep Obat <span style={{color: 'red'}}>*</span></div>
                {medicines.map((m, i) => (
                  <div className="medicine-form-row" key={i} style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: 'var(--space-3)', marginBottom: 'var(--space-4)', display: 'grid', gridTemplateColumns: '1.5fr 0.6fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Obat</label>
                      <select className="form-select" value={m.obat_id} onChange={(e) => updateMedicine(i, 'obat_id', e.target.value)} disabled={isSubmitting}>
                        <option value="">-- Pilih Obat --</option>
                        {obatList.map(obat => {
                          const isOutOfStock = obat.jumlah_stok <= 0;
                          const isExpired = obat.tanggal_kadaluarsa && new Date(obat.tanggal_kadaluarsa) < new Date();
                          let label = `${obat.nama_obat} (${obat.jumlah_stok} ${obat.satuan})`;
                          if (isExpired) {
                            label += " — [KADALUARSA]";
                          } else if (isOutOfStock) {
                            label += " — [STOK HABIS]";
                          }
                          return (
                            <option key={obat.id} value={obat.id} disabled={isOutOfStock || isExpired}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Jumlah</label>
                      <input type="number" min="1" className="form-input" placeholder="Qty" value={m.jumlah} onChange={(e) => updateMedicine(i, 'jumlah', e.target.value)} disabled={isSubmitting} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: '0.75rem' }}>Dosis</label><input className="form-input" placeholder="1x1" value={m.dose} onChange={(e) => updateMedicine(i, 'dose', e.target.value)} disabled={isSubmitting} /></div>
                    <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: '0.75rem' }}>Aturan Pakai</label><input className="form-input" placeholder="Setelah makan" value={m.usage} onChange={(e) => updateMedicine(i, 'usage', e.target.value)} disabled={isSubmitting} /></div>
                    {medicines.length > 1 && (
                      <button className="btn btn-icon btn-ghost" onClick={() => removeMedicine(i)} style={{ color: 'var(--color-error)' }} disabled={isSubmitting}><IconTrash size={18}/></button>
                    )}
                  </div>
                ))}
                <button className="btn btn-ghost" onClick={addMedicine} disabled={isSubmitting}><IconPlus size={16}/> Tambah Obat</button>
              </div>
              <div className="sticky-action-bar" style={{ marginTop: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
                <Link to="/bidan/queue" className="btn btn-ghost">Batal</Link>
                <div style={{ textAlign: 'right' }}>
                  <button className="btn btn-primary btn-lg" id="save-examination" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan...' : 'Simpan & Selesaikan'}
                  </button>
                  <div className="action-note">Status antrian otomatis Selesai, Obat dikurangi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav variant="bidan" />
    </div>
  );
}
