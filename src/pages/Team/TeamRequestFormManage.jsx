import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
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
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';
import Spinner from '../../components/Spinner';
import { FaCheck, FaTimes, FaEye, FaSearch, FaFilter } from 'react-icons/fa';

const TeamRequestsFormManage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [leagueId, setLeagueId] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch team requests and leagues
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch team requests
        const requestsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/team-requests`,
          {
            params: {
              page: currentPage,
              status: filter !== 'all' ? filter : undefined,
              search: searchTerm || undefined,
            },
          }
        );

        setRequests(requestsResponse.data.requests || []);
        setTotalPages(requestsResponse.data.totalPages || 1);

        // Fetch leagues for dropdown
        const leaguesResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/leagues`
        );
        setLeagues(leaguesResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load team requests');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, filter, searchTerm]);

  // Handle status change (approve/reject)
  const handleStatusChange = async (requestId, status, reason = null) => {
    setIsSubmitting(true);
    try {
      await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/admin/team-requests/${requestId}`,
        {
          status,
          leagueId: status === 'approved' ? leagueId : undefined,
          reason: reason,
        }
      );

      // Update local state
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status, reason } : req
        )
      );

      toast.success(
        `Request ${
          status === 'approved' ? 'approved' : 'rejected'
        } successfully`
      );

      // Close dialogs
      setApproveDialogOpen(false);
      setRejectDialogOpen(false);
      setRejectReason('');
      setLeagueId('');
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      toast.error(`Failed to ${status} request`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className='bg-yellow-500'>Pending</Badge>;
      case 'approved':
        return <Badge className='bg-green-500'>Approved</Badge>;
      case 'rejected':
        return <Badge className='bg-red-500'>Rejected</Badge>;
      default:
        return <Badge className='bg-gray-500'>Unknown</Badge>;
    }
  };

  // Filter handler
  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-2xl'>Team Requests Management</CardTitle>
          <CardDescription>
            Review and manage team addition requests from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className='flex flex-col md:flex-row gap-4 mb-6'>
            <div className='flex-1'>
              <form
                onSubmit={handleSearch}
                className='flex w-full max-w-sm items-center space-x-2'
              >
                <Input
                  type='text'
                  placeholder='Search team name...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type='submit'>
                  <FaSearch className='mr-2' />
                  Search
                </Button>
              </form>
            </div>
            <div className='w-full max-w-xs'>
              <Select value={filter} onValueChange={handleFilterChange}>
                <SelectTrigger>
                  <FaFilter className='mr-2' />
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Requests</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='approved'>Approved</SelectItem>
                  <SelectItem value='rejected'>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className='flex justify-center items-center py-8'>
              <Spinner />
            </div>
          ) : requests.length === 0 ? (
            <div className='text-center py-8 bg-gray-50 rounded-lg border'>
              <p className='text-gray-500 text-lg mb-2'>
                No team requests found
              </p>
              <p className='text-gray-400'>
                {searchTerm || filter !== 'all'
                  ? 'Try changing your search or filter criteria'
                  : 'Team requests will appear here when users submit them'}
              </p>
            </div>
          ) : (
            <>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell className='font-medium'>
                          {request.name}
                        </TableCell>
                        <TableCell>{request.country}</TableCell>
                        <TableCell>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                setSelectedRequest(request);
                                setViewDialogOpen(true);
                              }}
                            >
                              <FaEye className='mr-1' /> View
                            </Button>

                            {request.status === 'pending' && (
                              <>
                                <Button
                                  variant='default'
                                  size='sm'
                                  className='bg-green-600 hover:bg-green-700'
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setApproveDialogOpen(true);
                                  }}
                                >
                                  <FaCheck className='mr-1' /> Approve
                                </Button>
                                <Button
                                  variant='destructive'
                                  size='sm'
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setRejectDialogOpen(true);
                                  }}
                                >
                                  <FaTimes className='mr-1' /> Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='mt-6'>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={currentPage === page}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      {selectedRequest && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className='max-w-3xl'>
            <DialogHeader>
              <DialogTitle>Team Request Details</DialogTitle>
              <DialogDescription>
                Submitted on{' '}
                {new Date(selectedRequest.createdAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
              <div>
                <h4 className='text-sm font-medium mb-1'>Team Name</h4>
                <p className='text-lg'>{selectedRequest.name}</p>
              </div>
              <div>
                <h4 className='text-sm font-medium mb-1'>Founded Year</h4>
                <p>{selectedRequest.foundedYear}</p>
              </div>
              <div>
                <h4 className='text-sm font-medium mb-1'>Location</h4>
                <p>
                  {selectedRequest.city}, {selectedRequest.country}
                </p>
              </div>
              <div>
                <h4 className='text-sm font-medium mb-1'>Stadium</h4>
                <p>{selectedRequest.stadium}</p>
              </div>
              <div>
                <h4 className='text-sm font-medium mb-1'>Coach</h4>
                <p>{selectedRequest.coach}</p>
              </div>
              <div>
                <h4 className='text-sm font-medium mb-1'>Sponsor</h4>
                <p>{selectedRequest.sponsor || 'None specified'}</p>
              </div>
              <div className='col-span-2'>
                <h4 className='text-sm font-medium mb-1'>Team Bio</h4>
                <p className='bg-gray-50 p-3 rounded'>{selectedRequest.bio}</p>
              </div>
              {selectedRequest.status === 'rejected' && (
                <div className='col-span-2'>
                  <h4 className='text-sm font-medium mb-1 text-red-500'>
                    Rejection Reason
                  </h4>
                  <p className='bg-red-50 p-3 rounded text-red-700'>
                    {selectedRequest.reason || 'No reason provided'}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className='flex justify-between items-center'>
              <div>
                <span className='mr-2'>Status:</span>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <div className='flex gap-3'>
                {selectedRequest.status === 'pending' && (
                  <>
                    <Button
                      variant='default'
                      className='bg-green-600 hover:bg-green-700'
                      onClick={() => {
                        setViewDialogOpen(false);
                        setApproveDialogOpen(true);
                      }}
                    >
                      <FaCheck className='mr-2' /> Approve
                    </Button>
                    <Button
                      variant='destructive'
                      onClick={() => {
                        setViewDialogOpen(false);
                        setRejectDialogOpen(true);
                      }}
                    >
                      <FaTimes className='mr-2' /> Reject
                    </Button>
                  </>
                )}
                <Button
                  variant='outline'
                  onClick={() => setViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Approve Dialog */}
      {selectedRequest && (
        <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Team Request</DialogTitle>
              <DialogDescription>
                Approve and add &quot;{selectedRequest.name}&quot; to a league
              </DialogDescription>
            </DialogHeader>

            <div className='py-4'>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium mb-1 block'>
                    Select League
                  </label>
                  <Select value={leagueId} onValueChange={setLeagueId}>
                    <SelectTrigger>
                      <SelectValue placeholder='Choose a league' />
                    </SelectTrigger>
                    <SelectContent>
                      {leagues.map((league) => (
                        <SelectItem key={league._id} value={league._id}>
                          {league.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {leagues.length === 0 && (
                    <p className='text-sm text-yellow-600 mt-1'>
                      No leagues available. You need to create a league first.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setApproveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant='default'
                className='bg-green-600 hover:bg-green-700'
                disabled={isSubmitting || !leagueId}
                onClick={() =>
                  handleStatusChange(selectedRequest._id, 'approved')
                }
              >
                {isSubmitting ? 'Processing...' : 'Approve Team'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Dialog */}
      {selectedRequest && (
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Team Request</DialogTitle>
              <DialogDescription>
                Reject the request for &quot;{selectedRequest.name}&quot;
              </DialogDescription>
            </DialogHeader>

            <div className='py-4'>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium mb-1 block'>
                    Reason for Rejection (optional)
                  </label>
                  <Textarea
                    placeholder='Provide a reason why this team request is being rejected'
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                disabled={isSubmitting}
                onClick={() =>
                  handleStatusChange(
                    selectedRequest._id,
                    'rejected',
                    rejectReason
                  )
                }
              >
                {isSubmitting ? 'Processing...' : 'Reject Request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TeamRequestsFormManage;
