import { Container, Space, Stack, Text } from '@mantine/core';
import React from 'react'
import QRCode from "qrcode"
import { APP_URL } from '../lib/env';
import { useClipboard } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import MediaWrapper from '../components/MediaWrapper';

let qrCode: string;

QRCode.toString(APP_URL, { type: "svg" }, function (err, url) {
    if (err) throw err

    qrCode = url
})

const SharePage = () => {
    const { copy } = useClipboard()

    return (
        <Container>
            <Stack
                align="center"
                justify="center"
                spacing="xl"
                sx={{ textAlign: "center" }}
            >
                <div style={{ width: "20rem", maxWidth: "100%" }} dangerouslySetInnerHTML={{ __html: qrCode }} />

                <Text>Your friends can open this website easily just by scanning this QRCode</Text>
                <Text
                    variant="link"
                    onClick={() => {
                        copy(APP_URL)
                        showNotification({
                            message: "Website URL has been copied to your clipboard"
                        })
                    }}
                    sx={{
                        cursor: "pointer"
                    }}
                >Copy website URL!</Text>

                <Space h="md" />

                <Text>Also share this website on your social media as much as you can</Text>

                <MediaWrapper />
            </Stack>
        </Container>
    )
}

export default SharePage