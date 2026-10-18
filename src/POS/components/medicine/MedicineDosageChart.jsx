// components/medicine/MedicineDosageChart.jsx
import React from "react";

const SLOT_ORDER = ["morning", "midMorning", "noon", "afternoon", "evening", "night"];

/* ───── SVG Icons (same as before) ───── */
const MorningIcon = ({size = 34}) => (
    <svg viewBox="0 0 100 60" width={size} height={(size * 60) / 100}>
        <line x1="0" y1="42" x2="100" y2="42" stroke="#111" strokeWidth="1.4"/>
        <path d="M 30 42 A 20 20 0 0 1 70 42 Z" fill="#FFB300" stroke="#111" strokeWidth="1.4"/>
        {[-60, -40, -20, 0, 20, 40, 60].map((a) => {
            const rad = (a * Math.PI) / 180;
            const x1 = 50 + Math.sin(rad) * 22;
            const y1 = 42 - Math.cos(rad) * 22;
            const x2 = 50 + Math.sin(rad) * 30;
            const y2 = 42 - Math.cos(rad) * 30;
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFB300" strokeWidth="2.2"
                         strokeLinecap="round"/>;
        })}
        <path d="M 12 14 Q 15 11 18 14 Q 15 12 12 14" fill="none" stroke="#111" strokeWidth="1.3"/>
        <path d="M 18 14 Q 21 11 24 14 Q 21 12 18 14" fill="none" stroke="#111" strokeWidth="1.3"/>
        <path d="M 78 20 Q 80 18 82 20 Q 80 19 78 20" fill="none" stroke="#111" strokeWidth="1.3"/>
        <path d="M 82 20 Q 84 18 86 20 Q 84 19 82 20" fill="none" stroke="#111" strokeWidth="1.3"/>
    </svg>
);

const NoonIcon = ({size = 34}) => (
    <svg viewBox="0 0 100 60" width={size} height={(size * 60) / 100}>
        <circle cx="78" cy="18" r="9" fill="#FFA000" stroke="#111" strokeWidth="1.4"/>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const rad = (a * Math.PI) / 180;
            const x1 = 78 + Math.cos(rad) * 12;
            const y1 = 18 + Math.sin(rad) * 12;
            const x2 = 78 + Math.cos(rad) * 16;
            const y2 = 18 + Math.sin(rad) * 16;
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFA000" strokeWidth="2"
                         strokeLinecap="round"/>;
        })}
        <path d="M 10 42 Q 35 15 60 42 Z" fill="#E53935" stroke="#111" strokeWidth="1.4"/>
        <line x1="35" y1="42" x2="35" y2="55" stroke="#111" strokeWidth="1.4"/>
        <path d="M 35 55 Q 40 58 42 55" fill="none" stroke="#111" strokeWidth="1.4"/>
        <line x1="20" y1="46" x2="19" y2="49" stroke="#2196F3" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="40" y1="46" x2="39" y2="49" stroke="#2196F3" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="55" y1="46" x2="54" y2="49" stroke="#2196F3" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
);

const NightIcon = ({size = 34}) => (
    <svg viewBox="0 0 100 60" width={size} height={(size * 60) / 100}>
        <path d="M 62 12 A 14 14 0 0 0 62 40 A 10 10 0 0 1 62 12 Z" fill="#FFD54F" stroke="#111" strokeWidth="1.4"/>
        <path d="M 25 15 l 2 4 4 1 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -1 z" fill="#FFD54F" stroke="#111" strokeWidth="1"/>
        <path d="M 82 30 l 1.5 3 3 0.7 -2 2.3 0.6 3 -3 -1.5 -3 1.5 0.6 -3 -2 -2.3 3 -0.7 z" fill="#FFD54F" stroke="#111"
              strokeWidth="1"/>
    </svg>
);

const SlotIcon = ({slot, size}) => {
    if (slot === "morning" || slot === "midMorning") return <MorningIcon size={size}/>;
    if (slot === "noon" || slot === "afternoon") return <NoonIcon size={size}/>;
    return <NightIcon size={size}/>;
};

const BeforeMealIcon = ({size = 26}) => (
    <svg viewBox="0 0 60 40" width={size} height={(size * 40) / 60}>
        <ellipse cx="30" cy="24" rx="22" ry="8" fill="#fff" stroke="#111" strokeWidth="1.6"/>
        <ellipse cx="30" cy="24" rx="16" ry="5" fill="none" stroke="#111" strokeWidth="0.9"/>
    </svg>
);

const AfterMealIcon = ({size = 26}) => (
    <svg viewBox="0 0 60 40" width={size} height={(size * 40) / 60}>
        <ellipse cx="30" cy="26" rx="22" ry="9" fill="#fff" stroke="#111" strokeWidth="1.6"/>
        <ellipse cx="30" cy="26" rx="16" ry="6" fill="none" stroke="#111" strokeWidth="0.9"/>
        <path d="M 16 24 Q 22 12 30 12 Q 38 12 44 24 Z" fill="#FFB74D" stroke="#111" strokeWidth="1.4"/>
        <ellipse cx="48" cy="12" rx="3" ry="4" fill="#B0BEC5" stroke="#111" strokeWidth="1"/>
        <line x1="48" y1="16" x2="48" y2="30" stroke="#111" strokeWidth="1.4"/>
    </svg>
);

const Dots = ({count, r = 5, width = 60}) => {
    const gap = r * 3;
    return (
        <svg viewBox={`0 0 ${width} 20`} width={width} height="20">
            {[...Array(count)].map((_, i) => (
                <circle
                    key={i}
                    cx={width / 2 + (i - (count - 1) / 2) * gap}
                    cy="10"
                    r={r}
                    fill="#111"
                />
            ))}
        </svg>
    );
};

/* ───── MAIN COMPONENT ───── */
// const MedicineDosageChart = ({ config, size = "lg", className = "" }) => {
//     if (!config) return null;
//
//     const { slots = [], stripImage = null, medicineName = "", note = "" } = config;
//
//     const u = size === "sm" ? 0.85 : 1;
//
//     // 🔥 Compressed dimensions
//     const STRIP_W = stripImage ? 78 * u : 0;
//     const SLOT_W = 66 * u;
//     const ROW_H = 58 * u;
//     const LABEL_H = 18 * u;
//     const totalW = STRIP_W + SLOT_W * slots.length;
//     const totalH = ROW_H + LABEL_H;
//
//     const timeIconSize = 32 * u;
//     const mealIconSize = 22 * u;
//
//     return (
//         <svg
//             viewBox={`0 0 ${totalW} ${totalH}`}
//             width="100%"
//             height="100%"
//             preserveAspectRatio="xMidYMid meet"
//             xmlns="http://www.w3.org/2000/svg"
//             className={className}
//             style={{ display: "block", background: "#fff" }}
//         >
//             <rect x="1" y="1" width={totalW - 2} height={totalH - 2}
//                   fill="white" stroke="#111" strokeWidth="2" />
//
//             {stripImage && (
//                 <>
//                     <rect x="0" y="0" width={STRIP_W} height={totalH}
//                           fill="#F9FAFB" stroke="#111" strokeWidth="1.8" />
//                     <image
//                         href={stripImage}
//                         xlinkHref={stripImage}
//                         x={STRIP_W * 0.05}
//                         y={ROW_H * 0.05}
//                         width={STRIP_W * 0.9}
//                         height={ROW_H * 0.9}
//                         preserveAspectRatio="xMidYMid meet"
//                     />
//                 </>
//             )}
//
//             {slots.map((slot, idx) => {
//                 const x0 = STRIP_W + idx * SLOT_W;
//                 return (
//                     <g key={idx}>
//                         <line x1={x0} y1="0" x2={x0} y2={totalH}
//                               stroke="#111" strokeWidth="1.8" />
//
//                         {/* Time icon */}
//                         <foreignObject x={x0} y={ROW_H * 0.06} width={SLOT_W} height={ROW_H * 0.38}>
//                             <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//                                 <SlotIcon slot={slot.slot} size={timeIconSize} />
//                             </div>
//                         </foreignObject>
//
//                         {/* Dots */}
//                         <foreignObject x={x0} y={ROW_H * 0.46} width={SLOT_W} height={ROW_H * 0.22}>
//                             <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//                                 <Dots count={slot.dots} r={5 * u} width={SLOT_W * 0.9} />
//                             </div>
//                         </foreignObject>
//
//                         {/* Meal icon */}
//                         <foreignObject x={x0} y={ROW_H * 0.72} width={SLOT_W} height={ROW_H * 0.26}>
//                             <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//                                 {slot.beforeMeal
//                                     ? <BeforeMealIcon size={mealIconSize} />
//                                     : <AfterMealIcon size={mealIconSize} />
//                                 }
//                             </div>
//                         </foreignObject>
//                     </g>
//                 );
//             })}
//
//             {/* Bottom label */}
//             <rect x="0" y={ROW_H} width={totalW} height={LABEL_H}
//                   fill="#F0FDF4" stroke="#111" strokeWidth="1.8" />
//             <text
//                 x={totalW / 2}
//                 y={ROW_H + LABEL_H / 2}
//                 textAnchor="middle"
//                 dominantBaseline="middle"
//                 fontSize={9.5 * u}
//                 fontWeight="900"
//                 fontFamily="Arial, sans-serif"
//                 fill="#065f46"
//             >
//                 {medicineName || "ঔষধ"}
//                 {note && ` • ${note}`}
//             </text>
//         </svg>
//     );
// };

const MedicineDosageChart = ({config, size = "lg", className = ""}) => {
    if (!config) return null;

    const {
        slots = [],
        stripImage = null,
        medicineName = "",
        note = "",
        durationDays = 0,          // 🆕
        durationLanguage = "bn",   // 🆕 "bn" | "en"
    } = config;

    const u = size === "sm" ? 0.85 : 1;

    const STRIP_W = stripImage ? 78 * u : 0;
    const SLOT_W = 66 * u;
    const ROW_H = 58 * u;
    const LABEL_H = 18 * u;

    // 🆕 Duration row dimensions
    const hasDuration = durationDays > 0;
    const DAY_BOX_W = 20 * u;
    const DAY_BOX_H = 20 * u;
    const DAYS_PER_ROW = 10;   // এক row-তে max ১০ দিন
    const dayRows = hasDuration ? Math.ceil(durationDays / DAYS_PER_ROW) : 0;
    const DURATION_H = hasDuration ? 14 * u + dayRows * (DAY_BOX_H + 4) + 6 : 0;

    const totalW = STRIP_W + SLOT_W * slots.length;
    const totalH = ROW_H + LABEL_H + DURATION_H;

    const timeIconSize = 32 * u;
    const mealIconSize = 22 * u;

    // Bangla numeral converter
    const toBanglaNum = (n) => {
        const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
        return String(n).split("").map((d) => bnDigits[Number(d)] || d).join("");
    };

    const dayLabel = (n) =>
        durationLanguage === "bn" ? toBanglaNum(n) : String(n);

    return (
        <svg
            viewBox={`0 0 ${totalW} ${totalH}`}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{display: "block", background: "#fff"}}
        >
            {/* Outer border */}
            <rect x="1" y="1" width={totalW - 2} height={totalH - 2}
                  fill="white" stroke="#111" strokeWidth="2"/>

            {/* ── Strip image column ── */}
            {stripImage && (
                <>
                    <rect x="0" y="0" width={STRIP_W} height={ROW_H + LABEL_H}
                          fill="#F9FAFB" stroke="#111" strokeWidth="1.8"/>
                    <image
                        href={stripImage}
                        xlinkHref={stripImage}
                        x={STRIP_W * 0.05}
                        y={ROW_H * 0.05}
                        width={STRIP_W * 0.9}
                        height={ROW_H * 0.9}
                        preserveAspectRatio="xMidYMid meet"
                    />
                </>
            )}

            {/* ── Slot columns ── */}
            {slots.map((slot, idx) => {
                const x0 = STRIP_W + idx * SLOT_W;
                return (
                    <g key={idx}>
                        <line x1={x0} y1="0" x2={x0} y2={ROW_H + LABEL_H}
                              stroke="#111" strokeWidth="1.8"/>

                        {/* Time icon */}
                        <foreignObject x={x0} y={ROW_H * 0.06} width={SLOT_W} height={ROW_H * 0.38}>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%"
                            }}>
                                <SlotIcon slot={slot.slot} size={timeIconSize}/>
                            </div>
                        </foreignObject>

                        {/* Dots */}
                        <foreignObject x={x0} y={ROW_H * 0.46} width={SLOT_W} height={ROW_H * 0.22}>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%"
                            }}>
                                <Dots count={slot.dots} r={5 * u} width={SLOT_W * 0.9}/>
                            </div>
                        </foreignObject>

                        {/* Meal icon */}
                        <foreignObject x={x0} y={ROW_H * 0.72} width={SLOT_W} height={ROW_H * 0.26}>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%"
                            }}>
                                {slot.beforeMeal
                                    ? <BeforeMealIcon size={mealIconSize}/>
                                    : <AfterMealIcon size={mealIconSize}/>
                                }
                            </div>
                        </foreignObject>
                    </g>
                );
            })}

            {/* ── Bottom label bar (medicine name) ── */}
            <rect x="0" y={ROW_H} width={totalW} height={LABEL_H}
                  fill="#F0FDF4" stroke="#111" strokeWidth="1.8"/>
            <text
                x={totalW / 2}
                y={ROW_H + LABEL_H / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9.5 * u}
                fontWeight="900"
                fontFamily="Arial, sans-serif"
                fill="#065f46"
            >
                {medicineName || "ঔষধ"}
                {note && ` • ${note}`}
            </text>

            {/* ── 🆕 Duration Row (day counter with checkboxes) ── */}
            {hasDuration && (
                <g>
                    {/* Separator */}
                    <line x1="0" y1={ROW_H + LABEL_H} x2={totalW} y2={ROW_H + LABEL_H}
                          stroke="#111" strokeWidth="1.5" strokeDasharray="4 3"/>

                    {/* Header text */}
                    <text
                        x={6 * u}
                        y={ROW_H + LABEL_H + 9 * u}
                        fontSize={8 * u}
                        fontWeight="900"
                        fontFamily="Arial, sans-serif"
                        fill="#1d4ed8"
                    >
                        📅 {durationLanguage === "bn"
                        ? `কোর্স: ${toBanglaNum(durationDays)} দিন (প্রতিদিন টিক দিন)`
                        : `Course: ${durationDays} Days (Tick daily)`}
                    </text>

                    {/* Day checkboxes — multiple rows */}
                    {Array.from({length: dayRows}).map((_, rowIdx) => {
                        const start = rowIdx * DAYS_PER_ROW;
                        const end = Math.min(start + DAYS_PER_ROW, durationDays);
                        const itemsInRow = end - start;
                        // center the boxes horizontally within chart width
                        const totalBoxesW = itemsInRow * (DAY_BOX_W + 2 * u) - 2 * u;
                        const startX = (totalW - totalBoxesW) / 2;
                        const rowY = ROW_H + LABEL_H + 14 * u + rowIdx * (DAY_BOX_H + 4);

                        return Array.from({length: itemsInRow}).map((_, i) => {
                            const dayNum = start + i + 1;
                            const bx = startX + i * (DAY_BOX_W + 2 * u);
                            return (
                                <g key={`day-${dayNum}`}>
                                    {/* Checkbox square */}
                                    <rect
                                        x={bx}
                                        y={rowY}
                                        width={DAY_BOX_W}
                                        height={DAY_BOX_H}
                                        fill="#fff"
                                        stroke="#111"
                                        strokeWidth="1.4"
                                        rx="2"
                                    />
                                    {/* Day number centered */}
                                    <text
                                        x={bx + DAY_BOX_W / 2}
                                        y={rowY + DAY_BOX_H / 2}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize={9 * u}
                                        fontWeight="900"
                                        fontFamily="Arial, sans-serif"
                                        fill="#111"
                                    >
                                        {dayLabel(dayNum)}
                                    </text>
                                </g>
                            );
                        });
                    })}
                </g>
            )}
        </svg>
    );
};

export const buildDefaultSlots = (timesPerDay) => {
    const patterns = {
        1: ["morning"],
        2: ["morning", "night"],
        3: ["morning", "noon", "night"],
        4: ["morning", "noon", "evening", "night"],
        6: ["morning", "midMorning", "noon", "afternoon", "evening", "night"],
    };
    const list = patterns[timesPerDay] || patterns[3];
    return list.map((slot) => ({slot, beforeMeal: true, dots: 1}));
};

export default MedicineDosageChart;