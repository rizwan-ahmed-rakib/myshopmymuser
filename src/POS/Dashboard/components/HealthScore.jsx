// // src/POS/Dashboard/components/HealthScore.jsx
// import React, {useState} from 'react';
// import {ChevronDown, ChevronUp, Info} from 'lucide-react';
// import {Card, Skeleton, SectionTitle} from './Shared';
// import {HEALTH_LABELS} from '../utils/dashboardUtils';
//
// const CircularProgress = ({score, color, size = 100}) => {
//     const radius = (size - 12) / 2;
//     const circumference = 2 * Math.PI * radius;
//     const offset = circumference - (score / 100) * circumference;
//
//     return (
//         <div style={{position: 'relative', width: size, height: size}}>
//             <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
//                 <circle
//                     cx={size / 2} cy={size / 2} r={radius}
//                     stroke="#f1f5f9" strokeWidth="8" fill="none"
//                 />
//                 <circle
//                     cx={size / 2} cy={size / 2} r={radius}
//                     stroke={color} strokeWidth="8" fill="none"
//                     strokeLinecap="round"
//                     strokeDasharray={circumference}
//                     strokeDashoffset={offset}
//                     style={{transition: 'stroke-dashoffset 1s ease-out'}}
//                 />
//             </svg>
//             <div style={{
//                 position: 'absolute', inset: 0,
//                 display: 'flex', flexDirection: 'column',
//                 alignItems: 'center', justifyContent: 'center',
//             }}>
//                 <div style={{
//                     fontSize: 26, fontWeight: 800, color, lineHeight: 1,
//                 }}>
//                     {score}
//                 </div>
//                 <div style={{
//                     fontSize: 10, fontWeight: 700, color: '#94a3b8',
//                     textTransform: 'uppercase', letterSpacing: '0.05em',
//                     marginTop: 2,
//                 }}>
//                     / 100
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const HealthScore = ({loading, health}) => {
//     const [expanded, setExpanded] = useState(false);
//
//     if (loading) {
//         return <Card><Skeleton h={180}/></Card>;
//     }
//
//     if (!health) return null;
//
//     return (
//         <Card>
//             <SectionTitle
//                 icon="💚"
//                 action={
//                     <button
//                         onClick={() => setExpanded((v) => !v)}
//                         style={{
//                             background: 'none', border: 'none',
//                             color: '#0ea5e9', fontSize: 11, fontWeight: 700,
//                             cursor: 'pointer', display: 'flex',
//                             alignItems: 'center', gap: 3,
//                         }}
//                     >
//                         {expanded ? <>Hide <ChevronUp size={11}/></> : <>Details <ChevronDown size={11}/></>}
//                     </button>
//                 }
//             >
//                 Business Health Score
//             </SectionTitle>
//
//             <div style={{
//                 display: 'flex', alignItems: 'center', gap: 20,
//                 padding: '8px 0',
//             }}>
//                 <CircularProgress score={health.score} color={health.color}/>
//
//                 <div style={{flex: 1}}>
//                     <div style={{
//                         fontSize: 20, fontWeight: 800,
//                         color: health.color, letterSpacing: '-0.02em',
//                     }}>
//                         {health.grade}
//                     </div>
//                     <div style={{
//                         fontSize: 12, color: '#64748b',
//                         marginTop: 4, lineHeight: 1.5,
//                     }}>
//                         {health.isBrandNew
//                             ? '🎉 স্বাগতম! ব্যবসা শুরু করতে প্রথমে বিক্রয়, পণ্য যোগ করুন'
//                             : health.score >= 80
//                                 ? 'আপনার ব্যবসা দুর্দান্ত অবস্থায় আছে!'
//                                 : health.score >= 65
//                                     ? 'ব্যবসা ভালো চলছে, কিছু improvement করলে আরও ভালো হবে'
//                                     : health.score >= 50
//                                         ? 'মাঝারি অবস্থা — মনোযোগ প্রয়োজন'
//                                         : 'কয়েকটি গুরুত্বপূর্ণ বিষয়ে দ্রুত পদক্ষেপ নিন'}
//                     </div>
//                 </div>
//             </div>
//
//             {/*{expanded && (*/}
//             {/*    <div style={{*/}
//             {/*        marginTop: 14, paddingTop: 14,*/}
//             {/*        borderTop: '1px solid #f1f5f9',*/}
//             {/*        display: 'flex', flexDirection: 'column', gap: 8,*/}
//             {/*    }}>*/}
//             {/*        {Object.entries(health.breakdown).map(([key, val]) => {*/}
//             {/*            const pct = Math.round(val);*/}
//             {/*            const color = val >= 70 ? '#10b981'*/}
//             {/*                : val >= 50 ? '#f59e0b'*/}
//             {/*                : '#ef4444';*/}
//             {/*            return (*/}
//             {/*                <div key={key}>*/}
//             {/*                    <div style={{*/}
//             {/*                        display: 'flex', justifyContent: 'space-between',*/}
//             {/*                        fontSize: 11.5, marginBottom: 3,*/}
//             {/*                    }}>*/}
//             {/*                        <span style={{ color: '#475569', fontWeight: 600 }}>*/}
//             {/*                            {HEALTH_LABELS[key] || key}*/}
//             {/*                        </span>*/}
//             {/*                        <span style={{ color, fontWeight: 800 }}>*/}
//             {/*                            {pct}*/}
//             {/*                        </span>*/}
//             {/*                    </div>*/}
//             {/*                    <div style={{*/}
//             {/*                        height: 5, background: '#f1f5f9',*/}
//             {/*                        borderRadius: 3, overflow: 'hidden',*/}
//             {/*                    }}>*/}
//             {/*                        <div style={{*/}
//             {/*                            height: '100%',*/}
//             {/*                            width: `${pct}%`,*/}
//             {/*                            background: color,*/}
//             {/*                            borderRadius: 3,*/}
//             {/*                            transition: 'width .8s ease',*/}
//             {/*                        }} />*/}
//             {/*                    </div>*/}
//             {/*                </div>*/}
//             {/*            );*/}
//             {/*        })}*/}
//             {/*    </div>*/}
//             {/*)}*/}
//
//
//             {expanded && (
//                 <div style={{
//                     marginTop: 14, paddingTop: 14,
//                     borderTop: '1px solid #f1f5f9',
//                     display: 'flex', flexDirection: 'column', gap: 8,
//                 }}>
//                     {Object.entries(health.breakdown).map(([key, val]) => {
//                         const pct = Math.round(val);
//                         const isMissing = health.isNew?.[key];   // ✅
//                         const color = isMissing
//                             ? '#cbd5e1'                            // gray
//                             : val >= 70 ? '#10b981'
//                                 : val >= 50 ? '#f59e0b'
//                                     : '#ef4444';
//                         return (
//                             <div key={key}>
//                                 <div style={{
//                                     display: 'flex', justifyContent: 'space-between',
//                                     fontSize: 11.5, marginBottom: 3,
//                                 }}>
//                         <span style={{color: '#475569', fontWeight: 600}}>
//                             {HEALTH_LABELS[key] || key}
//                         </span>
//                                     <span style={{color, fontWeight: 800}}>
//                             {isMissing ? 'N/A' : pct} {/* ✅ */}
//                         </span>
//                                 </div>
//                                 <div style={{
//                                     height: 5, background: '#f1f5f9',
//                                     borderRadius: 3, overflow: 'hidden',
//                                 }}>
//                                     <div style={{
//                                         height: '100%',
//                                         width: `${isMissing ? 0 : pct}%`,   // ✅ 0 width
//                                         background: color,
//                                         borderRadius: 3,
//                                         transition: 'width .8s ease',
//                                     }}/>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//
//
//         </Card>
//     );
// };
//
// export default HealthScore;


// src/POS/Dashboard/components/HealthScore.jsx
import React, {useState} from 'react';
import {ChevronDown, ChevronUp} from 'lucide-react';
import {Card, Skeleton, SectionTitle} from './Shared';
import {HEALTH_LABELS} from '../utils/dashboardUtils';

const CircularProgress = ({score, color, size = 100}) => {
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div style={{position: 'relative', width: size, height: size}}>
            <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke="#f1f5f9" strokeWidth="8" fill="none"
                />
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={color} strokeWidth="8" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{transition: 'stroke-dashoffset 1s ease-out'}}
                />
            </svg>
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
            }}>
                <div style={{
                    fontSize: 26, fontWeight: 800, color, lineHeight: 1,
                }}>
                    {score}
                </div>
                <div style={{
                    fontSize: 10, fontWeight: 700, color: '#94a3b8',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    marginTop: 2,
                }}>
                    / 100
                </div>
            </div>
        </div>
    );
};

const HealthScore = ({loading, health}) => {
    const [expanded, setExpanded] = useState(false);

    if (loading) {
        return <Card><Skeleton h={180}/></Card>;
    }

    if (!health) return null;

    // ✅ নতুন business হলে সম্পূর্ণ ভিন্ন UI
    if (health.isBrandNew) {
        return (
            <Card>
                <SectionTitle icon="💚">Business Health Score</SectionTitle>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 0',
                }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: 16,
                        background: '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, flexShrink: 0,
                    }}>
                        🌱
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{fontSize: 15, fontWeight: 800, color: '#0f172a'}}>
                            এখনো কোনো ডেটা নেই
                        </div>
                        <div style={{
                            fontSize: 12, color: '#64748b',
                            marginTop: 3, lineHeight: 1.5,
                        }}>
                            প্রথম বিক্রয়, পণ্য ও খরচ যোগ করলে এখানে আপনার ব্যবসার স্বাস্থ্য স্কোর দেখা যাবে
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <SectionTitle
                icon="💚"
                action={
                    <button
                        onClick={() => setExpanded((v) => !v)}
                        style={{
                            background: 'none', border: 'none',
                            color: '#0ea5e9', fontSize: 11, fontWeight: 700,
                            cursor: 'pointer', display: 'flex',
                            alignItems: 'center', gap: 3,
                        }}
                    >
                        {expanded
                            ? <>Hide <ChevronUp size={11}/></>
                            : <>Details <ChevronDown size={11}/></>}
                    </button>
                }
            >
                Business Health Score
            </SectionTitle>

            {/* Hero section */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 20,
                padding: '8px 0',
            }}>
                <CircularProgress score={health.score} color={health.color}/>

                <div style={{flex: 1}}>
                    <div style={{
                        fontSize: 20, fontWeight: 800,
                        color: health.color, letterSpacing: '-0.02em',
                    }}>
                        {health.grade}
                    </div>
                    <div style={{
                        fontSize: 12, color: '#64748b',
                        marginTop: 4, lineHeight: 1.5,
                    }}>
                        {health.isBrandNew
                            ? '🎉 স্বাগতম! ব্যবসা শুরু করতে প্রথমে বিক্রয়, পণ্য যোগ করুন'
                            : health.score >= 80
                                ? 'আপনার ব্যবসা দুর্দান্ত অবস্থায় আছে!'
                                : health.score >= 65
                                    ? 'ব্যবসা ভালো চলছে, কিছু improvement করলে আরও ভালো হবে'
                                    : health.score >= 50
                                        ? 'মাঝারি অবস্থা — মনোযোগ প্রয়োজন'
                                        : 'কয়েকটি গুরুত্বপূর্ণ বিষয়ে দ্রুত পদক্ষেপ নিন'}
                    </div>
                </div>
            </div>

            {/* Breakdown */}
            {expanded && (
                <div style={{
                    marginTop: 14, paddingTop: 14,
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                    {Object.entries(health.breakdown).map(([key, val]) => {
                        const pct = Math.round(val);
                        const isMissing = health.isNew?.[key];
                        const color = isMissing
                            ? '#cbd5e1'
                            : val >= 70 ? '#10b981'
                                : val >= 50 ? '#f59e0b'
                                    : '#ef4444';

                        return (
                            <div key={key}>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    fontSize: 11.5, marginBottom: 3,
                                }}>
                                    <span style={{color: '#475569', fontWeight: 600}}>
                                        {HEALTH_LABELS[key] || key}
                                    </span>
                                    <span style={{color, fontWeight: 800}}>
                                        {isMissing ? 'N/A' : pct}
                                    </span>
                                </div>
                                <div style={{
                                    height: 5, background: '#f1f5f9',
                                    borderRadius: 3, overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${isMissing ? 0 : pct}%`,
                                        background: color,
                                        borderRadius: 3,
                                        transition: 'width .8s ease',
                                    }}/>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

export default HealthScore;