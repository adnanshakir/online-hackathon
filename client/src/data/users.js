/**
 * Mock team data. Avatars use DiceBear notionists for a clean illustrated SaaS look.
 */

const avatar = (seed) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=8b5cf6,3b82f6,a78bfa,60a5fa&backgroundType=gradientLinear&radius=50`;

export const USERS = [
  {
    id: 'u_priya',
    name: 'Priya Patel',
    email: 'priya@sentinel.dev',
    role: 'On-call Lead',
    department: 'SRE',
    avatar: avatar('Priya Patel'),
    online: true,
  },
  {
    id: 'u_alex',
    name: 'Alex Chen',
    email: 'alex@sentinel.dev',
    role: 'Backend Engineer',
    department: 'Platform',
    avatar: avatar('Alex Chen'),
    online: true,
  },
  {
    id: 'u_maya',
    name: 'Maya Rodriguez',
    email: 'maya@sentinel.dev',
    role: 'Site Reliability',
    department: 'SRE',
    avatar: avatar('Maya Rodriguez'),
    online: true,
  },
  {
    id: 'u_jordan',
    name: 'Jordan Kim',
    email: 'jordan@sentinel.dev',
    role: 'Platform Engineer',
    department: 'Platform',
    avatar: avatar('Jordan Kim'),
    online: false,
  },
  {
    id: 'u_sam',
    name: 'Sam Okafor',
    email: 'sam@sentinel.dev',
    role: 'Frontend Engineer',
    department: 'Product',
    avatar: avatar('Sam Okafor'),
    online: true,
  },
  {
    id: 'u_taylor',
    name: 'Taylor Nguyen',
    email: 'taylor@sentinel.dev',
    role: 'Engineering Manager',
    department: 'Leadership',
    avatar: avatar('Taylor Nguyen'),
    online: false,
  },
];

export const DEMO_USER = {
  id: 'u_demo',
  name: 'Demo User',
  email: 'demo@sentinel.dev',
  role: 'On-call',
  avatar: avatar('Demo User'),
  online: true,
  team: 'Sentinel Demo',
  teamSlug: 'sentinel-demo',
};

export function getUserById(id) {
  if (id === DEMO_USER.id) return DEMO_USER;
  return USERS.find((u) => u.id === id);
}
