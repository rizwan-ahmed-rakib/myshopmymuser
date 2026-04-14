// import React from "react";
// import {useProducts} from "../context_or_provider/ProductsContext";
// import ProductCard from "../myshopcomponents/ProductCard";
//
// const AllProducts = () => {
//     const {products,setproducts} = useProducts();
//
//       if (!products) {
//     return <p className="text-center py-10">Loading products...</p>;
//   }
//
//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10">
//       <h2 className="text-2xl font-bold text-center mb-8">ALL PRODUCT</h2>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
//        {products.map((product, index) => (
//   <ProductCard key={`${product.id}-${index}`} product={product} />
// ))}
//
//       </div>
//     </div>
//   );
// };
//
// export default AllProducts;




import React, { useState } from "react";
import { useProducts } from "../../context_or_provider/myshop/ProductsContext";
import ProductCard from "../myshopcomponents/ProductCard";
import Cart from "./Cart"; // ✅ Cart শুধু একবারই এখানে থাকবে

const AllProducts = () => {
  const { products } = useProducts();
  const [isCartOpen, setIsCartOpen] = useState(false); // ✅ Cart state এখানেই থাকবে

  if (!products) {
    return <p className="text-center py-10">Loading products...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-center mb-8">ALL PRODUCT</h2>

      {/* ✅ ProductList grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            product={product}
            setIsCartOpen={setIsCartOpen} // 👈 Cart open করার function পাঠানো হচ্ছে
          />
        ))}
      </div>

      {/* ✅ Cart শুধুমাত্র একবারই render হবে */}
      <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </div>
  );
};

export default AllProducts;
