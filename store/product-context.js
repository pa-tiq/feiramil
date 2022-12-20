import { createContext, useContext, useEffect, useState } from 'react';
import { URLs } from '../constants/URLs';
import useHttp from '../hooks/use-http';
import { findOrDownloadImage } from '../util/findOrDownloadFile';
import { AuthContext } from './auth-context';

export const ProductContext = createContext({
  products: [],
  userProducts: [],
  isLoading: false,
  error: null,
  triggerReload: () => {},
  triggerFeedReload: () => {},
  addProduct: async (product) => {},
  addProductImagePath: async (data) => {},
  updateProductImagePath: async (data) => {},
  removeProduct: (productId) => {},
  updateProduct: async (product) => {},
  fetchProductsExeptUser: async () => {},
  fetchProductDetail: async (productId) => {},
  fetchUserProducts: async (userId) => {},
});

const ProductContextProvider = (props) => {
  const httpObj = useHttp();
  const authContext = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [productsChanged, setProductsChanged] = useState(false);
  const [feedProductsChanged, setFeedProductsChanged] = useState(false);

  async function getUserProducts(){
    try {
      await fetchUserProducts(authContext.userId);
    } catch (error) {
      console.log(error);
    }
  }    
  async function getFeedProducts(){
    try {
      await fetchProductsExeptUser(authContext.userId);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getUserProducts();
    getFeedProducts();
  },[]);

  useEffect(() => {    
    if(productsChanged){
      getUserProducts();
      setProductsChanged(false);
    }     
    if(feedProductsChanged){
      getFeedProducts();
      setFeedProductsChanged(false);
    } 
  }, [productsChanged,feedProductsChanged]);  

  const triggerReload = () => {
    setProductsChanged(true);
  }  
  const triggerFeedReload = () => {
    setFeedProductsChanged(true);
  }

  const addProduct = async (product) => {
    let price;
    let productInsertId;
    if (!product.price || product.price.length === 0) {
      price = null;
    } else {
      price = parseFloat(product.price.replace(',','.'));
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
      if(response && response.result[0]){
        setProductsChanged(true);
        productInsertId = parseInt(response.result[0].insertId);
      } 
    };
    await httpObj.sendRequest(postConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return productInsertId;
  };

  const updateProduct = async (product) => {
    let price;
    let productInsertId;
    if (!product.price || product.price.length === 0) {
      price = null;
    } else {
      price = parseFloat(product.price.replace(',','.'));
    }
    const postConfig = {
      url: URLs.update_product_url + `/${product.id}`,
      method: 'PUT',
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
      if(response && response.changedRows > 0){
        setProductsChanged(true);
      } 
    };
    await httpObj.sendRequest(postConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return productInsertId;
  };
  
  const addProductImagePath = async (data) => {
    let loadedUser = {};
    const putConfig = {
      url: URLs.add_product_image_url + `/${data.productId}`,
      method: 'POST',
      body: {
        'path': data.path,
      },
      headers: {
        Authorization: 'Bearer ' + authContext.token,
        'Content-Type': 'application/json',       
      },
    };
    const createTask = (response) => {
      if (response.changedRows > 0) {
        setProductsChanged(true);
      }
    };
    await httpObj.sendRequest(putConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return loadedUser;
  };

  const updateProductImagePath = async (paths) => {
    let loadedUser = {};
    const putConfig = {
      url: URLs.update_product_image_url,
      method: 'PUT',
      body: {
        'path': paths.path,
        'oldpath': paths.oldpath,
      },
      headers: {
        Authorization: 'Bearer ' + authContext.token,
        'Content-Type': 'application/json',       
      },
    };
    const createTask = (response) => {
      if (response.changedRows > 0) {
        setUserChanged(true);
      }
    };
    await httpObj.sendRequest(putConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return loadedUser;
  };

  const removeProduct = async (productId) => {
    const deleteConfig = {
      url: `${URLs.delete_product_url}/${productId}`,
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + authContext.token,
      },
    };
    const createTask = () => {
      setProductsChanged(true);
    };
    httpObj.sendRequest(deleteConfig, createTask);
  };

  const fetchProductsExeptUser = async (userId) => {
    const getConfig = {
      url: URLs.get_products_exept_user_url + `/${userId}`,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authContext.token,
      },
    };
    const createTask = (response) => {
      async function getFile(product) {
        try {
          let uri;
          uri = await findOrDownloadImage(product.imagePath);
          product.imageUri = uri;
        } catch (error) {
          console.log(error);
        }
      }
      if(response.products){
        let products = response.products;
        products.forEach((product) => {
          if (!product.imagePath) {
            product.imageUri = null;
          } else {
            getFile(product);
          }
        });
        setProducts(products);
      }
    };
    await httpObj.sendRequest(getConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
  };
  
  const fetchProductDetail = async (productId) => {
    let fetchedProduct;
    const getConfig = {
      url: URLs.get_product_detail_url + `/${productId}`,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authContext.token,
      },
    };
    const createTask = (response) => {
      fetchedProduct = response.product;
    };
    await httpObj.sendRequest(getConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return fetchedProduct;
  };

  const fetchUserProducts = async (userId) => {
    const getConfig = {
      url: URLs.get_user_products_url + `/${userId}`,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authContext.token,
      },
    };
    const createTask = (response) => {
      async function getFile(product) {
        try {
          let uri;
          uri = await findOrDownloadImage(product.imagePath);
          product.imageUri = uri;
        } catch (error) {
          console.log(error);
        }
      }
      if(response.products){
        let products = response.products;
        products.forEach((product) => {
          if (!product.imagePath) {
            product.imageUri = null;
          } else {
            getFile(product);
          }
        });
        setUserProducts(products);
      }
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
        triggerReload: triggerReload,
        triggerFeedReload: triggerFeedReload,
        addProduct: addProduct,
        addProductImagePath: addProductImagePath,
        updateProductImagePath: updateProductImagePath,
        removeProduct: removeProduct,
        updateProduct: updateProduct,
        fetchProductsExeptUser: fetchProductsExeptUser,
        fetchProductDetail: fetchProductDetail,
        fetchUserProducts: fetchUserProducts,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
