const baseURL = 'http://192.168.1.6:8080';

export const URLs = {
  base_url: baseURL,
  login_url: `${baseURL}/auth/login`,
  signup_url: `${baseURL}/auth/signup`,
  get_user_url: `${baseURL}/user/user`,
  update_user_url: `${baseURL}/user/user`,
  update_user_photo_url: `${baseURL}/user/image`,
  add_product_url: `${baseURL}/feed/product`,
  add_product_image_url: `${baseURL}/feed/image`,
  get_products_url: `${baseURL}/feed/products`,
  get_user_products_url: `${baseURL}/feed/products`,
  get_product_detail_url: `${baseURL}/feed/product`,
  delete_product_url: `${baseURL}/feed/product`
};
