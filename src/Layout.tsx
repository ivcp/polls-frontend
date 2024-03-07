import { Link, Outlet } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Group, Title, UnstyledButton } from '@mantine/core';

import classes from './Layout.module.css';

function Layout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Link to={'/'} className={classes.linkTitle}>
              <Title size={'sm'}>POLLS</Title>
            </Link>
            <Group ml="xl" gap={0} visibleFrom="sm">
              <UnstyledButton className={classes.control}>New</UnstyledButton>
              <UnstyledButton className={classes.control}>
                Browse
              </UnstyledButton>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton className={classes.control}>New</UnstyledButton>
        <UnstyledButton className={classes.control}>Browse</UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
