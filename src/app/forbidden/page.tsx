import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-gray-800">403 - Forbidden</h1>
      <p className="mt-4 text-xl text-gray-600">
        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <Link
        href="/app/dashboard"
        className="mt-6 rounded bg-blue-600 px-4 py-2 text-lg text-white transition-colors duration-300 hover:bg-blue-700"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
