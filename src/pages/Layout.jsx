import Header from '../components/Header';
import LeftSidebar from '../components/home/LeftSidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Header />
      <main className='flex flex-row'>
        <LeftSidebar />
        <section className='main-container'>
          <div className='w-full max-w-4xl'>
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
