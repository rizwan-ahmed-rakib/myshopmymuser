// constants/roles.js
export const ROLE_OPTIONS = [
    { value: "admin", label: "Admin" },
    { value: "head_officer", label: "Head Marketing Officer" },
    { value: "marketing_officer", label: "Marketing Officer" },
    { value: "sales_person", label: "Sales Person" },
    { value: "accountant", label: "Accountant" },
    { value: "delivery_person", label: "Delivery Person" },
    { value: "other", label: "Other" }
];

export const ROLE_COLORS = {
    admin: "bg-red-100 text-red-800",
    head_officer: "bg-purple-100 text-purple-800",
    marketing_officer: "bg-blue-100 text-blue-800",
    sales_person: "bg-green-100 text-green-800",
    accountant: "bg-yellow-100 text-yellow-800",
    delivery_person: "bg-indigo-100 text-indigo-800",
    other: "bg-gray-100 text-gray-800"
};