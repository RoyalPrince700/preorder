import { toast } from 'react-toastify';

const STORAGE_KEY = 'preorderLocalCartV1';
let mergeLocalCartPromise = null;

const dispatchChange = () => {
  window.dispatchEvent(new CustomEvent('preorderLocalCartChange'));
};

export const getLocalCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getLocalCartItemCount = () => {
  return getLocalCart().reduce((sum, line) => sum + (line.quantity || 0), 0);
};

const saveLocalCart = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  dispatchChange();
};

export const clearLocalCart = () => {
  localStorage.removeItem(STORAGE_KEY);
  dispatchChange();
};

export const updateLocalCartQuantity = (productId, quantity) => {
  const id = String(productId);
  const nextCart = getLocalCart()
    .map((line) =>
      String(line.productId) === id
        ? { ...line, quantity: Math.max(1, Number(quantity) || 1) }
        : line
    );

  saveLocalCart(nextCart);
  return nextCart;
};

export const removeLocalCartItem = (productId) => {
  const id = String(productId);
  const nextCart = getLocalCart().filter((line) => String(line.productId) !== id);
  saveLocalCart(nextCart);
  return nextCart;
};

export const toCartPageItems = (items = getLocalCart()) =>
  items.map((item) => ({
    _id: item.productId,
    quantity: item.quantity || 1,
    productId: {
      _id: item.productId,
      productName: item.productName,
      sellingPrice: item.sellingPrice,
      price: item.price,
      category: item.category,
      productImage: item.productImage ? [item.productImage] : [],
    },
  }));

export const mergeLocalCartToAccount = async (addToCartUrl, method = 'post') => {
  if (mergeLocalCartPromise) return mergeLocalCartPromise;

  const localCart = getLocalCart();
  if (!localCart.length || !addToCartUrl) return false;

  mergeLocalCartPromise = Promise.allSettled(
    localCart.map((item) =>
      fetch(addToCartUrl, {
        method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          productId: item.productId,
          quantity: item.quantity || 1,
        }),
      })
    )
  )
    .then((results) => {
      const allSynced = results.every(
        (result) => result.status === 'fulfilled' && result.value.ok
      );

      if (allSynced) {
        clearLocalCart();
      }

      return allSynced;
    })
    .finally(() => {
      mergeLocalCartPromise = null;
    });

  return mergeLocalCartPromise;
};

/**
 * Demo / preview cart: stores items in localStorage only. Does not call the server.
 * The API-based addToCart in `addToCart.jsx` is unchanged; use this for local product grid UX only.
 */
const localAddToCart = (e, product) => {
  e?.stopPropagation();
  e?.preventDefault();

  if (!product?._id) {
    toast.error('Product unavailable.');
    return;
  }

  const id = String(product._id);
  const cart = getLocalCart();
  const lineIndex = cart.findIndex((line) => String(line.productId) === id);

  if (lineIndex >= 0) {
    cart[lineIndex] = {
      ...cart[lineIndex],
      quantity: (cart[lineIndex].quantity || 1) + 1,
    };
  } else {
    cart.push({
      productId: id,
      quantity: 1,
      productName: product?.productName,
      sellingPrice: product?.sellingPrice,
      price: product?.price,
      category: product?.category,
      productImage: product?.productImage?.[0],
    });
  }

  saveLocalCart(cart);
  toast.success('Added to cart');
};

export default localAddToCart;
