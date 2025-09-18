import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "../config";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setproducts] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/shop-app/products/`)
      .then(res => setproducts(res.data))
      .catch(err => console.error("Setup fetch error:", err));
  }, []);

  return (
    <ProductsContext.Provider value={{  products, setproducts}}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
