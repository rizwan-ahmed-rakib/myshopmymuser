import React from 'react';

const DamageStockStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`${stat.bgColor} rounded-xl shadow-sm p-4 text-white transform hover:scale-105 transition-transform duration-200`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90 mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.count}</p>
                        </div>
                        <span className="text-3xl opacity-50">{stat.icon}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DamageStockStats;