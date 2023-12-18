/* eslint-disable react/prop-types */
import { Separator } from '../components/ui/separator';
import SidebarNav from '../components/account/SidebarNav';
import { Outlet } from 'react-router-dom';

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/user/profile',
  },
  {
    title: 'Referee Profile',
    href: '/user/referee/profile',
    role: 'referee',
  },
  {
    title: 'Coach Profile',
    href: '/user/coach/profile',
    role: 'coach',
  },
  {
    title: 'Settings',
    href: '/user/settings',
  },
  {
    title: 'Manage Users',
    href: '/user/admin/users',
    role: 'admin',
  },
  {
    title: 'Manage Teams',
    href: '/user/admin/teams',
    role: 'admin',
  },
  {
    title: 'Manage Leagues',
    href: '/user/admin/leagues',
    role: 'admin',
  },
];

export default function SettingsLayout() {
  return (
    <div className='space-y-6 p-4 pb-16'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
        <p className='text-muted-foreground'>Manage your account settings.</p>
      </div>
      <Separator className='my-6' />
      <div className='flex flex-col lg:flex-row '>
        <aside className='pr-12'>
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className='flex-1 max-sm:py-10 max-md:py-10 max-lg:py-10 '>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
