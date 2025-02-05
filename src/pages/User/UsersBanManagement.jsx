import { useState } from 'react';
import { useSelector } from 'react-redux';
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
import BackButton from '../../components/BackButton';
import { FaBan } from 'react-icons/fa';
import { Textarea } from '../../components/ui/textarea';
import { TbLoader2 } from 'react-icons/tb';

const REPORT_REASONS = {
  Inappropriate_content: 'Inappropriate Content',
  Harassment: 'Harassment',
  Spam: 'Spam',
  Misinformation: 'Misinformation',
  Hate_speech: 'Hate Speech',
  Violence: 'Violence',
  Copyright_infringement: 'Copyright Infringement',
  Impersonation: 'Impersonation',
  Other: 'Other',
};

const UserBanManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [banDuration, setBanDuration] = useState('7');
  const [banReason, setBanReason] = useState('');
  const [banDescription, setBanDescription] = useState('');
  const { userId, username, reportId } = location.state || {};
  const { currentUser } = useSelector((state) => state.user);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!banDuration) {
      newErrors.banDuration = 'Ban duration is required';
    }

    if (!banReason) {
      newErrors.banReason = 'Ban reason must be selected';
    }

    if (!banDescription.trim()) {
      newErrors.banDescription = 'Ban description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBanUser = async () => {
    if (!validateForm()) return;
    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/ban-user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: parseInt(banDuration),
          reason: banReason,
          description: banDescription,
          reportId,
          bannedBy: currentUser._id,
        }),
      });

      if (response.ok) {
        navigate('/dashboard/admin/reports');
        setUpdating(false);
      }
    } catch (error) {
      console.error('Failed to ban user:', error);
    } finally {
      setUpdating(false);
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
              {errors.banDuration && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.banDuration}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Ban Reason</label>
            <Select onValueChange={setBanReason} value={banReason}>
              <SelectTrigger>
                <SelectValue placeholder='Select a reason' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(REPORT_REASONS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.banReason && (
              <p className='text-red-500 text-sm mt-1'>{errors.banReason}</p>
            )}
            <label className='block text-sm font-medium my-2'>
              Ban Description
            </label>
            <Textarea
              value={banDescription}
              onChange={(e) => setBanDescription(e.target.value)}
              placeholder='Enter information about why the user is being banned...'
            />{' '}
            {errors.banDescription && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.banDescription}
              </p>
            )}
          </div>

          <div className='flex space-x-4'>
            <Button
              variant='destructive'
              className='flex items-center gap-2'
              onClick={handleBanUser}
              disabled={updating}
            >
              {updating ? (
                <>
                  <TbLoader2 className='mr-2 h-4 w-4 animate-spin' />
                  <span>Banning...</span>
                </>
              ) : (
                <>
                  <FaBan />
                  <span>Ban User</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UserBanManagement;
