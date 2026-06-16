import React, { useState, useEffect, useMemo } from 'react';
import api from '../../context_or_provider/pos/posApi';

/**
 * -------------------------------------------------------------------------------------
 *  MINIMALIST SUB-COMPONENTS (Django Admin Style)
 * -------------------------------------------------------------------------------------
 */

const DjangoTransferBox = ({
    title,
    availableItems,
    chosenItems,
    onAdd,
    onRemove,
    availSearch,
    setAvailSearch,
    chosenSearch,
    setChosenSearch
}) => (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 border border-gray-200 rounded">
        {/* Available */}
        <div className="flex-1 w-full flex flex-col bg-white border border-gray-300 rounded shadow-sm">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Available {title}
            </div>
            <div className="p-2 border-b border-gray-200">
                <input
                    type="text" placeholder="Filter..." value={availSearch}
                    onChange={(e) => setAvailSearch(e.target.value)}
                    className="w-full text-xs p-1.5 border border-gray-300 rounded outline-none focus:border-blue-500"
                />
            </div>
            <div className="h-60 overflow-y-auto custom-scrollbar">
                {availableItems.filter(i => (i.name || "").toLowerCase().includes(availSearch.toLowerCase())).map(item => (
                    <div key={item.id} onClick={() => onAdd(item.id)} className="px-3 py-2 text-xs text-gray-600 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors border-b border-gray-100 last:border-0">
                        {item.name}
                    </div>
                ))}
            </div>
        </div>

        {/* Action Arrows */}
        <div className="flex md:flex-col gap-2 text-gray-400 font-bold">
            <span className="hidden md:block">→</span>
            <span className="hidden md:block">←</span>
            <span className="md:hidden">↓↑</span>
        </div>

        {/* Chosen */}
        <div className="flex-1 w-full flex flex-col bg-white border border-gray-300 rounded shadow-sm">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Chosen {title}
            </div>
            <div className="p-2 border-b border-gray-200">
                <input
                    type="text" placeholder="Filter..." value={chosenSearch}
                    onChange={(e) => setChosenSearch(e.target.value)}
                    className="w-full text-xs p-1.5 border border-gray-300 rounded outline-none focus:border-blue-500"
                />
            </div>
            <div className="h-60 overflow-y-auto custom-scrollbar bg-blue-50/20">
                {chosenItems.filter(i => (i.name || "").toLowerCase().includes(chosenSearch.toLowerCase())).map(item => (
                    <div key={item.id} onClick={() => onRemove(item.id)} className="px-3 py-2 text-xs font-bold text-blue-800 hover:bg-red-600 hover:text-white cursor-pointer transition-colors border-b border-blue-100 last:border-0">
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/**
 * -------------------------------------------------------------------------------------
 *  MAIN COMPONENT (Minimalist Page-Based)
 * -------------------------------------------------------------------------------------
 */

const UserRoleManagement = () => {
    const [view, setView] = useState('list'); // 'list', 'edit-user', 'edit-role'
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'roles'
    const [data, setData] = useState({ users: [], groups: [], permissions: [] });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');

    // Form States
    const [target, setTarget] = useState(null);
    const [form, setForm] = useState({});

    // Transfer Box Filter States
    const [filters, setFilters] = useState({ availG: '', chosenG: '', availP: '', chosenP: '' });

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            setLoading(false);
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [u, g, p] = await Promise.all([
                api.get("/api/users/allProfile/"),
                api.get("/api/users/groups/"),
                api.get("/api/users/permissions/")
            ]);
            setData({
                users: u.data.results || u.data,
                groups: g.data.results || g.data,
                permissions: p.data.results || p.data
            });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // --- Action Handlers ---

    const openEditUser = (user) => {
        setTarget(user);
        const groups = user.user_details?.groups_details?.map(g => parseInt(g.id)) || [];
        const perms = user.user_details?.user_permissions_details?.map(p => parseInt(p.id)) || [];
        setForm({
            name: user.name || '',
            phone_number: user.phone_number || '',
            is_active: user.user_details?.is_active ?? true,
            is_staff: user.user_details?.is_staff ?? false,
            is_superuser: user.user_details?.is_superuser ?? false,
            groups: groups,
            user_permissions: perms,
            password: '', confirm_password: ''
        });
        setView('edit-user');
    };

    const openEditRole = (role = null) => {
        setTarget(role);
        setForm({
            name: role?.name || '',
            permissions: role?.permissions || role?.permissions_details?.map(p => parseInt(p.id)) || []
        });
        setView('edit-role');
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const apiData = { ...form };
            if (!apiData.password) { delete apiData.password; delete apiData.confirm_password; }
            await api.patch(`/api/users/users/${target.user}/`, apiData);
            await api.patch(`/api/users/allProfile/${target.id}/`, { name: form.name });
            alert("Updated successfully.");
            setView('list'); loadData();
        } catch (e) { alert("Error saving."); }
        finally { setSubmitting(false); }
    };

    const handleSaveRole = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (target) await api.put(`/api/users/groups/${target.id}/`, form);
            else await api.post("/api/users/groups/", form);
            setView('list'); loadData();
        } catch (e) { alert("Error saving."); }
        finally { setSubmitting(false); }
    };

    // --- Helper Functions ---

    const toggle = (list, id, key) => {
        const idNum = parseInt(id);
        const newList = list.includes(idNum) ? list.filter(i => i !== idNum) : [...list, idNum];
        setForm(prev => ({ ...prev, [key]: newList }));
    };

    // --- Render Logic ---

    if (view === 'list') {
        return (
            <div className="p-6 bg-gray-50 min-h-screen font-sans animate-in fade-in duration-300">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Minimal Header */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-800">System Authentication & Authorization</h1>
                        <div className="flex bg-gray-200 p-1 rounded">
                            <button onClick={() => setActiveTab('users')} className={`px-4 py-1.5 text-xs font-bold rounded ${activeTab === 'users' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}>Users</button>
                            <button onClick={() => setActiveTab('roles')} className={`px-4 py-1.5 text-xs font-bold rounded ${activeTab === 'roles' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}>Groups</button>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="bg-white p-4 border border-gray-200 rounded shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-80">
                            <input
                                type="text" placeholder={`Search ${activeTab}...`}
                                className="w-full border border-gray-300 p-2 pl-8 text-sm rounded outline-none focus:border-blue-500"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        {activeTab === 'roles' && (
                            <button onClick={() => openEditRole()} className="bg-blue-600 text-white px-4 py-2 text-xs font-bold rounded hover:bg-blue-700 uppercase tracking-wider">Add Group +</button>
                        )}
                    </div>

                    {loading ? <div className="text-center py-20 text-gray-400 text-sm">Loading database...</div> : (
                        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-100 border-b border-gray-200 font-bold text-gray-600">
                                    <tr>
                                        <th className="p-3 border-r border-gray-200">Name / UID</th>
                                        <th className="p-3 border-r border-gray-200">Permissions & Roles</th>
                                        <th className="p-3 border-r border-gray-200 text-center">Status</th>
                                        <th className="p-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {activeTab === 'users' ?
                                        data.users.filter(u => (u.name || "").toLowerCase().includes(search.toLowerCase()) || (u.phone_number || "").includes(search)).map(u => (
                                            <tr key={u.id} className="hover:bg-gray-50">
                                                <td className="p-3 border-r border-gray-200">
                                                    <div className="font-bold text-blue-600">{u.name || "None"}</div>
                                                    <div className="text-[10px] text-gray-400">{u.phone_number}</div>
                                                </td>
                                                <td className="p-3 border-r border-gray-200">
                                                    <div className="flex flex-wrap gap-1">
                                                        {u.user_details?.is_superuser && <span className="bg-gray-800 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">superuser</span>}
                                                        {u.user_details?.groups_details?.map(g => <span key={g.id} className="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-600 font-bold">{g.name}</span>)}
                                                    </div>
                                                </td>
                                                <td className="p-3 border-r border-gray-200 text-center">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.user_details?.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.user_details?.is_active ? 'ACTIVE' : 'LOCKED'}</span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <button onClick={() => openEditUser(u)} className="text-blue-500 hover:underline text-xs font-bold">Configure</button>
                                                </td>
                                            </tr>
                                        )) :
                                        data.groups.filter(g => (g.name || "").toLowerCase().includes(search.toLowerCase())).map(g => (
                                            <tr key={g.id} className="hover:bg-gray-50">
                                                <td className="p-3 border-r border-gray-200 font-bold text-gray-700">{g.name}</td>
                                                <td className="p-3 border-r border-gray-200 text-gray-500 text-xs italic">{g.permissions_details?.length || 0} permissions assigned</td>
                                                <td className="p-3 border-r border-gray-200 text-center text-xs text-gray-400">—</td>
                                                <td className="p-3 text-right">
                                                    <button onClick={() => openEditRole(g)} className="text-blue-500 hover:underline text-xs font-bold">Edit Role</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- Edit View ---

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans animate-in slide-in-from-right-5 duration-300">
            <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
                    <h2 className="text-sm font-bold uppercase tracking-widest">{view === 'edit-user' ? `Change User: ${target?.name}` : `Edit Group Role`}</h2>
                    <button onClick={() => setView('list')} className="text-xs font-bold hover:underline opacity-80">Back to list</button>
                </div>

                <form className="p-8 space-y-10">
                    {/* Section 1: Core Fields */}
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-gray-100 pb-4">
                            <label className="w-40 text-xs font-bold text-gray-500 uppercase">Legal Name:</label>
                            <input
                                type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                                className="flex-1 border border-gray-300 p-2 text-sm rounded outline-none focus:border-blue-500 font-bold"
                            />
                        </div>
                        {view === 'edit-user' && (
                            <>
                                <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-gray-100 pb-4">
                                    <label className="w-40 text-xs font-bold text-gray-500 uppercase">Phone (UID):</label>
                                    <input
                                        type="text" value={form.phone_number} onChange={(e) => setForm({...form, phone_number: e.target.value})}
                                        className="flex-1 border border-gray-300 p-2 text-sm rounded outline-none focus:border-blue-500 font-bold text-blue-600"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-8 py-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} className="w-4 h-4" />
                                        <span className="text-xs font-bold text-gray-700">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.is_staff} onChange={(e) => setForm({...form, is_staff: e.target.checked})} className="w-4 h-4" />
                                        <span className="text-xs font-bold text-gray-700">Staff status</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.is_superuser} onChange={(e) => setForm({...form, is_superuser: e.target.checked})} className="w-4 h-4" />
                                        <span className="text-xs font-bold text-gray-700">Superuser status</span>
                                    </label>
                                </div>
                                <div className="bg-red-50 p-4 border border-red-100 rounded flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <label className="block text-[10px] font-bold text-red-400 uppercase">New Password</label>
                                        <input type="password" placeholder="••••••••" onChange={(e) => setForm({...form, password: e.target.value})} className="w-full border border-gray-200 p-2 text-sm rounded" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="block text-[10px] font-bold text-red-400 uppercase">Confirm Password</label>
                                        <input type="password" placeholder="••••••••" onChange={(e) => setForm({...form, confirm_password: e.target.value})} className="w-full border border-gray-200 p-2 text-sm rounded" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Section 2: Permissions Matrix */}
                    <div className="space-y-8">
                        {view === 'edit-user' && (
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase border-b border-gray-200 pb-1">Group Permissions</h4>
                                <DjangoTransferBox
                                    title="Groups"
                                    availableItems={data.groups.filter(g => !form.groups.includes(parseInt(g.id)))}
                                    chosenItems={data.groups.filter(g => form.groups.includes(parseInt(g.id)))}
                                    onAdd={(id) => toggle(form.groups, id, 'groups')}
                                    onRemove={(id) => toggle(form.groups, id, 'groups')}
                                    availSearch={filters.availG} setAvailSearch={(v) => setFilters({...filters, availG: v})}
                                    chosenSearch={filters.chosenG} setChosenSearch={(v) => setFilters({...filters, chosenG: v})}
                                />
                            </div>
                        )}

                        <div className="space-y-3">
                            <h4 className="text-[11px] font-bold text-gray-400 uppercase border-b border-gray-200 pb-1">Individual Permissions</h4>
                            <DjangoTransferBox
                                title="Permissions"
                                availableItems={data.permissions.filter(p => !(view === 'edit-user' ? form.user_permissions : form.permissions).includes(parseInt(p.id)))}
                                chosenItems={data.permissions.filter(p => (view === 'edit-user' ? form.user_permissions : form.permissions).includes(parseInt(p.id)))}
                                onAdd={(id) => toggle(view === 'edit-user' ? form.user_permissions : form.permissions, id, view === 'edit-user' ? 'user_permissions' : 'permissions')}
                                onRemove={(id) => toggle(view === 'edit-user' ? form.user_permissions : form.permissions, id, view === 'edit-user' ? 'user_permissions' : 'permissions')}
                                availSearch={filters.availP} setAvailSearch={(v) => setFilters({...filters, availP: v})}
                                chosenSearch={filters.chosenP} setChosenSearch={(v) => setFilters({...filters, chosenP: v})}
                            />
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="bg-gray-100 -mx-8 -mb-8 p-4 flex justify-between items-center border-t border-gray-200">
                        <button type="button" onClick={() => setView('list')} className="text-xs font-bold text-gray-500 hover:text-gray-800 uppercase underline">Cancel</button>
                        <div className="flex gap-4">
                            {view === 'edit-role' && target && (
                                <button type="button" onClick={() => {
                                    if(window.confirm("Delete this group?")) {
                                        api.delete(`/api/users/groups/${target.id}/`).then(() => { setView('list'); loadData(); });
                                    }
                                }} className="bg-red-600 text-white px-6 py-2 text-xs font-bold rounded shadow-sm">Delete Group</button>
                            )}
                            <button
                                onClick={view === 'edit-user' ? handleSaveUser : handleSaveRole}
                                disabled={submitting}
                                className="bg-blue-700 text-white px-8 py-2 text-xs font-bold rounded shadow hover:bg-blue-800 uppercase tracking-widest transition-all"
                            >
                                {submitting ? 'Saving...' : 'Save & Update'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f9fafb; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            `}</style>
        </div>
    );
};

export default UserRoleManagement;


