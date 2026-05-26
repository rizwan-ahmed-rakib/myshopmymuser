import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * useModuleData - A centralized hook to handle data fetching, searching, 
 * filtering, and statistics calculation for Backbone sub-modules.
 * 
 * @param {Object} options
 * @param {Function} options.apiFetch - The API function to call (returns promise with data)
 * @param {string} options.searchQuery - The current search string from ModuleShell
 * @param {Object} options.filters - The current filter state from ModuleShell
 * @param {Array} options.searchFields - Fields in the data to search against
 * @param {Function} options.onStatsLoaded - Callback to lift stats to the parent
 * @param {Function} options.calculateStatsFn - Function to compute stats from raw data
 * @param {Function} options.filterFn - Optional custom filter logic for complex cases
 * @param {number} options.initialPage - Initial page to fetch
 */
const useModuleData = ({
    apiFetch,
    searchQuery = "",
    filters = {},
    searchFields = [],
    onStatsLoaded,
    calculateStatsFn,
    filterFn,
    initialPage = 1
}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination State
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
        current: initialPage,
        totalPages: 1
    });

    const fetchData = useCallback(async (page = initialPage) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiFetch(page);
            
            // Handle standard DRF pagination or direct array
            const isPaginated = response.data && response.data.results !== undefined;
            const resultData = isPaginated ? response.data.results : (response.data || []);
            
            setData(resultData);
            
            if (isPaginated) {
                setPagination({
                    count: response.data.count,
                    next: response.data.next,
                    previous: response.data.previous,
                    current: page,
                    totalPages: Math.ceil(response.data.count / 10) || 1
                });
            }
            
            // Calculate and lift stats
            if (calculateStatsFn && onStatsLoaded) {
                const stats = calculateStatsFn(resultData, response.data?.count || resultData.length);
                onStatsLoaded(stats);
            }
        } catch (err) {
            console.error("Backbone Hook Fetch Error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [apiFetch, calculateStatsFn, onStatsLoaded, initialPage]);

    // Initial load
    useEffect(() => {
        fetchData(initialPage);
    }, [fetchData, initialPage]);

    // Derived filtered data
    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];

        let result = [...data];

        // 1. Search Logic
        if (searchQuery && searchQuery.trim() && searchFields.length > 0) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item => {
                return searchFields.some(field => {
                    const value = field.split('.').reduce((obj, key) => obj?.[key], item);
                    return String(value || "").toLowerCase().includes(query);
                });
            });
        }

        // 2. Filter Logic (Either custom or basic key-value matching)
        if (filterFn) {
            result = filterFn(result, filters);
        } else {
            Object.keys(filters).forEach(key => {
                const filterValue = filters[key];
                if (filterValue && filterValue !== "all") {
                    result = result.filter(item => String(item[key]) === String(filterValue));
                }
            });
        }

        return result;
    }, [data, searchQuery, filters, searchFields, filterFn]);

    return {
        rawData: data,
        filteredData,
        loading,
        error,
        pagination,
        changePage: fetchData,
        refresh: () => fetchData(pagination.current),
        setData
    };
};

export default useModuleData;
