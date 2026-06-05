import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SummaryApi from '../common'
import moment from 'moment'
import displayNARCurrency from '../helpers/displayCurrency'
import { useSocket } from '../context/SocketContext'
import Context from '../context'
import { toast } from 'react-toastify'

const statusClass = (status) => {
  switch (status) {
    case 'Delivered':
      return 'text-green-400'
    case 'Cancelled':
      return 'text-red-400'
    case 'Shipped':
      return 'text-blue-400'
    case 'Processing':
      return 'text-yellow-400'
    default:
      return 'text-orange-400'
  }
}

const OrderPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const { socket } = useSocket()
  const navigate = useNavigate()
  const user = useSelector((state) => state?.user?.user)
  const { authReady } = useContext(Context)

  const fetchOrderDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(SummaryApi.payondeliveryorder.url, {
        method: SummaryApi.payondeliveryorder.method,
        credentials: 'include',
      })

      const responseData = await response.json()
      if (responseData.success) {
        const confirmedOrders = (responseData.data || []).filter(order => order.adminConfirmed)
        setData(confirmedOrders)
      } else {
        if (responseData.error && !user) {
          navigate('/login')
        }
        setData([])
      }
    } catch (err) {
      console.error('Failed to fetch user orders', err)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authReady) {
      if (!user) {
        navigate('/login')
        return
      }
      fetchOrderDetails()
    }
  }, [user, navigate, authReady])

  useEffect(() => {
    if (!socket) return

    const handleOrderStatusChange = (updateData) => {
      setData((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updateData.orderId
            ? { ...order, status: updateData.newStatus }
            : order
        )
      )

      toast.info(
        `Order #${updateData.orderId.slice(-12).toUpperCase()} status updated to ${updateData.newStatus}`,
        { position: 'top-right', autoClose: 5000 }
      )
    }

    socket.on('order-status-changed', handleOrderStatusChange)
    return () => {
      socket.off('order-status-changed', handleOrderStatusChange)
    }
  }, [socket])

  return (
    <div className="container mx-auto mt-4 px-4 pt-20 max-w-7xl pb-16">
      <div className="mb-8 border-b-2 border-slate-100 pb-8">
        <span className="inline-flex items-center rounded-none bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white">
          Orders
        </span>
        <h1 className="mt-6 text-3xl font-black uppercase tracking-tighter text-slate-950 sm:text-5xl leading-none">
          My Orders
        </h1>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          Track your preorder status and delivery history.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-64 animate-pulse border-2 border-slate-100 bg-white"
            />
          ))}
        </div>
      ) : !data.length ? (
        <div className="border-2 border-dashed border-slate-100 py-24 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            No orders found
          </p>
          <Link
            to="/product-category?all=true"
            className="mt-8 inline-block bg-slate-950 px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-orange-600"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {data.map((item) => (
            <article
              key={item._id}
              className="overflow-hidden border-2 border-slate-900 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.04)]"
            >
              <div className="flex flex-col gap-4 bg-slate-950 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Order ID
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-white">
                      {item._id.slice(-12)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Placed
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-white">
                      {moment(item.createdAt).format('LL').toUpperCase()}
                    </span>
                  </div>
                  {item.paymentMethod && (
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Payment:{' '}
                      <span className="text-white">{item.paymentMethod}</span>
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="border border-white/20 bg-white/10 px-3 py-1.5">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${statusClass(item.status)}`}
                    >
                      {item.status || 'Pending'}
                    </span>
                  </div>
                  <span className="text-2xl font-black tracking-tighter text-white">
                    {displayNARCurrency(item.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="space-y-6">
                  {(item.cartItems || []).map((product, idx) => {
                    const productData = product?.productId || {}
                    const lineKey =
                      product?._id || productData?._id || `${item._id}-${idx}`

                    return (
                      <div
                        key={lineKey}
                        className="grid grid-cols-[100px,1fr] gap-4 border-b-2 border-slate-50 pb-6 last:border-0 last:pb-0 sm:grid-cols-[120px,1fr] sm:items-center"
                      >
                        <div className="flex h-[100px] w-full items-center justify-center border-2 border-slate-50 bg-white p-2 sm:h-[120px]">
                          {productData?.productImage?.[0] ? (
                            <img
                              src={productData.productImage[0]}
                              alt={productData.productName || 'Product'}
                              className="h-full w-full object-contain mix-blend-multiply"
                            />
                          ) : (
                            <div className="h-full w-full bg-slate-50" />
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <h3 className="line-clamp-2 text-xs font-semibold tracking-normal text-slate-950 leading-tight">
                            {productData?.productName ||
                              'Product no longer available'}
                          </h3>
                          <div className="mt-3 flex flex-wrap items-center gap-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              Qty:{' '}
                              <span className="font-black text-slate-950">
                                {product?.quantity}
                              </span>
                            </p>
                            <span className="hidden h-3 w-px bg-slate-200 sm:block" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              Unit:{' '}
                              <span className="font-black text-slate-950">
                                {productData?.sellingPrice
                                  ? displayNARCurrency(
                                      productData.sellingPrice
                                    )
                                  : product?.price
                                    ? displayNARCurrency(product.price)
                                    : 'N/A'}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {item.address && (
                  <div className="mt-8 border-t-2 border-slate-50 pt-8">
                    <h4 className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Shipping Destination
                    </h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-950">
                      {item.address}
                    </p>
                    {item.note && (
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Note: {item.note}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderPage
