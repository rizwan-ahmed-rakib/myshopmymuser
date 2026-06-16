import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaArrowLeft, FaPrint, FaEdit, FaExclamationTriangle, FaTimes, FaExpand } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

/**
 * GenericModuleDetails
 * Design follows PurchaseDetailsPage.jsx pattern:
 *   - Light bg-gray-50 page
 *   - White rounded-3xl card with overflow-hidden
 *   - Dark gradient hero section inside the card
 *   - Optional entity image (employee / customer / product) with lightbox on click
 *   - Glassmorphic amount pill on the right of hero
 *   - Icon-only action buttons in the top bar (print, edit + any custom via actions[])
 *   - infoItems rendered as meta-row inside hero
 */
const GenericModuleDetails = ({
    title,
    subtitle,
    recordId,
    amount,
    amountLabel,
    statusBadge,
    onPrint,
    onEdit,
    printText   = 'Print Voucher',
    editText    = 'Edit Record',
    isLoading   = false,
    error       = null,
    accentColor = 'blue',
    children,
    infoItems   = [],
    actions     = [],        // [{ icon, label, onClick, hoverColor? }]
    backLabel   = 'Back to List',
    heroIcon    = null,      // large decorative faded icon in hero bg
    image       = null,      // entity image URL (employee / customer / product)
    imageAlt    = 'Image',
    imageFallback = null,    // fallback URL if image fails to load
}) => {
    const navigate = useNavigate();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [imgError, setImgError]         = useState(false);

    /* ── Loading ─────────────────────────────────────────────── */
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-500 font-semibold text-sm">Loading details...</p>
                </div>
            </div>
        );
    }

    /* ── Error / Not Found ───────────────────────────────────── */
    if (error || (!isLoading && !recordId)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center p-10 bg-white rounded-2xl shadow-md max-w-sm w-full border border-gray-100">
                    <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
                        <FaExclamationTriangle className="text-xl" />
                    </div>
                    <h2 className="text-xl font-black text-gray-800 mb-2">
                        {error || 'Record Not Found'}
                    </h2>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        The requested record could not be loaded.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    /* ── Accent color maps ───────────────────────────────────── */
    const gradientTo = {
        blue:    'to-blue-900',
        emerald: 'to-emerald-900',
        amber:   'to-amber-900',
        rose:    'to-rose-900',
        violet:  'to-violet-900',
        indigo:  'to-indigo-900',
        cyan:    'to-cyan-900',
        purple:  'to-purple-900',
    }[accentColor] || 'to-blue-900';

    const chipColor = {
        blue:    'bg-blue-500/20 text-blue-200 border-blue-500/30',
        emerald: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
        amber:   'bg-amber-500/20 text-amber-200 border-amber-500/30',
        rose:    'bg-rose-500/20 text-rose-200 border-rose-500/30',
        violet:  'bg-violet-500/20 text-violet-200 border-violet-500/30',
        indigo:  'bg-indigo-500/20 text-indigo-200 border-indigo-500/30',
        cyan:    'bg-cyan-500/20 text-cyan-200 border-cyan-500/30',
        purple:  'bg-purple-500/20 text-purple-200 border-purple-500/30',
    }[accentColor] || 'bg-blue-500/20 text-blue-200 border-blue-500/30';

    const subtitleColor = {
        blue:    'text-blue-200',
        emerald: 'text-emerald-200',
        amber:   'text-amber-200',
        rose:    'text-rose-200',
        violet:  'text-violet-200',
        indigo:  'text-indigo-200',
        cyan:    'text-cyan-200',
        purple:  'text-purple-200',
    }[accentColor] || 'text-blue-200';

    /* ── Merged toolbar buttons ──────────────────────────────── */
    const toolbarBtns = [
        ...(onPrint ? [{ icon: <FaPrint size={16} />, label: printText, onClick: onPrint, hoverColor: 'hover:bg-blue-600 hover:text-white' }] : []),
        ...(onEdit  ? [{ icon: <FaEdit  size={16} />, label: editText,  onClick: onEdit,  hoverColor: 'hover:bg-blue-600 hover:text-white' }] : []),
        ...actions,
    ];

    /* ── Resolved image src ──────────────────────────────────── */
    const resolvedImage = imgError
        ? (imageFallback || `https://ui-avatars.com/api/?name=${encodeURIComponent(imageAlt)}&background=1e293b&color=fff&size=200`)
        : image;

    return (
        <>
            {/* ══════════════════════════════════════════════════
                Image Lightbox Modal
            ══════════════════════════════════════════════════ */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setLightboxOpen(false)}
                >
                    <div
                        className="relative max-w-lg w-full"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute -top-4 -right-4 z-10 w-9 h-9 bg-white text-gray-700 rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            <FaTimes />
                        </button>

                        {/* Big image */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                            <img
                                src={resolvedImage}
                                alt={imageAlt}
                                className="w-full object-cover max-h-[70vh]"
                                onError={() => setImgError(true)}
                            />
                            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{imageAlt}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                Main Page
            ══════════════════════════════════════════════════ */}
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-7xl mx-auto">

                    {/* ── Top navigation bar ─────────────────── */}
                    <div className="mb-6 flex justify-between items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-bold uppercase text-xs tracking-widest"
                        >
                            <FaArrowLeft />
                            {backLabel}
                        </button>

                        {toolbarBtns.length > 0 && (
                            <div className="flex gap-2">
                                {toolbarBtns.map((btn, idx) => (
                                    <button
                                        key={idx}
                                        onClick={btn.onClick}
                                        title={btn.label}
                                        className={`p-2 bg-white text-gray-600 rounded-lg transition-all shadow-sm border border-gray-200 ${btn.hoverColor || 'hover:bg-blue-600 hover:text-white'}`}
                                    >
                                        {btn.icon}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Main white card ────────────────────── */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 border border-gray-100">

                        {/* Hero gradient header */}
                        <div className={`bg-gradient-to-r from-gray-900 ${gradientTo} p-8 text-white relative overflow-hidden`}>

                            {/* Large decorative faded bg icon */}
                            {heroIcon && (
                                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 flex items-center justify-end pr-6">
                                    <div className="text-[180px] rotate-12 translate-x-10 -translate-y-4">
                                        {heroIcon}
                                    </div>
                                </div>
                            )}

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                                {/* Left — image (optional) + title/meta */}
                                <div className="flex items-center gap-6">

                                    {/* Entity Image */}
                                    {image && (
                                        <div className="relative group flex-shrink-0">
                                            <div
                                                className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm cursor-pointer"
                                                onClick={() => setLightboxOpen(true)}
                                                title="Click to enlarge"
                                            >
                                                <img
                                                    src={resolvedImage}
                                                    alt={imageAlt}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    onError={() => setImgError(true)}
                                                />
                                            </div>
                                            {/* Expand hint */}
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                                onClick={() => setLightboxOpen(true)}
                                            >
                                                <FaExpand className="text-gray-600 text-[9px]" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Title & meta */}
                                    <div>
                                        {/* Module chip + subtitle + status */}
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${chipColor}`}>
                                                {title}
                                            </span>
                                            {subtitle && (
                                                <span className={`font-medium text-sm ${subtitleColor}`}>
                                                    | {subtitle}
                                                </span>
                                            )}
                                            {statusBadge && (
                                                <div className="scale-95 origin-left">{statusBadge}</div>
                                            )}
                                        </div>

                                        {/* Record ID */}
                                        <h1 className="text-3xl font-black tracking-tight">
                                            {recordId ? `#${recordId}` : title}
                                        </h1>

                                        {/* infoItems row */}
                                        {infoItems.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
                                                {infoItems.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-1.5">
                                                        <span className={`opacity-70 text-xs ${subtitleColor}`}>
                                                            {item.icon}
                                                        </span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 mr-1">
                                                            {item.label}:
                                                        </span>
                                                        <span className="text-sm font-semibold text-white/90">
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right — amount pill */}
                                {(amount !== undefined && amount !== null) && (
                                    <div className="flex gap-4 flex-shrink-0">
                                        <div className="bg-white/10 backdrop-blur-md px-8 py-5 rounded-3xl border border-white/20 shadow-2xl text-center">
                                            <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${subtitleColor}`}>
                                                {amountLabel || 'Total Amount'}
                                            </p>
                                            <p className="text-3xl font-black text-white font-mono">
                                                ৳{amount}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* White content area */}
                        <div className="p-8">
                            {children}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

GenericModuleDetails.propTypes = {
    title:         PropTypes.string.isRequired,
    subtitle:      PropTypes.string,
    recordId:      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    amount:        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    amountLabel:   PropTypes.string,
    statusBadge:   PropTypes.node,
    onPrint:       PropTypes.func,
    onEdit:        PropTypes.func,
    printText:     PropTypes.string,
    editText:      PropTypes.string,
    isLoading:     PropTypes.bool,
    error:         PropTypes.string,
    accentColor:   PropTypes.string,
    children:      PropTypes.node,
    backLabel:     PropTypes.string,
    heroIcon:      PropTypes.node,
    image:         PropTypes.string,
    imageAlt:      PropTypes.string,
    imageFallback: PropTypes.string,
    infoItems:     PropTypes.arrayOf(PropTypes.shape({
        icon:  PropTypes.node,
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })),
    actions: PropTypes.arrayOf(PropTypes.shape({
        icon:       PropTypes.node,
        label:      PropTypes.string,
        onClick:    PropTypes.func,
        hoverColor: PropTypes.string,
    })),
};

export default GenericModuleDetails;