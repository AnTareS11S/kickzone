import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import SettingsLayout from './pages/SettingsLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminRoute from './pages/AdminRoute';
import UserManage from './pages/User/UserManage';
import RefereeProfile from './pages/Referee/RefereeProfile';
import RefereeRoute from './pages/Referee/RefereeRoute';
import CoachProfile from './pages/Coach/CoachProfile';
import TeamManage from './pages/Team/TeamManage';
import LeagueManage from './pages/League/LeagueManage';
import Layout from './pages/Layout';
import PostPage from './pages/PostPage';
import Activity from './pages/Activity';
import HomeProfile from './pages/HomeProfile';
import Leagues from './pages/League/Leagues';
import LeaguePage from './pages/League/LeaguePage';
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
import CoachRoute from './pages/CoachRoute';
import CoachDashboard from './pages/Coach/CoachDashboard';
import { Toaster } from './components/ui/toaster';
import ResultsManagement from './pages/Referee/ResultsManagement';
import AddResult from './pages/Referee/AddResult';
import Search from './pages/Search';
import ResultDetails from './pages/Referee/ResultDetails';
import PostEdit from './pages/PostEdit';
import CommentEdit from './pages/CommentEdit';
import PostForm from './components/home/posts/PostForm';
import RefereeDetails from './pages/Referee/RefereeDetails';
import AssignReferee from './pages/Referee/AssignReferee';
import PageNotFound from './pages/PageNotFound';
import SponsorManage from './pages/Sponsor/SponsorMange';
import MatchDetails from './pages/Referee/MatchDetails';
import Onboarding from './pages/Onboarding';
import ProtectedRoute from './pages/ProtectedRoute';
import RefereeManage from './pages/Referee/RefereeManage';
import SeasonManage from './pages/Season/SeasonManage';
import TeamDetails from './components/home/team/TeamDetails';
import LineupManage from './pages/Coach/LineupManage';
import FormationManage from './pages/Coach/FormationManage';
import Messenger from './pages/Messenger';
import TermsManage from './pages/Terms/TermsManage';
import TermsPage from './pages/Terms/TermsPage';
import ContactPage from './pages/Contact/ContactPage';
import PrivacyManage from './pages/Privacy/PrivacyManage';
import PrivacyPage from './pages/Privacy/PrivacyPage';
import AboutManage from './pages/About/AboutManage';
import AboutPage from './pages/About/AboutPage';
import ExplorePage from './pages/Explore/ExplorePage';
import MatchOverview from './pages/Match/MatchOverview';
import FAQManage from './pages/FAQ/FAQManage';
import ContactManage from './pages/Contact/ContactManage';
import AdminProfile from './pages/Admin/AdminProfile';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Public routes */}
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/onboarding' element={<Onboarding />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='*' element={<PageNotFound />} />
            <Route path='/post/create' element={<PostForm />} />
            <Route path='/post/:id' element={<PostPage />} />
            <Route path='/post/edit/:id' element={<PostEdit />} />
            <Route path='/post/comment/edit/:id' element={<CommentEdit />} />
            <Route path='/notifications' element={<Activity />} />
            <Route path='/search' element={<Search />} />
            <Route path='/profile/:id' element={<HomeProfile />} />
            <Route path='/messages' element={<Messenger />} />
            <Route path='/leagues' element={<Leagues />} />
            <Route path='/league/:id' element={<LeaguePage />} />
            <Route path='/league/team/:id' element={<TeamDetails />} />
            <Route path='/coach/:id' element={<CoachDetails />} />
            <Route path='/referee/:id' element={<RefereeDetails />} />
            <Route path='/stadium/:id' element={<StadiumPage />} />
            <Route path='/player/:id' element={<PlayerDetails />} />
            <Route path='/training' element={<TrainingPage />} />
            <Route path='/training/:id' element={<TrainingDetails />} />
            <Route path='/results/:id' element={<ResultDetails />} />
            <Route path='/match/:id' element={<MatchOverview />} />
            <Route path='/terms' element={<TermsPage />} />
            <Route path='/privacy' element={<PrivacyPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/explore' element={<ExplorePage />} />

            {/* Referee routes */}
            <Route path='/dashboard/referee' element={<RefereeRoute />}>
              <Route
                path='/dashboard/referee'
                element={<LeagueScheduleCard />}
              />
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
                element={<ResultsManagement />}
              />
              <Route
                path='/dashboard/referee/league/result/:id'
                element={<AddResult />}
              />
              <Route
                path='/dashboard/referee/league/assign-referee/:id'
                element={<AssignReferee />}
              />
              <Route
                path='/dashboard/referee/league/match-details/:id'
                element={<MatchDetails />}
              />
            </Route>

            {/* Admin routes */}
            <Route path='/dashboard/admin' element={<AdminRoute />}>
              <Route path='/dashboard/admin' element={<AdminDashboard />} />
              <Route path='/dashboard/admin/users' element={<UserManage />} />
              <Route path='/dashboard/admin/teams' element={<TeamManage />} />
              <Route
                path='/dashboard/admin/leagues'
                element={<LeagueManage />}
              />
              <Route
                path='/dashboard/admin/players'
                element={<PlayerManage />}
              />
              <Route
                path='/dashboard/admin/stadiums'
                element={<StadiumManage />}
              />
              <Route
                path='/dashboard/admin/coaches'
                element={<CoachManage />}
              />
              <Route
                path='/dashboard/admin/referees'
                element={<RefereeManage />}
              />
              <Route
                path='/dashboard/admin/positions'
                element={<PositionManage />}
              />
              <Route
                path='/dashboard/admin/countries'
                element={<CountryManage />}
              />
              <Route
                path='/dashboard/admin/seasons'
                element={<SeasonManage />}
              />
              <Route
                path='/dashboard/admin/sponsors'
                element={<SponsorManage />}
              />
              <Route path='/dashboard/admin/terms' element={<TermsManage />} />
              <Route
                path='/dashboard/admin/privacy'
                element={<PrivacyManage />}
              />
              <Route path='/dashboard/admin/about' element={<AboutManage />} />
              <Route
                path='/dashboard/admin/contact'
                element={<ContactManage />}
              />
              <Route path='/dashboard/admin/faq' element={<FAQManage />} />
            </Route>

            {/* Coach routes */}
            <Route path='/dashboard/coach' element={<CoachRoute />}>
              <Route path='/dashboard/coach' element={<CoachDashboard />} />
              <Route path='/dashboard/coach/team' element={<CoachTeamView />} />
              <Route
                path='/dashboard/coach/training'
                element={<TrainingManage />}
              />
              <Route
                path='/dashboard/coach/training-type'
                element={<TrainingTypeManage />}
              />
              <Route
                path='/dashboard/coach/formation'
                element={<FormationManage />}
              />
              <Route
                path='/dashboard/coach/lineup'
                element={<LineupManage />}
              />
            </Route>
          </Route>

          {/* User routes */}
          <Route path='/user' element={<SettingsLayout />}>
            <Route path='/user/profile' element={<Profile />} />
            <Route path='/user/referee' element={<RefereeRoute />}>
              <Route
                path='/user/referee/profile'
                element={<RefereeProfile />}
              />
            </Route>
            <Route path='/user/settings' element={<Settings />} />
            <Route path='/user/player' element={<PlayerRoute />}>
              <Route path='/user/player/profile' element={<PlayerProfile />} />
            </Route>
            <Route path='/user/coach' element={<CoachRoute />}>
              <Route path='/user/coach/profile' element={<CoachProfile />} />
            </Route>
            <Route path='/user/admin' element={<AdminRoute />}>
              <Route path='/user/admin/profile' element={<AdminProfile />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
