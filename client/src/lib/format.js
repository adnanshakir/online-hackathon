import { formatDistanceToNow, format, intervalToDuration } from 'date-fns';

export function timeAgo(date) {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(date, pattern = 'MMM d, yyyy') {
  if (!date) return '';
  return format(new Date(date), pattern);
}

export function formatDateTime(date) {
  if (!date) return '';
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
}

export function durationBetween(start, end = new Date()) {
  if (!start) return '';
  const dur = intervalToDuration({ start: new Date(start), end: new Date(end) });
  const parts = [];
  if (dur.days) parts.push(`${dur.days}d`);
  if (dur.hours) parts.push(`${dur.hours}h`);
  if (dur.minutes) parts.push(`${dur.minutes}m`);
  if (!parts.length) parts.push(`${dur.seconds || 0}s`);
  return parts.slice(0, 2).join(' ');
}

export function uptimePercent(value, decimals = 2) {
  return `${Number(value).toFixed(decimals)}%`;
}
