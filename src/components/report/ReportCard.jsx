import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { getStatusBadge } from '../../lib/utils.jsx';

export const ReportCard = ({
  report,
  setSelectedReport,
  setIsDetailsDialogOpen,
}) => (
  <div className='bg-white rounded-lg shadow p-4 mb-4 border border-gray-200'>
    <div className='space-y-3'>
      <div className='flex justify-between items-start'>
        <div className='space-y-1'>
          <p className='text-sm text-gray-500'>Reported By</p>
          <Link
            to={`/profile/${report.reportedBy._id}`}
            className='text-blue-600 hover:text-blue-800 font-medium'
          >
            {report.reportedBy.username}
          </Link>
        </div>
        {getStatusBadge(report.status)}
      </div>

      <div>
        <p className='text-sm text-gray-500'>Reported User</p>
        <Link
          to={`/profile/${report.reportedUser._id}`}
          className='text-blue-600 hover:text-blue-800'
        >
          {report.reportedUser.username}
        </Link>
      </div>

      <div>
        <p className='text-sm text-gray-500'>Content Type</p>
        <Link
          to={`${report.contentType === 'Post' ? '/post' : '/comment'}/${
            report.contentId
          }`}
          className='text-blue-600 hover:text-blue-800'
        >
          {report.contentType}
        </Link>
      </div>

      <div>
        <p className='text-sm text-gray-500'>Reason</p>
        <p className='text-gray-900'>{report.reason}</p>
      </div>

      <Button
        variant='outline'
        size='sm'
        onClick={() => {
          setSelectedReport(report);
          setIsDetailsDialogOpen(true);
        }}
        className='w-full mt-2'
      >
        View Details
      </Button>
    </div>
  </div>
);
