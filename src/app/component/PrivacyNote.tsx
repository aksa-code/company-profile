import Link from "next/link";

// Catatan persetujuan singkat di bawah tombol form pengumpul data.
// Tanpa checkbox agar tidak menambah friksi — cukup dibaca saat mengisi form.
export default function PrivacyNote({ dark = false }: { dark?: boolean }) {
  return (
    <p
      className={`text-[10px] leading-relaxed ${
        dark ? "text-gray-400" : "text-slate-400"
      }`}
    >
      * Dengan menekan tombol ini, Anda setuju data Anda kami gunakan untuk
      menghubungi kembali dan pengukuran iklan, sesuai{" "}
      <Link
        href="/privasi"
        className={
          dark
            ? "text-gray-200 underline underline-offset-2 hover:text-white"
            : "text-slate-600 underline underline-offset-2 hover:text-slate-800"
        }
      >
        Kebijakan Privasi
      </Link>{" "}
      kami.
    </p>
  );
}

/**
 * Field jebakan anti-bot: disembunyikan di luar layar (bukan display:none
 * agar bot sederhana tetap mengisinya). Manusia tidak pernah melihat/
 * mengisinya. Dipasangkan dengan isHoneypotFilled() dari lib/antispam.
 */
export function HoneypotField() {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      placeholder="Website"
      className="absolute left-[-9999px] top-auto h-px w-px opacity-0"
    />
  );
}
