export const getWebsiteTotal = (order) => Number(order?.totalPrice) || 0;

export const getAmountPaid = (order) => {
  if (order?.amountPaid != null && order.amountPaid !== '') {
    return Number(order.amountPaid);
  }
  return getWebsiteTotal(order);
};

export const getDiscountForfeited = (order) => {
  const website = getWebsiteTotal(order);
  const paid = getAmountPaid(order);
  return Math.max(0, website - paid);
};

export const isOrderCounted = (order) =>
  order?.status === 'Delivered' || order?.adminConfirmed === true;

// Signed-in = has a userId (registered user who was logged in at checkout)
// Guest / unsigned = no userId (order placed without sign-in, e.g. via WhatsApp guest checkout)
export const isSignedInOrder = (order) => !!order?.userId;
export const isGuestOrder = (order) => !order?.userId;

export const filterSignedInOrders = (orders) => (orders || []).filter(isSignedInOrder);
export const filterGuestOrders = (orders) => (orders || []).filter(isGuestOrder);

export const sumWebsiteTotal = (orders) =>
  orders.reduce((sum, order) => sum + getWebsiteTotal(order), 0);

export const sumAmountPaid = (orders) =>
  orders.reduce((sum, order) => sum + getAmountPaid(order), 0);

export const sumDiscountForfeited = (orders) =>
  orders.reduce((sum, order) => sum + getDiscountForfeited(order), 0);

// Convenience: signed-in vs guest money sums (compose with existing)
export const sumAmountPaidSignedIn = (orders) => sumAmountPaid(filterSignedInOrders(orders));
export const sumAmountPaidGuest = (orders) => sumAmountPaid(filterGuestOrders(orders));
export const sumWebsiteTotalSignedIn = (orders) => sumWebsiteTotal(filterSignedInOrders(orders));
export const sumWebsiteTotalGuest = (orders) => sumWebsiteTotal(filterGuestOrders(orders));
