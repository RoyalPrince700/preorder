import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Context from '../context';
import SummaryApi from '../common';
import { mergeLocalCartToAccount } from '../helpers/localAddToCart';

function AuthCallback() {
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    // Retrieve returnTo BEFORE any async operations to prevent StrictMode double-fire issues
    const returnTo = sessionStorage.getItem('authReturnTo') || '/';

    const handleAuth = async () => {
      if (token) {
        try {
          // Fetch user profile to get user data and update Redux store
          await fetchUserDetails();
          await mergeLocalCartToAccount(
            SummaryApi.addToCartProduct.url,
            SummaryApi.addToCartProduct.method
          );
          await fetchUserAddToCart({ forceServer: true });

          sessionStorage.removeItem('authReturnTo');
          navigate(returnTo, { replace: true });
        } catch (error) {
          console.error('Auth callback error:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleAuth();
  }, [location, fetchUserAddToCart, fetchUserDetails, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}

export default AuthCallback;

