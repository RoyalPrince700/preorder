import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import { FiArrowLeft } from 'react-icons/fi';
import SummaryApi from '../common';
import Context from '../context';

const NotificationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user?.user);
  const { authReady } = useContext(Context);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(SummaryApi.markAsRead.url, {
        method: SummaryApi.markAsRead.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });
    } catch {
      // Non-blocking
    }
  };

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      navigate('/login', { replace: true, state: { from: `/notifications/${id}` } });
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const api = SummaryApi.getNotificationById(id);
        const response = await fetch(api.url, {
          method: api.method,
          credentials: 'include',
        });
        const result = await response.json();

        if (result.success && result.notification) {
          setNotification(result.notification);
          if (!result.notification.isRead) {
            await markAsRead(result.notification._id);
            setNotification((prev) => (prev ? { ...prev, isRead: true } : prev));
            window.dispatchEvent(new Event('preorderNotificationsChange'));
          }
        } else {
          toast.error(result.message || 'Notification not found.');
          navigate('/notifications', { replace: true });
        }
      } catch {
        toast.error('Could not load notification.');
        navigate('/notifications', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, user, authReady, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto mt-4 max-w-3xl px-4 pt-20 pb-16">
        <div className="h-64 animate-pulse border-2 border-slate-100 bg-white" />
      </div>
    );
  }

  if (!notification) return null;

  const templateLabels = {
    WELCOME: 'Welcome',
    ORDER_CONFIRMED: 'Order confirmed',
    ORDER_STATUS_UPDATE: 'Status update',
    ORDER_DELIVERED: 'Delivered — thank you',
  };
  const templateHint = notification.templateKey
    ? templateLabels[notification.templateKey]
    : null;

  const shortOrderId = notification.orderId
    ? notification.orderId.toString().slice(-12).toUpperCase()
    : null;

  return (
    <div className="container mx-auto mt-4 max-w-3xl px-4 pt-20 pb-16">
      <Link
        to="/notifications"
        className="mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-orange-600"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to notifications
      </Link>

      <article className="overflow-hidden border-2 border-slate-900 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
        <div className="bg-slate-950 p-6">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
            {templateHint || notification.type}
          </span>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {moment(notification.createdAt).format('LLLL')}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm font-bold leading-relaxed text-slate-800">
            {notification.message}
          </p>

          {shortOrderId && (
            <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Order ref:{' '}
              <span className="text-slate-950">#{shortOrderId}</span>
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            {notification.orderId && (
              <Link
                to="/order"
                className="inline-block border-2 border-slate-900 bg-slate-950 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-orange-600"
              >
                View my orders
              </Link>
            )}
            <Link
              to="/notifications"
              className="inline-block border-2 border-slate-200 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 transition-colors hover:border-slate-900"
            >
              All notifications
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NotificationDetailPage;
