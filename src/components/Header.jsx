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
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

const Header = () => {
  const { user, currentUser } = useFetchUserById();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        return;
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <nav className='topbar'>
      <Link to='/' className='flex items-center gap-1 justify-center'>
        <img src='/logo_black.png' alt='logo' className='h-9 w-9' />
        <p className='text-heading3-bold text-dark-2 max-xs:hidden'>KickZone</p>
      </Link>

      <div className='flex items-center gap-1'>
        <div className='block'>
          {currentUser ? (
            <div className='flex flex-row gap-4 items-center'>
              <Link to='/messages'>
                <EnvelopeClosedIcon className='w-5 h-5 cursor-pointer hover:text-primary-500 transition-colors' />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-8 w-8 rounded-full'
                  >
                    <Avatar className='h-9 w-9 '>
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
                <DropdownMenuContent
                  className='w-52 mt-4'
                  align='end'
                  forceMount
                >
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {user.username} {`[${user.role}]`}
                      </p>
                      <p className='text-xs leading-none text-muted-foreground'>
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link to='/user/profile'>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <Link to='/user/settings'>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                    </Link>
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
              className='text-slate-500 hover:text-slate-700 font-semibold'
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
