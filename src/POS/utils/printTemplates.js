/**
 * কোম্পানির সেটিংস লোকাল স্টোরেজ থেকে পাওয়ার হেল্পার ফাংশন
 */
const getCompanySettings = () => {
  const settingsRaw = localStorage.getItem('pos_settings');
  return settingsRaw ? JSON.parse(settingsRaw) : {
      company_name: "MY SHOP POS",
      company_address: "Address not provided",
      company_phone: "N/A",
      company_email: "N/A",
      company_logo: null
  };
};

/**
 * প্রিন্ট এবং PDF এর জন্য কমন স্টাইল
 */
export const commonVoucherStyles = (color = "#2563eb") => `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * { box-sizing: border-box; }

    body { 
        font-family: 'Inter', sans-serif; 
        padding: 40px; 
        color: #1f2937; 
        line-height: 1.5;
        background: #ffffff;
        margin: 0;
        position: relative; /* ওয়াটারমার্ক পজিশনিংয়ের জন্য দরকার */
    }

    /* ওয়াটারমার্ক লোগো স্টাইল */
    .watermark {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        opacity: 0.05; /* খুব হালকা */
        pointer-events: none;
        z-index: -1;
    }
    
    /* লোগো হেডার স্টাইল */
    .header-logo {
        height: 50px;
        margin-right: 15px;
        vertical-align: middle;
    }
    
    /* হেডার সেকশন - আরও পরিষ্কার ও ব্যালেন্সড লেআউট */
    .header { 
        display: flex; 
        justify-content: space-between; 
        align-items: flex-start; /* উপরে সারিবদ্ধ করা */
        border-bottom: 2px solid #111827; /* বর্ডার আরও স্পষ্ট */
        padding-bottom: 20px; 
        margin-bottom: 24px; 
    }
    
    .brand-side { display: flex; align-items: center; gap: 15px; } /* লোগো ও টেক্সটের মধ্যে দূরত্ব */
    
    .brand-info { display: flex; flex-direction: column; } /* নাম ও ট্যাগলাইন এক কলামে */

    .brand-side h1 { 
        margin: 0; 
        font-size: 24px; /* কিছুটা বড় */
        font-weight: 800; 
        text-transform: uppercase; 
        letter-spacing: -0.02em;
        color: #111827;
    }

    .brand-side .tagline { 
        font-size: 11px; 
        font-weight: 500; 
        color: #4b5563; 
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-top: 2px;
    }
    
    .meta-side { 
        text-align: right; 
    }

    .meta-side h2 { 
        margin: 0; 
        font-size: 18px; 
        font-weight: 700; 
        text-transform: uppercase; 
        color: #111827; 
        margin-bottom: 5px;
    }

    .voucher-id { 
        font-size: 12px; 
        font-weight: 600; 
        color: #374151;
        background: #f3f4f6;
        padding: 4px 12px;
        border-radius: 4px;
        display: inline-block;
    }

    .contact-row {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 32px;
        padding-bottom: 12px;
        border-bottom: 1px dashed #e5e7eb;
    }

    .contact-item { display: flex; align-items: center; }
    .contact-item:not(:last-child)::after {
        content: "•";
        margin-left: 16px;
        color: #d1d5db;
    }

    .contact-label { font-weight: 600; color: #4b5563; margin-right: 4px; }
    
    .info-grid { 
        display: flex;
        flex-wrap: wrap;
        gap: 20px; 
        margin-bottom: 24px; 
        background: #fafafa;
        padding: 16px;
        border-radius: 6px;
    }

    .info-section { 
        flex: 1;
        min-width: 150px;
    }

    .info-section h3 { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #9ca3af; margin: 0 0 4px 0; }
    .info-section p { margin: 0; font-weight: 600; font-size: 14px; color: #111827; }

    .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .table th { background: #fafafa; text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #e5e7eb; color: #4b5563; }
    .table td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; }

    .total-container { display: flex; justify-content: flex-end; margin-top: 16px; }
    .total-box { background: #ffffff; padding: 12px 24px; border-radius: 6px; text-align: right; border: 2px solid #111827; min-width: 200px; }
    .total-label { font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: 700; }
    .total-amount { font-size: 26px; font-weight: 800; color: #111827; }

    .footer { margin-top: 60px; display: flex; justify-content: space-between; page-break-inside: avoid; }
    .signature { border-top: 1px solid #d1d5db; width: 180px; text-align: center; padding-top: 80px; font-size: 11px; font-weight: 600; color: #6b7280; }

    @media print {
        body { padding: 10px; font-size: 12px; }
        .total-box { border: 2px solid #111827 !important; }
        .info-grid, .table th { background: #fafafa !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
`;

/**
 * ভাউচারের মূল এইচটিএমএল অংশ তৈরি করা
 */
export const getVoucherBodyHTML = (title, specificContent, id) => {
    const settings = getCompanySettings();
    
    // লোগো থাকলে তা ওয়াটারমার্ক হিসেবে বসানো
    const watermarkHtml = settings.company_logo 
        ? `<img src="${settings.company_logo}" class="watermark" alt="Watermark" />` 
        : '';
        
    // লোগো হেডার হিসেবে বসানো
    const headerLogoHtml = settings.company_logo 
        ? `<img src="${settings.company_logo}" class="header-logo" alt="Logo" />` 
        : '';

    return `
    ${watermarkHtml}
    <div class="header">
        <div class="brand-side">
            ${headerLogoHtml}
            <div>
                <h1>${settings.company_name}</h1>
                <div class="tagline">Retail Management</div>
            </div>
        </div>
        <div class="meta-side">
            <h2>${title}</h2>
            <div class="voucher-id">#${id}</div>
        </div>
    </div>

    <div class="contact-row">
        <div class="contact-item"><span class="contact-label">Add:</span><span>${settings.company_address}</span></div>
        <div class="contact-item"><span class="contact-label">Mob:</span><span>${settings.company_phone}</span></div>
        <div class="contact-item"><span class="contact-label">Email:</span><span>${settings.company_email}</span></div>
    </div>
    
    <div class="main-content">
        ${specificContent}
    </div>
    
    <div class="footer">
        <div class="signature">Recipient Signature</div>
        <div class="signature">Authorized Authority</div>
    </div>
`;
};

/**
 * getBrandedVoucher - Clean, Minimal & Print-Friendly POS Voucher Layout.
 */
export const getBrandedVoucher = (title, specificContent, id, color = "#2563eb") => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title} #${id}</title>
          <style>${commonVoucherStyles(color)}</style>
        </head>
        <body>
          ${getVoucherBodyHTML(title, specificContent, id)}
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                setTimeout(() => window.close(), 500);
              }, 500);
            };
          </script>
        </body>
      </html>
    `;
};