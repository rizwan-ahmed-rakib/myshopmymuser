import React from "react";
import {useProducts} from "../context_or_provider/ProductsContext";
import ProductCard from "../components/ProductCard";

const AllProducts = () => {
    const {products,setproducts} = useProducts();

      if (!products) {
    return <p className="text-center py-10">Loading products...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-center mb-8">ALL PRODUCT</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
       {products.map((product, index) => (
  <ProductCard key={`${product.id}-${index}`} product={product} />
))}

      </div>
    </div>
  );
};

export default AllProducts;
