import SummaryApi from "../common";

const fetchAllProducts = async () => {
  const response = await fetch(SummaryApi.allProduct.url, {
    method: SummaryApi.allProduct.method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const dataResponse = await response.json();
  return dataResponse;
};

export default fetchAllProducts;
