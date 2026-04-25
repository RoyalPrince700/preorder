import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaBolt, FaFire, FaStar, FaTruckFast } from 'react-icons/fa6'
import { getLocalProductById } from '../data/localProducts'

const formatPrice = (price) => `NGN ${Number(price || 0).toLocaleString()}`

const getDiscount = (product) =>
  Math.max(0, Math.round(((product.price - product.sellingPrice) / product.price) * 100))

const HeroBenefits = () => (
  <div className='relative border-b border-orange-100/80 bg-orange-50/80 px-3 py-3 sm:px-5'>
    <div className='flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-black text-slate-900 sm:text-sm'>
      {[
        { icon: FaTruckFast, label: 'Free shipping' },
        { icon: FaBolt, label: 'Free returns' },
        { icon: FaStar, label: 'Best prices' },
        { icon: FaFire, label: 'Secure checkout' },
      ].map((benefit, index) => (
        <React.Fragment key={benefit.label}>
          {index > 0 && <span className='text-orange-300'>|</span>}
          <span className='inline-flex items-center gap-1.5 whitespace-nowrap'>
            <benefit.icon className='h-3.5 w-3.5 text-orange-500' />
            {benefit.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  </div>
)

const DesktopUtilityBar = () => (
  <div className='hidden bg-slate-950 px-5 py-3 text-white lg:block'>
    <div className='grid grid-cols-3 divide-x divide-white/15 text-sm font-bold'>
      {[
        { icon: FaTruckFast, title: 'Free shipping on all orders', text: 'Limited-time offer' },
        { icon: FaBolt, title: 'Return within 90 days', text: 'From purchase date' },
        { icon: FaFire, title: 'Hot deals every day', text: 'Fresh preorder savings' },
      ].map((item) => (
        <div key={item.title} className='flex items-center justify-center gap-3 px-4'>
          <item.icon className='h-5 w-5 text-orange-400' />
          <div>
            <p className='leading-5 text-white'>{item.title}</p>
            <p className='text-xs font-semibold text-orange-200'>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const DesktopTrustBars = () => (
  <div className='relative px-4 pt-4 sm:px-6 lg:px-8'>
    <div className='flex items-center justify-between rounded-none bg-green-600 px-4 py-3 text-sm font-black text-white shadow-sm'>
      <span className='inline-flex items-center gap-2'>
        <FaStar className='h-4 w-4' />
        Why choose Preordify?
      </span>
      <div className='flex items-center gap-4 text-xs font-bold'>
        <span>Secure privacy</span>
        <span className='text-green-200'>|</span>
        <span>Safe payments</span>
        <span className='text-green-200'>|</span>
        <span>Delivery guarantee</span>
      </div>
    </div>

    <div className='mt-2 flex items-center justify-between rounded-none border border-green-200 bg-white/90 px-4 py-2 text-xs font-bold text-green-700'>
      <span>Security reminder: Shop safely and confirm every preorder before payment.</span>
      <Link to='/support' className='text-green-800'>
        View
      </Link>
    </div>
  </div>
)

const MobileTrustFlow = () => (
  <div className='relative mb-1 w-full max-w-full overflow-hidden rounded-none border border-orange-100 bg-orange-50/90 shadow-sm'>
    <div className='grid grid-cols-2 divide-x divide-orange-200 text-xs font-bold text-slate-900'>
      {[
        { icon: FaTruckFast, title: 'Free shipping', text: 'Limited-time offer' },
        { icon: FaBolt, title: 'Free returns', text: 'Easy return' },
      ].map((item) => (
        <div key={item.title} className='flex items-center gap-2 px-3 py-3'>
          <item.icon className='h-4 w-4 shrink-0 text-orange-500' />
          <div className='min-w-0'>
            <p className='truncate font-black'>{item.title}</p>
            <p className='truncate text-[11px] font-semibold text-slate-500'>{item.text}</p>
          </div>
        </div>
      ))}
    </div>

    <div className='mx-3 mb-3 mt-2 flex items-center justify-between rounded-none bg-green-600 px-3 py-2.5 text-xs font-black text-white'>
      <span className='inline-flex items-center gap-2'>
        <FaStar className='h-3.5 w-3.5' />
        Why choose Preordify?
      </span>
      <span>Safe payments</span>
    </div>
  </div>
)

const MobileHero = ({ products }) => (
  <section className='w-full px-3 pt-[54px] sm:pt-24 lg:hidden'>
    <MobileTrustFlow />
    <div className='overflow-hidden rounded-none bg-gradient-to-br from-orange-500 via-fuchsia-500 to-violet-700 p-1 shadow-[0_18px_45px_rgba(168,85,247,0.25)]'>
      <div className='relative overflow-hidden rounded-none bg-[#fff7ed]'>
        <div className='absolute -left-16 top-8 h-40 w-40 rounded-full bg-yellow-300/50 blur-3xl' />
        <div className='absolute right-0 top-0 h-44 w-44 rounded-full bg-pink-300/50 blur-3xl' />

        <div className='relative px-3 py-5'>
          <div className='flex items-center justify-between gap-3'>
            <span className='inline-flex items-center gap-2 rounded-none bg-slate-950 px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-white'>
              <FaFire className='h-3.5 w-3.5 text-orange-400' />
              Hot deals
            </span>
            <Link to='/product-category?all=true' className='text-sm font-black text-orange-600'>
              See all
            </Link>
          </div>

          <h1 className='mt-5 text-3xl font-black leading-none tracking-tight text-slate-950'>
            Swipe hot picks
          </h1>
          <p className='mt-2 text-sm font-bold text-slate-600'>Quick deals. Tap to buy.</p>

          <div className='scrollbar-none -mx-3 mt-5 flex gap-3 overflow-x-auto px-3 pb-2'>
            {products.map((product, index) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className='group relative min-w-[168px] overflow-hidden rounded-none bg-white p-3 shadow-sm ring-1 ring-orange-100'
              >
                <div className='absolute left-3 top-3 z-10 rounded-none bg-red-500 px-2.5 py-1 text-[10px] font-black text-white'>
                  -{getDiscount(product)}%
                </div>
                <div className='absolute right-3 top-3 z-10 rounded-none bg-yellow-300 px-2.5 py-1 text-[10px] font-black text-slate-950'>
                  #{index + 1}
                </div>

                <div className='flex h-32 items-center justify-center rounded-none bg-white'>
                  <img
                    src={product.productImage?.[0]}
                    alt={product.productName}
                    className='h-28 w-full object-contain transition duration-300 group-hover:scale-110'
                  />
                </div>

                <p className='mt-3 truncate text-sm font-black text-slate-950'>{product.productName}</p>
                <div className='mt-2 flex items-center gap-1 text-xs font-bold text-yellow-500'>
                  <FaStar className='h-3.5 w-3.5' />
                  <span>{product.rating}</span>
                  <span className='text-slate-400'>({product.reviewCount})</span>
                </div>
                <p className='mt-2 text-lg font-black text-orange-600'>{formatPrice(product.sellingPrice)}</p>
                <p className='text-xs font-semibold text-slate-400 line-through'>{formatPrice(product.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
)

const DesktopHero = ({ featuredDeal, sideDeals }) => {
  if (!featuredDeal) {
    return null
  }

  return (
    <section className='hidden w-full px-4 pt-20 sm:px-6 lg:block lg:px-8'>
      <div className='relative mx-auto max-w-7xl overflow-hidden rounded-none bg-gradient-to-br from-orange-500 via-fuchsia-500 to-violet-700 p-1 shadow-[0_24px_70px_rgba(168,85,247,0.28)]'>
        <div className='relative overflow-hidden rounded-none bg-[#fff7ed]'>
          <div className='absolute -left-24 top-10 h-56 w-56 rounded-full bg-yellow-300/50 blur-3xl' />
          <div className='absolute right-0 top-0 h-72 w-72 rounded-full bg-pink-300/50 blur-3xl' />
          <div className='absolute bottom-0 left-1/2 h-56 w-56 rounded-full bg-orange-300/40 blur-3xl' />

          <DesktopUtilityBar />
          <DesktopTrustBars />

          <div className='relative grid gap-5 p-4 sm:p-6 lg:grid-cols-[0.95fr,1.35fr] lg:p-8'>
            <div className='flex min-h-[440px] flex-col justify-between overflow-hidden rounded-none bg-slate-950 p-5 text-white shadow-2xl sm:p-7'>
              <div>
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='inline-flex items-center gap-2 rounded-none bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white'>
                    <FaFire className='h-3.5 w-3.5' />
                    Hot deals
                  </span>
                  <span className='rounded-none bg-white/10 px-3 py-1 text-xs font-bold text-yellow-200'>
                    7 local picks
                  </span>
                </div>

                <h1 className='mt-6 text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl'>
                  <span className='bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent'>
                    Hot Deals
                  </span>{' '}
                  Today
                </h1>
                <p className='mt-4 text-lg font-bold text-yellow-200'>Grab them before they go.</p>
              </div>

              {featuredDeal && (
                <Link
                  to={`/product/${featuredDeal._id}`}
                  className='mt-8 block rounded-none border border-white/10 bg-white p-4 text-slate-950 transition duration-300 hover:-translate-y-1 hover:shadow-2xl'
                >
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <p className='text-xs font-black uppercase tracking-[0.22em] text-orange-600'>
                        Mega save {getDiscount(featuredDeal)}%
                      </p>
                      <h2 className='mt-2 text-xl font-black'>{featuredDeal.productName}</h2>
                    </div>
                    <span className='rounded-none bg-red-100 px-3 py-1 text-xs font-black text-red-600'>
                      {featuredDeal.soldLabel}
                    </span>
                  </div>

                  <div className='mt-4 flex items-end justify-between gap-4'>
                    <img
                      src={featuredDeal.productImage?.[0]}
                      alt={featuredDeal.productName}
                      className='h-36 w-40 object-contain drop-shadow-xl sm:h-44'
                    />
                    <div className='text-right'>
                      <p className='text-sm text-slate-400 line-through'>{formatPrice(featuredDeal.price)}</p>
                      <p className='text-3xl font-black text-orange-600'>{formatPrice(featuredDeal.sellingPrice)}</p>
                      <p className='mt-2 inline-flex items-center gap-1 text-sm font-bold text-slate-700'>
                        <FaStar className='h-4 w-4 text-yellow-400' />
                        {featuredDeal.rating} rating
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            <div className='grid content-start gap-4'>
              <div className='flex flex-wrap items-center gap-2'>
                {[
                  { icon: FaBolt, label: 'Flash prices' },
                  { icon: FaTruckFast, label: 'Preorder now' },
                  { icon: FaStar, label: 'Top rated' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className='inline-flex items-center gap-2 rounded-none bg-white/90 px-4 py-2 text-sm font-black text-slate-950 shadow-sm backdrop-blur'
                  >
                    <item.icon className='h-4 w-4 text-orange-500' />
                    {item.label}
                  </div>
                ))}
              </div>

              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                {sideDeals.map((product, index) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className='group relative overflow-hidden rounded-none bg-white p-3 shadow-sm ring-1 ring-orange-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl'
                  >
                    <div className='absolute left-3 top-3 z-10 rounded-none bg-red-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white'>
                      -{getDiscount(product)}%
                    </div>
                    <div className='absolute right-3 top-3 z-10 rounded-none bg-yellow-300 px-2.5 py-1 text-[10px] font-black text-slate-950'>
                      #{index + 2}
                    </div>

                    <div className='flex h-32 items-center justify-center rounded-none bg-white sm:h-36'>
                      <img
                        src={product.productImage?.[0]}
                        alt={product.productName}
                        className='h-28 w-full object-contain transition duration-300 group-hover:scale-110 sm:h-32'
                      />
                    </div>

                    <div className='mt-3'>
                      <p className='truncate text-sm font-black text-slate-950'>{product.productName}</p>
                      <div className='mt-2 flex items-center gap-1 text-xs font-bold text-yellow-500'>
                        <FaStar className='h-3.5 w-3.5' />
                        <span>{product.rating}</span>
                        <span className='text-slate-400'>({product.reviewCount})</span>
                      </div>
                      <div className='mt-2 flex flex-wrap items-end gap-2'>
                        <p className='text-lg font-black text-orange-600'>{formatPrice(product.sellingPrice)}</p>
                        <p className='text-xs font-semibold text-slate-400 line-through'>{formatPrice(product.price)}</p>
                      </div>
                      <p className='mt-2 rounded-none bg-orange-50 px-2 py-1 text-center text-[11px] font-bold text-orange-600'>
                        {product.soldLabel}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className='flex flex-col gap-3 rounded-none bg-white/85 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between'>
                <p className='text-lg font-black text-slate-950'>More hot deals waiting.</p>
                <Link
                  to='/product-category?all=true'
                  className='brand-btn-primary !rounded-none whitespace-nowrap'
                >
                  See all deals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const Hero = () => {
  const hotDeals = useMemo(
    () => [
      getLocalProductById('non-stick-cooking-set'),
      getLocalProductById('gray-knit-sneakers'),
      getLocalProductById('travel-backpack'),
      getLocalProductById('coffee-maker-glass-carafe'),
      getLocalProductById('plain-cotton-tshirt-teal'),
      getLocalProductById('composite-basketball'),
      getLocalProductById('women-popover-hoodie-black'),
    ].filter(Boolean),
    []
  )

  const featuredDeal = hotDeals[0]
  const sideDeals = hotDeals.slice(1)

  return (
    <>
      <MobileHero products={sideDeals} />
      <DesktopHero featuredDeal={featuredDeal} sideDeals={sideDeals} />
    </>
  )
}

export default Hero
