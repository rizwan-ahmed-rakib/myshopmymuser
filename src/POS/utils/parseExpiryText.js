// utils/parseExpiryText.js

/**
 * Medicine pack-এর OCR text থেকে MFG, EXP, Batch extract করে।
 * Supports:
 *   - Bangla + English labels
 *   - 06/28, 05 28, JUN26, JUN 2026, JUN'26, 0826
 *   - Combined lines like "Mfg/Exp: JUL26 JUN28"
 */

/* ─────────────────────────────────────────────
   MONTH MAP
   ───────────────────────────────────────────── */
const MONTHS = {
    jan: "01", january: "01",
    feb: "02", february: "02",
    mar: "03", march: "03",
    apr: "04", april: "04",
    may: "05",
    jun: "06", june: "06",
    jul: "07", july: "07",
    aug: "08", august: "08",
    sep: "09", sept: "09", september: "09",
    oct: "10", october: "10",
    nov: "11", november: "11",
    dec: "12", december: "12",
};

/* ─────────────────────────────────────────────
   UNIVERSAL DATE PARSER
   Returns "YYYY-MM-DD" or ""
   ───────────────────────────────────────────── */
const parseAnyDate = (raw) => {
    if (!raw) return "";
    let str = String(raw)
        .trim()
        .replace(/[।|,;:]/g, " ")
        .replace(/\s+/g, " ")
        .toUpperCase();

    if (!str || str.length < 3) return "";

    // Pattern A: DD/MM/YYYY or DD-MM-YYYY
    let m = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
    if (m) {
        let [, d, mo, y] = m;
        if (y.length === 2) y = "20" + y;
        return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    // Pattern B: MM/YYYY or MM-YYYY or MM YYYY
    m = str.match(/^(\d{1,2})[\/\-\.](\d{4})$/);
    if (m) {
        const [, mo, y] = m;
        if (Number(mo) >= 1 && Number(mo) <= 12) {
            return `${y}-${mo.padStart(2, "0")}-01`;
        }
    }

    // Pattern C: MM/YY or MM YY or MM-YY (e.g. 06/28, 05 28)
    m = str.match(/^(\d{1,2})[\/\-\.\s](\d{2})$/);
    if (m) {
        let [, mo, yy] = m;
        if (Number(mo) >= 1 && Number(mo) <= 12) {
            return `20${yy}-${mo.padStart(2, "0")}-01`;
        }
    }

    // Pattern D: MMYY compact (e.g. 0826, 0728) — only if 4 digits & month valid
    m = str.match(/^(\d{4})$/);
    if (m) {
        const mo = m[1].slice(0, 2);
        const yy = m[1].slice(2, 4);
        if (Number(mo) >= 1 && Number(mo) <= 12) {
            return `20${yy}-${mo}-01`;
        }
    }

    // Pattern E: MON YYYY or MON YY or MON'YY or MON-YY (JUN26, JUL 2026, JUN'26)
    m = str.match(/^([A-Z]{3,9})[\s'\-\.\/]?(\d{2,4})$/);
    if (m) {
        const mo = MONTHS[m[1].toLowerCase()];
        let y = m[2];
        if (y.length === 2) y = "20" + y;
        if (mo) return `${y}-${mo}-01`;
    }

    // Pattern F: Any 3-letter month + digits somewhere
    m = str.match(/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*[\s'\-\.\/]*(\d{2,4})/);
    if (m) {
        const mo = MONTHS[m[1].toLowerCase()];
        let y = m[2];
        if (y.length === 2) y = "20" + y;
        if (mo) return `${y}-${mo}-01`;
    }

    return "";
};

/* ─────────────────────────────────────────────
   Extract date candidates from a free-form string
   Returns array of valid "YYYY-MM-DD"
   ───────────────────────────────────────────── */
const extractDatesFromString = (str) => {
    if (!str) return [];
    const found = [];

    // Try full-string first
    const whole = parseAnyDate(str);
    if (whole) found.push(whole);

    // Split by whitespace and try each token
    const tokens = str.split(/\s+/).filter(Boolean);
    tokens.forEach((tok) => {
        const d = parseAnyDate(tok);
        if (d && !found.includes(d)) found.push(d);
    });

    // Try "MON YY" pattern inside string (e.g. "JUL26 JUN28" → both)
    const monMatches = str.match(
        /(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*[\s'\-\.\/]*\d{2,4}/gi
    );
    if (monMatches) {
        monMatches.forEach((m) => {
            const d = parseAnyDate(m);
            if (d && !found.includes(d)) found.push(d);
        });
    }

    // Try MM/YY or MM-YY anywhere
    const slashMatches = str.match(/\b\d{1,2}[\/\-\.\s]\d{2,4}\b/g);
    if (slashMatches) {
        slashMatches.forEach((m) => {
            const d = parseAnyDate(m);
            if (d && !found.includes(d)) found.push(d);
        });
    }

    // Try 4-digit compact MMYY (only if likely — between 0100 and 1299)
    const compactMatches = str.match(/\b\d{4}\b/g);
    if (compactMatches) {
        compactMatches.forEach((m) => {
            const mo = Number(m.slice(0, 2));
            const yy = Number(m.slice(2, 4));
            if (mo >= 1 && mo <= 12 && yy >= 20 && yy <= 50) {
                const d = parseAnyDate(m);
                if (d && !found.includes(d)) found.push(d);
            }
        });
    }

    return found;
};

/* ─────────────────────────────────────────────
   MAIN PARSER
   ───────────────────────────────────────────── */
export const parseExpiryText = (rawText) => {
    const result = {
        manufacturing_date: "",
        expiry_date: "",
        batch_no: "",
        raw: rawText,
    };

    if (!rawText) return result;

    // Normalize text
    const text = String(rawText)
        .replace(/[।]/g, " ")
        .replace(/[|]/g, " ")
        .replace(/\r\n/g, "\n")
        .replace(/\t/g, " ");

    const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    /* ─────────────────────────────────────────────
       STEP 1: Line-by-line parse
       ───────────────────────────────────────────── */

    // Multiple label patterns — Bangla + English
    const MFG_LABELS = [
        /\bmfg\.?\s*(?:date|dt)?\.?\s*[:\-]?\s*(.+)/i,
        /\bmfg\s*\/\s*exp\s*[:\-]?\s*(.+)/i,       // "Mfg/Exp : JUL26 JUN28" — take whole rest
        /\bপ্রস্তুত\s*[:\-]?\s*(.+)/i,
        /\bmanufactur(?:ing|ed)?\s*(?:date|dt)?\.?\s*[:\-]?\s*(.+)/i,
    ];

    const EXP_LABELS = [
        /\bexp\.?\s*(?:date|dt)?\.?\s*[:\-]?\s*(.+)/i,
        /\bexpiry\s*(?:date)?\.?\s*[:\-]?\s*(.+)/i,
        /\bমেয়াদ\s*(?:উত্তীর্ণ)?\s*[:\-]?\s*(.+)/i,
        /\bexp\.?\s*[:\-]?\s*(.+)/i,
    ];

    const BATCH_LABELS = [
        /\bbatch\s*no\.?\s*[:\-]?\s*(.+)/i,
        /\bbatch\s*[:\-]?\s*(.+)/i,
        /\bb\/n\.?\s*[:\-]?\s*(.+)/i,
        /\bb\.n\.?\s*[:\-]?\s*(.+)/i,
        /\blot\s*(?:no\.?)?\s*[:\-]?\s*(.+)/i,
        /\bব্যাচ\s*(?:নং|নম্বর)?\s*[:\-]?\s*(.+)/i,
    ];

    let mfgLine = "";
    let expLine = "";
    let batchLine = "";

    lines.forEach((line) => {
        // MFG check
        if (!mfgLine) {
            for (const re of MFG_LABELS) {
                const m = line.match(re);
                if (m) {
                    mfgLine = m[1] || "";
                    break;
                }
            }
        }
        // EXP check
        if (!expLine) {
            for (const re of EXP_LABELS) {
                const m = line.match(re);
                if (m) {
                    expLine = m[1] || "";
                    break;
                }
            }
        }
        // Batch check
        if (!batchLine) {
            for (const re of BATCH_LABELS) {
                const m = line.match(re);
                if (m) {
                    // Batch value: strip trailing date-ish numbers if combined
                    let val = (m[1] || "").trim();
                    // Remove trailing "MFG ..." etc if present
                    val = val.split(/\s+(?:mfg|exp|mrp|ip|price)/i)[0].trim();
                    // Take only first meaningful token
                    val = val.split(/\s+/)[0].replace(/[^A-Za-z0-9\-]/g, "");
                    batchLine = val;
                    break;
                }
            }
        }
    });

    /* ─────────────────────────────────────────────
       STEP 2: Handle "Mfg/Exp: JUL26 JUN28" combined line
       ───────────────────────────────────────────── */
    if (mfgLine && /mfg\s*\/\s*exp/i.test(text)) {
        // Combined line — split dates
        const dates = extractDatesFromString(mfgLine);
        if (dates.length >= 2) {
            const sorted = [...dates].sort();
            result.manufacturing_date = sorted[0];
            result.expiry_date = sorted[sorted.length - 1];
        } else if (dates.length === 1) {
            result.expiry_date = dates[0];
        }
    } else {
        // Separate MFG/EXP lines
        if (mfgLine) {
            const d = extractDatesFromString(mfgLine);
            if (d.length) result.manufacturing_date = d[0];
        }
        if (expLine) {
            const d = extractDatesFromString(expLine);
            if (d.length) result.expiry_date = d[0];
        }
    }

    /* ─────────────────────────────────────────────
       STEP 3: Fallback — scan entire text for dates
       ───────────────────────────────────────────── */
    if (!result.manufacturing_date || !result.expiry_date) {
        const allDates = extractDatesFromString(text);

        if (allDates.length >= 2) {
            const sorted = [...allDates].sort();
            if (!result.manufacturing_date) result.manufacturing_date = sorted[0];
            if (!result.expiry_date) result.expiry_date = sorted[sorted.length - 1];
        } else if (allDates.length === 1) {
            if (!result.expiry_date) result.expiry_date = allDates[0];
        }
    }

    /* ─────────────────────────────────────────────
       STEP 4: Final sanity — MFG should be < EXP
       ───────────────────────────────────────────── */
    if (result.manufacturing_date && result.expiry_date) {
        if (result.manufacturing_date > result.expiry_date) {
            // Swap them
            const tmp = result.manufacturing_date;
            result.manufacturing_date = result.expiry_date;
            result.expiry_date = tmp;
        }
    }

    /* ─────────────────────────────────────────────
       STEP 5: Batch number — fallback scan
       ───────────────────────────────────────────── */
    if (!result.batch_no) {
        // Look for any alphanumeric token near "batch" keyword
        const batchNear = text.match(
            /(?:batch|b\/n|b\.n|lot|ব্যাচ)\D{0,5}([A-Z0-9][A-Z0-9\-]{3,20})/i
        );
        if (batchNear) result.batch_no = batchNear[1].toUpperCase();
    }

    if (result.batch_no) {
        result.batch_no = result.batch_no.toUpperCase();
    }

    return result;
};

/* ─────────────────────────────────────────────
   Utility — check if parsed data looks complete
   ───────────────────────────────────────────── */
export const isParseResultComplete = (parsed) => {
    return !!(parsed?.manufacturing_date && parsed?.expiry_date && parsed?.batch_no);
};

export const getParseResultSummary = (parsed) => {
    const missing = [];
    if (!parsed?.manufacturing_date) missing.push("MFG");
    if (!parsed?.expiry_date) missing.push("EXP");
    if (!parsed?.batch_no) missing.push("Batch");
    return missing.length === 0 ? "✅ সব পাওয়া গেছে" : `⚠️ পাওয়া যায়নি: ${missing.join(", ")}`;
};

export default parseExpiryText;