import React, { useState, useEffect, useCallback } from 'react';
import { posWarrantyPeriodAPI } from '../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI';

const UpdateWarrantyPeriodModal = ({ isOpen, onClose, onSuccess, warrantyData }) => {
    const [form, setForm] = useState({
        name: '',
        duration: '',
        period_type: 'month',
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const resetAndClose = useCallback(() => {
        setErrors({});
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (warrantyData && isOpen) {
            setForm({
                name: warrantyData.name || '',
                duration: warrantyData.duration || '',
                period_type: warrantyData.period_type || 'month',
                is_active: warrantyData.is_active !== undefined ? warrantyData.is_active : true,
            });
        }
    }, [warrantyData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await posWarrantyPeriodAPI.update(warrantyData.id, form);
            if (onSuccess) {
                onSuccess(res.data);
            }
            resetAndClose();
        } catch (err) {
            console.error('API Error:', err);
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                alert('An unknown error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
                <div className='sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10'>
                    <h2 className='text-2xl font-bold text-gray-800'>Update Warranty Period</h2>
                    <button onClick={resetAndClose} className='text-gray-500 hover:text-gray-700 text-2xl'>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className='p-6'>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Name *</label>
                            <input
                                className='w-full p-2 border border-gray-300 rounded-lg'
                                name='name'
                                placeholder='e.g., 1 Year Warranty'
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                            {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Duration *</label>
                            <input
                                type='number'
                                className='w-full p-2 border border-gray-300 rounded-lg'
                                name='duration'
                                placeholder='e.g., 12'
                                value={form.duration}
                                onChange={handleChange}
                                required
                            />
                            {errors.duration && <p className='text-red-500 text-xs mt-1'>{errors.duration}</p>}
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Period Type</label>
                            <select
                                className='w-full p-2 border border-gray-300 rounded-lg'
                                name='period_type'
                                value={form.period_type}
                                onChange={handleChange}
                            >
                                <option value='day'>Days</option>
                                <option value='month'>Months</option>
                                <option value='year'>Years</option>
                            </select>
                            {errors.period_type && <p className='text-red-500 text-xs mt-1'>{errors.period_type}</p>}
                        </div>

                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='is_active_update'
                                name='is_active'
                                checked={form.is_active}
                                onChange={handleChange}
                                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                            />
                            <label htmlFor='is_active_update' className='ml-2 block text-sm text-gray-900'>
                                Active
                            </label>
                        </div>
                    </div>

                    <div className='mt-8 pt-6 border-t flex justify-end space-x-3'>
                        <button type='button' onClick={resetAndClose} className='px-6 py-2 border rounded-lg hover:bg-gray-50' disabled={loading}>
                            Cancel
                        </button>
                        <button type='submit' className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50' disabled={loading}>
                            {loading ? 'Updating...' : 'Update Warranty'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateWarrantyPeriodModal;
