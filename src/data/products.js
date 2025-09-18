// import p1 from '../assetes/p1.jpg'
// import p2 from '../assetes/p2.jpg'
// import p3 from '../assetes/p3.jpg'
// import p4 from '../assetes/p4.jpg'
// import p5 from '../assetes/p5.jpg'
// import p6 from '../assetes/p6.jpg'



// const products = [
//   {
//     id: 1,
//     name: "Organic Spirulina Powder",
//     price: 1200,
//     oldPrice: null,
//     image: p1,
//     isOnSale: false,
//   },
//   {
//     id: 2,
//     name: "Honeyraj Mixed Flower Honey",
//     price: 500,
//     oldPrice: null,
//     image: p2,
//     isOnSale: false,
//   },
//   {
//     id: 3,
//     name: "Sundarban Honey",
//     price: 2000,
//     oldPrice: 2500,
//     image: p3,
//     isOnSale: true,
//   },
//   {
//     id: 4,
//     name: "Honey Special Combo Pack",
//     price: 1700,
//     oldPrice: 1950,
//     image: p4,
//     isOnSale: true,
//   },
//    {
//     id: 4,
//     name: "Honey Special Combo Pack",
//     price: 1700,
//     oldPrice: 1950,
//     image: p5,
//     isOnSale: true,
//   },
//    {
//     id: 4,
//     name: "Honey Special Combo Pack",
//     price: 1700,
//     oldPrice: 1950,
//     image: p6,
//     isOnSale: true,
//   },
// ];

// export default products;


import p1 from '../assetes/p1.jpg'
import p2 from '../assetes/p2.jpg'
import p3 from '../assetes/p3.jpg'
import p4 from '../assetes/p4.jpg'
import p5 from '../assetes/p5.jpg'
import p6 from '../assetes/p6.jpg'

const products = [
  {
    id: 0,
    name: "Organic Powder",
    price: 1200,
    oldPrice: null,
    images: [p1, p2, p3] ,
    isOnSale: false,
    category: "medicine",
    subcategory: "supplement",
  },
  {
    id: 1,
    name: "Organic Spirulina Powder",
    price: 1200,
    oldPrice: null,
    images: [p3, p1, p5] ,
    isOnSale: false,
    category: "medicine",
    subcategory: "supplement",
  },
  {
    id: 2,
    name: "Honeyraj Mixed Flower Honey",
    price: 500,
    oldPrice: null,
    images: [p2, p6, p4] ,
    isOnSale: false,
    category: "medicine",
    subcategory: "honey",
  },
  {
    id: 3,
    name: "Sundarban Honey",
    price: 2000,
    oldPrice: 2500,
    images: [p5, p4, p3] ,
    isOnSale: true,
    category: "medicine",
    subcategory: "honey",
  },
  {
    id: 4,
    name: "Fresh Hilsha Fish",
    price: 1700,
    oldPrice: 1950,
    images: [p6, p2, p1] ,
    isOnSale: true,
    category: "fish",
    subcategory: "sea",
  },
  {
    id: 5,
    name: "Deshi Rui Fish",
    price: 900,
    oldPrice: null,
    images: [p4, p2, p5] ,
    isOnSale: false,
    category: "fish",
    subcategory: "river",
  },
  {
    id: 6,
    name: "Premium Beef",
    price: 650,
    oldPrice: null,
    images: [p1, p5, p6] ,
    isOnSale: false,
    category: "mangsho",
    subcategory: "goru",
  },
   {
    id: 7,
    name: "Walton Fridge",
    price: 7650,
    oldPrice: null,
    images: [p3, p2, p5] ,
    isOnSale: false,
    category: "electronics",
    subcategory: "fridge",
  },
   {
    id: 7,
    name: "Walton Glider",
    price: 7650,
    oldPrice: null,
    images: [p6, p2, p3] ,
    isOnSale: false,
    category: "electronics",
    subcategory: "glider",
  },
   {
    id: 7,
    name: "Walton Blender",
    price: 76550,
    oldPrice: null,
    images: [p1, p2, p3] ,
    isOnSale: false,
    category: "electronics",
    subcategory: "blender",
  },
   {
    id: 7,
    name: "Kiam Rice Cooker",
    price: 7650,
    oldPrice: null,
    images: [p4, p5, p6] ,
    isOnSale: false,
    category: "electronics",
    subcategory: "rice-cooker",
  },
];

export default products;
