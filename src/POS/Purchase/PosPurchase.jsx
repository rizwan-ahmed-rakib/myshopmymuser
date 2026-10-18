import React, {useCallback, useEffect, useRef, useState} from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import axios from "axios";
import Tesseract from "tesseract.js";
import {posProductAPI} from "../../context_or_provider/pos/products/productAPI";
import {posPurchaseProductAPI} from "../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
import {posSupplierAPI} from "../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
import {posCategoryAPI} from "../../context_or_provider/pos/categories/categoryAPI";
import {posSubCategoryAPI} from "../../context_or_provider/pos/subcategories/subCategoryApi";
import {posBrandAPI} from "../../context_or_provider/pos/brands/brandAPI";
import {posSizeAPI} from "../../context_or_provider/pos/sizes/sizeAPI";
import {posUnitAPI} from "../../context_or_provider/pos/units/unitAPI";
import BASE_URL_of_POS from "../../posConfig";
import Navbar from "../components/Navbar";
import BaseModal from "../components/BaseModal";
import SuccessModal from "../components/SuccessModal";
import {
    ShoppingCart, Plus, Banknote, Eye, UserPlus,
    Search, Sparkles, ChevronRight, Coins, RefreshCcw, Folder, FolderOpen, Copy,
    Clock, FileText, PauseCircle, ScanLine, Smartphone,
} from "lucide-react";
import AddSupplierModal from "./SupplierList/AddSupplierModal";
import {getPurchasePrintLayout} from "./PurchaseProduct/PurchasePrintLayout";
import {getBrandedVoucher} from "../utils/printTemplates";
import {useQuickCash} from "../../context_or_provider/pos/QuickCash/quick_cash_provider";
import HoldListModal from "../components/HoldAndQuotation/HoldListModal";
import QuotationListModal from "../components/HoldAndQuotation/QuotationListModal";
import CreateQuotationModal from "../components/HoldAndQuotation/CreateQuotationModal";
import {posHoldQuotationAPI} from "../../context_or_provider/pos/HoldQuotation/holdQuotationAPI";
import {printQuotation} from "../utils/quotationPrintTemplate";
import CameraCapture from "../components/imagecapture/CameraCapture";
import {parseExpiryText} from "../utils/parseExpiryText";
import ExpiryScannerModal from "../components/imagecapture/ExpiryScannerModal";
import BarcodeScannerModal from "../components/imagecapture/BarcodeScannerModal";
import RemoteScannerPairingModal from "../components/imagecapture/RemoteScannerPairingModal";
import UpdateProductModal from "../Inventory/ProductList/UpdateProductModal";
import {useDebounce} from "../hooks/useDebounce";


const customSelectStyles = {
    control: (provided) => ({
        ...provided,
        minHeight: "28px",
        height: "28px",
        fontSize: "10px",
        fontWeight: "700",
        borderRadius: "0.5rem",
        borderColor: "#d1d5db",
        boxShadow: "none",
        "&:hover": {borderColor: "#3b82f6"},
    }),
    valueContainer: (provided) => ({...provided, height: "28px", padding: "0 6px"}),
    input: (provided) => ({...provided, margin: "0px", padding: "0px"}),
    indicatorsContainer: (provided) => ({...provided, height: "28px"}),
    dropdownIndicator: (provided) => ({...provided, padding: "2px"}),
    menu: (provided) => ({...provided, fontSize: "10px", zIndex: 50}),
    option: (provided, state) => ({
        ...provided,
        fontSize: "10px",
        fontWeight: state.isSelected ? "700" : "500",
        padding: "4px 8px",
    }),
};

const emptyItem = {
    product: null,
    product_name: "",
    unit_price: 0,
    quantity: 1,
    discount_type: "fixed",
    discount_value: 0,
    discount_amount: 0,
    total_price: 0,
    has_expiry: false,
    manufacturing_date: "",
    shelf_life_days: 0,
    batch_no: "",
    expiry_date: "",
    category_name: "",
    show_box_calc: false,
    show_expiry_calc: false,
    show_spec_products: false,
    spec_products_list: [],
    /* 🆕 Carton hierarchy */
    carton_qty: 0,
    boxes_per_carton: 0,
    box_qty: 0,
    /* ─── */
    pcs_per_box: 0,
    strips_per_box: 0,
    pcs_per_strip: 0,
    loose_qty: 0,
    loose_strips: 0,
    price_per_box: 0,
};

const dataUrlToFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, {type: mime});
};

const PAGE_SIZE = 20;

const PosPurchase = () => {
    /* ============================================================
     STATES
     ============================================================ */
    const [supplier, setSupplier] = useState(null);
    const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
    const [isViewSupplierOpen, setIsViewSupplierOpen] = useState(false);
    const [supplierDetails, setSupplierDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isEditProductOpen, setIsEditProductOpen] = useState(false);

    const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
    const [isCreateQuotationOpen, setIsCreateQuotationOpen] = useState(false);
    const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
    const [holdQuotationLoading, setHoldQuotationLoading] = useState(false);
    const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);

    const [items, setItems] = useState([{...emptyItem}]);

    const [paidCash, setPaidCash] = useState(0);
    const [paidMobile, setPaidMobile] = useState(0);
    const [paidBank, setPaidBank] = useState(0);

    const [mobileOperator, setMobileOperator] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [bankAccountNo, setBankAccountNo] = useState("");
    const [paymentProof, setPaymentProof] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [globalDiscountType, setGlobalDiscountType] = useState("fixed");
    const [globalDiscountValue, setGlobalDiscountValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [purchaseNote, setPurchaseNote] = useState("");

    const {quickCashList, addQuickCashOption} = useQuickCash();
    const [givenCash, setGivenCash] = useState(0);
    const [isAddQuickCashOpen, setIsAddQuickCashOpen] = useState(false);
    const [quickCashAmount, setQuickCashAmount] = useState("");
    const [quickCashName, setQuickCashName] = useState("");
    const [quickCashLoading, setQuickCashLoading] = useState(false);

    /* ═══════════════════════════════════════════════════════════
       🆕 Server-side product state (pagination + search)
       ═══════════════════════════════════════════════════════════ */
    const [products, setProducts] = useState([]);          // current page items
    const [totalProducts, setTotalProducts] = useState(0); // total count from server
    const [page, setPage] = useState(1);                   // current page
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);       // manual refresh trigger

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [units, setUnits] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedSpecification, setSelectedSpecification] = useState("All");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [selectedSize, setSelectedSize] = useState("All");
    const [selectedUnit, setSelectedUnit] = useState("All");

    // Debounce search input (300ms)
    const debouncedSearch = useDebounce(searchTerm, 300);

    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
    const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(window.innerWidth >= 1024);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const [isExpiryScannerOpen, setIsExpiryScannerOpen] = useState(false);
    const [scannerTargetIndex, setScannerTargetIndex] = useState(null);
    const [isBarcodeCameraOpen, setIsBarcodeCameraOpen] = useState(false);
    const [isRemotePairingOpen, setIsRemotePairingOpen] = useState(false);
    const [isProofCameraOpen, setIsProofCameraOpen] = useState(false);
    const [remoteOcrLoading, setRemoteOcrLoading] = useState(false);

    const barcodeRef = useRef(null);
    const searchInputRef = useRef(null);
    const [focusedProductIndex, setFocusedProductIndex] = useState(-1);
    const productRefs = useRef([]);


    /* ═══════════════════════════════════════════════
       🆕 Resizable Split (Product ↔ Cart)
       ═══════════════════════════════════════════════ */
    const [splitPercent, setSplitPercent] = useState(() => {
        const saved = typeof window !== "undefined"
            ? parseFloat(localStorage.getItem("posPurchaseSplitPercent"))
            : NaN;
        return !isNaN(saved) && saved >= 35 && saved <= 75 ? saved : 60;
    });
    const [isDesktop, setIsDesktop] = useState(false);
    const splitContainerRef = useRef(null);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        try {
            localStorage.setItem("posPurchaseSplitPercent", String(splitPercent));
        } catch (_) {
        }
    }, [splitPercent]);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const update = () => setIsDesktop(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    const startDrag = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        isDraggingRef.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    };

    const stopDrag = useCallback(() => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    }, []);

    const updateSplitFromClientX = useCallback((clientX) => {
        const el = splitContainerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = clientX - rect.left;
        let percent = (x / rect.width) * 100;
        percent = Math.max(35, Math.min(75, percent));
        setSplitPercent(percent);
    }, []);

    useEffect(() => {
        const onMouseMove = (e) => {
            if (!isDraggingRef.current) return;
            e.preventDefault();
            updateSplitFromClientX(e.clientX);
        };
        const onTouchMove = (e) => {
            if (!isDraggingRef.current) return;
            const t = e.touches[0];
            if (t) updateSplitFromClientX(t.clientX);
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", stopDrag);
        window.addEventListener("touchmove", onTouchMove, {passive: false});
        window.addEventListener("touchend", stopDrag);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", stopDrag);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", stopDrag);
        };
    }, [stopDrag, updateSplitFromClientX]);

    const hasActiveFilters =
        selectedCategory !== "All" ||
        selectedSubCategory !== null ||
        selectedSpecification !== "All" ||
        selectedBrand !== "All" ||
        selectedSize !== "All" ||
        selectedUnit !== "All" ||
        searchTerm !== "";

    const handleClearFilters = () => {
        setSelectedCategory("All");
        setSelectedSubCategory(null);
        setSelectedSpecification("All");
        setSelectedBrand("All");
        setSelectedSize("All");
        setSelectedUnit("All");
        setSearchTerm("");
        setPage(1);
    };

    const handleOpenEditProduct = async (item) => {
        if (!item?.product) return;

        let fullProduct = products.find((p) => p.id === item.product);

        if (!fullProduct) {
            try {
                const res = await posProductAPI.getById(item.product);
                fullProduct = res.data;
            } catch (err) {
                console.error("Product fetch failed:", err);
                alert("Product data পাওয়া যায়নি।");
                return;
            }
        }

        if (!fullProduct) {
            alert("Product data পাওয়া যায়নি।");
            return;
        }

        setEditingProduct(fullProduct);
        setIsEditProductOpen(true);
    };

    const handleProductUpdated = async (updatedData) => {
        setRefreshKey((k) => k + 1);
        if (updatedData && editingProduct) {
            setItems((prev) =>
                prev.map((it) => {
                    if (it.product === editingProduct.id) {
                        return {
                            ...it,
                            product_name: updatedData.name || it.product_name,
                            unit_price:
                                updatedData.selling_price ||
                                updatedData.purchase_price ||
                                it.unit_price,
                            category_name: updatedData.category_name || it.category_name,
                            strips_per_box:
                                updatedData.strips_per_box ?? it.strips_per_box,
                            pcs_per_strip:
                                updatedData.pcs_per_strip ?? it.pcs_per_strip,
                            boxes_per_carton:
                                updatedData.boxes_per_carton ?? it.boxes_per_carton,
                            has_expiry: updatedData.has_expiry ?? it.has_expiry,
                        };
                    }
                    return it;
                })
            );
        }
        setEditingProduct(null);
        setIsEditProductOpen(false);
    };

    /* ============================================================
     EFFECTS
     ============================================================ */
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileCartOpen(false);
                setIsCategorySidebarOpen(true);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const counts = [paidCash > 0, paidMobile > 0, paidBank > 0].filter(Boolean).length;
        if (counts > 1) setPaymentMethod("hybrid");
        else if (paidMobile > 0) setPaymentMethod("mobile_banking");
        else if (paidBank > 0) setPaymentMethod("bank");
        else setPaymentMethod("cash");
    }, [paidCash, paidMobile, paidBank]);

    useEffect(() => {
        if (barcodeRef.current) barcodeRef.current.focus();
    }, []);

    /* ═══════════════════════════════════════════════════════════════
       🆕 SERVER-SIDE FETCH: product page + filters + search
       ═══════════════════════════════════════════════════════════════ */
    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            setLoadingProducts(true);
            try {
                const res = await posProductAPI.search(debouncedSearch, {
                    page,
                    page_size: PAGE_SIZE,
                    // ⚠️ _id suffix দিয়ে pathao — frontend value gulo ID
                    category_id: selectedCategory !== "All" ? selectedCategory : undefined,
                    sub_category_id: selectedSubCategory || undefined,
                    brand_id: selectedBrand !== "All" ? selectedBrand : undefined,
                    specification_id: selectedSpecification !== "All" ? selectedSpecification : undefined,
                    size_id: selectedSize !== "All" ? selectedSize : undefined,
                    unit_id: selectedUnit !== "All" ? selectedUnit : undefined,
                });
                if (cancelled) return;
                setProducts(res.data.results || []);
                setTotalProducts(res.data.count || 0);
            } catch (err) {
                if (cancelled) return;
                console.error("Product fetch failed:", err);
                setProducts([]);
                setTotalProducts(0);
            } finally {
                if (!cancelled) setLoadingProducts(false);
            }
        };

        fetchProducts();
        return () => {
            cancelled = true;
        };
    }, [
        debouncedSearch,
        page,
        selectedCategory,
        selectedSubCategory,
        selectedBrand,
        selectedSpecification,
        selectedSize,
        selectedUnit,
        refreshKey,
    ]);

    // Reset page whenever search or filters change
    useEffect(() => {
        setPage(1);
    }, [
        debouncedSearch,
        selectedCategory,
        selectedSubCategory,
        selectedBrand,
        selectedSpecification,
        selectedSize,
        selectedUnit,
    ]);

    // Fetch static dropdown options (categories, brands, etc.)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, subCatRes, brandRes, sizeRes, unitRes] = await Promise.all([
                    posCategoryAPI.getAll(),
                    posSubCategoryAPI.getAll(),
                    posBrandAPI.getAll(),
                    posSizeAPI.getAll(),
                    posUnitAPI.getAll(),
                ]);
                if (catRes?.data) setCategories(catRes.data);
                if (subCatRes?.data) setSubCategories(subCatRes.data);
                if (brandRes?.data) setBrands(brandRes.data);
                if (sizeRes?.data) setSizes(sizeRes.data);
                if (unitRes?.data) setUnits(unitRes.data);
            } catch (err) {
                console.error("Error loading dropdown data:", err);
            }
        };
        fetchData();
    }, []);

    /* Global keyboard shortcuts */
    useEffect(() => {
        const anyModalOpen =
            isPaymentModalOpen ||
            isExpiryScannerOpen ||
            isBarcodeCameraOpen ||
            isRemotePairingOpen ||
            isProofCameraOpen ||
            isMobileCartOpen ||
            isAddSupplierOpen ||
            isViewSupplierOpen ||
            isAddQuickCashOpen ||
            isHoldModalOpen ||
            isQuotationModalOpen ||
            isCreateQuotationOpen;

        if (anyModalOpen) return;

        const handler = (e) => {
            const tag = (e.target.tagName || "").toLowerCase();
            const isBarcodeReceptor = e.target === barcodeRef.current;
            const searchFocused = document.activeElement === searchInputRef.current;
            const isEditable =
                !isBarcodeReceptor &&
                (tag === "input" ||
                    tag === "textarea" ||
                    tag === "select" ||
                    e.target.isContentEditable);

            if (searchFocused) {
                if (e.key === "Delete") {
                    e.preventDefault();
                    setSearchTerm("");
                    return;
                }
                if (e.key === "ArrowDown" && products.length > 0) {
                    e.preventDefault();
                    searchInputRef.current?.blur();
                    setFocusedProductIndex(0);
                    return;
                }
                if (e.key === "Escape") {
                    searchInputRef.current?.blur();
                    return;
                }
                return;
            }

            if (isEditable) return;

            if (
                e.key === "ArrowDown" ||
                e.key === "ArrowRight" ||
                e.key === "ArrowUp" ||
                e.key === "ArrowLeft"
            ) {
                if (products.length > 0) {
                    e.preventDefault();
                    const firstTop = productRefs.current[0]?.offsetTop;
                    let cols = 0;
                    for (const el of productRefs.current) {
                        if (el?.offsetTop === firstTop) cols++;
                        else break;
                    }

                    setFocusedProductIndex((prev) => {
                        let next = prev;
                        if (prev < 0) next = 0;
                        else if (e.key === "ArrowRight")
                            next = Math.min(prev + 1, products.length - 1);
                        else if (e.key === "ArrowLeft") next = Math.max(prev - 1, 0);
                        else if (e.key === "ArrowDown")
                            next = Math.min(prev + cols, products.length - 1);
                        else if (e.key === "ArrowUp") next = Math.max(prev - cols, 0);
                        return next;
                    });
                    return;
                }
            }

            if (
                e.key === "Enter" &&
                focusedProductIndex >= 0 &&
                products[focusedProductIndex]
            ) {
                e.preventDefault();
                const product = products[focusedProductIndex];
                handleAddProductToCart(product);
                return;
            }

            if (e.key === "Escape" && focusedProductIndex >= 0) {
                e.preventDefault();
                setFocusedProductIndex(-1);
                searchInputRef.current?.focus();
                return;
            }

            if (
                e.key === "Shift" ||
                e.key === "Control" ||
                e.key === "Alt" ||
                e.key === "Meta" ||
                e.key === "Tab" ||
                e.key === "Escape" ||
                e.key === "Enter" ||
                e.key === "CapsLock" ||
                e.key === "Home" ||
                e.key === "End" ||
                e.key === "PageUp" ||
                e.key === "PageDown"
            ) {
                return;
            }

            if (e.key.length === 1) {
                e.preventDefault();
                setFocusedProductIndex(-1);
                searchInputRef.current?.focus();
                setSearchTerm((prev) => prev + e.key);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [
        isPaymentModalOpen,
        isExpiryScannerOpen,
        isBarcodeCameraOpen,
        isRemotePairingOpen,
        isProofCameraOpen,
        isMobileCartOpen,
        isAddSupplierOpen,
        isViewSupplierOpen,
        isAddQuickCashOpen,
        isHoldModalOpen,
        isQuotationModalOpen,
        isCreateQuotationOpen,
        products,
        focusedProductIndex,
    ]);

    useEffect(() => {
        if (focusedProductIndex >= 0 && productRefs.current[focusedProductIndex]) {
            productRefs.current[focusedProductIndex].scrollIntoView({
                block: "nearest",
                behavior: "smooth",
            });
        }
    }, [focusedProductIndex]);

    useEffect(() => {
        if (focusedProductIndex >= products.length) {
            setFocusedProductIndex(
                products.length > 0 ? products.length - 1 : -1
            );
        }
    }, [products.length, focusedProductIndex]);

    /* ═══════════════════════════════════════════════════════════════
       🆕 SPECIFICATIONS (from current page — kept light)
       ═══════════════════════════════════════════════════════════════ */
    const availableSpecifications = React.useMemo(() => {
        const specMap = new Map();
        const countMap = new Map();
        products.forEach((p) => {
            const specId = p.specification || p.specification_id;
            const specName =
                p.specification_name ||
                p.specification_title ||
                p.specification_details ||
                (typeof p.specification === "object" ? p.specification?.name : null);
            if (specId) {
                const key = String(specId);
                const label = specName || `Specification #${specId}`;
                if (!specMap.has(key)) {
                    specMap.set(key, {
                        id: specId,
                        name: label,
                        sub_category:
                            p.sub_category ||
                            p.sub_category_id ||
                            p.subcategory ||
                            p.subcategory_id,
                        category: p.category || p.category_id,
                    });
                }
                countMap.set(key, (countMap.get(key) || 0) + 1);
            }
        });
        return Array.from(specMap.values()).map((sp) => ({
            ...sp,
            count: countMap.get(String(sp.id)) || 0,
        }));
    }, [products]);

    /* ============================================================
     OPTION LOADERS
     ============================================================ */
    const loadSupplierOptions = async (inputValue) => {
        const res = await posSupplierAPI.search(inputValue || "");
        return (res.data || []).map((s) => ({
            value: s.id,
            label: `${s.name} ${s.phone ? `(${s.phone})` : ""}`,
            due_amount: Number(s.due_amount || 0),
        }));
    };

    const loadProductOptions = async (inputValue) => {
        if (!inputValue) return [];
        try {
            const res = await posProductAPI.search(inputValue, {
                page_size: 20,
            });
            // ⚠️ server-side paginated → .results
            return (res.data.results || []).map((p) => ({
                value: p.id,
                label: `${p.name} (${p.product_code || ""})`,
                unit_price: Number(p.purchase_price || 0),
                product_name: p.name,
                has_expiry: p.has_expiry,
                category_name: p.category_name || "",
                specification: p.specification || p.specification_id,
                boxes_per_carton: p.boxes_per_carton || 0,
                strips_per_box: p.strips_per_box || 0,
                pcs_per_strip: p.pcs_per_strip || 0,
            }));
        } catch (err) {
            console.error("Error loading product options:", err);
            return [];
        }
    };

    /* ═══════════════════════════════════════════════════════════════
       🆕 Server-side spec product fetch (used by "Same Spec" panel)
       ═══════════════════════════════════════════════════════════════ */
    const fetchSpecProductsList = async (specificationId) => {
        if (!specificationId) return [];
        try {
            const res = await posProductAPI.search("", {
                specification_id: specificationId,   // ← _id suffix
                page_size: 100,
            });
            return res.data.results || [];
        } catch (err) {
            console.error("Spec products fetch failed:", err);
            return [];
        }
    };

    const loadSameSpecificationProducts = async (index, specificationId) => {
        if (!specificationId) return;
        const specProducts = await fetchSpecProductsList(specificationId);
        setItems((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                spec_products_list: specProducts || [],
            };
            return updated;
        });
    };

    /* ============================================================
     ROW HELPERS
     ============================================================ */
    const duplicateRow = (index) => {
        setItems((prev) => {
            const updated = [...prev];
            const src = updated[index];
            const newItem = {
                ...emptyItem,
                product: src.product,
                product_name: src.product_name,
                unit_price: src.unit_price,
                has_expiry: src.has_expiry,
                category_name: src.category_name,
                manufacturing_date: src.manufacturing_date || "",
                expiry_date: src.expiry_date || "",
                shelf_life_days: src.shelf_life_days || 0,
                batch_no: src.batch_no || "",
                quantity: 1,
                discount_type: src.discount_type,
                discount_value: 0,
                discount_amount: 0,
                total_price: src.unit_price,
                show_box_calc: false,
                boxes_per_carton: src.boxes_per_carton || 0,
                strips_per_box: src.strips_per_box || 0,
                pcs_per_strip: src.pcs_per_strip || 0,
            };
            updated.splice(index + 1, 0, newItem);
            return updated;
        });
    };

    const calculateExpiryDate = (mfgDate, shelfLifeDays) => {
        if (!mfgDate || !shelfLifeDays) return "";
        let normalizedMfg = mfgDate;
        if (mfgDate.length === 7) normalizedMfg = `${mfgDate}-01`;
        const date = new Date(normalizedMfg);
        if (isNaN(date.getTime())) return "";
        date.setDate(date.getDate() + Number(shelfLifeDays));
        return date.toISOString().split("T")[0];
    };

    const calculateShelfLifeDays = (mfgDate, expDate) => {
        if (!mfgDate || !expDate) return 0;
        let normalizedMfg = mfgDate;
        if (mfgDate.length === 7) normalizedMfg = `${mfgDate}-01`;
        let normalizedExp = expDate;
        if (expDate.length === 7) {
            const [year, month] = expDate.split("-");
            const lastDay = new Date(Number(year), Number(month), 0).getDate();
            normalizedExp = `${expDate}-${String(lastDay).padStart(2, "0")}`;
        }
        const d1 = new Date(normalizedMfg);
        const d2 = new Date(normalizedExp);
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
        const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const calculateRemainingDays = (expiryDate) => {
        if (!expiryDate) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const exp = new Date(expiryDate);
        exp.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    /* ═══ Expiry completeness helpers ═══ */
    const isExpiryPending = (item) =>
        !!(item.product && item.has_expiry && !item.expiry_date);

    const getPendingExpiryItems = () =>
        items.filter(isExpiryPending);

    const handleExpiryDateChange = (index, field, value) => {
        setItems((prev) => {
            const updated = [...prev];
            const item = {...updated[index]};
            if (field === "manufacturing_date") {
                let mfg = value;
                if (mfg.length === 7) mfg = `${mfg}-01`;
                item.manufacturing_date = mfg;
                if (item.shelf_life_days > 0) {
                    item.expiry_date = calculateExpiryDate(mfg, item.shelf_life_days);
                } else if (item.expiry_date) {
                    item.shelf_life_days = calculateShelfLifeDays(mfg, item.expiry_date);
                }
            } else if (field === "shelf_life_days") {
                const days = Number(value) || 0;
                item.shelf_life_days = days;
                if (item.manufacturing_date && days > 0) {
                    item.expiry_date = calculateExpiryDate(item.manufacturing_date, days);
                }
            } else if (field === "expiry_date") {
                let exp = value;
                if (exp.length === 7) {
                    const [year, month] = exp.split("-");
                    const lastDay = new Date(Number(year), Number(month), 0).getDate();
                    exp = `${exp}-${String(lastDay).padStart(2, "0")}`;
                }
                item.expiry_date = exp;
                if (item.manufacturing_date) {
                    item.shelf_life_days = calculateShelfLifeDays(item.manufacturing_date, exp);
                }
            }
            updated[index] = item;
            return updated;
        });
    };

    /* ═══════════════════════════════════════════════
       🆕 Box Calculator (Carton + Loose Box)
       ═══════════════════════════════════════════════ */
    const handleBoxCalcChange = (index, field, value) => {
        setItems((prev) => {
            const updated = [...prev];
            const item = {...updated[index], [field]: Number(value)};
            const isMedicine = item.category_name?.toLowerCase().includes("medicine");

            let calculatedQty = item.quantity;
            let calculatedUnitPrice = item.unit_price;

            const totalBoxes =
                (item.carton_qty || 0) * (item.boxes_per_carton || 0) +
                (item.box_qty || 0);

            if (isMedicine) {
                const pcsPerStrip = item.pcs_per_strip || 0;
                const stripsPerBox = item.strips_per_box || 0;
                const pcsPerBox = stripsPerBox * pcsPerStrip;

                calculatedQty =
                    totalBoxes * pcsPerBox +
                    (item.loose_strips || 0) * pcsPerStrip +
                    (item.loose_qty || 0);

                if (pcsPerBox > 0) {
                    calculatedUnitPrice = (item.price_per_box || 0) / pcsPerBox;
                }
            } else {
                const pcsPerBox = item.pcs_per_box || 0;
                calculatedQty = totalBoxes * pcsPerBox + (item.loose_qty || 0);
                if (pcsPerBox > 0) {
                    calculatedUnitPrice = (item.price_per_box || 0) / pcsPerBox;
                }
            }

            const newItem = {
                ...item,
                quantity: calculatedQty || 1,
                unit_price: Number(calculatedUnitPrice.toFixed(2)) || item.unit_price,
            };
            const {total_price, discount_amount} = calculateItemTotal(newItem);
            updated[index] = {...newItem, total_price, discount_amount};
            return updated;
        });
    };

    const selectProduct = async (option, index) => {
        const specId = option.specification_id || option.specification;
        const specList = specId ? await fetchSpecProductsList(specId) : [];
        updateItem(index, {
            product: option.value,
            product_name: option.product_name,
            unit_price: option.unit_price,
            quantity: 1,
            has_expiry: option.has_expiry,
            manufacturing_date: "",
            shelf_life_days: 0,
            batch_no: "",
            expiry_date: "",
            category_name: option.category_name || "",
            show_box_calc: false,
            carton_qty: 0,
            boxes_per_carton: option.boxes_per_carton || 0,
            box_qty: 0,
            pcs_per_box: 0,
            strips_per_box: option.strips_per_box || 0,
            pcs_per_strip: option.pcs_per_strip || 0,
            loose_qty: 0,
            loose_strips: 0,
            price_per_box: 0,
            specification: specId,
            spec_products_list: specList,
            show_spec_products: false,
        });
    };

    const calculateItemTotal = (item) => {
        const qty = Number(item.quantity) || 0;
        const baseTotal = item.unit_price * qty;
        let discount = 0;
        if (item.discount_type === "percent") {
            discount = (baseTotal * item.discount_value) / 100;
        } else {
            discount = item.discount_value;
        }
        return {
            total_price: Math.max(0, baseTotal - discount),
            discount_amount: discount,
        };
    };

    const updateItem = (index, updates) => {
        setItems((prev) => {
            const updated = [...prev];
            const newItem = {...updated[index], ...updates};
            const {total_price, discount_amount} = calculateItemTotal(newItem);
            updated[index] = {...newItem, total_price, discount_amount};
            return updated;
        });
    };

    const handleAddProductToCart = async (product) => {
        let currentItems = [...items];
        const isEmptyFirstRow =
            currentItems.length === 1 &&
            currentItems[0].product === null &&
            !currentItems[0].manufacturing_date;

        const existingIndex = currentItems.findIndex((item) => item.product === product.id);

        if (existingIndex > -1) {
            const currentQty = currentItems[existingIndex].quantity;
            const updatedItem = {...currentItems[existingIndex], quantity: currentQty + 1};
            const {total_price, discount_amount} = calculateItemTotal(updatedItem);
            currentItems[existingIndex] = {...updatedItem, total_price, discount_amount};
            setItems(currentItems);
        } else {
            const specId = product.specification || product.specification_id;
            const specList = specId ? await fetchSpecProductsList(specId) : [];
            const newItem = {
                product: product.id,
                product_name: product.name,
                unit_price: Number(product.purchase_price || 0),
                quantity: 1,
                discount_type: "fixed",
                discount_value: 0,
                discount_amount: 0,
                total_price: Number(product.purchase_price || 0),
                has_expiry: product.has_expiry,
                manufacturing_date: "",
                shelf_life_days: 0,
                batch_no: "",
                expiry_date: "",
                category_name: product.category_name || "",
                show_box_calc: false,
                carton_qty: 0,
                boxes_per_carton: product.boxes_per_carton || 0,
                box_qty: 0,
                pcs_per_box: 0,
                strips_per_box: product.strips_per_box || 0,
                pcs_per_strip: product.pcs_per_strip || 0,
                loose_strips: 0,
                loose_qty: 0,
                price_per_box: 0,
                specification: specId,
                spec_products_list: specList,
                show_spec_products: false,
            };
            if (isEmptyFirstRow) {
                setItems([newItem]);
            } else {
                setItems([newItem, ...items]);
            }
        }
    };

    /* ============================================================
     BARCODE
     ============================================================ */
    const parseBarcodeData = (code) => {
        let parsed = {
            productCode: code,
            expiryDate: "",
            manufacturingDate: "",
            batchNo: "",
            shelfLifeDays: 0,
        };
        const cleanCode = code.replace(/[\(\)]/g, "");
        const gtinMatch = cleanCode.match(/01(\d{14})/);
        if (gtinMatch) {
            parsed.productCode = gtinMatch[1];
            const expMatch = cleanCode.match(/17(\d{6})/);
            if (expMatch) {
                const yy = expMatch[1].substring(0, 2);
                const mm = expMatch[1].substring(2, 4);
                const dd = expMatch[1].substring(4, 6);
                parsed.expiryDate = `20${yy}-${mm}-${dd}`;
            }
            const mfgMatch = cleanCode.match(/11(\d{6})/);
            if (mfgMatch) {
                const yy = mfgMatch[1].substring(0, 2);
                const mm = mfgMatch[1].substring(2, 4);
                const dd = mfgMatch[1].substring(4, 6);
                parsed.manufacturingDate = `20${yy}-${mm}-${dd}`;
            }
            const batchMatch = cleanCode.match(/10([A-Za-z0-9]+)/);
            if (batchMatch) parsed.batchNo = batchMatch[1];
        }
        if (parsed.manufacturingDate && parsed.expiryDate) {
            parsed.shelfLifeDays = calculateShelfLifeDays(
                parsed.manufacturingDate,
                parsed.expiryDate
            );
        }
        return parsed;
    };

    const processBarcodeCode = async (code) => {
        if (!code) return;
        const parsed = parseBarcodeData(code);
        try {
            let res = await posProductAPI.search(parsed.productCode, {page_size: 10});
            let results = res.data.results || [];
            if (!results.length && parsed.productCode !== code) {
                res = await posProductAPI.search(code, {page_size: 10});
                results = res.data.results || [];
            }
            if (results.length) {
                const p = results[0];
                const productData = {
                    value: p.id,
                    product_name: p.name,
                    unit_price: Number(p.purchase_price),
                    has_expiry: p.has_expiry,
                    category_name: p.category_name || "",
                    manufacturing_date: parsed.manufacturingDate || "",
                    expiry_date: parsed.expiryDate || "",
                    shelf_life_days: parsed.shelfLifeDays || 0,
                    batch_no: parsed.batchNo || "",
                    boxes_per_carton: p.boxes_per_carton || 0,
                    strips_per_box: p.strips_per_box || 0,
                    pcs_per_strip: p.pcs_per_strip || 0,
                };
                setItems((prev) => {
                    const lastItem = prev[prev.length - 1];
                    const isLastEmpty = !lastItem.product;
                    const newItem = {
                        ...(isLastEmpty ? lastItem : emptyItem),
                        product: productData.value,
                        product_name: productData.product_name,
                        unit_price: productData.unit_price,
                        has_expiry: productData.has_expiry,
                        category_name: productData.category_name,
                        manufacturing_date: productData.manufacturing_date,
                        expiry_date: productData.expiry_date,
                        shelf_life_days: productData.shelf_life_days,
                        batch_no: productData.batch_no,
                        boxes_per_carton: productData.boxes_per_carton,
                        strips_per_box: productData.strips_per_box,
                        pcs_per_strip: productData.pcs_per_strip,
                    };
                    const {total_price, discount_amount} = calculateItemTotal(newItem);
                    const updatedItem = {...newItem, total_price, discount_amount};
                    if (isLastEmpty) {
                        const updated = [...prev];
                        updated[prev.length - 1] = updatedItem;
                        return updated;
                    } else {
                        return [...prev, updatedItem];
                    }
                });
            } else {
                alert(`প্রোডাক্ট পাওয়া যায়নি: ${parsed.productCode}`);
            }
        } catch (err) {
            console.error("Barcode scan engine error", err);
        }
    };

    const handleBarcodeScan = async (e) => {
        if (e.key !== "Enter") return;
        const code = e.target.value.trim();
        if (!code) return;
        await processBarcodeCode(code);
        e.target.value = "";
    };

    /* ============================================================
     EXPIRY SCANNER
     ============================================================ */
    const openExpiryScanner = (index) => {
        setScannerTargetIndex(index);
        setIsExpiryScannerOpen(true);
    };

    const handleExpiryExtracted = (data) => {
        if (scannerTargetIndex === null) return;
        setItems((prev) => {
            const updated = [...prev];
            const item = {...updated[scannerTargetIndex]};
            if (data.manufacturing_date) item.manufacturing_date = data.manufacturing_date;
            if (data.expiry_date) item.expiry_date = data.expiry_date;
            if (data.batch_no) item.batch_no = data.batch_no;
            if (item.manufacturing_date && item.expiry_date) {
                item.shelf_life_days = calculateShelfLifeDays(
                    item.manufacturing_date,
                    item.expiry_date
                );
            }
            updated[scannerTargetIndex] = item;
            return updated;
        });
        setScannerTargetIndex(null);
    };

    /* ============================================================
     REMOTE MOBILE
     ============================================================ */
    const handleRemoteImage = async (dataUrl) => {
        if (!dataUrl) return;

        const expiryIndices = items
            .map((it, i) => ({it, i}))
            .filter(({it}) => it.has_expiry && it.product);

        if (!expiryIndices.length) {
            alert("Cart-এ কোনো expiry product নেই। আগে product add করুন।");
            return;
        }

        const targetIdx = expiryIndices[expiryIndices.length - 1].i;

        try {
            setRemoteOcrLoading(true);
            const {data} = await Tesseract.recognize(dataUrl, "eng");
            const parsed = parseExpiryText(data.text || "");

            setItems((prev) => {
                const updated = [...prev];
                const item = {...updated[targetIdx]};
                if (parsed.manufacturing_date)
                    item.manufacturing_date = parsed.manufacturing_date;
                if (parsed.expiry_date) item.expiry_date = parsed.expiry_date;
                if (parsed.batch_no) item.batch_no = parsed.batch_no;
                if (item.manufacturing_date && item.expiry_date) {
                    item.shelf_life_days = calculateShelfLifeDays(
                        item.manufacturing_date,
                        item.expiry_date
                    );
                }
                updated[targetIdx] = item;
                return updated;
            });

            const detected =
                parsed.manufacturing_date || parsed.expiry_date || parsed.batch_no
                    ? "✅ Mobile photo থেকে MFG/EXP/Batch cart-এ বসানো হয়েছে"
                    : "⚠️ কোনো data detect হয়নি। আবার চেষ্টা করুন।";
            alert(detected);
        } catch (err) {
            console.error("Remote OCR failed", err);
            alert("OCR ব্যর্থ — আবার চেষ্টা করুন");
        } finally {
            setRemoteOcrLoading(false);
        }
    };

    // const addRow = () => setItems([...items, {...emptyItem}]);
    // Notun updated code:
    const addRow = () => setItems([{...emptyItem}, ...items]);
    const removeRow = (index) => {
        if (items.length === 1) setItems([{...emptyItem}]);
        else setItems(items.filter((_, i) => i !== index));
    };

    /* ============================================================
     SUMMARY MATH
     ============================================================ */
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const globalDiscountAmount =
        globalDiscountType === "percent"
            ? (subtotal * globalDiscountValue) / 100
            : globalDiscountValue;
    const netTotal = Math.max(0, subtotal - globalDiscountAmount);
    const totalPaid = Number(paidCash) + Number(paidMobile) + Number(paidBank);
    const currentInvoiceDue = netTotal - totalPaid;
    const previousDue = supplier?.due_amount || 0;
    const totalSupplierDue = previousDue + currentInvoiceDue;
    const remainingBalance = Math.max(0, netTotal - paidMobile - paidBank);

    useEffect(() => {
        if (givenCash > 0) setPaidCash(Math.min(givenCash, remainingBalance));
        else setPaidCash(0);
    }, [givenCash, remainingBalance]);

    const handleAddQuickCash = async (e) => {
        e.preventDefault();
        if (!quickCashAmount || Number(quickCashAmount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        try {
            setQuickCashLoading(true);
            const formData = new FormData();
            formData.append("amount", quickCashAmount);
            formData.append("name", quickCashName || `${quickCashAmount} Taka`);
            await addQuickCashOption(formData);
            setQuickCashAmount("");
            setQuickCashName("");
            setIsAddQuickCashOpen(false);
            if (isMobile) setIsMobileCartOpen(true);
        } catch {
            alert("Failed to add quick cash option.");
        } finally {
            setQuickCashLoading(false);
        }
    };

    /* ============================================================
     SUBMIT
     ============================================================ */
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setErrors({});

        if (!supplier) return alert("Supplier is required");
        if (items.some((i) => !i.product)) return alert("All product rows must be filled");

        const pendingExpiry = items.filter(i => i.product && i.has_expiry && !i.expiry_date);
        if (pendingExpiry.length > 0) {
            setIsPaymentModalOpen(false);
            setIsMobileCartOpen(true);
            return alert(`⛔ Expiry date missing for ${pendingExpiry.length} item(s). Payment আটকানো হয়েছে।`);
        }

        const validItems = items.filter((i) => i.product);
        if (validItems.some((i) => Number(i.quantity) <= 0)) {
            return alert("All items must have a valid quantity greater than 0");
        }

        const itemwise_total_discount = validItems.reduce(
            (sum, i) => sum + i.discount_amount,
            0
        );
        const itemsPayload = validItems.map((i) => ({
            product: i.product,
            quantity: Number(i.quantity) || 1,
            unit_price: i.unit_price,
            discount_amount: i.discount_amount,
            net_total: i.total_price,
            manufacturing_date: i.has_expiry ? i.manufacturing_date : null,
            shelf_life_days: i.has_expiry ? i.shelf_life_days : 0,
            batch_no: i.has_expiry ? i.batch_no : "",
            carton_qty: i.carton_qty || 0,
            boxes_per_carton: i.boxes_per_carton || 0,
            box_qty: i.box_qty || 0,
            loose_strips: i.loose_strips || 0,
            loose_qty: i.loose_qty || 0,
        }));

        const payload = {
            supplier: supplier.value,
            paid_cash: paidCash,
            paid_mobile: paidMobile,
            paid_bank: paidBank,
            payment_method: paymentMethod,
            subtotal: subtotal,
            itemwise_total_discount: itemwise_total_discount,
            global_discount: globalDiscountAmount,
            total_discount: itemwise_total_discount + globalDiscountAmount,
            net_total: netTotal,
            items: itemsPayload,
            mobile_operator: paidMobile > 0 ? mobileOperator : "",
            transaction_id: paidMobile > 0 ? transactionId : "",
            bank_account_no: paidBank > 0 ? bankAccountNo : "",
            notes: purchaseNote || "",
        };

        try {
            setLoading(true);
            let res;
            if (paymentProof) {
                const formData = new FormData();
                Object.keys(payload).forEach((key) => {
                    if (key === "items")
                        formData.append(key, JSON.stringify(payload[key]));
                    else if (payload[key] !== null && payload[key] !== undefined)
                        formData.append(key, payload[key]);
                });
                formData.append("payment_proof", paymentProof);
                const token = localStorage.getItem("token");
                const headers = token ? {Authorization: `Bearer ${token}`} : {};
                res = await axios.post(
                    `${BASE_URL_of_POS}/api/purchase/purchases/`,
                    formData,
                    {headers}
                );
            } else {
                res = await posPurchaseProductAPI.create(payload);
            }

            setRefreshKey((k) => k + 1);
            setSuccessData(res.data);
            setShowSuccess(true);

            setItems([{...emptyItem}]);
            setSupplier(null);
            setPaidCash(0);
            setPaidMobile(0);
            setPaidBank(0);
            setGivenCash(0);
            setMobileOperator("");
            setTransactionId("");
            setBankAccountNo("");
            setPaymentProof(null);
            setGlobalDiscountValue(0);
            setPurchaseNote("");
            setIsPaymentModalOpen(false);
        }
            // catch (err) {
            //     console.error("Submission failed:", err);
            //     alert(err.response?.data?.error || "Failed to record purchase invoice");
            //     setErrors(err.response?.data || {});
            // }

        catch (err) {
            console.error("Submission failed:", err);

            let errorMsg = "Failed to record purchase invoice";
            const errData = err.response?.data;

            if (errData) {
                if (typeof errData === "string") {
                    errorMsg = errData;
                } else if (errData.error) {
                    errorMsg = errData.error;
                } else if (errData.detail) {
                    errorMsg = errData.detail;
                } else if (errData.message) {
                    errorMsg = errData.message;
                } else if (errData.non_field_errors) {
                    errorMsg = Array.isArray(errData.non_field_errors)
                        ? errData.non_field_errors.join("\n")
                        : errData.non_field_errors;
                } else {
                    // Field-wise errors দেখাও
                    const entries = Object.entries(errData);
                    const messages = entries.map(([key, val]) => {
                        const v = Array.isArray(val)
                            ? val.join(", ")
                            : typeof val === "object"
                                ? JSON.stringify(val)
                                : val;
                        return `• ${key}: ${v}`;
                    });
                    if (messages.length) errorMsg = messages.join("\n");
                }
            }

            const statusText = err.response?.status
                ? `[HTTP ${err.response.status}] `
                : "";

            alert(`❌ Purchase Failed\n\n${statusText}${errorMsg}`);
            setErrors(errData || {});
        } finally {
            setLoading(false);
        }
    };

    /* ============================================================
     SUPPLIER & HOLD/QUOTATION
     ============================================================ */
    const handleSupplierAdded = (newSupplier) => {
        const formattedSupplier = {
            value: newSupplier.id,
            label: `${newSupplier.name} ${newSupplier.phone ? `(${newSupplier.phone})` : ""}`,
            due_amount: Number(newSupplier.due_amount || 0),
        };
        setSupplier(formattedSupplier);
        setIsAddSupplierOpen(false);
    };

    const handleViewSupplierDetails = async (id) => {
        if (!id) return;
        try {
            setLoadingDetails(true);
            setIsViewSupplierOpen(true);
            const res = await posSupplierAPI.getById(id);
            setSupplierDetails(res.data);
        } catch (err) {
            console.error("Failed to load supplier details:", err);
            alert("Could not load supplier details");
            setIsViewSupplierOpen(false);
            if (isMobile) setIsMobileCartOpen(true);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleHoldPurchase = async () => {
        const validItems = items.filter((i) => i.product);
        if (validItems.length === 0) return alert("Please add products to hold");

        const itemsPayload = validItems.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount_amount: item.discount_amount,
            total_price: item.total_price,
            manufacturing_date: item.manufacturing_date || null,
            expiry_date: item.expiry_date || null,
            batch_no: item.batch_no || null,
            carton_qty: item.carton_qty || 0,
            boxes_per_carton: item.boxes_per_carton || 0,
            box_qty: item.box_qty || 0,
            loose_strips: item.loose_strips || 0,
            loose_qty: item.loose_qty || 0,
        }));

        const payload = {
            transaction_type: "purchase",
            status: "hold",
            title: supplier?.label ? `Hold - ${supplier.label}` : "Purchase Hold",
            supplier: supplier?.value || null,
            subtotal: subtotal,
            discount_amount: globalDiscountAmount,
            net_total: netTotal,
            items: itemsPayload,
        };

        try {
            setHoldQuotationLoading(true);
            await posHoldQuotationAPI.create(payload);
            alert("Purchase successfully put on hold!");
            setItems([{...emptyItem}]);
            setPaidCash(0);
            setGivenCash(0);
            setPaidMobile(0);
            setPaidBank(0);
            setGlobalDiscountValue(0);
        } catch (err) {
            alert(err.response?.data?.error || "Failed to hold purchase");
        } finally {
            setHoldQuotationLoading(false);
        }
    };

    const handleSavePurchaseQuotation = async (quotationData) => {
        const validItems = items.filter((i) => i.product);
        if (validItems.length === 0) return alert("Please add products to quotation");

        const itemsPayload = validItems.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount_amount: item.discount_amount,
            total_price: item.total_price,
            manufacturing_date: item.manufacturing_date || null,
            expiry_date: item.expiry_date || null,
            batch_no: item.batch_no || null,
            carton_qty: item.carton_qty || 0,
            boxes_per_carton: item.boxes_per_carton || 0,
            box_qty: item.box_qty || 0,
            loose_strips: item.loose_strips || 0,
            loose_qty: item.loose_qty || 0,
        }));

        const payload = {
            transaction_type: "purchase",
            status: "quotation",
            title:
                quotationData.title ||
                `Purchase Quotation - ${supplier?.label || "Supplier"}`,
            supplier: supplier?.value || null,
            expires_at: quotationData.expires_at || null,
            notes: quotationData.notes || "",
            subtotal: subtotal,
            discount_amount: globalDiscountAmount,
            net_total: netTotal,
            items: itemsPayload,
        };

        try {
            setHoldQuotationLoading(true);
            const res = await posHoldQuotationAPI.create(payload);
            alert("Purchase Quotation created successfully!");
            setIsCreateQuotationOpen(false);
            if (window.confirm("Do you want to print this quotation now?")) {
                printQuotation(res.data);
            }
            setItems([{...emptyItem}]);
            setPaidCash(0);
            setGivenCash(0);
            setPaidMobile(0);
            setPaidBank(0);
            setGlobalDiscountValue(0);
        } catch (err) {
            alert(err.response?.data?.error || "Failed to create quotation");
        } finally {
            setHoldQuotationLoading(false);
        }
    };

    const handleRestoreHoldOrQuotation = async (data) => {
        if (data.supplier) {
            setSupplier({
                value: data.supplier,
                label: data.supplier_name
                    ? `${data.supplier_name} ${data.supplier_phone ? `(${data.supplier_phone})` : ""}`
                    : "Selected Supplier",
                due_amount: 0,
            });
        }
        if (data.items && data.items.length > 0) {
            const restoredItems = await Promise.all(
                data.items.map(async (item) => {
                    const specId = item.specification || item.product_specification || null;
                    let specList = [];
                    if (specId) specList = await fetchSpecProductsList(specId);
                    const mfgDate = item.manufacturing_date || "";
                    const expDate = item.expiry_date || "";
                    const shelfLife = calculateShelfLifeDays(mfgDate, expDate);
                    return {
                        ...emptyItem,
                        product: item.product,
                        product_name: item.product_name || "Product",
                        unit_price: Number(item.unit_price || item.purchase_price || 0),
                        quantity: Number(item.quantity || 1),
                        discount_type: "fixed",
                        discount_value: Number(item.discount_amount || 0),
                        discount_amount: Number(item.discount_amount || 0),
                        total_price: Number(item.total_price || 0),
                        manufacturing_date: mfgDate,
                        expiry_date: expDate,
                        shelf_life_days: shelfLife,
                        batch_no: item.batch_no || "",
                        stock: item.stock || 0,
                        has_expiry: Boolean(item.has_expiry || item.expiry_date || mfgDate),
                        show_expiry_calc: Boolean(
                            item.has_expiry || item.expiry_date || mfgDate
                        ),
                        category_name: item.category_name || "",
                        specification: specId,
                        spec_products_list: specList,
                        show_spec_products: false,
                        carton_qty: item.carton_qty || 0,
                        boxes_per_carton: item.boxes_per_carton || 0,
                        box_qty: item.box_qty || 0,
                        loose_strips: item.loose_strips || 0,
                        loose_qty: item.loose_qty || 0,
                    };
                })
            );
            setItems(restoredItems);
        }
        if (data.discount_amount) {
            setGlobalDiscountType("fixed");
            setGlobalDiscountValue(Number(data.discount_amount));
        }
    };

    const handlePrint = (invoice) => {
        if (!invoice) return;
        const tableContent = getPurchasePrintLayout(invoice);
        const fullHTML = getBrandedVoucher(
            "Purchase Invoice",
            tableContent,
            invoice.invoice_no,
            "#1d4ed8"
        );
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    /* ============================================================
     RIGHT PANEL (Cart)
     ============================================================ */
    const renderRightPanel = (isMobileCartContext = false) => {
        return (
            <div
                className={`flex flex-col h-full min-h-0 overflow-hidden space-y-4 ${
                    isMobileCartContext ? "w-full" : "w-full"
                }`}
            >
                {/* Supplier Banner */}
                <div
                    className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 shadow-inner">
                    <div className="w-full sm:w-[65%] flex items-end gap-2">
                        <div className="flex-1">
                            <label
                                className="block text-[9px] font-extrabold uppercase text-blue-900 tracking-wider mb-1">
                                Supplier CRM *
                            </label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={loadSupplierOptions}
                                value={supplier}
                                onChange={setSupplier}
                                placeholder="Find supplier CRM..."
                                menuPortalTarget={document.body}
                                styles={{menuPortal: (base) => ({...base, zIndex: 9999})}}
                                className="text-xs"
                            />
                        </div>
                        <div className="flex gap-1 shrink-0">
                            {supplier && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleViewSupplierDetails(supplier.value);
                                        if (isMobile) setIsMobileCartOpen(false);
                                    }}
                                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-all duration-200 shadow-sm"
                                    title="View Supplier Details"
                                >
                                    <Eye size={16}/>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAddSupplierOpen(true);
                                    if (isMobile) setIsMobileCartOpen(false);
                                }}
                                className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl border border-green-200 transition-all duration-200 shadow-sm"
                                title="Add New Supplier"
                            >
                                <UserPlus size={16}/>
                            </button>
                        </div>
                    </div>
                    {supplier && (
                        <div
                            className="bg-white px-3 py-1 rounded border border-blue-200 shadow-sm min-w-[120px] text-right">
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                                CRM Due Balance
                            </p>
                            <p className="text-sm font-black text-red-655">৳{previousDue.toFixed(2)}</p>
                        </div>
                    )}
                </div>

                {/* Cart Table */}
                <div
                    className="flex-1 min-h-0 overflow-y-auto p-3 border border-gray-200 rounded-xl bg-white scrollbar-thin">
                    <div className="flex justify-between items-center mb-2 px-1 shrink-0">
                        <h3 className="text-xs font-black uppercase text-gray-700 tracking-wider flex items-center gap-1.5">
                            🛒 Cart Items ({items.length})
                        </h3>
                        <button
                            type="button"
                            onClick={addRow}
                            className="text-[9px] font-bold text-blue-600 bg-blue-500/10 hover:bg-blue-500 hover:text-white border border-blue-200 px-3 py-1 rounded-xl transition-all duration-200 flex items-center gap-1"
                        >
                            <Plus size={11}/> Add Row
                        </button>
                    </div>

                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                        <tr className="border-b border-gray-200 text-gray-400 text-[8px] uppercase font-bold tracking-wider bg-gray-55 sticky top-0 z-10">
                            <th className="py-2 px-1 w-6 text-center">#</th>
                            <th className="py-2 px-1 w-[40%]">Item Description</th>
                            <th className="py-2 px-1 w-[18%] text-right font-bold">Cost Price</th>
                            <th className="py-2 px-1 text-center w-[12%]">Qty</th>
                            <th className="py-2 px-1 w-[18%]">Discount</th>
                            <th className="py-2 px-1 w-[12%] text-right font-bold">Total</th>
                            <th className="py-2 px-1"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">

                        {items.map((item, index) => {
                            const pendingExpiry = isExpiryPending(item);
                            return (
                                <React.Fragment key={index}>
                                    {/*<tr>*/}
                                    <tr className={pendingExpiry ? "bg-rose-50/60" : ""}>
                                        {/* 🆕 Row number */}
                                        <td className="py-2 px-1 align-middle text-center">
                                        <span className={`text-[9px] font-black ${
                                            pendingExpiry ? "text-rose-600" : "text-gray-400"
                                        }`}>
                                                {index + 1}
                                         </span>
                                        </td>
                                        <td className="py-2 px-1 align-middle">
                                            <AsyncSelect
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={loadProductOptions}
                                                value={
                                                    item.product
                                                        ? {
                                                            value: item.product,
                                                            label: item.product_name,
                                                            unit_price: item.unit_price,
                                                        }
                                                        : null
                                                }
                                                onChange={(option) => selectProduct(option, index)}
                                                placeholder="Search product..."
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({...base, zIndex: 9999}),
                                                    control: (base) => ({
                                                        ...base,
                                                        minHeight: "30px",
                                                        fontSize: "10px",
                                                        borderRadius: "8px",
                                                        borderColor: "#d1d5db",
                                                        boxShadow: "none",
                                                        "&:hover": {borderColor: "#3b82f6"},
                                                    }),
                                                    valueContainer: (base) => ({...base, padding: "0 6px"}),
                                                    input: (base) => ({...base, margin: 0, padding: 0}),
                                                    singleValue: (base) => ({
                                                        ...base,
                                                        fontSize: "10px",
                                                        fontWeight: "600",
                                                    }),
                                                    placeholder: (base) => ({
                                                        ...base,
                                                        fontSize: "10px",
                                                        color: "#9ca3af",
                                                    }),
                                                }}
                                            />

                                            {/* 🆕 Expiry status badge */}
                                            {item.product && item.has_expiry && (
                                                <span
                                                    className={`absolute -top-1 -right-1 z-20 inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full text-[7px] font-black uppercase shadow-sm border ${
                                                        item.expiry_date
                                                            ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                                                            : "bg-rose-100 text-rose-700 border-rose-300 animate-pulse"
                                                    }`}
                                                    title={
                                                        item.expiry_date
                                                            ? `Expiry: ${item.expiry_date}`
                                                            : "⚠ Expiry date দেওয়া হয়নি"
                                                    }
                                                >
                        {item.expiry_date ? "✓ EXP" : "⚠ EXP?"}
                    </span>
                                            )}
                                        </td>

                                        <td className="py-2 px-1 align-top">
                                            <input
                                                type="number"
                                                className="w-full border p-1 rounded text-right font-mono text-[10px] bg-white text-gray-800 focus:border-blue-500 outline-none"
                                                value={item.unit_price || ""}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) =>
                                                    updateItem(index, {
                                                        unit_price: Number(e.target.value),
                                                    })
                                                }
                                            />
                                        </td>
                                        <td className="py-2 px-1 align-top text-center">
                                            <div
                                                className="flex items-center justify-center inline-flex bg-gray-50 border border-gray-300 rounded-lg overflow-hidden h-6">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateItem(index, {
                                                            quantity: Math.max(1, item.quantity - 1),
                                                        })
                                                    }
                                                    className="w-5 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-655 font-extrabold text-[11px]"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    className="w-10 text-center text-[10px] font-bold font-mono text-gray-800 bg-transparent outline-none border-none"
                                                    value={item.quantity}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => {
                                                        const raw = e.target.value.replace(/[^0-9]/g, "");
                                                        updateItem(index, {
                                                            quantity: raw === "" ? "" : Number(raw),
                                                        });
                                                    }}
                                                    onBlur={(e) => {
                                                        const val = Number(e.target.value);
                                                        updateItem(index, {
                                                            quantity: val > 0 ? val : 1,
                                                        });
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateItem(index, {
                                                            quantity: item.quantity + 1,
                                                        })
                                                    }
                                                    className="w-5 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-655 font-extrabold text-[11px]"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-2 px-1 align-top">
                                            <div
                                                className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                                                <select
                                                    className="bg-gray-50 text-[8px] p-0.5 border-r border-gray-200 outline-none cursor-pointer text-gray-700 font-bold"
                                                    value={item.discount_type}
                                                    onChange={(e) =>
                                                        updateItem(index, {
                                                            discount_type: e.target.value,
                                                        })
                                                    }
                                                >
                                                    <option value="fixed">৳</option>
                                                    <option value="percent">%</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    className="w-full bg-transparent p-0.5 text-[9px] font-bold text-center text-gray-800 outline-none font-mono"
                                                    placeholder="0"
                                                    value={item.discount_value || ""}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) =>
                                                        updateItem(index, {
                                                            discount_value: Number(e.target.value),
                                                        })
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td className="py-2 px-1 text-right align-top">
                                        <span
                                            className="font-bold font-mono text-blue-700 text-[11px] block mt-0.5">
                                            ৳{item.total_price.toFixed(2)}
                                        </span>
                                            {item.discount_amount > 0 && (
                                                <span
                                                    className="text-[7px] text-green-600 font-bold block leading-none">
                                                Saved: ৳{item.discount_amount.toFixed(0)}
                                            </span>
                                            )}
                                        </td>
                                        <td className="py-2 px-1 text-center align-top">
                                            <div className="flex flex-col items-center gap-1.5">
                                                {item.product && (
                                                    <button
                                                        type="button"
                                                        onClick={() => duplicateRow(index)}
                                                        className="text-gray-400 hover:text-blue-500 transition-colors"
                                                        title="Duplicate Row"
                                                    >
                                                        <Copy size={11}/>
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(index)}
                                                    className="text-gray-450 hover:text-red-500 transition-colors text-sm font-black leading-none"
                                                    title="Delete Row"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Action buttons row */}
                                    {item.product && (
                                        <tr className="bg-gray-50/30 border-b border-gray-100">
                                            <td colSpan={7} className="px-2 py-1">
                                                <div className="flex items-center gap-4 text-[9px] flex-wrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEditProduct(item)}
                                                        className="font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200"
                                                    >
                                                        ✏️ Edit Product
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateItem(index, {
                                                                show_box_calc: !item.show_box_calc,
                                                            })
                                                        }
                                                        className={`font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                                                            item.show_box_calc
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                                                        }`}
                                                    >
                                                        📦 {item.show_box_calc ? "Hide Box Calc" : "Show Box Calc"}
                                                    </button>

                                                    {item.has_expiry && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateItem(index, {
                                                                        show_expiry_calc: !item.show_expiry_calc,
                                                                    })
                                                                }
                                                                className={`font-bold flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${
                                                                    item.show_expiry_calc
                                                                        ? "bg-orange-600 text-white"
                                                                        : "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
                                                                }`}
                                                            >
                                                                📅 {item.show_expiry_calc ? "Hide Expiry" : "Show Expiry"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => openExpiryScanner(index)}
                                                                className="font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200"
                                                            >
                                                                📷 Scan Pack
                                                            </button>
                                                        </>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const nextState = !item.show_spec_products;
                                                            updateItem(index, {
                                                                show_spec_products: nextState,
                                                            });
                                                            if (
                                                                nextState &&
                                                                (!item.spec_products_list ||
                                                                    item.spec_products_list.length === 0)
                                                            ) {
                                                                loadSameSpecificationProducts(
                                                                    index,
                                                                    item.specification
                                                                );
                                                            }
                                                        }}
                                                        className={`font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors ml-auto ${
                                                            item.show_spec_products
                                                                ? "bg-purple-600 text-white"
                                                                : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                                                        }`}
                                                    >
                                                        🔬 Same Spec Stock ({item.spec_products_list?.length || 0})
                                                    </button>

                                                    {/* 🆕 Actions row-এর শেষে বড় expiry status badge */}
                                                    {item.has_expiry && (
                                                        <span
                                                            className={`ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                                                                item.expiry_date
                                                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                                                                    : "bg-rose-100 text-rose-700 border border-rose-300 animate-pulse"
                                                            }`}
                                                        >
                                {item.expiry_date
                                    ? "✓ Expiry Filled"
                                    : "⚠ Expiry Missing — Payment আটকে যাবে"}
                            </span>
                                                    )}

                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {/* Detail panels — Box Calc / Expiry / Spec */}
                                    {(item.show_box_calc ||
                                        (item.has_expiry && item.show_expiry_calc) ||
                                        item.show_spec_products) && (
                                        <tr className="bg-gray-50/50">
                                            <td colSpan={7} className="p-2 border-b border-gray-200">
                                                <div className="space-y-2">
                                                    {item.show_box_calc && (
                                                        <div
                                                            className="p-2 bg-blue-50 border border-blue-100 rounded-xl space-y-2 animate-in fade-in duration-200">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-[8px] font-black text-blue-800 uppercase tracking-wider">
                                                                    {item.category_name?.toLowerCase().includes("medicine")
                                                                        ? "Medicine Box Calculator"
                                                                        : "Box Calculator"}
                                                                </p>
                                                                <span
                                                                    className="text-[8px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">
                                                                Total:{" "}
                                                                    <span className="font-mono text-blue-900">
                                                                    {item.quantity}
                                                                </span>{" "}
                                                                    pcs
                                                            </span>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className="text-[7px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
                                                                    📦 Packaging Structure
                                                                </p>
                                                                <div
                                                                    className="grid gap-1.5"
                                                                    style={{
                                                                        gridTemplateColumns:
                                                                            "repeat(auto-fit, minmax(75px, 1fr))",
                                                                    }}
                                                                >
                                                                    <div className="space-y-0.5">
                                                                        <label
                                                                            className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                            Carton
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            className="w-full border border-blue-200 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                            placeholder="0"
                                                                            value={item.carton_qty || ""}
                                                                            onFocus={(e) => e.target.select()}
                                                                            onChange={(e) =>
                                                                                handleBoxCalcChange(
                                                                                    index,
                                                                                    "carton_qty",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-0.5">
                                                                        <label
                                                                            className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                            Box/Carton
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            className="w-full border border-blue-200 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                            placeholder="0"
                                                                            value={item.boxes_per_carton || ""}
                                                                            onFocus={(e) => e.target.select()}
                                                                            onChange={(e) =>
                                                                                handleBoxCalcChange(
                                                                                    index,
                                                                                    "boxes_per_carton",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>

                                                                    {item.category_name
                                                                        ?.toLowerCase()
                                                                        .includes("medicine") ? (
                                                                        <>
                                                                            <div className="space-y-0.5">
                                                                                <label
                                                                                    className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                                    Strips/Box
                                                                                </label>
                                                                                <input
                                                                                    type="number"
                                                                                    className="w-full border border-blue-200 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                                    placeholder="0"
                                                                                    value={item.strips_per_box || ""}
                                                                                    onFocus={(e) =>
                                                                                        e.target.select()
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        handleBoxCalcChange(
                                                                                            index,
                                                                                            "strips_per_box",
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                            <div className="space-y-0.5">
                                                                                <label
                                                                                    className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                                    Pcs/Strip
                                                                                </label>
                                                                                <input
                                                                                    type="number"
                                                                                    className="w-full border border-blue-200 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                                    placeholder="0"
                                                                                    value={item.pcs_per_strip || ""}
                                                                                    onFocus={(e) =>
                                                                                        e.target.select()
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        handleBoxCalcChange(
                                                                                            index,
                                                                                            "pcs_per_strip",
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <div className="space-y-0.5">
                                                                            <label
                                                                                className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                                Pcs/Box
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                className="w-full border border-blue-200 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                                placeholder="0"
                                                                                value={item.pcs_per_box || ""}
                                                                                onFocus={(e) =>
                                                                                    e.target.select()
                                                                                }
                                                                                onChange={(e) =>
                                                                                    handleBoxCalcChange(
                                                                                        index,
                                                                                        "pcs_per_box",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1 pt-1.5 border-t border-blue-100">
                                                                <p className="text-[7px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
                                                                    🧮 Loose & Pricing
                                                                </p>
                                                                <div
                                                                    className="grid gap-1.5"
                                                                    style={{
                                                                        gridTemplateColumns:
                                                                            "repeat(auto-fit, minmax(75px, 1fr))",
                                                                    }}
                                                                >
                                                                    <div className="space-y-0.5">
                                                                        <label
                                                                            className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                            Loose Box
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            className="w-full border border-blue-200 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                            placeholder="0"
                                                                            value={item.box_qty || ""}
                                                                            onFocus={(e) => e.target.select()}
                                                                            onChange={(e) =>
                                                                                handleBoxCalcChange(
                                                                                    index,
                                                                                    "box_qty",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>

                                                                    {item.category_name
                                                                        ?.toLowerCase()
                                                                        .includes("medicine") && (
                                                                        <div className="space-y-0.5">
                                                                            <label
                                                                                className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                                Loose Strips
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                className="w-full border border-blue-200 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                                placeholder="0"
                                                                                value={item.loose_strips || ""}
                                                                                onFocus={(e) =>
                                                                                    e.target.select()
                                                                                }
                                                                                onChange={(e) =>
                                                                                    handleBoxCalcChange(
                                                                                        index,
                                                                                        "loose_strips",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    <div className="space-y-0.5">
                                                                        <label
                                                                            className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                            Loose Pcs
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            className="w-full border border-blue-200 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                            placeholder="0"
                                                                            value={item.loose_qty || ""}
                                                                            onFocus={(e) => e.target.select()}
                                                                            onChange={(e) =>
                                                                                handleBoxCalcChange(
                                                                                    index,
                                                                                    "loose_qty",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-0.5">
                                                                        <label
                                                                            className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                            Price/Box
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            className="w-full border border-blue-200 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                            placeholder="0"
                                                                            value={item.price_per_box || ""}
                                                                            onFocus={(e) => e.target.select()}
                                                                            onChange={(e) =>
                                                                                handleBoxCalcChange(
                                                                                    index,
                                                                                    "price_per_box",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-0.5">
                                                                        <label
                                                                            className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                            Total Pcs
                                                                        </label>
                                                                        <div
                                                                            className="w-full border border-blue-300 p-1 rounded bg-blue-100 text-[9px] font-black font-mono text-blue-900 text-center">
                                                                            {item.quantity}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {(item.carton_qty > 0 || item.box_qty > 0) && (
                                                                <p className="text-[8px] font-bold text-blue-600 pt-1 border-t border-blue-100">
                                                                    📦{" "}
                                                                    {item.carton_qty > 0 && (
                                                                        <>
                                                                            {item.carton_qty} carton ×{" "}
                                                                            {item.boxes_per_carton || 0} box
                                                                        </>
                                                                    )}
                                                                    {item.carton_qty > 0 && item.box_qty > 0 && " + "}
                                                                    {item.box_qty > 0 && (
                                                                        <>{item.box_qty} loose box</>
                                                                    )}{" "}
                                                                    ={" "}
                                                                    <span className="text-blue-800 font-black">
                                                                    {(item.carton_qty || 0) *
                                                                        (item.boxes_per_carton || 0) +
                                                                        (item.box_qty || 0)}{" "}
                                                                        boxes
                                                                </span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {item.has_expiry && item.show_expiry_calc && (
                                                        <div
                                                            className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-2 bg-orange-50/50 border border-orange-100 rounded-xl animate-in fade-in duration-200">
                                                            <div className="space-y-0.5">
                                                                <label
                                                                    className="text-[7px] font-black text-orange-600 uppercase block">
                                                                    Mfg Date
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    className="w-full border border-orange-100 p-1 rounded bg-white text-[9px] font-bold outline-none"
                                                                    value={item.manufacturing_date || ""}
                                                                    onChange={(e) =>
                                                                        handleExpiryDateChange(
                                                                            index,
                                                                            "manufacturing_date",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="space-y-0.5">
                                                                <label
                                                                    className="text-[7px] font-black text-orange-600 uppercase block">
                                                                    Expire Date
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    className="w-full border border-orange-100 p-1 rounded bg-white text-[9px] font-bold outline-none"
                                                                    value={item.expiry_date || ""}
                                                                    onChange={(e) =>
                                                                        handleExpiryDateChange(
                                                                            index,
                                                                            "expiry_date",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="space-y-0.5">
                                                                <label
                                                                    className="text-[7px] font-black text-orange-600 uppercase block">
                                                                    Shelf Life
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="w-full border border-orange-100 p-1 rounded bg-white text-[9px] font-mono outline-none"
                                                                    placeholder="Days"
                                                                    value={item.shelf_life_days || ""}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) =>
                                                                        handleExpiryDateChange(
                                                                            index,
                                                                            "shelf_life_days",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="space-y-0.5">
                                                                <label
                                                                    className="text-[7px] font-black text-orange-600 uppercase block">
                                                                    Remaining
                                                                </label>
                                                                <div
                                                                    className={`text-[9px] font-bold p-1 rounded border ${(() => {
                                                                        const r = calculateRemainingDays(
                                                                            item.expiry_date
                                                                        );
                                                                        if (r === null)
                                                                            return "bg-gray-100 border-gray-200 text-gray-500";
                                                                        if (r < 0)
                                                                            return "bg-red-100 border-red-300 text-red-700";
                                                                        if (r <= 30)
                                                                            return "bg-yellow-100 border-yellow-300 text-yellow-800";
                                                                        return "bg-green-100 border-green-300 text-green-700";
                                                                    })()}`}
                                                                >
                                                                    {(() => {
                                                                        const r = calculateRemainingDays(
                                                                            item.expiry_date
                                                                        );
                                                                        if (r === null) return "N/A";
                                                                        if (r < 0) return "⚠️ Expired";
                                                                        if (r === 0) return "⚠️ Today";
                                                                        return `${r} days`;
                                                                    })()}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-0.5">
                                                                <label
                                                                    className="text-[7px] font-black text-orange-600 uppercase block">
                                                                    Batch No
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full border border-orange-100 p-1 rounded bg-white text-[9px] outline-none"
                                                                    placeholder="Batch #"
                                                                    value={item.batch_no || ""}
                                                                    onChange={(e) =>
                                                                        updateItem(index, {
                                                                            batch_no: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {item.show_spec_products && (
                                                        <div
                                                            className="p-2 bg-purple-50 border border-purple-100 rounded-xl space-y-1 animate-in fade-in duration-200">
                                                            <div
                                                                className="flex justify-between items-center border-b border-purple-200 pb-1 mb-1">
                                                                <p className="text-[7px] font-black text-purple-800 uppercase tracking-wider">
                                                                    Same Specification (Alternative Brands)
                                                                </p>
                                                                <span
                                                                    className="text-[7px] font-mono text-purple-600 italic">
                                                                Spec:{" "}
                                                                    {item.spec_products_list?.[0]
                                                                            ?.specification_name ||
                                                                        item.specification_name ||
                                                                        "Loading..."}
                                                            </span>
                                                            </div>

                                                            {item.spec_products_list &&
                                                            item.spec_products_list.length > 0 ? (
                                                                <div className="overflow-x-auto">
                                                                    <table
                                                                        className="w-full text-[8px] font-medium text-left text-purple-900">
                                                                        <thead>
                                                                        <tr className="border-b border-purple-100 text-[7px] text-purple-700 uppercase font-extrabold">
                                                                            <th className="pb-0.5">Product</th>
                                                                            <th className="pb-0.5 text-center">Brand</th>
                                                                            <th className="pb-0.5 text-right">Purchase</th>
                                                                            <th className="pb-0.5 text-right">Selling</th>
                                                                            <th className="pb-0.5 text-right">Stock</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody
                                                                            className="divide-y divide-purple-100/50">
                                                                        {item.spec_products_list.map((p) => (
                                                                            <tr
                                                                                key={p.id}
                                                                                className={`hover:bg-purple-100/40 ${
                                                                                    p.id === item.product
                                                                                        ? "bg-purple-100/70 font-bold"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                <td className="py-1 pr-1 truncate"
                                                                                    title={p.name}>
                                                                                    {p.name}{" "}
                                                                                    {p.id === item.product && (
                                                                                        <span
                                                                                            className="text-[6px] bg-purple-600 text-white px-1 rounded ml-1">
                                                                                        Current
                                                                                    </span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="py-1 text-center text-gray-600">
                                                                                    {p.brand_name || "N/A"}
                                                                                </td>
                                                                                <td className="py-1 text-right font-mono text-gray-600">
                                                                                    ৳{Number(p.purchase_price).toFixed(2)}
                                                                                </td>
                                                                                <td className="py-1 text-right font-mono text-gray-700">
                                                                                    ৳{Number(p.selling_price).toFixed(2)}
                                                                                </td>
                                                                                <td
                                                                                    className={`py-1 text-right font-mono font-bold ${
                                                                                        p.stock <= 0
                                                                                            ? "text-red-600"
                                                                                            : "text-green-700"
                                                                                    }`}
                                                                                >
                                                                                    {p.stock} {p.unit_name || "Pcs"}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            ) : (
                                                                <p className="text-[8px] text-center text-purple-500 py-1 font-semibold">
                                                                    No products found or loading...
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Summary Footer */}
                <div
                    className="flex justify-between items-center text-[10px] text-gray-550 font-bold border-t border-gray-200 pt-1 shrink-0">
                    <div className="flex gap-2 items-center">
                        <label
                            className="text-[8px] font-black uppercase text-green-700 tracking-wider">
                            Overall Discount
                        </label>
                        <div className="flex gap-1 items-center flex-1">
                            <select
                                className="border p-0.5 rounded bg-white outline-none text-[9px] h-6"
                                value={globalDiscountType}
                                onChange={(e) => setGlobalDiscountType(e.target.value)}
                            >
                                <option value="fixed">Fixed (৳)</option>
                                <option value="percent">% Ratio</option>
                            </select>
                            <input
                                type="number"
                                className="w-full border p-0.5 rounded outline-none font-mono font-bold text-xs bg-white focus:border-green-500 h-6"
                                placeholder="0.00"
                                value={globalDiscountValue || ""}
                                onChange={(e) =>
                                    setGlobalDiscountValue(Number(e.target.value))
                                }
                            />
                        </div>
                    </div>

                    <span>
                        Items Subtotal:{" "}
                        <span className="font-mono text-gray-800 font-black">
                            ৳{subtotal.toFixed(0)}
                        </span>
                    </span>
                    {globalDiscountAmount > 0 && (
                        <span className="text-green-600">
                            Discount:{" "}
                            <span className="font-mono font-black">
                                - ৳{globalDiscountAmount.toFixed(0)}
                            </span>
                        </span>
                    )}
                    <div className="text-gray-900 font-black text-xs">
                        Net Payable:{" "}
                        <span className="font-mono text-blue-700 text-sm">
                            ৳{netTotal.toFixed(0)}
                        </span>
                    </div>
                </div>

                {/* 🆕 Warning banner — এখানে বসাও */}
                {getPendingExpiryItems().length > 0 && (
                    <div
                        className="p-2 bg-rose-50 border border-rose-300 rounded-lg flex items-center gap-2 animate-pulse shrink-0">
                        <span className="text-rose-600 text-sm">⚠️</span>
                        <span className="text-[9px] font-black text-rose-700 uppercase tracking-wider">
            {getPendingExpiryItems().length} item-এ Expiry date বাকি — Payment আটকে যাবে
        </span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-1.5 pt-1 border-t border-gray-200 items-center shrink-0">
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to clear the cart?")) {
                                setItems([{...emptyItem}]);
                                setPaidCash(0);
                                setGivenCash(0);
                                setPaidMobile(0);
                                setPaidBank(0);
                                setGlobalDiscountValue(0);
                            }
                        }}
                        className="py-1 px-2 border border-gray-400 rounded-lg text-gray-500 hover:bg-gray-100 font-bold text-[9px] uppercase tracking-wider transition-all text-center"
                    >
                        Clear
                    </button>


                    <button
                        type="button"
                        // onClick={() => {
                        //     if (!supplier) return alert("Please select a supplier");
                        //     const validItems = items.filter((i) => i.product);
                        //     if (validItems.length === 0) return alert("Please add products");
                        //     setIsPaymentModalOpen(true);
                        //     if (isMobile) setIsMobileCartOpen(false);
                        // }}

                        onClick={() => {
                            if (!supplier) return alert("Please select a supplier");
                            const validItems = items.filter((i) => i.product);
                            if (validItems.length === 0) return alert("Please add products");

                            /* ═══ NEW: Expiry pending check ═══ */
                            const pendingExpiry = validItems.filter(
                                (i) => i.has_expiry && !i.expiry_date
                            );

                            if (pendingExpiry.length > 0) {
                                const names = pendingExpiry
                                    .map((p, idx) => `  ${idx + 1}. ${p.product_name}`)
                                    .join("\n");

                                alert(
                                    `⛔ Payment আটকানো হয়েছে\n\n` +
                                    `নিচের product${pendingExpiry.length > 1 ? "গুলোর" : "ের"} ` +
                                    `Expiry date দেওয়া হয়নি:\n\n${names}\n\n` +
                                    `অনুগ্রহ করে Expiry তথ্য পূরণ করে আবার চেষ্টা করুন।`
                                );
                                return;
                            }
                            /* ═══════════════════════════════ */

                            setIsPaymentModalOpen(true);
                            if (isMobile) setIsMobileCartOpen(false);
                        }}

                        className="flex-1 py-1 font-black rounded-lg text-[10px] uppercase tracking-wider text-white shadow-lg bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 transition-all active:scale-98 text-center"
                    >
                        Make Payment
                    </button>

                    {/* Quick Actions Dropdown */}
                    <div className="relative inline-block text-left">
                        <button
                            type="button"
                            onClick={() => setIsActionsDropdownOpen((prev) => !prev)}
                            className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-black rounded-lg text-[9px] uppercase tracking-wider text-white shadow-md transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                        >
                            <span>⚡ Quick Actions</span>
                            <ChevronRight
                                size={10}
                                className={`transform transition-transform ${
                                    isActionsDropdownOpen ? "-rotate-90" : "rotate-90"
                                }`}
                            />
                        </button>

                        {isActionsDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsActionsDropdownOpen(false)}
                                />
                                <div
                                    className="absolute bottom-full mb-1 right-0 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-1 font-sans">
                                    <div className="px-3 py-1.5 border-b border-gray-100 bg-gray-50">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider">
                                            Transaction Actions
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsActionsDropdownOpen(false);
                                            handleHoldPurchase();
                                        }}
                                        disabled={holdQuotationLoading}
                                        className="w-full text-left px-3 py-2 text-[10px] font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition-colors border-b border-gray-50"
                                    >
                                        <PauseCircle size={14} className="text-amber-500 shrink-0"/>
                                        <div>
                                            <span className="block font-black">Hold Current Cart</span>
                                            <span className="text-[8px] text-gray-400 font-medium">
                                                Pause & save purchase
                                            </span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsActionsDropdownOpen(false);
                                            setIsHoldModalOpen(true);
                                        }}
                                        className="w-full text-left px-3 py-2 text-[10px] font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors border-b border-gray-50"
                                    >
                                        <Clock size={14} className="text-amber-500 shrink-0"/>
                                        <div>
                                            <span className="block font-black">View On-Hold List</span>
                                            <span className="text-[8px] text-gray-400 font-medium">
                                                Restore saved held carts
                                            </span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsActionsDropdownOpen(false);
                                            const validItems = items.filter((i) => i.product);
                                            if (validItems.length === 0)
                                                return alert("Please add products to create quotation");
                                            setIsCreateQuotationOpen(true);
                                        }}
                                        className="w-full text-left px-3 py-2 text-[10px] font-bold text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 transition-colors border-b border-gray-50"
                                    >
                                        <FileText size={14} className="text-cyan-600 shrink-0"/>
                                        <div>
                                            <span className="block font-black">
                                                Create Purchase Quotation
                                            </span>
                                            <span className="text-[8px] text-gray-400 font-medium">
                                                Save & print price quote
                                            </span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsActionsDropdownOpen(false);
                                            setIsQuotationModalOpen(true);
                                        }}
                                        className="w-full text-left px-3 py-2 text-[10px] font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                                    >
                                        <FileText size={14} className="text-cyan-600 shrink-0"/>
                                        <div>
                                            <span className="block font-black">View Quotations List</span>
                                            <span className="text-[8px] text-gray-400 font-medium">
                                                Load or print saved quotes
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    /* ============================================================
     MAIN RENDER
     ============================================================ */
    return (
        <div className="flex flex-col h-[100dvh] overflow-hidden bg-white">
            <Navbar/>

            {remoteOcrLoading && (
                <div
                    className="fixed top-4 right-4 z-[9999] bg-blue-600 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in">
                    <Sparkles size={14} className="animate-pulse"/>
                    <span className="text-xs font-black uppercase tracking-wider">
                        Mobile photo analyze হচ্ছে…
                    </span>
                </div>
            )}

            <div className="flex-1 p-3 overflow-hidden min-h-0">
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex flex-col lg:flex-row gap-4 lg:gap-0 h-full overflow-hidden text-gray-800"
                >
                    {/* Hidden barcode receptor */}
                    <input
                        ref={barcodeRef}
                        onKeyDown={handleBarcodeScan}
                        className="absolute opacity-0 pointer-events-none"
                    />

                    {/* ─── Split Wrapper ─── */}
                    <div
                        ref={splitContainerRef}
                        className="flex flex-col lg:flex-row w-full h-full min-h-0 gap-4 lg:gap-0"
                    >
                        {/* ═════════ LEFT PANEL — product browser ═════════ */}
                        <div
                            style={isDesktop ? {flexBasis: `${splitPercent}%`} : undefined}
                            className="w-full lg:flex-none flex flex-col h-full min-h-0 bg-gray-50 p-2.5 rounded-2xl border border-gray-200 overflow-hidden"
                        >
                            {/* Filters Row */}
                            <div
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-3 shrink-0 items-end">
                                <div className="flex gap-1 items-end lg:col-span-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsCategorySidebarOpen(!isCategorySidebarOpen)
                                        }
                                        title={
                                            isCategorySidebarOpen
                                                ? "Hide Categories"
                                                : "Show Categories"
                                        }
                                        className="p-1.5 bg-white border border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-500 transition-colors shadow-sm cursor-pointer shrink-0 h-[28px] flex items-center justify-center mb-[1px]"
                                    >
                                        {isCategorySidebarOpen ? (
                                            <FolderOpen size={14}/>
                                        ) : (
                                            <Folder size={14}/>
                                        )}
                                    </button>

                                    <div className="relative flex-1">
                                        <label
                                            className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">
                                            Search
                                        </label>
                                        <div className="relative">
                                            <span
                                                className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-400">
                                                <Search size={12}/>
                                            </span>
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                placeholder="Code/title..."
                                                className="w-full pl-8 pr-2 py-1 bg-white border border-gray-300 rounded-lg text-[10px] font-bold text-gray-700 outline-none focus:border-blue-500 transition-all"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsBarcodeCameraOpen(true)}
                                        title="Scan Barcode/QR with Camera"
                                        className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-md transition-all active:scale-95 h-[28px] flex items-center justify-center mb-[1px] shrink-0"
                                    >
                                        <ScanLine size={14}/>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsRemotePairingOpen(true)}
                                        title="Pair mobile as remote scanner"
                                        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all active:scale-95 h-[28px] flex items-center justify-center mb-[1px] shrink-0"
                                    >
                                        <Smartphone size={14}/>
                                    </button>
                                </div>

                                <div>
                                    <label
                                        className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">
                                        Category
                                    </label>
                                    <Select
                                        value={
                                            selectedCategory === "All"
                                                ? {value: "All", label: "All Categories"}
                                                : {
                                                    value: selectedCategory,
                                                    label:
                                                        categories.find(
                                                            (c) => c.id == selectedCategory
                                                        )?.title || selectedCategory,
                                                }
                                        }
                                        onChange={(option) => {
                                            const val = option ? option.value : "All";
                                            setSelectedCategory(val);
                                            setSelectedSubCategory(null);
                                            setSelectedSpecification("All");
                                        }}
                                        options={[
                                            {value: "All", label: "All Categories"},
                                            ...categories.map((cat) => ({
                                                value: cat.id,
                                                label: cat.title,
                                            })),
                                        ]}
                                        styles={customSelectStyles}
                                        placeholder="Search Category..."
                                        isSearchable
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">
                                        Subcategory
                                    </label>
                                    <Select
                                        value={
                                            !selectedSubCategory
                                                ? {value: "All", label: "All Subcategories"}
                                                : {
                                                    value: selectedSubCategory,
                                                    label:
                                                        subCategories.find(
                                                            (s) => s.id == selectedSubCategory
                                                        )?.title || selectedSubCategory,
                                                }
                                        }
                                        onChange={(option) => {
                                            const val = option ? option.value : "All";
                                            setSelectedSubCategory(val === "All" ? null : val);
                                            setSelectedSpecification("All");
                                        }}
                                        options={[
                                            {value: "All", label: "All Subcategories"},
                                            ...(selectedCategory === "All"
                                                    ? subCategories
                                                    : subCategories.filter(
                                                        (sub) =>
                                                            sub.category == selectedCategory ||
                                                            sub.category_id == selectedCategory
                                                    )
                                            ).map((sub) => ({value: sub.id, label: sub.title})),
                                        ]}
                                        styles={customSelectStyles}
                                        placeholder="Search Subcategory..."
                                        isSearchable
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">
                                        Specification
                                    </label>
                                    <Select
                                        value={
                                            selectedSpecification === "All"
                                                ? {value: "All", label: "All Specifications"}
                                                : {
                                                    value: selectedSpecification,
                                                    label:
                                                        availableSpecifications.find(
                                                            (s) => s.id == selectedSpecification
                                                        )?.name || selectedSpecification,
                                                }
                                        }
                                        onChange={(option) => {
                                            const val = option ? option.value : "All";
                                            setSelectedSpecification(val);
                                        }}
                                        options={[
                                            {value: "All", label: "All Specifications"},
                                            ...availableSpecifications
                                                .filter((sp) => {
                                                    if (selectedSubCategory)
                                                        return sp.sub_category == selectedSubCategory;
                                                    if (selectedCategory !== "All")
                                                        return sp.category == selectedCategory;
                                                    return true;
                                                })
                                                .map((sp) => ({value: sp.id, label: sp.name})),
                                        ]}
                                        styles={customSelectStyles}
                                        placeholder="Search Specification..."
                                        isSearchable
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">
                                        Brand
                                    </label>
                                    <Select
                                        value={
                                            selectedBrand === "All"
                                                ? {value: "All", label: "All Brands"}
                                                : {
                                                    value: selectedBrand,
                                                    label:
                                                        brands.find(
                                                            (b) => b.id == selectedBrand
                                                        )?.title || selectedBrand,
                                                }
                                        }
                                        onChange={(option) =>
                                            setSelectedBrand(option ? option.value : "All")
                                        }
                                        options={[
                                            {value: "All", label: "All Brands"},
                                            ...brands.map((br) => ({
                                                value: br.id,
                                                label: br.title,
                                            })),
                                        ]}
                                        styles={customSelectStyles}
                                        placeholder="Search Brand..."
                                        isSearchable
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">
                                        Size
                                    </label>
                                    <Select
                                        value={
                                            selectedSize === "All"
                                                ? {value: "All", label: "All Sizes"}
                                                : {
                                                    value: selectedSize,
                                                    label:
                                                        sizes.find((s) => s.id == selectedSize)
                                                            ?.title || selectedSize,
                                                }
                                        }
                                        onChange={(option) =>
                                            setSelectedSize(option ? option.value : "All")
                                        }
                                        options={[
                                            {value: "All", label: "All Sizes"},
                                            ...sizes.map((sz) => ({
                                                value: sz.id,
                                                label: sz.title,
                                            })),
                                        ]}
                                        styles={customSelectStyles}
                                        placeholder="Search Size..."
                                        isSearchable
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">
                                        Unit
                                    </label>
                                    <Select
                                        value={
                                            selectedUnit === "All"
                                                ? {value: "All", label: "All Units"}
                                                : {
                                                    value: selectedUnit,
                                                    label:
                                                        units.find((u) => u.id == selectedUnit)
                                                            ?.title || selectedUnit,
                                                }
                                        }
                                        onChange={(option) =>
                                            setSelectedUnit(option ? option.value : "All")
                                        }
                                        options={[
                                            {value: "All", label: "All Units"},
                                            ...units.map((ut) => ({
                                                value: ut.id,
                                                label: ut.title,
                                            })),
                                        ]}
                                        styles={customSelectStyles}
                                        placeholder="Search Unit..."
                                        isSearchable
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-[8px] font-black uppercase text-transparent select-none mb-0.5 pl-0.5">
                                        Action
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        disabled={!hasActiveFilters}
                                        className={`w-full text-[9px] font-extrabold px-2 py-1 rounded-lg transition-all duration-200 border flex items-center justify-center gap-1 h-[28px] ${
                                            hasActiveFilters
                                                ? "text-red-500 bg-red-50 hover:bg-red-100 border-red-200 cursor-pointer shadow-sm active:scale-95"
                                                : "text-gray-300 bg-gray-50 border-gray-200 cursor-not-allowed"
                                        }`}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* Active filters pills — same as before */}
                            {hasActiveFilters && (
                                <div className="flex flex-wrap gap-1 mb-2 px-1 shrink-0">
                                    {selectedCategory !== "All" && (
                                        <span
                                            className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-blue-200">
                                            <span>
                                                Cat:{" "}
                                                {categories.find(
                                                    (c) => c.id == selectedCategory
                                                )?.title || selectedCategory}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCategory("All");
                                                    setSelectedSubCategory(null);
                                                    setSelectedSpecification("All");
                                                }}
                                                className="text-blue-500 hover:text-blue-900 font-bold focus:outline-none"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    {selectedSubCategory && (
                                        <span
                                            className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-indigo-200">
                                            <span>
                                                Sub:{" "}
                                                {subCategories.find(
                                                    (s) => s.id == selectedSubCategory
                                                )?.title || selectedSubCategory}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedSubCategory(null);
                                                    setSelectedSpecification("All");
                                                }}
                                                className="text-indigo-500 hover:text-indigo-900 font-bold focus:outline-none"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    {selectedSpecification !== "All" && (
                                        <span
                                            className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-teal-200">
                                            <span>
                                                Spec:{" "}
                                                {availableSpecifications.find(
                                                    (s) => s.id == selectedSpecification
                                                )?.name || selectedSpecification}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedSpecification("All")}
                                                className="text-teal-500 hover:text-teal-900 font-bold focus:outline-none"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    {selectedBrand !== "All" && (
                                        <span
                                            className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-amber-200">
                                            <span>
                                                Brand:{" "}
                                                {brands.find((b) => b.id == selectedBrand)
                                                    ?.title || selectedBrand}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedBrand("All")}
                                                className="text-amber-500 hover:text-amber-900 font-bold focus:outline-none"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    {selectedSize !== "All" && (
                                        <span
                                            className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-200">
                                            <span>
                                                Size:{" "}
                                                {sizes.find((s) => s.id == selectedSize)?.title ||
                                                    selectedSize}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedSize("All")}
                                                className="text-emerald-500 hover:text-emerald-900 font-bold focus:outline-none"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    {selectedUnit !== "All" && (
                                        <span
                                            className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-purple-200">
                                            <span>
                                                Unit:{" "}
                                                {units.find((u) => u.id == selectedUnit)?.title ||
                                                    selectedUnit}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedUnit("All")}
                                                className="text-purple-500 hover:text-purple-900 font-bold focus:outline-none"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    {searchTerm && (
                                        <span
                                            className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-gray-300">
                                            <span>Search: "{searchTerm}"</span>
                                            <button
                                                type="button"
                                                onClick={() => setSearchTerm("")}
                                                className="text-gray-500 hover:text-gray-900 font-bold focus:outline-none"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Status line */}
                            <div
                                className="flex justify-between items-center px-1 pb-2 mb-2 border-b border-gray-200 text-[10px] text-gray-550 font-bold tracking-wide shrink-0">
                                <span>
                                    {loadingProducts ? (
                                        <>⏳ Loading…</>
                                    ) : (
                                        <>
                                            Showing {products.length} of{" "}
                                            {totalProducts.toLocaleString()} products
                                            <span className="text-gray-400 font-normal ml-1">
                                                (Page {page}/
                                                {Math.max(1, Math.ceil(totalProducts / PAGE_SIZE))})
                                            </span>
                                        </>
                                    )}
                                </span>
                                <span className="text-[9px] text-gray-400 italic">
                                    💡 যেকোনো key চাপলে search-এ auto focus
                                </span>
                            </div>

                            {/* Sidebar + Products */}
                            <div className="flex flex-1 overflow-hidden gap-2 min-h-0">
                                {/* Category sidebar — same as before */}
                                <div
                                    className={`border-r border-gray-200 overflow-y-auto pr-1 text-[10px] scrollbar-thin transition-all duration-300 ${
                                        isCategorySidebarOpen ? "w-[25%] block" : "hidden"
                                    }`}
                                >
                                    <h4 className="font-extrabold text-gray-400 uppercase text-[8px] tracking-wider mb-2 flex items-center gap-1">
                                        <Sparkles size={9} className="text-blue-500"/> Categories &
                                        Specs
                                    </h4>
                                    <div className="space-y-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedCategory("All");
                                                setSelectedSubCategory(null);
                                                setSelectedSpecification("All");
                                            }}
                                            className={`w-full text-left px-2 py-1 rounded font-bold transition-all ${
                                                selectedCategory === "All" &&
                                                selectedSpecification === "All"
                                                    ? "bg-blue-50 text-blue-600 border border-blue-100/50"
                                                    : "text-gray-600 hover:bg-gray-100 border border-transparent"
                                            }`}
                                        >
                                            📦 All Items
                                        </button>
                                        {categories.map((cat) => {
                                            const isCatSelected = selectedCategory == cat.id;
                                            const currentSubs = subCategories.filter(
                                                (sub) =>
                                                    sub.category == cat.id ||
                                                    sub.category_id == cat.id
                                            );
                                            return (
                                                <div key={cat.id} className="space-y-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (selectedCategory == cat.id) {
                                                                setSelectedCategory("All");
                                                            } else {
                                                                setSelectedCategory(cat.id);
                                                            }
                                                            setSelectedSubCategory(null);
                                                            setSelectedSpecification("All");
                                                        }}
                                                        className={`w-full flex justify-between items-center text-left px-2 py-1.5 rounded font-bold transition-all ${
                                                            isCatSelected && !selectedSubCategory
                                                                ? "bg-blue-600 text-white shadow-sm font-extrabold"
                                                                : isCatSelected
                                                                    ? "text-blue-600 bg-blue-50/50 font-bold"
                                                                    : "text-gray-700 hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        <span className="truncate">
                                                            {cat.title}
                                                        </span>
                                                        {currentSubs.length > 0 && (
                                                            <ChevronRight
                                                                size={10}
                                                                className={`transform transition-transform shrink-0 ${
                                                                    isCatSelected
                                                                        ? "rotate-90 text-blue-500"
                                                                        : "text-gray-400"
                                                                }`}
                                                            />
                                                        )}
                                                    </button>
                                                    {currentSubs.length > 0 && isCatSelected && (
                                                        <div
                                                            className="pl-2 border-l border-gray-200 ml-2 mt-1 space-y-0.5">
                                                            {currentSubs.map((sub) => {
                                                                const isSubSelected =
                                                                    selectedSubCategory == sub.id;
                                                                const subSpecs =
                                                                    availableSpecifications.filter(
                                                                        (sp) =>
                                                                            sp.sub_category == sub.id
                                                                    );
                                                                return (
                                                                    <div
                                                                        key={sub.id}
                                                                        className="space-y-0.5"
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (
                                                                                    selectedSubCategory ==
                                                                                    sub.id
                                                                                ) {
                                                                                    setSelectedSubCategory(
                                                                                        null
                                                                                    );
                                                                                } else {
                                                                                    setSelectedCategory(
                                                                                        cat.id
                                                                                    );
                                                                                    setSelectedSubCategory(
                                                                                        sub.id
                                                                                    );
                                                                                }
                                                                                setSelectedSpecification(
                                                                                    "All"
                                                                                );
                                                                            }}
                                                                            className={`w-full flex justify-between items-center text-left px-2 py-1 rounded text-[9px] transition-all duration-150 ${
                                                                                isSubSelected &&
                                                                                selectedSpecification ===
                                                                                "All"
                                                                                    ? "bg-blue-100 text-blue-700 font-extrabold"
                                                                                    : isSubSelected
                                                                                        ? "text-blue-700 font-bold bg-blue-50/60"
                                                                                        : "text-gray-600 hover:bg-gray-100"
                                                                            }`}
                                                                        >
                                                                            <span className="truncate">
                                                                                • {sub.title}
                                                                            </span>
                                                                            {subSpecs.length > 0 && (
                                                                                <ChevronRight
                                                                                    size={8}
                                                                                    className={`transform transition-transform ${
                                                                                        isSubSelected
                                                                                            ? "rotate-90 text-blue-600"
                                                                                            : "text-gray-400"
                                                                                    }`}
                                                                                />
                                                                            )}
                                                                        </button>
                                                                        {subSpecs.length > 0 &&
                                                                            isSubSelected && (
                                                                                <div
                                                                                    className="pl-2 border-l border-indigo-200 ml-2 mt-0.5 space-y-0.5">
                                                                                    {subSpecs.map((sp) => (
                                                                                        <button
                                                                                            type="button"
                                                                                            key={sp.id}
                                                                                            onClick={() => {
                                                                                                if (
                                                                                                    selectedSpecification ==
                                                                                                    sp.id
                                                                                                ) {
                                                                                                    setSelectedSpecification(
                                                                                                        "All"
                                                                                                    );
                                                                                                } else {
                                                                                                    setSelectedCategory(
                                                                                                        cat.id
                                                                                                    );
                                                                                                    setSelectedSubCategory(
                                                                                                        sub.id
                                                                                                    );
                                                                                                    setSelectedSpecification(
                                                                                                        sp.id
                                                                                                    );
                                                                                                }
                                                                                            }}
                                                                                            className={`w-full flex justify-between items-center text-left px-1.5 py-0.5 rounded text-[8px] transition-all duration-150 ${
                                                                                                selectedSpecification ==
                                                                                                sp.id
                                                                                                    ? "bg-teal-100 text-teal-800 font-black"
                                                                                                    : "text-gray-500 hover:bg-teal-50 hover:text-gray-700"
                                                                                            }`}
                                                                                        >
                                                                                            <span className="truncate">
                                                                                                🔬 {sp.name}
                                                                                            </span>
                                                                                            <span
                                                                                                className={`shrink-0 ml-1 inline-flex items-center justify-center rounded-full text-[7px] font-black px-1 min-w-[16px] h-[14px] ${
                                                                                                    selectedSpecification ==
                                                                                                    sp.id
                                                                                                        ? "bg-teal-600 text-white"
                                                                                                        : "bg-gray-200 text-gray-600"
                                                                                                }`}
                                                                                            >
                                                                                                {sp.count}
                                                                                            </span>
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Product Cards */}
                                <div
                                    className={`overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 p-0.5 content-start scrollbar-thin transition-all duration-300 ${
                                        isCategorySidebarOpen ? "w-[75%]" : "w-full"
                                    }`}
                                >
                                    {loadingProducts && products.length === 0 ? (
                                        <div className="col-span-full text-center py-8 text-gray-400 text-xs font-bold">
                                            ⏳ Loading products…
                                        </div>
                                    ) : products.length === 0 ? (
                                        <div className="col-span-full text-center py-8 text-gray-400 text-xs font-bold">
                                            😕 No products match your filters
                                        </div>
                                    ) : (
                                        products.map((product, idx) => {
                                            const isLowStock =
                                                Number(product.stock) <=
                                                Number(
                                                    product.alarm_when_stock_is_lessthanOrEqualto
                                                );
                                            const isOutOfStock = Number(product.stock) <= 0;
                                            const isFocused = idx === focusedProductIndex;
                                            return (
                                                <div
                                                    key={product.id}
                                                    ref={(el) =>
                                                        (productRefs.current[idx] = el)
                                                    }
                                                    onClick={() =>
                                                        handleAddProductToCart(product)
                                                    }
                                                    className={`group rounded-xl border flex flex-col transition-all duration-200 relative overflow-hidden cursor-pointer hover:shadow-lg active:scale-95 ${
                                                        isOutOfStock
                                                            ? "border-red-300 opacity-90"
                                                            : "border-gray-200 hover:border-blue-500"
                                                    } ${
                                                        isFocused
                                                            ? "ring-4 ring-blue-500 ring-offset-2 shadow-2xl scale-105 z-10 border-blue-500"
                                                            : ""
                                                    }`}
                                                    style={{height: "140px"}}
                                                >
                                                    <img
                                                        src={
                                                            product.image ||
                                                            "https://assets.turbologo.com/blog/en/2021/09/10093610/photo-camera-958x575.png"
                                                        }
                                                        alt={product.name}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"
                                                    />

                                                    <span
                                                        className={`absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-black rounded shadow-md z-20 uppercase tracking-wider leading-none ${
                                                            isOutOfStock
                                                                ? "bg-red-600 text-white"
                                                                : isLowStock
                                                                    ? "bg-amber-500 text-white"
                                                                    : "bg-emerald-600 text-white"
                                                        }`}
                                                    >
                                                        {isOutOfStock
                                                            ? "OUT"
                                                            : `Stock: ${product.stock}`}
                                                    </span>

                                                    {/*{isOutOfStock && (*/}
                                                    {/*    <div*/}
                                                    {/*        className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">*/}
                                                    {/*        <span*/}
                                                    {/*            className="text-[9px] font-black text-white bg-red-600 border border-red-500 px-2 py-0.5 rounded-full uppercase tracking-wider shadow">*/}
                                                    {/*            স্টক নেই*/}
                                                    {/*        </span>*/}
                                                    {/*    </div>*/}
                                                    {/*)}*/}

                                                    <div
                                                        className="mt-auto p-2 relative z-20 flex flex-col gap-0.5 pointer-events-none">
                                                        <h4 className="text-[10px] font-bold text-white line-clamp-2 leading-tight drop-shadow-sm">
                                                            {product.name}
                                                        </h4>
                                                        <p className="text-[7px] text-gray-300 font-mono">
                                                            #{product.product_code || "---"}
                                                        </p>
                                                        <div
                                                            className="flex items-center justify-between mt-1 pt-1 border-t border-white/20">
                                                            <span
                                                                className="text-[11px] font-black text-amber-400 drop-shadow">
                                                                ৳
                                                                {Number(
                                                                    product.purchase_price
                                                                ).toLocaleString()}
                                                            </span>
                                                            <span
                                                                className="text-[7px] text-gray-200 uppercase font-bold bg-white/10 px-1 rounded">
                                                                {product.unit_name || "pcs"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* 🆕 Pagination UI */}
                            {totalProducts > PAGE_SIZE && (
                                <div
                                    className="flex justify-center items-center gap-3 py-2 border-t border-gray-200 bg-white mt-2 shrink-0">
                                    <button
                                        type="button"
                                        disabled={page <= 1 || loadingProducts}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-bold"
                                    >
                                        ← Prev
                                    </button>
                                    <span className="text-[10px] font-bold text-gray-700">
                                        Page {page} / {Math.ceil(totalProducts / PAGE_SIZE)}
                                        <span className="ml-2 text-gray-400 font-normal">
                                            ({totalProducts.toLocaleString()} total)
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        disabled={
                                            page * PAGE_SIZE >= totalProducts ||
                                            loadingProducts
                                        }
                                        onClick={() => setPage((p) => p + 1)}
                                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-bold"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}

                            {/* Mobile Cart Trigger */}
                            {isMobile && (
                                <div className="p-2 bg-white border-t border-gray-200 mt-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsMobileCartOpen(true)}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={14}/>
                                        <span>
                                            View Invoice Cart ({items.length} items - ৳
                                            {netTotal.toFixed(0)})
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ═════════ DRAG HANDLE (desktop only) ═════════ */}
                        <div
                            onMouseDown={startDrag}
                            onTouchStart={startDrag}
                            onDoubleClick={() => setSplitPercent(60)}
                            title="Drag to resize · Double-click to reset"
                            className="hidden lg:flex w-2 shrink-0 cursor-col-resize items-center justify-center group select-none"
                        >
                            <div
                                className="w-1 h-16 bg-gray-300 group-hover:bg-blue-500 group-active:bg-blue-600 rounded-full transition-colors flex flex-col items-center justify-center gap-1">
                                <span className="w-0.5 h-0.5 bg-white rounded-full"></span>
                                <span className="w-0.5 h-0.5 bg-white rounded-full"></span>
                                <span className="w-0.5 h-0.5 bg-white rounded-full"></span>
                            </div>
                        </div>

                        {/* ═════════ RIGHT PANEL — Cart ═════════ */}
                        <div className="hidden lg:flex flex-1 min-w-0 flex-col h-full min-h-0 overflow-hidden">
                            {renderRightPanel(false)}
                        </div>
                    </div>
                </form>
            </div>

            {/* ═══════════ MODALS (all same as before) ═══════════ */}

            <AddSupplierModal
                isOpen={isAddSupplierOpen}
                onClose={() => {
                    setIsAddSupplierOpen(false);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
                onSuccess={(newSupplier) => {
                    handleSupplierAdded(newSupplier);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
            />

            <BaseModal
                isOpen={isViewSupplierOpen}
                onClose={() => {
                    setIsViewSupplierOpen(false);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
                title="Supplier Profile Details"
                size="md"
                variant="clean"
                showFooter={false}
                isLoading={loadingDetails}
                icon={<Eye className="text-blue-600"/>}
            >
                {supplierDetails ? (
                    <div className="space-y-6 text-gray-800">
                        <div className="flex flex-col items-center py-2">
                            <div
                                className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-150 shadow-lg bg-gray-100 flex items-center justify-center">
                                {supplierDetails.image ? (
                                    <img
                                        src={supplierDetails.image}
                                        className="w-full h-full object-cover"
                                        alt={supplierDetails.name}
                                    />
                                ) : (
                                    <span className="text-gray-300 text-3xl font-black">
                                        {supplierDetails.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <h3 className="mt-3 text-lg font-black text-gray-800">
                                {supplierDetails.name}
                            </h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Supplier Details Profile
                            </p>
                        </div>

                        <div className="grid gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        className="text-[9px] font-black text-gray-450 uppercase tracking-wider block mb-0.5">
                                        Phone
                                    </label>
                                    <span className="font-bold text-gray-800 text-sm font-mono">
                                        {supplierDetails.phone}
                                    </span>
                                </div>
                                <div>
                                    <label
                                        className="text-[9px] font-black text-gray-450 uppercase tracking-wider block mb-0.5">
                                        Email
                                    </label>
                                    <span className="font-bold text-gray-855 text-sm font-mono break-all">
                                        {supplierDetails.email || "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/60">
                                <div>
                                    <label
                                        className="text-[9px] font-black text-gray-450 uppercase tracking-wider block mb-0.5">
                                        Address
                                    </label>
                                    <span className="font-bold text-gray-855 text-xs block leading-relaxed">
                                        {supplierDetails.address || "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <label
                                        className="text-[9px] font-black text-red-500 uppercase tracking-wider block mb-0.5">
                                        Vendor Due
                                    </label>
                                    <span className="font-black text-red-600 text-base font-mono">
                                        ৳{Number(supplierDetails.due_amount || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsViewSupplierOpen(false);
                                    if (isMobile) setIsMobileCartOpen(true);
                                }}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-xs"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                        <p className="text-xs font-bold uppercase tracking-wider">
                            Loading Supplier Details...
                        </p>
                    </div>
                )}
            </BaseModal>

            {successData && (
                <SuccessModal
                    isOpen={showSuccess}
                    onClose={() => {
                        setShowSuccess(false);
                        setSuccessData(null);
                    }}
                    title="Purchase Recorded Successfully"
                    subtitle={
                        successData ? `Invoice #${successData.invoice_no} Generated` : ""
                    }
                    details={
                        successData
                            ? [
                                {
                                    label: "Net Cost Payable",
                                    value: `৳${parseFloat(
                                        successData.net_total || 0
                                    ).toLocaleString()}`,
                                },
                                {
                                    label: "Total Paid",
                                    value: `৳${parseFloat(
                                        successData.paid_amount || 0
                                    ).toLocaleString()}`,
                                },
                                {
                                    label: "Invoice Due",
                                    value: `৳${parseFloat(
                                        successData.due_amount || 0
                                    ).toLocaleString()}`,
                                },
                            ]
                            : []
                    }
                    onPrint={successData ? () => handlePrint(successData) : null}
                    printText="Print Voucher"
                />
            )}

            {isMobile && (
                <BaseModal
                    isOpen={isMobileCartOpen}
                    onClose={() => setIsMobileCartOpen(false)}
                    title="Purchase Invoice Cart"
                    size="4xl"
                    variant="clean"
                    showFooter={false}
                    icon={<ShoppingCart className="text-blue-600"/>}
                >
                    <div className="max-h-[80vh] overflow-y-auto p-1 text-gray-800">
                        {renderRightPanel(true)}
                    </div>
                </BaseModal>
            )}

            <BaseModal
                isOpen={isAddQuickCashOpen}
                onClose={() => {
                    setIsAddQuickCashOpen(false);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
                title="Add Quick Cash Option"
                size="sm"
                onSubmit={handleAddQuickCash}
                submitText="Save"
                isLoading={quickCashLoading}
                icon={<Coins className="text-emerald-600"/>}
            >
                <div className="space-y-4 text-gray-800">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                            Amount (৳) *
                        </label>
                        <input
                            type="number"
                            required
                            className="w-full border border-gray-200 p-2.5 rounded-xl font-bold mt-1"
                            value={quickCashAmount}
                            onChange={(e) => setQuickCashAmount(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                            Name / Label (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 500 Taka Note"
                            className="w-full border border-gray-200 p-2.5 rounded-xl font-bold mt-1"
                            value={quickCashName}
                            onChange={(e) => setQuickCashName(e.target.value)}
                        />
                    </div>
                </div>
            </BaseModal>

            <BaseModal
                isOpen={isPaymentModalOpen}
                onClose={() => {
                    setIsPaymentModalOpen(false);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
                title="Purchase Payment Processing"
                size="2xl"
                variant="clean"
                showFooter={false}
                icon={<Coins className="text-blue-600"/>}
            >
                <div
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:max-h-[75vh] max-h-[75vh] lg:overflow-hidden overflow-y-auto text-gray-800 scrollbar-thin animate-in fade-in duration-200">
                    <div
                        className="lg:col-span-5 flex flex-col lg:h-full lg:overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 pr-0 lg:pr-4">
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 mb-3 shrink-0">
                            <span className="text-[9px] font-black uppercase text-blue-900 block mb-0.5">
                                Selected Supplier
                            </span>
                            <div className="font-extrabold text-sm text-gray-800">
                                {supplier?.label}
                            </div>
                            <div className="mt-1 flex justify-between text-[10px] text-gray-550 font-bold">
                                <span>Previous CRM Balance:</span>
                                <span className="text-red-655 font-black">
                                    ৳{previousDue.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <h4 className="text-[10px] font-black uppercase text-gray-550 tracking-wider mb-2 shrink-0">
                            Cart Items Overview
                        </h4>
                        <div
                            className="lg:flex-1 max-h-[160px] lg:max-h-none overflow-y-auto border border-gray-150 rounded-xl bg-gray-55 mb-3 scrollbar-thin">
                            <table className="w-full text-left border-collapse text-[10px]">
                                <thead>
                                <tr className="border-b border-gray-250 text-gray-400 uppercase font-bold bg-gray-100/90 sticky top-0">
                                    <th className="py-2 px-2">Item</th>
                                    <th className="py-2 px-2 text-right">Cost</th>
                                    <th className="py-2 px-2 text-center">Qty</th>
                                    <th className="py-2 px-2 text-right">Total</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-150 bg-white">
                                {items
                                    .filter((i) => i.product)
                                    .map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-55/50">
                                            <td className="py-2 px-2 font-medium">
                                                <div className="line-clamp-1">
                                                    {item.product_name}
                                                </div>
                                            </td>
                                            <td className="py-2 px-2 text-right font-mono font-bold text-gray-700">
                                                ৳{Number(item.unit_price).toFixed(0)}
                                            </td>
                                            <td className="py-2 px-2 text-center font-mono font-bold text-gray-800">
                                                {item.quantity}
                                            </td>
                                            <td className="py-2 px-2 text-right font-mono font-black text-blue-600">
                                                ৳{item.total_price.toFixed(0)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div
                            className="bg-gray-900 text-white py-2 px-3 rounded-xl flex items-center justify-between gap-3 shadow-md mb-2 shrink-0">
                            <div className="flex items-center gap-4 text-[10px] w-full justify-center">
                                <div className="text-gray-400">
                                    Subtotal:
                                    <span className="font-mono font-bold text-white ml-1">
                                        ৳{subtotal.toFixed(0)}
                                    </span>
                                </div>
                                {globalDiscountAmount > 0 && (
                                    <div className="text-green-400">
                                        Disc:
                                        <span className="font-mono font-bold ml-1">
                                            -৳{globalDiscountAmount.toFixed(0)}
                                        </span>
                                    </div>
                                )}
                                <div className="text-emerald-400 font-bold text-[11px]">
                                    Net:
                                    <span className="font-mono font-black text-sm ml-1">
                                        ৳{netTotal.toFixed(0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 flex flex-col space-y-4">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-3 shadow-inner">
                            <label className="block text-[10px] font-black uppercase text-gray-555 tracking-wider">
                                Payment Channels
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="text-[8px] font-extrabold uppercase text-slate-400">
                                        Cash
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full border p-1 rounded-lg font-bold text-xs bg-white focus:border-blue-500 outline-none font-mono focus:shadow-md mt-0.5"
                                        value={paidCash || ""}
                                        onChange={(e) => setPaidCash(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="text-[8px] font-extrabold uppercase text-slate-400">
                                        Mobile
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full border p-1 rounded-lg font-bold text-xs bg-white focus:border-blue-500 outline-none font-mono focus:shadow-md mt-0.5"
                                        value={paidMobile || ""}
                                        onChange={(e) => setPaidMobile(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="text-[8px] font-extrabold uppercase text-slate-400">
                                        Bank
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full border p-1 rounded-lg font-bold text-xs bg-white focus:border-blue-500 outline-none font-mono focus:shadow-md mt-0.5"
                                        value={paidBank || ""}
                                        onChange={(e) => setPaidBank(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {paidMobile > 0 && (
                                <div
                                    className="grid grid-cols-2 gap-2.5 p-2.5 bg-orange-50/50 rounded-xl border border-orange-100 animate-in fade-in duration-200">
                                    <div>
                                        <label className="text-[9px] uppercase font-black text-orange-850">
                                            Operator
                                        </label>
                                        <select
                                            className="w-full border p-1.5 rounded-lg bg-white text-xs outline-none font-bold mt-1"
                                            value={mobileOperator}
                                            onChange={(e) =>
                                                setMobileOperator(e.target.value)
                                            }
                                        >
                                            <option value="">Select</option>
                                            <option value="bkash">bKash</option>
                                            <option value="nagad">Nagad</option>
                                            <option value="rocket">Rocket</option>
                                            <option value="upay">Upay</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[9px] uppercase font-black text-orange-855">
                                            Trx ID
                                        </label>
                                        <input
                                            className="w-full border p-1.5 rounded-lg bg-white text-xs font-mono outline-none mt-1"
                                            value={transactionId}
                                            onChange={(e) =>
                                                setTransactionId(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            {paidBank > 0 && (
                                <div
                                    className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-200 animate-in fade-in duration-200">
                                    <label className="text-[9px] uppercase font-black text-blue-700">
                                        Bank A/C Number
                                    </label>
                                    <input
                                        className="w-full border p-1.5 rounded-lg bg-white text-xs font-mono outline-none mt-1"
                                        value={bankAccountNo}
                                        onChange={(e) => setBankAccountNo(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-3 space-y-2">
                                <label className="text-[9px] font-black uppercase text-amber-700 tracking-wider block">
                                    Invoice Note{" "}
                                    <span className="text-gray-400 font-normal">
                                        (optional)
                                    </span>
                                </label>
                                <textarea
                                    rows={2}
                                    className="w-full border-2 border-amber-200 p-2 rounded-xl text-xs bg-white outline-none focus:border-amber-500 transition-colors resize-none"
                                    placeholder="Add a note (e.g. urgent order, pending cheque, etc.)"
                                    value={purchaseNote}
                                    onChange={(e) => setPurchaseNote(e.target.value)}
                                />
                            </div>

                            <div className="border-t border-gray-100 pt-2.5 mt-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 font-bold uppercase text-[10px]">
                                        Payment Proof
                                    </span>
                                    {paymentProof && (
                                        <button
                                            type="button"
                                            onClick={() => setPaymentProof(null)}
                                            className="text-[9px] font-bold text-rose-500 hover:text-rose-700"
                                        >
                                            × Remove
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <label
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">
                                        <span className="text-[10px] font-black uppercase text-blue-700">
                                            📁 Gallery
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                setPaymentProof(e.target.files[0])
                                            }
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setIsProofCameraOpen(true)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
                                    >
                                        <span className="text-[10px] font-black uppercase text-emerald-700">
                                            📷 Camera
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPaymentModalOpen(false);
                                            setIsRemotePairingOpen(true);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 border-2 border-dashed border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
                                    >
                                        <span className="text-[10px] font-black uppercase text-purple-700">
                                            📱 Remote
                                        </span>
                                    </button>
                                </div>
                                {paymentProof && (
                                    <p className="text-[9px] text-emerald-600 font-bold truncate">
                                        ✓ {paymentProof.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div
                            className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-250 p-4 rounded-xl space-y-3 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Banknote size={15} className="text-emerald-600"/>
                                    <span className="text-[10px] font-black uppercase text-emerald-705 tracking-wider">
                                        Cash Calculator
                                    </span>
                                </div>
                                {givenCash > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setGivenCash(0)}
                                        className="flex items-center gap-0.5 text-[9px] font-bold text-gray-400 hover:text-red-500"
                                    >
                                        <RefreshCcw size={10}/> Clear
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label
                                        className="text-[9px] font-black uppercase text-emerald-750 block mb-1">
                                        Cash Given (৳)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full border-2 border-emerald-300 p-2 rounded-lg font-black text-sm bg-white outline-none font-mono focus:border-emerald-500 text-emerald-800 placeholder-emerald-200"
                                        placeholder="0.00"
                                        value={givenCash || ""}
                                        onChange={(e) => setGivenCash(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="text-[9px] font-black uppercase text-rose-700 block mb-1">
                                        Change (৳)
                                    </label>
                                    <div
                                        className={`w-full border-2 rounded-lg p-2 font-black text-sm font-mono text-center flex items-center justify-center h-[34px] ${
                                            givenCash > netTotal
                                                ? "bg-rose-100 border-rose-400 text-rose-700"
                                                : givenCash > 0
                                                    ? "bg-yellow-100 border-yellow-350 text-yellow-855 font-bold"
                                                    : "bg-gray-100 border-gray-300 text-gray-400"
                                        }`}
                                    >
                                        ৳{Math.max(0, givenCash - netTotal).toFixed(0)}
                                    </div>
                                </div>
                            </div>

                            {quickCashList && quickCashList.length > 0 && (
                                <div
                                    className="flex flex-wrap gap-1.5 pt-2.5 border-t border-emerald-200/50 items-center">
                                    {quickCashList.map((qc) => (
                                        <button
                                            key={qc.id}
                                            type="button"
                                            onClick={() =>
                                                setGivenCash(
                                                    (prev) => Number(prev) + Number(qc.amount)
                                                )
                                            }
                                            className="flex items-center gap-1 px-2 py-1 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-650 transition-all active:scale-95 shadow-sm group"
                                        >
                                            {qc.image ? (
                                                <img
                                                    src={qc.image}
                                                    alt={qc.name}
                                                    className="w-4 h-4 object-contain rounded"
                                                />
                                            ) : (
                                                <span
                                                    className="text-[9px] font-black text-emerald-700 group-hover:text-white">
                                                    ৳
                                                </span>
                                            )}
                                            <span
                                                className="text-[10px] font-black text-gray-700 group-hover:text-white font-mono">
                                                {Number(qc.amount) >= 1000
                                                    ? `${(
                                                        Number(qc.amount) / 1000
                                                    ).toFixed(
                                                        Number(qc.amount) % 1000 === 0 ? 0 : 1
                                                    )}K`
                                                    : Number(qc.amount).toFixed(0)}
                                            </span>
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddQuickCashOpen(true);
                                            if (isMobile) setIsMobileCartOpen(false);
                                        }}
                                        className="flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-dashed border-emerald-355 rounded-lg transition-all active:scale-95 text-emerald-700 hover:border-emerald-600 font-bold text-[9px] shadow-sm group"
                                    >
                                        <Coins size={10}
                                               className="text-emerald-600 group-hover:text-white"/>
                                        <span>Add Shortcuts</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-100 p-3.5 rounded-xl space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-[10px]">
                                <div
                                    className="p-2 bg-white border border-gray-200 rounded-lg flex flex-col justify-center min-w-0">
                                    <p className="text-gray-500 font-bold uppercase mb-0.5 truncate">
                                        Total Paid
                                    </p>
                                    <p className="text-xs font-black font-mono text-blue-650">
                                        ৳{totalPaid.toFixed(2)}
                                    </p>
                                </div>
                                <div
                                    className="p-2 bg-white border border-gray-200 rounded-lg flex flex-col justify-center min-w-0">
                                    <p className="text-gray-550 font-bold uppercase mb-0.5 truncate">
                                        Invoice Due
                                    </p>
                                    <p className="text-xs font-black font-mono text-red-500">
                                        ৳{currentInvoiceDue.toFixed(2)}
                                    </p>
                                </div>
                                <div
                                    className="p-2 bg-blue-55 border border-blue-200 rounded-lg flex flex-col justify-center min-w-0">
                                    <p className="text-blue-600 font-bold uppercase mb-0.5 truncate">
                                        Vendor Due
                                    </p>
                                    <p className="text-xs font-black text-blue-700 font-mono">
                                        ৳{totalSupplierDue.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPaymentModalOpen(false);
                                        if (isMobile) setIsMobileCartOpen(true);
                                    }}
                                    className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-black text-xs uppercase tracking-wider transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSubmit()}
                                    disabled={loading}
                                    className="flex-1 py-2.5 font-black rounded-xl text-xs uppercase tracking-widest text-white shadow-md transition-all active:scale-98 bg-blue-600 hover:bg-blue-700 shadow-blue-500/10"
                                >
                                    {loading ? "Processing..." : "✓ Confirm Purchase"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseModal>

            <HoldListModal
                isOpen={isHoldModalOpen}
                onClose={() => setIsHoldModalOpen(false)}
                transactionType="purchase"
                onRestoreHold={handleRestoreHoldOrQuotation}
            />

            <CreateQuotationModal
                isOpen={isCreateQuotationOpen}
                onClose={() => setIsCreateQuotationOpen(false)}
                transactionType="purchase"
                onSave={handleSavePurchaseQuotation}
                isLoading={holdQuotationLoading}
            />

            <QuotationListModal
                isOpen={isQuotationModalOpen}
                onClose={() => setIsQuotationModalOpen(false)}
                transactionType="purchase"
                onRestoreQuotation={handleRestoreHoldOrQuotation}
            />

            <ExpiryScannerModal
                isOpen={isExpiryScannerOpen}
                onClose={() => {
                    setIsExpiryScannerOpen(false);
                    setScannerTargetIndex(null);
                }}
                onExtract={handleExpiryExtracted}
            />

            <BarcodeScannerModal
                isOpen={isBarcodeCameraOpen}
                onClose={() => setIsBarcodeCameraOpen(false)}
                onScan={async (code) => {
                    await processBarcodeCode(code);
                }}
            />

            <RemoteScannerPairingModal
                isOpen={isRemotePairingOpen}
                onClose={() => setIsRemotePairingOpen(false)}
                enabledModes={["barcode", "pack_ocr", "general_image"]}
                onScan={async (payload) => {
                    const {purpose, kind, code, image} = payload;

                    if (purpose === "barcode" && kind === "barcode") {
                        await processBarcodeCode(code);
                        return;
                    }

                    if (
                        (purpose === "pack_ocr" || purpose === "general_image") &&
                        kind === "image"
                    ) {
                        await handleRemoteImage(image);
                        return;
                    }

                    if (purpose === "payment_proof" && kind === "image") {
                        const file = dataUrlToFile(
                            image,
                            `payment-proof-${Date.now()}.jpg`
                        );
                        setPaymentProof(file);
                        if (!isPaymentModalOpen && supplier) {
                            setIsPaymentModalOpen(true);
                        }
                        return;
                    }
                }}
            />

            {isProofCameraOpen && (
                <CameraCapture
                    onClose={() => setIsProofCameraOpen(false)}
                    onCapture={(file) => {
                        setPaymentProof(file);
                        setIsProofCameraOpen(false);
                    }}
                />
            )}

            {isEditProductOpen && editingProduct && (
                <UpdateProductModal
                    isOpen={isEditProductOpen}
                    onClose={() => {
                        setIsEditProductOpen(false);
                        setEditingProduct(null);
                    }}
                    onSuccess={handleProductUpdated}
                    productData={editingProduct}
                />
            )}
        </div>
    );
};

export default PosPurchase;