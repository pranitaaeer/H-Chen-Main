const baseURL = import.meta.env.VITE_BASE_URL || "https://h-chen.vercel.app";
const mobileNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919997690669"; // Replace with your WhatsApp number
// const baseURL = import.meta.env.VITE_BASE_URL;
// const mobileNumber = import.meta.env.VITE_WHATSAPP_NUMBER; // Replace with your WhatsApp number

export const createWhatsAppService = (product) => {
  const productLink = `${baseURL}/${product.category.toLowerCase()}/${product._id}`;
  const message = `Hello, 
I want to order the ${product.title}
Product Link: ${productLink}
Price: ₹${product.price}`;

  const whatsappUrl = `https://wa.me/${mobileNumber}?text=${encodeURIComponent(
    message
  )}`;
  return whatsappUrl;
};
