// constants/filters.js
export const DESIGNATION_OPTIONS = [
    {value: "all", label: "All Designations"},
    {value: "admin", label: "Admin"},
    {value: "head_officer", label: "Head Marketing Officer"},
    {value: "marketing_officer", label: "Marketing Officer"},
    {value: "sales_person", label: "Sales Person"},
    {value: "accountant", label: "Accountant"},
    {value: "delivery_person", label: "Delivery Person"},
    {value: "other", label: "Other"}
];

export const STATUS_OPTIONS = [
    {value: "all", label: "All Status"},
    {value: "active", label: "Active"},
    {value: "inactive", label: "Inactive"},
    {value: "present", label: "Present Today"},
    {value: "absent", label: "Absent Today"}
];

export const DATE_FILTER_OPTIONS = [
    {value: "all", label: "All Time"},
    {value: "today", label: "Today"},
    {value: "week", label: "This Week"},
    {value: "month", label: "This Month"},
    {value: "year", label: "This Year"},
    {value: "custom", label: "Custom Range"}
];

export const SORT_OPTIONS = [
    {value: "name_asc", label: "Name (A-Z)"},
    {value: "name_desc", label: "Name (Z-A)"},
    {value: "date_asc", label: "Date Joined (Oldest)"},
    {value: "date_desc", label: "Date Joined (Newest)"},
    {value: "salary_asc", label: "Salary (Low to High)"},
    {value: "salary_desc", label: "Salary (High to Low)"}
];