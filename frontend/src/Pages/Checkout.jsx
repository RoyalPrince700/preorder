import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SummaryApi from '../common';
import displayNARCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import Context from '../context';

const inputClass =
  'block w-full rounded-none border-2 border-slate-100 bg-slate-50 p-4 text-xs font-bold uppercase tracking-widest text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-500';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authReady, fetchUserAddToCart } = useContext(Context);
  const user = useSelector((state) => state?.user?.user);

  const initialCartItems = location.state?.cartItems || [];
  const initialTotalPrice = location.state?.totalPrice;
  const [fallbackCartItems, setFallbackCartItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const cartItems = initialCartItems.length ? initialCartItems : fallbackCartItems;
  const totalPrice =
    typeof initialTotalPrice === 'number' && initialCartItems.length
      ? initialTotalPrice
      : fallbackCartItems.reduce(
          (prev, curr) => prev + (curr.quantity || 1) * (curr?.productId?.sellingPrice || 0),
          0
        );

  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    number: '',
    address: '',
    note: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const totalQty = cartItems.reduce(
    (sum, item) => sum + (item?.quantity || 1),
    0
  );

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      sessionStorage.setItem('authReturnTo', '/checkout');
      navigate('/login', { replace: true, state: { from: '/checkout' } });
      return;
    }

    if (initialCartItems.length || fallbackCartItems.length) return;

    const fetchCheckoutCart = async () => {
      setIsCartLoading(true);
      try {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
          method: SummaryApi.addToCartProductView.method,
          credentials: 'include',
          headers: { 'content-type': 'application/json' },
        });
        const responseData = await response.json();

        if (responseData.success) {
          setFallbackCartItems(responseData.data || []);
        }
      } catch (error) {
        console.error('Failed to load checkout cart:', error);
      } finally {
        setIsCartLoading(false);
      }
    };

    fetchCheckoutCart();
  }, [authReady, fallbackCartItems.length, initialCartItems.length, navigate, user]);

  const handleChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const validateShippingDetails = () => {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!shippingDetails.name || !shippingDetails.number || !shippingDetails.address) {
      toast.error('Name, Phone Number, and Address are required.');
      return false;
    }
    if (!phoneRegex.test(shippingDetails.number)) {
      toast.error('Invalid phone number format.');
      return false;
    }
    return true;
  };

  const handlePayOnDelivery = async () => {
    if (!validateShippingDetails()) return;

    try {
      const payload = {
        name: shippingDetails.name,
        number: shippingDetails.number,
        address: shippingDetails.address,
        note: shippingDetails.note || '',
        cartItems,
        totalPrice: totalPrice,
        paymentMethod: 'Pay on Delivery',
      };

      const response = await fetch(SummaryApi.checkout.url, {
        method: SummaryApi.checkout.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to process order');

      toast.success('Your order has been placed successfully!');
      await fetchUserAddToCart();
      navigate('/order');
    } catch (error) {
      console.error('Error during Pay on Delivery:', error);
      toast.error('Error processing your order. Please try again.');
    }
  };

  // const handleFlutterwavePayment = async () => {
  //   if (!validateShippingDetails()) return;
  //
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(SummaryApi.payment.url, {
  //       method: SummaryApi.payment.method,
  //       credentials: 'include',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         cartItems,
  //         shippingDetails,
  //       }),
  //     });
  //
  //     const data = await response.json();
  //
  //     if (data.success && data.data?.link) {
  //       window.location.href = data.data.link;
  //     } else {
  //       toast.error(data.message || 'Failed to initiate payment');
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.error('Error initiating Flutterwave payment:', error);
  //     toast.error('Error processing payment. Please try again.');
  //     setIsLoading(false);
  //   }
  // };

  const handleWhatsAppCheckout = async () => {
    if (!validateShippingDetails()) return;
    
    setIsLoading(true);
    try {
      const payload = {
        name: shippingDetails.name,
        number: shippingDetails.number,
        address: shippingDetails.address,
        note: shippingDetails.note || '',
        cartItems,
        totalPrice: totalPrice,
        paymentMethod: 'WhatsApp',
      };

      let message = `*New Order Details*\n\n`;

      message += `*Products:*\n`;
      cartItems.forEach((item, index) => {
        const product = item?.productId || {};
        const name = product?.productName || item?.name || 'Item';
        const qty = item?.quantity || 1;
        const price = product?.sellingPrice || item?.price || 0;

        const productLink = `${window.location.origin}/product/${product?._id || item?._id}`;

        message += `${index + 1}. ${name}\n   Qty: ${qty} | Price: ${displayNARCurrency(price * qty)}\n   Link: ${productLink}\n`;
      });

      message += `\n*Total Amount:* ${displayNARCurrency(totalPrice)}\n`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/2348160881705?text=${encodedMessage}`;

      const response = await fetch(SummaryApi.checkout.url, {
        method: SummaryApi.checkout.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to process order');

      toast.success('Your order has been recorded! Redirecting to WhatsApp...');
      fetchUserAddToCart().catch((error) => {
        console.error('Error refreshing cart after WhatsApp checkout:', error);
      });

      // Update the current route so that when they come back, they are on the orders page
      navigate('/order', { replace: true });

      // Redirect the current tab to WhatsApp (bypasses popup blockers)
      window.location.href = whatsappUrl;
    } catch (error) {
      console.error('Error during WhatsApp checkout:', error);
      toast.error('Error processing your order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!authReady || !user || isCartLoading) {
    return (
      <div className="container mx-auto mt-4 px-4 pt-20 max-w-7xl">
        <div className="border-2 border-slate-100 bg-white py-20 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            Loading checkout...
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto mt-4 px-4 pt-20 max-w-7xl">
        <div className="mb-8 border-b-2 border-slate-100 pb-8">
          <span className="inline-flex items-center rounded-none bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white">
            Checkout
          </span>
          <h1 className="mt-6 text-3xl font-black uppercase tracking-tighter text-slate-950 sm:text-5xl leading-none">
            Complete Order
          </h1>
        </div>
        <div className="border-2 border-dashed border-slate-100 py-20 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            No items in your basket
          </p>
          <button
            className="mt-8 bg-slate-950 px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-orange-600"
            onClick={() => navigate('/cart')}
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-4 px-4 pt-20 max-w-7xl">
      <div className="mb-8 border-b-2 border-slate-100 pb-8">
        <span className="inline-flex items-center rounded-none bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white">
          Checkout
        </span>
        <h1 className="mt-6 text-3xl font-black uppercase tracking-tighter text-slate-950 sm:text-5xl leading-none">
          Complete Order
        </h1>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          Enter shipping details and confirm your preorder drop.
        </p>
      </div>

      <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
        {/* Left: shipping + items */}
        <div className="w-full max-w-3xl space-y-10">
          <section className="border-2 border-slate-100 bg-white p-6 sm:p-8">
            <h2 className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-slate-950 border-b-2 border-slate-950 pb-2">
              Shipping Details
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={shippingDetails.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className={inputClass}
              />
              <input
                type="tel"
                name="number"
                value={shippingDetails.number}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className={inputClass}
              />
              <textarea
                name="address"
                value={shippingDetails.address}
                onChange={handleChange}
                placeholder="Complete Address"
                required
                rows={3}
                className={`${inputClass} resize-none`}
              />
              <textarea
                name="note"
                value={shippingDetails.note}
                onChange={handleChange}
                placeholder="Leave a note (optional)"
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-slate-950">
              Your Items ({cartItems.length})
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = item?.productId || {};
                const qty = item?.quantity || 1;
                const price = product?.sellingPrice || item?.price || 0;
                const name =
                  product?.productName || item?.name || 'Item';
                const image =
                  product?.productImage?.[0] || item?.image || '';

                return (
                  <div
                    key={item?._id || product?._id || name}
                    className="grid w-full grid-cols-[100px,1fr] border-2 border-slate-100 bg-white p-4 transition-colors hover:border-orange-500"
                  >
                    <div className="flex h-[100px] items-center justify-center bg-white p-2">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="h-full w-full object-contain mix-blend-multiply"
                        />
                      ) : (
                        <div className="h-full w-full bg-slate-50" />
                      )}
                    </div>
                    <div className="flex flex-col justify-between px-4 py-1">
                      <div>
                        <h3 className="line-clamp-2 text-xs font-black uppercase tracking-widest text-slate-950 leading-tight">
                          {name}
                        </h3>
                        {product?.category && (
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-orange-600">
                            {product.category}
                          </p>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Qty: {qty}
                        </p>
                        <p className="text-sm font-black tracking-tighter text-orange-600">
                          {displayNARCurrency(price * qty)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right: order summary */}
        <div className="w-full max-w-sm lg:mt-0">
          <div className="border-2 border-slate-900 bg-white p-8 lg:sticky lg:top-28">
            <h2 className="mb-6 border-b-2 border-slate-950 pb-2 text-xs font-black uppercase tracking-[0.3em] text-slate-950">
              Order Summary
            </h2>
            <div className="mb-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <p>Total Items</p>
              <p>{totalQty}</p>
            </div>
            <div className="mb-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <p>Products</p>
              <p>{cartItems.length}</p>
            </div>
            <div className="mb-8 flex items-center justify-between border-t border-slate-100 pt-4 text-slate-950">
              <p className="text-xs font-black uppercase tracking-widest">
                Grand Total
              </p>
              <p className="text-2xl font-black tracking-tighter text-orange-600">
                {displayNARCurrency(totalPrice.toFixed(2))}
              </p>
            </div>

            <button
              type="button"
              className={`w-full bg-green-600 py-5 text-sm font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-green-700 shadow-[0_12px_28px_rgba(15,23,42,0.1)] ${
                isLoading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              onClick={handleWhatsAppCheckout}
              disabled={isLoading}
            >
              Checkout via WhatsApp
            </button>

            <button
              type="button"
              className="mt-4 w-full text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-orange-600"
              onClick={() => navigate('/cart')}
            >
              ← Back to Cart
            </button>

            <p className="mt-4 text-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Complete your order on WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
