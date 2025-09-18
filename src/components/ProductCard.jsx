import React from "react";
import { useCart } from "../context_or_provider/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="border rounded-2xl shadow-sm hover:shadow-xl transition duration-300 p-4 flex flex-col relative bg-white">
      {/* Sale Badge */}
      {product.isOnSale && (
        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs sm:text-sm px-2 py-1 rounded-tr-lg rounded-bl-lg shadow-md">
          SALE
        </span>
      )}

      {/* Product Image */}
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img
          src={product.mainimage} // শুধু প্রথম image দেখাচ্ছে
          alt={product.name}
          className="h-40 sm:h-48 md:h-56 object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Product Name */}
      <h3
        onClick={() => navigate(`/products/${product.id}`)}
        className="mt-3 text-sm sm:text-base font-medium text-gray-800 text-center line-clamp-1 cursor-pointer hover:text-orange-500"
      >
        {product.name}
      </h3>

      {/* Price Section */}
      <div className="mt-2 flex flex-col items-center">
        <span className="text-lg sm:text-xl font-bold text-gray-900">
          Tk {product.price}
        </span>
        {product.old_price && (
          <span className="ml-2 text-sm line-through text-gray-500">
            {/*Tk {product.oldPrice.toLocaleString()}*/}
            Tk {product.old_price}
          </span>
        )}
      </div>

      {/* Quick Add Button */}
      <button
        onClick={() => addToCart(product)}
        className="mt-4 w-full bg-orange-500 text-white text-sm sm:text-base px-4 py-2 rounded-xl hover:bg-orange-600 transition duration-300 shadow-md"
      >
        Quick Add
      </button>
    </div>
  );
};

export default ProductCard;

// ####################################importent##############################################

 // nicher code tuko rakhte hobe cause badge er kisu beper ase jodi proyojon hoy


// import React from "react";
// import { useCart } from "../context_or_provider/CartContext";
// import { useNavigate } from "react-router-dom";
//
// const ProductCard = ({ product }) => {
//   const { addToCart } = useCart();
//   const navigate = useNavigate();
//
//   return (
//     <div className="border rounded-2xl shadow-sm hover:shadow-xl transition duration-300 p-4 flex flex-col relative bg-white">
//       {/* যদি কোনো product sale এ থাকে */}
//       {product.old_price && (
//         <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs sm:text-sm px-2 py-1 rounded-tr-lg rounded-bl-lg shadow-md">
//           SALE
//         </span>
//       )}
//
//       {/* Product Image */}
//       <div
//         className="flex items-center justify-center cursor-pointer"
//         onClick={() => navigate(`/products/${product.id}`)}
//       >
//         <img
//           src={product.mainimage}
//           alt={product.name}
//           className="h-40 sm:h-48 md:h-56 object-contain transition-transform duration-300 hover:scale-105"
//         />
//       </div>
//
//       {/* Product Name */}
//       <h3
//         onClick={() => navigate(`/products/${product.id}`)}
//         className="mt-3 text-sm sm:text-base font-medium text-gray-800 text-center line-clamp-1 cursor-pointer hover:text-orange-500"
//       >
//         {product.name}
//       </h3>
//
//       {/* Price Section */}
//       <div className="mt-2 flex flex-col items-center">
//         <span className="text-lg sm:text-xl font-bold text-gray-900">
//           Tk {product.price}
//         </span>
//         {product.old_price && (
//           <span className="ml-2 text-sm line-through text-gray-500">
//             Tk {product.old_price}
//           </span>
//         )}
//       </div>
//
//       {/* Quick Add Button */}
//       <button
//         onClick={() => addToCart(product)}
//         className="mt-4 w-full bg-orange-500 text-white text-sm sm:text-base px-4 py-2 rounded-xl hover:bg-orange-600 transition duration-300 shadow-md"
//       >
//         Quick Add
//       </button>
//     </div>
//   );
// };
//
// export default ProductCard;
