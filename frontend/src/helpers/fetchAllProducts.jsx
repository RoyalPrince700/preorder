import SummaryApi from "../common";

let cachedPromise = null;

const fetchAllProducts = async () => {
  if (!cachedPromise) {
    cachedPromise = fetch(SummaryApi.allProduct.url, {
      method: SummaryApi.allProduct.method,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((err) => {
        cachedPromise = null;
        throw err;
      });
  }
  return cachedPromise;
};

export default fetchAllProducts;
