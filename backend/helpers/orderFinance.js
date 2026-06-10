const getWebsiteTotal = (order) => Number(order?.totalPrice) || 0;

const getAmountPaid = (order) => {
  if (order?.amountPaid != null && order.amountPaid !== '') {
    return Number(order.amountPaid);
  }
  return getWebsiteTotal(order);
};

const getDiscountForfeited = (order) => {
  const website = getWebsiteTotal(order);
  const paid = getAmountPaid(order);
  return Math.max(0, website - paid);
};

const isOrderCounted = (order) =>
  order?.status === 'Delivered' || order?.adminConfirmed === true;

const effectiveRevenueExpr = { $ifNull: ['$amountPaid', '$totalPrice'] };

const discountForfeitedExpr = {
  $max: [
    0,
    {
      $subtract: [
        { $ifNull: ['$totalPrice', 0] },
        { $ifNull: ['$amountPaid', '$totalPrice'] },
      ],
    },
  ],
};

module.exports = {
  getWebsiteTotal,
  getAmountPaid,
  getDiscountForfeited,
  isOrderCounted,
  effectiveRevenueExpr,
  discountForfeitedExpr,
};
