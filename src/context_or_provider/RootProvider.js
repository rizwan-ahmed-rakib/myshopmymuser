import React from 'react';
import {SetupProvider} from './myshop/SetupContext';
import {AboutProvider} from './myshop/AboutContext';
import {CartProvider} from "./myshop/CartContext";
import {CategoryProvider} from "./myshop/CategoryContext";
import {ProductsProvider} from "./myshop/ProductsContext";
import {UserWithProfileProvider} from "./pos/profile/userWithProfile";
import {PosProductProvider} from "./pos/products/product_provider";
import {PosCategoryProvider} from './pos/categories/CategoryProvider';
import {PosBrandProvider} from "./pos/brands/BrandProvider";
import {PosUnitProvider} from "./pos/units/UnitProvider";
import {PosSizeProvider} from "./pos/sizes/SizeProvider";
import {PosSubCategoryProvider} from "./pos/subcategories/SubCategoryProvider";
import {PosPurchaseProductProvider} from "./pos/Purchase/purchaseProduct/PurchaseProduct_provider";
import {PosSupplierProvider} from "./pos/Purchase/suppliers/supplierProvider";
import {PosPurchaseReturnProvider} from "./pos/Purchase/purchaseReturnProduct/PurchaseReturn_provider";
import {PosCustomerProvider} from "./pos/Sale/customer/PosCustomerProvider";
import {PosSaleProductProvider} from "./pos/Sale/saleProduct/PosSaleProduct_provider";
import {PosSaleReturnProvider} from "./pos/Sale/saleReturnProduct/PosSaleReturn_provider";
import {PosDamageProductProvider} from "./pos/damageProducts/damage_product_provider";
import {SalaryAdvanceProvider} from "./pos/EmployeeSalaryAdvance/salary_advance_provider";
import {LeaveApplicationProvider} from "./pos/EmployeeLeaveApplicaations/leave_applications_provider";
import {EmployeeLoanProvider} from "./pos/EmployeeLoan/employee_loan_provider";
import {SalaryPaySlipProvider} from "./pos/EmployeeSalaryPayslip/salary_payslip_provider";
import {EmployeeAttendanceProvider} from "./pos/EmployeeAttendance/employee_attendance_provider";
// import {ContactWithMeProvider} from './ContactContext';
// import {ServiceProvider} from './ServiceContext';
// import {ImageGalleryProvider} from './GalleryContext';
// import {MessageProvider} from './MessageContext';
// import {QRcodeProvider} from "./QRcodeContext";
// import {VideoProvider} from "./VideoContext";

const RootProvider = ({children}) => {
    return (
        <AboutProvider>
            <SetupProvider>
                <CategoryProvider>
                    <ProductsProvider>
                        <CartProvider>
                            {/*///////pos provider//////////*/}
                            <UserWithProfileProvider>
                                <PosProductProvider>
                                    <PosDamageProductProvider>
                                        <PosCategoryProvider>
                                            <PosBrandProvider>
                                                <PosUnitProvider>
                                                    <PosSizeProvider>
                                                        <PosSubCategoryProvider>
                                                            <PosPurchaseProductProvider>
                                                                <PosSupplierProvider>
                                                                    <PosPurchaseReturnProvider>
                                                                        <PosCustomerProvider>
                                                                            <PosSaleProductProvider>
                                                                                <PosSaleReturnProvider>
                                                                                    <SalaryAdvanceProvider>
                                                                                        <LeaveApplicationProvider>
                                                                                            <EmployeeLoanProvider>
                                                                                                <SalaryPaySlipProvider>
                                                                                                    <EmployeeAttendanceProvider>
                                                                                                    {/*<QRcodeProvider>*/}
                                                                                                    {/*<QRcodeProvider>*/}
                                                                                                    {children}
                                                                                                    {/*</QRcodeProvider>*/}
                                                                                                    {/*</QRcodeProvider>*/}
                                                                                                    </EmployeeAttendanceProvider>
                                                                                                </SalaryPaySlipProvider>
                                                                                            </EmployeeLoanProvider>
                                                                                        </LeaveApplicationProvider>
                                                                                    </SalaryAdvanceProvider>
                                                                                </PosSaleReturnProvider>
                                                                            </PosSaleProductProvider>
                                                                        </PosCustomerProvider>
                                                                    </PosPurchaseReturnProvider>
                                                                </PosSupplierProvider>
                                                            </PosPurchaseProductProvider>
                                                        </PosSubCategoryProvider>
                                                    </PosSizeProvider>
                                                </PosUnitProvider>
                                            </PosBrandProvider>
                                        </PosCategoryProvider>
                                    </PosDamageProductProvider>
                                </PosProductProvider>
                            </UserWithProfileProvider>
                            {/*//////pos provider/////////////////////////*/}
                        </CartProvider>
                    </ProductsProvider>
                </CategoryProvider>
            </SetupProvider>
        </AboutProvider>

    )
        ;
};

export default RootProvider;
