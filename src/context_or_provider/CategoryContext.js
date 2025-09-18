import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "../config";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [category, setcategory] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/shop-app/categories/`)
      .then(res => setcategory(res.data))
      .catch(err => console.error("Setup fetch error:", err));
  }, []);

  return (
    <CategoryContext.Provider value={{ category,setcategory}}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
