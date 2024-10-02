import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from '../redux/user/userSlice';
import { useFetchUserById } from './hooks/useFetchUserById';
import { useToast } from './ui/use-toast';
import {
  FaBell,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import {
  MdPrivacyTip,
  MdOutlineMenuBook,
  MdOutlineConnectWithoutContact,
} from 'react-icons/md';

const Header = () => {
  const { user, currentUser } = useFetchUserById();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Logged out successfully',
        });
        dispatch(signOutUserSuccess());
        navigate('/');
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to log out',
          variant: 'destructive',
        });
        dispatch(signOutUserFailure(data.message));
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const NavItems = ({ mobile = false }) => (
    <>
      <Link
        to='/explore'
        className={`text-gray-600 hover:text-primary-500 transition-colors ${
          mobile ? 'block py-2 px-4 text-base' : ''
        }`}
        onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
      >
        Explore
      </Link>
      <Link
        to='/about'
        className={`text-gray-600 hover:text-primary-500 transition-colors ${
          mobile ? 'block py-2 px-4 text-base' : ''
        }`}
        onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
      >
        About
      </Link>
      {currentUser && !mobile && (
        <>
          <Link
            to='/notifications'
            className='text-gray-600 hover:text-primary-500 transition-colors'
          >
            <FaBell className='w-5 h-5' />
          </Link>
          <Link
            to='/messages'
            className='text-gray-600 hover:text-primary-500 transition-colors'
          >
            <FaEnvelope className='w-5 h-5' />
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className='bg-white shadow-sm'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link
              to='/'
              className='flex-shrink-0 flex items-center'
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src='/logo_black.png' alt='logo' className='h-8 w-auto' />
              <span className='ml-2 text-xl font-bold text-gray-900'>
                KickZone
              </span>
            </Link>
          </div>

          <div className='hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8'>
            <NavItems />
          </div>

          <div className='flex items-center'>
            {currentUser ? (
              <div className='hidden sm:block'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='relative h-8 w-8 rounded-full'
                    >
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={
                            user?.imageUrl ||
                            'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                          }
                          alt='Profile photo'
                        />
                        <AvatarFallback>
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-56' align='end' forceMount>
                    <DropdownMenuLabel className='font-normal'>
                      <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                          {user.username}{' '}
                          <span className='text-xs text-gray-500'>
                            [{user.role}]
                          </span>
                        </p>
                        <p className='text-xs leading-none text-gray-500'>
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to='/user/profile'>Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to='/user/settings'>Settings</Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link
                to='/sign-in'
                className='hidden sm:inline-block text-gray-600 hover:text-primary-500 transition-colors font-medium'
              >
                Log In
              </Link>
            )}
          </div>

          <div className='flex items-center sm:hidden'>
            <Button
              variant='ghost'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className='sr-only'>Open main menu</span>
              {mobileMenuOpen ? (
                <FaTimes className='block h-6 w-6' aria-hidden='true' />
              ) : (
                <FaBars className='block h-6 w-6' aria-hidden='true' />
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className='sm:hidden bg-white border-t border-gray-200'>
          <div className='pt-2 pb-3 space-y-1'>
            <NavItems mobile={true} />
            {currentUser ? (
              <>
                <Link
                  to='/notifications'
                  className='flex items-center text-gray-600 hover:text-primary-500 transition-colors py-2 px-4 text-base'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaBell className='w-5 h-5 mr-3' />
                  Notifications
                </Link>
                <Link
                  to='/messages'
                  className='flex items-center text-gray-600 hover:text-primary-500 transition-colors py-2 px-4 text-base'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaEnvelope className='w-5 h-5 mr-3' />
                  Messages
                </Link>
                <Link
                  to='/user/profile'
                  className='flex items-center text-gray-600 hover:text-primary-500 transition-colors py-2 px-4 text-base'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaUser className='w-5 h-5 mr-3' />
                  Profile
                </Link>
                <Link
                  to='/user/settings'
                  className='flex items-center text-gray-600 hover:text-primary-500 transition-colors py-2 px-4 text-base'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaCog className='w-5 h-5 mr-3' />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className='flex items-center w-full text-left text-gray-600 hover:text-primary-500 transition-colors py-2 px-4 text-base'
                >
                  <FaSignOutAlt className='w-5 h-5 mr-3' />
                  Log out
                </button>
              </>
            ) : (
              <Link
                to='/sign-in'
                className='block text-gray-600 hover:text-primary-500 transition-colors py-2 px-4 text-base font-medium'
              >
                Log In
              </Link>
            )}
            <Link
              to='/terms'
              className='flex items-center text-gray-600 hover:text-primary-500 transition-colors py-2 px-4 text-base'
              onClick={() => setMobileMenuOpen(false)}
            >
              <MdOutlineMenuBook className='w-5 h-5 mr-3' />
              Terms
            </Link>
            <Link
              to='/privacy'
              className='flex items-center text-gray-600 hover:text-primary-500 transition-colors py-2 px-4 text-base'
              onClick={() => setMobileMenuOpen(false)}
            >
              <MdPrivacyTip className='w-5 h-5 mr-3' />
              Privacy
            </Link>
            <Link
              to='/contact'
              className='flex items-center text-gray-600 hover:text-primary-500 transition-colors py-2 px-4 text-base'
              onClick={() => setMobileMenuOpen(false)}
            >
              <MdOutlineConnectWithoutContact className='w-5 h-5 mr-3' />
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
