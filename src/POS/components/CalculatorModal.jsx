// import React, { useState, useEffect, useRef } from "react";
// import { X } from "lucide-react";
//
// const CalculatorModal = ({ isOpen, onClose }) => {
//     const [input, setInput] = useState("");
//     const [result, setResult] = useState("");
//
//     // input এর লেটেস্ট ভ্যালু ট্র্যাক করার জন্য ref
//     const inputRef = useRef(input);
//     useEffect(() => {
//         inputRef.current = input;
//     }, [input]);
//
//     useEffect(() => {
//         if (!isOpen) return;
//
//         const handleKeyDown = (e) => {
//             const currentInput = inputRef.current;
//             if (/[0-9\+\-\*\/\.\%]/.test(e.key)) {
//                 e.preventDefault();
//                 setInput(currentInput + e.key);
//             } else if (e.key === "Enter" || e.key === "=") {
//                 e.preventDefault();
//                 calculateResult(currentInput);
//             } else if (e.key === "Backspace") {
//                 e.preventDefault();
//                 setInput(currentInput.slice(0, -1));
//             } else if (e.key === "Escape") {
//                 e.preventDefault();
//                 onClose();
//             }
//         };
//
//         window.addEventListener("keydown", handleKeyDown);
//         return () => window.removeEventListener("keydown", handleKeyDown);
//     }, [isOpen, onClose]);
//
//     if (!isOpen) return null;
//
//     const handleButtonClick = (value) => {
//         setInput((prev) => prev + value);
//     };
//
//     const handleClear = () => {
//         setInput("");
//         setResult("");
//     };
//
//     // মুছে যাওয়া handleBackspace ফাংশনটি আবার যোগ করা হলো
//     const handleBackspace = () => {
//         setInput((prev) => prev.slice(0, -1));
//     };
//
//     const calculateResult = (customInput) => {
//         const targetInput = customInput !== undefined && typeof customInput === "string" ? customInput : input;
//         try {
//             if (!targetInput) return;
//             const sanitizedInput = targetInput.replace(/x/g, "*");
//
//             // Standard BODMAS/Precedence অনুসারেই হিসাব হবে
//             const evalResult = eval(sanitizedInput);
//
//             setResult(Number(evalResult).toFixed(2).replace(/\.00$/, ""));
//         } catch (error) {
//             setResult("Error");
//         }
//     }; // <-- এখানে ব্র্যাকেটটি মিসিং ছিল
//
//     const buttons = [
//         { label: "C", action: handleClear, className: "bg-rose-100 text-rose-600 hover:bg-rose-200" },
//         { label: "⌫", action: handleBackspace, className: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
//         { label: "%", action: () => handleButtonClick("%"), className: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
//         { label: "/", action: () => handleButtonClick("/"), className: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 font-bold" },
//
//         { label: "7", action: () => handleButtonClick("7"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
//         { label: "8", action: () => handleButtonClick("8"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
//         { label: "9", action: () => handleButtonClick("9"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
//         { label: "x", action: () => handleButtonClick("*"), className: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 font-bold" },
//
//         { label: "4", action: () => handleButtonClick("4"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
//         { label: "5", action: () => handleButtonClick("5"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
//         { label: "6", action: () => handleButtonClick("6"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
//         { label: "-", action: () => handleButtonClick("-"), className: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 font-bold" },
//
//         { label: "1", action: () => handleButtonClick("1"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
//         { label: "2", action: () => handleButtonClick("2"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
//         { label: "3", action: () => handleButtonClick("3"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
//         { label: "+", action: () => handleButtonClick("+"), className: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 font-bold" },
//
//         { label: "0", action: () => handleButtonClick("0"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100 col-span-2" },
//         { label: ".", action: () => handleButtonClick("."), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
//         { label: "=", action: () => calculateResult(), className: "bg-emerald-500 text-white hover:bg-emerald-600 font-bold shadow-sm shadow-emerald-200" },
//     ];
//
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
//             <div className="absolute inset-0" onClick={onClose} />
//
//             <div className="relative w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex flex-col gap-3 transition-transform scale-100 select-none">
//                 {/* Header */}
//                 <div className="flex justify-between items-center pb-1 border-b border-slate-50">
//                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
//                         <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
//                         POS Calculator
//                     </span>
//                     <button
//                         onClick={onClose}
//                         className="w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
//                     >
//                         <X size={14} />
//                     </button>
//                 </div>
//
//                 {/* Display Screen */}
//                 <div className="bg-slate-900 rounded-xl p-3 text-right flex flex-col justify-end min-h-[76px] shadow-inner font-mono relative overflow-hidden">
//                     <div className="text-slate-400 text-xs truncate tracking-wide mb-1 min-h-[16px]">
//                         {input || "0"}
//                     </div>
//                     <div className="text-white text-2xl font-bold truncate tracking-tight">
//                         {result || "0"}
//                     </div>
//                 </div>
//
//                 {/* Keypad Buttons Grid */}
//                 <div className="grid grid-cols-4 gap-2 text-sm font-semibold">
//                     {buttons.map((btn, index) => (
//                         <button
//                             key={index}
//                             onClick={btn.action}
//                             className={`h-11 flex items-center justify-center rounded-xl transition-all duration-100 active:scale-95 ${btn.label === "0" ? "col-span-2" : ""} ${btn.className}`}
//                         >
//                             {btn.label}
//                         </button>
//                     ))}
//                 </div>
//
//                 <div className="text-[10px] text-center text-slate-400 font-medium pt-1">
//                     💡 Keyboard supports: Numbers, +, -, *, /, Enter, Backspace
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default CalculatorModal;



import React, { useState, useEffect, useRef } from "react";
import { X, ToggleLeft, ToggleRight } from "lucide-react"; // মোড সুইচের আইকন

const CalculatorModal = ({ isOpen, onClose }) => {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [calcMode, setCalcMode] = useState("general"); // 'general' (Sequential) অথবা 'standard' (BODMAS)

    const inputRef = useRef(input);
    useEffect(() => {
        inputRef.current = input;
    }, [input]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            const currentInput = inputRef.current;
            if (/[0-9\+\-\*\/\.\%]/.test(e.key)) {
                e.preventDefault();
                setInput(currentInput + e.key);
            } else if (e.key === "Enter" || e.key === "=") {
                e.preventDefault();
                calculateResult(currentInput);
            } else if (e.key === "Backspace") {
                e.preventDefault();
                setInput(currentInput.slice(0, -1));
            } else if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleButtonClick = (value) => {
        setInput((prev) => prev + value);
    };

    const handleClear = () => {
        setInput("");
        setResult("");
    };

    const handleBackspace = () => {
        setInput((prev) => prev.slice(0, -1));
    };

    // Sequential / General Calculation Parser
    const parseSequential = (str) => {
        // সংখ্যা এবং অপারেটরগুলোকে আলাদা করার জন্য রেজেক্স (Regex)
        const tokens = str.match(/(\d+\.?\d*)|[\+\-\*\/%]/g);
        if (!tokens) return 0;

        let total = parseFloat(tokens[0]);

        for (let i = 1; i < tokens.length; i += 2) {
            const operator = tokens[i];
            const nextValue = parseFloat(tokens[i + 1]);

            if (isNaN(nextValue)) continue;

            if (operator === "+") total += nextValue;
            else if (operator === "-") total -= nextValue;
            else if (operator === "*") total *= nextValue;
            else if (operator === "/") total /= nextValue;
            else if (operator === "%") total = (total * nextValue) / 100; // POS পার্সেন্টেজ লজিক
        }
        return total;
    };

    const calculateResult = (customInput) => {
        const targetInput = customInput !== undefined && typeof customInput === "string" ? customInput : input;
        try {
            if (!targetInput) return;
            const sanitizedInput = targetInput.replace(/x/g, "*");

            let evalResult;
            if (calcMode === "general") {
                // ক্রমানুসারে (Sequential) হিসাব হবে (যেমন: 80*1+20/50 = 2)
                evalResult = parseSequential(sanitizedInput);
            } else {
                // standard BODMAS নিয়মে হিসাব হবে (যেমন: 80*1+20/50 = 80.4)
                evalResult = eval(sanitizedInput);
            }

            if (isNaN(evalResult) || !isFinite(evalResult)) {
                setResult("Error");
            } else {
                setResult(Number(evalResult).toFixed(2).replace(/\.00$/, ""));
            }
        } catch (error) {
            setResult("Error");
        }
    };

    const buttons = [
        { label: "C", action: handleClear, className: "bg-rose-100 text-rose-600 hover:bg-rose-200" },
        { label: "⌫", action: handleBackspace, className: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
        { label: "%", action: () => handleButtonClick("%"), className: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
        { label: "/", action: () => handleButtonClick("/"), className: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 font-bold" },

        { label: "7", action: () => handleButtonClick("7"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
        { label: "8", action: () => handleButtonClick("8"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
        { label: "9", action: () => handleButtonClick("9"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
        { label: "x", action: () => handleButtonClick("*"), className: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 font-bold" },

        { label: "4", action: () => handleButtonClick("4"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
        { label: "5", action: () => handleButtonClick("5"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
        { label: "6", action: () => handleButtonClick("6"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
        { label: "-", action: () => handleButtonClick("-"), className: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 font-bold" },

        { label: "1", action: () => handleButtonClick("1"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
        { label: "2", action: () => handleButtonClick("2"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
        { label: "3", action: () => handleButtonClick("3"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
        { label: "+", action: () => handleButtonClick("+"), className: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 font-bold" },

        { label: "0", action: () => handleButtonClick("0"), className: "bg-slate-50 text-slate-700 hover:bg-slate-100 col-span-2" },
        { label: ".", action: () => handleButtonClick("."), className: "bg-slate-50 text-slate-700 hover:bg-slate-100" },
        { label: "=", action: () => calculateResult(), className: "bg-emerald-500 text-white hover:bg-emerald-600 font-bold shadow-sm shadow-emerald-200" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex flex-col gap-3 transition-transform scale-100 select-none">

                {/* Header with Mode Switcher */}
                <div className="flex justify-between items-center pb-1 border-b border-slate-50">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        POS Calc
                    </span>

                    {/* Mode Toggle Button */}
                    <button
                        onClick={() => { setCalcMode(calcMode === "general" ? "standard" : "general"); handleClear(); }}
                        className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        title="Click to switch calculation method"
                    >
                        <span>{calcMode === "general" ? "General" : "Standard"}</span>
                        {calcMode === "general" ? <ToggleLeft size={16} className="text-slate-400" /> : <ToggleRight size={16} className="text-emerald-500" />}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Display Screen */}
                <div className="bg-slate-900 rounded-xl p-3 text-right flex flex-col justify-end min-h-[76px] shadow-inner font-mono relative overflow-hidden">
                    <div className="text-slate-400 text-[10px] absolute top-1 left-2 bg-slate-800 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide">
                        {calcMode === "general" ? "Sequential" : "BODMAS"}
                    </div>
                    <div className="text-slate-400 text-xs truncate tracking-wide mb-1 min-h-[16px]">
                        {input || "0"}
                    </div>
                    <div className="text-white text-2xl font-bold truncate tracking-tight">
                        {result || "0"}
                    </div>
                </div>

                {/* Keypad Buttons Grid */}
                <div className="grid grid-cols-4 gap-2 text-sm font-semibold">
                    {buttons.map((btn, index) => (
                        <button
                            key={index}
                            onClick={btn.action}
                            className={`h-11 flex items-center justify-center rounded-xl transition-all duration-100 active:scale-95 ${btn.label === "0" ? "col-span-2" : ""} ${btn.className}`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                <div className="text-[10px] text-center text-slate-400 font-medium pt-1">
                    💡 Mode: {calcMode === "general" ? "General (Left to Right)" : "Standard (Math Rules)"}
                </div>
            </div>
        </div>
    );
};

export default CalculatorModal;