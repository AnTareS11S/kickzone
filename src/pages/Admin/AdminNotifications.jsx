import { useEffect, useState } from 'react';
import { useToast } from '../../components/ui/use-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

const AdminNotifications = () => {
  const [roleChanges, setRoleChanges] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Fetch role changes
        const roleRes = await fetch('/api/admin/role-changes');
        const roleData = await roleRes.json();

        // Fetch reports
        const reportsRes = await fetch('/api/admin/reports');
        const reportsData = await reportsRes.json();

        setRoleChanges(roleData);
        setReports(reportsData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch notifications',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAsResolved = async (reportId) => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}/resolve`, {
        method: 'PUT',
      });

      if (!res.ok) throw new Error('Failed to resolve report');

      // Update the reports list
      setReports(
        reports.map((report) =>
          report._id === reportId ? { ...report, status: 'resolved' } : report
        )
      );

      toast({
        title: 'Success',
        description: 'Report marked as resolved',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resolve report',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Role Changes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Role Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Previous Role</TableHead>
                <TableHead>New Role</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roleChanges.map((change) => (
                <TableRow key={change._id}>
                  <TableCell className='font-medium'>
                    <div className='flex flex-col'>
                      <span>{change.user.username}</span>
                      <span className='text-sm text-gray-500'>
                        {change.user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>{change.previousRole}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{change.newRole}</Badge>
                  </TableCell>
                  <TableCell>{change.changedBy.username}</TableCell>
                  <TableCell>{formatDate(change.createdAt)}</TableCell>
                </TableRow>
              ))}
              {roleChanges.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='text-center text-gray-500'>
                    No role changes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reported User</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell className='font-medium'>
                    <div className='flex flex-col'>
                      <span>{report.reportedUser.username}</span>
                      <span className='text-sm text-gray-500'>
                        {report.reportedUser.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{report.reportedBy.username}</TableCell>
                  <TableCell>
                    <div className='max-w-xs'>
                      <p className='truncate' title={report.reason}>
                        {report.reason}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === 'pending' ? 'destructive' : 'success'
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(report.createdAt)}</TableCell>
                  <TableCell>
                    {report.status === 'pending' && (
                      <Button
                        size='sm'
                        onClick={() => handleMarkAsResolved(report._id)}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className='text-center text-gray-500'>
                    No reports found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotifications;
