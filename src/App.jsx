import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import About from './pages/About';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import SettingsLayout from './pages/SettingsLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminRoute from './components/AdminRoute';
import Users from './pages/Users';
import RefereeProfile from './pages/RefereeProfile';
import RefereeRoute from './components/RefereeRoute';
import CoachProfile from './pages/CoachProfile';
import TeamManage from './pages/TeamManage';
import LeagueManage from './pages/LeagueManage';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/about' element={<About />} />
        <Route path='/user' element={<SettingsLayout />}>
          <Route path='/user/profile' element={<Profile />} />
          <Route path='/user/referee' element={<RefereeRoute />}>
            <Route path='/user/referee/profile' element={<RefereeProfile />} />
          </Route>
          <Route path='/user/settings' element={<Settings />} />
          <Route path='/user/admin' element={<AdminRoute />}>
            <Route path='/user/admin/users' element={<Users />} />
            <Route path='/user/admin/teams' element={<TeamManage />} />
            <Route path='/user/admin/leagues' element={<LeagueManage />} />
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
