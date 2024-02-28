import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      Layout
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
