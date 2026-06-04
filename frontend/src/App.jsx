import './app.css';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, useCallback, useMemo } from 'react';
import SummaryApi from './common';
import Context from './context';
import { SocketProvider } from './context/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import ScrollToTop from './components/ScrollTop';
import { matchPath } from 'react-router-dom';
import { getLocalCartItemCount } from './helpers/localAddToCart';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state?.user?.user);
  const userId = user?._id;
  const [cartProductCount, setCartProductCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [authReady, setAuthReady] = useState(false);

  const shouldHideHeaderFooter = location.pathname.startsWith('/admin-overview') ||
    ['/login', '/sign-up', '/token-verification', '/forgot-password', '/verify-email'].includes(location.pathname) ||
    location.pathname.startsWith('/reset-password/');

  

  // Fetch user details
  const fetchUserDetails = useCallback(async () => {
    if (!SummaryApi.isBackendConfigured) {
      setAuthReady(true);
      return;
    }
    try {
      const dataResponse = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include',
      });

      const dataApi = await dataResponse.json();
      if (dataApi.success) {
        dispatch(setUserDetails(dataApi.data));
      } else {
        dispatch(setUserDetails(null));
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error.message);
      dispatch(setUserDetails(null));
    } finally {
      setAuthReady(true);
    }
  }, [dispatch]);

  // Fetch cart product count
  const fetchUserAddToCart = useCallback(async ({ forceServer = false } = {}) => {
    if (!SummaryApi.isBackendConfigured || (!userId && !forceServer)) {
      setCartProductCount(getLocalCartItemCount());
      return;
    }
    try {
      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: 'include',
      });

      const dataApi = await dataResponse.json();
      setCartProductCount(dataApi?.success ? dataApi?.data?.count : getLocalCartItemCount());
    } catch (error) {
      console.error('Failed to fetch cart product count:', error.message);
      setCartProductCount(getLocalCartItemCount());
    }
  }, [userId]);

  const fetchUnreadNotificationCount = useCallback(async () => {
    if (!SummaryApi.isBackendConfigured || !userId) {
      setUnreadNotificationCount(0);
      return;
    }
    try {
      const dataResponse = await fetch(SummaryApi.notificationUnreadCount.url, {
        method: SummaryApi.notificationUnreadCount.method,
        credentials: 'include',
      });
      const dataApi = await dataResponse.json();
      setUnreadNotificationCount(dataApi?.success ? dataApi.count : 0);
    } catch (error) {
      console.error('Failed to fetch notification count:', error.message);
      setUnreadNotificationCount(0);
    }
  }, [userId]);

  // Fetch auth once on app load. Keep this separate from cart count to avoid
  // refetching the user every time the cart callback changes after login.
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  useEffect(() => {
    if (authReady) {
      fetchUserAddToCart();
      fetchUnreadNotificationCount();
    }
  }, [authReady, fetchUserAddToCart, fetchUnreadNotificationCount]);

  useEffect(() => {
    const handleNotificationsChange = () => {
      fetchUnreadNotificationCount();
    };
    window.addEventListener('preorderNotificationsChange', handleNotificationsChange);
    return () =>
      window.removeEventListener('preorderNotificationsChange', handleNotificationsChange);
  }, [fetchUnreadNotificationCount]);

  useEffect(() => {
    const handleLocalCartChange = () => {
      if (!userId) {
        setCartProductCount(getLocalCartItemCount());
      }
    };

    window.addEventListener('preorderLocalCartChange', handleLocalCartChange);
    return () => window.removeEventListener('preorderLocalCartChange', handleLocalCartChange);
  }, [userId]);

  const signInWithGoogle = useCallback((returnTo) => {
    const backendBase = import.meta.env.VITE_APP_BACKEND_URI;
    if (!backendBase) {
      console.error(
        '[Auth] Missing VITE_APP_BACKEND_URI. Cannot start Google sign-in without the backend base URL.'
      );
      return;
    }
    if (returnTo) {
      sessionStorage.setItem('authReturnTo', returnTo);
    }
    window.location.href = `${backendBase.replace(/\/$/, '')}/api/auth/google`;
  }, []);

  const contextValue = useMemo(
    () => ({
      fetchUserDetails,
      authReady,
      cartProductCount,
      fetchUserAddToCart,
      unreadNotificationCount,
      fetchUnreadNotificationCount,
      signInWithGoogle,
    }),
    [
      authReady,
      fetchUserDetails,
      cartProductCount,
      fetchUserAddToCart,
      unreadNotificationCount,
      fetchUnreadNotificationCount,
      signInWithGoogle,
    ]
  );

  return (
    <>
      <ScrollToTop />

      <SocketProvider>
        <Context.Provider value={contextValue}>
          <ToastContainer
            position="top-center"
            autoClose={1000}
            limit={1}
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
            newestOnTop={true}
          />

          {!shouldHideHeaderFooter && <Header />}
          <main className={`min-h-[calc(100vh-120px)] pt-0`}>
            <Outlet />
          </main>
          {!shouldHideHeaderFooter && <Footer />}
        </Context.Provider>
      </SocketProvider>
    </>
  );
}

export default App;
