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

export const sumWebsiteTotal = (orders) =>
  orders.reduce((sum, order) => sum + getWebsiteTotal(order), 0);

export const sumAmountPaid = (orders) =>
  orders.reduce((sum, order) => sum + getAmountPaid(order), 0);

export const sumDiscountForfeited = (orders) =>
  orders.reduce((sum, order) => sum + getDiscountForfeited(order), 0);
