import { Outlet } from 'react-router';
import { MainNavbar } from './MainNavbar';
import { LiveSupport } from './LiveSupport';

export function MainLayout() {
  return (
    <div className="min-h-screen">
      <MainNavbar />
      <Outlet />
      <LiveSupport />
    </div>
  );
}