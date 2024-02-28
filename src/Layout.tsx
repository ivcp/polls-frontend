import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <main>
        <nav>navbar</nav>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
