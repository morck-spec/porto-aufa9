# 🚀 Antigravity Creative Portfolio (Zero-Gravity Space Theme)

Website portofolio personal satu halaman (*single-page*) interaktif dengan tema **Antigravity / Deep Space Ethereal**. Dibuat 100% statis, sangat ringan, responsif, dan siap di-host langsung di **GitHub Pages**.

---

## 🛠️ Stack Teknologi
- **HTML5**: Struktur semantik dengan metadata SEO lengkap.
- **CSS3**: Variable CSS, Keyframe Animations, Glassmorphism, & Responsive Breakpoints.
- **Vanilla JavaScript (ES6+)**: Particle Canvas Engine, Mouse Parallax, 3D Tilt, IntersectionObserver, & Modal Manager.
- **Library Tambahan (via CDN)**: Font Awesome 6.5.1, Google Fonts (Outfit & Plus Jakarta Sans), GSAP 3.12.

---

## 📁 Struktur Berkas

```
portofolio_aufa/
├── index.html              # Berkas HTML utama (Disertai komentar edit data)
├── style.css               # Styling CSS lengkap & animasi keyframe floating
├── script.js               # Logika interaksi JS (Partikel, Parallax, Tilt, & Modal)
├── README.md               # Panduan penggunaan & deployment
└── assets/
    └── images/             # Gambar preview proyek
        ├── project-1.jpg
        ├── project-2.jpg
        └── project-3.jpg
```

---

## ✍️ Panduan Mengganti Data Placeholder

Semua bagian yang perlu Anda ganti telah dilengkapi dengan komentar `<!-- PENTING: EDIT ... DI SINI -->` di dalam file `index.html`.

### 1. Mengganti Nama & Gelar Profesi
Buka `index.html`, cari baris berikut di **Hero Section**:
```html
<h1 class="hero-title reveal-text">
    Halo, Saya <span class="gradient-text hero-name">Nama Anda</span>
    <br>
    <span class="title-sub">Senior Frontend Architect & UI/UX Specialist</span>
</h1>
```

### 2. Mengganti Foto / Avatar
Ganti file di `assets/images/` atau ubah `src` pada elemen avatar/project card. Anda bisa memasukkan foto diri Anda dalam format PNG/JPG.

### 3. Mengganti Link Proyek & GitHub
Di bagian **Projects Section**, ubah link `href` dan gambar `project-1.jpg` sesuai proyek karya Anda:
```html
<a href="https://github.com/username/project-repo" target="_blank">Source Code</a>
```

### 4. Mengganti Email & Sosial Media
Di bagian **Contact Section**, ganti email & link sosial media:
```html
<a href="mailto:emailanda@domain.com">emailanda@domain.com</a>
<a href="https://linkedin.com/in/username">LinkedIn</a>
```

---

## 🌐 Cara Deploy ke GitHub Pages (100% Gratis)

1. Buat repositori baru di GitHub (misal: `portofolio-antigravity` atau `username.github.io`).
2. Upload semua file (`index.html`, `style.css`, `script.js`, `README.md`, dan folder `assets/`).
3. Di halaman repositori GitHub Anda, klik tab **Settings**.
4. Di menu sebelah kiri, pilih **Pages**.
5. Di bagian **Build and deployment** > **Branch**, pilih branch `main` (atau `master`) dan folder `/ (root)`.
6. Klik **Save**.
7. Tunggu 1–2 menit, website portofolio Anda siap diakses di `https://username.github.io/portofolio-antigravity`!

---

## ✨ Fitur Antigravitasi Utama
- **Floating Particles**: Debu partikel bintang di latar belakang bergerak perlahan ke atas (efek apung/nol-gravitasi) dan terdorong oleh kursor mouse.
- **3D Tilt Effect**: Kartu proyek miring 3D dan memiliki efek pantulan cahaya specular saat kursor di-hover.
- **Mouse Parallax**: Elemen background bergerak berlawanan arah dengan gerakan kursor mouse (otomatis dinonaktifkan di layar HP untuk efisiensi baterai).
- **Falling Up Animation**: Elemen section kontak & statistik muncul dari bawah melayang ke atas (*falling up*) saat di-scroll.
- **Zero-G Extra Booster Button**: Tombol interaktif di navigasi untuk mengaktifkan efek gravitasi nol ekstra (partikel & cahaya lebih pekat).
