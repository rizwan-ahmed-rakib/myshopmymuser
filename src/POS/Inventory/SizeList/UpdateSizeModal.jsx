import React, {useState, useEffect} from "react";
import {Maximize, Camera, Image as ImageIcon, Settings} from 'lucide-react';
import {posSizeAPI} from "../../../context_or_provider/pos/sizes/sizeAPI";
import BaseModal from "../../components/BaseModal";
import {useForm} from "../../../hooks/profile";
import ImagePicker from "../../components/imagecapture/ImagePicker";

/**
 * UpdateSizeModal - Refactored to use BaseModal and match Backbone pattern.
 */
const UpdateSizeModal = ({isOpen, onClose, onSuccess, productData}) => {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const {
        form,
        errors,
        handleChange,
        setFormData,
        validateForm
    } = useForm(
        {
            title: "",
        },
        {
            title: (v) => !v ? "Size title is required" : null,
        }
    );

    useEffect(() => {
        if (productData && isOpen) {
            setFormData({
                title: productData.title || "",
            });
            setPreviewImage(productData.image || null);
            setImageFile(null);
        }
    }, [productData, isOpen, setFormData]);

    const handleImageChange = (fileOrEvent) => {
        const file = fileOrEvent?.target?.files?.[0] || fileOrEvent;
        if (file) {
            // setFormField("image", file);       // Add modal
            // OR
            setImageFile(file);                // Update modal
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleImageClear = () => {
        // setFormField("image", null);           // Add modal
        // OR
        setImageFile(null);                    // Update modal
        setPreviewImage(null);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const dataToSend = {...form};
            if (imageFile) {
                dataToSend.image = imageFile;
            }

            const res = await posSizeAPI.update(productData.id, dataToSend);
            onSuccess?.(res.data);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Update failed: " + (err.response?.data ? JSON.stringify(err.response.data) : "Network error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Size"
            subtitle={`Ref: #SIZ-${productData?.id}`}
            size="md"
            icon={<Settings/>}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Save Changes"
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
                        label="Size Reference Image"
                    />
                </div>
                {/* Title Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Size Label
                        *</label>
                    <div className="relative">
                        <Maximize size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. XL, 42, 10-inch, etc."
                        />
                    </div>
                    {errors.title &&
                        <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.title}</p>}
                </div>
            </div>
        </BaseModal>
    );
};

export default UpdateSizeModal;
