// // utils/printDosageChart.js
// import React from "react";
// import { renderToStaticMarkup } from "react-dom/server";
// import MedicineDosageChart from "../components/medicine/MedicineDosageChart";
//
// /**
//  * Standalone dosage chart print — invoice ছাড়াই।
//  * @param {Object} config - MedicineDosageChart config (slots, stripImage, medicineName, note)
//  * @param {Object} options - { size: "sm" | "lg", copies: number }
//  */
// export const printDosageChart = (config, options = {}) => {
//     if (!config?.slots?.length) {
//         alert("প্রথমে ডোজ চার্ট কনফিগার করুন");
//         return;
//     }
//
//     const { size = "lg", copies = 1 } = options;
//
//     let svgHtml = "";
//     try {
//         svgHtml = renderToStaticMarkup(
//             <MedicineDosageChart
//                 config={{ ...config, medicineName: config.medicineName || "" }}
//                 size={size}
//             />
//         );
//     } catch (e) {
//         console.error("Chart render error:", e);
//         alert("Chart render ব্যর্থ হয়েছে");
//         return;
//     }
//
//     const medName = config.medicineName || "ঔষধ";
//     const note = config.note || "";
//
//     // Build N copies side by side (2 per row on A4)
//     const copiesHtml = Array.from({ length: copies })
//         .map(
//             (_, i) => `
//         <div class="chart-card">
//             <div class="header">💊 ঔষধ সেবনের নিয়ম / Medicine Schedule</div>
//             <div class="med-name">${medName}</div>
//             <div class="chart-body">${svgHtml}</div>
//             ${note ? `<div class="note">📝 ${note}</div>` : ""}
//             <div class="footer-note">
//                 রোগীর সেবার সুবিধার জন্য প্রদান করা হলো
//             </div>
//         </div>
//     `
//         )
//         .join("");
//
//     const html = `<!DOCTYPE html>
// <html>
// <head>
//     <meta charset="UTF-8">
//     <title>Medicine Schedule - ${medName}</title>
//     <style>
//         @page { size: A4 portrait; margin: 10mm; }
//         * { box-sizing: border-box; }
//         body {
//             font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
//             margin: 0;
//             padding: 10px;
//             background: #fff;
//             color: #111;
//         }
//         .grid {
//             display: grid;
//             grid-template-columns: ${copies > 1 ? "1fr 1fr" : "1fr"};
//             gap: 12px;
//         }
//         .chart-card {
//             border: 3px solid #000;
//             border-radius: 12px;
//             padding: 14px 12px;
//             page-break-inside: avoid;
//             break-inside: avoid;
//             background: #fff;
//         }
//         .header {
//             text-align: center;
//             font-size: 13px;
//             font-weight: 900;
//             text-transform: uppercase;
//             letter-spacing: 1.5px;
//             color: #065f46;
//             padding-bottom: 6px;
//             border-bottom: 2px dashed #10b981;
//             margin-bottom: 8px;
//         }
//         .med-name {
//             text-align: center;
//             font-size: 18px;
//             font-weight: 900;
//             color: #111;
//             margin-bottom: 10px;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//         }
//         .chart-body {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             padding: 4px 0;
//         }
//         .chart-body svg {
//             width: 100%;
//             height: auto;
//             max-width: 100%;
//         }
//         .note {
//             font-size: 11px;
//             font-weight: 700;
//             color: #374151;
//             text-align: center;
//             margin-top: 8px;
//             padding: 6px 8px;
//             background: #FEF3C7;
//             border-radius: 6px;
//             border-left: 3px solid #F59E0B;
//         }
//         .footer-note {
//             font-size: 9px;
//             color: #6B7280;
//             text-align: center;
//             margin-top: 10px;
//             padding-top: 6px;
//             border-top: 1px dashed #D1D5DB;
//             font-style: italic;
//         }
//         @media print {
//             body { padding: 0; }
//         }
//     </style>
// </head>
// <body>
//     <div class="grid">
//         ${copiesHtml}
//     </div>
//     <script>
//         // Auto-print after images loaded
//         window.addEventListener('load', () => {
//             setTimeout(() => window.print(), 400);
//         });
//     </script>
// </body>
// </html>`;
//
//     const printWindow = window.open("", "_blank", "width=900,height=1000");
//     if (!printWindow) {
//         alert("Print window খুলতে পারছি না। Browser popup blocker বন্ধ করুন।");
//         return;
//     }
//     printWindow.document.open();
//     printWindow.document.write(html);
//     printWindow.document.close();
// };
//
// /**
//  * Multiple medicines একসাথে print করার জন্য।
//  * @param {Array} configs - Array of config objects
//  */
// export const printMultipleDosageCharts = (configs = []) => {
//     if (!configs.length) {
//         alert("কোনো chart নেই");
//         return;
//     }
//
//     const cardsHtml = configs
//         .map((cfg) => {
//             let svg = "";
//             try {
//                 svg = renderToStaticMarkup(
//                     <MedicineDosageChart
//                         config={{ ...cfg, medicineName: cfg.medicineName || "ঔষধ" }}
//                         size="lg"
//                     />
//                 );
//             } catch {
//                 return "";
//             }
//             return `
//         <div class="chart-card">
//             <div class="header">💊 ঔষধ সেবনের নিয়ম</div>
//             <div class="med-name">${cfg.medicineName || "ঔষধ"}</div>
//             <div class="chart-body">${svg}</div>
//             ${cfg.note ? `<div class="note">📝 ${cfg.note}</div>` : ""}
//         </div>
//     `;
//         })
//         .join("");
//
//     const html = `<!DOCTYPE html>
// <html><head><meta charset="UTF-8"><title>Medicine Schedules</title>
// <style>
//     @page { size: A4 portrait; margin: 10mm; }
//     * { box-sizing: border-box; }
//     body { font-family: 'Segoe UI', Arial, sans-serif; padding: 10px; }
//     .chart-card {
//         border: 3px solid #000;
//         border-radius: 12px;
//         padding: 14px 12px;
//         margin-bottom: 14px;
//         page-break-inside: avoid;
//         break-inside: avoid;
//     }
//     .header {
//         text-align: center; font-size: 12px; font-weight: 900;
//         text-transform: uppercase; letter-spacing: 1.5px;
//         color: #065f46; padding-bottom: 6px;
//         border-bottom: 2px dashed #10b981; margin-bottom: 8px;
//     }
//     .med-name {
//         text-align: center; font-size: 17px; font-weight: 900;
//         margin-bottom: 10px; text-transform: uppercase;
//     }
//     .chart-body { display: flex; justify-content: center; }
//     .chart-body svg { width: 100%; height: auto; max-width: 100%; }
//     .note {
//         font-size: 11px; font-weight: 700; color: #374151;
//         text-align: center; margin-top: 8px; padding: 6px 8px;
//         background: #FEF3C7; border-radius: 6px;
//         border-left: 3px solid #F59E0B;
//     }
// </style></head><body>${cardsHtml}
// <script>window.addEventListener('load', () => setTimeout(() => window.print(), 400));</script>
// </body></html>`;
//
//     const w = window.open("", "_blank", "width=900,height=1000");
//     if (!w) return alert("Popup blocker সক্রিয়");
//     w.document.open();
//     w.document.write(html);
//     w.document.close();
// };


// utils/printDosageChart.js
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import MedicineDosageChart from "../components/medicine/MedicineDosageChart";

/* ─────────────────────────────────────────────
   Render a single chart as SVG string
   ───────────────────────────────────────────── */
const renderChartSVG = (config) => {
    try {
        return renderToStaticMarkup(
            <MedicineDosageChart
                config={{...config, medicineName: config.medicineName || "ঔষধ"}}
                size="lg"
            />
        );
    } catch (e) {
        console.error("Chart render error:", e);
        return "";
    }
};

/* ─────────────────────────────────────────────
   Shop pad header (reusable)
   ───────────────────────────────────────────── */
const buildShopHeaderHTML = (settings) => {
    if (!settings) return "";

    const name = settings.company_name || "POS System";
    const address = settings.company_address || "";
    const phone = settings.company_phone || "";
    const email = settings.company_email || "";
    const logo = settings.company_logo || "";

    const contactParts = [address, phone, email].filter(Boolean);

    return `
    <div class="shop-header">
        ${logo ? `<img src="${logo}" alt="logo" class="shop-logo" />` : ""}
        <div class="shop-info">
            <h1 class="shop-name">${name}</h1>
            ${contactParts.length > 0 ? `
                <p class="shop-contact">${contactParts.join(" • ")}</p>
            ` : ""}
        </div>
    </div>
    <div class="header-divider"></div>
    `;
};

/* ─────────────────────────────────────────────
   Core styles (shared between single/multi print)
   ───────────────────────────────────────────── */
const PAD_STYLES = `
    @page { size: A4 portrait; margin: 10mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; color: #111; }
    body { padding: 0; }

    /* ───── SHOP PAD HEADER ───── */
    .shop-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 8px;
    }
    .shop-logo {
        width: 52px;
        height: 52px;
        border-radius: 8px;
        object-fit: cover;
        border: 1.5px solid #e5e7eb;
        flex-shrink: 0;
    }
    .shop-info { flex: 1; text-align: center; }
    .shop-name {
        font-size: 20px;
        font-weight: 900;
        letter-spacing: 1.5px;
        margin: 0;
        color: #111;
        text-transform: uppercase;
    }
    .shop-contact {
        font-size: 10px;
        font-weight: 700;
        color: #4B5563;
        margin: 3px 0 0 0;
        letter-spacing: 0.4px;
    }
    .header-divider {
        border-bottom: 2px solid #111;
        margin-bottom: 12px;
    }

    /* ───── DOSAGE SECTION TITLE ───── */
    .dosage-section-title {
        text-align: center;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 1.8px;
        color: #065f46;
        padding: 7px 12px;
        margin-bottom: 12px;
        background: #F0FDF4;
        border-radius: 6px;
        border: 1.5px solid #10b981;
        text-transform: uppercase;
    }

    /* ───── CARDS GRID ───── */
    .cards-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        page-break-inside: auto;
    }

    /* ───── INDIVIDUAL CHART CARD (PAD STYLE) ───── */
    .chart-card {
        border: 2.5px solid #111;
        border-radius: 10px;
        padding: 10px 10px 8px 10px;
        background: #fff;
        page-break-inside: avoid;
        break-inside: avoid;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    /* 4 or 6 slot charts span full width */
    .chart-card-wide {
        grid-column: span 2;
    }

    .chart-card-header {
        text-align: center;
        border-bottom: 1.5px dashed #10b981;
        padding-bottom: 5px;
    }
    .chart-med-name {
        font-size: 13px;
        font-weight: 900;
        color: #111;
        text-transform: uppercase;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 0.5px;
    }
    .chart-body {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    .chart-body svg {
        display: block;
        width: 100%;
        height: auto;
        max-width: 100%;
    }
    .chart-note {
        text-align: center;
        font-size: 8.5px;
        font-weight: 700;
        color: #78350F;
        padding: 3px 8px;
        background: #FEF3C7;
        border-radius: 4px;
        border-left: 3px solid #F59E0B;
    }

    /* ───── PAGE WRAPPER ───── */
    .page {
        width: 190mm;
        min-height: 277mm;
        page-break-after: always;
    }
    .page:last-child { page-break-after: auto; }
`;

/* ─────────────────────────────────────────────
   Card HTML builder
   ───────────────────────────────────────────── */
const buildCardHTML = (config) => {
    const svg = renderChartSVG(config);
    if (!svg) return "";

    const slotCount = config.slots?.length || 0;
    const isWide = slotCount >= 4;
    const medName = config.medicineName || "ঔষধ";

    return `
    <div class="chart-card ${isWide ? "chart-card-wide" : ""}">
        <div class="chart-card-header">
            <p class="chart-med-name">💊 ${medName}</p>
        </div>
        <div class="chart-body">${svg}</div>
        ${config.note ? `<div class="chart-note">📝 ${config.note}</div>` : ""}
    </div>
    `;
};

/* ─────────────────────────────────────────────
   Single chart print
   ───────────────────────────────────────────── */
export const printDosageChart = (config, options = {}) => {
    if (!config?.slots?.length) {
        alert("প্রথমে ডোজ চার্ট কনফিগার করুন");
        return;
    }
    const {copies = 2, settings = null} = options;
    const cardHtml = buildCardHTML(config);
    if (!cardHtml) return;

    // Repeat the same card N times
    const cardsHtml = Array.from({length: copies})
        .map(() => cardHtml)
        .join("");

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Medicine Schedule — ${config.medicineName || "ঔষধ"}</title>
    <style>
        ${PAD_STYLES}
        .page { padding: 4mm; }
    </style>
</head>
<body>
    <div class="page">
        ${buildShopHeaderHTML(settings)}
        <div class="dosage-section-title">
            💊 ঔষধ সেবনের নিয়ম / MEDICINE SCHEDULE
        </div>
        <div class="cards-grid">
            ${cardsHtml}
        </div>
    </div>
    <script>
        window.addEventListener('load', () => setTimeout(() => window.print(), 500));
    </script>
</body>
</html>`;

    const w = window.open("", "_blank", "width=900,height=1000");
    if (!w) return alert("Popup blocker সক্রিয়");
    w.document.open();
    w.document.write(html);
    w.document.close();
};

/* ─────────────────────────────────────────────
   Multiple charts print (with pagination)
   ───────────────────────────────────────────── */
export const printMultipleDosageCharts = (configs = [], options = {}) => {
    if (!configs.length) return alert("কোনো chart নেই");

    const {settings = null} = options;

    // Paginate: keep pairs together
    // - Wide cards (4/6 slots) → 3 per page (full rows)
    // - Half cards (1/2/3 slots) → 6 per page (2×3 grid)
    // Simplest approach: put up to 6 half-width or 3 wide-width per page


    // 🆕 SORT: half-width first (1-3 slots), then wide (4-6 slots)
    const sorted = [...configs].sort((a, b) => {
        const aSlots = a.slots?.length || 0;
        const bSlots = b.slots?.length || 0;
        const aWide = aSlots >= 4 ? 1 : 0;
        const bWide = bSlots >= 4 ? 1 : 0;
        if (aWide !== bWide) return aWide - bWide;    // half first
        return aSlots - bSlots;                        // smaller slot count first
    });

    // const pages = [];
    // let currentPage = [];
    // let currentSlotsUsed = 0;   // half-width = 1, wide = 2 (row units)
    // const MAX_UNITS = 6;

     // বাকি logic-এ `configs` এর বদলে `sorted` use করো
    const pages = [];
    let currentPage = [];
    let currentUnits = 0;
    const MAX_UNITS = 6;

    // configs.forEach((cfg) => {
    //     const unit = (cfg.slots?.length || 0) >= 4 ? 2 : 1;
    //     if (currentSlotsUsed + unit > MAX_UNITS) {
    //         pages.push(currentPage);
    //         currentPage = [];
    //         currentSlotsUsed = 0;
    //     }
    //     currentPage.push(cfg);
    //     currentSlotsUsed += unit;
    // });

    sorted.forEach((cfg) => {
        const unit = (cfg.slots?.length || 0) >= 4 ? 2 : 1;
        if (currentUnits + unit > MAX_UNITS) {
            pages.push(currentPage);
            currentPage = [];
            currentUnits = 0;
        }
        currentPage.push(cfg);
        currentUnits += unit;
    });

    if (currentPage.length) pages.push(currentPage);

    const pagesHtml = pages
        .map((pageConfigs, pageIdx) => {
            const cardsHtml = pageConfigs.map((c) => buildCardHTML(c)).join("");
            return `
            <div class="page">
                ${buildShopHeaderHTML(settings)}
                <div class="dosage-section-title">
                    💊 ঔষধ সেবনের নিয়ম / MEDICINE SCHEDULE
                    <span style="float:right; font-size:9px; color:#6B7280; font-weight:700;">
                        পৃষ্ঠা ${pageIdx + 1} / ${pages.length}
                    </span>
                </div>
                <div class="cards-grid">
                    ${cardsHtml}
                </div>
            </div>
            `;
        })
        .join("");

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Medicine Schedules (${configs.length})</title>
    <style>
        ${PAD_STYLES}
        .page { padding: 4mm; }
    </style>
</head>
<body>${pagesHtml}
    <script>
        window.addEventListener('load', () => setTimeout(() => window.print(), 500));
    </script>
</body>
</html>`;

    const w = window.open("", "_blank", "width=900,height=1000");
    if (!w) return alert("Popup blocker সক্রিয়");
    w.document.open();
    w.document.write(html);
    w.document.close();
};