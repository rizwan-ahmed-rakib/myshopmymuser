//
// import React from "react";
// import { useCart } from "../context_or_provider/CartContext";
//
// const Cart = ({ isCartOpen, setIsCartOpen }) => {
//   const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
//
//   // Calculate total price
//   const totalPrice = cart.reduce(
//     (total, item) => total + item.price * item.qty,
//     0
//   );
//
//   return (
//     <>
//       {/* Overlay */}
//       {isCartOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={() => setIsCartOpen(false)}
//         ></div>
//       )}
//
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
//           isCartOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="flex justify-between items-center p-4 border-b">
//             <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
//             <button
//               onClick={() => setIsCartOpen(false)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               ✕
//             </button>
//           </div>
//
//           {/* Cart Items */}
//           <div className="flex-1 overflow-y-auto p-4">
//             {cart.length === 0 ? (
//               <div className="text-center py-10">
//                 <p className="text-gray-500">Your cart is empty</p>
//                 <p className="text-sm text-gray-400 mt-2">
//                   Add some products to get started
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {cart.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
//                   >
//                     <div>
//                       <h3 className="font-medium text-gray-800">{item.name}</h3>
//                       <p className="text-blue-600 font-semibold">
//                         Tk {item.price}
//                       </p>
//                     </div>
//
//                     <div className="flex items-center space-x-2">
//                       {/* Qty - */}
//                       <button
//                         onClick={() => updateQuantity(item.id, item.qty - 1)}
//                         className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
//                         disabled={item.qty <= 1}
//                       >
//                         -
//                       </button>
//
//                       <span className="w-8 text-center font-medium">
//                         {item.qty}
//                       </span>
//
//                       {/* Qty + */}
//                       <button
//                         onClick={() => updateQuantity(item.id, item.qty + 1)}
//                         className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
//                       >
//                         +
//                       </button>
//
//                       {/* Remove */}
//                       <button
//                         onClick={() => removeFromCart(item.id)}
//                         className="ml-2 text-red-500 hover:text-red-700 transition-colors"
//                       >
//                         🗑
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//
//           {/* Footer */}
//           {cart.length > 0 && (
//             <div className="border-t p-4">
//               <div className="flex justify-between mb-4">
//                 <span className="font-semibold text-gray-700">Total:</span>
//                 <span className="font-bold text-lg text-blue-600">
//                   Tkk {totalPrice.toFixed(2)}
//                 </span>
//               </div>
//
//               <div className="flex space-x-2">
//                 <button
//                   onClick={clearCart}
//                   className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors font-medium"
//                 >
//                   Clear
//                 </button>
//
//                 <button
//                   onClick={() => alert("Proceeding to checkout!")}
//                   className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
//                 >
//                   Checkout
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };
//
// export default Cart;


import React from "react";
import {useCart} from "../context_or_provider/CartContext";
import {Link} from "react-router-dom";

const Cart = ({isCartOpen, setIsCartOpen}) => {
    const {cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart} = useCart();

    // ✅ Total price calculation
    const totalPrice = cart.reduce(
        (total, item) => total + parseFloat(item.item_price) * item.quantity,
        0
    );

    return (
        <>
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsCartOpen(false)}
                ></div>
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {cart.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500">Your cart is empty</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Add some products to get started
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                    >
                                        <div>
                                            <h3 className="font-medium text-gray-800">
                                                {item.item_name}
                                            </h3>
                                            <p className="text-blue-600 font-semibold">
                                                Tk {item.item_price}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {/* Qty - */}
                                            <button
                                                onClick={() => decreaseQuantity(item.id)}
                                                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>

                                            <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>

                                            {/* Qty + */}
                                            <button
                                                onClick={() => increaseQuantity(item.id)}
                                                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                                            >
                                                +
                                            </button>

                                            {/* Remove */}
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="border-t p-4">
                            <div className="flex justify-between mb-4">
                                <span className="font-semibold text-gray-700">Total:</span>
                                <span className="font-bold text-lg text-blue-600">
                  Tk {totalPrice.toFixed(2)}
                </span>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={clearCart}
                                    className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors font-medium"
                                >
                                    Clear
                                </button>

                                {/*<button*/}
                                {/*  onClick={() => alert("Proceeding to checkout!")}*/}
                                {/*  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"*/}
                                {/*>*/}
                                {/*  Checkout*/}
                                {/*</button>*/}

                                <Link
                                    to="/checkout"
                                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
                                >
                                    Checkout
                                </Link>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Cart;


