const runtimeCaching = require("./cache.js")
const fs = require("fs")

const getSongsName = () => {
  return fs.readdirSync(process.env.SONGS_PATH)
}

const getSongsUrl = () => {
  const songs = getSongsName()

  return songs.map(name => {
    return {
      url: `${process.env.CDN_URL}/songs/${name}/music.mp3`,
      revision: `songs/${name}/music.mp3`
    }
  })
}

const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching,
  publicExcludes: ["icons", "fonts"],
  additionalManifestEntries: [...getSongsUrl()]
})

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer(withPWA({
  reactStrictMode: true,
  swcMinify: true,
  env: {
    BASE_SONGS_URL: process.env.BASE_SONGS_URL,
    APP_VERSION: process.env.APP_VERSION,
    CDN_URL: process.env.CDN_URL,
  },
  async headers() {
    const headers = []

    if (process.env.NODE_ENV === "development") {
      headers.push({
        source: "/(.*?)",
        headers: [
          {
            key: 'Bypass-Tunnel-Reminder',
            value: '1',
          },
        ],
      })
    }

    return headers
  },
}))

module.exports = nextConfig
