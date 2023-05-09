/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "http://127.0.0.1:10058/",
      "localhost:10058/",
      "firebasestorage.googleapis.com",
      "localhost",
      "http://127.0.0.1:10058/",
      "localhost:10058/",
      "bubblybeaks.com",
      "https://vercel.com/leewalpole/firebase-profile",
      "https://firebasestorage.googleapis.com/v0/b/next13-firebase-002.appspot.com",
    ], // whatever port your backend runs on
  },
};

module.exports = nextConfig;
