import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/home/Sidebar';

const Layout = () => {
  return (
    <div>
      <Header />
      <main className='flex flex-row'>
        <Sidebar />
        <section className='main-container'>
          <div className='w-full'>
            <Outlet />
          </div>
        </section>
      </main>
      <Sidebar />
    </div>
  );
};

export default Layout;
