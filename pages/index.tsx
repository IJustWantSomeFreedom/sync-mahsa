import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { SongLibrary, Songs } from '../lib/SongLibrary'
import React from "react"
import dynamic from 'next/dynamic'

const Home = dynamic(() => import('../components/pages/Home'), {
  ssr: false
})

const HomePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ songs }) => {
  return (
    <Home songs={songs} />
  )
}

export const getStaticProps: GetStaticProps<{ songs: Songs }> = async () => {
  const songLibrary = SongLibrary.getInstance()

  return {
    props: {
      songs: await songLibrary.getSongs()
    }
  }
}

export default HomePage
