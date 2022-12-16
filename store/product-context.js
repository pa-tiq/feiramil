import React, { useState } from "react";
import useHttp from "../hooks/use-http";

const ProductContext = React.createContext({
  products: [],
  isLoading: false,
  error: null,
  addProduct: (product) => {},
  removeProduct: (productId) => {},
  updateProduct: (productId) => {},
  fetchProducts: () => {},
  fetchUserProducts: (userId) => {},
});

export const UserContextProvider = (props) => {
  const httpObj = useHttp();
  const [products, setProducts] = useState([]);

  const addProduct = async (product) => {};

  const removeProduct = async (productId) => {};

  const updateProduct = async (productId) => {};

  const fetchProducts = async () => {};

  const fetchUserProducts = async (userId) => {};

  return (
    <UserContext.Provider
      value={{
        user: user,
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
    </UserContext.Provider>
  );
};

export default ProductContext;
