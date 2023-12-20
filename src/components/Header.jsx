import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
      navigate('/');
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
  return (
    <nav className='topbar'>
      <Link to='/' className='flex items-center gap-1 justify-center'>
        <img src='/logo_black.png' alt='logo' className='h-9 w-9' />
        <p className='text-heading3-bold text-dark-2 max-xs:hidden'>
          FutbolistPro
        </p>
      </Link>

      <div className='flex items-center gap-1'>
        <div className='block'>
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='relative h-8 w-8 rounded-full'
                >
                  <Avatar className='h-9 w-9 '>
                    <AvatarImage src={currentUser?.photo} alt='Profile photo' />
                    <AvatarFallback>
                      {currentUser.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-52 mt-4' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      {currentUser.username} {`[${currentUser.role}]`}
                    </p>
                    <p className='text-xs leading-none text-muted-foreground'>
                      {currentUser.email}
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
