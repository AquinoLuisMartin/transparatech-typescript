import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

interface Options {
  endpoint?: string;
  intervalMs?: number;
  enabled?: boolean;
}

// Polls a server endpoint for the latest notification and shows popups when a new one appears.
export default function useNotificationsPoll({ endpoint = '/api/v1/notifications/latest', intervalMs = 15000, enabled = true }: Options = {}) {
  const { showNotification } = useNotification();
  const lastId = useRef<number | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const fetchLatest = async () => {
      try {
        const res = await axios.get(endpoint);
        // Expecting either { id, title, message, type } or { latest: { ... } }
        const payload = res.data && (res.data.latest || res.data);
        if (!payload) return;

        const id = payload.id || null;
        const title = payload.title || null;
        const message = payload.message || payload.text || payload.body || payload.msg || null;
        const type = (payload.type as 'info' | 'success' | 'error' | 'warning') || 'info';

        if (id && lastId.current !== id) {
          // new notification
          lastId.current = id;
          // Show title + message if available
          const text = title ? `${title}: ${message || ''}`.trim() : (message || 'You have a new notification');
          if (isMounted.current && !cancelled) showNotification(text, type, 6000);
        }
      } catch {
        // ignore errors - endpoint may not exist in demo
      }
    };

    // initial fetch
    fetchLatest();
    const id = window.setInterval(fetchLatest, intervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [endpoint, intervalMs, enabled, showNotification]);
}
