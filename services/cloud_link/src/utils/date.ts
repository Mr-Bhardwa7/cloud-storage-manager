import { format, isToday, isYesterday } from 'date-fns';

export const formatLastActive = (dateStr: string | undefined): string => {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  
  let prefix = format(date, 'MMMM d');
  if (isToday(date)) {
    prefix = 'Today';
  } else if (isYesterday(date)) {
    prefix = 'Yesterday';
  }
  
  return `${prefix} at ${format(date, 'h:mm a')}`;
};