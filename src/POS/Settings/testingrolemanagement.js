import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import api from '../../context_or_provider/pos/posApi';


const UserManagement = () => {
    const [activeSubTab, setActiveSubTab] = useState('users'); // 'users' or 'groups'
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    // User Modal States
    const [editingUser, setEditingUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    // Group Modal States
    const [editingGroup, setEditingGroup] = useState(null);
    const [showGroupModal, setShowGroupModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [permSearch, setPermSearch] = useState('');

    const [userData, setUserData] = useState({
        phone_number: '', password: '', confirm_password: '',
        is_active: true, is_staff: false, is_superuser: false,
        groups: [], user_permissions: [], name: '',
    });

    const [groupData, setGroupData] = useState({
        name: '',
        permissions: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [u, g, p] = await Promise.all([
                api.get(`/api/users/allProfile/`),
                api.get(`/api/users/groups/`),
                api.get(`/api/users/permissions/`)
            ]);
            setUsers(u.data.results || u.data);
            setGroups(g.data.results || g.data);
            setPermissions(p.data.results || p.data);
        } catch (e) { console.error("Fetch error", e); }
        finally { setLoading(false); }
    };

    // --- User Actions ---
    const handleEditUser = (userProfile) => {
        setEditingUser(userProfile);
        setUserData({
            phone_number: userProfile.phone_number || '',
            password: '',
            confirm_password: '',
            is_active: userProfile.user_details?.is_active ?? true,
            is_staff: userProfile.user_details?.is_staff ?? false,
            is_superuser: userProfile.user_details?.is_superuser ?? false,
            groups: userProfile.user_details?.groups || [],
            user_permissions: userProfile.user_details?.user_permissions || [],
            name: userProfile.name || '',
        });
        setPermSearch('');
        setShowUserModal(true);
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userId = editingUser.user;
            const profileId = editingUser.id;

            const updateData = {
                is_active: userData.is_active,
                is_staff: userData.is_staff,
                is_superuser: userData.is_superuser,
                groups: userData.groups,
                user_permissions: userData.user_permissions,
            };

            if (userData.password) {
                if (userData.password !== userData.confirm_password) {
                    alert("Passwords do not match!"); setLoading(false); return;
                }
                updateData.password = userData.password;
                updateData.confirm_password = userData.confirm_password;
            }

            await api.patch(`/api/users/users/${userId}/`, updateData);
            await api.patch(`/api/users/allProfile/${profileId}/`, { name: userData.name });

            alert('User updated successfully!');
            setShowUserModal(false);
            fetchData();
        } catch (error) {
            alert('Error updating user');
        } finally { setLoading(false); }
    };

    // --- Group Actions ---
    const handleAddGroup = () => {
        setEditingGroup(null);
        setGroupData({ name: '', permissions: [] });
        setPermSearch('');
        setShowGroupModal(true);
    };

    const handleEditGroup = (group) => {
        setEditingGroup(group);
        setGroupData({
            name: group.name,
            permissions: group.permissions || []
        });
        setPermSearch('');
        setShowGroupModal(true);
    };

    const handleGroupSubmit = async (e) => {
        e.preventDefault();
        if (!groupData.name) { alert("Group name is required"); return; }
        setLoading(true);
        try {
            if (editingGroup) {
                await api.put(`/api/users/groups/${editingGroup.id}/`, groupData);
                alert('Group updated successfully!');
            } else {
                await api.post(`/api/users/groups/`, groupData);
                alert('Group created successfully!');
            }
            setShowGroupModal(false);
            fetchData();
        } catch (error) {
            alert('Error saving group');
        } finally { setLoading(false); }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;
        try {
            await api.delete(`/api/users/groups/${groupId}/`);
            fetchData();
        } catch (e) { alert("Error deleting group"); }
    };

    // --- Multi-select Helpers ---
    const toggleUserItem = (listName, id) => {
        setUserData(prev => {
            const list = prev[listName] || [];
            const newList = list.includes(id) ? list.filter(i => i !== id) : [...list, id];
            return { ...prev, [listName]: newList };
        });
    };

    const toggleGroupPermission = (id) => {
        setGroupData(prev => {
            const list = prev.permissions || [];
            const newList = list.includes(id) ? list.filter(i => i !== id) : [...list, id];
            return { ...prev, permissions: newList };
        });
    };

    // --- Modals (Rendered via Portal) ---
    const UserModal = () => (
        <div className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 md:p-10 font-sans">
            <div className="bg-white rounded-[2.5rem] w-full max-w-6xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b flex justify-between items-center bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl shadow-lg">👤</div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Configure User Access</h3>
                            <p className="text-sm text-slate-500 font-medium">Updating settings for <span className="text-slate-900 font-bold">{editingUser?.name}</span></p>
                        </div>
                    </div>
                    <button onClick={() => setShowUserModal(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all text-xl">✕</button>
                </div>

                <div className="p-8 overflow-y-auto flex-1 bg-slate-50/30">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-5 space-y-8">
                            <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Account Settings</h4>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 ml-1">Full Name</label>
                                    <input type="text" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} className="w-full border-2 border-slate-100 p-3.5 rounded-2xl text-sm outline-none focus:border-slate-800 transition-all bg-slate-50/50 font-bold text-slate-800" />
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { key: 'is_active', label: 'Active Account', desc: 'Allows system login access' },
                                        { key: 'is_staff', label: 'Staff Privileges', desc: 'Can access administrative areas' },
                                        { key: 'is_superuser', label: 'Superuser Rights', desc: 'Unrestricted system control' }
                                    ].map(item => (
                                        <label key={item.key} className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-50 hover:border-slate-200 bg-white cursor-pointer transition-all group">
                                            <div>
                                                <p className="text-[14px] font-bold text-slate-800">{item.label}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                                            </div>
                                            <input type="checkbox" checked={userData[item.key]} onChange={(e) => setUserData({...userData, [item.key]: e.target.checked})} className="w-6 h-6 accent-slate-900 rounded-lg cursor-pointer" />
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-7 rounded-[2rem] border-2 border-rose-100 shadow-sm space-y-6">
                                <h4 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">Security & Password</h4>
                                <p className="text-xs text-slate-500 font-medium">Leave blank to keep the current password.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="password" placeholder="New Password" onChange={(e) => setUserData({...userData, password: e.target.value})} className="w-full border-2 border-slate-100 p-3.5 rounded-2xl text-sm outline-none focus:border-rose-400 transition-all bg-slate-50/50" />
                                    <input type="password" placeholder="Confirm Password" onChange={(e) => setUserData({...userData, confirm_password: e.target.value})} className="w-full border-2 border-slate-100 p-3.5 rounded-2xl text-sm outline-none focus:border-rose-400 transition-all bg-slate-50/50" />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col h-full min-h-[550px]">
                                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-5">
                                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Access Control</h4>
                                    <input type="text" placeholder="Filter..." className="border-2 border-slate-50 p-2.5 rounded-xl text-xs w-48" onChange={(e) => setPermSearch(e.target.value)} />
                                </div>
                                <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar">
                                    <p className="text-[11px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">Groups Assignment</p>
                                    <div className="flex flex-wrap gap-3 mb-10">
                                        {groups.map(g => (
                                            <button key={g.id} type="button" onClick={() => toggleUserItem('groups', g.id)}
                                                className={`px-5 py-2.5 rounded-2xl text-[12px] font-black border-2 transition-all ${userData.groups.includes(g.id) ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
                                                {g.name}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[11px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">Direct Permissions</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {permissions.filter(p => (p.name || "").toLowerCase().includes(permSearch.toLowerCase())).map(p => (
                                            <div key={p.id} onClick={() => toggleUserItem('user_permissions', p.id)}
                                                className={`p-4 rounded-2xl cursor-pointer text-[12px] flex items-center gap-4 border-2 transition-all ${userData.user_permissions.includes(p.id) ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white border-slate-50 hover:border-slate-200'}`}>
                                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${userData.user_permissions.includes(p.id) ? 'bg-white border-white' : 'bg-slate-100 border-slate-200'}`}>
                                                    {userData.user_permissions.includes(p.id) && <div className="w-2.5 h-2.5 bg-slate-900 rounded-[3px]"></div>}
                                                </div>
                                                <span className="truncate font-black">{p.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t bg-white flex justify-end gap-6">
                    <button onClick={() => setShowUserModal(false)} className="px-10 py-4 text-sm font-black text-slate-400 hover:text-slate-800 transition-all">Discard</button>
                    <button onClick={handleUserSubmit} disabled={loading} className="px-14 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all uppercase tracking-widest">
                        {loading ? 'Saving...' : 'Save User Settings'}
                    </button>
                </div>
            </div>
        </div>
    );

    const GroupModal = () => (
        <div className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 md:p-10 font-sans">
            <div className="bg-white rounded-[2.5rem] w-full max-w-4xl h-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b flex justify-between items-center bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-lg">📁</div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingGroup ? 'Edit Group' : 'Create New Group'}</h3>
                            <p className="text-sm text-slate-500 font-medium">Define a role and its associated permissions</p>
                        </div>
                    </div>
                    <button onClick={() => setShowGroupModal(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all text-xl">✕</button>
                </div>

                <div className="p-8 overflow-y-auto flex-1 bg-slate-50/30">
                    <div className="grid grid-cols-1 gap-10">
                        <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Group Identification</h4>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 ml-1">Group Name</label>
                                <input type="text" value={groupData.name} onChange={(e) => setGroupData({...groupData, name: e.target.value})} className="w-full border-2 border-slate-100 p-3.5 rounded-2xl text-sm outline-none focus:border-blue-600 transition-all bg-slate-50/50 font-bold text-slate-800" placeholder="e.g. Sales Manager, Inventory Staff" />
                            </div>
                        </div>

                        <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col min-h-[400px]">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-5">
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Group Permissions</h4>
                                <input type="text" placeholder="Search..." className="border-2 border-slate-50 p-2.5 rounded-xl text-xs w-48" onChange={(e) => setPermSearch(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pr-3 custom-scrollbar">
                                {permissions.filter(p => (p.name || "").toLowerCase().includes(permSearch.toLowerCase())).map(p => (
                                    <div key={p.id} onClick={() => toggleGroupPermission(p.id)}
                                        className={`p-4 rounded-2xl cursor-pointer text-[12px] flex items-center gap-4 border-2 transition-all ${groupData.permissions.includes(p.id) ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white border-slate-50 hover:border-slate-200'}`}>
                                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${groupData.permissions.includes(p.id) ? 'bg-white border-white' : 'bg-slate-100 border-slate-200'}`}>
                                            {groupData.permissions.includes(p.id) && <div className="w-2.5 h-2.5 bg-blue-600 rounded-[3px]"></div>}
                                        </div>
                                        <span className="truncate font-black">{p.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t bg-white flex justify-end gap-6">
                    <button onClick={() => setShowGroupModal(false)} className="px-10 py-4 text-sm font-black text-slate-400 hover:text-slate-800 transition-all">Discard</button>
                    <button onClick={handleGroupSubmit} disabled={loading} className="px-14 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all uppercase tracking-widest">
                        {loading ? 'Saving...' : (editingGroup ? 'Update Group' : 'Create Group')}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                @keyframes scaleInCenter {
                    0% { transform: scale(0.95); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .scale-in-center { animation: scaleInCenter 0.2s ease-out both; }
            `}</style>

            {/* Sub-Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit mb-6">
                <button
                    onClick={() => setActiveSubTab('users')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    System Users
                </button>
                <button
                    onClick={() => setActiveSubTab('groups')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'groups' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    User Roles (Groups)
                </button>
            </div>

            {activeSubTab === 'users' ? (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Staff Management</h2>
                            <p className="text-xs text-slate-500 font-medium">Control system access for your employees</p>
                        </div>
                        <div className="relative w-full md:w-80">
                            <input type="text" placeholder="Search users..." className="w-full border-2 border-slate-100 px-10 py-3 rounded-2xl text-sm outline-none focus:border-slate-800" onChange={(e) => setSearchQuery(e.target.value)} />
                            <svg className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                    <div className="border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm bg-white">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Employee</th>
                                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Status</th>
                                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Privileges</th>
                                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.filter(u => (u.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg shadow-slate-200">{user.name?.charAt(0) || 'U'}</div>
                                                <div>
                                                    <div className="font-black text-slate-800 text-sm">{user.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{user.phone_number}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border tracking-widest ${user.user_details?.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{user.user_details?.is_active ? 'ACTIVE' : 'LOCKED'}</span>
                                        </td>
                                        <td className="p-5 flex gap-2">
                                            {user.user_details?.is_staff && <span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-black">STAFF</span>}
                                            {user.user_details?.is_superuser && <span className="text-[10px] bg-purple-50 text-purple-600 px-2.5 py-1 rounded-lg font-black">ADMIN</span>}
                                        </td>
                                        <td className="p-5 text-right">
                                            <button onClick={() => handleEditUser(user)} className="bg-slate-50 text-slate-600 px-5 py-2.5 rounded-2xl text-[10px] font-black hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest">Configure</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">System Roles</h2>
                            <p className="text-xs text-slate-500 font-medium">Create and manage group-based permissions</p>
                        </div>
                        <button onClick={handleAddGroup} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">+ Create Role</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.length === 0 ? (
                            <div className="col-span-full py-20 bg-white rounded-[2rem] border-4 border-dashed border-slate-50 flex flex-col items-center justify-center text-slate-300">
                                <p className="font-black text-xl mb-2">No roles defined yet</p>
                                <p className="text-sm font-medium">Create a group to start managing batch permissions</p>
                            </div>
                        ) : groups.map(group => (
                            <div key={group.id} className="bg-white p-6 rounded-[2rem] border-2 border-slate-50 shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold shadow-inner">📁</div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditGroup(group)} className="text-slate-400 hover:text-blue-600 p-1 transition-colors">✎</button>
                                            <button onClick={() => handleDeleteGroup(group.id)} className="text-slate-400 hover:text-rose-600 p-1 transition-colors">✕</button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 mb-2">{group.name}</h3>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4">{group.permissions_details?.length || 0} permissions assigned</p>
                                </div>
                                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-hidden opacity-60">
                                    {group.permissions_details?.slice(0, 5).map(p => (
                                        <span key={p.id} className="text-[9px] bg-slate-100 px-2 py-1 rounded-lg font-bold text-slate-500">{p.name}</span>
                                    ))}
                                    {group.permissions_details?.length > 5 && <span className="text-[9px] text-slate-300">+{group.permissions_details.length - 5} more</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Render Modals via Portal */}
            {showUserModal && ReactDOM.createPortal(<UserModal />, document.body)}
            {showGroupModal && ReactDOM.createPortal(<GroupModal />, document.body)}
        </div>
    );
};

export default UserManagement;
