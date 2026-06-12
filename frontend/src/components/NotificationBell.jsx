import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2, MessageSquare, Info, X, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const prevNotificationsRef = useRef([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('interactions/notifications/');
      const newNotifications = res.data.results || res.data;
      
      // Calculate unread
      const unread = newNotifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);

      // Check for new notifications to show toast
      if (prevNotificationsRef.current.length > 0) {
        const latestNew = newNotifications.filter(n => 
          !prevNotificationsRef.current.find(prev => prev.id === n.id)
        );
        
        latestNew.forEach(n => {
          toast.custom((t) => (
            <div className={`${t.visible ? 'animate-scale-in' : 'animate-fade-out'} max-w-md w-full bg-white shadow-premium rounded-[24px] pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 border-brand-primary`}>
              <div className="flex-1 w-0 p-6">
                <div className="flex items-start">
                  <div className="shrink-0 pt-0.5">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-brand-primary" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-black text-brand-secondary uppercase tracking-widest">
                      {n.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 font-medium italic leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-100">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-bold text-gray-400 hover:text-brand-secondary focus:outline-none"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ), { duration: 5000 });
        });
      }

      setNotifications(newNotifications);
      prevNotificationsRef.current = newNotifications;
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Polling for "real-time" feel without WebSockets for now
    const interval = setInterval(fetchNotifications, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.post('interactions/notifications/mark_all_as_read/');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-brand-primary transition-colors focus:outline-none"
      >
        <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-primary text-[10px] font-black text-white items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute -right-4 sm:right-0 mt-4 w-[320px] sm:w-96 bg-white rounded-[32px] shadow-2xl border border-gray-50 z-50 overflow-hidden animate-scale-in origin-top-right">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-2">
                <h3 className="text-xs font-black text-brand-secondary tracking-widest uppercase">Intel Stream</h3>
                {unreadCount > 0 && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></div>}
            </div>
            <button 
              onClick={markAllAsRead}
              className="text-[10px] font-black text-brand-primary hover:text-orange-700 transition-colors uppercase tracking-tighter"
            >
              Archive All
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-16 text-center">
                <Info className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                <p className="text-gray-400 font-medium italic text-sm">Quiet for now.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map(n => (
                  <div key={n.id} className={`p-6 hover:bg-gray-50 transition-colors relative ${!n.is_read ? 'bg-orange-50/30' : ''}`}>
                    {!n.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary"></div>}
                    <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center ${n.title.includes('Visit') ? 'bg-blue-50 text-blue-500' : 'bg-brand-primary/10 text-brand-primary'}`}>
                            {n.title.includes('Visit') ? <Calendar size={18} /> : <MessageSquare size={18} />}
                        </div>
                        <div>
                            <p className="text-xs font-black text-brand-secondary uppercase tracking-widest mb-1">{n.title}</p>
                            <p className="text-sm text-gray-500 font-medium italic leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-gray-300 font-bold mt-3 uppercase tracking-tighter">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-50 text-center">
             <p className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase">Relasto Security Protocol Active</p>
          </div>
        </div>
      )}
    </div>
  );
}
