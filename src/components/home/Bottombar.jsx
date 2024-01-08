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
    imgURL: '/user.svg',
    label: 'Profile',
  },
];

import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Bottombar = () => {
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <section className='bottombar'>
      <div className='bottombar_container'>
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length) > 1 ||
            pathname === link.route;
          return (
            <Link
              to={
                link.label === 'Profile'
                  ? `/profile/${currentUser?._id}`
                  : link.route
              }
              key={link.label}
              className={`bottombar_link ${isActive && 'bg-primary-500'}`}
            >
              <img
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className='object-contain'
              />
              <p className='text-subtle-medium text-dark-1 max-sm:hidden'>
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
