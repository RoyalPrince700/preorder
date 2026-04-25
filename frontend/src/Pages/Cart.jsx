import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import Context from '../context';
import displayNARCurrency from '../helpers/displayCurrency';
import { MdDelete } from 'react-icons/md';

const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const context = useContext(Context); // data of cart is coming from here
    const loadingCart = new Array(context.cartProductCount).fill(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
        });

        const responseData = await response.json();

        if (responseData.success) {
            setData(responseData.data);
        }
    };

    const handleLoading = async () => {
        await fetchData();
    };

    useEffect(() => {
        setLoading(true);
        handleLoading();
        setLoading(false);
    }, []);

    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                _id: id, // Send the product's _id
                quantity: qty + 1, // Increase the quantity
            }),
        });

        const responseData = await response.json();
        if (responseData.success) {
            fetchData();
        }
    };

    const decreaseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    _id: id, // Send the product's _id
                    quantity: qty - 1, // Decrease the quantity
                }),
            });

            const responseData = await response.json();
            if (responseData.success) {
                fetchData();
            }
        }
    };

    const deleteCartProduct = async (id) => {
        try {
            const response = await fetch(SummaryApi.deleteCartProduct.url, {
                method: SummaryApi.deleteCartProduct.method,
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    _id: id, // Send the product's _id
                }),
            });

            const responseData = await response.json();
            if (responseData.success) {
                fetchData();
                context.fetchUserAddToCart();
            }
        } catch (error) {
            console.error('Error deleting product from cart:', error);
        }
    };

    const totalQty = data.reduce(
        (previousValue, currentValue) => previousValue + currentValue.quantity,
        0
    );
    const totalPrice = data.reduce(
        (prev, curr) => prev + curr.quantity * curr?.productId?.sellingPrice,
        0
    );
    
    const handleCheckout = () => {
        if (data.length > 0) {
            navigate('/checkout', {
                state: {
                    cartItems: data,
                    totalPrice: totalPrice,
                },
            });
        } else {
            alert('No items in the cart. Please add items to proceed.');
        }
    };
    

    return (
        <div className="container mx-auto mt-4 px-4 pt-20 max-w-7xl">
        <div className="mb-8 border-b-2 border-slate-100 pb-8 px-0">
          <span className="inline-flex items-center rounded-none bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white">Cart</span>
          <h1 className="mt-6 text-3xl font-black uppercase tracking-tighter text-slate-950 sm:text-5xl leading-none">Preorder Basket</h1>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
            Review your drops, update quantities, and continue to checkout.
          </p>
        </div>
      
        <div className="text-center text-lg">
          {data.length === 0 && !loading && (
            <div className="border-2 border-dashed border-slate-100 py-20">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Your basket is empty</p>
            </div>
          )}
        </div>
      
        <div className="flex flex-col lg:flex-row gap-12 lg:justify-between">
          {/* Cart Items */}
          <div className="w-full max-w-3xl">
            {loading
              ? loadingCart.map((_, index) => (
                  <div
                    key={index}
                    className="w-full bg-white border-2 border-slate-100 h-32 my-4 animate-pulse"
                  ></div>
                ))
              : data.map((product) => (
                  <div
                    key={product?._id}
                    className="relative my-6 grid w-full grid-cols-[140px,1fr] p-4 border-2 border-slate-100 bg-white group hover:border-orange-500 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="h-[140px] w-full bg-white flex items-center justify-center p-2">
                      <img
                        src={product?.productId?.productImage[0]}
                        alt={product?.productId?.productName}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
      
                    {/* Product Details */}
                    <div className="px-6 flex flex-col justify-between py-1">
                      <div>
                        <h2 className="line-clamp-2 text-xs font-black uppercase tracking-widest text-slate-950 leading-tight">
                          {product?.productId?.productName}
                        </h2>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-orange-600">
                          {product?.productId?.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border-2 border-slate-900 bg-white">
                            <button
                              className="flex h-8 w-8 items-center justify-center text-xs font-black text-slate-950 transition hover:bg-slate-950 hover:text-white"
                              onClick={() => decreaseQty(product?._id, product?.quantity)}
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-black text-slate-950">{product?.quantity}</span>
                            <button
                              className="flex h-8 w-8 items-center justify-center text-xs font-black text-slate-950 transition hover:bg-slate-950 hover:text-white"
                              onClick={() => increaseQty(product?._id, product?.quantity)}
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="h-8 w-px bg-slate-100"></div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Unit</p>
                            <p className="text-sm font-black text-slate-950">
                              {displayNARCurrency(product?.productId?.sellingPrice)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subtotal</p>
                          <p className="text-base font-black tracking-tighter text-orange-600">
                            {displayNARCurrency(
                              product?.productId?.sellingPrice * product?.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
      
                    {/* Delete Button */}
                    <button
                      className="absolute -top-3 -right-3 h-8 w-8 bg-slate-950 text-white flex items-center justify-center transition hover:bg-red-600"
                      onClick={() => deleteCartProduct(product?._id)}
                      aria-label="Remove item"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                ))}
          </div>
      
          {/* Cart Summary */}
          {data[0] && (
            <div className="mt-8 w-full max-w-sm lg:mt-6">
              {loading ? (
                <div className="h-48 bg-white border-2 border-slate-100 animate-pulse"></div>
              ) : (
                <div className="border-2 border-slate-900 p-8 lg:sticky lg:top-28 bg-white">
                  <h2 className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-slate-950 border-b-2 border-slate-950 pb-2">Order Summary</h2>
                  <div className="mb-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <p>Total Items</p>
                    <p>{totalQty}</p>
                  </div>
                  <div className="mb-8 flex items-center justify-between text-slate-950 border-t border-slate-100 pt-4">
                    <p className="text-xs font-black uppercase tracking-widest">Grand Total</p>
                    <p className="text-2xl font-black tracking-tighter text-orange-600">{displayNARCurrency(totalPrice)}</p>
                  </div>
                  <button
                    className="w-full bg-slate-950 py-5 text-sm font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-orange-600 shadow-[0_12px_28px_rgba(15,23,42,0.1)]"
                    onClick={handleCheckout}
                  >
                    PROCEED TO CHECKOUT
                  </button>
                  <p className="mt-4 text-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Tax and shipping calculated at next step
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      
    );
};

export default Cart;
