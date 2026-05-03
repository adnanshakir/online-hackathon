import { useState, useEffect } from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import { motion as _motion, AnimatePresence } from 'motion/react';
const Motion = _motion;
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/shared/Avatar';
import { getUserById } from '@/data/users';
import { timeAgo } from '@/lib/format';
import * as api from '@/lib/api';

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const incidents = await api.listIncidents();

        // Fetch timelines for the most recent incidents
        const recentIncidents = incidents
          .sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt);
            const dateB = new Date(b.updatedAt || b.createdAt);
            return dateB - dateA;
          })
          .slice(0, 5);

        if (recentIncidents.length === 0) {
          setNotifications([]);
          return;
        }

        // Fetch each timeline individually so one failure doesn't block everything
        const results = await Promise.allSettled(
          recentIncidents.map((i) => api.getTimeline(i.id))
        );

        const flatUpdates = [];
        results.forEach((result, idx) => {
          if (result.status === 'fulfilled' && result.value) {
            const incident = recentIncidents[idx];
            result.value.forEach((u) => {
              flatUpdates.push({
                ...u,
                incidentId: incident.id,
                incidentTitle: incident.title,
              });
            });
          }
        });

        const sorted = flatUpdates
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10); // Show more notifications

        setNotifications(sorted);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };
    fetch();
    const interval = setInterval(fetch, 5000); // 5s polling for notifications
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => {
          setOpen(!open);
          setHasUnread(false);
        }}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {hasUnread && (
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-red-500 ring-2 ring-[var(--color-background)]" />
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <Motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden"
            >
              <div className="border-b border-[var(--color-border)] px-4 py-3">
                <h3 className="text-sm font-semibold">
                  Activity Notifications
                </h3>
              </div>

              <div className="max-h-[400px] overflow-y-auto py-2">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-[var(--color-muted)]">
                    No recent activity
                  </div>
                ) : (
                  notifications.map((n) => {
                    const author = n.createdBy ||
                      getUserById(n.authorId) || { name: n.authorName };
                    return (
                      <Link
                        key={n.id}
                        to={`/app/incidents/${n.incidentId}`}
                        onClick={() => setOpen(false)}
                        className="flex gap-3 px-4 py-3 transition-colors hover:bg-[var(--color-surface-elevated)]"
                      >
                        <Avatar user={author} size="sm" ring />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs">
                            <span className="font-semibold">
                              {author?.name || 'Unknown'}
                            </span>
                            <span className="text-[var(--color-muted)] ml-1">
                              {n.statusChange
                                ? `updated status to ${n.statusChange}`
                                : 'posted an update'}
                            </span>
                          </p>
                          <p className="mt-1 line-clamp-2 text-[11px] text-[var(--color-muted)] leading-relaxed">
                            "{n.message}"
                          </p>
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase truncate max-w-[120px]">
                              {n.incidentTitle}
                            </span>
                            <span className="text-[10px] text-[var(--color-muted)]">
                              {timeAgo(n.createdAt)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)]/30 p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link to="/app/dashboard">
                    View full activity feed{' '}
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Link>
                </Button>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
