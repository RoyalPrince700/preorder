import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import moment from 'moment'
import displayNARCurrency from '../helpers/displayCurrency'
import { useSocket } from '../context/SocketContext'
import { toast } from 'react-toastify'

const OrderPage = () => {
  const [data, setData] = useState([])
  const { socket } = useSocket()

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(SummaryApi.payondeliveryorder.url, {
        method: SummaryApi.payondeliveryorder.method,
        credentials: 'include'
      })

      const responseData = await response.json()
      if (responseData.success) {
        setData(responseData.data)
      } else {
        setData([])
      }
    } catch (err) {
      console.error('Failed to fetch user orders', err)
      setData([])
    }
  }

  useEffect(() => {
    fetchOrderDetails()
  }, [])

  // Listen for real-time order status updates
  useEffect(() => {
    if (!socket) return

    const handleOrderStatusChange = (updateData) => {
      console.log('Order status changed:', updateData)

      // Update the local orders state
      setData((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updateData.orderId
            ? { ...order, status: updateData.newStatus }
            : order
        )
      )

      // Show a toast notification
      toast.info(`Order #${updateData.orderId.slice(-6)} status updated to ${updateData.newStatus}`, {
        position: "top-right",
        autoClose: 5000,
      })
    }

    socket.on('order-status-changed', handleOrderStatusChange)

    // Cleanup listener on unmount
    return () => {
      socket.off('order-status-changed', handleOrderStatusChange)
    }
  }, [socket])

  return (
    <div className="page-shell">
      <div className="mb-12 border-b-2 border-slate-100 pb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-950 sm:text-5xl leading-none">My Orders</h1>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">Track your preorder status and history.</p>
      </div>

      {!data.length ? (
        <div className="border-2 border-dashed border-slate-100 py-24 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">No orders found</p>
          <Link to="/product-category?all=true" className="mt-6 inline-block bg-slate-950 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-orange-600 transition-colors">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-12">
          {data.map((item) => (
            <div key={item._id} className="border-2 border-slate-900 bg-white overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
              <div className="bg-slate-950 p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Order ID:</span>
                    <span className="text-xs font-black uppercase tracking-widest text-white">{item._id.slice(-12)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Placed:</span>
                    <span className="text-xs font-black uppercase tracking-widest text-white">{moment(item.createdAt).format('LL').toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 px-3 py-1.5 border border-white/20">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'Delivered' ? 'text-green-400' : 'text-orange-400'}`}>
                      {item.status}
                    </span>
                  </div>
                  <span className="text-xl font-black tracking-tighter text-white">{displayNARCurrency(item.totalPrice)}</span>
                </div>
              </div>

              <div className="p-8">
                <div className="grid gap-6">
                  {item.cartItems.map((product) => (
                    <div key={product._id} className="flex flex-col sm:flex-row items-center gap-6 border-b-2 border-slate-50 pb-6 last:border-0 last:pb-0">
                      <div className="w-24 h-24 bg-white border-2 border-slate-50 flex items-center justify-center p-2 shrink-0">
                        <img
                          src={product?.productId?.productImage?.[0] || 'https://via.placeholder.com/100'}
                          alt={product?.productId?.productName}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-950 leading-tight">
                          {product?.productId?.productName || "Product no longer available"}
                        </h3>
                        <div className="mt-2 flex flex-wrap justify-center sm:justify-start items-center gap-4">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Qty: <span className="text-slate-950 font-black ml-1">{product?.quantity}</span>
                          </div>
                          <div className="w-px h-3 bg-slate-200"></div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Unit: <span className="text-slate-950 font-black ml-1">
                              {product?.productId?.sellingPrice ? displayNARCurrency(product.productId.sellingPrice) : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t-2 border-slate-50">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Shipping Destination</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-950">{item.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderPage