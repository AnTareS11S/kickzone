import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
    route: '/profile/:id',
    label: 'Profile',
  },
];

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex w-full flex-1 flex-col gap-6 px-6'>
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.route;

          // Check if the link should be visible based on the user's role
          const shouldShowLink =
            link.label !== 'Create Post' ||
            (currentUser &&
              ['referee', 'admin', 'coach'].includes(currentUser.role));

          return shouldShowLink ? (
            <Link
              to={
                link.label === 'Profile'
                  ? `/profile/${currentUser?._id}`
                  : link.route
              }
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
          ) : null;
        })}
      </div>
    </section>
  );
};

export default LeftSidebar;
