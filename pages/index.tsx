import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import React from "react"
import dynamic from 'next/dynamic'
import { SongParser } from '../lib/SongParser'
import { SONGS_PATH } from '../lib/env'
import { SongFullDetails } from '../lib/SongParser/types'

const Home = dynamic(() => import('../components/pages/Home'), {
  ssr: false
})

const HomePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ songs }) => {
  return (
    <Home songs={songs} />
  )
}

export const getStaticProps: GetStaticProps<{ songs: SongFullDetails[] }> = async () => {
  const songs = await SongParser.getAll({
    path: SONGS_PATH
  })

  return {
    props: {
      songs
    }
  }
}

export default HomePage
