import React, { useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaMinus, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import displayNARCurrency from "../helpers/displayCurrency";
import {
  adminModalOverlay,
  adminModalPanelLg,
  adminModalHeader,
  adminModalCloseBtn,
  adminModalBody,
  adminModalFooter,
  adminInput,
  adminLabel,
  adminBtnPrimary,
  adminBtnSecondary,
  adminBtnDisabled,
} from "../common/adminUi";

const INITIAL_CUSTOMER = {
  name: "",
  number: "",
  address: "",
  note: "",
};

const AddOrderModal = ({ onClose, onCreated }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState("");
  const [lineItems, setLineItems] = useState([]);
  const [customer, setCustomer] = useState(INITIAL_CUSTOMER);
  const [confirmOrder, setConfirmOrder] = useState(true);
  const [amountPaid, setAmountPaid] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch(SummaryApi.allProduct.url, {
          method: SummaryApi.allProduct.method,
        });
        const result = await res.json();
        if (result.success) {
          setProducts(result.data || []);
        } else {
          toast.error(result.message || "Failed to load products");
        }
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = productSearch.trim().toLowerCase();
    if (!term) return products.slice(0, 12);
    return products
      .filter(
        (p) =>
          p.productName?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term) ||
          p.brandName?.toLowerCase().includes(term)
      )
      .slice(0, 12);
  }, [products, productSearch]);

  const totalPrice = useMemo(
    () =>
      lineItems.reduce((sum, item) => {
        const price = item.sellingPrice ?? item.price ?? 0;
        return sum + price * item.quantity;
      }, 0),
    [lineItems]
  );

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const addProduct = (product) => {
    setLineItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          productName: product.productName,
          productImage: product.productImage,
          sellingPrice: product.sellingPrice,
          price: product.price,
          quantity: 1,
        },
      ];
    });
    setProductSearch("");
  };

  const updateQuantity = (productId, delta) => {
    setLineItems((prev) =>
      prev
        .map((item) =>
          item._id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId) => {
    setLineItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const name = customer.name.trim();
    const number = customer.number.trim();
    const address = customer.address.trim();

    if (!name || !number || !address) {
      toast.error("Customer name, phone, and address are required");
      return;
    }

    if (!lineItems.length) {
      toast.error("Add at least one product");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(SummaryApi.createOrder.url, {
        method: SummaryApi.createOrder.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          number,
          address,
          note: customer.note.trim() || undefined,
          confirmOrder,
          amountPaid: amountPaid.trim() ? Number(amountPaid) : undefined,
          cartItems: lineItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
        }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        onClose();
        onCreated?.();
      } else {
        toast.error(result.message || "Failed to create order");
      }
    } catch {
      toast.error("Failed to create order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={adminModalOverlay}>
      <div className={adminModalPanelLg}>
        <div className={adminModalHeader}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
              Order management
            </p>
            <h2 className="mt-1 text-sm font-black uppercase tracking-widest">
              Add order
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className={`${adminModalCloseBtn} ${adminBtnDisabled}`}
            aria-label="Close"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className={`${adminModalBody} overflow-y-auto`}>
            <div>
              <p className={adminLabel}>Search products</p>
              <div className="relative">
                <input
                  type="text"
                  className={`${adminInput} pl-10`}
                  placeholder="Search by name, brand, or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  disabled={saving || loadingProducts}
                />
                <FaSearch className="absolute left-3 top-3 text-slate-400" size={12} />
              </div>
              {loadingProducts ? (
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Loading products...
                </p>
              ) : (
                <div className="mt-2 max-h-48 overflow-y-auto border-2 border-slate-100">
                  {filteredProducts.length === 0 ? (
                    <p className="px-3 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      No products found
                    </p>
                  ) : (
                    filteredProducts.map((product) => (
                      <button
                        key={product._id}
                        type="button"
                        disabled={saving}
                        onClick={() => addProduct(product)}
                        className="flex w-full items-center gap-3 border-b border-slate-100 px-3 py-2 text-left transition-colors hover:bg-orange-50/50 disabled:opacity-60"
                      >
                        {product.productImage?.[0] && (
                          <img
                            src={product.productImage[0]}
                            alt=""
                            className="h-10 w-10 shrink-0 object-contain"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-950">
                            {product.productName}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {displayNARCurrency(
                              (product.sellingPrice ?? product.price ?? 0).toFixed(2)
                            )}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div>
              <p className={adminLabel}>Selected products</p>
              {lineItems.length === 0 ? (
                <p className="border-2 border-dashed border-slate-100 py-6 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  No products added yet
                </p>
              ) : (
                <div className="space-y-2">
                  {lineItems.map((item) => {
                    const unitPrice = item.sellingPrice ?? item.price ?? 0;
                    return (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 border-2 border-slate-100 bg-slate-50 p-3"
                      >
                        {item.productImage?.[0] && (
                          <img
                            src={item.productImage[0]}
                            alt=""
                            className="h-12 w-12 object-contain"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-950">
                            {item.productName}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {displayNARCurrency(unitPrice.toFixed(2))} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => updateQuantity(item._id, -1)}
                            className="flex h-8 w-8 items-center justify-center border-2 border-slate-200 bg-white hover:border-slate-900 disabled:opacity-60"
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="w-8 text-center text-xs font-black">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => updateQuantity(item._id, 1)}
                            className="flex h-8 w-8 items-center justify-center border-2 border-slate-200 bg-white hover:border-slate-900 disabled:opacity-60"
                          >
                            <FaPlus size={10} />
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => removeItem(item._id)}
                            className="flex h-8 w-8 items-center justify-center border-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-700 hover:text-white disabled:opacity-60"
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-right text-xs font-black uppercase tracking-widest text-slate-950">
                    Website total: {displayNARCurrency(totalPrice.toFixed(2))}
                  </p>
                </div>
              )}
            </div>

            {lineItems.length > 0 && (
              <div>
                <label htmlFor="amountPaid" className={adminLabel}>
                  Money paid (optional)
                </label>
                <input
                  id="amountPaid"
                  type="number"
                  min="0"
                  step="0.01"
                  className={adminInput}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  disabled={saving}
                  placeholder={`Leave blank for website total (${displayNARCurrency(totalPrice.toFixed(2))})`}
                />
                {amountPaid !== "" && Number(amountPaid) < totalPrice && (
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-orange-700">
                    Discount: {displayNARCurrency((totalPrice - Number(amountPaid)).toFixed(2))}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={adminLabel}>
                  Customer name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={adminInput}
                  value={customer.name}
                  onChange={handleCustomerChange}
                  disabled={saving}
                  required
                />
              </div>
              <div>
                <label htmlFor="number" className={adminLabel}>
                  Phone number *
                </label>
                <input
                  id="number"
                  name="number"
                  type="tel"
                  className={adminInput}
                  value={customer.number}
                  onChange={handleCustomerChange}
                  disabled={saving}
                  placeholder="08123456789"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className={adminLabel}>
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                className={adminInput}
                value={customer.address}
                onChange={handleCustomerChange}
                disabled={saving}
                required
              />
            </div>

            <div>
              <label htmlFor="note" className={adminLabel}>
                Note (optional)
              </label>
              <input
                id="note"
                name="note"
                type="text"
                className={adminInput}
                value={customer.note}
                onChange={handleCustomerChange}
                disabled={saving}
                placeholder="WhatsApp order, special instructions..."
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={confirmOrder}
                onChange={(e) => setConfirmOrder(e.target.checked)}
                disabled={saving}
                className="h-4 w-4 accent-orange-500"
              />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-700">
                Confirm order immediately
              </span>
            </label>
          </div>

          <div className={adminModalFooter}>
            <button
              type="submit"
              disabled={saving || lineItems.length === 0}
              className={`${adminBtnPrimary} flex-1 py-3 ${adminBtnDisabled}`}
            >
              {saving
                ? "Creating…"
                : confirmOrder
                  ? "Create & confirm order"
                  : "Create order"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className={`${adminBtnSecondary} px-6 py-3 ${adminBtnDisabled}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;
