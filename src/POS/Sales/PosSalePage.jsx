import React, {useEffect, useRef, useState, useCallback} from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import {posProductAPI} from "../../context_or_provider/pos/products/productAPI";
import {posSaleProductAPI} from "../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
import {posCustomerAPI} from "../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
import BASE_URL_of_POS from "../../posConfig";
import {posCategoryAPI} from "../../context_or_provider/pos/categories/categoryAPI";
import {posSubCategoryAPI} from "../../context_or_provider/pos/subcategories/subCategoryApi";
import {posBrandAPI} from "../../context_or_provider/pos/brands/brandAPI";
import {posSizeAPI} from "../../context_or_provider/pos/sizes/sizeAPI";
import {posUnitAPI} from "../../context_or_provider/pos/units/unitAPI";
import UpdateProductModal from "../Inventory/ProductList/UpdateProductModal";
import {
    Search, Sparkles, ChevronRight, Plus, Eye, UserPlus, Coins, Banknote,
    RefreshCcw, AlertTriangle, Folder, FolderOpen, Clock, FileText,
    PauseCircle, ScanLine, Smartphone, Package, CalendarDays, Info,
} from "lucide-react";
import SuccessModal from "../components/SuccessModal";
import {usePrintManager} from "../utils/usePrintManager";
import AddCustomerModal from "./CustomerList/AddCustomerModal";
import BaseModal from "../components/BaseModal";
import {useQuickCash} from "../../context_or_provider/pos/QuickCash/quick_cash_provider";
import Navbar from "../components/Navbar";
import api from "../../context_or_provider/pos/posApi";
import HoldListModal from "../components/HoldAndQuotation/HoldListModal";
import QuotationListModal from "../components/HoldAndQuotation/QuotationListModal";
import CreateQuotationModal from "../components/HoldAndQuotation/CreateQuotationModal";
import {posHoldQuotationAPI} from "../../context_or_provider/pos/HoldQuotation/holdQuotationAPI";
import {printQuotation} from "../utils/quotationPrintTemplate";
import CameraCapture from "../components/imagecapture/CameraCapture";
import RemoteScannerPairingModal from "../components/imagecapture/RemoteScannerPairingModal";
import BarcodeScannerModal from "../components/imagecapture/BarcodeScannerModal";
import MedicineDosageConfigModal from "../components/medicine/MedicineDosageConfigModal";
import MedicineDosageChart from "../components/medicine/MedicineDosageChart";
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
};

const emptyItem = {
    product: null,
    product_name: "",
    seq: 0,
    unit_price: 0,
    quantity: 1,
    discount_type: "fixed",
    discount_value: 0,
    discount_amount: 0,
    total_price: 0,
    unique_serial: "",
    is_unique: false,
    stock: 0,
    success_msg: "",
    error_msg: "",
    has_expiry: false,
    manufacturing_date: "",
    shelf_life_days: 0,
    batch_no: "",
    expiry_date: "",
    category_name: "",
    specification: null,
    show_box_calc: false,
    show_expiry_calc: false,
    show_spec_products: false,
    spec_products_list: [],
    carton_qty: 0,
    boxes_per_carton: 0,
    box_qty: 0,
    pcs_per_box: 0,
    strips_per_box: 0,
    pcs_per_strip: 0,
    loose_qty: 0,
    loose_strips: 0,
    price_per_box: 0,
    dosageConfig: null,
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

const PosSalePage = () => {
    /* ---------------- STATE ---------------- */
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
    const [isViewCustomerOpen, setIsViewCustomerOpen] = useState(false);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
    const [isCreateQuotationOpen, setIsCreateQuotationOpen] = useState(false);
    const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
    const [holdQuotationLoading, setHoldQuotationLoading] = useState(false);
    const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);

    const [customer, setCustomer] = useState(null);
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
    const [editingProduct, setEditingProduct] = useState(null);
    const [isEditProductOpen, setIsEditProductOpen] = useState(false);
    const [saleNote, setSaleNote] = useState("");

    const {quickCashList, addQuickCashOption} = useQuickCash();
    const [givenCash, setGivenCash] = useState(0);
    const [isAddQuickCashOpen, setIsAddQuickCashOpen] = useState(false);
    const [quickCashAmount, setQuickCashAmount] = useState("");
    const [quickCashName, setQuickCashName] = useState("");
    const [quickCashLoading, setQuickCashLoading] = useState(false);

    /* ═══ Server-side product state ═══ */
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [page, setPage] = useState(1);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

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
    const [isDosageModalOpen, setIsDosageModalOpen] = useState(false);
    const [dosageTargetIndex, setDosageTargetIndex] = useState(null);

    const debouncedSearch = useDebounce(searchTerm, 300);

    const [splitPercent, setSplitPercent] = useState(() => {
        const saved = typeof window !== "undefined"
            ? parseFloat(localStorage.getItem("posSplitPercent"))
            : NaN;
        return !isNaN(saved) && saved >= 35 && saved <= 75 ? saved : 60;
    });
    const [isDesktop, setIsDesktop] = useState(false);
    const splitContainerRef = useRef(null);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        try {
            localStorage.setItem("posSplitPercent", String(splitPercent));
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

    const handleOpenEditProduct = (item) => {
        if (!item?.product) return;
        const fullProduct = products.find((p) => p.id === item.product);
        if (!fullProduct) {
            alert("Product data পাওয়া যায়নি। Page refresh করুন।");
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
                            strips_per_box: updatedData.strips_per_box ?? it.strips_per_box,
                            pcs_per_strip: updatedData.pcs_per_strip ?? it.pcs_per_strip,
                            boxes_per_carton: updatedData.boxes_per_carton ?? it.boxes_per_carton,
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

    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [customerSelectKey, setCustomerSelectKey] = useState(0);

    const barcodeRef = useRef(null);
    const searchInputRef = useRef(null);
    const nextSeqRef = useRef(1);           // 🆕 sequence counter for cart rows
    const [focusedProductIndex, setFocusedProductIndex] = useState(-1);
    const productRefs = useRef([]);

    const [isBarcodeCameraOpen, setIsBarcodeCameraOpen] = useState(false);
    const [isRemotePairingOpen, setIsRemotePairingOpen] = useState(false);
    const [isProofCameraOpen, setIsProofCameraOpen] = useState(false);

    /* ---------------- EFFECTS ---------------- */
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

    const fetchAndSetWalkInCustomer = async () => {
        try {
            const res = await posCustomerAPI.search("");
            const walkIn = res.data.find(
                (c) => c.is_walk_in === true || c.is_walk_in === "true"
            );
            if (walkIn) {
                setCustomer({
                    value: walkIn.id,
                    label: `${walkIn.name} ${walkIn.phone ? `(${walkIn.phone})` : ""}`,
                    due_amount: Number(walkIn.due_amount || 0),
                    is_walk_in: true,
                });
            }
        } catch (err) {
            console.error("Error fetching default walk-in customer:", err);
        }
    };

    /* ═══ SERVER-SIDE FETCH: paginated product page ═══ */
    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            setLoadingProducts(true);
            try {
                const res = await posProductAPI.search(debouncedSearch, {
                    page,
                    page_size: PAGE_SIZE,
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
        debouncedSearch, page, selectedCategory, selectedSubCategory,
        selectedBrand, selectedSpecification, selectedSize, selectedUnit,
        refreshKey,
    ]);

    /* Reset page on filter/search change */
    useEffect(() => {
        setPage(1);
    }, [
        debouncedSearch, selectedCategory, selectedSubCategory, selectedBrand,
        selectedSpecification, selectedSize, selectedUnit,
    ]);

    /* Dropdown data + walk-in customer */
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchAndSetWalkInCustomer();
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
                console.error("Error loading database:", err);
            }
        };
        fetchData();
    }, [customerSelectKey]);

    /* ---------------- GLOBAL KEYBOARD ---------------- */
    useEffect(() => {
        const anyModalOpen =
            isPaymentModalOpen || isBarcodeCameraOpen || isRemotePairingOpen ||
            isProofCameraOpen || isCartOpen || isAddCustomerOpen ||
            isViewCustomerOpen || isAddQuickCashOpen || isHoldModalOpen ||
            isQuotationModalOpen || isCreateQuotationOpen;

        if (anyModalOpen) return;

        const handler = (e) => {
            const tag = (e.target.tagName || "").toLowerCase();
            const isBarcodeReceptor = e.target === barcodeRef.current;
            const searchFocused = document.activeElement === searchInputRef.current;
            const isEditable =
                !isBarcodeReceptor &&
                (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable);

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

            if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) {
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
                        else if (e.key === "ArrowRight") next = Math.min(prev + 1, products.length - 1);
                        else if (e.key === "ArrowLeft") next = Math.max(prev - 1, 0);
                        else if (e.key === "ArrowDown") next = Math.min(prev + cols, products.length - 1);
                        else if (e.key === "ArrowUp") next = Math.max(prev - cols, 0);
                        return next;
                    });
                    return;
                }
            }

            if (e.key === "Enter" && focusedProductIndex >= 0 && products[focusedProductIndex]) {
                e.preventDefault();
                const product = products[focusedProductIndex];
                if (Number(product.stock) > 0) {
                    handleAddProductToCart(product);
                }
                return;
            }

            if (e.key === "Escape" && focusedProductIndex >= 0) {
                e.preventDefault();
                setFocusedProductIndex(-1);
                searchInputRef.current?.focus();
                return;
            }

            if (["Shift", "Control", "Alt", "Meta", "Tab", "Escape", "Enter", "CapsLock", "Home", "End", "PageUp", "PageDown"].includes(e.key))
                return;

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
        isPaymentModalOpen, isBarcodeCameraOpen, isRemotePairingOpen,
        isProofCameraOpen, isCartOpen, isAddCustomerOpen, isViewCustomerOpen,
        isAddQuickCashOpen, isHoldModalOpen, isQuotationModalOpen,
        isCreateQuotationOpen, products, focusedProductIndex,
    ]);

    useEffect(() => {
        if (focusedProductIndex >= 0 && productRefs.current[focusedProductIndex]) {
            productRefs.current[focusedProductIndex].scrollIntoView({block: "nearest", behavior: "smooth"});
        }
    }, [focusedProductIndex]);

    useEffect(() => {
        if (focusedProductIndex >= products.length) {
            setFocusedProductIndex(products.length > 0 ? products.length - 1 : -1);
        }
    }, [products.length, focusedProductIndex]);

    /* Specs from current page */
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
                        sub_category: p.sub_category || p.sub_category_id || p.subcategory || p.subcategory_id,
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

    /* ---------------- CUSTOMER ---------------- */
    const loadCustomerOptions = async (inputValue) => {
        const res = await posCustomerAPI.search(inputValue || "");
        return res.data.map((s) => ({
            value: s.id,
            label: `${s.name} ${s.phone ? `(${s.phone})` : ""}`,
            due_amount: Number(s.due_amount || 0),
            is_walk_in: s.is_walk_in,
        }));
    };

    /* ---------------- PRODUCT SEARCH ---------------- */
    const loadProductOptions = async (inputValue) => {
        if (!inputValue) return [];
        try {
            const res = await posProductAPI.search(inputValue, {page_size: 20});
            return (res.data.results || []).map((p) => ({
                value: p.id,
                label: `${p.name} (${p.product_code})`,
                unit_price: Number(p.sale_price || p.selling_price),
                product_name: p.name,
                stock: p.stock,
                has_expiry: p.has_expiry,
                category_name: p.category_name || "",
                specification: p.specification || p.specification_id,
                tracking_mode: p.instance_tracking_mode,
                boxes_per_carton: p.boxes_per_carton || 0,
                strips_per_box: p.strips_per_box || 0,
                pcs_per_strip: p.pcs_per_strip || 0,
            }));
        } catch (err) {
            console.error("Error loading product options:", err);
            return [];
        }
    };

    /* ═══ Server-side spec product fetch ═══ */
    const fetchSpecProductsList = async (specificationId) => {
        if (!specificationId) return [];
        try {
            const res = await posProductAPI.search("", {
                specification_id: specificationId,
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
            updated[index] = {...updated[index], spec_products_list: specProducts || []};
            return updated;
        });
    };

    /* ---------------- EXPIRY HELPERS ---------------- */
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
        return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    };

    /* ═══════════════════════════════════════════════════
       🆕 FEFO batch fetch — backend থেকে কাছের expiry batch
       ═══════════════════════════════════════════════════ */
    const fetchFEFOBatchData = async (productId) => {
        if (!productId) return null;
        try {
            const response = await fetch(
                `${BASE_URL_of_POS}/api/bar-qr/instances/fefo-batch/?product_id=${productId}`
            );
            const data = await response.json();
            if (response.ok && data.id) {
                return {
                    manufacturing_date: data.manufacturing_date || "",
                    expiry_date: data.expiry_date || "",
                    batch_no: data.batch_no || "",
                    shelf_life_days: calculateShelfLifeDays(
                        data.manufacturing_date,
                        data.expiry_date
                    ),
                };
            }
        } catch (err) {
            console.error("FEFO batch fetch failed:", err);
        }
        return null;
    };

    /* ═══ Computed pcs/box for read-only display ═══ */
    const computePcsPerBox = (item) => {
        if (item.category_name?.toLowerCase().includes("medicine")) {
            const s = Number(item.strips_per_box) || 0;
            const p = Number(item.pcs_per_strip) || 0;
            if (s > 0 && p > 0) return s * p;
            return 0;
        }
        return Number(item.pcs_per_box) || 0;
    };

    /* ═══ BOX CALC — auto quantity + unit price ═══ */
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

    /* ---------------- REALTIME ENGINE ---------------- */
    const isProductDuplicate = (productId, currentIndex) =>
        items.some((item, index) => index !== currentIndex && item.product === productId);

    const isSerialDuplicate = (serial, currentIndex) =>
        items.some((item, index) => index !== currentIndex && item.unique_serial === serial);

    const calculateItemTotal = (item) => {
        const baseTotal = item.unit_price * item.quantity;
        let discount = 0;
        if (item.discount_type === "percent") discount = (baseTotal * item.discount_value) / 100;
        else discount = item.discount_value;
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

    const selectProduct = async (option, index) => {
        if (isProductDuplicate(option.value, index)) {
            updateItem(index, {error_msg: "Product already added!"});
            return;
        }
        const baseUpdates = {
            product: option.value,
            product_name: option.product_name,
            unit_price: option.unit_price,
            quantity: 1,
            stock: option.stock,
            is_unique: false,
            isScanned: false,
            unique_serial: "",
            error_msg: "",
            success_msg: "",
            has_expiry: option.has_expiry || false,
            category_name: option.category_name || "",
            specification: option.specification || null,
            manufacturing_date: "",
            shelf_life_days: 0,
            batch_no: "",
            expiry_date: "",
            show_box_calc: false,
            show_expiry_calc: false,
            show_spec_products: false,
            spec_products_list: [],
            carton_qty: 0,
            boxes_per_carton: option.boxes_per_carton || 0,
            box_qty: 0,
            pcs_per_box: 0,
            strips_per_box: option.strips_per_box || 0,
            pcs_per_strip: option.pcs_per_strip || 0,
            loose_qty: 0,
            loose_strips: 0,
            price_per_box: 0,
        };

        /* 🆕 FEFO batch auto-fill */
        if (option.has_expiry) {
            const batchInfo = await fetchFEFOBatchData(option.value);
            if (batchInfo) Object.assign(baseUpdates, batchInfo);
        }

        const specId = option.specification || null;
        if (specId) {
            const specList = await fetchSpecProductsList(specId);
            baseUpdates.spec_products_list = specList;
        }
        updateItem(index, baseUpdates);
    };

    /* ═══════════════════════════════════════════════════
       🆕 New products added to TOP of cart with sequence
       ═══════════════════════════════════════════════════ */
    const handleAddProductToCart = async (product) => {
        if (Number(product.stock) <= 0) {
            alert(`${product.name} is out of stock!`);
            return;
        }
        let currentItems = [...items];
        const isEmptyFirstRow =
            currentItems.length === 1 &&
            currentItems[0].product === null &&
            !currentItems[0].unique_serial;
        const existingIndex = currentItems.findIndex(
            (item) => item.product === product.id && !item.is_unique
        );

        if (existingIndex > -1) {
            const currentQty = currentItems[existingIndex].quantity;
            if (currentQty >= product.stock) {
                alert(`Cannot exceed available stock (${product.stock})`);
                return;
            }
            const updatedItem = {...currentItems[existingIndex], quantity: currentQty + 1};
            const {total_price, discount_amount} = calculateItemTotal(updatedItem);
            currentItems[existingIndex] = {...updatedItem, total_price, discount_amount};
            setItems(currentItems);
        } else {
            const newItem = {
                ...emptyItem,
                seq: nextSeqRef.current++,
                product: product.id,
                product_name: product.name,
                unit_price: Number(product.selling_price || product.sale_price || 0),
                quantity: 1,
                total_price: Number(product.selling_price || product.sale_price || 0),
                stock: product.stock,
                has_expiry: product.has_expiry || false,
                category_name: product.category_name || "",
                specification: product.specification || product.specification_id || null,
                boxes_per_carton: product.boxes_per_carton || 0,
                strips_per_box: product.strips_per_box || 0,
                pcs_per_strip: product.pcs_per_strip || 0,
            };

            /* 🆕 FEFO batch auto-fill */
            if (product.has_expiry) {
                const batchInfo = await fetchFEFOBatchData(product.id);
                if (batchInfo) Object.assign(newItem, batchInfo);
            }

            const specId = product.specification || product.specification_id || null;
            if (specId) {
                const specList = await fetchSpecProductsList(specId);
                newItem.spec_products_list = specList;
            }
            // 🆕 NEW ITEM AT TOP
            if (isEmptyFirstRow) setItems([newItem]);
            else setItems([newItem, ...items]);
        }
    };

    /* ---------------- SERIAL VERIFY ---------------- */
    const handleSerialVerify = async (serial, index) => {
        if (!serial || serial.length < 3) return;
        if (isSerialDuplicate(serial, index)) {
            updateItem(index, {error_msg: "Already scanned!"});
            return;
        }
        try {
            const response = await fetch(`${BASE_URL_of_POS}/api/bar-qr/verify/verify/?serial=${serial}`);
            const data = await response.json();
            if (data.valid && data.status_code === "in_stock") {
                const expiry = data.expiry_info || {};
                updateItem(index, {
                    product: data.product_id,
                    product_name: data.product.name,
                    unit_price: Number(data.product.sale_price || data.product.selling_price),
                    quantity: 1,
                    unique_serial: serial,
                    is_unique: true,
                    isScanned: true,
                    stock: data.product.stock,
                    success_msg: "Valid",
                    error_msg: "",
                    has_expiry: data.product.has_expiry || false,
                    manufacturing_date: expiry.manufacturing_date || "",
                    expiry_date: expiry.expiry_date || "",
                    batch_no: expiry.batch_no || "",
                    shelf_life_days: expiry.shelf_life_days || 0,
                    show_expiry_calc: !!expiry.expiry_date,
                });
            } else {
                updateItem(index, {
                    is_unique: false,
                    error_msg: !data.valid ? "Invalid Serial" : "Not in stock",
                    success_msg: "",
                });
            }
        } catch (err) {
            console.error("Serial verification error:", err);
            updateItem(index, {error_msg: "Verification failed", success_msg: ""});
        }
    };

    const updateQty = (index, qty) => {
        const item = items[index];
        if (item.is_unique) return;
        const maxStock = item.stock || 0;
        let finalQty = qty;
        let error_msg = "";
        if (qty > maxStock) {
            finalQty = maxStock;
            error_msg = `Only ${maxStock} in stock!`;
        } else if (qty < 1) {
            finalQty = 1;
        }
        updateItem(index, {quantity: finalQty, error_msg});
    };

    const addRow = () => setItems([
        {...emptyItem, seq: nextSeqRef.current++},
        ...items,
    ]);
    const removeRow = (index) => {
        if (items.length === 1) setItems([{...emptyItem}]);
        else setItems(items.filter((_, i) => i !== index));
    };

    const openDosageModal = (index) => {
        const item = items[index];
        if (!item?.product) return;
        const isMedicine = item.category_name?.toLowerCase().includes("medicine");
        if (!isMedicine) {
            alert("শুধু Medicine category-র জন্য ডোজ চার্ট যোগ করা যাবে");
            return;
        }
        setDosageTargetIndex(index);
        setIsDosageModalOpen(true);
    };

    const handleDosageSave = (config) => {
        if (dosageTargetIndex === null) return;
        setItems((prev) => {
            const updated = [...prev];
            updated[dosageTargetIndex] = {
                ...updated[dosageTargetIndex],
                dosageConfig: config,
            };
            return updated;
        });
        setDosageTargetIndex(null);
    };

    /* ---------------- CALCULATIONS ---------------- */
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const globalDiscountAmount =
        globalDiscountType === "percent"
            ? (subtotal * globalDiscountValue) / 100
            : globalDiscountValue;
    const netTotal = Math.max(0, subtotal - globalDiscountAmount);
    const totalPaid = Number(paidCash) + Number(paidMobile) + Number(paidBank);
    const currentInvoiceDue = Number((netTotal - totalPaid).toFixed(2));
    const previousDue = customer?.due_amount || 0;
    const totalCustomerDue = previousDue + currentInvoiceDue;
    const remainingBalance = Math.max(0, netTotal - paidMobile - paidBank);

    const isWalkInActive = customer?.is_walk_in === true || customer?.is_walk_in === "true";
    const isDueBlockActive = isWalkInActive && currentInvoiceDue > 0;

    useEffect(() => {
        if (givenCash > 0) setPaidCash(Math.min(givenCash, remainingBalance));
        else setPaidCash(0);
    }, [givenCash, remainingBalance]);

    /* ---------------- QUICK CASH ---------------- */
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
        } catch (error) {
            alert("Failed to add quick cash option. Please try again.");
        } finally {
            setQuickCashLoading(false);
        }
    };

    const {handlePrintInvoice} = usePrintManager();
    const handlePrint = (invoice) => handlePrintInvoice(invoice);

    /* ---------------- BARCODE ---------------- */
    const processBarcodeCode = async (code) => {
        if (!code) return;

        try {
            const response = await fetch(`${BASE_URL_of_POS}/api/bar-qr/verify/verify/?serial=${code}`);
            const data = await response.json();
            if (data.valid && data.status_code === "in_stock") {
                const expiry = data.expiry_info || {};
                const newItem = {
                    ...emptyItem,
                    seq: nextSeqRef.current++,
                    product: data.product_id,
                    product_name: data.product.name,
                    unit_price: Number(data.product.sale_price || data.product.selling_price),
                    quantity: 1,
                    unique_serial: code,
                    is_unique: true,
                    isScanned: true,
                    stock: data.product.stock,
                    success_msg: "Valid",
                    has_expiry: data.product.has_expiry || false,
                    manufacturing_date: expiry.manufacturing_date || "",
                    expiry_date: expiry.expiry_date || "",
                    batch_no: expiry.batch_no || "",
                    shelf_life_days: expiry.shelf_life_days || 0,
                    show_expiry_calc: !!expiry.expiry_date,
                };
                // 🆕 NEW ITEM AT TOP
                setItems((prev) => {
                    const isEmptyFirstRow =
                        prev.length === 1 && prev[0].product === null && !prev[0].unique_serial;
                    if (isEmptyFirstRow) return [newItem];
                    return [newItem, ...prev];
                });
                return;
            }
        } catch (e) {
        }

        try {
            const res = await posProductAPI.search(code, {page_size: 20});
            const results = res.data.results || [];
            if (results.length > 0) {
                await handleAddProductToCart(results[0]);
            } else {
                alert(`প্রোডাক্ট পাওয়া যায়নি: ${code}`);
            }
        } catch (err) {
            console.error("Barcode scan error:", err);
        }
    };

    const handleBarcodeScan = async (e) => {
        if (e.key !== "Enter") return;
        const code = e.target.value.trim();
        if (!code) return;
        await processBarcodeCode(code);
        e.target.value = "";
    };

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!customer) return alert("Please select a customer");
        if (isDueBlockActive) {
            alert("Walk-in customer-এর ক্ষেত্রে কোনো ডিউ রাখা যাবে না!");
            return;
        }

        const validItems = items.filter((i) => i.product);
        if (validItems.length === 0) return alert("Please add products");

        const itemsPayload = validItems.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.unit_price * item.quantity,
            discount_amount: item.discount_amount,
            net_total: item.total_price,
            serials: item.unique_serial ? [item.unique_serial] : [],
            dosage_config: item.dosageConfig || null,
        }));

        const dosageSnapshot = validItems.map((item) => ({
            product: item.product,
            product_name: item.product_name || "",
            category_name: item.category_name || "",
            dosage_config: item.dosageConfig || null,
        }));

        const itemwise_total_discount = validItems.reduce((sum, i) => sum + i.discount_amount, 0);

        const payload = {
            customer: customer.value,
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
            notes: saleNote || "",
        };

        try {
            setLoading(true);
            let res;
            if (paymentProof) {
                const formData = new FormData();
                Object.keys(payload).forEach((key) => {
                    if (key === "items") formData.append(key, JSON.stringify(payload[key]));
                    else if (payload[key] !== null && payload[key] !== undefined) formData.append(key, payload[key]);
                });
                formData.append("payment_proof", paymentProof);
                res = await api.post("/api/sale/sales/", formData, {headers: {"Content-Type": undefined}});
            } else {
                res = await posSaleProductAPI.create(payload);
            }

            setRefreshKey((k) => k + 1);

            const responseItems = res.data.items || [];
            const itemsWithDosage = responseItems.map((invItem, idx) => {
                let snap = dosageSnapshot.find((s) => String(s.product) === String(invItem.product));
                if (!snap && dosageSnapshot[idx]) snap = dosageSnapshot[idx];
                return {
                    ...invItem,
                    dosage_config: invItem.dosage_config || snap?.dosage_config || null,
                    category_name: invItem.category_name || invItem.product_category_name || snap?.category_name || "",
                    product_name: invItem.product_name || invItem.name || snap?.product_name || "",
                };
            });

            const enrichedInvoice = {...res.data, items: itemsWithDosage};

            setSuccessData(enrichedInvoice);
            setShowSuccess(true);

            setItems([{...emptyItem}]);
            setPaidCash(0);
            setGivenCash(0);
            setPaidMobile(0);
            setPaidBank(0);
            setMobileOperator("");
            setTransactionId("");
            setBankAccountNo("");
            setPaymentProof(null);
            setGlobalDiscountValue(0);
            setSaleNote("");
            setIsPaymentModalOpen(false);
            setCustomerSelectKey((k) => k + 1);
        } catch (err) {
            console.error("Sale submit failed:", err);
            let errorMsg = "Failed to save sale";
            const errData = err.response?.data;
            if (errData) {
                if (typeof errData === "string") errorMsg = errData;
                else if (errData.error) errorMsg = errData.error;
                else if (errData.detail) errorMsg = errData.detail;
                else if (errData.message) errorMsg = errData.message;
                else if (errData.non_field_errors) {
                    errorMsg = Array.isArray(errData.non_field_errors)
                        ? errData.non_field_errors.join("\n")
                        : errData.non_field_errors;
                } else {
                    const entries = Object.entries(errData);
                    const messages = entries.map(([key, val]) => {
                        const v = Array.isArray(val) ? val.join(", ")
                            : typeof val === "object" ? JSON.stringify(val) : val;
                        return `• ${key}: ${v}`;
                    });
                    if (messages.length) errorMsg = messages.join("\n");
                }
            }
            const statusText = err.response?.status ? `[HTTP ${err.response.status}] ` : "";
            alert(`❌ Sale Failed\n\n${statusText}${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- CUSTOMER / HOLD / QUOTATION ---------------- */
    const handleCustomerAdded = (newCustomer) => {
        const formattedCustomer = {
            value: newCustomer.id,
            label: `${newCustomer.name} ${newCustomer.phone ? `(${newCustomer.phone})` : ""}`,
            due_amount: Number(newCustomer.due_amount || 0),
            is_walk_in: newCustomer.is_walk_in,
        };
        setCustomer(formattedCustomer);
        setIsAddCustomerOpen(false);
    };

    const handleViewCustomerDetails = async (id) => {
        if (!id) return;
        try {
            setLoadingDetails(true);
            setIsViewCustomerOpen(true);
            const res = await posCustomerAPI.getById(id);
            setCustomerDetails(res.data);
        } catch (err) {
            console.error("Failed to load customer details:", err);
            alert("Could not load customer details");
            setIsViewCustomerOpen(false);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleHoldSale = async () => {
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
        }));

        const payload = {
            transaction_type: "sale",
            status: "hold",
            title: customer?.label ? `Hold - ${customer.label}` : "Sale Hold",
            customer: customer?.value || null,
            subtotal: subtotal,
            discount_amount: globalDiscountAmount,
            net_total: netTotal,
            items: itemsPayload,
        };

        try {
            setHoldQuotationLoading(true);
            await posHoldQuotationAPI.create(payload);
            alert("Sale successfully put on hold!");
            setItems([{...emptyItem}]);
            setPaidCash(0);
            setGivenCash(0);
            setPaidMobile(0);
            setPaidBank(0);
            setGlobalDiscountValue(0);
            setCustomerSelectKey((k) => k + 1);
        } catch (err) {
            alert(err.response?.data?.error || "Failed to hold sale");
        } finally {
            setHoldQuotationLoading(false);
        }
    };

    const handleSaveQuotation = async (quotationData) => {
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
        }));

        const payload = {
            transaction_type: "sale",
            status: "quotation",
            title: quotationData.title || `Quotation - ${customer?.label || "Client"}`,
            customer: customer?.value || null,
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
            alert("Sales Quotation created successfully!");
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
            setCustomerSelectKey((k) => k + 1);
        } catch (err) {
            alert(err.response?.data?.error || "Failed to create quotation");
        } finally {
            setHoldQuotationLoading(false);
        }
    };

    const handleRestoreHoldOrQuotation = async (data) => {
        if (data.customer) {
            setCustomer({
                value: data.customer,
                label: data.customer_name
                    ? `${data.customer_name} ${data.customer_phone ? `(${data.customer_phone})` : ""}`
                    : "Selected Client",
                due_amount: 0,
                is_walk_in: false,
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
                        seq: nextSeqRef.current++,
                        product: item.product,
                        product_name: item.product_name || "Product",
                        unit_price: Number(item.unit_price || item.selling_price || 0),
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
                        show_expiry_calc: Boolean(item.has_expiry || item.expiry_date || mfgDate),
                        category_name: item.category_name || "",
                        specification: specId,
                        spec_products_list: specList,
                        show_spec_products: false,
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

    /* ============================================================
       RENDER
       ============================================================ */
    return (
        <div className="flex flex-col h-[100dvh] overflow-hidden bg-white">
            <Navbar/>

            <input
                ref={barcodeRef}
                onKeyDown={handleBarcodeScan}
                className="absolute opacity-0 pointer-events-none"
            />

            {/* Mobile Floating Cart Button */}
            <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="lg:hidden fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-2xl shadow-blue-500/40 transition-all active:scale-95"
            >
                <span className="text-base">🛒</span>
                <span className="text-xs font-black uppercase tracking-wide">Cart</span>
                {items.filter((i) => i.product).length > 0 && (
                    <span
                        className="w-5 h-5 bg-white text-blue-700 text-[10px] font-black rounded-full flex items-center justify-center">
                        {items.filter((i) => i.product).length}
                    </span>
                )}
            </button>

            {/* Mobile Cart Drawer */}
            {isCartOpen && (
                <div className="lg:hidden fixed inset-0 z-40 flex">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsCartOpen(false)}
                    />
                    <div
                        className="relative ml-auto w-full max-w-md h-full bg-white flex flex-col shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🛒</span>
                                <span className="font-black text-sm uppercase tracking-wide">
                                    Cart ({items.filter((i) => i.product).length} items)
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCartOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="p-3 border-b border-gray-100">
                                <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                                    <label
                                        className="block text-[9px] font-extrabold uppercase text-blue-900 tracking-wider mb-1">
                                        Customer CRM *{" "}
                                        {isWalkInActive && (
                                            <span
                                                className="text-xs ml-1 bg-blue-600 text-white px-1.5 py-0.5 rounded font-black">
                                                🚶 Walk-In
                                            </span>
                                        )}
                                    </label>
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <AsyncSelect
                                                key={customerSelectKey}
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={loadCustomerOptions}
                                                value={customer}
                                                onChange={setCustomer}
                                                placeholder="Select client..."
                                                menuPortalTarget={document.body}
                                                styles={{menuPortal: (base) => ({...base, zIndex: 9999})}}
                                                className="text-xs"
                                            />
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            {customer && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewCustomerDetails(customer.value)}
                                                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-all"
                                                >
                                                    <Eye size={15}/>
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setIsAddCustomerOpen(true)}
                                                className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl border border-green-200 transition-all"
                                            >
                                                <UserPlus size={15}/>
                                            </button>
                                        </div>
                                    </div>
                                    {customer && !isWalkInActive && (
                                        <div className="mt-2 flex justify-between items-center">
                                            <span
                                                className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                                                CRM Balance
                                            </span>
                                            <span className="text-sm font-black text-red-600">
                                                ৳{previousDue.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-3 border-b border-gray-100">
                                <div className="border border-gray-200 rounded-xl bg-white overflow-x-auto">
                                    <table className="min-w-[500px] w-full text-left border-collapse text-xs">
                                        <thead>
                                        <tr className="border-b border-gray-100 text-gray-400 text-[8px] uppercase font-bold bg-gray-50">
                                            <th className="py-1.5 px-1 w-[4%] min-w-[20px] text-center">#</th>
                                            <th className="py-1.5 px-1 w-[16%] min-w-[80px]">Serial</th>
                                            <th className="py-1.5 px-1 w-[26%] min-w-[110px]">Item</th>
                                            <th className="py-1.5 px-1 w-[11%] min-w-[55px] text-right">Price</th>
                                            <th className="py-1.5 px-1 w-[14%] min-w-[70px] text-center">Qty</th>
                                            <th className="py-1.5 px-1 w-[15%] min-w-[80px] text-center">Disc</th>
                                            <th className="py-1.5 px-1 w-[10%] min-w-[55px] text-right">Total</th>
                                            <th className="py-1.5 px-0.5 w-[4%] min-w-[20px] text-center"></th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                        {items.map((item, index) => (
                                            <tr key={item.seq || index} className="text-xs hover:bg-gray-50/60">
                                                <td className="py-2 px-1 text-gray-400 font-bold text-center w-[4%] min-w-[20px]">
                                                    {/*{item.seq || index + 1}*/}
                                                    {/*{index + 1}*/}
                                                    {items.length - index}
                                                </td>
                                                <td className="py-2 px-1 w-[16%] min-w-[80px]">
                                                    <input
                                                        type="text"
                                                        placeholder="Scan..."
                                                        className={`w-full border p-0.5 sm:p-1 rounded font-mono text-[9px] sm:text-[10px] outline-none transition-all ${
                                                            item.error_msg
                                                                ? "border-red-400 bg-red-50 text-red-700 font-bold"
                                                                : "border-gray-300 focus:border-blue-500"
                                                        }`}
                                                        value={item.unique_serial}
                                                        onChange={(e) => {
                                                            updateItem(index, {unique_serial: e.target.value});
                                                            if (e.target.value.length >= 3)
                                                                handleSerialVerify(e.target.value, index);
                                                        }}
                                                    />
                                                    {item.error_msg && (
                                                        <p className="text-red-500 text-[8px] font-bold mt-0.5 leading-none">
                                                            {item.error_msg}
                                                        </p>
                                                    )}
                                                    {item.success_msg && (
                                                        <p className="text-green-600 text-[8px] font-bold mt-0.5 leading-none">
                                                            {item.success_msg}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="py-2 px-1 w-[26%] min-w-[110px]">
                                                    <AsyncSelect
                                                        loadOptions={loadProductOptions}
                                                        defaultOptions={false}
                                                        onChange={(opt) => selectProduct(opt, index)}
                                                        value={
                                                            item.product
                                                                ? {value: item.product, label: item.product_name}
                                                                : null
                                                        }
                                                        placeholder="Find..."
                                                        isDisabled={item.is_unique}
                                                        menuPortalTarget={document.body}
                                                        styles={{menuPortal: (base) => ({...base, zIndex: 9999})}}
                                                        className="text-[9px] sm:text-[10px]"
                                                    />
                                                    {item.product && !item.is_unique && (
                                                        <span
                                                            className="text-[8px] font-bold text-blue-500 mt-0.5 block leading-none">
                                                            Stock: {item.stock}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-2 px-1 w-[11%] min-w-[55px]">
                                                    <input
                                                        type="number"
                                                        value={item.unit_price || 0}
                                                        onChange={(e) =>
                                                            updateItem(index, {unit_price: Number(e.target.value)})
                                                        }
                                                        readOnly={item.isScanned}
                                                        className={`w-full border p-0.5 sm:p-1 rounded text-right font-mono text-[9px] sm:text-[10px] ${
                                                            item.isScanned
                                                                ? "bg-gray-100 cursor-not-allowed text-gray-500"
                                                                : "bg-white text-gray-800 focus:border-blue-500 outline-none"
                                                        }`}
                                                    />
                                                </td>
                                                <td className="py-2 px-1 w-[14%] min-w-[70px]">
                                                    {item.is_unique ? (
                                                        <div className="text-center">
                                                            <span
                                                                className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                                                                Unique
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="flex items-center justify-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden h-6 sm:h-7 inline-flex">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQty(index, item.quantity - 1)}
                                                                className="w-4 sm:w-5 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 font-bold text-xs"
                                                            >
                                                                -
                                                            </button>
                                                            <span
                                                                className="w-5 sm:w-6 text-center text-[10px] sm:text-xs font-bold font-mono">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQty(index, item.quantity + 1)}
                                                                className="w-4 sm:w-5 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 font-bold text-xs"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-2 px-1 w-[15%] min-w-[80px]">
                                                    <div
                                                        className="flex items-center border border-gray-300 rounded overflow-hidden bg-white h-6 sm:h-7">
                                                        <select
                                                            className="bg-gray-50 text-[8px] sm:text-[9px] p-0.5 sm:p-1 border-r border-gray-300 outline-none cursor-pointer font-bold"
                                                            value={item.discount_type}
                                                            onChange={(e) =>
                                                                updateItem(index, {discount_type: e.target.value})
                                                            }
                                                        >
                                                            <option value="fixed">Fixed</option>
                                                            <option value="percent">%</option>
                                                        </select>
                                                        <input
                                                            type="number"
                                                            className="w-full bg-transparent p-0.5 sm:p-1 text-[9px] sm:text-[10px] font-bold text-center text-gray-800 outline-none font-mono"
                                                            placeholder="0"
                                                            value={item.discount_value || ""}
                                                            onChange={(e) =>
                                                                updateItem(index, {discount_value: Number(e.target.value)})
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-2 px-1 text-right w-[10%] min-w-[55px]">
                                                    <span
                                                        className="font-bold font-mono text-blue-700 text-[10px] sm:text-[11px] block">
                                                        ৳{item.total_price.toFixed(0)}
                                                    </span>
                                                    {item.discount_amount > 0 && (
                                                        <span
                                                            className="text-[8px] text-green-600 font-bold block leading-none mt-0.5">
                                                            Saved: ৳{item.discount_amount.toFixed(0)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-2 px-0.5 text-center w-[4%] min-w-[20px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRow(index)}
                                                        className="text-gray-400 hover:text-red-500 font-bold text-sm sm:text-base p-0.5"
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="p-3">
                                <div className="bg-gray-900 text-white p-3 rounded-xl space-y-2">
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between text-gray-400">
                                            <span>Items Subtotal</span>
                                            <span className="font-mono">৳{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-green-400">
                                            <span>Global Discount</span>
                                            <span className="font-mono">- ৳{globalDiscountAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-1 border-t border-gray-800">
                                            <span className="text-gray-400 font-bold">Net Payable</span>
                                            <span className="font-mono font-black text-white text-base">
                                                ৳{netTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 p-3 border-t border-gray-200 bg-white flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm("Clear cart?")) {
                                        setItems([{...emptyItem}]);
                                        setPaidCash(0);
                                        setGivenCash(0);
                                        setPaidMobile(0);
                                        setPaidBank(0);
                                        setGlobalDiscountValue(0);
                                        setCustomerSelectKey((k) => k + 1);
                                    }
                                }}
                                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 font-semibold text-xs uppercase tracking-wider"
                            >
                                Clear Cart
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!customer) return alert("Please select a customer");
                                    const validItems = items.filter((i) => i.product);
                                    if (validItems.length === 0) return alert("Please add products");
                                    setIsPaymentModalOpen(true);
                                    setIsCartOpen(false);
                                }}
                                className="flex-1 py-2.5 font-bold rounded-xl text-xs uppercase tracking-wider text-white shadow-md bg-blue-600 hover:bg-blue-700 active:scale-95"
                            >
                                Make Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MAIN FORM */}
            <div className="flex-1 p-2 min-h-0 overflow-hidden">
                <form
                    id="posSaleForm"
                    onSubmit={handleSubmit}
                    className="flex flex-col lg:flex-row gap-3 lg:gap-0 h-full min-h-0 overflow-hidden text-gray-800"
                >
                    <div
                        ref={splitContainerRef}
                        className="flex flex-col lg:flex-row w-full h-full min-h-0 gap-3 lg:gap-0"
                    >
                        {/* LEFT PANEL */}
                        <div
                            style={isDesktop ? {flexBasis: `${splitPercent}%`} : undefined}
                            className="w-full lg:flex-none flex flex-col h-full min-h-0 bg-gray-50 p-2.5 rounded-2xl border border-gray-200 overflow-hidden"
                        >
                            {/* Filters */}
                            <div className="flex flex-wrap gap-1.5 mb-2 shrink-0 items-end">
                                <div className="flex gap-1.5 items-end flex-1 min-w-[280px]">
                                    <button
                                        type="button"
                                        onClick={() => setIsCategorySidebarOpen(!isCategorySidebarOpen)}
                                        className="p-1.5 bg-white border border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-500 transition-colors shadow-sm cursor-pointer shrink-0 h-[28px] flex items-center justify-center mb-[1px]"
                                    >
                                        {isCategorySidebarOpen ? <FolderOpen size={14}/> : <Folder size={14}/>}
                                    </button>
                                    <div className="relative flex-1 min-w-[130px]">
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
                                        className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-md transition-all active:scale-95 h-[28px] flex items-center justify-center mb-[1px] shrink-0"
                                    >
                                        <ScanLine size={14}/>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsRemotePairingOpen(true)}
                                        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all active:scale-95 h-[28px] flex items-center justify-center mb-[1px] shrink-0"
                                    >
                                        <Smartphone size={14}/>
                                    </button>
                                </div>

                                <div className="w-[135px] shrink-0">
                                    <label
                                        className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">Category</label>
                                    <Select
                                        value={selectedCategory === "All" ? {value: "All", label: "All"} : {
                                            value: selectedCategory,
                                            label: categories.find((c) => c.id == selectedCategory)?.title || "…",
                                        }}
                                        onChange={(option) => {
                                            const val = option ? option.value : "All";
                                            setSelectedCategory(val);
                                            setSelectedSubCategory(null);
                                            setSelectedSpecification("All");
                                        }}
                                        options={[
                                            {value: "All", label: "All"},
                                            ...categories.map((cat) => ({value: cat.id, label: cat.title})),
                                        ]}
                                        styles={customSelectStyles}
                                        placeholder="Category"
                                        isSearchable
                                    />
                                </div>
                                <div className="w-[135px] shrink-0">
                                    <label
                                        className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">Subcategory</label>
                                    <Select
                                        value={!selectedSubCategory ? {value: "All", label: "All"} : {
                                            value: selectedSubCategory,
                                            label: subCategories.find((s) => s.id == selectedSubCategory)?.title || "…",
                                        }}
                                        onChange={(option) => {
                                            const val = option ? option.value : "All";
                                            setSelectedSubCategory(val === "All" ? null : val);
                                            setSelectedSpecification("All");
                                        }}
                                        options={[
                                            {value: "All", label: "All"},
                                            ...(selectedCategory === "All" ? subCategories : subCategories.filter(
                                                (sub) => sub.category == selectedCategory || sub.category_id == selectedCategory
                                            )).map((sub) => ({value: sub.id, label: sub.title})),
                                        ]}
                                        styles={customSelectStyles}
                                        placeholder="Sub"
                                        isSearchable
                                    />
                                </div>
                                <div className="w-[135px] shrink-0">
                                    <label
                                        className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">Specification</label>
                                    <Select
                                        value={selectedSpecification === "All" ? {value: "All", label: "All"} : {
                                            value: selectedSpecification,
                                            label: availableSpecifications.find((s) => s.id == selectedSpecification)?.name || "…",
                                        }}
                                        onChange={(option) => {
                                            const val = option ? option.value : "All";
                                            setSelectedSpecification(val);
                                        }}
                                        options={[
                                            {value: "All", label: "All"},
                                            ...availableSpecifications.filter((sp) => {
                                                if (selectedSubCategory) return sp.sub_category == selectedSubCategory;
                                                if (selectedCategory !== "All") return sp.category == selectedCategory;
                                                return true;
                                            }).map((sp) => ({value: sp.id, label: sp.name})),
                                        ]}
                                        styles={customSelectStyles}
                                        placeholder="Spec"
                                        isSearchable
                                    />
                                </div>
                                <div className="w-[120px] shrink-0">
                                    <label
                                        className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">Brand</label>
                                    <Select
                                        value={selectedBrand === "All" ? {value: "All", label: "All"} : {
                                            value: selectedBrand,
                                            label: brands.find((b) => b.id == selectedBrand)?.title || "…",
                                        }}
                                        onChange={(option) => setSelectedBrand(option ? option.value : "All")}
                                        options={[
                                            {value: "All", label: "All"},
                                            ...brands.map((br) => ({value: br.id, label: br.title})),
                                        ]}
                                        styles={customSelectStyles}
                                        placeholder="Brand"
                                        isSearchable
                                    />
                                </div>
                                <div className="w-[110px] shrink-0">
                                    <label
                                        className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">Size</label>
                                    <Select
                                        value={selectedSize === "All" ? {value: "All", label: "All"} : {
                                            value: selectedSize,
                                            label: sizes.find((s) => s.id == selectedSize)?.title || "…",
                                        }}
                                        onChange={(option) => setSelectedSize(option ? option.value : "All")}
                                        options={[
                                            {value: "All", label: "All"},
                                            ...sizes.map((sz) => ({value: sz.id, label: sz.title})),
                                        ]}
                                        styles={customSelectStyles}
                                        placeholder="Size"
                                        isSearchable
                                    />
                                </div>
                                <div className="w-[110px] shrink-0">
                                    <label
                                        className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">Unit</label>
                                    <Select
                                        value={selectedUnit === "All" ? {value: "All", label: "All"} : {
                                            value: selectedUnit,
                                            label: units.find((u) => u.id == selectedUnit)?.title || "…",
                                        }}
                                        onChange={(option) => setSelectedUnit(option ? option.value : "All")}
                                        options={[
                                            {value: "All", label: "All"},
                                            ...units.map((ut) => ({value: ut.id, label: ut.title})),
                                        ]}
                                        styles={customSelectStyles}
                                        placeholder="Unit"
                                        isSearchable
                                    />
                                </div>
                                <div className="w-[80px] shrink-0">
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

                            {/* Active filters */}
                            {hasActiveFilters && (
                                <div className="flex flex-wrap gap-1 mb-2 px-1 shrink-0">
                                    {selectedCategory !== "All" && (
                                        <span
                                            className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-blue-200">
                                            <span>Cat: {categories.find((c) => c.id == selectedCategory)?.title || selectedCategory}</span>
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
                                            <span>Sub: {subCategories.find((s) => s.id == selectedSubCategory)?.title || selectedSubCategory}</span>
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
                                            <span>Spec: {availableSpecifications.find((s) => s.id == selectedSpecification)?.name || selectedSpecification}</span>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedSpecification("All")}
                                                className="text-teal-500 hover:text-teal-900 font-bold focus:outline-none"
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
                                className="flex justify-between items-center px-1 pb-2 mb-2 border-b border-gray-200 text-[10px] text-gray-500 font-bold tracking-wide shrink-0">
                                <span>
                                    {loadingProducts ? (
                                        <>⏳ Loading…</>
                                    ) : (
                                        <>
                                            Showing {products.length} of {totalProducts.toLocaleString()} products
                                            <span className="text-gray-400 font-normal ml-1">
                                                (Page {page}/{Math.max(1, Math.ceil(totalProducts / PAGE_SIZE))})
                                            </span>
                                        </>
                                    )}
                                </span>
                                <span className="text-[9px] text-gray-400 italic">
                                    💡 যেকোনো key চাপলে search-এ auto focus
                                </span>
                            </div>

                            {/* Categories + Grid */}
                            <div className="flex flex-1 overflow-hidden gap-2 min-h-0">
                                <div
                                    className={`${
                                        isCategorySidebarOpen
                                            ? "w-[28%] md:w-[25%] lg:w-[20%] border-r border-gray-200 pr-1"
                                            : "w-0 overflow-hidden border-none pr-0"
                                    } transition-all duration-200 overflow-y-auto text-[10px] scrollbar-thin shrink-0`}
                                >
                                    <h4 className="font-extrabold text-gray-400 uppercase text-[8px] tracking-wider mb-2 flex items-center gap-1">
                                        <Sparkles size={9} className="text-blue-500"/> Categories & Specs
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
                                                selectedCategory === "All" && selectedSpecification === "All"
                                                    ? "bg-blue-50 text-blue-600 border border-blue-100/50"
                                                    : "text-gray-600 hover:bg-gray-100 border border-transparent"
                                            }`}
                                        >
                                            📦 All Items
                                        </button>
                                        {categories.map((cat) => {
                                            const isCatSelected = selectedCategory == cat.id;
                                            const currentSubs = subCategories.filter(
                                                (sub) => sub.category == cat.id || sub.category_id == cat.id
                                            );
                                            return (
                                                <div key={cat.id} className="space-y-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (selectedCategory == cat.id) setSelectedCategory("All");
                                                            else setSelectedCategory(cat.id);
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
                                                        <span className="truncate">{cat.title}</span>
                                                        {currentSubs.length > 0 && (
                                                            <ChevronRight
                                                                size={10}
                                                                className={`transform transition-transform shrink-0 ${
                                                                    isCatSelected ? "rotate-90 text-blue-500" : "text-gray-400"
                                                                }`}
                                                            />
                                                        )}
                                                    </button>
                                                    {currentSubs.length > 0 && isCatSelected && (
                                                        <div
                                                            className="pl-2 border-l border-gray-200 ml-2 mt-1 space-y-0.5">
                                                            {currentSubs.map((sub) => {
                                                                const isSubSelected = selectedSubCategory == sub.id;
                                                                const subSpecs = availableSpecifications.filter((sp) => sp.sub_category == sub.id);
                                                                return (
                                                                    <div key={sub.id} className="space-y-0.5">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (selectedSubCategory == sub.id) setSelectedSubCategory(null);
                                                                                else {
                                                                                    setSelectedCategory(cat.id);
                                                                                    setSelectedSubCategory(sub.id);
                                                                                }
                                                                                setSelectedSpecification("All");
                                                                            }}
                                                                            className={`w-full flex justify-between items-center text-left px-2 py-1 rounded text-[9px] transition-all duration-150 ${
                                                                                isSubSelected && selectedSpecification === "All"
                                                                                    ? "bg-blue-100 text-blue-700 font-extrabold"
                                                                                    : isSubSelected
                                                                                        ? "text-blue-700 font-bold bg-blue-50/60"
                                                                                        : "text-gray-500 hover:bg-gray-100"
                                                                            }`}
                                                                        >
                                                                            <span
                                                                                className="truncate">• {sub.title}</span>
                                                                            {subSpecs.length > 0 && (
                                                                                <ChevronRight
                                                                                    size={8}
                                                                                    className={`transform transition-transform ${isSubSelected ? "rotate-90 text-blue-600" : "text-gray-400"}`}
                                                                                />
                                                                            )}
                                                                        </button>
                                                                        {subSpecs.length > 0 && isSubSelected && (
                                                                            <div
                                                                                className="pl-2 border-l border-indigo-200 ml-2 mt-0.5 space-y-0.5">
                                                                                {subSpecs.map((sp) => (
                                                                                    <button
                                                                                        type="button"
                                                                                        key={sp.id}
                                                                                        onClick={() => {
                                                                                            if (selectedSpecification == sp.id) setSelectedSpecification("All");
                                                                                            else {
                                                                                                setSelectedCategory(cat.id);
                                                                                                setSelectedSubCategory(sub.id);
                                                                                                setSelectedSpecification(sp.id);
                                                                                            }
                                                                                        }}
                                                                                        className={`w-full flex justify-between items-center text-left px-1.5 py-0.5 rounded text-[8px] transition-all duration-150 ${
                                                                                            selectedSpecification == sp.id
                                                                                                ? "bg-teal-100 text-teal-800 font-black"
                                                                                                : "text-gray-500 hover:bg-teal-50 hover:text-gray-700"
                                                                                        }`}
                                                                                    >
                                                                                        <span
                                                                                            className="truncate">🔬 {sp.name}</span>
                                                                                        <span
                                                                                            className={`shrink-0 ml-1 inline-flex items-center justify-center rounded-full text-[7px] font-black px-1 min-w-[16px] h-[14px] ${
                                                                                                selectedSpecification == sp.id
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

                                <div
                                    className={`${
                                        isCategorySidebarOpen ? "flex-1 min-w-0" : "w-full"
                                    } overflow-y-auto grid gap-2 p-0.5 content-start scrollbar-thin transition-all duration-200`}
                                    style={{gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))"}}
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
                                            const isLowStock = Number(product.stock) <= Number(product.alarm_when_stock_is_lessthanOrEqualto);
                                            const isOutOfStock = Number(product.stock) <= 0;
                                            const isFocused = idx === focusedProductIndex;

                                            return (
                                                <div
                                                    key={product.id}
                                                    ref={(el) => (productRefs.current[idx] = el)}
                                                    onClick={() => !isOutOfStock && handleAddProductToCart(product)}
                                                    className={`group rounded-xl border flex flex-col transition-all duration-200 relative overflow-hidden ${
                                                        isOutOfStock
                                                            ? "border-gray-200 opacity-60 cursor-not-allowed"
                                                            : "border-gray-200 hover:border-blue-500 cursor-pointer hover:shadow-lg active:scale-95"
                                                    } ${isFocused ? "ring-4 ring-blue-500 ring-offset-2 z-10" : ""}`}
                                                    style={{height: "140px"}}
                                                >
                                                    <img
                                                        src={product.image || "https://assets.turbologo.com/blog/en/2021/09/10093610/photo-camera-958x575.png"}
                                                        alt={product.name}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"/>

                                                    <span
                                                        className={`absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-black rounded shadow-md z-20 uppercase tracking-wider leading-none ${
                                                            isOutOfStock ? "bg-red-600 text-white" : isLowStock ? "bg-amber-500 text-white" : "bg-emerald-600 text-white"
                                                        }`}
                                                    >
                                                        {isOutOfStock ? "OUT" : `Stock: ${product.stock}`}
                                                    </span>

                                                    {isLowStock && !isOutOfStock && (
                                                        <span
                                                            className="absolute top-1 right-1 px-1.5 py-0.5 text-[7px] font-black rounded bg-orange-500 text-white z-20 uppercase tracking-wider leading-none shadow">
                                                            ⚠ LOW
                                                        </span>
                                                    )}

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
                                                                ৳{Number(product.selling_price || product.sale_price).toLocaleString()}
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

                            {/* Pagination UI */}
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
                                        disabled={page * PAGE_SIZE >= totalProducts || loadingProducts}
                                        onClick={() => setPage((p) => p + 1)}
                                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-bold"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* DRAG HANDLE */}
                        <div
                            onMouseDown={startDrag}
                            onTouchStart={startDrag}
                            onDoubleClick={() => setSplitPercent(60)}
                            className="hidden lg:flex w-2 shrink-0 cursor-col-resize items-center justify-center group select-none"
                        >
                            <div
                                className="w-1 h-16 bg-gray-300 group-hover:bg-blue-500 group-active:bg-blue-600 rounded-full transition-colors flex flex-col items-center justify-center gap-1">
                                <span className="w-0.5 h-0.5 bg-white rounded-full"></span>
                                <span className="w-0.5 h-0.5 bg-white rounded-full"></span>
                                <span className="w-0.5 h-0.5 bg-white rounded-full"></span>
                            </div>
                        </div>

                        {/* RIGHT PANEL */}
                        <div
                            className="hidden lg:flex flex-1 min-w-0 flex-col h-full min-h-0 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-3 gap-2">
                            {/* Customer CRM */}
                            <div
                                className="bg-blue-50/70 p-1.5 rounded-lg border border-blue-100 flex flex-col gap-1 shadow-sm shrink-0">
                                <label className="block text-[8px] font-black uppercase text-blue-900 tracking-wider">
                                    Customer CRM *{" "}
                                    {isWalkInActive && (
                                        <span
                                            className="text-[8px] ml-1 bg-blue-600 text-white px-1 py-0.5 rounded font-black">
                                            🚶 Walk-In Active
                                        </span>
                                    )}
                                </label>
                                <div className="flex gap-1.5 items-center">
                                    <div className="flex-1 min-w-0">
                                        <AsyncSelect
                                            key={customerSelectKey}
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={loadCustomerOptions}
                                            value={customer}
                                            onChange={setCustomer}
                                            placeholder="Select customer..."
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: (base) => ({...base, zIndex: 9999}),
                                                control: (base) => ({...base, minHeight: "28px", height: "28px"}),
                                                valueContainer: (base) => ({...base, height: "28px", padding: "0 6px"}),
                                                input: (base) => ({...base, margin: "0px"}),
                                                indicatorsContainer: (base) => ({...base, height: "28px"}),
                                            }}
                                            className="text-[11px] font-medium"
                                        />
                                    </div>
                                    <div className="flex gap-1 shrink-0 items-center">
                                        {customer && (
                                            <button
                                                type="button"
                                                onClick={() => handleViewCustomerDetails(customer.value)}
                                                className="p-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-md transition-all duration-200 shadow-sm"
                                                title="View Customer Details"
                                            >
                                                <Eye size={12}/>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setIsAddCustomerOpen(true)}
                                            className="p-1 bg-green-100 hover:bg-green-200 text-green-600 rounded-md border border-green-200 transition-all duration-200 shadow-sm"
                                            title="Add New Customer"
                                        >
                                            <UserPlus size={12}/>
                                        </button>
                                        {customer && !isWalkInActive && (
                                            <div className="text-right leading-none ml-1">
                                                <span
                                                    className="text-[7.5px] text-gray-400 block font-bold uppercase leading-none">CRM Bal</span>
                                                <span
                                                    className="text-[10px] font-black text-red-600 font-mono leading-none">
                                                    ৳{previousDue.toFixed(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pb-1 border-b border-gray-100 shrink-0">
                                <h3 className="text-xs font-black uppercase text-gray-700 flex items-center gap-1">
                                    🛒 POS Cart Rows ({items.length})
                                </h3>
                                <button
                                    type="button"
                                    onClick={addRow}
                                    className="text-[9px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 px-2 py-1 rounded-lg transition-all flex items-center gap-0.5"
                                >
                                    <Plus size={10}/> Add Row
                                </button>
                            </div>

                            <div
                                className="flex-1 min-h-0 overflow-auto border border-gray-200 rounded-xl bg-gray-50/50 scrollbar-thin">
                                <table className="min-w-[380px] w-full text-left border-collapse text-xs">
                                    <thead>
                                    <tr className="border-b border-gray-200 text-gray-400 text-[9px] uppercase font-bold bg-gray-100/90 sticky top-0 z-10">
                                        <th className="py-1.5 px-1 w-[4%] min-w-[15px] text-center">#</th>
                                        <th className="py-1.5 px-1 w-[16%] min-w-[65px]">Serial</th>
                                        <th className="py-1.5 px-1 w-[27%] min-w-[90px]">Item</th>
                                        <th className="py-1.5 px-1 w-[11%] min-w-[45px] text-right">Price</th>
                                        <th className="py-1.5 px-1 w-[11%] min-w-[45px] text-center">Qty</th>
                                        <th className="py-1.5 px-1 w-[16%] min-w-[70px] text-center">Discount</th>
                                        <th className="py-1.5 px-1 w-[11%] min-w-[45px] text-right">Total</th>
                                        <th className="py-1.5 px-0.5 w-[4%] min-w-[15px] text-center"></th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                    {items.map((item, index) => (
                                        <React.Fragment key={item.seq || index}>
                                            <tr className="text-xs hover:bg-gray-50/60">
                                                <td className="py-1 px-1 text-gray-400 font-bold text-center w-[4%] min-w-[15px]">
                                                    {/*{item.seq || index + 1}*/}
                                                    {/*{index + 1}*/}
                                                    {items.length - index}
                                                </td>
                                                <td className="py-1 px-1 w-[16%] min-w-[65px]">
                                                    <input
                                                        type="text"
                                                        placeholder="Scan..."
                                                        className={`w-full border p-0.5 rounded font-mono text-[9px] sm:text-[10px] outline-none transition-all ${
                                                            item.error_msg
                                                                ? "border-red-400 bg-red-50 text-red-700 font-bold"
                                                                : "border-gray-300 focus:border-blue-500"
                                                        }`}
                                                        value={item.unique_serial}
                                                        onChange={(e) => {
                                                            updateItem(index, {unique_serial: e.target.value});
                                                            if (e.target.value.length >= 3)
                                                                handleSerialVerify(e.target.value, index);
                                                        }}
                                                    />
                                                    {item.error_msg && (
                                                        <p className="text-red-500 text-[8px] font-bold mt-0.5 leading-none">
                                                            {item.error_msg}
                                                        </p>
                                                    )}
                                                    {item.success_msg && (
                                                        <p className="text-green-600 text-[8px] font-bold mt-0.5 leading-none">
                                                            {item.success_msg}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="py-1 px-1 w-[27%] min-w-[90px]">
                                                    <AsyncSelect
                                                        loadOptions={loadProductOptions}
                                                        defaultOptions={false}
                                                        onChange={(opt) => selectProduct(opt, index)}
                                                        value={item.product ? {
                                                            value: item.product,
                                                            label: item.product_name
                                                        } : null}
                                                        placeholder="Find..."
                                                        isDisabled={item.is_unique}
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({...base, zIndex: 9999}),
                                                            control: (base) => ({
                                                                ...base,
                                                                minHeight: "24px",
                                                                height: "24px"
                                                            }),
                                                            valueContainer: (base) => ({
                                                                ...base,
                                                                height: "24px",
                                                                padding: "0 4px"
                                                            }),
                                                            input: (base) => ({...base, margin: "0px"}),
                                                            indicatorsContainer: (base) => ({...base, height: "24px"}),
                                                        }}
                                                        className="text-[9px] sm:text-[10px]"
                                                    />
                                                    {item.product && !item.is_unique && (
                                                        <span
                                                            className="text-[8px] font-bold text-blue-500 mt-0.5 block leading-none">
                                                            Stock: {item.stock}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-1 px-1 w-[11%] min-w-[45px]">
                                                    <input
                                                        type="number"
                                                        value={item.unit_price || 0}
                                                        onChange={(e) => updateItem(index, {unit_price: Number(e.target.value)})}
                                                        readOnly={item.isScanned}
                                                        className={`w-full border p-0.5 rounded text-right font-mono text-[9px] sm:text-[10px] ${
                                                            item.isScanned
                                                                ? "bg-gray-100 cursor-not-allowed text-gray-500"
                                                                : "bg-white text-gray-800 focus:border-blue-500 outline-none"
                                                        }`}
                                                    />
                                                </td>
                                                <td className="py-1 px-1 w-[11%] min-w-[45px]">
                                                    {item.is_unique ? (
                                                        <div className="text-center">
                                                            <span
                                                                className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                                                                Unique
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="flex items-center justify-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden h-6 inline-flex">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQty(index, item.quantity - 1)}
                                                                className="w-4 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 font-bold text-xs"
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="text"
                                                                inputMode="numeric"
                                                                pattern="[0-9]*"
                                                                className="w-6 text-center text-[9px] font-bold font-mono text-gray-800 bg-transparent outline-none border-none"
                                                                value={item.quantity}
                                                                onFocus={(e) => e.target.select()}
                                                                onChange={(e) => {
                                                                    const raw = e.target.value.replace(/[^0-9]/g, "");
                                                                    updateItem(index, {quantity: raw === "" ? "" : Number(raw)});
                                                                }}
                                                                onBlur={(e) => {
                                                                    const val = Number(e.target.value);
                                                                    updateQty(index, val > 0 ? val : 1);
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQty(index, item.quantity + 1)}
                                                                className="w-4 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 font-bold text-xs"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-1 px-1 w-[16%] min-w-[70px]">
                                                    <div
                                                        className="flex items-center border border-gray-300 rounded overflow-hidden bg-white h-6 sm:h-7">
                                                        <select
                                                            className="bg-gray-50 text-[8px] sm:text-[9px] p-0.5 border-r border-gray-300 outline-none cursor-pointer font-bold shrink-0"
                                                            value={item.discount_type}
                                                            onChange={(e) => updateItem(index, {discount_type: e.target.value})}
                                                        >
                                                            <option value="fixed">৳</option>
                                                            <option value="percent">%</option>
                                                        </select>
                                                        <input
                                                            type="number"
                                                            className="w-full min-w-0 bg-transparent p-0.5 text-[9px] sm:text-[10px] font-bold text-center text-gray-800 outline-none font-mono"
                                                            placeholder="0"
                                                            value={item.discount_value || ""}
                                                            onChange={(e) => updateItem(index, {discount_value: Number(e.target.value)})}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-1 px-1 text-right w-[11%] min-w-[45px]">
                                                    <span
                                                        className="font-bold font-mono text-blue-700 text-[10px] sm:text-[11px] block">
                                                        ৳{item.total_price.toFixed(0)}
                                                    </span>
                                                    {item.discount_amount > 0 && (
                                                        <span
                                                            className="text-[8px] text-green-600 font-bold block leading-none mt-0.5">
                                                            Saved: ৳{item.discount_amount.toFixed(0)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-1 px-0.5 text-center w-[4%] min-w-[15px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRow(index)}
                                                        className="text-gray-400 hover:text-red-500 font-bold text-sm p-0.5"
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Action buttons */}
                                            {item.product && (
                                                <tr className="bg-gray-50/30 border-b border-gray-100">
                                                    <td colSpan={8} className="px-2 py-1">
                                                        <div className="flex items-center gap-3 text-[9px] flex-wrap">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenEditProduct(item)}
                                                                className="font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200"
                                                            >
                                                                ✏️ Edit Product
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateItem(index, {show_box_calc: !item.show_box_calc})}
                                                                className={`font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                                                                    item.show_box_calc
                                                                        ? "bg-emerald-600 text-white"
                                                                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                                                }`}
                                                            >
                                                                📦 {item.show_box_calc ? "Hide Pack Info" : "Pack Info"}
                                                            </button>

                                                            {item.has_expiry && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateItem(index, {show_expiry_calc: !item.show_expiry_calc})}
                                                                    className={`font-bold flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${
                                                                        item.show_expiry_calc
                                                                            ? "bg-amber-600 text-white"
                                                                            : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                                                                    }`}
                                                                >
                                                                    📅 {item.show_expiry_calc ? "Hide Expiry" : "Expiry Info"}
                                                                </button>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const nextState = !item.show_spec_products;
                                                                    updateItem(index, {show_spec_products: nextState});
                                                                    if (nextState && (!item.spec_products_list || item.spec_products_list.length === 0)) {
                                                                        loadSameSpecificationProducts(index, item.specification);
                                                                    }
                                                                }}
                                                                className={`font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors ml-auto ${
                                                                    item.show_spec_products
                                                                        ? "bg-purple-600 text-white"
                                                                        : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                                                                }`}
                                                            >
                                                                🔬 Same Spec ({item.spec_products_list?.length || 0})
                                                            </button>

                                                            {item.category_name?.toLowerCase().includes("medicine") && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openDosageModal(index)}
                                                                    className={`font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                                                                        item.dosageConfig
                                                                            ? "bg-emerald-600 text-white"
                                                                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                                                    }`}
                                                                >
                                                                    💊 ডোজ চার্ট {item.dosageConfig ? "✓" : ""}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                            {/* Expandable panels */}
                                            {item.product &&
                                                (item.show_box_calc ||
                                                    (item.has_expiry && item.show_expiry_calc) ||
                                                    item.show_spec_products) && (
                                                    <tr className="bg-gray-50/50">
                                                        <td colSpan={8} className="p-2 border-b border-gray-200">
                                                            <div className="space-y-2">
                                                                {/* BOX CALCULATOR (Hybrid: spec read-only + sell input) */}
                                                                {item.show_box_calc && (() => {
                                                                    const isMedicine = item.category_name?.toLowerCase().includes("medicine");
                                                                    const pcsPerBox = computePcsPerBox(item);

                                                                    return (
                                                                        <div
                                                                            className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl space-y-2.5">
                                                                            {/* Header */}
                                                                            <div
                                                                                className="flex items-center justify-between flex-wrap gap-2">
                                                                                <p className="text-[8px] font-black text-blue-800 uppercase tracking-wider">
                                                                                    {isMedicine ? "Medicine Box Calculator" : "Box Calculator"}
                                                                                </p>
                                                                                <span
                                                                                    className="text-[8px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">
                                                                                    Total: <span
                                                                                    className="font-mono text-blue-900">{item.quantity}</span> pcs
                                                                                </span>
                                                                            </div>

                                                                            {/* SECTION 1: PACKAGING SPEC (READ-ONLY) */}
                                                                            <div className="space-y-1">
                                                                                <p className="text-[7px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                                                                    📦 Packaging Spec
                                                                                    <span
                                                                                        className="ml-auto text-[6px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                                                                        🔒 Read-only · from product
                                                                                    </span>
                                                                                </p>
                                                                                <div
                                                                                    className="grid gap-1.5"
                                                                                    style={{gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))"}}
                                                                                >
                                                                                    {/* Box/Carton */}
                                                                                    <div
                                                                                        className="p-1.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                                                                                        <p className="text-[6.5px] font-black text-emerald-600 uppercase tracking-wider leading-none mb-0.5">
                                                                                            Box/Carton
                                                                                        </p>
                                                                                        <p className="text-[11px] font-black font-mono text-emerald-900 leading-tight">
                                                                                            {item.boxes_per_carton ||
                                                                                                <span
                                                                                                    className="text-emerald-300">—</span>}
                                                                                        </p>
                                                                                    </div>

                                                                                    {isMedicine ? (
                                                                                        <>
                                                                                            <div
                                                                                                className="p-1.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                                                                                                <p className="text-[6.5px] font-black text-emerald-600 uppercase tracking-wider leading-none mb-0.5">
                                                                                                    Strips/Box
                                                                                                </p>
                                                                                                <p className="text-[11px] font-black font-mono text-emerald-900 leading-tight">
                                                                                                    {item.strips_per_box ||
                                                                                                        <span
                                                                                                            className="text-emerald-300">—</span>}
                                                                                                </p>
                                                                                            </div>
                                                                                            <div
                                                                                                className="p-1.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                                                                                                <p className="text-[6.5px] font-black text-emerald-600 uppercase tracking-wider leading-none mb-0.5">
                                                                                                    Pcs/Strip
                                                                                                </p>
                                                                                                <p className="text-[11px] font-black font-mono text-emerald-900 leading-tight">
                                                                                                    {item.pcs_per_strip ||
                                                                                                        <span
                                                                                                            className="text-emerald-300">—</span>}
                                                                                                </p>
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <div
                                                                                            className="p-1.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                                                                                            <p className="text-[6.5px] font-black text-emerald-600 uppercase tracking-wider leading-none mb-0.5">
                                                                                                Pcs/Box
                                                                                            </p>
                                                                                            <p className="text-[11px] font-black font-mono text-emerald-900 leading-tight">
                                                                                                {item.pcs_per_box ||
                                                                                                    <span
                                                                                                        className="text-emerald-300">—</span>}
                                                                                            </p>
                                                                                        </div>
                                                                                    )}

                                                                                    <div
                                                                                        className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-300 rounded-lg shadow-sm">
                                                                                        <p className="text-[6.5px] font-black text-emerald-100 uppercase tracking-wider leading-none mb-0.5">
                                                                                            Total Pcs/Box
                                                                                        </p>
                                                                                        <p className="text-[11px] font-black font-mono text-white leading-tight">
                                                                                            {pcsPerBox || <span
                                                                                                className="text-emerald-200">—</span>}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* SECTION 2: SELL CALC (EDITABLE INPUT) */}
                                                                            <div
                                                                                className="space-y-1 pt-2 border-t border-blue-200">
                                                                                <p className="text-[7px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                                                                                    🧮 Sell Calculator
                                                                                    <span
                                                                                        className="ml-auto text-[6px] font-bold text-blue-500 bg-white px-1.5 py-0.5 rounded border border-blue-200">
                                                                                        ✏️ Fill to auto-calc
                                                                                    </span>
                                                                                </p>
                                                                                <div
                                                                                    className="grid gap-1.5"
                                                                                    style={{gridTemplateColumns: "repeat(auto-fit, minmax(75px, 1fr))"}}
                                                                                >
                                                                                    {/* Carton */}
                                                                                    <div className="space-y-0.5">
                                                                                        <label
                                                                                            className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                                            Carton
                                                                                        </label>
                                                                                        <input
                                                                                            type="number"
                                                                                            className="w-full border border-blue-300 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                                            placeholder="0"
                                                                                            value={item.carton_qty || ""}
                                                                                            onFocus={(e) => e.target.select()}
                                                                                            onChange={(e) => handleBoxCalcChange(index, "carton_qty", e.target.value)}
                                                                                        />
                                                                                    </div>

                                                                                    {/* Loose Box */}
                                                                                    <div className="space-y-0.5">
                                                                                        <label
                                                                                            className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                                            Loose Box
                                                                                        </label>
                                                                                        <input
                                                                                            type="number"
                                                                                            className="w-full border border-blue-300 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                                            placeholder="0"
                                                                                            value={item.box_qty || ""}
                                                                                            onFocus={(e) => e.target.select()}
                                                                                            onChange={(e) => handleBoxCalcChange(index, "box_qty", e.target.value)}
                                                                                        />
                                                                                    </div>

                                                                                    {/* Loose Strips (medicine only) */}
                                                                                    {isMedicine && (
                                                                                        <div className="space-y-0.5">
                                                                                            <label
                                                                                                className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                                                Loose Strips
                                                                                            </label>
                                                                                            <input
                                                                                                type="number"
                                                                                                className="w-full border border-blue-300 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                                                placeholder="0"
                                                                                                value={item.loose_strips || ""}
                                                                                                onFocus={(e) => e.target.select()}
                                                                                                onChange={(e) => handleBoxCalcChange(index, "loose_strips", e.target.value)}
                                                                                            />
                                                                                        </div>
                                                                                    )}

                                                                                    {/* Loose Pcs */}
                                                                                    <div className="space-y-0.5">
                                                                                        <label
                                                                                            className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                                            Loose Pcs
                                                                                        </label>
                                                                                        <input
                                                                                            type="number"
                                                                                            className="w-full border border-blue-300 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                                            placeholder="0"
                                                                                            value={item.loose_qty || ""}
                                                                                            onFocus={(e) => e.target.select()}
                                                                                            onChange={(e) => handleBoxCalcChange(index, "loose_qty", e.target.value)}
                                                                                        />
                                                                                    </div>

                                                                                    {/* Price/Box */}
                                                                                    <div className="space-y-0.5">
                                                                                        <label
                                                                                            className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                                            Price/Box
                                                                                        </label>
                                                                                        <input
                                                                                            type="number"
                                                                                            className="w-full border border-blue-300 p-1 rounded bg-white text-[9px] font-mono outline-none focus:border-blue-500"
                                                                                            placeholder="0"
                                                                                            value={item.price_per_box || ""}
                                                                                            onFocus={(e) => e.target.select()}
                                                                                            onChange={(e) => handleBoxCalcChange(index, "price_per_box", e.target.value)}
                                                                                        />
                                                                                    </div>

                                                                                    {/* Total Pcs (auto-calc display) */}
                                                                                    <div className="space-y-0.5">
                                                                                        <label
                                                                                            className="text-[7px] font-extrabold text-blue-700 uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                                                                                            Total Pcs
                                                                                        </label>
                                                                                        <div
                                                                                            className="w-full border border-blue-400 p-1 rounded bg-blue-100 text-[9px] font-black font-mono text-blue-900 text-center">
                                                                                            {item.quantity}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Formula summary */}
                                                                            {(item.carton_qty > 0 || item.box_qty > 0 || item.loose_qty > 0) && (
                                                                                <p className="text-[8px] font-bold text-blue-700 pt-1.5 border-t border-blue-200">
                                                                                    📐{" "}
                                                                                    {item.carton_qty > 0 && (
                                                                                        <>
                                                                                            {item.carton_qty} carton
                                                                                            × {item.boxes_per_carton || 0} box
                                                                                        </>
                                                                                    )}
                                                                                    {item.carton_qty > 0 && item.box_qty > 0 && " + "}
                                                                                    {item.box_qty > 0 && <>{item.box_qty} loose
                                                                                        box</>}
                                                                                    {isMedicine && item.loose_strips > 0 && (
                                                                                        <>
                                                                                            {" + "}
                                                                                            {item.loose_strips} strip
                                                                                        </>
                                                                                    )}
                                                                                    {item.loose_qty > 0 && (
                                                                                        <>
                                                                                            {" + "}
                                                                                            {item.loose_qty} pcs
                                                                                        </>
                                                                                    )}
                                                                                    {" = "}
                                                                                    <span
                                                                                        className="text-blue-900 font-black">
                                                                                        {item.quantity} pcs
                                                                                    </span>
                                                                                    {item.price_per_box > 0 && pcsPerBox > 0 && (
                                                                                        <span
                                                                                            className="ml-2 text-emerald-700">
                                                                                            · Unit ৳{(item.price_per_box / pcsPerBox).toFixed(2)}/pc
                                                                                        </span>
                                                                                    )}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })()}

                                                                {/* READ-ONLY EXPIRY INFO */}
                                                                {item.has_expiry && item.show_expiry_calc && (() => {
                                                                    const remaining = calculateRemainingDays(item.expiry_date);
                                                                    const remainingColor =
                                                                        remaining === null ? "bg-gray-100 border-gray-300 text-gray-500"
                                                                            : remaining < 0 ? "bg-red-100 border-red-400 text-red-700"
                                                                                : remaining <= 30 ? "bg-yellow-100 border-yellow-400 text-yellow-800"
                                                                                    : remaining <= 90 ? "bg-amber-100 border-amber-300 text-amber-800"
                                                                                        : "bg-green-100 border-green-400 text-green-700";
                                                                    const remainingLabel =
                                                                        remaining === null ? "No Data"
                                                                            : remaining < 0 ? `⚠️ Expired ${Math.abs(remaining)}d ago`
                                                                                : remaining === 0 ? "⚠️ Expires Today"
                                                                                    : `${remaining} days left`;

                                                                    return (
                                                                        <div
                                                                            className="p-3 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border border-amber-200 rounded-xl space-y-2.5 shadow-sm">
                                                                            <div
                                                                                className="flex items-center justify-between flex-wrap gap-2">
                                                                                <div
                                                                                    className="flex items-center gap-2">
                                                                                    <CalendarDays size={14}
                                                                                                  className="text-amber-700"/>
                                                                                    <p className="text-[10px] font-black text-amber-900 uppercase tracking-wider">
                                                                                        Expiry Information
                                                                                    </p>
                                                                                </div>
                                                                                <span
                                                                                    className="inline-flex items-center gap-1 text-[8px] font-black text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-300 shadow-sm">
                                                                                    <Info size={9}/>
                                                                                    Read-only · From product batch
                                                                                </span>
                                                                            </div>

                                                                            <div
                                                                                className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                                                <div
                                                                                    className="p-2 bg-white rounded-lg border border-amber-200 shadow-sm">
                                                                                    <p className="text-[7px] font-black text-amber-500 uppercase tracking-wider mb-0.5">
                                                                                        Mfg Date
                                                                                    </p>
                                                                                    <p className="text-[11px] font-black font-mono text-amber-900 leading-tight">
                                                                                        {item.manufacturing_date ||
                                                                                            <span
                                                                                                className="text-gray-300">—</span>}
                                                                                    </p>
                                                                                </div>

                                                                                <div
                                                                                    className="p-2 bg-white rounded-lg border border-amber-300 shadow-sm ring-1 ring-amber-100">
                                                                                    <p className="text-[7px] font-black text-amber-600 uppercase tracking-wider mb-0.5">
                                                                                        Expiry Date
                                                                                    </p>
                                                                                    <p className="text-[11px] font-black font-mono text-amber-900 leading-tight">
                                                                                        {item.expiry_date || <span
                                                                                            className="text-gray-300">—</span>}
                                                                                    </p>
                                                                                </div>

                                                                                <div
                                                                                    className="p-2 bg-white rounded-lg border border-amber-200 shadow-sm">
                                                                                    <p className="text-[7px] font-black text-amber-500 uppercase tracking-wider mb-0.5">
                                                                                        Batch No
                                                                                    </p>
                                                                                    <p className="text-[11px] font-black font-mono text-amber-900 leading-tight truncate">
                                                                                        {item.batch_no || <span
                                                                                            className="text-gray-300">—</span>}
                                                                                    </p>
                                                                                </div>

                                                                                <div
                                                                                    className={`p-2 rounded-lg border-2 shadow-sm ${remainingColor}`}>
                                                                                    <p className="text-[7px] font-black uppercase tracking-wider mb-0.5 opacity-80">
                                                                                        Remaining
                                                                                    </p>
                                                                                    <p className="text-[11px] font-black font-mono leading-tight">
                                                                                        {remainingLabel}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            {item.shelf_life_days > 0 && (
                                                                                <div
                                                                                    className="p-1.5 bg-white/70 border border-amber-200 rounded-md">
                                                                                    <p className="text-[8px] font-bold text-amber-800 flex items-center gap-1.5">
                                                                                        <span
                                                                                            className="font-black text-amber-500">⏱️ Shelf Life:</span>
                                                                                        <span
                                                                                            className="font-mono bg-amber-100 px-1.5 py-0.5 rounded">
                                                                                            {item.shelf_life_days} days
                                                                                        </span>
                                                                                        <span
                                                                                            className="text-amber-400">•</span>
                                                                                        <span
                                                                                            className="text-amber-600">
                                                                                            (~{Math.round(item.shelf_life_days / 30)} months)
                                                                                        </span>
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })()}

                                                                {/* SPEC PANEL */}
                                                                {item.show_spec_products && (
                                                                    <div
                                                                        className="p-2 bg-purple-50 border border-purple-100 rounded-xl space-y-1">
                                                                        <div
                                                                            className="flex justify-between items-center border-b border-purple-200 pb-1 mb-1">
                                                                            <p className="text-[7px] font-black text-purple-800 uppercase tracking-wider">
                                                                                Same Specification Stock
                                                                            </p>
                                                                            <span
                                                                                className="text-[7px] font-mono text-purple-600 italic">
                                                                                Spec: {item.spec_products_list?.[0]?.specification_name || "Loading..."}
                                                                            </span>
                                                                        </div>
                                                                        {item.spec_products_list && item.spec_products_list.length > 0 ? (
                                                                            <div className="overflow-x-auto">
                                                                                <table
                                                                                    className="w-full text-[8px] font-medium text-left text-purple-900">
                                                                                    <thead>
                                                                                    <tr className="border-b border-purple-100 text-[7px] text-purple-700 uppercase font-extrabold">
                                                                                        <th className="pb-0.5">Product</th>
                                                                                        <th className="pb-0.5 text-center">Brand</th>
                                                                                        <th className="pb-0.5 text-right">Sale</th>
                                                                                        <th className="pb-0.5 text-right">Stock</th>
                                                                                        <th className="pb-0.5 text-center">Action</th>
                                                                                    </tr>
                                                                                    </thead>
                                                                                    <tbody
                                                                                        className="divide-y divide-purple-100/50">
                                                                                    {item.spec_products_list.map((p) => (
                                                                                        <tr
                                                                                            key={p.id}
                                                                                            className={`hover:bg-purple-100/40 ${p.id === item.product ? "bg-purple-100/70 font-bold" : ""}`}
                                                                                        >
                                                                                            <td className="py-1 pr-1 truncate"
                                                                                                title={p.name}>
                                                                                                {p.name}{" "}
                                                                                                {p.id === item.product && (
                                                                                                    <span
                                                                                                        className="text-[6px] bg-purple-600 text-white px-1 rounded ml-1">
                                                                                                        Selected
                                                                                                    </span>
                                                                                                )}
                                                                                            </td>
                                                                                            <td className="py-1 text-center text-gray-600">
                                                                                                {p.brand_name || "N/A"}
                                                                                            </td>
                                                                                            <td className="py-1 text-right font-mono text-gray-700">
                                                                                                ৳{Number(p.selling_price || p.sale_price || 0).toFixed(2)}
                                                                                            </td>
                                                                                            <td
                                                                                                className={`py-1 text-right font-mono font-bold ${
                                                                                                    p.stock <= 0 ? "text-red-600" : "text-green-700"
                                                                                                }`}
                                                                                            >
                                                                                                {p.stock} {p.unit_name || "Pcs"}
                                                                                            </td>
                                                                                            <td className="py-1 text-center">
                                                                                                {p.id !== item.product && Number(p.stock) > 0 && (
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onClick={() =>
                                                                                                            updateItem(index, {
                                                                                                                product: p.id,
                                                                                                                product_name: p.name,
                                                                                                                unit_price: Number(p.selling_price || p.sale_price || 0),
                                                                                                                stock: p.stock,
                                                                                                                specification: p.specification || p.specification_id || null,
                                                                                                                category_name: p.category_name || "",
                                                                                                                show_spec_products: false,
                                                                                                            })
                                                                                                        }
                                                                                                        className="text-[7px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded hover:bg-purple-700 transition-colors"
                                                                                                    >
                                                                                                        Switch
                                                                                                    </button>
                                                                                                )}
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
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Footer */}
                            <div
                                className="flex justify-between items-center text-[10px] text-gray-500 font-bold border-t border-gray-200 pt-1 shrink-0">
                                <div className="flex gap-2 items-center">
                                    <label className="text-[8px] font-black uppercase text-green-700 tracking-wider">
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
                                            onChange={(e) => setGlobalDiscountValue(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <span>
                                    Items Subtotal: <span
                                    className="font-mono text-gray-800 font-black">৳{subtotal.toFixed(0)}</span>
                                </span>

                                {globalDiscountAmount > 0 && (
                                    <span className="text-green-600">
                                        Discount: <span
                                        className="font-mono font-black">- ৳{globalDiscountAmount.toFixed(0)}</span>
                                    </span>
                                )}

                                <div className="text-gray-900 font-black text-xs">
                                    Net Payable: <span
                                    className="font-mono text-blue-700 text-sm">৳{netTotal.toFixed(0)}</span>
                                </div>
                            </div>

                            {/* Action buttons */}
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
                                            setCustomerSelectKey((k) => k + 1);
                                        }
                                    }}
                                    className="py-1 px-2 border border-gray-400 rounded-lg text-gray-500 hover:bg-gray-100 font-bold text-[9px] uppercase tracking-wider transition-all text-center"
                                >
                                    Clear
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!customer) return alert("Please select a customer");
                                        const validItems = items.filter((i) => i.product);
                                        if (validItems.length === 0) return alert("Please add products");
                                        setIsPaymentModalOpen(true);
                                        setIsCartOpen(false);
                                    }}
                                    className="flex-1 py-1 font-black rounded-lg text-[10px] uppercase tracking-wider text-white shadow-lg bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 transition-all active:scale-98 text-center"
                                >
                                    Make Payment
                                </button>

                                <div className="relative inline-block text-left">
                                    <button
                                        type="button"
                                        onClick={() => setIsActionsDropdownOpen((prev) => !prev)}
                                        className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-black rounded-lg text-[9px] uppercase tracking-wider text-white shadow-md transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                                    >
                                        <span>⚡ Quick Actions</span>
                                        <ChevronRight
                                            size={10}
                                            className={`transform transition-transform ${isActionsDropdownOpen ? "-rotate-90" : "rotate-90"}`}
                                        />
                                    </button>

                                    {isActionsDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40"
                                                 onClick={() => setIsActionsDropdownOpen(false)}/>
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
                                                        handleHoldSale();
                                                    }}
                                                    disabled={holdQuotationLoading}
                                                    className="w-full text-left px-3 py-2 text-[10px] font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition-colors border-b border-gray-50"
                                                >
                                                    <PauseCircle size={14} className="text-amber-500 shrink-0"/>
                                                    <div>
                                                        <span className="block font-black">Hold Current Cart</span>
                                                        <span className="text-[8px] text-gray-400 font-medium">
                                                            Pause & save sale
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
                                                        <span className="block font-black">Create Sale Quotation</span>
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
                    </div>
                </form>
            </div>

            {/* ═══════════ MODALS ═══════════ */}

            {/* Payment Modal */}
            <BaseModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                title="POS Payment Processing"
                size="2xl"
                variant="clean"
                showFooter={false}
                icon={<Coins className="text-blue-600"/>}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:max-h-[75vh] overflow-hidden text-gray-800">
                    <div
                        className="lg:col-span-5 flex flex-col lg:h-full lg:overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 pr-0 lg:pr-4">
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 mb-3 shrink-0">
                            <span className="text-[9px] font-black uppercase text-blue-900 block mb-0.5">
                                Selected Client
                            </span>
                            <div className="font-extrabold text-sm text-gray-800">{customer?.label}</div>
                            {isWalkInActive ? (
                                <span
                                    className="inline-block mt-1 text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded font-black uppercase">
                                    🚶 Walk-In Client
                                </span>
                            ) : (
                                <div className="mt-1 flex justify-between text-[10px] text-gray-500 font-bold">
                                    <span>CRM Balance:</span>
                                    <span className="text-red-600 font-black">৳{previousDue.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2 shrink-0">
                            Cart Items Overview
                        </h4>
                        <div
                            className="flex-1 overflow-y-auto border border-gray-200 rounded-xl bg-gray-50 mb-3 scrollbar-thin">
                            <table className="w-full text-left border-collapse text-[10px]">
                                <thead>
                                <tr className="border-b border-gray-200 text-gray-400 uppercase font-bold bg-gray-100/90 sticky top-0">
                                    <th className="py-2 px-2">Item</th>
                                    <th className="py-2 px-2 text-right">Price</th>
                                    <th className="py-2 px-2 text-center">Qty</th>
                                    <th className="py-2 px-2 text-right">Total</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                {items.filter((i) => i.product).map((item, idx) => (
                                    <tr key={item.seq || idx} className="hover:bg-gray-50/50">
                                        <td className="py-2 px-2 font-medium">
                                            <div className="font-bold text-gray-800 line-clamp-1">
                                                {item.product_name}
                                            </div>
                                            {item.unique_serial && (
                                                <span
                                                    className="text-[8px] font-mono text-gray-400 bg-gray-100 px-1 py-0.5 rounded">
                                                    SN: {item.unique_serial}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 px-2 text-right font-mono text-gray-600">
                                            ৳{item.unit_price}
                                        </td>
                                        <td className="py-2 px-2 text-center font-bold text-gray-700">
                                            {item.quantity}
                                        </td>
                                        <td className="py-2 px-2 text-right font-mono font-bold text-blue-700">
                                            ৳{item.total_price.toFixed(0)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-900 text-white p-3.5 rounded-xl space-y-2 shrink-0">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Subtotal</span>
                                <span className="font-mono">৳{subtotal.toFixed(2)}</span>
                            </div>
                            {globalDiscountAmount > 0 && (
                                <div className="flex justify-between text-xs text-green-400">
                                    <span>Discount</span>
                                    <span className="font-mono">- ৳{globalDiscountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                                <span className="text-xs font-black uppercase text-gray-400">Net Payable</span>
                                <span className="font-mono font-black text-xl text-emerald-400">
                                    ৳{netTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        className="lg:col-span-7 flex flex-col max-h-[75vh] overflow-y-auto pr-1 space-y-4 scrollbar-thin">
                        {isDueBlockActive && (
                            <div
                                className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex items-start gap-2 shrink-0">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5"/>
                                <div className="text-[10px] font-bold leading-tight">
                                    Walk-in Client: Full payment is required. Current due: ৳{currentInvoiceDue}
                                </div>
                            </div>
                        )}

                        <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-3">
                            <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider">
                                Payment Channels
                            </label>
                            <div className="grid grid-cols-3 gap-2.5">
                                <div>
                                    <label className="text-[9px] font-black uppercase text-gray-400">Cash (৳)</label>
                                    <input
                                        type="number"
                                        className="w-full border-2 border-gray-300 p-2 rounded-lg font-black text-sm bg-white focus:border-blue-600 outline-none font-mono mt-1"
                                        value={paidCash || ""}
                                        onChange={(e) => setPaidCash(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase text-gray-400">Mobile (৳)</label>
                                    <input
                                        type="number"
                                        className="w-full border-2 border-gray-300 p-2 rounded-lg font-black text-sm bg-white focus:border-blue-600 outline-none font-mono mt-1"
                                        value={paidMobile || ""}
                                        onChange={(e) => setPaidMobile(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase text-gray-400">Bank (৳)</label>
                                    <input
                                        type="number"
                                        className="w-full border-2 border-gray-300 p-2 rounded-lg font-black text-sm bg-white focus:border-blue-600 outline-none font-mono mt-1"
                                        value={paidBank || ""}
                                        onChange={(e) => setPaidBank(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {paidMobile > 0 && (
                                <div
                                    className="grid grid-cols-2 gap-2.5 p-2.5 bg-orange-50/50 rounded-xl border border-orange-200">
                                    <div>
                                        <label
                                            className="text-[9px] uppercase font-black text-orange-700">Operator</label>
                                        <select
                                            className="w-full border p-1.5 rounded-lg bg-white text-xs outline-none font-bold mt-1"
                                            value={mobileOperator}
                                            onChange={(e) => setMobileOperator(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="bkash">bKash</option>
                                            <option value="nagad">Nagad</option>
                                            <option value="rocket">Rocket</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[9px] uppercase font-black text-orange-700">Trx
                                            ID</label>
                                        <input
                                            className="w-full border p-1.5 rounded-lg bg-white text-xs font-mono outline-none mt-1"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {paidBank > 0 && (
                                <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-200">
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
                                    Invoice Note <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <textarea
                                    rows={2}
                                    className="w-full border-2 border-amber-200 p-2 rounded-xl text-xs bg-white outline-none focus:border-amber-500 transition-colors resize-none"
                                    placeholder="Add a note for this sale..."
                                    value={saleNote}
                                    onChange={(e) => setSaleNote(e.target.value)}
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
                                <div className="grid grid-cols-3 gap-2">
                                    <label
                                        className="flex items-center justify-center gap-1 px-2 py-2 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">
                                        <span className="text-[10px] font-black uppercase text-blue-700">
                                            📁 Gallery
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => setPaymentProof(e.target.files[0])}
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setIsProofCameraOpen(true)}
                                        className="flex items-center justify-center gap-1 px-2 py-2 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
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
                                        className="flex items-center justify-center gap-1 px-2 py-2 bg-purple-50 border-2 border-dashed border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
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

                        {/* Cash Calculator */}
                        <div
                            className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-xl space-y-3 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Banknote size={15} className="text-emerald-600"/>
                                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
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
                                    <label className="text-[9px] font-black uppercase text-emerald-700 block mb-1">
                                        Customer Given (৳)
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
                                    <label className="text-[9px] font-black uppercase text-rose-700 block mb-1">
                                        Return Change (৳)
                                    </label>
                                    <div
                                        className={`w-full border-2 rounded-lg p-2 font-black text-sm font-mono text-center flex items-center justify-center h-[34px] ${
                                            givenCash > netTotal
                                                ? "bg-rose-100 border-rose-400 text-rose-700"
                                                : givenCash > 0
                                                    ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                                                    : "bg-gray-100 border-gray-300 text-gray-400"
                                        }`}
                                    >
                                        ৳{Math.max(0, givenCash - netTotal).toFixed(0)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-emerald-200/50 items-center">
                                {quickCashList && quickCashList.map((qc) => (
                                    <button
                                        key={qc.id}
                                        type="button"
                                        onClick={() => setGivenCash((prev) => Number(prev) + Number(qc.amount))}
                                        className="flex items-center gap-1 px-2 py-1 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all active:scale-95 shadow-sm group"
                                    >
                                        <span
                                            className="text-[10px] font-black text-gray-700 group-hover:text-white font-mono">
                                            {Number(qc.amount) >= 1000
                                                ? `${(Number(qc.amount) / 1000).toFixed(Number(qc.amount) % 1000 === 0 ? 0 : 1)}K`
                                                : Number(qc.amount).toFixed(0)}
                                        </span>
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setIsAddQuickCashOpen(true)}
                                    className="flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-dashed border-emerald-300 rounded-lg transition-all active:scale-95 text-emerald-700 hover:border-emerald-600 font-bold text-[9px] shadow-sm group"
                                >
                                    <Coins size={10} className="text-emerald-600 group-hover:text-white"/>
                                    <span>Add Shortcuts</span>
                                </button>
                            </div>
                        </div>

                        {/* Summary + Actions */}
                        <div className="bg-gray-100 p-3.5 rounded-xl space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-[10px]">
                                <div
                                    className="p-2 bg-white border border-gray-200 rounded-lg flex flex-col justify-center min-w-0">
                                    <p className="text-gray-500 font-bold uppercase mb-0.5 truncate">Amount Received</p>
                                    <p className="text-xs font-black font-mono text-blue-600">৳{totalPaid.toFixed(2)}</p>
                                </div>
                                <div
                                    className="p-2 bg-white border border-gray-200 rounded-lg flex flex-col justify-center min-w-0">
                                    <p className="text-gray-500 font-bold uppercase mb-0.5 truncate">Invoice Due</p>
                                    <p className={`text-xs font-black font-mono ${isWalkInActive ? "text-amber-500" : "text-red-500"}`}>
                                        ৳{currentInvoiceDue.toFixed(2)}
                                    </p>
                                </div>
                                <div
                                    className="p-2 bg-blue-50 border border-blue-200 rounded-lg flex flex-col justify-center min-w-0">
                                    <p className="text-blue-600 font-bold uppercase mb-0.5 truncate">CRM Balance</p>
                                    <p className="text-xs font-black text-blue-700 font-mono">
                                        {isWalkInActive ? "৳0.00 (Walk-In)" : `৳${totalCustomerDue.toFixed(2)}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-black text-xs uppercase tracking-wider transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSubmit()}
                                    disabled={loading || isDueBlockActive}
                                    className={`flex-1 py-2.5 font-black rounded-xl text-xs uppercase tracking-widest text-white shadow-md transition-all active:scale-98 ${
                                        isDueBlockActive
                                            ? "bg-gray-400 cursor-not-allowed shadow-none"
                                            : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/10"
                                    }`}
                                >
                                    {loading ? "Processing..." : "✓ Confirm Sale"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseModal>

            {/* Success Modal */}
            {successData && (
                <SuccessModal
                    isOpen={showSuccess}
                    onClose={() => {
                        setShowSuccess(false);
                        setSuccessData(null);
                    }}
                    title="Sale Recorded Successfully"
                    subtitle={successData ? `Invoice #${successData.invoice_no} Generated` : ""}
                    details={
                        successData
                            ? [
                                {
                                    label: "Net Payable",
                                    value: `৳${parseFloat(successData.net_total || 0).toLocaleString()}`
                                },
                                {
                                    label: "Total Received",
                                    value: `৳${parseFloat(successData.paid_amount || 0).toLocaleString()}`
                                },
                                {
                                    label: "Invoice Due",
                                    value: `৳${parseFloat(successData.due_amount || 0).toLocaleString()}`
                                },
                                {
                                    label: "Customer Total Due",
                                    value: `৳${parseFloat(successData.customer_due_amount || successData.due_amount || 0).toLocaleString()}`
                                },
                            ]
                            : []
                    }
                    onPrint={successData ? () => handlePrint(successData) : null}
                    printText="Print Slip"
                >
                    {successData?.items && (
                        <div className="space-y-3">
                            {successData.items
                                .filter((it) => it.dosage_config)
                                .map((item, idx) => {
                                    let cfg = item.dosage_config;
                                    if (typeof cfg === "string") {
                                        try {
                                            cfg = JSON.parse(cfg);
                                        } catch {
                                            return null;
                                        }
                                    }
                                    if (!cfg?.slots?.length) return null;

                                    const medName = item.product_name || `ঔষধ ${idx + 1}`;
                                    return (
                                        <div
                                            key={idx}
                                            className="bg-white border border-emerald-100 rounded-2xl p-3 flex flex-col items-center"
                                        >
                                            <div
                                                className="text-[11px] font-black text-gray-800 uppercase tracking-wider mb-2">
                                                💊 {medName}
                                            </div>
                                            <MedicineDosageChart
                                                config={{...cfg, medicineName: medName}}
                                                size="lg"
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </SuccessModal>
            )}

            {/* View Customer */}
            <BaseModal
                isOpen={isViewCustomerOpen}
                onClose={() => setIsViewCustomerOpen(false)}
                title="Customer Details"
                size="md"
                variant="clean"
                showFooter={false}
                isLoading={loadingDetails}
                icon={<Eye className="text-blue-600"/>}
            >
                {customerDetails ? (
                    <div className="space-y-6 text-gray-800">
                        <div className="flex flex-col items-center py-2">
                            <div
                                className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg bg-gray-100 flex items-center justify-center">
                                {customerDetails.image ? (
                                    <img
                                        src={customerDetails.image}
                                        className="w-full h-full object-cover"
                                        alt={customerDetails.name}
                                    />
                                ) : (
                                    <span className="text-gray-300 text-3xl font-black">
                                        {customerDetails.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <h3 className="mt-3 text-lg font-black text-gray-800">{customerDetails.name}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Customer Profile
                            </p>
                        </div>

                        <div className="grid gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-0.5">
                                        Phone Number
                                    </label>
                                    <span className="font-bold text-gray-800 text-sm font-mono">
                                        {customerDetails.phone}
                                    </span>
                                </div>
                                <div>
                                    <label
                                        className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-0.5">
                                        Email Address
                                    </label>
                                    <span className="font-bold text-gray-800 text-sm font-mono break-all">
                                        {customerDetails.email || "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/60">
                                <div>
                                    <label
                                        className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-0.5">
                                        Billing Address
                                    </label>
                                    <span className="font-bold text-gray-800 text-xs block leading-relaxed">
                                        {customerDetails.address || "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <label
                                        className="text-[9px] font-black text-red-500 uppercase tracking-wider block mb-0.5">
                                        Current Balance / Due
                                    </label>
                                    <span className="font-black text-red-600 text-base font-mono">
                                        ৳{Number(customerDetails.due_amount || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsViewCustomerOpen(false)}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-xs"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                        <p className="text-xs font-bold uppercase tracking-wider">
                            Loading Customer Details...
                        </p>
                    </div>
                )}
            </BaseModal>

            {/* Add Quick Cash */}
            <BaseModal
                isOpen={isAddQuickCashOpen}
                onClose={() => {
                    setIsAddQuickCashOpen(false);
                    setQuickCashAmount("");
                    setQuickCashName("");
                }}
                title="Add Quick Cash Shortcut"
                size="sm"
                variant="clean"
                showFooter={true}
                isLoading={quickCashLoading}
                onSubmit={handleAddQuickCash}
                submitText="Save Shortcut"
                submitColor="bg-emerald-600 hover:bg-emerald-700 text-white"
                icon={<Coins className="text-emerald-600"/>}
            >
                <div className="space-y-4">
                    <div
                        className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-[10px] text-emerald-700 font-medium">
                        💡 Quick Cash shortcuts appear as buttons in the Payment section.
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1">
                            Amount (৳) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            className="w-full border-2 border-gray-200 p-2 rounded-xl text-sm font-black font-mono outline-none focus:border-emerald-500 transition-colors"
                            placeholder="e.g. 500"
                            value={quickCashAmount}
                            onChange={(e) => setQuickCashAmount(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1">
                            Display Name <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border-2 border-gray-200 p-2 rounded-xl text-xs outline-none focus:border-emerald-500 transition-colors"
                            placeholder="e.g. 500 Taka Note"
                            value={quickCashName}
                            onChange={(e) => setQuickCashName(e.target.value)}
                        />
                    </div>
                </div>
            </BaseModal>

            {/* Hold & Quotation Modals */}
            <HoldListModal
                isOpen={isHoldModalOpen}
                onClose={() => setIsHoldModalOpen(false)}
                transactionType="sale"
                onRestoreHold={handleRestoreHoldOrQuotation}
            />

            <CreateQuotationModal
                isOpen={isCreateQuotationOpen}
                onClose={() => setIsCreateQuotationOpen(false)}
                transactionType="sale"
                onSave={handleSaveQuotation}
                isLoading={holdQuotationLoading}
            />

            <QuotationListModal
                isOpen={isQuotationModalOpen}
                onClose={() => setIsQuotationModalOpen(false)}
                transactionType="sale"
                onRestoreQuotation={handleRestoreHoldOrQuotation}
            />

            {/* Barcode Scanner */}
            <BarcodeScannerModal
                isOpen={isBarcodeCameraOpen}
                onClose={() => setIsBarcodeCameraOpen(false)}
                onScan={async (code) => {
                    await processBarcodeCode(code);
                }}
            />

            {/* Remote Mobile Pairing */}
            <RemoteScannerPairingModal
                isOpen={isRemotePairingOpen}
                onClose={() => setIsRemotePairingOpen(false)}
                enabledModes={["barcode", "payment_proof"]}
                onScan={async (payload) => {
                    const {purpose, kind, code, image} = payload;

                    if (purpose === "barcode" && kind === "barcode") {
                        await processBarcodeCode(code);
                        return;
                    }

                    if (purpose === "payment_proof" && kind === "image") {
                        const file = dataUrlToFile(image, `payment-proof-${Date.now()}.jpg`);
                        setPaymentProof(file);
                        if (!isPaymentModalOpen && customer) setIsPaymentModalOpen(true);
                        return;
                    }
                }}
            />

            {/* Payment Proof Camera */}
            {isProofCameraOpen && (
                <CameraCapture
                    onClose={() => setIsProofCameraOpen(false)}
                    onCapture={(file) => {
                        setPaymentProof(file);
                        setIsProofCameraOpen(false);
                    }}
                />
            )}

            {/* Medicine Dosage Config Modal */}
            <MedicineDosageConfigModal
                isOpen={isDosageModalOpen}
                onClose={() => {
                    setIsDosageModalOpen(false);
                    setDosageTargetIndex(null);
                }}
                onSave={handleDosageSave}
                medicineName={
                    dosageTargetIndex !== null
                        ? items[dosageTargetIndex]?.product_name
                        : ""
                }
                initialConfig={
                    dosageTargetIndex !== null
                        ? items[dosageTargetIndex]?.dosageConfig
                        : null
                }
            />

            {/* Edit Product */}
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

            {/* Add Customer */}
            <AddCustomerModal
                isOpen={isAddCustomerOpen}
                onClose={() => setIsAddCustomerOpen(false)}
                onSuccess={handleCustomerAdded}
            />

        </div>
    );
};

export default PosSalePage;