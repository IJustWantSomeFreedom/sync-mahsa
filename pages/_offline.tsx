import { Center, Container, Stack, Text } from '@mantine/core'
import React from 'react'

const Offline = () => {
    return (
        <Center sx={{ height: "60vh" }}>
            <Text>You are offline, please connect to an internet</Text>
        </Center>
    )
}

export default Offline