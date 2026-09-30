# Logo Bank KPR — `public/images/bank_kpr/`

Halaman detail proyek menampilkan logo bank dari folder ini lewat
`getBankLogoUrl()` di `src/lib/projectService.ts`.

## Pemetaan nama bank → file

| Bank    | File             |
| ------- | ---------------- |
| BTN     | `Group 73.png`   |
| BSI     | `BSI Logo.png`   |
| Mandiri | `Mandiri Logo.png` |
| BCA     | `Group 77.png`   |
| BRI     | `BRI Logo.png`   |
| BNI     | `BNI Logo.png`   |
| BSN     | `BSN Logo.png`   |

Pemetaan diatur di `BANK_KPR_LOGO_FILES` — kalau nama file diganti,
sesuaikan juga di sana. Jika file belum ada, kartu logo disembunyikan
otomatis (lihat `src/app/component/BankLogo.tsx`).
