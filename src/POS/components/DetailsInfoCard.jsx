import React from 'react';
import PropTypes from 'prop-types';

/**
 * DetailsInfoCard
 * Follows PurchaseDetailsPage InfoCard style:
 *   - bg-white rounded-lg p-4 shadow-sm border border-gray-100
 *   - Icon in a colored rounded bg on the left
 *   - Label (tiny uppercase) + Value (bold) stacked
 *
 * Variants:
 *   "default" — horizontal icon + text  (list rows, payment rows)
 *   "simple"  — icon top-right, big value  (stat tiles)
 *   "meta"    — no icon box, just label + bold value  (small detail rows)
 */
const DetailsInfoCard = ({
    icon,
    title,
    value,
    subValue,
    color    = 'blue',
    variant  = 'default',
}) => {

    /* Color map — soft bg + icon tint, matches PurchaseDetailsPage palette */
    const colorMap = {
        blue:    { wrap: 'bg-blue-50 text-blue-600',     border: 'border-blue-100'    },
        emerald: { wrap: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
        green:   { wrap: 'bg-green-50 text-green-600',   border: 'border-green-100'   },
        amber:   { wrap: 'bg-amber-50 text-amber-600',   border: 'border-amber-100'   },
        yellow:  { wrap: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-100'  },
        rose:    { wrap: 'bg-rose-50 text-rose-600',     border: 'border-rose-100'    },
        red:     { wrap: 'bg-red-50 text-red-600',       border: 'border-red-100'     },
        purple:  { wrap: 'bg-purple-50 text-purple-600', border: 'border-purple-100'  },
        indigo:  { wrap: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100'  },
        cyan:    { wrap: 'bg-cyan-50 text-cyan-600',     border: 'border-cyan-100'    },
        gray:    { wrap: 'bg-gray-50 text-gray-600',     border: 'border-gray-100'    },
    };
    const c = colorMap[color] || colorMap.blue;

    /* ── Variant: simple (stat tile — icon top right, value big) ─ */
    if (variant === 'simple') {
        return (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                            {title}
                        </p>
                        <p className="font-black text-lg text-gray-800 leading-tight">
                            {value}
                        </p>
                        {subValue && (
                            <p className="text-[10px] text-gray-400 mt-1 font-medium">{subValue}</p>
                        )}
                    </div>
                    {icon && (
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${c.wrap}`}>
                            {icon}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* ── Variant: meta (no icon box, plain label+value) ──────────── */
    if (variant === 'meta') {
        return (
            <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
                    {title}
                </p>
                <p className="font-bold text-gray-700">
                    {value}
                </p>
                {subValue && (
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{subValue}</p>
                )}
            </div>
        );
    }

    /* ── Variant: default (horizontal icon + label/value) ──────── */
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center border border-gray-100">
            {icon && (
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 ${c.wrap}`}>
                    {icon}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
                    {title}
                </p>
                <p className="font-black text-sm text-gray-800 truncate">
                    {value}
                </p>
                {subValue && (
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium truncate">{subValue}</p>
                )}
            </div>
        </div>
    );
};

DetailsInfoCard.propTypes = {
    icon:     PropTypes.node,
    title:    PropTypes.string.isRequired,
    value:    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    subValue: PropTypes.string,
    color:    PropTypes.string,
    variant:  PropTypes.oneOf(['default', 'simple', 'meta']),
};

export default DetailsInfoCard;