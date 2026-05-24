// components/employees/ProfileImageUpload.jsx
import React from "react";
import PropTypes from "prop-types";

const ProfileImageUpload = ({
    previewImage,
    onImageChange,
    onImageUpload,
    size = "lg",
    editable = true
}) => {
    const sizeClasses = {
        sm: "w-24 h-24",
        md: "w-32 h-32",
        lg: "w-40 h-40",
        xl: "w-48 h-48"
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && onImageChange) {
            onImageChange(file);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <svg className="w-1/2 h-1/2 mb-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs">No Image</span>
                        </div>
                    )}
                </div>

                {editable && (
                    <>
                        <button
                            type="button"
                            onClick={onImageUpload}
                            className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <input
                            id="profile-picture-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </>
                )}
            </div>

            {editable && (
                <button
                    type="button"
                    onClick={onImageUpload}
                    className="mt-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm text-sm"
                >
                    {previewImage ? "Change Photo" : "Upload Photo"}
                </button>
            )}

            {editable && (
                <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF (Max 5MB)</p>
            )}
        </div>
    );
};

ProfileImageUpload.propTypes = {
    previewImage: PropTypes.string,
    onImageChange: PropTypes.func,
    onImageUpload: PropTypes.func,
    size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
    editable: PropTypes.bool
};

export default ProfileImageUpload;