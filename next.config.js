/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'platform-lookaside.fbsbx.com',
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com'
    ],
  },
}

module.exports = nextConfig 