import { Badge } from '../components/ui/badge';

export const getStatusBadge = (status) => {
  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Under_review: 'bg-blue-100 text-blue-800 border-blue-200',
    Resolved: 'bg-green-100 text-green-800 border-green-200',
    Dismissed: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Badge variant='outline' className={`${statusStyles[status]} px-2 py-1`}>
      {status.replace('_', ' ').toUpperCase()}
    </Badge>
  );
};
