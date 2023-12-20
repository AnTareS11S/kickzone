import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

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
    route: '/communities',
    label: 'Communities',
  },
  {
    imgURL: '/user.svg',
    route: '/profile',
    label: 'Profile',
  },
];

const LeftSidebar = () => {
  const { pathname } = useLocation();

  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex w-full flex-1 flex-col gap-6 px-6'>
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.route;

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
              <p className='text-dark-2 max-lg:hidden'>{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default LeftSidebar;
