// // src/components/PopularProducts.jsx
// import React from "react";
// import  products  from "../data/products";
// import ProductCard from "./ProductCard";
//
// const PopularProducts = () => {
//   const limitedProducts = products.slice(0, 6);
//
//   return (
//     <section className="py-12 px-4 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-10">
//           Popular Products
//         </h2>
//
//         <div className="grid gap-3  grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
//           {limitedProducts.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };
//
// export default PopularProducts;


// src/components/PopularProducts.jsx
import React from "react";
import { useProducts } from "../context_or_provider/ProductsContext";
import ProductCard from "./ProductCard";

const PopularProducts = () => {
  const { products } = useProducts();

  if (!products) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          Loading popular products...
        </div>
      </section>
    );
  }

  // Example: first 6 products (or filter by "isPopular" if API gives that)
  const limitedProducts = products.slice(0, 6);

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Popular Products
        </h2>

        {limitedProducts.length === 0 ? (
          <p className="text-center text-gray-500">No popular products found.</p>
        ) : (
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {limitedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularProducts;
