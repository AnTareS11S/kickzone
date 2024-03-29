import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

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
    route: '/training',
    label: 'Training ',
  },
  {
    imgURL: '/dashboard.png',
    route: '/dashboard/referee',
    label: 'Dashboard ',
  },
  {
    imgURL: '/dashboard.png',
    route: '/dashboard/admin',
    label: 'Dashboard ',
  },
  {
    imgURL: '/dashboard.png',
    route: '/dashboard/coach',
    label: 'Dashboard ',
  },
];

const SidebarLink = ({ link, isActive, onClick }) => (
  <Link
    to={link.route}
    key={link.label}
    onClick={onClick}
    className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
  >
    <img
      src={link.imgURL}
      alt={link.label}
      width={24}
      height={24}
      className='text-dark-2'
    />
    <p className='text-dark-2 max-lg:hidden'>{link.label}</p>
  </Link>
);

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [player, setPlayer] = useState({});

  useEffect(() => {
    const getPlayer = async () => {
      try {
        if (!currentUser?._id) {
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
  }, [currentUser?._id]);

  const isAdminOrCoachOrReferee =
    currentUser && ['admin', 'coach', 'referee'].includes(currentUser?.role);

  const isCoachWithTeam =
    (currentUser && currentUser?.role === 'coach') ||
    player?.currentTeam !== undefined;

  const canShowCreatePostLink = () =>
    (currentUser && isAdminOrCoachOrReferee) ||
    (currentUser && currentUser.role === 'coach' && isCoachWithTeam);

  const canShowTrainingLink = () =>
    currentUser && (currentUser.role === 'coach' || isCoachWithTeam);

  const canShowActivityLink = () =>
    currentUser &&
    ['admin', 'coach', 'player', 'referee'].includes(currentUser.role);

  const shouldRenderLink = (link) => {
    const userRole = currentUser?.role;

    if (link.route === '/post/create' && canShowCreatePostLink()) {
      return true;
    }

    if (link.route === '/training' && canShowTrainingLink()) {
      return true;
    }

    if (link.route === '/activity' && canShowActivityLink()) {
      return true;
    }

    if (link.route === '/leagues') {
      return true;
    }

    if (link.route === '/dashboard/referee' && userRole === 'referee') {
      return true;
    }

    if (link.route === '/dashboard/admin' && userRole === 'admin') {
      return true;
    }

    if (link.route === '/dashboard/coach' && userRole === 'coach') {
      return true;
    }

    return ['/', '/search'].includes(link.route);
  };

  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex w-full flex-1 flex-col gap-6 px-6'>
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.route;

          if (shouldRenderLink(link)) {
            return (
              <SidebarLink
                key={link.label}
                link={link}
                isActive={isActive}
                onClick={() => {}}
              />
            );
          }

          return null;
        })}
      </div>
    </section>
  );
};

export default LeftSidebar;
