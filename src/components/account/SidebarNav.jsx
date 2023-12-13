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
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 ',
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
