import { toast } from 'react-toastify';

const STORAGE_KEY = 'preorderLocalCartV1';

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
      productImage: product?.productImage?.[0],
    });
  }

  saveLocalCart(cart);
  toast.success('Added to cart (preview — saved on this device only)');
};

export default localAddToCart;
