import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFlag } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

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

const ReportModal = ({
  currentUserId,
  reportedUserId,
  contentType,
  contentId,
}) => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reason, setReason] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleReport = async () => {
    if (!currentUserId) {
      navigate('/sign-in');
      return;
    }

    try {
      const res = await fetch('/api/admin/add-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedBy: currentUserId,
          reportedUser: reportedUserId,
          contentType,
          contentId,
          reason,
          description: reportReason,
        }),
      });

      if (res.ok) {
        toast({
          title: 'Report Submitted',
          description: 'Thank you for helping us maintain a safe community.',
        });
        setIsReportDialogOpen(false);
        setReportReason('');
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <button onClick={() => setIsReportDialogOpen(true)}>
        <FaFlag className='text-gray-500 w-4 h-4' />
      </button>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report {contentType}</DialogTitle>
            <DialogDescription>
              Help us understand why you are reporting this {contentType}
            </DialogDescription>
          </DialogHeader>
          <Select onValueChange={setReason} value={reason}>
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
          <Textarea
            placeholder={`Please provide details about why you are reporting this ${contentType}`}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className='mt-4'
          />
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsReportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReport}
              disabled={!reportReason.trim()}
              className='bg-primary-500 hover:bg-purple-500'
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportModal;
