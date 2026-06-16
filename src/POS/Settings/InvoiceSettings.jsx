// InvoiceSettings.jsx - Invoice Configuration

import React, { useState, useEffect } from 'react';
import api from '../../context_or_provider/pos/posApi';


const InvoiceSettings = () => {
    const [settings, setSettings] = useState({
        invoice_prefix: 'INV',
        invoice_starting_number: '1001',
        invoice_footer_text: '',
        show_company_logo: true,
        show_tax_breakdown: true,
        show_payment_terms: true,
        payment_terms: 'Payment due within 30 days',
        terms_and_conditions: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get(`/api/settings/invoice/`);
            setSettings(response.data);
        } catch (error) {
            console.error('Error fetching invoice settings:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            await api.post(`/api/settings/invoice/`, settings);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error saving invoice settings:', error);
            alert('Failed to save invoice settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Invoice Settings</h2>
                    <p className="text-gray-600 text-sm">Customize your invoice format and content</p>
                </div>
                <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                    {previewMode ? '📝 Edit' : '👁️ Preview'}
                </button>
            </div>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    ✅ Invoice settings saved successfully!
                </div>
            )}

            {previewMode ? (
                /* Invoice Preview */
                <div className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                {settings.show_company_logo && (
                                    <div className="w-32 h-16 bg-gray-100 rounded flex items-center justify-center mb-2">
                                        <span className="text-gray-400 text-xs">Logo</span>
                                    </div>
                                )}
                                <h1 className="text-2xl font-bold text-gray-900">Your Company</h1>
                                <p className="text-sm text-gray-600">company@email.com</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-3xl font-bold text-gray-900">INVOICE</h2>
                                <p className="text-gray-600 mt-1">{settings.invoice_prefix}-{settings.invoice_starting_number}</p>
                                <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-1">Bill To:</p>
                            <p className="font-semibold text-gray-900">Customer Name</p>
                            <p className="text-sm text-gray-600">customer@email.com</p>
                        </div>

                        {/* Items Table */}
                        <table className="w-full mb-6">
                            <thead className="bg-gray-50 border-y">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Qty</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Price</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="px-4 py-3">Sample Product</td>
                                    <td className="px-4 py-3 text-center">2</td>
                                    <td className="px-4 py-3 text-right">৳ 100.00</td>
                                    <td className="px-4 py-3 text-right font-semibold">৳ 200.00</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex justify-end mb-6">
                            <div className="w-64 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold">৳ 200.00</span>
                                </div>
                                {settings.show_tax_breakdown && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax (15%):</span>
                                        <span className="font-semibold">৳ 30.00</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Total:</span>
                                    <span>৳ 230.00</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        {settings.show_payment_terms && settings.payment_terms && (
                            <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                                <p className="text-sm text-gray-700"><strong>Payment Terms:</strong> {settings.payment_terms}</p>
                            </div>
                        )}

                        {settings.terms_and_conditions && (
                            <div className="mb-4 text-xs text-gray-600">
                                <p className="font-semibold mb-1">Terms & Conditions:</p>
                                <p>{settings.terms_and_conditions}</p>
                            </div>
                        )}

                        {settings.invoice_footer_text && (
                            <div className="text-center text-xs text-gray-500 border-t pt-4">
                                {settings.invoice_footer_text}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Settings Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Invoice Numbering */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Numbering</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Invoice Prefix
                                </label>
                                <input
                                    type="text"
                                    name="invoice_prefix"
                                    value={settings.invoice_prefix}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="INV"
                                />
                                <p className="text-xs text-gray-500 mt-1">Appears before invoice number (e.g., INV-1001)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Starting Number
                                </label>
                                <input
                                    type="text"
                                    name="invoice_starting_number"
                                    value={settings.invoice_starting_number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="1001"
                                />
                                <p className="text-xs text-gray-500 mt-1">Next invoice will start from this number</p>
                            </div>
                        </div>
                    </div>

                    {/* Display Options */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Options</h3>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="show_company_logo"
                                    checked={settings.show_company_logo}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">Show company logo on invoice</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="show_tax_breakdown"
                                    checked={settings.show_tax_breakdown}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">Show tax breakdown</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="show_payment_terms"
                                    checked={settings.show_payment_terms}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">Show payment terms</span>
                            </label>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Text Content</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Terms
                                </label>
                                <input
                                    type="text"
                                    name="payment_terms"
                                    value={settings.payment_terms}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Payment due within 30 days"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Terms & Conditions
                                </label>
                                <textarea
                                    name="terms_and_conditions"
                                    value={settings.terms_and_conditions}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your terms and conditions..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Invoice Footer Text
                                </label>
                                <input
                                    type="text"
                                    name="invoice_footer_text"
                                    value={settings.invoice_footer_text}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Thank you for your business!"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Saving...' : 'Save Invoice Settings'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default InvoiceSettings;