# Google Apps Script Setup

1. Buka [script.google.com](https://script.google.com/).
2. Buat project baru: `Posting Social Media MATA API`.
3. Paste kandungan `Code.gs` ke file `Code.gs`.
4. Buka `Project Settings`, aktifkan `Show appsscript.json manifest file in editor`.
5. Paste kandungan `appsscript.json` ke file manifest.
6. Klik `Deploy` > `New deployment`.
7. Pilih type `Web app`.
8. Tetapan:
   - Execute as: `Me`
   - Who has access: `Anyone`
9. Authorize akses Google Sheets dan Drive.
10. Copy `Web app URL`.
11. Masukkan URL itu ke `outputs/config.js` pada nilai `apiBaseUrl`.

Backend ini akan:

- Simpan/update `Content Master` ke row 7-60.
- Simpan/update `Idea Log` ke row 63-200.
- Upload fail ke folder Drive `MATA Social Media Management`.
- Buat subfolder ikut bulan seperti `Oktober 2026`.
