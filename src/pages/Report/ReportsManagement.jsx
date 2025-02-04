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
import { Link } from 'react-router-dom';

const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/admin/reports');
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };
    fetchReports();
  }, []);

  // Filter reports based on status
  const filteredReports =
    filterStatus === 'all'
      ? reports
      : reports.filter((report) => report.status === filterStatus);

  // Handle report actions
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
            action === 'resolved'
              ? 'warning'
              : action === 'dismissed'
              ? 'no_action'
              : 'content_removed',
        }),
      });

      if (response.ok) {
        // Update local state
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

  // Open details dialog
  const openReportDetails = (report) => {
    setSelectedReport(report);
    setIsDetailsDialogOpen(true);
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Reports Management</CardTitle>
        <div className='flex items-center space-x-4'>
          <Select onValueChange={setFilterStatus}>
            <SelectTrigger className='w-[180px]'>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reported By</TableHead>
              <TableHead>Reported User</TableHead>
              <TableHead>Content Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports?.map((report) => (
              <TableRow key={report._id}>
                <TableCell>
                  <Link to={`/profile/${report.reportedBy._id}`}>
                    {report.reportedBy.username}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/profile/${report.reportedUser._id}`}>
                    {report.reportedUser.username}
                  </Link>
                </TableCell>
                <TableCell>{report.contentType}</TableCell>
                <TableCell>{report.reason}</TableCell>
                <TableCell>
                  <span
                    className={`
                    px-2 py-1 rounded 
                    ${
                      report.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : report.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'dismissed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }
                  `}
                  >
                    {report.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => openReportDetails(report)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredReports?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='text-center pt-10 text-gray-500'
                >
                  No reports found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Report Details Dialog */}
      <Dialog
        open={isDetailsDialogOpen}
        onOpenChange={() => setIsDetailsDialogOpen(false)}
      >
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle className='text-body-medium'>
              Report Details
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>

          {selectedReport && (
            <>
              <div className='space-y-4'>
                {selectedReport.contentId && (
                  <div>
                    <strong>Content ID:</strong>{' '}
                    <Link to={`/post/${selectedReport.contentId}`}>
                      {selectedReport.contentType}
                    </Link>
                  </div>
                )}

                <div>
                  <strong>Reported By:</strong>{' '}
                  <Link to={`/profile/${selectedReport.reportedBy._id}`}>
                    {selectedReport.reportedBy.username}
                  </Link>
                </div>
                <div>
                  <strong>Reported User:</strong>{' '}
                  <Link to={`/profile/${selectedReport.reportedUser._id}`}>
                    {selectedReport.reportedUser.username}
                  </Link>
                </div>
                <div>
                  <strong>Content Type:</strong> {selectedReport.contentType}
                </div>
                <div>
                  <strong>Reason:</strong> {selectedReport.reason}
                </div>
                <div>
                  <strong>Description:</strong> {selectedReport.description}
                </div>

                <Textarea
                  placeholder='Add admin notes...'
                  value={adminNote || selectedReport?.adminNotes || ''}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className='w-full'
                />

                <div className='flex justify-between space-x-2'>
                  <Button
                    variant='outline'
                    onClick={() => handleReportAction('under_review')}
                  >
                    Start Review
                  </Button>
                  <Button
                    variant='destructive'
                    onClick={() => handleReportAction('resolved')}
                  >
                    Take Action
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => handleReportAction('dismissed')}
                  >
                    Dismiss Report
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ReportsManagement;
