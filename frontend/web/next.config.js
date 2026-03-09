/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_IDENTITY: process.env.API_IDENTITY || 'http://localhost:8080',
    API_INTERNSHIP: process.env.API_INTERNSHIP || 'http://localhost:8083',
    API_RECOMMENDATION: process.env.API_RECOMMENDATION || 'http://localhost:8007',
    API_VIDEO: process.env.API_VIDEO || 'http://localhost:4000',
  },
}

module.exports = nextConfig
