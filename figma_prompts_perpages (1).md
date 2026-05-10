# 14 Prompt Siap Pakai — Figma AI
## Indah Care Plus (IC+) — Sistem Manajemen Klinik Bidan

---

> ⚠️ **PENTING:** Sebelum mulai ke Prompt 1–14, jalankan **PROMPT 0** terlebih dahulu.
> Prompt 0 adalah fondasi design system yang akan membuat semua halaman konsisten.

---

## 🔧 PROMPT 0 — Design System & Component Library
*(Jalankan PERTAMA KALI, hanya sekali)*

```
Create a complete design system and component library for a web app called 
"Indah Care Plus (IC+)", a luxury midwife clinic management system.

DESIGN TOKENS:
Color:
- Primary: #40916C (Jade Green)
- Primary Dark: #2D6A4F (Deep Jade)
- Primary Light: #D7F5E9 (Soft Mint)
- Accent: #B5943A (Warm Antique Gold)
- Accent Light: #F0E4C2 (Pale Gold)
- Dark: #1A3D2E (Deep Forest)
- Background: #F3FAF7 (Misty Mint)
- Surface: #FFFFFF
- Success: #40916C (same as Primary)
- Warning: #E9C46A (Amber)
- Error: #E05C5C (Soft Red)
- White: #FFFFFF

Typography:
- Heading: Playfair Display Bold
- Subheading: Playfair Display SemiBold
- Body: Inter Regular 14–16px
- Label: Inter Medium 12–14px
- Accent: Cormorant Garamond Italic

Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
Border radius: 8px inputs, 12px buttons, 16px cards, 999px pills
Shadow: soft jade-tinted shadow (0 4px 12px rgba(64,145,108,0.12))

COMPONENTS TO GENERATE:
1. Buttons: Primary gold filled, Secondary outlined rose gold, 
   Ghost, Danger red, Disabled — all with hover and active states
2. Input fields: text, password (with show/hide toggle), 
   textarea, date picker, dropdown — Default, Focus, Error, Disabled states
3. Cards: Stat card, Action card, Patient card, Info card — 
   glassmorphism style with frosted soft background
4. Status badges/pills: Open (green), Closed (red), 
   Holiday (yellow), Waiting (amber), Done (green), 
   Critical stock (red), Warning stock (orange)
5. Navigation: Top navbar desktop, Bottom navbar mobile, 
   Collapsible sidebar for bidan
6. Toggle switch: large prominent Open/Close clinic toggle
7. Modal/Dialog: Confirmation modal, Form modal
8. Toast notifications: Success, Error, Warning, Info
9. Empty state: illustration placeholder + CTA button
10. Loading skeleton: card and list variants
11. Step indicator: 2-step progress bar
12. Timeline item: for medical record history list
13. Queue number badge: large circle with number

Style: Luxury feminine healthcare, glassmorphism cards, 
soft gradients, outlined icons stroke 1.5px.
Frame size: 1440px desktop components frame.
```

---

## 🌐 PROMPT 1 — Landing Page (Desktop)

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body, 
glassmorphism cards, 16px border radius, soft jade shadow 
(0 4px 12px rgba(64,145,108,0.12)).

Design a full Landing Page for "Indah Care Plus (IC+)" midwife clinic app.
Frame size: 1440 x 900px (desktop).

SECTIONS (top to bottom):
1. NAVBAR: IC+ logo left (monogram IC+ in rose gold), 
   navigation links center (Beranda, Layanan, Tentang), 
   "Masuk" outlined button + "Daftar" gold filled button right side.

2. HERO SECTION: 
   - Left side: headline "Layanan Kebidanan Terpercaya, Kini Hadir Digital" 
     in Playfair Display, subtext in Inter, 
     Clinic status pill badge — show OPEN state: 
     green dot + "🟢 Klinik Sedang Buka" green pill,
     Two CTA buttons: "Daftar Sekarang" (gold filled large) + 
     "Masuk ke Sistem" (outlined rose gold)
   - Right side: soft pastel medical illustration placeholder 
     (abstract feminine healthcare art, no real people)

3. SERVICES SECTION:
   Title "Layanan Kami" centered, subtitle below.
   6 service cards in 3-column grid: 
   ANC / Pemeriksaan Kehamilan, Persalinan, Imunisasi Bayi, 
   KB / Kontrasepsi, Nifas & Laktasi, Konsultasi Kesehatan.
   Each card: icon (outlined), service name, short description.
   Glassmorphism card style.

4. ABOUT SECTION:
   Left: soft circular avatar placeholder for bidan photo.
   Right: "Tentang Bidan Kami" title, 2-3 lines bio text placeholder, 
   credential badges (STR, Profesi).

5. FOOTER: 
   IC+ logo, tagline, address, WhatsApp contact button (green), 
   copyright text.

Overall feel: elegant, warm, trustworthy, premium feminine healthcare.
```

---

## 📱 PROMPT 2 — Landing Page (Mobile)

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body, 
glassmorphism cards, 16px border radius.

Design a Mobile Landing Page for "Indah Care Plus (IC+)" midwife clinic app.
Frame size: 390 x 844px (iPhone 14 size).

LAYOUT (top to bottom, single column):
1. NAVBAR: IC+ logo left, hamburger menu icon right (rose gold).

2. HERO: 
   - Clinic status pill at top: "🟢 Klinik Sedang Buka"
   - Headline Playfair Display large
   - Short subtext
   - "Daftar Sekarang" gold button full width
   - "Masuk" ghost button full width
   - Soft illustration below buttons

3. SERVICES: Horizontal scroll cards (2.5 cards visible), 
   each card with icon and service name.

4. ABOUT: Centered circular avatar, name, short bio.

5. BOTTOM CONTACT BAR: sticky bottom bar with WhatsApp icon 
   and "Hubungi Kami" text.

Style: elegant, mobile-first, thumb-friendly spacing, 
all touch targets minimum 48px height.
```

---

## 🔐 PROMPT 3 — Register Page

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body, 
glassmorphism card, 16px border radius.

Design a 2-step Registration Page for IC+ midwife clinic app.
Show BOTH steps side by side in one frame, labeled "Step 1" and "Step 2".
Frame size: 1440 x 900px desktop. Also create mobile version 390px.

STEP 1 — Buat Akun:
- IC+ logo centered top
- Step indicator: Step 1 of 2 progress bar (jade green filled for step 1)
- Card centered (glassmorphism): 
  Title "Buat Akun Baru" Playfair Display
  Subtitle "Daftarkan diri Anda untuk mengakses layanan IC+"
  - Email input field
  - Password input field with show/hide eye toggle
  - Confirm password input field
  - "Lanjut →" gold filled button full width
  - "Sudah punya akun? Masuk di sini" link below

STEP 2 — Data Diri Lengkap:
- Step indicator: Step 2 of 2 (both steps filled)
- Card centered (glassmorphism):
  Title "Lengkapi Data Diri" Playfair Display
  - Nama Lengkap input
  - Tanggal Lahir date picker
  - Jenis Kelamin: radio button group (Perempuan | Laki-laki), 
    pill style selection
  - Alamat textarea
  - Nomor WhatsApp input with WA green icon prefix
  - Golongan Darah dropdown (A, B, AB, O, Tidak Tahu)
  - "Selesai & Masuk" gold filled button full width
  - Back link to step 1

Left side of page (desktop): decorative panel with IC+ branding, 
soft gradient jade green to deep forest (#1A3D2E), 
tagline "Kesehatan Anda, Prioritas Kami".
```

---

## 🔑 PROMPT 4 — Login Page

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body.

Design a Login Page for IC+ midwife clinic app.
Frame size: 1440 x 900px desktop + 390px mobile version.

LAYOUT:
Left panel (desktop only): full height decorative panel, 
soft jade green gradient (#40916C to #1A3D2E), IC+ large monogram logo centered, 
tagline "Selamat Datang Kembali" in Cormorant Garamond Italic, 
subtle botanical or lotus line art illustration in pale gold (#F0E4C2).

Right panel / full page (mobile):
- IC+ logo centered top
- Title "Masuk ke Akun Anda" Playfair Display
- Subtitle "Kelola layanan kesehatan Anda dengan mudah"
- Glassmorphism login card:
  - Email input
  - Password input with show/hide toggle
  - "Lupa password?" link aligned right, jade green color
  - "Masuk" antique gold filled button full width large
  - Divider line with "atau" text centered
  - "Belum punya akun? Daftar di sini" link centered

Show both DEFAULT state and ERROR state of the form 
(error: red border on inputs, error message below field).
```

---

## 🏠 PROMPT 5 — Patient Dashboard (Home)

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body, 
glassmorphism cards, soft jade shadow.

Design a Patient Dashboard Home page for IC+ midwife clinic app.
Frame size: 1440 x 900px desktop + 390px mobile.

DESKTOP LAYOUT:
- Top navbar: IC+ logo left, center empty, 
  right: notification bell icon + patient avatar + "Halo, [Nama]" text.
- Page content below navbar:

LEFT SIDEBAR (240px): navigation menu items:
  🏠 Beranda (active), 📋 Daftar Kunjungan, 
  📂 Rekam Medis, 💊 Resep Saya, 🔔 Notifikasi, 
  ⚙️ Pengaturan, 🚪 Keluar.
  IC+ logo at top of sidebar. Active item: jade green background pill.

MAIN CONTENT AREA:
1. Greeting banner card (full width, jade green gradient #40916C to #2D6A4F): 
   "Selamat Datang, [Nama Pasien] 👋" Playfair Display white text, 
   today's date right side, 
   clinic status mini badge bottom of card.

2. QUICK ACTION CARDS (4 cards in a row):
   Each card glassmorphism, icon top, title, short description:
   - 📋 Daftar Kunjungan "Buat janji temu baru"
   - 📂 Rekam Medis "Lihat riwayat pemeriksaan"
   - 💊 Resep Saya "Lihat resep dari bidan"
   - 🔔 Notifikasi "Pengingat jadwal kontrol"

3. UPCOMING APPOINTMENT CARD (if exists):
   Jade green left border accent (#40916C, 4px), calendar icon, 
   "Jadwal Kontrol Berikutnya" label, 
   date and time prominent, 
   "H-1 Pengingat Aktif ✓" green badge.

4. RECENT VISITS (last 2 entries):
   Section title "Kunjungan Terakhir" + "Lihat Semua →" jade green link.
   2 visit cards: date, complaint summary, "Selesai" green badge.

MOBILE: bottom navigation bar replacing sidebar, 
single column layout, greeting card full width.
```

---

## 📋 PROMPT 6 — Pendaftaran Layanan (Pasien)

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body, 
glassmorphism cards.

Design a "Daftar Kunjungan Baru" (New Visit Registration) page 
for IC+ patient interface.
Frame size: 1440 x 900px desktop + 390px mobile.
Show TWO states: FORM STATE and SUCCESS STATE.

FORM STATE:
- Page title "Daftar Kunjungan Baru" with back arrow
- Clinic status banner at top: 
  GREEN: "🟢 Klinik Sedang Buka — Pendaftaran Tersedia" 
  (also show RED disabled state: "🔴 Klinik Sedang Tutup — 
  Pendaftaran Tidak Tersedia" with all form inputs disabled and grayed out)
- Glassmorphism form card centered:
  - Tanggal Kunjungan: calendar date picker component
  - Keluhan / Keperluan: textarea with character counter (0/300)
  - Preview summary mini card: shows selected date and complaint
  - "Konfirmasi Pendaftaran" antique gold filled button full width
  - Cancel link below button

SUCCESS STATE (show as separate frame):
- Centered success illustration (soft checkmark or lotus flower in jade green)
- "Pendaftaran Berhasil! 🎉" title Playfair Display
- Queue ticket card (jade green border, rounded):
  Nomor Antrian: large bold number e.g. "A-07"
  Tanggal: [selected date]
  Status: "Menunggu" amber badge
- "Kembali ke Beranda" antique gold button
- "Lihat Rekam Medis" outlined jade button
```

---

## 📂 PROMPT 7 — Rekam Medis (Pasien)

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body, 
glassmorphism cards.

Design a Medical Record page for IC+ patient interface.
Frame size: 1440 x 900px desktop + 390px mobile.
Show TWO states: LIST VIEW and DETAIL VIEW.

LIST VIEW:
- Page title "Riwayat Rekam Medis" with back arrow
- Search bar to search by date or complaint
- Timeline-style list of visit entries (most recent first):
  Each entry card (left: date column with vertical jade green line connecting cards):
  - Date badge (jade green pill #40916C)
  - Complaint summary text
  - "Selesai" green badge or "Menunggu" amber badge
  - "Lihat Detail →" jade green text link
  Show 4 sample entries in the list.
- Empty state (if no records): 
  soft illustration + "Belum ada riwayat pemeriksaan" text

DETAIL VIEW (show as modal overlay or separate frame):
- Modal or full page title "Detail Kunjungan — [Date]"
- Section "Hasil Pemeriksaan":
  Data rows: Keluhan, Tekanan Darah, Berat Badan, 
  Kondisi Janin, Catatan Bidan — label left, value right
- Divider
- Section "Resep Obat":
  Title with pill icon
  Medicine item rows (each row): 
  medicine name bold, dose and usage rule below in smaller text, 
  jade green left border accent (#40916C, 3px)
  Show 2-3 sample medicines
- Section "Jadwal Kontrol Berikutnya":
  Calendar icon + date + "Pengingat WA Aktif ✓" jade green text
- Close/Back button
```

---

## 🏥 PROMPT 8 — Bidan Dashboard (Home)

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body, 
glassmorphism cards.

Design a Bidan (Midwife) Dashboard Home page for IC+ clinic management.
Frame size: 1440 x 900px desktop + 390px mobile.

DESKTOP LAYOUT:
- Top navbar: IC+ logo left, "Dashboard Bidan" title center, 
  right: notification bell + "Bidan [Nama]" + avatar.

LEFT SIDEBAR (240px): 
  🏠 Beranda (active), 🪑 Kelola Antrian, 
  📅 Jadwal Kontrol, 📊 Monitor Kunjungan, 
  👥 Data Pasien, 📦 Inventori Obat, 
  ⚙️ Pengaturan, 🚪 Keluar.

MAIN CONTENT:
1. CLINIC STATUS TOGGLE CARD (prominent, full width):
   Large card with jade green gradient (#40916C to #2D6A4F), white text.
   Left: "Status Klinik Hari Ini" title, current time.
   Center: BIG TOGGLE SWITCH (show OPEN state — toggle green right):
   Label "BUKA" white when active.
   Right: "Klinik Sedang BUKA" large text in white, 
   "Diperbarui 07:30" small timestamp.
   Also show the CLOSED state variant below 
   (card background dark #1A3D2E, toggle gray left, "TUTUP" label).

2. STAT CARDS ROW (4 cards, glassmorphism):
   - Total Pasien Hari Ini: number "12", person icon, jade green accent
   - Antrian Menunggu: number "5", clock icon, amber #E9C46A color
   - Antrian Selesai: number "7", checkmark icon, jade green color
   - Stok Obat Kritis: number "2", warning icon, red #E05C5C with pulse dot

3. QUICK NAVIGATION CARDS (2x3 grid):
   Each card glassmorphism: icon in jade green circle, 
   menu name, short description, arrow →
   Kelola Antrian, Jadwal Kontrol, Monitor Kunjungan, 
   Data Pasien, Inventori Obat, Laporan.

MOBILE: bottom navigation bar, status toggle card at top full width, 
stat cards 2x2 grid.
```

---

## 🪑 PROMPT 9 — Kelola Antrian (Bidan)

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body, 
glassmorphism cards.

Design a "Kelola Antrian" (Queue Management) page for IC+ bidan interface.
Frame size: 1440 x 900px desktop + 390px mobile.

LAYOUT:
- Page title "Antrian Pasien — [Today's Date]" with back arrow
- Summary row: "Total: 10 | Menunggu: 4 | Selesai: 6"
- Filter tabs: "Semua" (active) | "Menunggu" | "Selesai" 
  — pill tab style, jade green active (#40916C)

QUEUE LIST (vertical cards):
Show 5 sample patient cards:
Each card contains:
  - LEFT: Queue number badge (large circle, jade green #40916C, white bold number)
  - CENTER: 
    Patient name bold, age small text below
    Registration time: "Daftar pukul 08:15"
    Complaint summary: short italic text
  - RIGHT: 
    Status badge: 
    "Menunggu" (amber #E9C46A pill) OR "Selesai" (jade green pill)
    Below badge: "Periksa Sekarang →" jade green outlined button 
    (only visible on Menunggu status cards)
    For Selesai cards: show checkmark icon only

Show 3 cards with "Menunggu" status and 2 cards with "Selesai" status.

Empty state frame: soft illustration + 
"Belum ada pasien yang mendaftar hari ini" text + 
"Refresh" button.

MOBILE: same cards but full width, 
"Periksa Sekarang" button becomes full width below patient info.
```

---

## 📝 PROMPT 10 — Form Pemeriksaan Pasien (Bidan)

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body, 
glassmorphism cards.

Design a "Form Pemeriksaan Pasien" (Patient Examination Form) page 
for IC+ bidan interface.
Frame size: 1440 x 900px desktop + 390px mobile.

DESKTOP: Split layout (2 columns)

LEFT PANEL (380px, fixed):
- Title "Informasi Pasien"
- Patient profile card (glassmorphism):
  Avatar circle placeholder top center
  Patient name large bold
  Age, blood type, address in smaller text
  WhatsApp number with WA icon
- "Riwayat Kunjungan Sebelumnya" section:
  Last 2 visits mini cards (date + complaint summary + Selesai badge)

RIGHT PANEL (scrollable, main content):
- Title "Form Pemeriksaan" + queue number badge top right

SECTION 1 — Rekam Medis:
  Title "📋 Rekam Medis" with divider
  - Keluhan Utama: textarea
  - Tekanan Darah: two inputs side by side (Sistol / Diastol) + "mmHg" unit
  - Berat Badan: number input + "kg" unit suffix
  - Tinggi Fundus Uteri: number input + "cm" unit 
    (with "(Khusus Ibu Hamil)" label in italic)
  - Kondisi Janin: textarea (with same italic label)
  - Catatan Tambahan: textarea

SECTION 2 — Resep Obat:
  Title "💊 Resep Obat" with divider
  - Medicine rows (show 2 sample rows):
    Each row: Nama Obat input | Dosis input | Aturan Pakai input | 
    🗑️ delete icon
    Jade green left border accent (#40916C, 3px) on each row
  - "+ Tambah Obat Lagi" ghost button with plus icon jade green
  
BOTTOM ACTION BAR (sticky):
  "Simpan & Selesaikan Pemeriksaan" antique gold filled large button right side
  "Batal" ghost button left side
  Note: "Status antrian akan otomatis berubah menjadi Selesai" 
  small italic text in jade green below button

MOBILE: single column, all sections stacked vertically, 
patient info collapsible accordion at top.
```

---

## 📅 PROMPT 11 — Kelola Jadwal Kontrol (Bidan)

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body, 
glassmorphism cards.

Design a "Kelola Jadwal Kontrol" (Control Schedule Management) page 
for IC+ bidan interface.
Frame size: 1440 x 900px desktop + 390px mobile.

LAYOUT (desktop: 2 column):

LEFT COLUMN (form, 480px):
- Title "Tetapkan Jadwal Kontrol" Playfair Display
- Glassmorphism form card:
  - Patient search input with autocomplete dropdown 
    (show dropdown with 3 sample patient names)
  - Selected patient mini card (appears after selection):
    avatar, name, last visit date, pregnancy age if applicable
  - Tanggal Kontrol Berikutnya: calendar date picker (prominent)
  - Catatan / Pengingat: textarea optional
  - Info note: "💬 Pasien akan otomatis mendapat notifikasi WA H-1 
    sebelum jadwal kontrol" — jade green soft info box (#D7F5E9 background)
  - "Simpan Jadwal Kontrol" antique gold button full width

RIGHT COLUMN (list, remaining width):
- Title "Jadwal Kontrol Terdaftar"
- Table/card list of upcoming schedules:
  Columns: Nama Pasien | Tanggal Kontrol | Usia Kehamilan | 
  Status Notifikasi | Aksi
  Status Notifikasi badges: 
  "WA Terkirim ✓" jade green OR "Belum Dikirim" gray
  Show 5 sample rows
- Empty state if no schedules

MOBILE: single column, form first then list below.
```

---

## 📊 PROMPT 12 — Monitor Kunjungan + Kelola Data Pasien (Bidan)

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body, 
glassmorphism cards.

Design TWO pages in one frame for IC+ bidan interface:
Frame size: 1440 x 900px desktop for each.

PAGE A — Monitor Kunjungan:
- Page title "Monitor Kunjungan Pasien"
- Filter row: date range picker (From – To) + patient name search + 
  "Filter" button
- Summary stat row (3 cards): 
  Total Kunjungan | Rata-rata Per Hari | Pasien Unik
- Data table (desktop):
  Columns: No | Nama Pasien | Tanggal | Keluhan | 
  Status (Selesai green / Menunggu amber) | Aksi (Lihat Detail)
  Show 6 sample rows with alternating row background (very subtle)
  Rounded table with rose shadow
- Mobile: card list instead of table, each card shows same info

PAGE B — Kelola Data Pasien:
- Page title "Data Pasien"
- Action row: search input left + "Tambah Pasien" gold button right
- Patient table (desktop):
  Columns: Nama | Usia | No. WhatsApp | Tanggal Daftar | Aksi (Edit | Detail)
  Show 5 sample rows
- "Tambah/Edit Pasien" side drawer (show open state):
  Right side drawer 400px wide with form fields same as registration:
  Nama, Tanggal Lahir, Jenis Kelamin, Alamat, No. WA, Golongan Darah
  "Simpan" gold button + "Batal" ghost button at bottom
- Mobile: card list + floating "+" add button bottom right.
```

---

## 📦 PROMPT 13 — Manajemen Inventori Obat (Bidan)

```
Using IC+ design system: primary #B76E79, accent gold #C9A84C, 
background #FAF6F7, Playfair Display headings, Inter body, 
glassmorphism cards.

Design an "Manajemen Inventori Obat" (Medicine Inventory) page 
for IC+ bidan interface.
Frame size: 1440 x 900px desktop + 390px mobile.

LAYOUT:
- Page title "Inventori Obat"
- WARNING BANNER (show when critical): 
  Red/amber banner at top: "⚠️ 2 Obat Membutuhkan Perhatian: 
  1 stok kritis, 1 hampir kadaluarsa" with "Lihat →" link

- Action row: search input + filter dropdown (Semua/Kritis/Kadaluarsa) + 
  "Tambah Obat" gold button

- INVENTORY TABLE/CARDS:
  Columns: Nama Obat | Kategori | Stok | Satuan | 
  Tgl Kadaluarsa | Status | Aksi (Edit | Kurangi Stok)
  
  Show 6 sample medicine rows with DIFFERENT status badges:
  Row 1: "Aman" green badge (stok: 50)
  Row 2: "Aman" green badge (stok: 30)
  Row 3: "Hampir Habis" yellow badge (stok: 8) — row slightly highlighted
  Row 4: "Stok Habis" red badge (stok: 0) — row red tinted background
  Row 5: "Hampir Kadaluarsa" orange badge — expiry date in orange
  Row 6: "Kadaluarsa" dark red badge — row gray crossed out feel

- "Tambah/Edit Obat" MODAL (show open state):
  Centered modal card (glassmorphism, jade green header):
  Title "Tambah Obat Baru"
  - Nama Obat input
  - Kategori dropdown
  - Jumlah Stok number input + Satuan input (tablet/botol/ampul)
  - Tanggal Kadaluarsa date picker
  - Batas Stok Minimum number input 
    (for triggering low stock warning)
  - "Simpan" antique gold button + "Batal" ghost button

MOBILE: card list format, each card shows medicine name, 
stock, expiry, status badge. FAB button "+" jade green for add new.
```

---

## 🔔 PROMPT 14 — Notifikasi Pasien + Prototype Notes

```
Using IC+ design system: primary #40916C (Jade Green), accent gold #B5943A, 
background #F3FAF7, dark #1A3D2E, Playfair Display headings, Inter body, 
glassmorphism cards.

Design a "Notifikasi" (Notifications) page for IC+ patient interface.
Frame size: 1440 x 900px desktop + 390px mobile.

LAYOUT:
- Page title "Notifikasi"
- Filter tabs: "Semua" | "Belum Dibaca" | "Sudah Dibaca"
- Notification list (vertical):
  Show 5 sample notifications:

  UNREAD notifications (rose gold left border 3px, slightly warmer background):
  Item 1: 🔔 WA icon | "Pengingat Jadwal Kontrol" bold title | 
    "Besok adalah jadwal kontrol kehamilanmu. Jangan lupa hadir ya!" | 
    "2 jam lalu" timestamp | "Belum Dibaca" rose gold dot

  Item 2: ✅ icon | "Pendaftaran Berhasil" bold title |
    "Kunjunganmu untuk tanggal 15 Juni telah terdaftar. No. antrian: A-07" |
    "Kemarin" timestamp

  READ notifications (normal background, no border):
  Item 3-5: similar format but dimmer, no rose dot

- Empty state: soft illustration + "Tidak ada notifikasi" text

---
PROTOTYPE CONNECTIONS GUIDE (manual in Figma):

PASIEN FLOW:
Landing Page → [CTA Daftar] → Register Page Step 1
Register Step 1 → [Lanjut] → Register Step 2  
Register Step 2 → [Selesai & Masuk] → Login Page
Login Page → [Masuk] → Patient Dashboard
Patient Dashboard → [Daftar Kunjungan card] → Pendaftaran Layanan
Pendaftaran Layanan → [Konfirmasi] → Success State
Pendaftaran Success → [Kembali ke Beranda] → Patient Dashboard
Patient Dashboard → [Rekam Medis card] → Rekam Medis List
Rekam Medis List → [Lihat Detail] → Rekam Medis Detail Modal
Landing Page → [Masuk CTA] → Login Page
Login Page → [Daftar di sini] → Register Page

BIDAN FLOW:
Login Page → [Masuk] → Bidan Dashboard
Bidan Dashboard → [Toggle BUKA] → Dashboard (status changed)
Bidan Dashboard → [Kelola Antrian] → Antrian List
Antrian List → [Periksa Sekarang] → Form Pemeriksaan
Form Pemeriksaan → [Simpan & Selesaikan] → Antrian List (status Selesai)
Bidan Dashboard → [Jadwal Kontrol] → Kelola Jadwal
Kelola Jadwal → [Simpan Jadwal] → Jadwal (list updated)
Bidan Dashboard → [Inventori Obat] → Inventori Page
Inventori Page → [Tambah Obat] → Add Modal open
Bidan Dashboard → [Toggle TUTUP] → Dashboard (status changed to Tutup)
```
