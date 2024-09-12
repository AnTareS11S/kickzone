import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaChartBar,
  FaDumbbell,
  FaHeart,
  FaHome,
  FaPlus,
  FaSearch,
  FaUsers,
} from 'react-icons/fa';

const sidebarLinks = [
  { icon: <FaHome className='w-6 h-6' />, route: '/', label: 'Home' },
  { icon: <FaSearch className='w-6 h-6' />, route: '/search', label: 'Search' },
  {
    icon: <FaHeart className='w-6 h-6' />,
    route: '/activity',
    label: 'Activity',
  },
  {
    icon: <FaPlus className='w-6 h-6' />,
    route: '/post/create',
    label: 'Create Post',
  },
  {
    icon: <FaUsers className='w-6 h-6' />,
    route: '/leagues',
    label: 'Leagues',
  },
  {
    icon: <FaDumbbell className='w-6 h-6' />,
    route: '/training',
    label: 'Training',
  },
  {
    icon: <FaChartBar className='w-6 h-6' />,
    route: '/dashboard/referee',
    label: 'Dashboard',
  },
  {
    icon: <FaChartBar className='w-6 h-6' />,
    route: '/dashboard/admin',
    label: 'Dashboard',
  },
  {
    icon: <FaChartBar className='w-6 h-6' />,
    route: '/dashboard/coach',
    label: 'Dashboard',
  },
];

const SidebarLink = React.memo(({ link, isActive }) => (
  <Link
    to={link.route}
    className={`flex items-center p-2 rounded-lg transition-all duration-300 ${
      isActive
        ? 'bg-primary-500 text-white'
        : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    <span className='mr-3'>{link.icon}</span>
    <span className='hidden md:block'>{link.label}</span>
  </Link>
));

const Sidebar = () => {
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [player, setPlayer] = useState({});

  useEffect(() => {
    const getPlayer = async () => {
      if (!currentUser?._id || currentUser?.role !== 'player') return;

      try {
        const res = await fetch(`/api/player/get/${currentUser._id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch data!');
        }
        const data = await res.json();
        setPlayer(data);
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };

    getPlayer();
  }, [currentUser?._id, currentUser?.role]);

  const isAdminOrCoachOrReferee = ['admin', 'coach', 'referee'].includes(
    currentUser?.role
  );
  const isCoachWithTeam =
    currentUser?.role === 'coach' || player?.currentTeam !== undefined;

  const canShowCreatePostLink =
    isAdminOrCoachOrReferee ||
    (currentUser?.role === 'coach' && isCoachWithTeam);
  const canShowTrainingLink = currentUser?.role === 'coach' || isCoachWithTeam;
  const canShowActivityLink = ['admin', 'coach', 'player', 'referee'].includes(
    currentUser?.role
  );

  const visibleLinks = useMemo(() => {
    return sidebarLinks.filter((link) => {
      if (link.route === '/search') return true;
      if (link.route === '/post/create') return canShowCreatePostLink;
      if (link.route === '/training') return canShowTrainingLink;
      if (link.route === '/activity') return canShowActivityLink;
      if (link.route === '/leagues') return true;
      if (link.route.startsWith('/dashboard/'))
        return link.route === `/dashboard/${currentUser?.role}`;
      return ['/'].includes(link.route);
    });
  }, [
    currentUser?.role,
    canShowCreatePostLink,
    canShowTrainingLink,
    canShowActivityLink,
  ]);

  const renderLinks = () =>
    visibleLinks.map((link) => (
      <SidebarLink
        key={link.label}
        link={link}
        isActive={pathname === link.route}
      />
    ));

  return (
    <>
      <aside className='hidden md:flex flex-col  bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 transition-all duration-300'>
        <div className='flex-1 overflow-y-auto py-4 px-3'>
          <nav className='space-y-2'>{renderLinks()}</nav>
        </div>
        <footer className='border-t file:border-gray-200 dark:border-gray-700 p-4'>
          <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
            &copy; 2024 KickZone
          </p>
        </footer>
      </aside>
      <nav className='bottombar md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700'>
        <div className='bottombar_container gap-1 p-1 m-1'>{renderLinks()}</div>
      </nav>
    </>
  );
};

export default Sidebar;
