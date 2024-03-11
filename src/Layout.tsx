import { Link, Outlet } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Group, Title, UnstyledButton } from '@mantine/core';

import classes from './Layout.module.css';

function Layout() {
  const [opened, { toggle, close }] = useDisclosure();

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
              <Link to={'/new'} className={classes.linkTitle}>
                <UnstyledButton className={classes.control}>New</UnstyledButton>
              </Link>
              <Link to={'/'} className={classes.linkTitle}>
                <UnstyledButton className={classes.control}>
                  Home
                </UnstyledButton>
              </Link>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar py="md" px={4}>
        <Link to={'/new'} className={classes.linkTitle}>
          <UnstyledButton onClick={close} className={classes.control}>
            New
          </UnstyledButton>
        </Link>
        <Link to={'/'} className={classes.linkTitle}>
          <UnstyledButton onClick={close} className={classes.control}>
            Home
          </UnstyledButton>
        </Link>
      </AppShell.Navbar>
      <AppShell.Main className={classes.main}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
