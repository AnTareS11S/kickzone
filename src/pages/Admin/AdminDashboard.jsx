import { Link } from 'react-router-dom';
import AdminCard from '../../components/admin/AdminCard';
import Spinner from '../../components/Spinner';
import { Separator } from '../../components/ui/separator';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { GetUserById } from '../../api/getUserById';
import { useEffect, useState } from 'react';
import {
  FaUsers,
  FaUserCog,
  FaFutbol,
  FaAward,
  FaHandHoldingUsd,
  FaShieldAlt,
  FaTrophy,
  FaWarehouse,
  FaMapMarkerAlt,
  FaGlobeAmericas,
  FaCalendarAlt,
  FaInfoCircle,
  FaFileAlt,
  FaLock,
  FaEnvelope,
  FaQuestionCircle,
  FaComments,
} from 'react-icons/fa';
import { TbReport } from 'react-icons/tb';
import { MdWorkHistory } from 'react-icons/md';

const AdminDashboard = () => {
  const { user, loading } = GetUserById();
  const [roleChangeNotif, setRoleChangeNotif] = useState(0);
  const [reportNotif, setReportNotif] = useState(0);

  useEffect(() => {
    if (!user) return;

    const getNotifications = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/notifications-count`
        );
        const data = await response.json();
        setRoleChangeNotif(data.notificationsCount);
        setReportNotif(data.reportsCount);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    getNotifications();
  }, [user]);

  const adminCards = [
    {
      title: 'Role Changes',
      icon: FaUserCog,
      linkTo: '/dashboard/admin/role-changes',
      notificationCount: roleChangeNotif,
    },
    {
      title: 'Reports',
      icon: TbReport,
      linkTo: '/dashboard/admin/reports',
      notificationCount: reportNotif,
    },
    { title: 'Users', icon: FaUsers, linkTo: '/dashboard/admin/users' },
    { title: 'Players', icon: FaFutbol, linkTo: '/dashboard/admin/players' },
    { title: 'Coaches', icon: FaAward, linkTo: '/dashboard/admin/coaches' },
    {
      title: 'Referees',
      icon: MdWorkHistory,
      linkTo: '/dashboard/admin/referees',
    },
    {
      title: 'Sponsors',
      icon: FaHandHoldingUsd,
      linkTo: '/dashboard/admin/sponsors',
    },
    { title: 'Teams', icon: FaShieldAlt, linkTo: '/dashboard/admin/teams' },
    { title: 'Leagues', icon: FaTrophy, linkTo: '/dashboard/admin/leagues' },
    {
      title: 'Stadiums',
      icon: FaWarehouse,
      linkTo: '/dashboard/admin/stadiums',
    },
    {
      title: 'Positions',
      icon: FaMapMarkerAlt,
      linkTo: '/dashboard/admin/positions',
    },
    {
      title: 'Countries',
      icon: FaGlobeAmericas,
      linkTo: '/dashboard/admin/countries',
    },
    {
      title: 'Seasons',
      icon: FaCalendarAlt,
      linkTo: '/dashboard/admin/seasons',
    },
    { title: 'About', icon: FaInfoCircle, linkTo: '/dashboard/admin/about' },
    { title: 'Terms', icon: FaFileAlt, linkTo: '/dashboard/admin/terms' },
    { title: 'Privacy', icon: FaLock, linkTo: '/dashboard/admin/privacy' },
    { title: 'Contact', icon: FaEnvelope, linkTo: '/dashboard/admin/contact' },
    { title: 'FAQ', icon: FaQuestionCircle, linkTo: '/dashboard/admin/faq' },
    {
      title: 'Forum Categories',
      icon: FaComments,
      linkTo: '/dashboard/admin/forum-category',
    },
  ];

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col gap-6 p-4 md:p-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-heading4-medium font-bold text-gray-800'>
          Admin Dashboard
        </h1>
        <Separator />
      </div>

      {user.isProfileFilled ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
          {adminCards.map((card) => (
            <AdminCard
              key={card.title}
              title={card.title}
              icon={card.icon}
              linkTo={card.linkTo}
              notificationCount={card.notificationCount}
            />
          ))}
        </div>
      ) : (
        <div className='text-gray-800 text-lg text-center'>
          <p className='mb-4'>
            Please fill in your profile to access the dashboard.
          </p>
          <Link
            to='/user/admin/profile'
            className='inline-flex items-center justify-center px-4 py-2 bg-primary-500 hover:bg-purple-500 text-white rounded-md transition-colors duration-300'
          >
            <span>Complete Profile</span>
            <ArrowRightIcon className='ml-2 h-5 w-5' />
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
