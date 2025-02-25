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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { TbLoader2 } from 'react-icons/tb';
import Spinner from '../../components/Spinner';
import BackButton from '../../components/BackButton';

const RoleChanges = () => {
  const [roleChanges, setRoleChanges] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedChange, setSelectedChange] = useState(null);
  const { toast } = useToast();

  const availableRoles = ['User', 'Referee', 'Coach', 'Player', 'Admin'];

  useEffect(() => {
    fetchRoleChanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updating]);

  const fetchRoleChanges = async () => {
    try {
      setLoading(true);
      const roleRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/role-changes`
      );
      const roleData = await roleRes.json();
      setRoleChanges(roleData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch role changes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    if (!selectedRole || !selectedChange) return;

    try {
      setUpdating(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/update-role/${
          selectedChange._id
        }`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newRole: selectedRole,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update role');

      toast({
        title: 'Success',
        description: `Role updated successfully for ${selectedChange.username}`,
      });

      setOpen(false);
      await fetchRoleChanges();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenChange = (open) => {
    setOpen(open);
    if (!open) {
      setSelectedRole('');
      setSelectedChange(null);
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

  const RoleChangeCard = ({ change }) => (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4'>
      <div className='space-y-3'>
        <div>
          <div className='flex flex-col'>
            <span className='font-medium'>{change?.username}</span>
            <span className='text-sm text-gray-500'>{change?.email}</span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <div>
            <p className='text-sm text-gray-500 mb-1'>Current Role</p>
            <Badge variant='outline'>{change.role ? change.role : '-'}</Badge>
          </div>
          <div>
            <p className='text-sm text-gray-500 mb-1'>Wanted Role</p>
            <Badge className='bg-primary-500 hover:bg-purple-500'>
              {change.wantedRole}
            </Badge>
          </div>
        </div>

        <div>
          <p className='text-sm text-gray-500 mb-1'>Date</p>
          <p className='text-sm'>{formatDate(change.createdAt)}</p>
        </div>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              disabled={updating}
              onClick={() => {
                setSelectedChange(change);
                setSelectedRole(change.wantedRole);
              }}
              className='w-full mt-2'
            >
              Change Role
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Update User Role</DialogTitle>
              <DialogDescription>
                Change role for {selectedChange?.username}
              </DialogDescription>
            </DialogHeader>
            <div className='my-4'>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select new role' />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                onClick={handleRoleUpdate}
                disabled={updating || !selectedRole}
                className='w-full bg-primary-500 hover:bg-purple-500'
              >
                {updating ? (
                  <>
                    <TbLoader2 className='mr-2 h-4 w-4 animate-spin' />
                    <span>Setting...</span>
                  </>
                ) : (
                  <span>Set Role</span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='max-w-8xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6'>
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle>Recent Role Changes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop View */}
          <div className='hidden md:block'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Wanted Role</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roleChanges.map((change) => (
                  <TableRow key={change._id}>
                    <TableCell className='font-medium'>
                      <div className='flex flex-col'>
                        <span>{change?.username}</span>
                        <span className='text-sm text-gray-500'>
                          {change?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {change.role ? change.role : '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className='bg-primary-500 hover:bg-purple-500'>
                        {change.wantedRole}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(change.createdAt)}</TableCell>
                    <TableCell>
                      <Dialog open={open} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                          <Button
                            variant='outline'
                            disabled={updating}
                            onClick={() => {
                              setSelectedChange(change);
                              setSelectedRole(change.wantedRole);
                            }}
                          >
                            Change Role
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
                {roleChanges.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-center text-gray-500'
                    >
                      No role changes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View */}
          <div className='md:hidden space-y-4'>
            {roleChanges.length > 0 ? (
              roleChanges.map((change) => (
                <RoleChangeCard key={change._id} change={change} />
              ))
            ) : (
              <div className='text-center py-6 text-gray-500'>
                No role changes found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Shared Dialog Component */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription>
              Change role for {selectedChange?.username}
            </DialogDescription>
          </DialogHeader>
          <div className='my-4'>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select new role' />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              onClick={handleRoleUpdate}
              disabled={updating || !selectedRole}
              className='w-full bg-primary-500 hover:bg-purple-500'
            >
              {updating ? (
                <>
                  <TbLoader2 className='mr-2 h-4 w-4 animate-spin' />
                  <span>Setting...</span>
                </>
              ) : (
                <span>Set Role</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleChanges;
