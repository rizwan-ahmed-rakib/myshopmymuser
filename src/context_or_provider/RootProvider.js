import React from 'react';
import {SetupProvider} from './myshop/SetupContext';
import {AboutProvider} from './myshop/AboutContext';
import {CartProvider} from "./myshop/CartContext";
import {CategoryProvider} from "./myshop/CategoryContext";
import {ProductsProvider} from "./myshop/ProductsContext";
import {UserWithProfileProvider} from "./pos/profile/userWithProfile";
import {PosAuthProvider} from "./pos/PosAuth/PosAuthContext";
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
import {PosUniqueProductInstanceProvider} from "./pos/UniqueProductInstance/UniqueProductInstanceProvider";
import {PosWarrantyPeriodProvider} from "./pos/warrantyPeriod/WarrantyPeriodProvider";
import {DuePaymentProvider} from "./pos/Purchase/duePayment/DuePaymentProvider";
import {DueCollectionProvider} from "./pos/Sale/dueCollection/DueCollectionProvider";
import {PosSettingsProvider} from "./pos/PosSettings/pos_settings_provider";
import {PosCashboxProvider} from "./pos/cashbox/CashboxProvider";

const RootProvider = ({children}) => {
    return (
        <AboutProvider>
            <SetupProvider>
                <CategoryProvider>
                    <ProductsProvider>
                        <CartProvider>
                            <UserWithProfileProvider>
                                <PosAuthProvider>
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
                                                                                                            <PosUniqueProductInstanceProvider>
                                                                                                                <PosWarrantyPeriodProvider>
                                                                                                                    <DuePaymentProvider>
                                                                                                                        <DueCollectionProvider>
                                                                                                                            <PosSettingsProvider>
                                                                                                                                <PosCashboxProvider>
                                                                                                                                    {children}
                                                                                                                                </PosCashboxProvider>
                                                                                                                            </PosSettingsProvider>
                                                                                                                        </DueCollectionProvider>
                                                                                                                    </DuePaymentProvider>
                                                                                                                </PosWarrantyPeriodProvider>
                                                                                                            </PosUniqueProductInstanceProvider>
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
                                </PosAuthProvider>
                            </UserWithProfileProvider>
                        </CartProvider>
                    </ProductsProvider>
                </CategoryProvider>
            </SetupProvider>
        </AboutProvider>
    );
};

export default RootProvider;
