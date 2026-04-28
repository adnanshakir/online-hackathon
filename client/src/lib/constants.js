import {
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  Info,
  Activity,
  Search,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const APP_NAME = 'Sentinel';
export const APP_TAGLINE = 'Resolve incidents 10x faster.';

export const SEVERITY = {
  critical: {
    label: 'Critical',
    value: 'critical',
    color: '#ef4444',
    icon: AlertOctagon,
    className: 'bg-red-500/10 text-red-400 border-red-500/30',
    dot: 'bg-red-500',
    description: 'Service is unusable for most or all users',
  },
  high: {
    label: 'High',
    value: 'high',
    color: '#f97316',
    icon: AlertTriangle,
    className: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    dot: 'bg-orange-500',
    description: 'Major functionality impaired for many users',
  },
  medium: {
    label: 'Medium',
    value: 'medium',
    color: '#eab308',
    icon: AlertCircle,
    className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    dot: 'bg-yellow-500',
    description: 'Degraded performance affecting some users',
  },
  low: {
    label: 'Low',
    value: 'low',
    color: '#3b82f6',
    icon: Info,
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-500',
    description: 'Minor issue with little user impact',
  },
};

export const STATUS = {
  investigating: {
    label: 'Investigating',
    value: 'investigating',
    color: '#ef4444',
    icon: Search,
    className: 'bg-red-500/10 text-red-400 border-red-500/30',
    dot: 'bg-red-500',
  },
  identified: {
    label: 'Identified',
    value: 'identified',
    color: '#f97316',
    icon: AlertTriangle,
    className: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    dot: 'bg-orange-500',
  },
  monitoring: {
    label: 'Monitoring',
    value: 'monitoring',
    color: '#3b82f6',
    icon: Activity,
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-500',
  },
  resolved: {
    label: 'Resolved',
    value: 'resolved',
    color: '#10b981',
    icon: CheckCircle2,
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  operational: {
    label: 'Operational',
    value: 'operational',
    color: '#10b981',
    icon: ShieldCheck,
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
};

export const STATUS_PIPELINE = ['investigating', 'identified', 'monitoring', 'resolved'];

export const KEYBOARD_SHORTCUTS = [
  { combo: ['⌘', 'K'], description: 'Open command palette' },
  { combo: ['G', 'D'], description: 'Go to dashboard' },
  { combo: ['G', 'I'], description: 'Go to incidents' },
  { combo: ['G', 'T'], description: 'Go to team' },
  { combo: ['G', 'S'], description: 'Go to status page' },
  { combo: ['C'], description: 'Create incident' },
  { combo: ['?'], description: 'Show shortcuts' },
];
