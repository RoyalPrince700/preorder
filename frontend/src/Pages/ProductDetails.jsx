import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import displayNARCurrency from '../helpers/displayCurrency';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import { getLocalProductById } from '../data/localProducts';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: '',
    brandName: '',
    category: '',
    subCategory: '',
    productImage: [],
    description: '',
    price: '',
    sellingPrice: '',
  });

  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [zoomImage, setZoomImage] = useState(false);
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });

  const { fetchUserAddToCart } = useContext(Context);
  const params = useParams();
  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    setLoading(true);
    // Backend version kept here for easy reactivation later.
    // const response = await fetch(SummaryApi.productDetails.url, {
    //   method: SummaryApi.productDetails.method,
    //   headers: { 'content-type': 'application/json' },
    //   body: JSON.stringify({ productId: params?.id }),
    // });
    // const dataResponse = await response.json();
    // setData(dataResponse?.data);
    // setActiveImage(dataResponse?.data.productImage[0]);

    const localProduct = getLocalProductById(params?.id);
    setData(localProduct || {});
    setActiveImage(localProduct?.productImage?.[0] || '');
    setLoading(false);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]); // Re-fetch data when the product ID changes

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate('/cart');
  };

  const handleNavigateToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
      <div className="mx-auto mt-20 px-3 sm:px-6 lg:mt-24 lg:px-8 max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Product Image Section */}
          <div className="flex flex-col gap-4 lg:w-1/2">
            <div className="h-[400px] w-full border-2 border-slate-100 bg-white relative overflow-hidden sm:h-[500px] lg:h-[600px]">
              <img
                src={activeImage}
                alt={data?.productName}
                className="h-full w-full object-contain p-6 transition-transform duration-500 hover:scale-110"
              />
              
              {/* Hot Badge Style matching Hero */}
              <div className="absolute left-4 top-4 z-10 bg-red-600 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-white">
                NEW DROP
              </div>
            </div>

            {/* Thumbnails - Sharp Corners */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {data?.productImage?.map((imageURL) => (
                <button
                  key={imageURL}
                  onClick={() => setActiveImage(imageURL)}
                  className={`h-20 w-20 shrink-0 border-2 transition-colors ${
                    activeImage === imageURL ? 'border-orange-500' : 'border-slate-100'
                  } bg-white p-2`}
                >
                  <img src={imageURL} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col lg:w-1/2">
            <div className="border-b border-slate-100 pb-6">
              <span className="inline-flex items-center rounded-none bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                {data?.brandName || 'PREORDIFY EXCLUSIVE'}
              </span>
              <h1 className="mt-4 text-3xl font-black uppercase tracking-tighter text-slate-950 sm:text-4xl lg:text-5xl leading-none">
                {data?.productName}
              </h1>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm font-black text-slate-950">
                  <div className="flex items-center text-orange-500">
                    <FaStar className="h-4 w-4" />
                    <FaStar className="h-4 w-4" />
                    <FaStar className="h-4 w-4" />
                    <FaStar className="h-4 w-4" />
                    <FaStarHalf className="h-4 w-4" />
                  </div>
                  <span className="ml-1 uppercase tracking-widest">4.8 RATING</span>
                </div>
                <span className="h-4 w-px bg-slate-200"></span>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{data?.category}</span>
              </div>
            </div>

            <div className="py-8">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black tracking-tighter text-orange-600">
                  {displayNARCurrency(data?.sellingPrice)}
                </span>
                {data?.price > data?.sellingPrice && (
                  <span className="text-lg font-bold text-slate-400 line-through tracking-tight">
                    {displayNARCurrency(data?.price)}
                  </span>
                )}
                <span className="rounded-none bg-red-100 px-2 py-1 text-[10px] font-black text-red-600 uppercase">
                  SAVE {Math.round(((data.price - data.sellingPrice) / data.price) * 100)}%
                </span>
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-green-600">
                ✓ FREE SHIPPING ON PREORDERS
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="flex-1 bg-slate-950 px-8 py-5 text-sm font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-orange-600"
                  onClick={(e) => handleBuyProduct(e, data?._id)}
                >
                  BUY NOW
                </button>
                <button
                  className="flex-1 border-2 border-slate-950 px-8 py-5 text-sm font-black uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-slate-950 hover:text-white"
                  onClick={(e) => handleAddToCart(e, data?._id)}
                >
                  ADD TO CART
                </button>
              </div>
            </div>

            <div className="mt-10 border-t border-slate-100 pt-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-950">Description</h3>
              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                {data.description}
              </p>
            </div>
          </div>
        </div>

      {/* Recommended SubProducts */}
      

      {/* Recommended Products */}
      {data.category && (
        <CategoryWiseProductDisplay
          category={data?.category}
          heading="Recommended Product"
          onProductClick={handleNavigateToProduct} // Pass handler for navigation
        />
      )}
    </div>
  );
};

export default ProductDetails;
