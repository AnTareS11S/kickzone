import { FaSearch } from 'react-icons/fa';
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
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Futbolista</span>
            <span className='text-slate-700'>Pro</span>
          </h1>
        </Link>
        <form className='bg-slate-100 flex items-center rounded-full p-3 focus:ring-2 focus:ring-slate-600'>
          <input
            type='text'
            placeholder='Search'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
          />
          <FaSearch className='text-slate-600' />
        </form>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-500 hover:text-slate-700 font-semibold hover:underline'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-500 hover:text-slate-700 font-semibold hover:underline'>
              About
            </li>
          </Link>

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
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      {currentUser.username}
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
        </ul>
      </div>
    </header>
  );
};

export default Header;
