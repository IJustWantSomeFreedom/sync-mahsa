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
  publicExcludes: ["songs/*/music.mp3"],
  additionalManifestEntries: [...getSongsUrl()]
})

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: false,
  swcMinify: true,
  env: {
    BASE_SONGS_URL: process.env.BASE_SONGS_URL,
    APP_VERSION: process.env.APP_VERSION,
    CDN_URL: process.env.CDN_URL,
  },
  async headers() {
    return [
      {
        source: "/(.*?)",
        headers: [
          {
            key: 'Bypass-Tunnel-Reminder',
            value: '1',
          },
        ],
      },
    ]
  },
})

module.exports = nextConfig
