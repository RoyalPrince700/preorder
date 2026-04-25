import SummaryApi from "../common";

// Upload image via backend API
const uploadImage = async (image) => {
  if (!SummaryApi.isBackendConfigured) {
    throw new Error("Backend is not configured for image upload in production.");
  }
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch(SummaryApi.uploadImage.url, {
    method: "POST",
    body: formData,
    credentials: 'include', // Include cookies for authentication
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Image upload failed");
  }

  return json.data;
};

export default uploadImage;
