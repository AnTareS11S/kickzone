const sidebarLinks = [
  {
    imgURL: '/home.svg',
    route: '/',
    label: 'Home',
  },
  {
    imgURL: '/search.svg',
    route: '/search',
    label: 'Search',
  },
  {
    imgURL: '/heart.svg',
    route: '/activity',
    label: 'Activity',
  },
  {
    imgURL: '/create.svg',
    route: '/post/create',
    label: 'Create Post',
  },
  {
    imgURL: '/community.svg',
    route: '/leagues',
    label: 'Leagues',
  },
  {
    imgURL: '/training.png',
    label: 'Training',
    route: '/training',
  },
  {
    imgURL: '/dashboard.png',
    route: '/dashboard/referee',
    label: 'Referee Dashboard',
  },
  {
    imgURL: '/dashboard.png',
    route: '/dashboard/admin',
    label: 'Admin Dashboard',
  },
  {
    imgURL: '/dashboard.png',
    route: '/dashboard/coach',
    label: 'Coach Dashboard',
  },
];

import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const Bottombar = () => {
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [player, setPlayer] = useState({});

  useEffect(() => {
    const getPlayer = async () => {
      try {
        if (!currentUser?._id || currentUser?.role !== 'player') {
          return;
        }

        const res = await fetch(`/api/player/get/${currentUser?._id}`);
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch data!');
        }
        const data = await res.json();
        setPlayer(data);
      } catch (error) {
        console.log(error);
      }
    };

    getPlayer();
  }, [currentUser?._id, currentUser?.role]);

  const isAdminOrCoachOrReferee =
    currentUser && ['admin', 'coach', 'referee'].includes(currentUser?.role);

  const isCoachWithTeam =
    (currentUser && currentUser?.role === 'coach') ||
    player?.currentTeam !== undefined;

  return (
    <section className='bottombar'>
      <div className='bottombar_container'>
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.route;

          if (
            (link.route === '/post/create' &&
              currentUser &&
              isAdminOrCoachOrReferee) ||
            (link.route === '/training' && currentUser && isCoachWithTeam) ||
            currentUser?.role === 'coach' ||
            (link.route === '/activity' &&
              currentUser &&
              ['admin', 'coach', 'player', 'referee'].includes(
                currentUser?.role
              )) ||
            ['/', '/search', '/leagues'].includes(link.route)
          ) {
            return (
              <Link
                to={link.route}
                key={link.label}
                className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
              >
                <img
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                  className='text-dark-2'
                />
                <p className='text-dark-2 max-sm:hidden'>{link.label}</p>
              </Link>
            );
          }

          return null;
        })}
      </div>
    </section>
  );
};

export default Bottombar;
