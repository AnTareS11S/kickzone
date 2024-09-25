import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/home/Sidebar';

const Layout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='flex flex-1 pb-8'>
        <Sidebar />
        <main className='flex-1 p-4'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
