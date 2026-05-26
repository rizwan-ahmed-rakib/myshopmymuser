import React from 'react';

/**
 * StatCards - Standardized statistics display for module summaries.
 * @param {Array} stats - Array of objects: { title, count, bgColor, icon }
 */
const StatCards = ({ stats }) => {
    if (!stats || stats.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div 
                    key={index} 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow group overflow-hidden relative"
                >
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                {stat.title}
                            </p>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight">
                                {stat.count}
                            </h3>
                        </div>
                        <div className={`${stat.bgColor || 'bg-blue-600'} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                    </div>
                    {/* Decorative background element */}
                    <div className={`absolute -right-4 -bottom-4 w-20 h-20 ${stat.bgColor || 'bg-blue-600'} opacity-5 rounded-full`}></div>
                </div>
            ))}
        </div>
    );
};

export default StatCards;
