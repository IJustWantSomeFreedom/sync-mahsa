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
import { APP_URL } from "../lib/env";

const META = {
  appName: "Sync Song Mahsa Amini",
  description: "An offline sync pwa website playing songs about freedom",
  appUrl: APP_URL,
  faviconUrl: `${APP_URL}/favicon.png`,
  twitterUsername: "WeAreMahsaAmini"
}

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
        <title>{`${META.appName} | Sing song synchronously`}</title>
        <meta name="application-name" content={META.appName} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={META.appName} />
        <meta name="description" content={META.description} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        <meta name="msapplication-config" content="none" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />

        <meta name="theme-color" content="#ffffff" />

        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.png" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={META.appUrl} />
        <meta name="twitter:title" content={META.appName} />
        <meta name="twitter:description" content={META.description} />
        <meta name="twitter:image" content={META.faviconUrl} />
        <meta name="twitter:creator" content={`@${META.twitterUsername}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={META.appName} />
        <meta property="og:description" content={META.description} />
        <meta property="og:site_name" content={META.appName} />
        <meta property="og:url" content={META.appUrl} />
        <meta property="og:image" content={META.faviconUrl} />

        <link rel='apple-touch-startup-image' href='/favicon.png' />
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