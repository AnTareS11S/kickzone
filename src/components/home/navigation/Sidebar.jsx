import { useEffect, useState, useMemo, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaChartBar,
  FaDumbbell,
  FaHome,
  FaPlus,
  FaSearch,
  FaTrophy,
  FaUsers,
} from 'react-icons/fa';
import { useSocket } from '../../../hook/useSocket';
import { motion } from 'framer-motion';
import MobileNavigation from './MobileNavigation';

const sidebarLinks = [
  { icon: <FaHome className='w-6 h-6' />, route: '/', label: 'Home' },
  { icon: <FaSearch className='w-6 h-6' />, route: '/search', label: 'Search' },
  {
    icon: <FaPlus className='w-6 h-6' />,
    route: '/post/create',
    label: 'Create Post',
  },
  {
    icon: <FaTrophy className='w-6 h-6' />,
    route: '/leagues',
    label: 'Leagues',
  },
  {
    icon: <FaUsers className='w-6 h-6' />,
    route: '/forum',
    label: 'Team Forum',
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
const SidebarLink = memo(
  ({ link, isActive, isTrainingNotif, isForumNotif, isAdminNotif }) => (
    <Link
      to={link.route}
      className={`group relative flex items-center
      px-4 py-3 rounded-lg
      transition-all duration-200 ease-in-out
      hover:scale-105
      ${
        isActive
          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
          : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <div
        className={`
        mr-3 transition-transform group-hover:scale-110
        ${
          isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'
        }
      `}
      >
        {link.icon}
      </div>

      <span
        className={`
        text-sm font-medium
        hidden md:block
        transition-colors duration-200
        ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}
      `}
      >
        {link.label}
      </span>

      {(isTrainingNotif || isForumNotif || isAdminNotif) && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`
          absolute top-4 right-4
          w-5 h-5
          ${isActive ? 'bg-white' : 'bg-blue-600'}
          rounded-full
          flex items-center justify-center
          animate-pulse
        `}
        >
          <span
            className={`text-[10px] ${
              isActive ? 'text-black' : 'text-white'
            } font-bold`}
          >
            ●
          </span>
        </motion.div>
      )}
    </Link>
  )
);

const Sidebar = () => {
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [player, setPlayer] = useState({});
  const currentYear = new Date().getFullYear();
  const [trainingNotifications, setTrainingNotifications] = useState(0);
  const [unreadForumNotifications, setUnreadForumNotifications] = useState(0);
  const [adminNotfication, setAdminNotification] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { subscribe, isConnected, unsubscribe } = useSocket();

  useEffect(() => {
    if (!currentUser?._id || !isConnected || currentUser?.role !== 'Player')
      return;

    subscribe('teamTrainingNotificationStatus', (data) => {
      setTrainingNotifications(data.unreadCount);
    });

    subscribe('unreadTeamTrainingNotification', (data) => {
      setTrainingNotifications(data.unreadCount);
    });

    subscribe('teamTrainingNotificationStatusAfterDeletion', (data) => {
      setTrainingNotifications(data.unreadCount);
    });

    return () => {
      unsubscribe('teamTrainingNotificationStatus');
      unsubscribe('unreadTeamTrainingNotification');
      unsubscribe('teamTrainingNotificationStatusAfterDeletion');
    };
  }, [subscribe, currentUser, isConnected, unsubscribe]);

  useEffect(() => {
    if (!currentUser?._id || !isConnected) return;

    subscribe('teamForumNotificationsStatus', (data) => {
      setUnreadForumNotifications(data.unreadCount);
    });

    subscribe('teamForumNotificationStatusAfterUpdate', (data) => {
      console.log(data, 'data');
      setUnreadForumNotifications(data.unreadCount);
    });

    subscribe('teamForumNotificationStatusAfterDeletion', (data) => {
      setUnreadForumNotifications(data.unreadCount);
    });

    return () => {
      unsubscribe('teamForumNotificationsStatus');
      unsubscribe('teamForumNotificationStatusAfterUpdate');
      unsubscribe('teamForumNotificationStatusAfterDeletion');
    };
  }, [subscribe, currentUser, isConnected, unsubscribe]);

  useEffect(() => {
    const getPlayer = async () => {
      if (!currentUser?._id || currentUser?.role !== 'Player') return;

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
        currentUser?.role !== 'Player' ||
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
        setTrainingNotifications(data.unreadCount);
      } catch (error) {
        console.error('Error fetching training notifications:', error);
      }
    };

    getTrainingNotifications();
  }, [player, currentUser]);

  useEffect(() => {
    const getTeamForumNotifications = async () => {
      try {
        const res = await fetch(
          `/api/forum/notifications/${currentUser?._id}/${currentUser?.role}`
        );
        const data = await res.json();
        setUnreadForumNotifications(data.unreadCount);
      } catch (error) {
        console.log(error);
      }
    };

    getTeamForumNotifications();
  }, [currentUser?._id, currentUser?.role]);

  useEffect(() => {
    if (!currentUser?._id || currentUser?.role !== 'Admin') return;
    const getAdminNotifications = async () => {
      try {
        const res = await fetch('/api/admin/notifications-count');
        const data = await res.json();
        setAdminNotification(data.notificationsCount + data.reportsCount);
      } catch (error) {
        console.log(error);
      }
    };

    getAdminNotifications();
  }, [currentUser?._id, currentUser?.role]);

  const isAdminOrCoachOrReferee = ['Admin', 'Coach', 'Referee'].includes(
    currentUser?.role
  );
  const isCoachWithTeam =
    currentUser?.role === 'Coach' || player?.currentTeam !== undefined;
  const isPlayerOrCoach = ['Player', 'Coach'].includes(currentUser?.role);

  const canShowCreatePostLink =
    isAdminOrCoachOrReferee ||
    (currentUser?.role === 'Coach' && isCoachWithTeam);
  const canShowTrainingLink = currentUser?.role === 'Coach' || isCoachWithTeam;

  const visibleLinks = useMemo(() => {
    return sidebarLinks.filter((link) => {
      if (link.route === '/search') return true;
      if (link.route === '/post/create') return canShowCreatePostLink;
      if (link.route === '/training') return canShowTrainingLink;
      if (link.route === '/leagues') return true;
      if (link.route === '/forum') return isPlayerOrCoach;
      if (link.route.startsWith('/dashboard/'))
        return (
          link.route ===
          `/dashboard/${
            currentUser?.role?.charAt(0).toLowerCase() +
            currentUser?.role?.slice(1)
          }`
        );
      return ['/'].includes(link.route);
    });
  }, [
    currentUser?.role,
    canShowCreatePostLink,
    canShowTrainingLink,
    isPlayerOrCoach,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderLinks = () =>
    visibleLinks.map((link) => (
      <SidebarLink
        key={link.label}
        link={link}
        isActive={pathname === link.route}
        isTrainingNotif={
          link.route === '/training' && trainingNotifications > 0
        }
        isForumNotif={link.route === '/forum' && unreadForumNotifications > 0}
        isAdminNotif={link.route === '/dashboard/admin' && adminNotfication > 0}
      />
    ));

  return (
    <>
      <aside
        className={`hidden lg:flex lg:flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-72 h-[calc(102vh-5rem)] fixed left-0 ${
          isScrolled ? 'top-[30px] h-[calc(103vh-3rem)]' : 'top-[64px]'
        } transition-all duration-0 shadow-lg`}
      >
        {/* Content section - links */}
        <div className='flex-1 overflow-y-auto px-4'>
          <nav className='space-y-3'>{renderLinks()}</nav>
        </div>
        <div className='border-t border-gray-200 dark:border-gray-700 py-4'>
          <div className='flex flex-col justify-center items-center'>
            <div className='flex gap-8 p-4'>
              <Link
                to='/terms'
                className='text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200'
              >
                Terms
              </Link>
              <Link
                to='/privacy'
                className='text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200'
              >
                Privacy
              </Link>
              <Link
                to='/contact'
                className='text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200'
              >
                Contact
              </Link>
            </div>
            <div className='text-sm text-gray-500'>
              &copy; {currentYear} KickZone
            </div>
          </div>
        </div>
      </aside>
      {/* Mobile navigation */}
      <MobileNavigation visibleLinks={visibleLinks} renderLinks={renderLinks} />

      {/* Spacer div to prevent content from being hidden behind the sidebar */}
      <div className='hidden lg:block w-72' />
    </>
  );
};

export default Sidebar;
