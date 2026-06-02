import SummaryApi from "../common";

const cache = new Map();

const fetchCategoryWiseProduct = async (category) => {
  if (cache.has(category)) {
    return cache.get(category);
  }

  const promise = fetch(SummaryApi.categoryWiseProduct.url, {
    method: SummaryApi.categoryWiseProduct.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category: category,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      cache.delete(category);
      throw err;
    });

  cache.set(category, promise);
  return promise;
};

export default fetchCategoryWiseProduct;
