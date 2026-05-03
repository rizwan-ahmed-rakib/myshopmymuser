import React from 'react';

const CustomerDueCollectionStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110`}></div>
                    
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-black text-gray-900">{stat.count}</h3>
                        </div>
                        <div className={`${stat.bgColor} text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50 text-lg`}>
                            {stat.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomerDueCollectionStats;
