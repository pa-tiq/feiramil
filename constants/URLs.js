const private_ip_manaus = 'http://192.168.1.6'
const private_ip_bsb = 'http://192.168.1.253'
const baseURL = `${private_ip_bsb}:8080`;

export const URLs = {
  base_url: baseURL,
  login_url: `${baseURL}/auth/login`,
  signup_url: `${baseURL}/auth/signup`,
  get_user_url: `${baseURL}/user/user`,
  update_user_url: `${baseURL}/user/user`,
  update_user_photo_url: `${baseURL}/user/image`,
  add_product_url: `${baseURL}/feed/product`,
  update_product_url: `${baseURL}/feed/product`,
  update_product_image_url: `${baseURL}/feed/image`,
  add_product_image_url: `${baseURL}/feed/image`,
  get_products_url: `${baseURL}/feed/products`,
  get_products_exept_user_url: `${baseURL}/feed`,
  get_user_products_url: `${baseURL}/feed/products`,
  get_product_detail_url: `${baseURL}/feed/product`,
  delete_product_url: `${baseURL}/feed/product`
};
