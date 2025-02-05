import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { Input } from '../../components/ui/input';
import BackButton from '../../components/BackButton';
import { FaBan } from 'react-icons/fa';

const UserBanManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [banDuration, setBanDuration] = useState('7');
  const [banReason, setBanReason] = useState('');
  const { userId, username, reportId } = location.state || {};

  const handleBanUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: parseInt(banDuration),
          reason: banReason,
          reportId,
        }),
      });

      if (response.ok) {
        navigate('/dashboard/admin/reports');
      }
    } catch (error) {
      console.error('Failed to ban user:', error);
    }
  };

  return (
    <>
      <BackButton />
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>User Management - {username}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Ban Duration (days)
              </label>
              <Select value={banDuration} onValueChange={setBanDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1'>1 day</SelectItem>
                  <SelectItem value='3'>3 days</SelectItem>
                  <SelectItem value='7'>7 days</SelectItem>
                  <SelectItem value='14'>14 days</SelectItem>
                  <SelectItem value='30'>30 days</SelectItem>
                  <SelectItem value='permanent'>Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Ban Reason</label>
            <Input
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder='Enter reason for ban...'
            />
          </div>

          <div className='flex space-x-4'>
            <Button
              variant='destructive'
              className='flex items-center gap-2'
              onClick={handleBanUser}
            >
              <FaBan />
              Ban User
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UserBanManagement;
