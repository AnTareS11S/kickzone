import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getTimeAgo = (date) => {
  const diff = new Date() - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return 'Just now';
};

export const formatRemainingTime = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffInDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  const diffInHours = Math.ceil((end - now) / (1000 * 60 * 60));

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
  }
  return `${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
};
