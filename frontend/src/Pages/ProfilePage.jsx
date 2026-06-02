import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import { FaRegCircleUser } from 'react-icons/fa6';
import {
  FiSettings,
  FiShoppingBag,
  FiBell,
  FiShoppingCart,
  FiHelpCircle,
  FiShield,
  FiLogOut,
  FiUser,
  FiMapPin,
  FiMaximize2,
} from 'react-icons/fi';
import SummaryApi from '../common';
import Context from '../context';
import MeasurementDisplay from '../components/MeasurementDisplay';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';

const inputClass =
  'block w-full rounded-none border-2 border-slate-100 bg-slate-50 p-4 text-xs font-bold uppercase tracking-widest text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-500';

const navItems = [
  { id: 'overview', label: 'Profile', icon: FiUser },
  { id: 'measurements', label: 'My Sizes', icon: FiMaximize2 },
  { id: 'settings', label: 'Settings', icon: FiSettings },
  { id: 'account', label: 'Account', icon: FiShield },
];

const quickLinks = [
  { label: 'My Sizes', to: '/profile?tab=sizes', icon: FiMaximize2 },
  { label: 'My Orders', to: '/order', icon: FiShoppingBag },
  { label: 'Notifications', to: '/notifications', icon: FiBell },
  { label: 'Cart', to: '/cart', icon: FiShoppingCart },
  { label: 'FAQs', to: '/faq', icon: FiHelpCircle },
  { label: 'Privacy Policy', to: '/privacy', icon: FiShield },
];

const ProfilePage = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetchUserDetails, authReady } = useContext(Context);
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('overview');
  const [saving, setSaving] = useState(false);
  const [measurements, setMeasurements] = useState(null);
  const [measurementsLoading, setMeasurementsLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    location: '',
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'measurements' || tab === 'sizes') {
      setActiveSection('measurements');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      navigate('/login', { replace: true, state: { from: '/profile' } });
      return;
    }
    setForm({
      fullName: user.fullName || '',
      location: user.location && user.location !== 'Not Specified' ? user.location : '',
    });
  }, [user, authReady, navigate]);

  useEffect(() => {
    if (!authReady || !user || activeSection !== 'measurements') return;

    const fetchMeasurements = async () => {
      setMeasurementsLoading(true);
      try {
        const res = await fetch(SummaryApi.getUserMeasurements.url, {
          method: SummaryApi.getUserMeasurements.method,
          credentials: 'include',
        });
        const result = await res.json();
        setMeasurements(result.success ? result.data : null);
      } catch {
        setMeasurements(null);
      } finally {
        setMeasurementsLoading(false);
      }
    };

    fetchMeasurements();
  }, [user, authReady, activeSection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(SummaryApi.updateProfile.url, {
        method: SummaryApi.updateProfile.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          location: form.location,
        }),
      });
      const result = await response.json();
      if (result.success) {
        dispatch(setUserDetails(result.data));
        toast.success(result.message || 'Profile updated');
        fetchUserDetails?.();
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch {
      toast.error('Could not update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: 'include',
      });
      const data = await fetchData.json();
      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        navigate('/');
      } else if (data.error) {
        toast.error(data.message);
      }
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  if (!authReady) {
    return (
      <div className="page-shell flex min-h-[50vh] items-center justify-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
          Loading your profile…
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const roleLabel = user.role === ROLE.GENERAL ? 'Member' : user.role?.replace(/_/g, ' ');

  return (
    <div className="page-shell">
      <div className="mb-12 border-b-2 border-slate-100 pb-8">
        <span className="inline-flex items-center rounded-none bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-black">
          Account
        </span>
        <h1 className="mt-6 text-3xl font-black uppercase tracking-tighter text-slate-950 sm:text-5xl leading-none">
          My Profile
        </h1>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          Manage your account, preferences, and quick links.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="border-2 border-slate-900 bg-white p-4 lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 px-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-xs font-black uppercase tracking-widest transition-colors ${
                    isActive
                      ? 'bg-slate-950 text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-orange-600'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <hr className="my-4 border-slate-100" />
          <div className="space-y-1">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 transition hover:text-orange-600"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0 space-y-8">
          {activeSection === 'overview' && (
            <section className="border-2 border-slate-900 bg-white overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
              <div className="bg-slate-950 p-8 sm:p-10">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName || 'Profile'}
                      className="h-24 w-24 border-2 border-white object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center border-2 border-white bg-white/10 text-white">
                      <FaRegCircleUser className="h-12 w-12" />
                    </div>
                  )}
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                      {user.fullName || 'Wifmart User'}
                    </h2>
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                      {user.email}
                    </p>
                    <span className="mt-4 inline-block border border-orange-500/50 bg-orange-600/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-400">
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid gap-0 sm:grid-cols-2">
                <div className="border-b-2 border-slate-50 p-8 sm:border-b-0 sm:border-r-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Member since
                  </p>
                  <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-950">
                    {user.createdAt ? moment(user.createdAt).format('MMMM YYYY') : '—'}
                  </p>
                </div>
                <div className="p-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Location
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-950">
                    <FiMapPin className="text-orange-600" />
                    {user.location && user.location !== 'Not Specified' ? user.location : 'Not set'}
                  </p>
                </div>
                <div className="border-t-2 border-slate-50 p-8 sm:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Account status
                  </p>
                  <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-950">
                    {user.status || 'Active'}
                    {user.isVerified && (
                      <span className="ml-3 text-green-600">· Verified</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="border-t-2 border-slate-50 bg-slate-50 p-6 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setActiveSection('settings')}
                  className="bg-slate-950 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-orange-600"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('measurements')}
                  className="border-2 border-orange-600 bg-orange-600 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-orange-700"
                >
                  My sizes
                </button>
                <Link
                  to="/order"
                  className="border-2 border-slate-900 bg-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 transition hover:border-orange-600 hover:text-orange-600"
                >
                  View orders
                </Link>
              </div>
            </section>
          )}

          {activeSection === 'measurements' && (
            <section className="border-2 border-slate-900 bg-white p-8 sm:p-10 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-950">
                My Sizes
              </h2>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                Suit, trouser, native attire, shirt, and shoe measurements saved by our team.
              </p>
              <p className="mt-2 text-[10px] font-bold text-slate-400 normal-case tracking-normal">
                Copy any section to share with your tailor or when ordering custom wear.
              </p>
              <div className="mt-8">
                {measurementsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-24 animate-pulse border-2 border-slate-100 bg-slate-50"
                      />
                    ))}
                  </div>
                ) : (
                  <MeasurementDisplay measurements={measurements} />
                )}
              </div>
            </section>
          )}

          {activeSection === 'settings' && (
            <section className="border-2 border-slate-900 bg-white p-8 sm:p-10 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-950">
                Settings
              </h2>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                Update your display name and delivery location.
              </p>
              <form onSubmit={handleSaveSettings} className="mt-8 space-y-6 max-w-lg">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Location / City
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Lagos, Nigeria"
                    className={inputClass}
                  />
                </div>
                <div className="rounded-none border-2 border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Email
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-600">
                    {user.email}
                  </p>
                  <p className="mt-2 text-[10px] font-bold text-slate-400 normal-case tracking-normal">
                    Email is managed through your sign-in provider and cannot be changed here.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-slate-950 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-orange-600 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </form>
            </section>
          )}

          {activeSection === 'account' && (
            <section className="space-y-6">
              <div className="border-2 border-slate-900 bg-white p-8 sm:p-10">
                <h2 className="text-xl font-black uppercase tracking-widest text-slate-950">
                  Account
                </h2>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Orders, security, and policies.
                </p>
                <ul className="mt-8 divide-y-2 divide-slate-50">
                  {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="flex items-center justify-between py-4 text-xs font-black uppercase tracking-widest text-slate-950 transition hover:text-orange-600"
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-orange-600" />
                            {link.label}
                          </span>
                          <span className="text-slate-300">→</span>
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link
                      to="/terms"
                      className="flex items-center justify-between py-4 text-xs font-black uppercase tracking-widest text-slate-950 transition hover:text-orange-600"
                    >
                      <span>Terms of service</span>
                      <span className="text-slate-300">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/forgot-password"
                      className="flex items-center justify-between py-4 text-xs font-black uppercase tracking-widest text-slate-950 transition hover:text-orange-600"
                    >
                      <span>Password & recovery</span>
                      <span className="text-slate-300">→</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="border-2 border-red-200 bg-red-50/50 p-8 sm:p-10">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-950">
                  Sign out
                </h3>
                <p className="mt-2 text-xs font-bold text-slate-500 normal-case tracking-normal">
                  End your session on this device.
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-6 flex items-center gap-2 border-2 border-slate-900 bg-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 transition hover:border-red-600 hover:text-red-600"
                >
                  <FiLogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
              {user.role === ROLE.ADMIN && (
                <div className="border-2 border-slate-900 bg-slate-950 p-8 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
                    Admin
                  </p>
                  <Link
                    to="/admin-overview/overview"
                    className="mt-4 inline-block text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4 hover:text-orange-400"
                  >
                    Open admin panel →
                  </Link>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
