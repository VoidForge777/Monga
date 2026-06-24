/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // !! PERINGATAN !!
    // Ini akan mengabaikan semua error ESLint saat build production.
    // Hanya gunakan jika lo yakin error-nya gak ngaruh ke fungsi aplikasi.
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
