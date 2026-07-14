import { useState, useRef, useEffect } from 'react';
import { getPOSReceiptHTML } from './posReceiptTemplate';
import { getSalePrintLayout } from '../Sales/SaleProduct/SalePrintLayout';
import { getBrandedVoucher } from './printTemplates';

// localStorage থেকে সরাসরি initial state নেওয়া হচ্ছে
// যাতে প্রথম render এও সঠিক format দেখায়
const getInitialFormat = () => localStorage.getItem('pos_print_format') || 'a4';

export const usePrintManager = () => {
    const [printFormat, setPrintFormatState] = useState(getInitialFormat);

    // stale closure এড়াতে ref ব্যবহার
    const printFormatRef = useRef(printFormat);
    useEffect(() => {
        printFormatRef.current = printFormat;
    }, [printFormat]);

    const setPrintFormat = (format) => {
        localStorage.setItem('pos_print_format', format);
        setPrintFormatState(format);
        printFormatRef.current = format;
    };

    const handlePrintInvoice = (invoice, specificFormat = null) => {
        if (!invoice) return;

        // ref থেকে সবসময় latest value নেওয়া হচ্ছে
        const formatToUse = specificFormat || printFormatRef.current;

        if (formatToUse === 'pos') {
            const fullHTML = getPOSReceiptHTML(invoice);
            // 80mm ≈ 302px, height auto — thermal printer এর মতো সরু window
            const printWindow = window.open("", "_blank", "width=340,height=600,left=100,top=50");
            if (printWindow) {
                printWindow.document.write(fullHTML);
                printWindow.document.close();
            }
        } else {
            // Default A4 layout
            const tableContent = getSalePrintLayout(invoice);
            const fullHTML = getBrandedVoucher("Sale Invoice", tableContent, invoice.invoice_no, "#1d4ed8");
            const printWindow = window.open("", "_blank", "width=850,height=900");
            if (printWindow) {
                printWindow.document.write(fullHTML);
                printWindow.document.close();
            }
        }
    };

    return {
        printFormat,
        setPrintFormat,
        handlePrintInvoice
    };
};
