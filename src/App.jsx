import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import PrivateRoute from './pages/PrivateRoute';
import SettingsLayout from './pages/SettingsLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminRoute from './pages/AdminRoute';
import UserManage from './pages/UserManage';
import RefereeProfile from './pages/Referee/RefereeProfile';
import RefereeRoute from './pages/Referee/RefereeRoute';
import CoachProfile from './pages/CoachProfile';
import TeamManage from './pages/Team/TeamManage';
import LeagueManage from './pages/League/LeagueManage';
import Layout from './pages/Layout';
import AddPost from './pages/AddPost';
import PostPage from './pages/PostPage';
import Activity from './pages/Activity';
import HomeProfile from './pages/HomeProfile';
import Leagues from './pages/League/Leagues';
import LeaguePage from './pages/League/LeaguePage';
import RefereeStats from './pages/Referee/RefereeStats';
import TeamPage from './pages/Team/TeamPage';
import PlayerManage from './pages/Player/PlayerManage';
import PlayerProfile from './pages/Player/PlayerProfile';
import PlayerRoute from './pages/Player/PlayerRoute';
import CountryManage from './pages/Country/CountryManage';
import StadiumManage from './pages/Stadium/StadiumManage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/post/create' element={<AddPost />} />
          <Route path='/post/:id' element={<PostPage />} />
          <Route path='/activity' element={<Activity />} />
          <Route path='/profile/:id' element={<HomeProfile />} />
          <Route path='/leagues' element={<Leagues />} />
          <Route path='/leagues/:id' element={<LeaguePage />} />
          <Route path='/leagues/team/:id' element={<TeamPage />} />
        </Route>
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />

        <Route path='/user' element={<SettingsLayout />}>
          <Route path='/user/profile' element={<Profile />} />
          <Route path='/user/referee' element={<RefereeRoute />}>
            <Route path='/user/referee/profile' element={<RefereeProfile />} />
            <Route path='/user/referee/team-stats' element={<RefereeStats />} />
          </Route>
          <Route path='/user/settings' element={<Settings />} />
          <Route path='/user/admin' element={<AdminRoute />}>
            <Route path='/user/admin/users' element={<UserManage />} />
            <Route path='/user/admin/teams' element={<TeamManage />} />
            <Route path='/user/admin/leagues' element={<LeagueManage />} />
            <Route path='/user/admin/players' element={<PlayerManage />} />
            <Route path='/user/admin/countries' element={<CountryManage />} />
            <Route path='/user/admin/stadiums' element={<StadiumManage />} />
          </Route>
          <Route path='/user/player' element={<PlayerRoute />}>
            <Route path='/user/player/profile' element={<PlayerProfile />} />
          </Route>
          <Route path='/user/coach/profile' element={<CoachProfile />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path='/user' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
