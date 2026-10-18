import React, {useState} from "react";
import {Scale, Camera, Image as ImageIcon} from 'lucide-react';
import {posUnitAPI} from "../../../context_or_provider/pos/units/unitAPI";
import BaseModal from "../../components/BaseModal";
import {useForm} from "../../../hooks/profile";
import ImagePicker from "../../components/imagecapture/ImagePicker";

/**
 * AddUnitModal - Refactored to use BaseModal, useForm, and Backbone branding.
 */
const AddUnitModal = ({isOpen, onClose, onSuccess}) => {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const {
        form,
        errors,
        handleChange,
        resetForm,
        validateForm,
        setFormField
    } = useForm(
        {
            title: "",
            image: null,
        },
        {
            title: (v) => !v ? "Unit title is required" : null,
        }
    );

    const handleImageChange = (fileOrEvent) => {
        const file = fileOrEvent?.target?.files?.[0] || fileOrEvent;
        if (file) {
            setFormField("image", file);       // Add modal
            // OR
            // setImageFile(file);                // Update modal
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleImageClear = () => {
        setFormField("image", null);           // Add modal
        // OR
        // setImageFile(null);                    // Update modal
        setPreviewImage(null);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await posUnitAPI.create(form);
            onSuccess?.(res.data);
            handleClose();
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : "Failed to add unit";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        setPreviewImage(null);
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Measurement Unit"
            subtitle="Define how you count your stock (pcs, kg, etc.)"
            size="md"
            icon={<Scale/>}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Save Unit"
            isLoading={loading}
        >
            <div className="space-y-8">
                {/* Image Upload Area */}
                <div
                    className="bg-gray-50 p-8 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center text-center shadow-inner hover:border-blue-400 transition-colors">
                    <ImagePicker
                        value={previewImage}
                        onChange={handleImageChange}
                        onClear={handleImageClear}
                        shape="square"
                        size="lg"
                        placeholder={<ImageIcon size={48} className="text-gray-200"/>}
                        label="Unit Icon"
                    />
                </div>
                {/* Title Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit Title
                        *</label>
                    <div className="relative">
                        <Scale size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. Piece (pcs), Kilogram (kg), Pack, etc."
                        />
                    </div>
                    {errors.title &&
                        <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.title}</p>}
                </div>
            </div>
        </BaseModal>
    );
};

export default AddUnitModal;
