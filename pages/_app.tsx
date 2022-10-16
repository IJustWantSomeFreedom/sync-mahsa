import PrimaryHeader from "./../components/layouts/PrimaryHeader"
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app'
import { useLocalStorage, useColorScheme } from "@mantine/hooks";
import "../public/fonts/fontiran.css"
import { NavigationProgress } from "@mantine/nprogress";
import Head from "next/head";
import { useEffect } from "react"
import { NotificationsProvider } from "@mantine/notifications";
import { showNotification, NotificationProps } from "@mantine/notifications";

const showDefaultNotification = (props: NotificationProps) => showNotification({
  autoClose: false,
  styles: (theme) => ({
    root: {
      backgroundColor: theme.colors.blue[6],
      borderColor: theme.colors.blue[6],

      '&::before': { backgroundColor: theme.white },
    },

    title: { color: theme.white },
    description: { color: theme.white },
    closeButton: {
      color: theme.white,
      '&:hover': { backgroundColor: theme.colors.blue[7] },
    },
  }),
  ...props
})

function MyApp({ Component, pageProps }: AppProps) {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    const installedListener = () => {
      showDefaultNotification({
        id: 'pwa-installation',
        title: 'Successfully registered.',
        message: 'You can now use this website offline',
      })
    }

    window.workbox.addEventListener('installed', installedListener)
    return () => {
      window.workbox.removeEventListener('installed', installedListener)
    }
  }, [])

  return (
    <>
      <Head>
        <meta name="application-name" content="Sync Mahsa Amini" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sync Mahsa Amini" />
        <meta name="description" content="An offline sync music player for freedom" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* <meta name="msapplication-config" content="/icons/browserconfig.xml" /> */}
        {/* <meta name="msapplication-TileColor" content="#2B5797" /> */}
        {/* <meta name="msapplication-tap-highlight" content="no" /> */}
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/favicon.png" />
        {/* <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" /> */}

        {/* <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" /> */}
        <link rel="manifest" href="/manifest.json" />
        {/* <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" /> */}
        <link rel="shortcut icon" href="/favicon.png" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="Sync Mahsa Amini" />
        <meta name="twitter:description" content="An offline sync music player for freedom" />
        <meta name="twitter:image" content="https://yourdomain.com/favicon.png" />
        <meta name="twitter:creator" content="@DavidWShadow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sync Mahsa Amini" />
        <meta property="og:description" content="An offline sync music player for freedom" />
        <meta property="og:site_name" content="Sync Mahsa Amini" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="https://yourdomain.com/icons/apple-touch-icon.png" />

        <link rel='apple-touch-startup-image' href='/favicon.png' sizes='2048x2732' />
        {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
          <link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
          <link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
          <link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
          <link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
          <link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' /> */}
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          theme={{
            colorScheme,
            fontFamily: "iransansdn, Verdana, sans-serif",
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <NotificationsProvider>

            <NavigationProgress />
            <PrimaryHeader />
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  )
}

export default MyApp