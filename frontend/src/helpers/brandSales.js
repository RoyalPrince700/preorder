import { getAmountPaid, getWebsiteTotal, isOrderCounted } from './orderFinance';

export const aggregateBrandSales = (orders) => {
  const volumeByBrand = {};
  const revenueByBrand = {};

  const countedOrders = (orders || []).filter(isOrderCounted);

  for (const order of countedOrders) {
    const cartItems = order.cartItems || [];
    const websiteTotal = getWebsiteTotal(order);
    const amountPaid = getAmountPaid(order);
    const ratio = websiteTotal > 0 ? amountPaid / websiteTotal : 1;

    for (const item of cartItems) {
      const brand = item.productId?.brandName?.trim() || 'Unknown';
      const qty = Number(item.quantity) || 0;
      const unitPrice =
        item.price ?? item.productId?.sellingPrice ?? item.productId?.price ?? 0;
      const lineTotal = unitPrice * qty;
      const lineRevenue = lineTotal * ratio;

      volumeByBrand[brand] = (volumeByBrand[brand] || 0) + qty;
      revenueByBrand[brand] = (revenueByBrand[brand] || 0) + lineRevenue;
    }
  }

  const volumeData = Object.entries(volumeByBrand)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const revenueData = Object.entries(revenueByBrand)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);

  return { volumeData, revenueData };
};
