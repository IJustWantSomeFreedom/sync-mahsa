import {
  Anchor,
  useMantineColorScheme,
  Text,
  createStyles,
  Header,
  Group,
  ActionIcon,
  Container,
} from '@mantine/core';
import { IconBrandGithub, IconSun, IconMoonStars, IconQrcode, IconHome } from '@tabler/icons';
import Link from 'next/link';
import { APP_VERSION, GITHUB_REPOSITORY } from '../../../lib/env';
import { useRouter } from 'next/router';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: HEADER_HEIGHT,

    [theme.fn.smallerThan('sm')]: {
      justifyContent: 'flex-start',
    },
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  links: {
    width: 260,

    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  social: {
    width: 260,

    [theme.fn.smallerThan('sm')]: {
      width: 'auto',
      marginLeft: 'auto',
    },
  },

  burger: {
    marginRight: theme.spacing.md,

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: "bold",

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

const PrimaryHeader = () => {
  const { toggleColorScheme } = useMantineColorScheme();
  const { classes, theme } = useStyles();

  const router = useRouter()

  return (
    <Header height={HEADER_HEIGHT} mb={50}>
      <Container className={classes.inner}>
        <Group align="center" spacing="xs">
          <Anchor
            color="blue"
            href="https://twitter.com/search?q=(%23MahsaAmini)&src=typed_query"
            component="a"
            variant='text'
            weight="bold"
          >#MahsaAmini</Anchor>
          <Text color="blue" size="xs">v{APP_VERSION}</Text>
        </Group>

        <Group spacing="xs" className={classes.social} position="right" noWrap>
          <ActionIcon onClick={() => toggleColorScheme()} size="lg">
            {theme.colorScheme === 'dark' ? <IconSun size={20} stroke={1.5} color={theme.colors.yellow[4]} /> : <IconMoonStars size={20} stroke={1.5} color={theme.colors.blue[6]} />}
          </ActionIcon>

          <Anchor href={GITHUB_REPOSITORY} component="a" variant='text'>
            <ActionIcon size="lg">
              <IconBrandGithub size={20} stroke={1.5} />
            </ActionIcon>
          </Anchor>

          <Link href={router.pathname === "/" ? "/share" : "/"}>
            <Text variant='text'>
              <ActionIcon size="lg">
                {router.pathname === "/" ? <IconQrcode size={20} stroke={1.5} /> : <IconHome size={20} stroke={1.5} />}
              </ActionIcon>
            </Text>
          </Link>
        </Group>
      </Container>
    </Header>
  );
}

export default PrimaryHeader
