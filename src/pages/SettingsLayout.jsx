import { Separator } from '../components/ui/separator';
import SidebarNav from '../components/account/SidebarNav';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function SettingsLayout() {
  return (
    <>
      <Header />
      <div className='space-y-6 p-4 pb-16 pt-24'>
        <div className='space-y-0.5'>
          <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
          <p className='text-muted-foreground'>Manage your account settings.</p>
        </div>
        <Separator className='my-6' />
        <div className='flex flex-col lg:flex-row '>
          <aside className='pr-12'>
            <SidebarNav />
          </aside>

          <div className='flex-1 max-sm:py-10 max-md:py-10 max-lg:py-10 '>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
