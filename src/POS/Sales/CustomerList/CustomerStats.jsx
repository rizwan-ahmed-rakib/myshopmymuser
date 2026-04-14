import React from "react";

const CustomerStats = ({ stats }) => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <div key={index} className={`${stat.bgColor} ${stat.textColor} rounded-lg shadow-sm border-0`}>
                        <div className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90 mb-1">{stat.title}</p>
                                <h4 className="text-2xl font-bold">{stat.count}</h4>
                            </div>
                            <div>
                <span className={`flex items-center justify-center w-12 h-12 ${stat.iconBg} rounded-full text-lg`}>
                  {stat.icon}
                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
);

export default CustomerStats;
