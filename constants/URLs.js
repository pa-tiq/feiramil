const private_ip_manaus = 'http://192.168.1.8';
const private_ip_bsb = 'http://192.168.1.253';
const private_ip_4cta = 'http://10.0.0.177';
const baseURL = `${private_ip_4cta}:8080`;

export const URLs = {
  base_url: baseURL,
  login_url: `${baseURL}/auth/login`,
  signup_url: `${baseURL}/auth/signup`,
  tokenlogin_url: `${baseURL}/auth/tokenlogin`,
  get_user_url: `${baseURL}/user/user`,
  update_user_url: `${baseURL}/user/user`,
  update_user_photo_url: `${baseURL}/user/image`,
  add_product_url: `${baseURL}/feed/product`,
  update_product_url: `${baseURL}/feed/product`,
  update_product_image_url: `${baseURL}/feed/image`,
  add_product_image_url: `${baseURL}/feed/image`,
  remove_product_image_url: `${baseURL}/feed/image`,
  get_products_url: `${baseURL}/feed/products`,
  get_products_exept_user_url: `${baseURL}/feed`,
  get_user_products_url: `${baseURL}/feed/products`,
  get_user_favourites_url: `${baseURL}/feed/favourites`,
  add_user_favourite_url: `${baseURL}/feed/favourite`,
  remove_user_favourite_url: `${baseURL}/feed/favourite`,
  get_product_detail_url: `${baseURL}/feed/product`,
  delete_product_url: `${baseURL}/feed/product`,
  get_city_filters_url: `${baseURL}/user/filter`,
  add_city_filter_url: `${baseURL}/user/filter`,
  update_city_filter_url: `${baseURL}/user/filter`,
  remove_city_filter_url: `${baseURL}/user/filter`,
  apply_filtering_url: `${baseURL}/user/filtering`
};
