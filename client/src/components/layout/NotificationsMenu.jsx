import { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  Server,
  Users,
  Info,
  ArrowRight,
} from 'lucide-react';
import { motion as _motion, AnimatePresence } from 'motion/react';
const Motion = _motion;
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { timeAgo } from '@/lib/format';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationStreamUrl,
} from '@/lib/api';

/* ── Type → icon/colour mapping ── */
const TYPE_META = {
  incident: { Icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  service: { Icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  workspace: { Icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  default: {
    Icon: Info,
    color: 'text-[var(--color-muted)]',
    bg: 'bg-[var(--color-surface-elevated)]',
  },
};

function NotifIcon({ type }) {
  const meta = TYPE_META[type] ?? TYPE_META.default;
  const { Icon, color, bg } = meta;
  return (
    <div className={`grid size-8 shrink-0 place-items-center rounded-lg ${bg}`}>
      <Icon className={`h-3.5 w-3.5 ${color}`} />
    </div>
  );
}

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ── Fetch all notifications from backend ── */
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getNotifications(1, 25);
      setNotifications(res.data ?? []);
      setUnreadCount(res.unreadCount ?? 0);
    } catch (err) {
      console.error('[notifications] fetch failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── On mount: fetch + open SSE stream ── */
  useEffect(() => {
    fetchNotifications();

    // Open SSE for real-time push
    let sse;
    try {
      sse = new EventSource(getNotificationStreamUrl(), {
        withCredentials: true,
      });

      sse.addEventListener('notification', (e) => {
        try {
          const notif = JSON.parse(e.data);
          setNotifications((prev) => {
            // Avoid duplicates
            if (prev.some((n) => n._id === notif._id)) return prev;
            return [notif, ...prev].slice(0, 25);
          });
          setUnreadCount((c) => c + 1);
        } catch {
          /* ignore malformed events */
        }
      });

      sse.onerror = () => {
        // SSE errors are common on reconnect — let browser handle retry
        console.warn('[notifications] SSE error — browser will retry');
      };
    } catch (err) {
      console.warn('[notifications] SSE not supported, using polling:', err);
    }

    // Polling fallback every 30s to stay in sync
    const poll = setInterval(fetchNotifications, 30000);

    return () => {
      sse?.close();
      clearInterval(poll);
    };
  }, [fetchNotifications]);

  /* ── Mark single as read ── */
  const handleRead = useCallback(async (notif) => {
    if (notif.isRead) return;
    try {
      await markNotificationRead(notif._id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      /* silent */
    }
  }, []);

  /* ── Mark all as read ── */
  const handleMarkAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      /* silent */
    }
  }, []);

  /* ── Click a notification: mark read + navigate ── */
  const handleClick = useCallback(
    async (notif) => {
      await handleRead(notif);
      setOpen(false);
      if (notif.link) {
        navigate(`/app${notif.link}`);
      }
    },
    [handleRead, navigate]
  );

  return (
    <div className="relative">
      {/* Bell trigger */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => {
          setOpen((v) => !v);
        }}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <Motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-[var(--color-background)]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <Motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={cn(
                'z-50 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl',
                // Mobile: Centered fixed panel
                'fixed left-4 right-4 top-20 mx-auto max-w-[calc(100vw-2rem)]',
                // Desktop: Absolute dropdown from bell
                'md:absolute md:left-auto md:right-0 md:top-full md:mt-2 md:w-96 md:max-w-none'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-500/15 px-1.5 py-px text-[10px] font-bold text-red-400">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[11px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[420px] overflow-y-auto">
                {loading && notifications.length === 0 ? (
                  <div className="space-y-3 p-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3 animate-pulse">
                        <div className="size-8 rounded-lg bg-[var(--color-surface-elevated)]" />
                        <div className="flex-1 space-y-2">
                          <div className="h-2.5 w-3/4 rounded bg-[var(--color-surface-elevated)]" />
                          <div className="h-2 w-1/2 rounded bg-[var(--color-surface-elevated)]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
                    <div className="grid size-10 place-items-center rounded-full bg-[var(--color-surface-elevated)]">
                      <Bell className="h-4 w-4 text-[var(--color-muted)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">All caught up!</p>
                      <p className="mt-1 text-[11px] text-[var(--color-muted)]">
                        Notifications will appear here when there's activity.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--color-border)]/50">
                    {notifications.map((n) => (
                      <button
                        key={n._id}
                        onClick={() => handleClick(n)}
                        className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-elevated)] ${
                          !n.isRead
                            ? 'bg-[var(--color-brand-primary)]/[0.04]'
                            : ''
                        }`}
                      >
                        <NotifIcon type={n.type} />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold leading-snug">
                              {n.title}
                            </p>
                            <div className="flex shrink-0 items-center gap-1.5">
                              <span className="text-[10px] text-[var(--color-muted)] whitespace-nowrap">
                                {timeAgo(n.createdAt)}
                              </span>
                              {!n.isRead && (
                                <span className="size-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                              )}
                            </div>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-[var(--color-muted)]">
                            {n.message}
                          </p>
                        </div>

                        {/* Mark read checkmark */}
                        {!n.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRead(n);
                            }}
                            className="mt-0.5 shrink-0 text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                            title="Mark as read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-[var(--color-border)] p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-xs"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link to="/app/dashboard">
                    View all activity
                    <ArrowRight className="h-3 w-3" />
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
