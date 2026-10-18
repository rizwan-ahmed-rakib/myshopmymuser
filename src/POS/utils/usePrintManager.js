//
//
//
// import {useState, useRef, useEffect} from 'react';
// import {renderToStaticMarkup} from 'react-dom/server';
// import {getPOSReceiptHTML} from './posReceiptTemplate';
// import {getSalePrintLayout} from '../Sales/SaleProduct/SalePrintLayout';
// import {getBrandedVoucher} from './printTemplates';
// import MedicineDosageChart from '../components/medicine/MedicineDosageChart';
//
// const getInitialFormat = () => localStorage.getItem('pos_print_format') || 'a4';
//
// /* ─────────────────────────────────────────────
//    1. Build dosage SVG map keyed by item index
//    ───────────────────────────────────────────── */
// const buildDosageSVGMap = (invoice, size = "lg") => {
//     const map = {};
//     (invoice?.items || []).forEach((item, idx) => {
//         let cfg = item.dosage_config || item.dosageConfig;
//         if (!cfg) return;
//         if (typeof cfg === "string") {
//             try {
//                 cfg = JSON.parse(cfg);
//             } catch {
//                 return;
//             }
//         }
//         if (!cfg?.slots?.length) return;
//
//         const medicineName =
//             cfg.medicineName ||
//             item.product_name ||
//             item.name ||
//             `ঔষধ ${idx + 1}`;
//
//         try {
//             map[idx] = renderToStaticMarkup(
//                 <MedicineDosageChart
//                     config={{...cfg, medicineName}}
//                     size={size}
//                 />
//             );
//         } catch (e) {
//             console.error("Dosage chart render error:", e);
//         }
//     });
//     return map;
// };
//
//
//
// /* ─────────────────────────────────────────────
//    Inject chart row after each medicine row (DOM)
//    ───────────────────────────────────────────── */
// const injectDosageChartsIntoDOM = (doc, invoice, dosageMap, isThermal = false) => {
//     if (!doc || !invoice?.items?.length) return 0;
//     let count = 0;
//
//     const allRows = Array.from(doc.querySelectorAll("tr"));
//
//     invoice.items.forEach((item, idx) => {
//         const svg = dosageMap[idx];
//         if (!svg) return;
//
//         const productName = (item.product_name || "").trim();
//         if (!productName) return;
//
//         const targetRow = allRows.find((tr) => {
//             if (tr.getAttribute("data-dosage-parent") === "1") return false;
//             const txt = (tr.textContent || "").trim();
//             return txt.includes(productName);
//         });
//
//         if (!targetRow) return;
//         targetRow.setAttribute("data-dosage-parent", "1");
//
//         const colCount = Math.max(targetRow.children.length || 0, 5);
//
//         // New full-width <tr>
//         const newRow = doc.createElement("tr");
//         newRow.setAttribute(
//             "style",
//             "page-break-inside:avoid;break-inside:avoid;page-break-before:avoid;"
//         );
//
//         const cell = doc.createElement("td");
//         cell.setAttribute("colspan", String(colCount));
//
//
//
//         cell.setAttribute(
//             "style",
//             `padding:${isThermal ? "4px 2px" : "6px 8px"};` +     // 14px → 6px
//             "text-align:center;" +
//             "vertical-align:middle;" +
//             "background:#F0FDF4;" +
//             "border-bottom:2px solid #10b981;" +
//             "border-top:1px dashed #10b981;"
//         );
//
//         // 🆕 Full-width wrapper
//         const wrapper = doc.createElement("div");
//
//
//         wrapper.setAttribute(
//             "style",
//             "width:100%;" +
//             "max-width:100%;" +
//             "display:block;" +
//             "box-sizing:border-box;" +
//             `padding:${isThermal ? "4px" : "6px 10px"};` +    // 12px 16px → 6px 10px
//             "background:#ffffff;" +
//             "border:1px dashed #10b981;" +
//             "border-radius:6px;"
//         );
//
//         // Title
//         const title = doc.createElement("div");
//
//
//         title.setAttribute(
//             "style",
//             `font-size:${isThermal ? "9px" : "10px"};` +         // 13px → 10px
//             "font-weight:900;" +
//             "text-transform:uppercase;" +
//             "letter-spacing:0.5px;" +
//             "color:#065f46;" +
//             "margin-bottom:3px;" +                            // 6px → 3px
//             "text-align:center;"
//         );
//         title.textContent = "💊 ঔষধ সেবনের নিয়ম / Medicine Schedule";
//
//         // Chart container — force full width
//         const chartDiv = doc.createElement("div");
//         chartDiv.setAttribute(
//             "style",
//             "width:100%;" +
//             "display:flex;" +
//             "justify-content:center;" +
//             "align-items:center;"
//         );
//         chartDiv.innerHTML = svg;
//
//         // 🆕 Make inner SVG stretch to full width
//         const innerSvg = chartDiv.querySelector("svg");
//         if (innerSvg) {
//             innerSvg.setAttribute("width", "100%");
//             innerSvg.setAttribute("height", "auto");
//
//
//             innerSvg.setAttribute(
//                 "style",
//                 `width:100%;height:auto;max-width:${isThermal ? "260px" : "420px"};`   // 560 → 420
//             );
//         }
//
//         // 🆕 Also handle nested wrapper div
//         const innerWrapper = chartDiv.querySelector("div");
//         if (innerWrapper) {
//             innerWrapper.setAttribute("style", "width:100%;display:block;");
//         }
//
//         wrapper.appendChild(title);
//         wrapper.appendChild(chartDiv);
//         cell.appendChild(wrapper);
//         newRow.appendChild(cell);
//
//         targetRow.parentNode.insertBefore(newRow, targetRow.nextSibling);
//         count++;
//     });
//
//     return count;
// };
//
// /* ─────────────────────────────────────────────
//    3. Inject into HTML string (parse → modify → serialize)
//    ───────────────────────────────────────────── */
// const injectDosageIntoHTML = (html, invoice, dosageMap, isThermal = false) => {
//     if (!Object.keys(dosageMap).length) return html;
//
//     try {
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(html, "text/html");
//         const count = injectDosageChartsIntoDOM(doc, invoice, dosageMap, isThermal);
//
//         if (count === 0) {
//             console.warn("[Dosage] No product rows matched — chart not injected");
//             return html;
//         }
//
//         console.log(`[Dosage] Injected ${count} chart(s) inline`);
//         return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
//     } catch (e) {
//         console.error("[Dosage] HTML parse/inject error:", e);
//         return html;
//     }
// };
//
// /* ─────────────────────────────────────────────
//    Hook
//    ───────────────────────────────────────────── */
// export const usePrintManager = () => {
//     const [printFormat, setPrintFormatState] = useState(getInitialFormat);
//
//     const printFormatRef = useRef(printFormat);
//     useEffect(() => {
//         printFormatRef.current = printFormat;
//     }, [printFormat]);
//
//     const setPrintFormat = (format) => {
//         localStorage.setItem('pos_print_format', format);
//         setPrintFormatState(format);
//         printFormatRef.current = format;
//     };
//
//     const handlePrintInvoice = (invoice, specificFormat = null) => {
//         if (!invoice) return;
//
//         const formatToUse = specificFormat || printFormatRef.current;
//
//         if (formatToUse === 'pos') {
//             // ── Thermal 80mm ──
//             const dosageMap = buildDosageSVGMap(invoice, "sm");
//             let fullHTML = getPOSReceiptHTML(invoice);
//             fullHTML = injectDosageIntoHTML(fullHTML, invoice, dosageMap, true);
//
//             const printWindow = window.open(
//                 "",
//                 "_blank",
//                 "width=340,height=600,left=100,top=50"
//             );
//             if (printWindow) {
//                 printWindow.document.write(fullHTML);
//                 printWindow.document.close();
//             }
//         } else {
//             // ── A4 ──
//             const dosageMap = buildDosageSVGMap(invoice, "lg");
//             const tableContent = getSalePrintLayout(invoice);
//             const baseHTML = getBrandedVoucher(
//                 "Sale Invoice",
//                 tableContent,
//                 invoice.invoice_no,
//                 "#1d4ed8"
//             );
//             const finalHTML = injectDosageIntoHTML(
//                 baseHTML,
//                 invoice,
//                 dosageMap,
//                 false
//             );
//
//             const printWindow = window.open("", "_blank", "width=850,height=900");
//             if (printWindow) {
//                 printWindow.document.write(finalHTML);
//                 printWindow.document.close();
//             }
//         }
//     };
//
//     return {
//         printFormat,
//         setPrintFormat,
//         handlePrintInvoice,
//     };
// };





// utils/usePrintManager.js
import { useState, useRef, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getPOSReceiptHTML } from './posReceiptTemplate';
import { getSalePrintLayout } from '../Sales/SaleProduct/SalePrintLayout';
import { getBrandedVoucher } from './printTemplates';
import MedicineDosageChart from '../components/medicine/MedicineDosageChart';

const getInitialFormat = () => localStorage.getItem('pos_print_format') || 'a4';

/* ─────────────────────────────────────────────
   Render single dosage chart as SVG string
   ───────────────────────────────────────────── */
const renderChartSVG = (config) => {
    try {
        return renderToStaticMarkup(
            <MedicineDosageChart config={config} size="lg" />
        );
    } catch (e) {
        console.error("Chart render error:", e);
        return "";
    }
};

/* ─────────────────────────────────────────────
   Build DOSAGE CHART SECTION (dedicated, grid layout)
   ───────────────────────────────────────────── */
const buildDosageSectionHTML = (invoice) => {
    if (!invoice?.items?.length) return "";

    // Collect all medicine items with valid configs
    const charts = [];
    invoice.items.forEach((item, idx) => {
        let cfg = item.dosage_config || item.dosageConfig;
        if (!cfg) return;
        if (typeof cfg === "string") {
            try { cfg = JSON.parse(cfg); } catch { return; }
        }
        if (!cfg?.slots?.length) return;

        const medicineName =
            cfg.medicineName || item.product_name || item.name || `ঔষধ ${idx + 1}`;
        const slotCount = cfg.slots.length;
        // 4 or 6 slots → wide (full row), 1-3 slots → half width
        const isWide = slotCount >= 4;

        const svg = renderChartSVG({ ...cfg, medicineName });
        if (!svg) return;

        charts.push({
            svg,
            medicineName,
            note: cfg.note || "",
            isWide,
            slotCount,
        });
    });

    if (!charts.length) return "";

    const cardsHtml = charts
        .map(
            (c) => `
        <div class="dosage-card ${c.isWide ? "dosage-card-wide" : ""}">
            <div class="dosage-card-header">
                <span class="dosage-card-title">💊 ঔষধ সেবনের নিয়ম</span>
                <span class="dosage-card-med">${c.medicineName}</span>
            </div>
            <div class="dosage-card-body">${c.svg}</div>
            ${
                c.note
                    ? `<div class="dosage-card-note">📝 ${c.note}</div>`
                    : ""
            }
        </div>
    `
        )
        .join("");

    return `
    <div class="dosage-section">
        <div class="dosage-section-title">
            💊 ঔষধ সেবনের নিয়ম / MEDICINE SCHEDULE
        </div>
        <div class="dosage-grid">
            ${cardsHtml}
        </div>
    </div>
    <style>
        /* ───── DOSAGE SECTION ───── */
        .dosage-section {
            margin-top: 14px;
            padding-top: 10px;
            border-top: 2px dashed #9CA3AF;
            page-break-inside: auto;
        }
        .dosage-section-title {
            text-align: center;
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 1.5px;
            color: #1d4ed8;
            padding: 5px 10px;
            margin-bottom: 10px;
            background: #EFF6FF;
            border-radius: 6px;
            border: 1px solid #BFDBFE;
            text-transform: uppercase;
            page-break-after: avoid;
        }
        /* 2-column grid; wide cards span both columns */
        .dosage-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            page-break-inside: auto;
        }
        /* Individual chart card — pad style */
        .dosage-card {
            border: 2.5px solid #111;
            border-radius: 10px;
            padding: 8px 8px 6px 8px;
            background: #ffffff;
            page-break-inside: avoid;
            break-inside: avoid;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        /* Wide cards (4-6 slots) take full row */
        .dosage-card-wide {
            grid-column: span 2;
        }
        /* Card header with title + medicine name */
        .dosage-card-header {
            text-align: center;
            border-bottom: 1.5px dashed #10b981;
            padding-bottom: 4px;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .dosage-card-title {
            font-size: 8px;
            font-weight: 900;
            color: #065f46;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .dosage-card-med {
            font-size: 12px;
            font-weight: 900;
            color: #111;
            text-transform: uppercase;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        /* Chart SVG container — full width, no extra padding */
        .dosage-card-body {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        }
        .dosage-card-body svg {
            display: block;
            width: 100%;
            height: auto;
            max-width: 100%;
        }
        /* Note badge */
        .dosage-card-note {
            text-align: center;
            font-size: 8px;
            font-weight: 700;
            color: #78350F;
            padding: 2px 6px;
            background: #FEF3C7;
            border-radius: 4px;
            border-left: 3px solid #F59E0B;
        }
        @media print {
            .dosage-section { margin-top: 12px; }
            .dosage-card { box-shadow: none; }
        }
    </style>
    `;
};

/* ─────────────────────────────────────────────
   Hook
   ───────────────────────────────────────────── */
export const usePrintManager = () => {
    const [printFormat, setPrintFormatState] = useState(getInitialFormat);

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

        const formatToUse = specificFormat || printFormatRef.current;
        const dosageHtml = buildDosageSectionHTML(invoice);

        if (formatToUse === 'pos') {
            // ── Thermal 80mm ──
            let fullHTML = getPOSReceiptHTML(invoice);
            if (dosageHtml) {
                fullHTML = fullHTML.replace(
                    /<\/body>/i,
                    `<div style="padding:6px;">${dosageHtml}</div></body>`
                );
            }
            const printWindow = window.open(
                "",
                "_blank",
                "width=340,height=600,left=100,top=50"
            );
            if (printWindow) {
                printWindow.document.write(fullHTML);
                printWindow.document.close();
            }
        } else {
            // ── A4 layout ──
            const tableContent = getSalePrintLayout(invoice);
            const combinedContent = `${tableContent}${dosageHtml}`;
            const fullHTML = getBrandedVoucher(
                "Sale Invoice",
                combinedContent,
                invoice.invoice_no,
                "#1d4ed8"
            );
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
        handlePrintInvoice,
    };
};