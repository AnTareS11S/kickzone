import { useEffect, useState, useMemo, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaChartBar,
  FaDumbbell,
  FaHome,
  FaPlus,
  FaSearch,
  FaUsers,
} from 'react-icons/fa';
import { useSocket } from '../../hook/useSocket';
import { motion } from 'framer-motion';

const sidebarLinks = [
  { icon: <FaHome className='w-6 h-6' />, route: '/', label: 'Home' },
  { icon: <FaSearch className='w-6 h-6' />, route: '/search', label: 'Search' },
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
  {
    icon: <FaChartBar className='w-6 h-6' />,
    route: '/dashboard/player',
    label: 'Dashboard',
  },
];

// eslint-disable-next-line react/display-name
const SidebarLink = memo(({ link, isActive, isTrainingNotif }) => (
  <Link
    to={link.route}
    className={`group relative flex items-center
        px-1 py-2.5 rounded-xl
        transition-all duration-300 ${
          isActive
            ? 'bg-primary-500 text-white shadow-lg'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700'
        }`}
  >
    <div
      className={`
        mr-3
        ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}
      `}
    >
      {link.icon}
    </div>

    <span
      className={`
        text-sm font-medium
        hidden md:block
        transition-all duration-300
        ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}
      `}
    >
      {link.label}
    </span>

    {isTrainingNotif && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className='
            absolute top-2 right-1
            w-7 h-7
            bg-gray-600
            rounded-full
            flex items-center justify-center
            animate-pulse
          '
      >
        <span className='text-[10px] text-white font-bold'>New</span>
      </motion.div>
    )}
  </Link>
));

const Sidebar = () => {
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [player, setPlayer] = useState({});
  const currentYear = new Date().getFullYear();
  const [trainingNotifications, setTrainingNotifications] = useState({
    unreadCount: 0,
  });
  const { subscribe, emit, isConnected, unsubscribe } = useSocket();

  useEffect(() => {
    if (!currentUser?._id || !isConnected || currentUser?.role !== 'player')
      return;

    subscribe('teamTrainingNotificationStatus', (data) => {
      setTrainingNotifications({
        unreadCount: data.unreadCount,
      });
    });

    subscribe('unreadTeamTrainingNotification', (data) => {
      setTrainingNotifications({
        unreadCount: data.unreadCount,
      });
    });

    subscribe('teamTrainingNotificationStatusAfterDeletion', (data) => {
      setTrainingNotifications({
        unreadCount: data.unreadCount,
      });
    });

    return () => {
      unsubscribe('teamTrainingNotificationStatus');
      unsubscribe('unreadTeamTrainingNotification');
      unsubscribe('teamTrainingNotificationStatusAfterDeletion');
    };
  }, [subscribe, emit, player, currentUser, isConnected, unsubscribe]);

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

  useEffect(() => {
    const getTrainingNotifications = async () => {
      if (
        !currentUser?._id ||
        currentUser?.role !== 'player' ||
        !player?.currentTeam?._id
      )
        return;
      try {
        const res = await fetch(
          `/api/player/trainingNotifications/${player?.currentTeam?._id}/${player?._id}`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch data!');
        }
        const data = await res.json();
        setTrainingNotifications({
          unreadCount: data.unreadCount,
        });
      } catch (error) {
        console.error('Error fetching training notifications:', error);
      }
    };

    getTrainingNotifications();
  }, [player, currentUser]);

  const isAdminOrCoachOrReferee = ['admin', 'coach', 'referee'].includes(
    currentUser?.role
  );
  const isCoachWithTeam =
    currentUser?.role === 'coach' || player?.currentTeam !== undefined;

  const canShowCreatePostLink =
    isAdminOrCoachOrReferee ||
    (currentUser?.role === 'coach' && isCoachWithTeam);
  const canShowTrainingLink = currentUser?.role === 'coach' || isCoachWithTeam;

  const visibleLinks = useMemo(() => {
    return sidebarLinks.filter((link) => {
      if (link.route === '/search') return true;
      if (link.route === '/post/create') return canShowCreatePostLink;
      if (link.route === '/training') return canShowTrainingLink;
      if (link.route === '/leagues') return true;
      if (link.route.startsWith('/dashboard/'))
        return link.route === `/dashboard/${currentUser?.role}`;
      return ['/'].includes(link.route);
    });
  }, [currentUser?.role, canShowCreatePostLink, canShowTrainingLink]);

  const renderLinks = () =>
    visibleLinks.map((link) => (
      <SidebarLink
        key={link.label}
        link={link}
        isActive={pathname === link.route}
        isTrainingNotif={
          link.route === '/training' && trainingNotifications.unreadCount > 0
        }
      />
    ));

  return (
    <>
      <aside className='hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 transition-all duration-300'>
        <div className='flex-1 overflow-y-auto py-4 px-3'>
          <nav className='space-y-2'>{renderLinks()}</nav>
        </div>
        <footer className='border-t file:border-gray-200 dark:border-gray-700'>
          <div className='flex flex-col justify-center items-center'>
            <div className='flex gap-8 p-4'>
              <Link
                to='/terms'
                className='text-sm hover:text-primary transition-colors'
              >
                Terms
              </Link>
              <Link
                to='/privacy'
                className='text-sm hover:text-primary transition-colors'
              >
                Privacy
              </Link>
              <Link
                to='/contact'
                className='text-sm hover:text-primary transition-colors'
              >
                Contact
              </Link>
            </div>
            <div className='text-center'>&copy; {currentYear} KickZone</div>
          </div>
        </footer>
      </aside>
      <nav className='bottombar md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700'>
        <div className='bottombar_container m-0'>{renderLinks()}</div>
      </nav>
    </>
  );
};

export default Sidebar;
