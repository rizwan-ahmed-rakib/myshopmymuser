import React, { useRef, useState } from "react";
import { Camera, Image as ImageIcon, X } from "lucide-react";
import CameraCapture from "./CameraCapture";

/**
 * Reusable ImagePicker
 * Props:
 *   value       : string (preview URL) | null
 *   onChange    : (file: File) => void
 *   onClear     : () => void
 *   shape       : "circle" | "square"
 *   size        : "sm" | "md" | "lg"
 *   placeholder : ReactNode (icon)
 *   label       : string
 */
const ImagePicker = ({
  value,
  onChange,
  onClear,
  shape = "circle",
  size = "md",
  placeholder = <ImageIcon size={40} className="text-gray-300" />,
  label = "Photo",
}) => {
  const fileRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const sizeMap = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-40 h-40",
  };

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-[2rem]";

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onChange?.(file);
    e.target.value = ""; // same file আবার select করা যায়
  };

  return (
    <>
      <div className="flex flex-col items-center py-2">
        <div className="relative group">
          {/* Preview */}
          <div
            className={`${sizeMap[size]} ${shapeClass} overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}
          >
            {value ? (
              <img src={value} className="w-full h-full object-cover" alt="" />
            ) : (
              placeholder
            )}
          </div>

          {/* File browse button */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-1 left-1 bg-gray-700 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-gray-800 transition-colors border-2 border-white"
            title="Choose from gallery"
          >
            <ImageIcon size={14} />
          </button>

          {/* Camera capture button */}
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            className="absolute bottom-1 right-1 bg-brand-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-brand-primaryHover transition-colors border-2 border-white"
            title="Take photo"
          >
            <Camera size={14} />
          </button>

          {/* Clear button */}
          {value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-600 transition-colors border-2 border-white"
              title="Remove"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <p className="mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {label}
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {/* Camera Modal */}
      {cameraOpen && (
        <CameraCapture
          onClose={() => setCameraOpen(false)}
          onCapture={(file) => {
            onChange?.(file);
            setCameraOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ImagePicker;