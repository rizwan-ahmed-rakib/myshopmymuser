// import React from "react";
// import Home from "./myshopPages/Home";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import {Routes, Route} from "react-router-dom";
// import Cart from "./myshopPages/Cart";
// import Contact from "./myshopcomponents/Contact";
// import Refund from "./myshopcomponents/Refund";
// import Return from "./myshopcomponents/Return";
// // import Products from "./myshopPages/Products";
// import WarrantyPeriodList from "./myshopPages/WarrantyPeriodList";
// import ProductDetail from "./myshopPages/ProductDetail";
// import RootProvider from "./context_or_provider/RootProvider";
// import {AuthProvider} from "./context_or_provider/AuthContext";
// import Profile from "./myshopPages/Profile";
// import Login from "./myshopPages/LoginPage";
// import ProtectedRoute from "./context_or_provider/ProtectedRoute";
// import Checkout from "./myshopcomponents/checkout";
// import CheckoutPage from "./myshopPages/CheckoutPage";
// import Orderpage from "./myshopPages/Orderpage";
// import About from "./myshopcomponents/About";
// import CustomerService from "./myshopcomponents/CustomerService";
// import Register from "./myshopPages/Register";
// import ProfileUpdate from "./myshopcomponents/ProfileUpdate";
// import BillingAddress from "./myshopcomponents/BillingAddress";
// import GuestCheckoutPage from "./myshopPages/GuestCheckoutPage";
//
// // import {CartProvider} from "./context_or_provider/CartContext";
//
// function App() {
//       const isAuthenticated = !!localStorage.getItem("access");
//
//     return (
//         <h1 className="">
//             <AuthProvider>
//                 <RootProvider>
//
//
//                     <Routes>
//                         <Route path="/login" element={<Login/>}/>
//
//                         {/* Example routes */}
//                         <Route path="/" element={<Home/>}/>
//                         {/*<Route*/}
//                         {/*    path="/"*/}
//                         {/*    element={*/}
//                         {/*        <ProtectedRoute>*/}
//                         {/*            <Home/>*/}
//                         {/*        </ProtectedRoute>*/}
//                         {/*    }*/}
//                         {/*/>*/}
//                         <Route path="/products" element={<WarrantyPeriodList/>}/>
//                         <Route path="/products/:id" element={<ProductDetail/>}/>
//
//                         <Route path="/products?category=fish&subcategory=sea" element={<WarrantyPeriodList/>}/>
//                         <Route path="//products?category=fish&subcategory=river" element={<WarrantyPeriodList/>}/>
//                         <Route path="/products?category=mangsho&subcategory=goru" element={<WarrantyPeriodList/>}/>
//                         <Route path="/products?category=mangsho&subcategory=chagol" element={<WarrantyPeriodList/>}/>
//                         <Route path="/products?category=mangsho&subcategory=murgi" element={<WarrantyPeriodList/>}/>
//
//                         <Route path="/products?category=electronics&subcategory=blender" element={<WarrantyPeriodList/>}/>
//                         <Route path="/products?category=electronics&subcategory=rice-cooker" element={<WarrantyPeriodList/>}/>
//                         <Route path="/products?category=electronics&subcategory=fridge" element={<WarrantyPeriodList/>}/>
//                         <Route path="/products?category=electronics&subcategory=glider" element={<WarrantyPeriodList/>}/>
//
//
//                         <Route path="/about" element={<About/>}/>
//                         <Route path="/return-policy" element={<Return/>}/>
//                         <Route path="/refund-policy" element={<Refund/>}/>
//                         <Route path="/customer-service" element={<CustomerService/>}/>
//                         <Route path="/contact" element={<Contact/>}/>
//                         <Route path="/register" element={<Register/>}/>
//
//
//                         {/*<div className="flex-grow">*/}
//                         {/*    <Routes>*/}
//                         {/*        <Route path="/profile" element={<div>Profile Page</div>}/>*/}
//                         {/*        <Route path="/cart" element={<Cart/>}/>*/}
//                         {/*    </Routes>*/}
//                         {/*</div>*/}
//
//                         {/*<Route path="/profile" element={<Profile/>}/>*/}
//                         <Route path="/profile" element={
//                             <ProtectedRoute>
//                                 <Profile/>
//                             </ProtectedRoute>
//                         }/>
//                         <Route path="/profileupdate" element={
//                             <ProtectedRoute>
//                                 <ProfileUpdate/>
//                             </ProtectedRoute>
//                         }/>
//
//
//                         {/*<Route path="/cart" element={<Cart/>}/>*/}
//
//                         <Route path="/cart" element={
//                             <ProtectedRoute>
//                                 <Cart/>
//                             </ProtectedRoute>
//                         }/>
//                         <Route path="/billing-address" element={
//                             <ProtectedRoute>
//                                 <BillingAddress/>
//                             </ProtectedRoute>
//                         }/>
//
//                         <Route
//                             path="/checkout"
//                             element={
//                                 isAuthenticated ? (
//                                     <ProtectedRoute>
//                                         <CheckoutPage/>
//                                     </ProtectedRoute>
//                                 ) : (
//                                     <GuestCheckoutPage/>
//                                 )
//                             }
//                         />
//
//                         <Route path="/order" element={
//                             <ProtectedRoute>
//                                 <Orderpage/>
//                             </ProtectedRoute>
//                         }/>
//
//                     </Routes>
//                 </RootProvider>
//             </AuthProvider>
//         </h1>
//     );
// }
//
// export default App;
/////////////////////////////////////////////////////////////////////


import React from "react";
import Home from "./myshop/myshopPages/Home";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import {Routes, Route} from "react-router-dom";
import Cart from "./myshop/myshopPages/Cart";
import Contact from "./myshop/myshopcomponents/Contact";
import Refund from "./myshop/myshopcomponents/Refund";
import Return from "./myshop/myshopcomponents/Return";
// import Products from "./myshopPages/Products";
import Product from "./myshop/myshopPages/Product";
import ProductDetail from "./myshop/myshopPages/ProductDetail";
import RootProvider from "./context_or_provider/RootProvider";
import {AuthProvider} from "./context_or_provider/myshop/AuthContext";
import Profile from "./myshop/myshopPages/Profile";
import Login from "./myshop/myshopPages/LoginPage";
import ProtectedRoute from "./context_or_provider/myshop/ProtectedRoute";
// import Checkout from "./myshop/myshopcomponents/checkout";
import CheckoutPage from "./myshop/myshopPages/CheckoutPage";
import Orderpage from "./myshop/myshopPages/Orderpage";
import About from "./myshop/myshopcomponents/About";
import CustomerService from "./myshop/myshopcomponents/CustomerService";
import Register from "./myshop/myshopPages/Register";
import ProfileUpdate from "./myshop/myshopcomponents/ProfileUpdate";
import BillingAddress from "./myshop/myshopcomponents/BillingAddress";
import GuestCheckoutPage from "./myshop/myshopPages/GuestCheckoutPage";
import Layout from "./POS/components/Layout";
import Dashboard from "./POS/Dashboard/Dashboard";
import Sales from "./POS/Sales/Sales";
import Reports from "./POS/Reports/Reports";
import Stock from "./POS/Stock/Stock";
import Purchase from "./POS/Purchase/Purchase";
import Inventory from "./POS/Inventory/Inventory";
import Cashbox from "./POS/CashBox/cashbox";
import HRM from "./POS/HRM/HRM";
import Marketing from "./POS/Marketing/Marketing";
import CRM from "./POS/CRM/CRM";
import Branches from "./POS/Branches/Branches";
import Users from "./POS/users/Users";
import EmployeeProfilePage from "./POS/HRM/EmployeeList/EmployeeProfilePage";
import EmployeeGrid from "./POS/HRM/EmployeeList/EmployeeGrid";
// import EmployeeSalaryAdvanceGrid from "./POS/Stock/EmployeeSalaryAdvanceList/EmployeeSalaryAdvanceGrid";
import ProductGrid from "./POS/Inventory/ProductList/ProductGrid";
import ProductDetailsPage from "./POS/Inventory/ProductList/ProductDetailsPage";
import CategoryGrid from "./POS/Inventory/CategoryList/CategoryGrid";
import CategoryDetailsPage from "./POS/Inventory/CategoryList/CategoryDetailsPage";
import BrandDetailsPage from "./POS/Inventory/BrandList/BrandDetailsPage";
import BrandsGrid from "./POS/Inventory/BrandList/BrandsGrid";
import SubCategoryDetailsPage from "./POS/Inventory/SubcategoryList/SubCategoryDetailsPage";
import SubCateforyGrid from "./POS/Inventory/SubcategoryList/SubCateforyGrid";
import UnitDetailsPage from "./POS/Inventory/UnitList/UnitDetailsPage";
import UnitGrid from "./POS/Inventory/UnitList/UnitGrid";
import SizeDetailsPage from "./POS/Inventory/SizeList/SizeDetailsPage";
import SizeGrid from "./POS/Inventory/SizeList/SizeGrid";
import PurchaseGrid from "./POS/Purchase/PurchaseProduct/PurchaseGrid";
import PurchaseReturnGrid from "./POS/Purchase/PurchaseReturn/PurchaseReturnGrid";
import PurchaseDetailsPage from "./POS/Purchase/PurchaseProduct/PurchaseDetailsPage";
import SupplierProfilePage from "./POS/Purchase/SupplierList/SupplierProfilePage";
import SupplierGrid from "./POS/Purchase/SupplierList/SupplierGrid";
import PurchaseReturnDetailsPage from "./POS/Purchase/PurchaseReturn/PurchaseReturnDetailsPage";
import SaleGrid from "./POS/Sales/SaleProduct/SaleGrid";
import SaleReturnGrid from "./POS/Sales/SaleReturn/SaleReturnGrid";
import SaleDetailsPage from "./POS/Sales/SaleProduct/SaleDetailsPage";
import SaleReturnDetailsPage from "./POS/Sales/SaleReturn/SaleReturnDetailsPage";
import CustomerProfilePage from "./POS/Sales/CustomerList/CustomerProfilePage";
import CustomerGrid from "./POS/Sales/CustomerList/CustomerGrid";
// import DamageProductDetailsPage from "./POS/Inventory/DamageProductList/DamageProductDetailsPage";
// import DamageProductGrid from "./POS/Inventory/DamageProductList/DamageProductGrid";
import ReportDetail from "./POS/Reports/ReportDetail";
import SupplierDuePaymentDetails from "./POS/Purchase/SupplierDuePayment/SupplierDuePaymentDetailsPage";
import CustomerDueCollectionDetails from "./POS/Sales/CustomerDueCollection/CustomerDueCollectionDetailsPage";
import EmployeeLoanDetails from "./POS/HRM/EmployeeLoan/EmployeeLoanDetailsPage";
import ReportsList from "./POS/Reports/ReportsList";
import EmployeeSalaryAdvanceDetailsPage from "./POS/HRM/EmployeeSalaryAdvance/EmployeeSalaryAdvanceDetailsPage";
import EmployeeSalaryPayslipDetailsPage from "./POS/HRM/EmployeeSalaryPayslip/EmployeeSalaryPayslipDetailsPage";
import SettingsPage from "./POS/Settings/SettingsPage";
import DamageProductDetailsPage from "./POS/Stock/DamageProductList/DamageStockDetailsPage";
import DamageStockDetailsPage from "./POS/Stock/DamageProductList/DamageStockDetailsPage";
import EmployeeAttendanceDetailsPage from "./POS/HRM/EmployeeAttendance/EmployeeAttendanceDetailsPage";
import EmployeeLeaveApplicationDetailsPage
    from "./POS/HRM/EmployeeLeaveApplication/EmployeeLeaveApplicationDetailsPage";
// import DamageProductGrid from "./POS/Stock/DamageProductList/DamageProductGrid";
// import DamageStockDetailsPage from "./POS/Stock/DamageProductList/DamageStockDetailsPage";

// import {CartProvider} from "./context_or_provider/CartContext";


const App = () => {

    const isAuthenticated = !!localStorage.getItem("access");

    return (
        <AuthProvider>
            <Router>
                <RootProvider>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>

                        {/* Example routes */}
                        <Route path="/" element={<Home/>}/>
                        {/*<Route*/}
                        {/*    path="/"*/}
                        {/*    element={*/}
                        {/*        <ProtectedRoute>*/}
                        {/*            <Home/>*/}
                        {/*        </ProtectedRoute>*/}
                        {/*    }*/}
                        {/*/>*/}
                        <Route path="/products" element={<Product/>}/>
                        <Route path="/products/:id" element={<ProductDetail/>}/>

                        <Route path="/products?category=fish&subcategory=sea" element={<Product/>}/>
                        <Route path="//products?category=fish&subcategory=river" element={<Product/>}/>
                        <Route path="/products?category=mangsho&subcategory=goru" element={<Product/>}/>
                        <Route path="/products?category=mangsho&subcategory=chagol" element={<Product/>}/>
                        <Route path="/products?category=mangsho&subcategory=murgi" element={<Product/>}/>

                        <Route path="/products?category=electronics&subcategory=blender" element={<Product/>}/>
                        <Route path="/products?category=electronics&subcategory=rice-cooker" element={<Product/>}/>
                        <Route path="/products?category=electronics&subcategory=fridge" element={<Product/>}/>
                        <Route path="/products?category=electronics&subcategory=glider" element={<Product/>}/>


                        <Route path="/about" element={<About/>}/>
                        <Route path="/return-policy" element={<Return/>}/>
                        <Route path="/refund-policy" element={<Refund/>}/>
                        <Route path="/customer-service" element={<CustomerService/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/register" element={<Register/>}/>


                        {/*<div className="flex-grow">*/}
                        {/*    <Routes>*/}
                        {/*        <Route path="/profile" element={<div>Profile Page</div>}/>*/}
                        {/*        <Route path="/cart" element={<Cart/>}/>*/}
                        {/*    </Routes>*/}
                        {/*</div>*/}

                        {/*<Route path="/profile" element={<Profile/>}/>*/}
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/profileupdate" element={
                            <ProtectedRoute>
                                <ProfileUpdate/>
                            </ProtectedRoute>
                        }/>


                        {/*<Route path="/cart" element={<Cart/>}/>*/}

                        <Route path="/cart" element={
                            <ProtectedRoute>
                                <Cart/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/billing-address" element={
                            <ProtectedRoute>
                                <BillingAddress/>
                            </ProtectedRoute>
                        }/>

                        <Route
                            path="/checkout"
                            element={
                                isAuthenticated ? (
                                    <ProtectedRoute>
                                        <CheckoutPage/>
                                    </ProtectedRoute>
                                ) : (
                                    <GuestCheckoutPage/>
                                )
                            }
                        />

                        <Route path="/order" element={
                            <ProtectedRoute>
                                <Orderpage/>
                            </ProtectedRoute>
                        }/>

                    </Routes>

                    <Layout>
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/reports" element={<ReportsList/>}/>
                            <Route path="/reports/detail" element={<ReportDetail/>}/>
                            <Route path="/crm" element={<CRM/>}/>
                            <Route path="/marketing" element={<Marketing/>}/>
                            <Route path="/branches" element={<Branches/>}/>
                            <Route path="/users" element={<Users/>}/>
                            <Route path="/settings" element={<SettingsPage/>}/>


                            <Route path="/cashbox" element={<Cashbox/>}/>
                            <Route path="/sales" element={<Sales/>}>
                                <Route path="details/:id" element={<SaleDetailsPage/>}/>
                                <Route path="sale-return/details/:id" element={<SaleReturnDetailsPage/>}/>
                                <Route path="due-collection/details/:id" element={<CustomerDueCollectionDetails/>}/>
                                <Route path="customer/profile/:id" element={<CustomerProfilePage/>}/>
                            </Route>
                            {/*<Route path="/reports" element={<Reports/>}/>*/}
                            <Route path="/stock" element={<Stock/>}>
                                <Route path="details/:id" element={<DamageStockDetailsPage/>}/>
                            </Route>

                            <Route path="/purchase" element={<Purchase/>}>
                                <Route path="purchase/details/:id" element={<PurchaseDetailsPage/>}/>
                                <Route path="purchase-return/details/:id" element={<PurchaseReturnDetailsPage/>}/>
                                <Route path="due-payment/details/:id" element={<SupplierDuePaymentDetails/>}/>
                                <Route path="supplier/profile/:id" element={<SupplierProfilePage/>}/>
                            </Route>
                            <Route path="/inventory" element={<Inventory/>}>
                                <Route path="product/details/:id" element={<ProductDetailsPage/>}/>
                                <Route path="damage-product/details/:id" element={<DamageProductDetailsPage/>}/>
                                <Route path="category/details/:id" element={<CategoryDetailsPage/>}/>
                                <Route path="subcategory/details/:id" element={<SubCategoryDetailsPage/>}/>
                                <Route path="brand/details/:id" element={<BrandDetailsPage/>}/>
                                <Route path="unit/details/:id" element={<UnitDetailsPage/>}/>
                                <Route path="size/details/:id" element={<SizeDetailsPage/>}/>
                            </Route>
                            <Route path="/hrm" element={<HRM/>}>
                                <Route path="employee/profile/:id" element={<EmployeeProfilePage/>}/>
                                <Route path="loan/details/:id" element={<EmployeeLoanDetails/>}/>
                                <Route path="advance/details/:id" element={<EmployeeSalaryAdvanceDetailsPage/>}/>
                                <Route path="payslip/details/:id" element={<EmployeeSalaryPayslipDetailsPage/>}/>
                                <Route path="attendance/details/:id" element={<EmployeeAttendanceDetailsPage/>}/>
                                <Route path="leave-application/details/:id" element={<EmployeeLeaveApplicationDetailsPage/>}/>
                            </Route>


                        </Routes>

                    </Layout>
                </RootProvider>
            </Router>
        </AuthProvider>
    );
};

export default App;
