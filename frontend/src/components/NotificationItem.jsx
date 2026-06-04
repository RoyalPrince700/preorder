import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { FiChevronRight } from 'react-icons/fi';

const NotificationItem = ({ notification }) => {
  const { _id, type, message, isRead, createdAt } = notification;

  return (
    <Link
      to={`/notifications/${_id}`}
      className={`group block border-2 bg-white p-5 transition-colors hover:border-orange-500 ${
        isRead ? 'border-slate-100' : 'border-slate-900'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
              {type}
            </h2>
            {!isRead && (
              <span className="bg-orange-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
                New
              </span>
            )}
          </div>
          <p className="mt-2 line-clamp-2 text-xs font-bold text-slate-600">
            {message}
          </p>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {moment(createdAt).format('LLL')}
          </p>
        </div>
        <FiChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-orange-600" />
      </div>
    </Link>
  );
};

export default NotificationItem;
