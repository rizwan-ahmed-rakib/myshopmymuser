// import React, {useState, useEffect} from "react";
// import {useParams, useNavigate} from "react-router-dom";
// import {useProducts} from "../context_or_provider/ProductsContext";
// import {useCart} from "../context_or_provider/CartContext";
// import {FaShoppingCart, FaWhatsapp, FaFacebookMessenger} from "react-icons/fa";
// import FeatureBanner from "../components/FeatureBanner";
//
// const ProductDetails = () => {
//     const {id} = useParams();
//     const navigate = useNavigate();
//     const {products} = useProducts(); // ✅ dynamic products context
//     const {addToCart} = useCart();
//
//     const [product, setProduct] = useState(null);
//     const [mainImageIndex, setMainImageIndex] = useState(0);
//     const [qty, setQty] = useState(1);
//
//     useEffect(() => {
//         if (!products) return;
//         const productId = Number(id);
//         const foundProduct = products.find((p) => p.id === productId);
//         setProduct(foundProduct || null);
//     }, [id, products]);
//
//     if (!product) {
//         return (
//             <div className="container mx-auto py-20 px-4">
//                 <p className="text-center text-lg">Product not found or loading...</p>
//             </div>
//         );
//     }
//
//     const {
//         name,
//         price,
//         old_price,
//         mainimage,
//         image1,
//         image2,
//         image3,
//         category_title,
//         preview_text,
//         detail_text,
//         stock_status,
//     } = product;
//
//     const discountAmount = old_price ? Math.round(old_price - price) : 0;
//
//     const handleAddToCart = () => addToCart({...product, qty});
//     const handleBuyNow = () => {
//         addToCart({...product, qty});
//         navigate("/checkout");
//     };
//     const handlePayOnline = () => alert("Payment integration লাগবে এখানে");
//
//     // Image array — শুধু mainimage থাকলে এটাকে array বানাই
//     const images = product.images || (mainimage ? [mainimage] : []);
//
//     return (
//         <div className="max-w-7xl mx-auto container px-4 py-8">
//             <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//                 {/* Left: thumbnails + main image */}
//                 <div className="md:col-span-7 flex gap-6">
//                     <div className="hidden md:flex flex-col gap-3 w-20">
//                         {images.map((img, i) => (
//                             <button
//                                 key={i}
//                                 onClick={() => setMainImageIndex(i)}
//                                 className={`border rounded overflow-hidden p-1 transition-shadow ${
//                                     i === mainImageIndex ? "ring-2 ring-orange-400" : "hover:shadow-md"
//                                 }`}
//                             >
//                                 <img src={img} alt={`${name}-${i}`} className="w-full h-20 object-cover"/>
//                             </button>
//                         ))}
//                     </div>
//
//                     <div className="flex-1 bg-white flex items-center justify-center border rounded p-4">
//                         <img src={images[mainImageIndex]} alt={name} className="max-h-[520px] w-full object-contain"/>
//                     </div>
//                 </div>
//
//                 {/* Right: product info */}
//                 <div className="md:col-span-5 space-y-4">
//                     <h1 className="text-2xl md:text-3xl font-semibold">{name}</h1>
//
//                     <div className="flex items-center gap-3">
//                         <div className="text-2xl font-bold">Tk {price.toLocaleString()}</div>
//                         {old_price && (
//                             <>
//                                 <div
//                                     className="text-sm line-through text-gray-400">Tk {old_price.toLocaleString()}</div>
//                                 <div className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded">
//                                     SAVE Tk {discountAmount}
//                                 </div>
//                             </>
//                         )}
//                     </div>
//
//                     <div className="text-sm text-gray-600">
//                         <span className="font-medium">Category:</span> {category_title} &nbsp; | &nbsp;
//                         <span className={`font-medium ${stock_status ? "text-green-600" : "text-red-600"}`}>
//               {stock_status ? "In Stock" : "Out of stock"}
//             </span>
//                     </div>
//
//                     <p className="text-sm text-gray-700 mt-2">{preview_text}</p>
//
//                     <div className="space-y-3 mt-4">
//                         <div className="flex items-center gap-3">
//                             <div className="flex items-center border rounded">
//                                 <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">-
//                                 </button>
//                                 <div className="px-4 py-2 min-w-[60px] text-center">{qty}</div>
//                                 <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">+</button>
//                             </div>
//
//                             <button
//                                 onClick={handleAddToCart}
//                                 className="flex-1 bg-black text-white py-3 rounded shadow flex items-center justify-center gap-2"
//                             >
//                                 <FaShoppingCart/> Add to cart
//                             </button>
//                         </div>
//
//                         <button onClick={handleBuyNow}
//                                 className="w-full bg-orange-500 text-black py-3 rounded font-medium">
//                             Cash on Delivery - Order Now
//                         </button>
//
//                         <button onClick={handlePayOnline}
//                                 className="w-full bg-yellow-300 text-black py-3 rounded font-medium">
//                             Pay Online
//                         </button>
//
//                         <div className="space-y-2">
//                             <button
//                                 onClick={() => window.open("https://m.me/yourpage", "_blank")}
//                                 className="w-full bg-black text-white py-3 rounded flex items-center justify-center gap-3"
//                             >
//                                 <FaFacebookMessenger/> Chat with us
//                             </button>
//                             <button
//                                 onClick={() => window.open("https://wa.me/8801321208940", "_blank")}
//                                 className="w-full bg-black text-white py-3 rounded flex items-center justify-center gap-3"
//                             >
//                                 <FaWhatsapp/> WhatsApp Us
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             <div className="mt-8 bg-white border rounded p-6">
//                 <h4 className="text-lg font-semibold mb-3">Description</h4>
//                 <div className="prose max-w-none">
//                     <p>{detail_text}</p>
//                 </div>
//             </div>
//
//             <FeatureBanner/>
//         </div>
//     );
// };
//
// export default ProductDetails;



import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context_or_provider/ProductsContext";
import { useCart } from "../context_or_provider/CartContext";
import { FaShoppingCart, FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";
import FeatureBanner from "../components/FeatureBanner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!products) return;
    const productId = Number(id);
    const foundProduct = products.find((p) => p.id === productId);
    setProduct(foundProduct || null);
  }, [id, products]);

  if (!product) {
    return (
      <div className="container mx-auto py-20 px-4">
        <p className="text-center text-lg">Product not found or loading...</p>
      </div>
    );
  }

  const {
    name,
    price,
    old_price,
    mainimage,
    image1,
    image2,
    image3,
    category_title,
    preview_text,
    detail_text,
    stock_status,
  } = product;

  const discountAmount = old_price ? Math.round(old_price - price) : 0;

  const handleAddToCart = () => addToCart({ ...product, qty });
  const handleBuyNow = () => {
    addToCart({ ...product, qty });
    navigate("/checkout");
  };
  const handlePayOnline = () => alert("Payment integration লাগবে এখানে");

  // ✅ সব images array আকারে তৈরি
  const images = [mainimage, image1, image2, image3].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto container px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: thumbnails + main image */}
        <div className="md:col-span-7 flex gap-6">
          <div className="hidden md:flex flex-col gap-3 w-20">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImageIndex(i)}
                className={`border rounded overflow-hidden p-1 transition-shadow ${
                  i === mainImageIndex ? "ring-2 ring-orange-400" : "hover:shadow-md"
                }`}
              >
                <img src={img} alt={`${name}-${i}`} className="w-full h-20 object-cover" />
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white flex items-center justify-center border rounded p-4">
            <img
              src={images[mainImageIndex]}
              alt={name}
              className="max-h-[520px] w-full object-contain"
            />
          </div>
        </div>

        {/* Right: product info */}
        <div className="md:col-span-5 space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold">{name}</h1>

          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">Tk {price.toLocaleString()}</div>
            {old_price > 0 && (
              <>
                <div className="text-sm line-through text-gray-400">
                  Tk {old_price.toLocaleString()}
                </div>
                <div className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  SAVE Tk {discountAmount}
                </div>
              </>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">Category:</span> {category_title} &nbsp; | &nbsp;
            <span
              className={`font-medium ${
                stock_status ? "text-green-600" : "text-red-600"
              }`}
            >
              {stock_status ? "In Stock" : "Out of stock"}
            </span>
          </div>

          {preview_text && <p className="text-sm text-gray-700 mt-2">{preview_text}</p>}

          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2"
                >
                  -
                </button>
                <div className="px-4 py-2 min-w-[60px] text-center">{qty}</div>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-3 rounded shadow flex items-center justify-center gap-2"
              >
                <FaShoppingCart /> Add to cart
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full bg-orange-500 text-black py-3 rounded font-medium"
            >
              Cash on Delivery - Order Now
            </button>

            <button
              onClick={handlePayOnline}
              className="w-full bg-yellow-300 text-black py-3 rounded font-medium"
            >
              Pay Online
            </button>

            <div className="space-y-2">
              <button
                onClick={() => window.open("https://m.me/yourpage", "_blank")}
                className="w-full bg-black text-white py-3 rounded flex items-center justify-center gap-3"
              >
                <FaFacebookMessenger /> Chat with us
              </button>
              <button
                onClick={() => window.open("https://wa.me/8801321208940", "_blank")}
                className="w-full bg-black text-white py-3 rounded flex items-center justify-center gap-3"
              >
                <FaWhatsapp /> WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white border rounded p-6">
        <h4 className="text-lg font-semibold mb-3">Description</h4>
        <div className="prose max-w-none">
          <p>{detail_text}</p>
        </div>
      </div>

      <FeatureBanner />
    </div>
  );
};

export default ProductDetails;

