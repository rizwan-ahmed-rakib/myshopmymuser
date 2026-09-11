import React, { useState } from "react";
import BaseModal from "../BaseModal";
import { FileText, Calendar, FileCheck } from "lucide-react";

const CreateQuotationModal = ({ isOpen, onClose, onSave, isLoading, transactionType = "sale" }) => {
    const [title, setTitle] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            title,
            expires_at: expiresAt || null,
            notes,
        });
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={transactionType === 'sale' ? "Create Sales Quotation" : "Create Purchase Quotation"}
            icon={<FileText size={20} className="text-blue-500" />}
            size="md"
            variant="clean"
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Save Quotation"
            isLoading={isLoading}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Quotation Title / Ref Name (Optional)
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Price offer for Mr. Rahman"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Expiry Date (Optional)
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-mono"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Notes & Terms (Optional)
                    </label>
                    <textarea
                        rows={3}
                        placeholder="e.g. Valid for 15 days, 50% advance required..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500"
                    />
                </div>
            </form>
        </BaseModal>
    );
};

export default CreateQuotationModal;
