import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import BackButton from '../../components/BackButton';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const ContentManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [deleteReason, setDeleteReason] = useState('');
  const { contentType, contentId, reportId } = location.state || {};

  const handleDeleteContent = async () => {
    try {
      const response = await fetch(`/api/admin/content/delete/${contentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reasonInfo: deleteReason,
          reportId,
          contentModel: contentType,
        }),
      });

      if (response.ok) {
        navigate('/dashboard/admin/reports');
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  return (
    <>
      <BackButton />
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Content Management - {contentType}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='bg-yellow-50 border border-yellow-200 p-4 rounded-md'>
            <div className='flex items-center gap-2 text-yellow-700 mb-2'>
              <FaExclamationTriangle />
              <span className='font-medium'>Warning</span>
            </div>
            <p className='text-yellow-600'>
              You are about to delete content. This action cannot be undone.
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Deletion Reason
            </label>
            <Textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder='Enter reason for content deletion...'
              className='h-24'
            />
          </div>

          <div className='flex space-x-4'>
            <Button
              variant='destructive'
              className='flex items-center gap-2'
              onClick={handleDeleteContent}
            >
              <FaTrash />
              Delete Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ContentManagement;
