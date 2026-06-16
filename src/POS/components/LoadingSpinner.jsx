// import React from "react";
//
// /**
//  * LoadingSpinner - Standardised spinner component.
//  * Allows custom sizes and classes.
//  */
// const LoadingSpinner = ({ size = "md", className = "" }) => {
//     const sizeClasses = {
//         xs: "h-4 w-4",
//         sm: "h-6 w-6",
//         md: "h-8 w-8",
//         lg: "h-12 w-12",
//         xl: "h-16 w-16"
//     };
//
//     return (
//         <div className={`inline-block ${sizeClasses[size]} ${className}`}>
//             <svg className="animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//         </div>
//     );
// };
//
// export default LoadingSpinner;



import React from "react";

/**
 * LoadingSpinner - Standardised modern spinner component.
 * Allows custom sizes and classes.
 */
const LoadingSpinner = ({ size = "md", className = "" }) => {
    const sizeClasses = {
        xs: "h-4 w-4 stroke-[3px]",
        sm: "h-6 w-6 stroke-[3px]",
        md: "h-8 w-8 stroke-4",
        lg: "h-12 w-12 stroke-4",
        xl: "h-16 w-16 stroke-[5px]"
    };

    return (
        <div className={`inline-block ${sizeClasses[size]} ${className}`} role="status">
            <svg
                className="animate-spin text-indigo-600 dark:text-indigo-400 subpixel-antialiased"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                {/* Pichoner halka track ring */}
                <circle
                    className="opacity-12"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                />
                {/* Samner ghurte thaka main path */}
                <path
                    className="opacity-85"
                    fill="currentColor"
                    d="M12 2C6.477 2 2 6.477 2 12h2a8 8 0 018-8V2z"
                />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;