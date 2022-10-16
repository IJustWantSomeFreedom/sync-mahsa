const runtimeCaching = require("./cache.js")

const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching
})

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  env: {
    BASE_SONGS_URL: process.env.BASE_SONGS_URL,
    APP_VERSION: process.env.APP_VERSION
  }
})

module.exports = nextConfig
