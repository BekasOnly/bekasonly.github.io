README - BekasOnly (Online Admin + Firebase)
================================================

Isi paket:
- index.html        -> Toko utama (menampilkan produk dari Firestore)
- admin.html        -> Panel admin (login + CRUD produk)
- style.css         -> Styling (tema coklat + gold)
- script.js         -> Frontend script (produk, keranjang, WA)
- admin.js          -> Admin panel script (Auth + Firestore)
- firebase-config.js-> TEMPLATE (ganti dengan config proyekmu)
- deploy-instructions.txt -> langkah singkat deploy

Langkah singkat setup Firebase:
1. Buka https://console.firebase.google.com dan buat project baru.
2. Di Project settings -> Add app -> pilih "Web" -> catat konfigurasi (apiKey, authDomain, projectId, dll).
3. Aktifkan Firestore Database (mode: production atau test).
4. Aktifkan Authentication -> Sign-in method -> Email/Password.
5. (Opsional) Buat akun admin manual:
   - Di Authentication -> Users -> Add user -> masukkan email & password untuk admin.
6. Salin konfigurasi ke file `firebase-config.js` (ganti placeholder).
7. (Opsional) Tambah beberapa dokumen ke koleksi 'products' di Firestore:
   - Collection: products
   - Fields: name (string), description (string), price (string, contoh 'Rp 250.000'), category (string), image (string, URL)
8. Coba buka `index.html` (setelah firebase-config.js terpasang) — produk akan dimuat dari Firestore.
9. Untuk deploy ke Firebase Hosting:
   - Install Firebase CLI: `npm install -g firebase-tools`
   - `firebase login`
   - `firebase init` -> pilih Hosting, pilih projectmu, set public directory ke "public" (atau upload file ke hosting)
   - Kopi file ke folder public, lalu `firebase deploy`

Atau deploy ke Netlify/Vercel dengan mengupload file ke repo GitHub dan hubungkan.

Catatan keamanan:
- Jangan bagikan firebase-config.js dengan akses ke project di repo publik jika kamu mengaktifkan rules yang longgar.
- Atur Firestore Security Rules sesuai kebutuhan (hanya admin yang boleh write). Contoh sederhana:
  service cloud.firestore { match /databases/{database}/documents {
    match /products/{doc} { allow read: if true; allow write: if request.auth != null; }
  }}

