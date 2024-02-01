import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import PrivateRoute from './pages/PrivateRoute';
import SettingsLayout from './pages/SettingsLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminRoute from './pages/AdminRoute';
import UserManage from './pages/User/UserManage';
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
import PositionManage from './pages/Position/PositionManage';
import CoachManage from './pages/Coach/CoachManage';
import CoachDetails from './pages/Coach/CoachDetails';
import StadiumPage from './pages/Stadium/StadiumPage';
import CoachTeamView from './pages/Coach/CoachTeamView';
import PlayerDetails from './pages/Player/PlayerDetails';
import TrainingManage from './pages/Coach/TrainingManage';
import TrainingTypeManage from './pages/Coach/TrainingTypeManage';
import TrainingPage from './pages/Training/TrainingPage';
import TrainingDetails from './pages/Training/TrainingDetails';
import RefereeDashboard from './pages/Referee/RefereeDashboard';
import ScheduleManagement from './pages/Referee/ScheduleManagement';
import LeagueScheduleCard from './pages/League/LeagueScheduleCard';
import AdminDashboard from './pages/Admin/AdminDashboard';

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
          <Route path='/league/:id' element={<LeaguePage />} />
          <Route path='/league/team/:id' element={<TeamPage />} />
          <Route path='/coach/:id' element={<CoachDetails />} />
          <Route path='/stadium/:id' element={<StadiumPage />} />
          <Route path='/player/:id' element={<PlayerDetails />} />
          <Route path='/training' element={<TrainingPage />} />
          <Route path='/training/:id' element={<TrainingDetails />} />
          <Route path='/dashboard/referee' element={<RefereeRoute />}>
            <Route path='/dashboard/referee' element={<LeagueScheduleCard />} />
            <Route
              path='/dashboard/referee/league/:id'
              element={<RefereeDashboard />}
            />
            <Route
              path='/dashboard/referee/league/schedule/:id'
              element={<ScheduleManagement />}
            />
            <Route
              path='/dashboard/referee/league/results/:id'
              element={<ScheduleManagement />}
            />
            <Route
              path='/dashboard/referee/league/player-stats/:id'
              element={<ScheduleManagement />}
            />
          </Route>
          <Route path='/dashboard/admin' element={<AdminRoute />}>
            <Route path='/dashboard/admin' element={<AdminDashboard />} />
            <Route path='/dashboard/admin/users' element={<UserManage />} />
            <Route path='/dashboard/admin/teams' element={<TeamManage />} />
            <Route path='/dashboard/admin/leagues' element={<LeagueManage />} />
            <Route path='/dashboard/admin/players' element={<PlayerManage />} />
            <Route
              path='/dashboard/admin/stadiums'
              element={<StadiumManage />}
            />
            <Route path='/dashboard/admin/coaches' element={<CoachManage />} />
            <Route
              path='/dashboard/admin/positions'
              element={<PositionManage />}
            />
            <Route
              path='/dashboard/admin/countries'
              element={<CountryManage />}
            />
          </Route>
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
          <Route path='/user/player' element={<PlayerRoute />}>
            <Route path='/user/player/profile' element={<PlayerProfile />} />
          </Route>
          <Route path='/user/coach/profile' element={<CoachProfile />} />
          <Route path='/user/coach/team' element={<CoachTeamView />} />
          <Route path='/user/coach/training' element={<TrainingManage />} />
          <Route
            path='/user/coach/training-type'
            element={<TrainingTypeManage />}
          />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path='/user' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
