/* eslint-disable react/prop-types */

import { cn } from '../../lib/utils';
import { buttonVariants } from '../ui/button';

import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/user/profile',
  },
  {
    title: 'Referee Profile',
    href: '/user/referee/profile',
    role: 'referee',
  },
  {
    title: 'Coach Profile',
    href: '/user/coach/profile',
    role: 'coach',
  },
  {
    title: 'Settings',
    href: '/user/settings',
  },
  {
    title: 'Manage Users',
    href: '/user/admin/users',
    role: 'admin',
  },
  {
    title: 'Manage Teams',
    href: '/user/admin/teams',
    role: 'admin',
  },
  {
    title: 'Manage Leagues',
    href: '/user/admin/leagues',
    role: 'admin',
  },
];

const SidebarNav = ({ className, ...props }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { pathname } = useLocation();

  return (
    <nav
      className={cn(
        'flex flex-col lg:space-x-0 lg:space-y-1 max-sm:grid max-sm:grid-cols-2 max-sm:gap-3 max-md:grid max-md:grid-cols-3 max-md:gap-2 max-lg:grid max-lg:grid-cols-4 max-lg:gap-2 ',
        className
      )}
      {...props}
    >
      {sidebarNavItems.map((item) => {
        // Sprawdź, czy użytkownik ma wymaganą rolę
        const hasRequiredRole = currentUser?.role === item.role;

        // Jeżeli użytkownik ma wymaganą rolę lub rola nie jest wymagana, renderuj link
        return hasRequiredRole || !item.role ? (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              pathname === item.href
                ? 'bg-primary-500 text-white hover:bg-primary-500 hover:text-white w-full'
                : 'hover:bg-transparent hover:underline ',
              'justify-start '
            )}
          >
            {item.title}
          </Link>
        ) : null; // W przeciwnym razie nie renderuj linku
      })}
    </nav>
  );
};

export default SidebarNav;
