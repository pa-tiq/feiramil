import { createContext, useContext, useEffect, useState } from 'react';
import { URLs } from '../constants/URLs';
import useHttp from '../hooks/use-http';
import { AuthContext } from './auth-context';

export const ProductContext = createContext({
  products: [],
  userProducts: [],
  isLoading: false,
  error: null,
  addProduct: async (product) => {},
  removeProduct: (productId) => {},
  updateProduct: async (productId) => {},
  fetchProducts: async () => {},
  fetchUserProducts: async (userId) => {},
});

const ProductContextProvider = (props) => {
  const httpObj = useHttp();
  const authContext = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [productsChanged, setProductsChanged] = useState(false);

  useEffect(() => {
    fetchUserProducts(authContext.userId);
    setProductsChanged(false);
  }, [productsChanged]);

  const addProduct = async (product) => {
    let price;
    if (product.price.length === 0) {
      price = null;
    } else {
      price = parseFloat(product.price);
    }
    const postConfig = {
      url: URLs.add_product_url,
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + authContext.token,
        'Content-Type': 'application/json',
      },
      body: {
        title: product.title,
        price: price,
        description: product.description,
      },
    };
    const createTask = (response) => {
      if(response && response[0].insertId > 0) setProductsChanged(true);
    };
    await httpObj.sendRequest(postConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return;
  };

  const removeProduct = async (productId) => {};

  const updateProduct = async (productId) => {};

  const fetchProducts = async () => {};

  const fetchUserProducts = async (userId) => {
    const getConfig = {
      url: URLs.get_user_products_url + `/${userId}`,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authContext.token,
      },
    };
    const createTask = (response) => {
      setUserProducts(response.products);
      //loadedUser = {
      //  email: response.user.email,
      //  password: response.user.password,
      //  name: response.user.name,
      //  om: response.user.om,
      //  phone: response.user.phone,
      //  photo: response.user.photo,
      //};
      //setUser(loadedUser);
    };
    await httpObj.sendRequest(getConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products: products,
        userProducts: userProducts,
        isLoading: httpObj.isLoading,
        error: httpObj.error,
        addProduct: addProduct,
        removeProduct: removeProduct,
        updateProduct: updateProduct,
        fetchProducts: fetchProducts,
        fetchUserProducts: fetchUserProducts,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
