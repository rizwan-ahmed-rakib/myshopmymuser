import React from "react";
import { useCart } from "../../context_or_provider/myshop/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, setIsCartOpen }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="border rounded-2xl shadow-sm hover:shadow-xl transition duration-300 p-4 flex flex-col relative bg-white">
      {/* SALE badge */}
      {product.isOnSale && (
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs sm:text-sm px-2 py-1 rounded-tr-lg rounded-bl-lg shadow-md">
          SALE
        </span>
      )}

      {/* ProductList image */}
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img
          src={product.mainimage}
          alt={product.name}
          className="h-40 sm:h-48 md:h-56 object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* ProductList name */}
      <h3
        onClick={() => navigate(`/products/${product.id}`)}
        className="mt-3 text-sm sm:text-base font-medium text-gray-800 text-center line-clamp-1 cursor-pointer hover:text-green-500"
      >
        {product.name}
      </h3>

      {/* Price section */}
      <div className="mt-2 flex flex-col items-center">
        <span className="text-lg sm:text-xl font-bold text-gray-900">
          Tk {product.price}
        </span>
        {product.old_price && (
          <span className="ml-2 text-sm line-through text-gray-500">
            Tk {product.old_price}
          </span>
        )}
      </div>

      {/* Quick Add button */}
      <button
        onClick={() => {
          addToCart(product);
          setIsCartOpen(true); // ✅ Parent এর Cart open করবে
        }}
        className="mt-4 w-full bg-green-500 text-white text-sm sm:text-base px-4 py-2 rounded-xl hover:bg-green-600 transition duration-300 shadow-md"
      >
        Quick Add
      </button>
    </div>
  );
};

export default ProductCard;


/////////////////////////////////////////////

// import React, {useState} from "react";
// import Cart from "../myshopPages/Cart";
// import {useCart} from "../context_or_provider/CartContext";
// import {useNavigate} from "react-router-dom";
// import {ShoppingBag} from "lucide-react";
//
// const ProductCard = ({product}) => {
//     const [isCartOpen, setIsCartOpen] = useState(false);
//     const {addToCart, cart} = useCart();
//     const navigate = useNavigate();
//
//     return (
//         <div
//             className="border rounded-2xl shadow-sm hover:shadow-xl transition duration-300 p-4 flex flex-col relative bg-white">
//             {/* Sale Badge */}
//             {product.isOnSale && (
//                 <span
//                     // className="absolute top-2 left-2 bg-orange-500 text-white text-xs sm:text-sm px-2 py-1 rounded-tr-lg rounded-bl-lg shadow-md">
//                     className="absolute top-2 left-2 bg-green-500 text-white text-xs sm:text-sm px-2 py-1 rounded-tr-lg rounded-bl-lg shadow-md">
//           SALE
//         </span>
//             )}
//
//             {/* ProductList Image */}
//             <div
//                 className="flex items-center justify-center cursor-pointer"
//                 onClick={() => navigate(`/products/${product.id}`)}
//             >
//                 <img
//                     src={product.mainimage} // শুধু প্রথম image দেখাচ্ছে
//                     alt={product.name}
//                     className="h-40 sm:h-48 md:h-56 object-contain transition-transform duration-300 hover:scale-105"
//                 />
//             </div>
//
//             {/* ProductList Name */}
//             <h3
//                 onClick={() => navigate(`/products/${product.id}`)}
//                 // className="mt-3 text-sm sm:text-base font-medium text-gray-800 text-center line-clamp-1 cursor-pointer hover:text-orange-500"
//                 className="mt-3 text-sm sm:text-base font-medium text-gray-800 text-center line-clamp-1 cursor-pointer hover:text-green-500"
//             >
//                 {product.name}
//             </h3>
//
//             {/* Price Section */}
//             <div className="mt-2 flex flex-col items-center">
//         <span className="text-lg sm:text-xl font-bold text-gray-900">
//           Tk {product.price}
//         </span>
//                 {product.old_price && (
//                     <span className="ml-2 text-sm line-through text-gray-500">
//             {/*Tk {product.oldPrice.toLocaleString()}*/}
//                         Tk {product.old_price}
//           </span>
//                 )}
//             </div>
//
//             {/* Quick Add Button */}
//             <button
//                 onClick={() => {
//                     addToCart(product);
//                     setIsCartOpen(true);
//                 }}
//                 // className="mt-4 w-full bg-orange-500 text-white text-sm sm:text-base px-4 py-2 rounded-xl hover:bg-orange-600 transition duration-300 shadow-md"
//                 className="mt-4 w-full bg-green-500 text-white text-sm sm:text-base px-4 py-2 rounded-xl hover:bg-green-600 transition duration-300 shadow-md"
//             >
//                 Quick Add
//             </button>
//
//             {/*<button*/}
//             {/*    onClick={() => setIsCartOpen(true)}*/}
//             {/*    className="flex flex-col items-center group relative"*/}
//             {/*>*/}
//             {/*    <ShoppingBag className="text-orange-500 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 dark:text-orange-400"/>*/}
//             {/*    {cart.length > 0 && (*/}
//             {/*        <span*/}
//             {/*            className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">*/}
//             {/*      {cart.length}*/}
//             {/*    </span>*/}
//             {/*    )}*/}
//             {/*    <span*/}
//             {/*        className="hidden md:block text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition dark:text-orange-400">*/}
//             {/*    Cart*/}
//             {/*  </span>*/}
//             {/*</button>*/}
//
//             {/* Cart Sidebar */}
//
//
//
//
//             <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}/>
//
//         </div>
//     );
// };
//
// export default ProductCard;

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
//       {/* ProductList Image */}
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
//       {/* ProductList Name */}
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
