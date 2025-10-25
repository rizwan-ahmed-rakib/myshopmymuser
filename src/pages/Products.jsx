// import React, {useState, useEffect} from "react";
// import {useSearchParams} from "react-router-dom";
// import {useProducts} from "../context_or_provider/ProductsContext";
// import {useCategory} from "../context_or_provider/CategoryContext";
// import ProductCard from "../components/ProductCard";
//
// const Products = () => {
//     const [searchParams, setSearchParams] = useSearchParams();
//     const categoryParam = searchParams.get("category") || "";
//     const subCategoryParam = searchParams.get("subcategory") || "";
//
//     const {products} = useProducts();
//     const {category} = useCategory();
//
//     const [filteredProducts, setFilteredProducts] = useState([]);
//
//
//     useEffect(() => {
//         if (!products || !category) return;
//
//         let filtered = [...products];
//
//         if (subCategoryParam) {
//             // subcategory object বের করো
//             const selectedChild = category.find(
//                 (cat) => cat.title.toLowerCase() === subCategoryParam.toLowerCase()
//             );
//
//             if (selectedChild) {
//                 filtered = filtered.filter(
//                     (p) => p.category === selectedChild.id
//                 );
//             } else {
//                 filtered = []; // যদি না মিলে, কিছুই দেখাবে না
//             }
//         } else if (categoryParam) {
//             const selectedParent = category.find(
//                 (cat) => cat.title.toLowerCase() === categoryParam.toLowerCase()
//             );
//
//             if (selectedParent) {
//                 // parent + তার children এর id list বের করো
//                 const allowedIds = [
//                     selectedParent.id,
//                     ...selectedParent.children.map((c) => c.id)
//                 ];
//
//                 filtered = filtered.filter((p) => allowedIds.includes(p.category));
//             }
//         }
//
//         setFilteredProducts(filtered);
//     }, [products, category, categoryParam, subCategoryParam]);
//
//
//     const handleCategoryClick = (cat, subcat = "") => {
//         if (subcat) {
//             setSearchParams({category: cat, subcategory: subcat});
//         } else {
//             setSearchParams({category: cat});
//         }
//     };
//
//     if (!category) return <p>Loading...</p>;
//
//     return (
//         <div className="flex max-w-7xl mx-auto px-6 py-10 gap-6">
//             {/* Sidebar */}
//             <aside className="w-64 bg-white border rounded-lg p-4">
//                 <h3 className="font-bold mb-4">Categories</h3>
//                 <ul className="space-y-2">
//                     {category
//                         .filter((cat) => cat.parent === null) // শুধুমাত্র parent category গুলো
//                         .map((cat) => (
//                             <li key={cat.id}>
//                                 <button
//                                     onClick={() => handleCategoryClick(cat.title)}
//                                     className="hover:text-orange-600 font-medium"
//                                 >
//                                     {cat.title}
//                                 </button>
//
//                                 {cat.children.length > 0 && (
//                                     <ul className="ml-4 text-sm text-gray-600 space-y-1">
//                                         {cat.children.map((child) => (
//                                             <li key={child.id}>
//                                                 <button
//                                                     onClick={() => handleCategoryClick(cat.title, child.title)}
//                                                     className="hover:text-orange-600"
//                                                 >
//                                                     {child.title}
//                                                 </button>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </li>
//                         ))}
//                 </ul>
//             </aside>
//
//             {/* Products grid */}
//             <main className="flex-1">
//                 {/*<h2 className="text-2xl font-bold mb-6">*/}
//                 {/*    {categoryParam*/}
//                 {/*        ? `Showing products for "${categoryParam}"`*/}
//                 {/*        : "All Products"}*/}
//                 {/*</h2>*/}
//
//                 <h2 className="text-2xl font-bold mb-6">
//                     {subCategoryParam
//                         ? `Showing products for "${subCategoryParam}"`
//                         : categoryParam
//                             ? `Showing products for "${categoryParam}"`
//                             : "All Products"}
//                 </h2>
//
//                 {!products ? (
//                     <p className="text-gray-500">Loading products...</p>
//                 ) : filteredProducts.length === 0 ? (
//                     <p className="text-gray-500">No products found.</p>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                         {filteredProducts.map((product) => (
//                             <ProductCard key={product.id} product={product}/>
//                         ))}
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };
//
// export default Products;


import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context_or_provider/ProductsContext";
import { useCategory } from "../context_or_provider/CategoryContext";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const subCategoryParam = searchParams.get("subcategory") || "";

  const { products } = useProducts();
  const { category } = useCategory();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!products || !category) return;

    let filtered = [...products];

    if (subCategoryParam) {
      const selectedChild = category.find(
        (cat) => cat.title.toLowerCase() === subCategoryParam.toLowerCase()
      );

      if (selectedChild) {
        filtered = filtered.filter((p) => p.category === selectedChild.id);
      } else {
        filtered = [];
      }
    } else if (categoryParam) {
      const selectedParent = category.find(
        (cat) => cat.title.toLowerCase() === categoryParam.toLowerCase()
      );

      if (selectedParent) {
        const allowedIds = [
          selectedParent.id,
          ...selectedParent.children.map((c) => c.id),
        ];
        filtered = filtered.filter((p) => allowedIds.includes(p.category));
      }
    }

    setFilteredProducts(filtered);
  }, [products, category, categoryParam, subCategoryParam]);

  const handleCategoryClick = (cat, subcat = "") => {
    if (subcat) {
      setSearchParams({ category: cat, subcategory: subcat });
    } else {
      setSearchParams({ category: cat });
    }
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false); // mobile sidebar close after selection
    }
  };

  if (!category) return <p>Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 py-6 gap-6">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden flex justify-between items-center bg-white border rounded-lg p-4">
        <h3 className="font-bold">Categories</h3>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          {isSidebarOpen ? "Close" : "Browse Categories"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white border rounded-lg p-4`}
      >
        <h3 className="font-bold mb-4 hidden md:block">Categories</h3>
        <ul className="space-y-2">
          {category
            .filter((cat) => cat.parent === null)
            .map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryClick(cat.title)}
                  className="hover:text-orange-600 text-left w-full font-medium"
                >
                  {cat.title}
                </button>
                {cat.children.length > 0 && (
                  <ul className="ml-4 text-sm text-gray-600 space-y-1">
                    {cat.children.map((child) => (
                      <li key={child.id}>
                        <button
                          onClick={() =>
                            handleCategoryClick(cat.title, child.title)
                          }
                          className="hover:text-orange-600 text-left w-full"
                        >
                          {child.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
        </ul>
      </aside>

      {/* Products grid */}
      <main className="flex-1">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          {subCategoryParam
            ? `Showing products for "${subCategoryParam}"`
            : categoryParam
            ? `Showing products for "${categoryParam}"`
            : "All Products"}
        </h2>

        {!products ? (
          <p className="text-gray-500">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
