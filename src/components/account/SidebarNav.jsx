/* eslint-disable react/prop-types */

import { cn } from '../../lib/utils';
import { buttonVariants } from '../ui/button';

import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SidebarNav = ({ className, items, ...props }) => {
  const { currentUser } = useSelector((state) => state.user);
  const pathname = useLocation();

  return (
    <nav
      className={cn(
        'flex flex-col lg:space-x-0 lg:space-y-1 max-sm:grid max-sm:grid-cols-3 max-sm:gap-2 max-md:grid max-md:grid-cols-3 max-md:gap-2 max-lg:grid max-lg:grid-cols-4 max-lg:gap-2 ',
        className
      )}
      {...props}
    >
      {items.map((item) => {
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
                ? 'bg-muted hover:bg-muted'
                : 'hover:bg-transparent hover:underline ',
              'justify-start shadow-sm'
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
