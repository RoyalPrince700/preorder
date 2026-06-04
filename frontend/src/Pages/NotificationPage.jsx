import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import SummaryApi from '../common';
import NotificationItem from '../components/NotificationItem';
import Context from '../context';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user?.user);
  const { authReady } = useContext(Context);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.getNotification.url, {
        method: SummaryApi.getNotification.method,
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        setNotifications(result.notifications || []);
        window.dispatchEvent(new Event('preorderNotificationsChange'));
      } else {
        toast.error(result.message || 'Failed to load notifications.');
      }
    } catch {
      toast.error('An error occurred while fetching notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      navigate('/login', { replace: true, state: { from: '/notifications' } });
      return;
    }
    fetchNotifications();
  }, [user, authReady, navigate]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="container mx-auto mt-4 max-w-3xl px-4 pt-20 pb-16">
      <div className="mb-8 border-b-2 border-slate-100 pb-8">
        <span className="inline-flex items-center rounded-none bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white">
          Inbox
        </span>
        <h1 className="mt-6 text-3xl font-black uppercase tracking-tighter text-slate-950 sm:text-4xl leading-none">
          Notifications
        </h1>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          Order updates appear here after our team confirms your order.
        </p>
        {unreadCount > 0 && (
          <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-orange-600">
            {unreadCount} unread
          </p>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-24 animate-pulse border-2 border-slate-100 bg-white"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="border-2 border-dashed border-slate-100 py-24 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            No notifications yet
          </p>
          <p className="mt-3 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            You will be notified when an admin confirms your order.
          </p>
          <Link
            to="/order"
            className="mt-8 inline-block border-2 border-slate-900 bg-slate-950 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-orange-600"
          >
            View orders
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem key={notification._id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
