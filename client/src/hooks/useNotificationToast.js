import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getNotificationStreamUrl } from '@/lib/api';

const TYPE_ICON = {
  incident: '🚨',
  service: '🖥️',
  workspace: '👥',
};

/**
 * Global hook — mount ONCE in AppLayout.
 * Opens an SSE stream and fires a toast for every incoming notification.
 * The toast shows the notification title + message and auto-dismisses after 6s.
 */
export function useNotificationToast() {
  // Keep the SSE ref so we can close it on unmount
  const sseRef = useRef(null);

  useEffect(() => {
    let sse;

    const connect = () => {
      try {
        sse = new EventSource(getNotificationStreamUrl(), {
          withCredentials: true,
        });

        sse.addEventListener('notification', (e) => {
          try {
            const notif = JSON.parse(e.data);
            const icon = TYPE_ICON[notif.type] ?? '🔔';

            toast(notif.title, {
              description: notif.message,
              icon,
              duration: 6000,
              action: notif.link
                ? {
                    label: 'View',
                    onClick: () => {
                      window.location.href = `/app${notif.link}`;
                    },
                  }
                : undefined,
            });
          } catch {
            /* ignore malformed events */
          }
        });

        sse.onerror = () => {
          // Browser will auto-retry; no need to handle manually
        };

        sseRef.current = sse;
      } catch {
        /* SSE not supported — graceful fallback */
      }
    };

    connect();

    return () => {
      sseRef.current?.close();
    };
  }, []);
}
