import { createContext, useContext, useEffect, useState } from 'react';
import { URLs } from '../constants/URLs';
import useHttp from '../hooks/use-http';
import { findOrDownloadImage } from '../util/findOrDownloadFile';
import { AuthContext } from './auth-context';

export const ProductContext = createContext({
  products: [],
  userProducts: [],
  userFavourites: [],
  isLoading: false,
  error: null,
  triggerUserProductsReload: () => {},
  triggerFeedReload: () => {},
  addProduct: async (product) => {},
  addProductImagePaths: async ({ path, productId }) => {},
  updateProductImagePaths: async ({ path, oldpath, productId }) => {},
  removeProduct: (productId) => {},
  updateProduct: async (product) => {},
  fetchProductsExeptUser: async () => {},
  fetchProductDetail: async (productId) => {},
  fetchUserProducts: async (userId) => {},
  fetchUserFavourites: async (userId) => {},
  addUserFavourite: async ({ productId, userId }) => {},
  removeUserFavourite: async ({ productId, userId }) => {},
});

const ProductContextProvider = (props) => {
  const httpObj = useHttp();
  const authContext = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [userFavourites, setUserFavourites] = useState([]);
  const [productsChanged, setProductsChanged] = useState(false);
  const [feedProductsChanged, setFeedProductsChanged] = useState(false);

  async function getUserProducts() {
    try {
      await fetchUserProducts(authContext.userId);
    } catch (error) {
      console.log(error);
    }
  }
  async function getUserFavourites() {
    try {
      await fetchUserFavourites(authContext.userId);
    } catch (error) {
      console.log(error);
    }
  }
  async function getFeedProducts() {
    try {
      await fetchProductsExeptUser(authContext.userId);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserProducts();
    getUserFavourites();
    getFeedProducts();
  }, []);

  useEffect(() => {
    if (productsChanged) {
      getUserProducts();
      setProductsChanged(false);
    }
    if (feedProductsChanged) {
      getUserFavourites();
      getFeedProducts();
      setFeedProductsChanged(false);
    }
  }, [productsChanged, feedProductsChanged]);

  const triggerUserProductsReload = () => {
    setProductsChanged(true);
  };
  const triggerFeedReload = () => {
    setFeedProductsChanged(true);
  };

  const addProduct = async (product) => {
    let price;
    let productInsertId;
    if (!product.price || product.price.length === 0) {
      price = null;
    } else {
      price = parseFloat(product.price.replace(',', '.'));
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
        city: product.city,
        state: product.state,
      },
    };
    const createTask = (response) => {
      if (response && response.result[0]) {
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
      price = parseFloat(product.price.replace(',', '.'));
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
        city: product.city,
        state: product.state,
      },
    };
    const createTask = (response) => {
      if (response && response.changedRows > 0) {
        setProductsChanged(true);
      }
    };
    await httpObj.sendRequest(postConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return productInsertId;
  };

  const addProductImagePaths = async ({ paths, productId }) => {
    let loadedUser = {};
    const putConfig = {
      url: URLs.add_product_image_url + `/${productId}`,
      method: 'POST',
      body: {
        paths: paths,
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

  const updateProductImagePaths = async ({ paths, oldpaths, productId }) => {
    const putConfig = {
      url: URLs.update_product_image_url + `/${productId}`,
      method: 'PUT',
      body: {
        paths: paths,
        oldpaths: oldpaths,
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
      async function getFiles(product) {
        try {
          product.imageUris = [];
          for (const path of product.imagePaths) {
            const uri = await findOrDownloadImage(path);
            product.imageUris.push(uri);
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (response.products) {
        let products = response.products.map((product) => {
          if (!product.imagePaths) {
            product.imageUris = null;
          } else {
            const imagePaths = product.imagePaths.split(',');
            product.imagePaths = imagePaths;
            getFiles(product);
          }
          if (userFavourites.includes(product.id)) {
            product.favourite = true;
          } else {
            product.favourite = false;
          }
          return product;
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
      let product = response.product;
      async function getFiles(product) {
        try {
          product.imageUris = [];
          for (const path of product.imagePaths) {
            const uri = await findOrDownloadImage(path);
            product.imageUris.push(uri);
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (product) {
        if (!product.imagePaths) {
          product.imageUris = null;
        } else {
          const imagePaths = product.imagePaths.split(',');
          product.imagePaths = imagePaths;
          getFiles(product);
        }
      }
      fetchedProduct = product;
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
      async function getFiles(product) {
        try {
          product.imageUris = [];
          for (const path of product.imagePaths) {
            const uri = await findOrDownloadImage(path);
            product.imageUris.push(uri);
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (response.products) {
        let products = response.products.map((product) => {
          if (!product.imagePaths) {
            product.imageUris = null;
          } else {
            const imagePaths = product.imagePaths.split(',');
            product.imagePaths = imagePaths;
            getFiles(product);
          }
          return product;
        });
        setUserProducts(products);
      }
    };
    await httpObj.sendRequest(getConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
  };

  const fetchUserFavourites = async (userId) => {
    const getConfig = {
      url: URLs.get_user_favourites_url + `/${userId}`,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authContext.token,
      },
    };
    const createTask = (response) => {
      if (response.productIds) {
        setUserFavourites(response.productIds);
      }
    };
    await httpObj.sendRequest(getConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
  };

  const addUserFavourite = async (productId) => {
    let loadedUser = {};
    const putConfig = {
      url: URLs.add_user_favourite_url,
      method: 'POST',
      body: {
        productId: productId,
      },
      headers: {
        Authorization: 'Bearer ' + authContext.token,
        'Content-Type': 'application/json',
      },
    };
    const createTask = (response) => {
      if (response.status === 201) {
        setFeedProductsChanged(true);
      }
    };
    await httpObj.sendRequest(putConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return loadedUser;
  };

  const removeUserFavourite = async (productId) => {
    let loadedUser = {};
    const putConfig = {
      url: URLs.remove_user_favourite_url,
      method: 'DELETE',
      body: {
        productId: productId,
      },
      headers: {
        Authorization: 'Bearer ' + authContext.token,
        'Content-Type': 'application/json',
      },
    };
    const createTask = (response) => {
      if (response.status === 200) {
        setFeedProductsChanged(true);
      }
    };
    await httpObj.sendRequest(putConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return loadedUser;
  };

  return (
    <ProductContext.Provider
      value={{
        products: products,
        userProducts: userProducts,
        userFavourites: userFavourites,
        isLoading: httpObj.isLoading,
        error: httpObj.error,
        triggerUserProductsReload: triggerUserProductsReload,
        triggerFeedReload: triggerFeedReload,
        addProduct: addProduct,
        addProductImagePaths: addProductImagePaths,
        updateProductImagePaths: updateProductImagePaths,
        removeProduct: removeProduct,
        updateProduct: updateProduct,
        fetchProductsExeptUser: fetchProductsExeptUser,
        fetchProductDetail: fetchProductDetail,
        fetchUserProducts: fetchUserProducts,
        fetchUserFavourites: fetchUserFavourites,
        addUserFavourite: addUserFavourite,
        removeUserFavourite: removeUserFavourite,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
