import SummaryApi from "../common";

const cache = new Map();

const fetchHotDealWiseProduct = async (hotDeal) => {
  if (cache.has(hotDeal)) {
    return cache.get(hotDeal);
  }

  const promise = fetch(SummaryApi.hotDealWiseProduct.url, {
    method: SummaryApi.hotDealWiseProduct.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      hotDeal: hotDeal,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      cache.delete(hotDeal);
      throw err;
    });

  cache.set(hotDeal, promise);
  return promise;
};

export default fetchHotDealWiseProduct;
