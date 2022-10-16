import {
  createStyles,
  Header,
  Container,
  Group,
  Anchor,
  Switch,
  useMantineColorScheme,
  Text,
} from '@mantine/core';
import { IconBrandGithub, IconSun, IconMoonStars } from '@tabler/icons';
import { APP_VERSION, GITHUB_REPOSITORY } from '../../../lib/env';


const HEADER_HEIGHT = 60;

const useStyles = createStyles(() => ({
  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    fontSize: "12rem"
  }
}));

const PrimaryHeader: React.FC = () => {
  const { toggleColorScheme } = useMantineColorScheme();
  const { classes, theme } = useStyles();

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb="3rem">
      <Container className={classes.inner} fluid>
        <Group align="baseline">
          <Anchor color="blue.2" href="https://twitter.com/search?q=%23%D9%85%D9%87%D8%B3%D8%A7_%D8%A7%D9%85%DB%8C%D9%86%DB%8C" sx={{ height: 30 }} component="a" variant='text'>#MahsaAmini</Anchor>
          <Text sx={{ fontFamily: "sans-serif" }} color="blue.2">v{APP_VERSION}</Text>
        </Group>
        <Group position="right" align="center">
          <Switch
            size="md"
            color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}
            onLabel={<IconSun size={16} stroke={2.5} color={theme.colors.yellow[4]} />}
            offLabel={<IconMoonStars size={16} stroke={2.5} color={theme.colors.blue[6]} />}
            onChange={() => toggleColorScheme()}
          />
          <Anchor href={GITHUB_REPOSITORY} component="a" variant='text'><IconBrandGithub size={30} /></Anchor>
        </Group>
      </Container>
    </Header>
  );
}

export default PrimaryHeader