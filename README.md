# Posting Social Media MATA

Frontend statik untuk urus `Content Master` dan `Idea Log` media sosial MATA.

## Fail Untuk GitHub Pages

Upload semua fail/folder dalam folder ini ke repo GitHub:

- `index.html`
- `styles.css`
- `app.js`
- `config.js`
- `.nojekyll`
- `README.md`
- `backend/`

Untuk GitHub Pages:

1. Pergi ke repo GitHub.
2. Upload semua fail di atas ke root repo.
3. Pergi `Settings` > `Pages`.
4. Source: `Deploy from a branch`.
5. Branch: `main`, folder: `/root`.
6. Save.

## Preview

Buka `index.html` atau jalankan server statik:

```bash
python3 -m http.server 4173
```

## Fasa 1

- Data contoh dalam browser `localStorage`
- Pilihan bulan Oktober, November dan Disember 2026
- Tambah bulan baru
- Content Master: tambah, edit, search, filter, detail drawer
- Idea Log: tambah, edit, search, filter, dan tukar idea `Approved` menjadi content

## Fasa Seterusnya

Selepas layout dipersetujui:

1. Semak struktur Google Sheets `MATA Social Media Master`.
2. Bina backend/API kecil untuk Google Sheets supaya token dan secret tidak berada dalam frontend atau GitHub.
3. Sambungkan GitHub Pages kepada frontend statik.

## Sambungan Google Sheets dan Drive

Website ini sudah ada hook frontend untuk backend, tetapi belum aktif sehingga `outputs/config.js` diisi dengan URL Google Apps Script Web App.

Fail backend siap deploy ada di:

- `outputs/backend/Code.gs`
- `outputs/backend/appsscript.json`
- `outputs/backend/SETUP.md`

Flow yang disediakan:

- Simpan content atau idea dari website.
- Backend append row ke tab bulan yang betul dalam Google Sheets.
- Upload fail dari website ke Google Drive.
- Link fail Drive disimpan bersama content.

Struktur Google Sheet yang telah disemak:

- Tab tersedia: `Oktober 2026`, `November 2026`, `Disember 2026`.
- `Content Master` menggunakan header row 6 dan data bermula row 7.
- `Idea Log` menggunakan header row 62 dan data bermula row 63.
- Backend scaffold menggunakan `Content ID` dan `Idea ID` untuk update row sedia ada, bukan tambah duplicate.

Nilai yang perlu diisi kemudian:

- `DRIVE_FOLDER_ID` dalam Apps Script.
- `apiBaseUrl` dalam `outputs/config.js` selepas Apps Script dideploy sebagai Web App.

`DRIVE_FOLDER_ID` sudah diisi dengan folder `MATA Social Media Management`.
