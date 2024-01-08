import Header from '../components/Header';
import Bottombar from '../components/home/Bottombar';
import LeftSidebar from '../components/home/LeftSidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Header />
      <main className='flex flex-row'>
        <LeftSidebar />
        <section className='main-container'>
          <div className='w-full'>
            <Outlet />
          </div>
        </section>
      </main>
      <Bottombar />
    </div>
  );
};

export default Layout;
