import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import {
  FaBan,
  FaExclamationTriangle,
  FaTrash,
  FaUser,
  FaFileAlt,
  FaTag,
  FaInfoCircle,
} from 'react-icons/fa';
import { ReportCard } from '../../components/report/ReportCard';
import { getStatusBadge } from '../../lib/utils.jsx';
import Spinner from '../../components/Spinner.jsx';

const ReportsManagement = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/admin/reports');
        const data = await response.json();
        setReports(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports =
    filterStatus === 'all'
      ? reports
      : reports.filter((report) => report.status === filterStatus);

  const handleReportAction = async (action) => {
    if (!selectedReport) return;

    try {
      const response = await fetch(`/api/admin/report/${selectedReport._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action,
          adminNotes: adminNote,
          actionTaken:
            action === 'Resolved'
              ? 'Warning'
              : action === 'Dismissed'
              ? 'No_action'
              : 'Content_removed',
        }),
      });

      if (response.ok) {
        setReports(
          reports.map((report) =>
            report._id === selectedReport._id
              ? { ...report, status: action, adminNotes: adminNote }
              : report
          )
        );
        setIsDetailsDialogOpen(false);
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Failed to update report:', error);
    }
  };

  const navigateToContentManagement = () => {
    if (selectedReport?.contentType && selectedReport?.contentId) {
      navigate('/dashboard/admin/content-management', {
        state: {
          contentType: selectedReport.contentType,
          contentId: selectedReport.contentId,
          reportId: selectedReport._id,
        },
      });
    }
  };

  const navigateToUserManagement = () => {
    if (selectedReport?.reportedUser?._id) {
      navigate('/dashboard/admin/user-management', {
        state: {
          userId: selectedReport.reportedUser._id,
          username: selectedReport.reportedUser.username,
          reportId: selectedReport._id,
        },
      });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='p-4 max-w-8xl mx-auto'>
      <BackButton className='mb-4' />
      <Card className='w-full shadow-lg'>
        <CardHeader className='bg-gray-50'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <CardTitle className='text-2xl font-bold'>
              Reports Management
            </CardTitle>
            <Select onValueChange={setFilterStatus} value={filterStatus}>
              <SelectTrigger className='w-full md:w-[200px]'>
                <SelectValue placeholder='Filter by Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Reports</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='under_review'>Under Review</SelectItem>
                <SelectItem value='resolved'>Resolved</SelectItem>
                <SelectItem value='dismissed'>Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop View */}
          <div className='hidden md:block overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='font-semibold'>Reported By</TableHead>
                  <TableHead className='font-semibold'>Reported User</TableHead>
                  <TableHead className='font-semibold'>Content Type</TableHead>
                  <TableHead className='font-semibold'>Reason</TableHead>
                  <TableHead className='font-semibold'>Status</TableHead>
                  <TableHead className='font-semibold'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports?.map((report) => (
                  <TableRow key={report._id} className='hover:bg-gray-50'>
                    <TableCell>
                      <Link
                        to={`/profile/${report.reportedBy._id}`}
                        className='text-blue-600 hover:text-blue-800'
                      >
                        {report.reportedBy.username}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/profile/${report.reportedUser._id}`}
                        className='text-blue-600 hover:text-blue-800'
                      >
                        {report.reportedUser.username}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {report.actionTaken === 'Content_removed' ? (
                        <span className='text-red-500'>Content Removed</span>
                      ) : (
                        <Link
                          to={`${
                            report.contentType === 'Post' ? '/post' : '/comment'
                          }/${report.contentId}`}
                          className='text-blue-600 hover:text-blue-800'
                        >
                          {report.contentType}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell className='max-w-xs truncate'>
                      {report.reason}
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setSelectedReport(report);
                          setIsDetailsDialogOpen(true);
                        }}
                        className='hover:bg-gray-100'
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredReports?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-8'>
                      <div className='flex flex-col items-center text-gray-500'>
                        <FaInfoCircle size={24} className='mb-2' />
                        <p>No reports found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Mobile View */}
          <div className='md:hidden'>
            {filteredReports?.length > 0 ? (
              filteredReports.map((report) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  setSelectedReport={setSelectedReport}
                  setIsDetailsDialogOpen={setIsDetailsDialogOpen}
                />
              ))
            ) : (
              <div className='text-center py-8'>
                <div className='flex flex-col items-center text-gray-500'>
                  <FaInfoCircle size={24} className='mb-2' />
                  <p>No reports found</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className='sm:max-w-[700px] sm:max-h-[70vh] max-sm:h-[70vh] lg:max-h-[85vh] overflow-scroll '>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold mb-4'>
              Report Details
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>

          {selectedReport && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <FaUser className='text-gray-400' />
                    <div>
                      <p className='text-sm text-gray-500'>Reported By</p>
                      <Link
                        to={`/profile/${selectedReport.reportedBy._id}`}
                        className='text-blue-600 hover:text-blue-800'
                      >
                        {selectedReport.reportedBy.username}
                      </Link>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <FaUser className='text-gray-400' />
                    <div>
                      <p className='text-sm text-gray-500'>Reported User</p>
                      <Link
                        to={`/profile/${selectedReport.reportedUser._id}`}
                        className='text-blue-600 hover:text-blue-800'
                      >
                        {selectedReport.reportedUser.username}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <FaFileAlt className='text-gray-400' />
                    <div>
                      <p className='text-sm text-gray-500'>Content Type</p>
                      {selectedReport.actionTaken === 'Content_removed' ? (
                        <span className='text-red-500'>Content Removed</span>
                      ) : (
                        <Link
                          to={`${
                            selectedReport.contentType === 'Post'
                              ? '/post'
                              : '/comment'
                          }/${selectedReport.contentId}`}
                          className='text-blue-600 hover:text-blue-800'
                        >
                          {selectedReport.actionTaken === 'Content_removed'
                            ? 'Content Removed'
                            : selectedReport.contentType}
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <FaTag className='text-gray-400' />
                    <div>
                      <p className='text-sm text-gray-500'>Status</p>
                      {getStatusBadge(selectedReport.status)}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <div>
                  <h3 className='font-semibold mb-2'>Reason</h3>
                  <p className='text-gray-700'>{selectedReport.reason}</p>
                </div>

                <div>
                  <h3 className='font-semibold mb-2'>Description</h3>
                  <p className='text-gray-700'>{selectedReport.description}</p>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <h3 className='font-semibold flex items-center gap-2'>
                  <FaExclamationTriangle className='text-yellow-500' />
                  Available Actions
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {selectedReport.contentId && (
                    <Button
                      variant='destructive'
                      onClick={navigateToContentManagement}
                      className='flex items-center justify-center gap-2'
                      disabled={
                        selectedReport.actionTaken === 'Content_removed'
                      }
                    >
                      <FaTrash />
                      Manage Content
                    </Button>
                  )}

                  <Button
                    variant='destructive'
                    onClick={navigateToUserManagement}
                    className='flex items-center justify-center gap-2'
                    disabled={selectedReport.actionTaken === 'User_suspended'}
                  >
                    <FaBan />
                    Manage User
                  </Button>
                </div>

                <Textarea
                  placeholder='Add admin notes...'
                  value={adminNote || selectedReport?.adminNotes || ''}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className='min-h-[100px] w-full'
                />

                <div className='flex flex-col md:flex-row justify-between gap-4'>
                  <Button
                    variant='outline'
                    onClick={() => handleReportAction('under_review')}
                    className='flex-1'
                  >
                    Start Review
                  </Button>
                  <Button
                    variant='destructive'
                    onClick={() => handleReportAction('resolved')}
                    className='flex-1'
                  >
                    Take Action
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => handleReportAction('dismissed')}
                    className='flex-1'
                  >
                    Dismiss Report
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsManagement;
