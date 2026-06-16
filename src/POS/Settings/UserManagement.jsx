//
// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import api from '../../context_or_provider/pos/posApi';
// 
//
// const UserManagement = () => {
//     const [activeSubTab, setActiveSubTab] = useState('users'); // 'users' or 'groups'
//     const [users, setUsers] = useState([]);
//     const [groups, setGroups] = useState([]);
//     const [permissions, setPermissions] = useState([]);
//     const [loading, setLoading] = useState(false);
//
//     // User Modal States
//     const [editingUser, setEditingUser] = useState(null);
//     const [showUserModal, setShowUserModal] = useState(false);
//
//     // Group Modal States
//     const [editingGroup, setEditingGroup] = useState(null);
//     const [showGroupModal, setShowGroupModal] = useState(false);
//
//     const [searchQuery, setSearchQuery] = useState('');
//     const [permSearch, setPermSearch] = useState('');
//
//     const [userData, setUserData] = useState({
//         phone_number: '', password: '', confirm_password: '',
//         is_active: true, is_staff: false, is_superuser: false,
//         groups: [], user_permissions: [], name: '',
//     });
//
//     const [groupData, setGroupData] = useState({
//         name: '',
//         permissions: []
//     });
//
//     useEffect(() => {
//         fetchData();
//     }, []);
//
//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const [u, g, p] = await Promise.all([
//                 api.get(`/api/users/allProfile/`),
//                 api.get(`/api/users/groups/`),
//                 api.get(`/api/users/permissions/`)
//             ]);
//             setUsers(u.data.results || u.data);
//             setGroups(g.data.results || g.data);
//             setPermissions(p.data.results || p.data);
//         } catch (e) { console.error("Fetch error", e); }
//         finally { setLoading(false); }
//     };
//
//     // --- User Actions ---
//     const handleEditUser = (userProfile) => {
//         setEditingUser(userProfile);
//         setUserData({
//             phone_number: userProfile.phone_number || '',
//             password: '',
//             confirm_password: '',
//             is_active: userProfile.user_details?.is_active ?? true,
//             is_staff: userProfile.user_details?.is_staff ?? false,
//             is_superuser: userProfile.user_details?.is_superuser ?? false,
//             groups: userProfile.user_details?.groups || [],
//             user_permissions: userProfile.user_details?.user_permissions || [],
//             name: userProfile.name || '',
//         });
//         setPermSearch('');
//         setShowUserModal(true);
//     };
//
//     const handleUserSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const userId = editingUser.user;
//             const profileId = editingUser.id;
//
//             const updateData = {
//                 is_active: userData.is_active,
//                 is_staff: userData.is_staff,
//                 is_superuser: userData.is_superuser,
//                 groups: userData.groups,
//                 user_permissions: userData.user_permissions,
//             };
//
//             if (userData.password) {
//                 if (userData.password !== userData.confirm_password) {
//                     alert("Passwords do not match!"); setLoading(false); return;
//                 }
//                 updateData.password = userData.password;
//                 updateData.confirm_password = userData.confirm_password;
//             }
//
//             await api.patch(`/api/users/users/${userId}/`, updateData);
//             await api.patch(`/api/users/allProfile/${profileId}/`, { name: userData.name });
//
//             alert('User updated successfully!');
//             setShowUserModal(false);
//             fetchData();
//         } catch (error) {
//             alert('Error updating user');
//         } finally { setLoading(false); }
//     };
//
//     // --- Group Actions ---
//     const handleAddGroup = () => {
//         setEditingGroup(null);
//         setGroupData({ name: '', permissions: [] });
//         setPermSearch('');
//         setShowGroupModal(true);
//     };
//
//     const handleEditGroup = (group) => {
//         setEditingGroup(group);
//         setGroupData({
//             name: group.name,
//             permissions: group.permissions || []
//         });
//         setPermSearch('');
//         setShowGroupModal(true);
//     };
//
//     const handleGroupSubmit = async (e) => {
//         e.preventDefault();
//         if (!groupData.name) { alert("Group name is required"); return; }
//         setLoading(true);
//         try {
//             if (editingGroup) {
//                 await api.put(`/api/users/groups/${editingGroup.id}/`, groupData);
//                 alert('Group updated successfully!');
//             } else {
//                 await api.post(`/api/users/groups/`, groupData);
//                 alert('Group created successfully!');
//             }
//             setShowGroupModal(false);
//             fetchData();
//         } catch (error) {
//             alert('Error saving group');
//         } finally { setLoading(false); }
//     };
//
//     const handleDeleteGroup = async (groupId) => {
//         if (!window.confirm("Are you sure you want to delete this group?")) return;
//         try {
//             await api.delete(`/api/users/groups/${groupId}/`);
//             fetchData();
//         } catch (e) { alert("Error deleting group"); }
//     };
//
//     // --- Multi-select Helpers ---
//     const toggleUserItem = (listName, id) => {
//         setUserData(prev => {
//             const list = prev[listName] || [];
//             const newList = list.includes(id) ? list.filter(i => i !== id) : [...list, id];
//             return { ...prev, [listName]: newList };
//         });
//     };
//
//     const toggleGroupPermission = (id) => {
//         setGroupData(prev => {
//             const list = prev.permissions || [];
//             const newList = list.includes(id) ? list.filter(i => i !== id) : [...list, id];
//             return { ...prev, permissions: newList };
//         });
//     };
//
//     // --- Modals (Rendered via Portal) ---
//     const UserModal = () => (
//         <div className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 md:p-10 font-sans">
//             <div className="bg-white rounded-[2.5rem] w-full max-w-6xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
//                 <div className="p-6 border-b flex justify-between items-center bg-white">
//                     <div className="flex items-center gap-4">
//                         <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl shadow-lg">👤</div>
//                         <div>
//                             <h3 className="text-2xl font-black text-slate-800 tracking-tight">Configure User Access</h3>
//                             <p className="text-sm text-slate-500 font-medium">Updating settings for <span className="text-slate-900 font-bold">{editingUser?.name}</span></p>
//                         </div>
//                     </div>
//                     <button onClick={() => setShowUserModal(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all text-xl">✕</button>
//                 </div>
//
//                 <div className="p-8 overflow-y-auto flex-1 bg-slate-50/30">
//                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//                         <div className="lg:col-span-5 space-y-8">
//                             <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
//                                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Account Settings</h4>
//                                 <div>
//                                     <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 ml-1">Full Name</label>
//                                     <input type="text" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} className="w-full border-2 border-slate-100 p-3.5 rounded-2xl text-sm outline-none focus:border-slate-800 transition-all bg-slate-50/50 font-bold text-slate-800" />
//                                 </div>
//                                 <div className="space-y-3">
//                                     {[
//                                         { key: 'is_active', label: 'Active Account', desc: 'Allows system login access' },
//                                         { key: 'is_staff', label: 'Staff Privileges', desc: 'Can access administrative areas' },
//                                         { key: 'is_superuser', label: 'Superuser Rights', desc: 'Unrestricted system control' }
//                                     ].map(item => (
//                                         <label key={item.key} className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-50 hover:border-slate-200 bg-white cursor-pointer transition-all group">
//                                             <div>
//                                                 <p className="text-[14px] font-bold text-slate-800">{item.label}</p>
//                                                 <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
//                                             </div>
//                                             <input type="checkbox" checked={userData[item.key]} onChange={(e) => setUserData({...userData, [item.key]: e.target.checked})} className="w-6 h-6 accent-slate-900 rounded-lg cursor-pointer" />
//                                         </label>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div className="bg-white p-7 rounded-[2rem] border-2 border-rose-100 shadow-sm space-y-6">
//                                 <h4 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">Security & Password</h4>
//                                 <p className="text-xs text-slate-500 font-medium">Leave blank to keep the current password.</p>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <input type="password" placeholder="New Password" onChange={(e) => setUserData({...userData, password: e.target.value})} className="w-full border-2 border-slate-100 p-3.5 rounded-2xl text-sm outline-none focus:border-rose-400 transition-all bg-slate-50/50" />
//                                     <input type="password" placeholder="Confirm Password" onChange={(e) => setUserData({...userData, confirm_password: e.target.value})} className="w-full border-2 border-slate-100 p-3.5 rounded-2xl text-sm outline-none focus:border-rose-400 transition-all bg-slate-50/50" />
//                                 </div>
//                             </div>
//                         </div>
//
//                         <div className="lg:col-span-7 space-y-6">
//                             <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col h-full min-h-[550px]">
//                                 <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-5">
//                                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Access Control</h4>
//                                     <input type="text" placeholder="Filter..." className="border-2 border-slate-50 p-2.5 rounded-xl text-xs w-48" onChange={(e) => setPermSearch(e.target.value)} />
//                                 </div>
//                                 <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar">
//                                     <p className="text-[11px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">Groups Assignment</p>
//                                     <div className="flex flex-wrap gap-3 mb-10">
//                                         {groups.map(g => (
//                                             <button key={g.id} type="button" onClick={() => toggleUserItem('groups', g.id)}
//                                                 className={`px-5 py-2.5 rounded-2xl text-[12px] font-black border-2 transition-all ${userData.groups.includes(g.id) ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
//                                                 {g.name}
//                                             </button>
//                                         ))}
//                                     </div>
//                                     <p className="text-[11px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">Direct Permissions</p>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                         {permissions.filter(p => (p.name || "").toLowerCase().includes(permSearch.toLowerCase())).map(p => (
//                                             <div key={p.id} onClick={() => toggleUserItem('user_permissions', p.id)}
//                                                 className={`p-4 rounded-2xl cursor-pointer text-[12px] flex items-center gap-4 border-2 transition-all ${userData.user_permissions.includes(p.id) ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white border-slate-50 hover:border-slate-200'}`}>
//                                                 <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${userData.user_permissions.includes(p.id) ? 'bg-white border-white' : 'bg-slate-100 border-slate-200'}`}>
//                                                     {userData.user_permissions.includes(p.id) && <div className="w-2.5 h-2.5 bg-slate-900 rounded-[3px]"></div>}
//                                                 </div>
//                                                 <span className="truncate font-black">{p.name}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="p-8 border-t bg-white flex justify-end gap-6">
//                     <button onClick={() => setShowUserModal(false)} className="px-10 py-4 text-sm font-black text-slate-400 hover:text-slate-800 transition-all">Discard</button>
//                     <button onClick={handleUserSubmit} disabled={loading} className="px-14 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all uppercase tracking-widest">
//                         {loading ? 'Saving...' : 'Save User Settings'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
//
//     const GroupModal = () => (
//         <div className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 md:p-10 font-sans">
//             <div className="bg-white rounded-[2.5rem] w-full max-w-4xl h-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
//                 <div className="p-6 border-b flex justify-between items-center bg-white">
//                     <div className="flex items-center gap-4">
//                         <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-lg">📁</div>
//                         <div>
//                             <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingGroup ? 'Edit Group' : 'Create New Group'}</h3>
//                             <p className="text-sm text-slate-500 font-medium">Define a role and its associated permissions</p>
//                         </div>
//                     </div>
//                     <button onClick={() => setShowGroupModal(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all text-xl">✕</button>
//                 </div>
//
//                 <div className="p-8 overflow-y-auto flex-1 bg-slate-50/30">
//                     <div className="grid grid-cols-1 gap-10">
//                         <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
//                             <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Group Identification</h4>
//                             <div>
//                                 <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 ml-1">Group Name</label>
//                                 <input type="text" value={groupData.name} onChange={(e) => setGroupData({...groupData, name: e.target.value})} className="w-full border-2 border-slate-100 p-3.5 rounded-2xl text-sm outline-none focus:border-blue-600 transition-all bg-slate-50/50 font-bold text-slate-800" placeholder="e.g. Sales Manager, Inventory Staff" />
//                             </div>
//                         </div>
//
//                         <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col min-h-[400px]">
//                             <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-5">
//                                 <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Group Permissions</h4>
//                                 <input type="text" placeholder="Search..." className="border-2 border-slate-50 p-2.5 rounded-xl text-xs w-48" onChange={(e) => setPermSearch(e.target.value)} />
//                             </div>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pr-3 custom-scrollbar">
//                                 {permissions.filter(p => (p.name || "").toLowerCase().includes(permSearch.toLowerCase())).map(p => (
//                                     <div key={p.id} onClick={() => toggleGroupPermission(p.id)}
//                                         className={`p-4 rounded-2xl cursor-pointer text-[12px] flex items-center gap-4 border-2 transition-all ${groupData.permissions.includes(p.id) ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white border-slate-50 hover:border-slate-200'}`}>
//                                         <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${groupData.permissions.includes(p.id) ? 'bg-white border-white' : 'bg-slate-100 border-slate-200'}`}>
//                                             {groupData.permissions.includes(p.id) && <div className="w-2.5 h-2.5 bg-blue-600 rounded-[3px]"></div>}
//                                         </div>
//                                         <span className="truncate font-black">{p.name}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="p-8 border-t bg-white flex justify-end gap-6">
//                     <button onClick={() => setShowGroupModal(false)} className="px-10 py-4 text-sm font-black text-slate-400 hover:text-slate-800 transition-all">Discard</button>
//                     <button onClick={handleGroupSubmit} disabled={loading} className="px-14 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all uppercase tracking-widest">
//                         {loading ? 'Saving...' : (editingGroup ? 'Update Group' : 'Create Group')}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
//
//     return (
//         <div className="space-y-6">
//             <style>{`
//                 .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//                 .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//                 .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
//                 @keyframes scaleInCenter {
//                     0% { transform: scale(0.95); opacity: 0; }
//                     100% { transform: scale(1); opacity: 1; }
//                 }
//                 .scale-in-center { animation: scaleInCenter 0.2s ease-out both; }
//             `}</style>
//
//             {/* Sub-Tabs */}
//             <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit mb-6">
//                 <button
//                     onClick={() => setActiveSubTab('users')}
//                     className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
//                 >
//                     System Users
//                 </button>
//                 <button
//                     onClick={() => setActiveSubTab('groups')}
//                     className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'groups' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
//                 >
//                     User Roles (Groups)
//                 </button>
//             </div>
//
//             {activeSubTab === 'users' ? (
//                 <div className="space-y-6">
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                         <div>
//                             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Staff Management</h2>
//                             <p className="text-xs text-slate-500 font-medium">Control system access for your employees</p>
//                         </div>
//                         <div className="relative w-full md:w-80">
//                             <input type="text" placeholder="Search users..." className="w-full border-2 border-slate-100 px-10 py-3 rounded-2xl text-sm outline-none focus:border-slate-800" onChange={(e) => setSearchQuery(e.target.value)} />
//                             <svg className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
//                         </div>
//                     </div>
//                     <div className="border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm bg-white">
//                         <table className="w-full text-left">
//                             <thead className="bg-slate-50 border-b border-slate-100">
//                                 <tr>
//                                     <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Employee</th>
//                                     <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Status</th>
//                                     <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Privileges</th>
//                                     <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-slate-50">
//                                 {users.filter(u => (u.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
//                                     <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
//                                         <td className="p-5">
//                                             <div className="flex items-center gap-4">
//                                                 <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg shadow-slate-200">{user.name?.charAt(0) || 'U'}</div>
//                                                 <div>
//                                                     <div className="font-black text-slate-800 text-sm">{user.name}</div>
//                                                     <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{user.phone_number}</div>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="p-5">
//                                             <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border tracking-widest ${user.user_details?.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{user.user_details?.is_active ? 'ACTIVE' : 'LOCKED'}</span>
//                                         </td>
//                                         <td className="p-5 flex gap-2">
//                                             {user.user_details?.is_staff && <span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-black">STAFF</span>}
//                                             {user.user_details?.is_superuser && <span className="text-[10px] bg-purple-50 text-purple-600 px-2.5 py-1 rounded-lg font-black">ADMIN</span>}
//                                         </td>
//                                         <td className="p-5 text-right">
//                                             <button onClick={() => handleEditUser(user)} className="bg-slate-50 text-slate-600 px-5 py-2.5 rounded-2xl text-[10px] font-black hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest">Configure</button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="space-y-6">
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                         <div>
//                             <h2 className="text-xl font-bold text-slate-800 tracking-tight">System Roles</h2>
//                             <p className="text-xs text-slate-500 font-medium">Create and manage group-based permissions</p>
//                         </div>
//                         <button onClick={handleAddGroup} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">+ Create Role</button>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {groups.length === 0 ? (
//                             <div className="col-span-full py-20 bg-white rounded-[2rem] border-4 border-dashed border-slate-50 flex flex-col items-center justify-center text-slate-300">
//                                 <p className="font-black text-xl mb-2">No roles defined yet</p>
//                                 <p className="text-sm font-medium">Create a group to start managing batch permissions</p>
//                             </div>
//                         ) : groups.map(group => (
//                             <div key={group.id} className="bg-white p-6 rounded-[2rem] border-2 border-slate-50 shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between">
//                                 <div>
//                                     <div className="flex justify-between items-start mb-4">
//                                         <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold shadow-inner">📁</div>
//                                         <div className="flex gap-2">
//                                             <button onClick={() => handleEditGroup(group)} className="text-slate-400 hover:text-blue-600 p-1 transition-colors">✎</button>
//                                             <button onClick={() => handleDeleteGroup(group.id)} className="text-slate-400 hover:text-rose-600 p-1 transition-colors">✕</button>
//                                         </div>
//                                     </div>
//                                     <h3 className="text-lg font-black text-slate-800 mb-2">{group.name}</h3>
//                                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4">{group.permissions_details?.length || 0} permissions assigned</p>
//                                 </div>
//                                 <div className="flex flex-wrap gap-1.5 max-h-20 overflow-hidden opacity-60">
//                                     {group.permissions_details?.slice(0, 5).map(p => (
//                                         <span key={p.id} className="text-[9px] bg-slate-100 px-2 py-1 rounded-lg font-bold text-slate-500">{p.name}</span>
//                                     ))}
//                                     {group.permissions_details?.length > 5 && <span className="text-[9px] text-slate-300">+{group.permissions_details.length - 5} more</span>}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//
//             {/* Render Modals via Portal */}
//             {showUserModal && ReactDOM.createPortal(<UserModal />, document.body)}
//             {showGroupModal && ReactDOM.createPortal(<GroupModal />, document.body)}
//         </div>
//     );
// };
//
// export default UserManagement;



import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import api from '../../context_or_provider/pos/posApi';

/**
 * -------------------------------------------------------------------------------------
 *  SUB-COMPONENTS (Moved outside to prevent focus loss during state updates)
 * -------------------------------------------------------------------------------------
 */

// Reusable Transfer List/Box UI Component (Django Style)
const TransferComponent = ({
    titleAvailable, titleChosen,
    availableItems, chosenItems,
    onAdd, onRemove, onAddAll, onRemoveAll,
    availSearch, setAvailSearch, chosenSearch, setChosenSearch
}) => (
    <div className="grid grid-cols-1 md:grid-cols-11 gap-2 items-center bg-slate-50 p-4 rounded-3xl border border-slate-200">
        {/* Left Side: Available */}
        <div className="md:col-span-5 flex flex-col h-[320px] bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-2 text-xs font-black tracking-wider uppercase flex justify-between items-center">
                <span>{titleAvailable} ({availableItems.length})</span>
                <button type="button" onClick={onAddAll} className="text-[10px] bg-slate-700 px-2 py-0.5 rounded hover:bg-slate-600">Choose All</button>
            </div>
            <div className="p-2 border-b bg-slate-50">
                <input
                    type="text"
                    placeholder="Filter available..."
                    value={availSearch}
                    onChange={(e) => setAvailSearch(e.target.value)}
                    className="w-full text-xs p-2 border rounded-xl outline-none"
                />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                {availableItems.filter(item => (item.name || "").toLowerCase().includes(availSearch.toLowerCase())).map(item => (
                    <div key={item.id} onClick={() => onAdd(item.id)} className="p-2.5 text-xs font-medium text-slate-700 hover:bg-blue-50 cursor-pointer flex justify-between items-center group">
                        <span className="truncate pr-2">{item.name}</span>
                        <span className="text-blue-500 opacity-0 group-hover:opacity-100 font-bold">➕</span>
                    </div>
                ))}
                {availableItems.length === 0 && <p className="text-center text-slate-400 text-xs mt-10">No items available</p>}
            </div>
        </div>

        {/* Middle: Indicators / Fast Actions */}
        <div className="md:col-span-1 flex md:flex-col justify-center gap-4 text-slate-400 font-bold text-center">
            <div className="hidden md:block text-lg">⇄</div>
        </div>

        {/* Right Side: Chosen */}
        <div className="md:col-span-5 flex flex-col h-[320px] bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="bg-blue-900 text-white px-4 py-2 text-xs font-black tracking-wider uppercase flex justify-between items-center">
                <span>{titleChosen} ({chosenItems.length})</span>
                <button type="button" onClick={onRemoveAll} className="text-[10px] bg-blue-800 px-2 py-0.5 rounded hover:bg-blue-700">Clear All</button>
            </div>
            <div className="p-2 border-b bg-slate-50">
                <input
                    type="text"
                    placeholder="Filter chosen..."
                    value={chosenSearch}
                    onChange={(e) => setChosenSearch(e.target.value)}
                    className="w-full text-xs p-2 border rounded-xl outline-none"
                />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                {chosenItems.filter(item => (item.name || "").toLowerCase().includes(chosenSearch.toLowerCase())).map(item => (
                    <div key={item.id} onClick={() => onRemove(item.id)} className="p-2.5 text-xs font-bold text-blue-900 bg-blue-50/40 hover:bg-rose-50 hover:text-rose-600 cursor-pointer flex justify-between items-center group">
                        <span className="truncate pr-2">{item.name}</span>
                        <span className="text-rose-500 opacity-0 group-hover:opacity-100 font-bold">❌</span>
                    </div>
                ))}
                {chosenItems.length === 0 && <p className="text-center text-slate-400 text-xs mt-10">Nothing selected yet</p>}
            </div>
        </div>
    </div>
);

const ModalLayout = ({ title, onClose, children, onSave, icon, saveLabel="Save Changes", loading }) => (
    <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] w-full max-w-5xl h-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border">
            <div className="p-5 border-b flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">{icon}</div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
                </div>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-all">✕</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30 custom-scrollbar">{children}</div>
            <div className="p-5 border-t bg-white flex justify-end gap-3 shadow-inner">
                <button onClick={onClose} className="px-6 py-2.5 font-bold text-slate-400 text-sm">Cancel</button>
                <button onClick={onSave} className="px-10 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm shadow-md transition-all">
                    {loading ? 'Processing...' : saveLabel}
                </button>
            </div>
        </div>
    </div>
);

/**
 * -------------------------------------------------------------------------------------
 *  MAIN COMPONENT
 * -------------------------------------------------------------------------------------
 */

const UserManagement = () => {
    const [activeSubTab, setActiveSubTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editingUser, setEditingUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    const [editingGroup, setEditingGroup] = useState(null);
    const [showGroupModal, setShowGroupModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    // Dual Listbox Search States
    const [availGroupSearch, setAvailGroupSearch] = useState('');
    const [chosenGroupSearch, setChosenGroupSearch] = useState('');
    const [availPermSearch, setAvailPermSearch] = useState('');
    const [chosenPermSearch, setChosenPermSearch] = useState('');

    const [userData, setUserData] = useState({
        phone_number: '', password: '', confirm_password: '',
        is_active: true, is_staff: false, is_superuser: false,
        groups: [], user_permissions: [], name: '',
    });

    const [groupData, setGroupData] = useState({ name: '', permissions: [] });

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            setLoading(false);
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [u, g, p] = await Promise.all([
                api.get('/api/users/allProfile/'),
                api.get('/api/users/groups/'),
                api.get('/api/users/permissions/')
            ]);
            setUsers(u.data.results || u.data);
            setGroups(g.data.results || g.data);
            setPermissions(p.data.results || p.data);
        } catch (e) { console.error("Fetch error", e); }
        finally { setLoading(false); }
    };

    const handleEditUser = (userProfile) => {
        setEditingUser(userProfile);

        const currentGroups = userProfile.user_details?.groups_details?.map(g => parseInt(g.id)) || [];
        const currentPerms = userProfile.user_details?.user_permissions_details?.map(p => parseInt(p.id)) || [];

        setUserData({
            phone_number: userProfile.phone_number || '',
            password: '',
            confirm_password: '',
            is_active: userProfile.user_details?.is_active ?? true,
            is_staff: userProfile.user_details?.is_staff ?? false,
            is_superuser: userProfile.user_details?.is_superuser ?? false,
            groups: currentGroups,
            user_permissions: currentPerms,
            name: userProfile.name || '',
        });

        // Reset search bars
        setAvailGroupSearch(''); setChosenGroupSearch('');
        setAvailPermSearch(''); setChosenPermSearch('');
        setShowUserModal(true);
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userApiData = {
                phone_number: userData.phone_number,
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
                userApiData.password = userData.password;
                userApiData.confirm_password = userData.confirm_password;
            }

            // Update User model
            await api.patch(`/api/users/users/${editingUser.user}/`, userApiData);
            // Update Profile model
            await api.patch(`/api/users/allProfile/${editingUser.id}/`, { name: userData.name });

            alert('Settings updated!');
            setShowUserModal(false);
            fetchData();
        } catch (error) {
            alert('Update Failed! ' + JSON.stringify(error.response?.data || "Network error"));
        } finally { setLoading(false); }
    };

    const handleAddGroup = () => {
        setEditingGroup(null);
        setGroupData({ name: '', permissions: [] });
        setAvailPermSearch(''); setChosenPermSearch('');
        setShowGroupModal(true);
    };

    const handleEditGroup = (group) => {
        setEditingGroup(group);
        const currentPerms = group.permissions?.map(p => parseInt(p)) || group.permissions_details?.map(p => parseInt(p.id)) || [];
        setGroupData({ name: group.name, permissions: currentPerms });
        setAvailPermSearch(''); setChosenPermSearch('');
        setShowGroupModal(true);
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Are you sure you want to delete this role?")) return;
        try {
            await api.delete(`/api/users/groups/${groupId}/`);
            fetchData();
        } catch (e) { alert("Error deleting role"); }
    };

    const handleGroupSubmit = async (e) => {
        e.preventDefault();
        if (!groupData.name) return alert("Role name is required");
        try {
            if (editingGroup) await api.put(`/api/users/groups/${editingGroup.id}/`, groupData);
            else await api.post(`/api/users/groups/`, groupData);
            setShowGroupModal(false); fetchData();
        } catch (e) { alert("Error saving group"); }
    };

    // Helper functions for transferring items between boxes
    const moveToTarget = (id, stateKey, formType = 'user') => {
        const idNum = parseInt(id);
        if (formType === 'user') {
            setUserData(prev => ({ ...prev, [stateKey]: [...prev[stateKey], idNum] }));
        } else {
            setGroupData(prev => ({ ...prev, [stateKey]: [...prev[stateKey], idNum] }));
        }
    };

    const removeFromTarget = (id, stateKey, formType = 'user') => {
        const idNum = parseInt(id);
        if (formType === 'user') {
            setUserData(prev => ({ ...prev, [stateKey]: prev[stateKey].filter(i => i !== idNum) }));
        } else {
            setGroupData(prev => ({ ...prev, [stateKey]: prev[stateKey].filter(i => i !== idNum) }));
        }
    };

    const moveAll = (itemsToMove, stateKey, action = 'add', formType = 'user') => {
        const ids = itemsToMove.map(item => parseInt(item.id));
        if (formType === 'user') {
            if (action === 'add') {
                setUserData(prev => ({ ...prev, [stateKey]: [...new Set([...prev[stateKey], ...ids])] }));
            } else {
                setUserData(prev => ({ ...prev, [stateKey]: prev[stateKey].filter(id => !ids.includes(id)) }));
            }
        } else {
            if (action === 'add') {
                setGroupData(prev => ({ ...prev, [stateKey]: [...new Set([...prev[stateKey], ...ids])] }));
            } else {
                setGroupData(prev => ({ ...prev, [stateKey]: prev[stateKey].filter(id => !ids.includes(id)) }));
            }
        }
    };

    return (
        <div className="space-y-6 p-4">
            {/* Upper Navbar Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl shadow-inner w-full sm:w-auto">
                    <button onClick={() => setActiveSubTab('users')} className={`flex-1 sm:flex-initial px-6 py-2 rounded-lg text-xs font-black transition-all ${activeSubTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>EMPLOYEES</button>
                    <button onClick={() => setActiveSubTab('groups')} className={`flex-1 sm:flex-initial px-6 py-2 rounded-lg text-xs font-black transition-all ${activeSubTab === 'groups' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>ROLES & GROUPS</button>
                </div>

                <div className="flex gap-3 w-full sm:w-auto justify-end">
                    <input type="text" placeholder={`Search ${activeSubTab}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border border-slate-200 px-4 py-2 rounded-xl text-xs outline-none focus:border-slate-400 bg-slate-50 w-full sm:w-48" />
                    {activeSubTab === 'groups' && (
                        <button onClick={handleAddGroup} className="bg-blue-600 text-white px-5 py-2 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shrink-0 shadow-md">+ Create Role</button>
                    )}
                </div>
            </div>

            {/* List Content Render */}
            {activeSubTab === 'users' ? (
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 border-b">
                            <tr>
                                <th className="p-4 font-black text-slate-400 text-[10px] uppercase tracking-wider">Employee Info</th>
                                <th className="p-4 font-black text-slate-400 text-[10px] uppercase tracking-wider">Account Role / Privileges</th>
                                <th className="p-4 font-black text-slate-400 text-[10px] uppercase tracking-wider">System Status</th>
                                <th className="p-4 font-black text-slate-400 text-[10px] uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.filter(u => (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (u.phone_number || "").includes(searchQuery)).map(u => (
                                <tr key={u.id} className="hover:bg-slate-50/40 transition-all">
                                    <td className="p-4">
                                        <div className="font-black text-slate-800 text-sm">{u.name || "Unnamed Employee"}</div>
                                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{u.phone_number}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {u.user_details?.groups_details?.map(g => (
                                                <span key={g.id} className="text-[9px] bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold">{g.name}</span>
                                            ))}
                                            {u.user_details?.is_superuser && (
                                                <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter">Superuser</span>
                                            )}
                                            {(!u.user_details?.groups_details?.length && !u.user_details?.is_superuser) && (
                                                <span className="text-slate-400 text-xs">—</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${u.user_details?.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                            {u.user_details?.is_active ? 'ACTIVE' : 'LOCKED'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleEditUser(u)} className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm">Configure</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.filter(g => (g.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map(g => {
                        const totalPerms = g.permissions?.length || g.permissions_details?.length || 0;
                        return (
                            <div key={g.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">📁</div>
                                        <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-all">
                                            <button onClick={() => handleEditGroup(g)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs hover:bg-blue-600 hover:text-white transition-all">✎</button>
                                            <button onClick={() => handleDeleteGroup(g.id)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs hover:bg-rose-600 hover:text-white transition-all">✕</button>
                                        </div>
                                    </div>
                                    <h3 className="font-black text-slate-800 text-base mb-0.5">{g.name}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">{totalPerms} PERMISSIONS ASSIGNED</p>
                                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1 custom-scrollbar">
                                        {(g.permissions_details || []).map(p => (
                                            <span key={p.id} className="text-[9px] bg-slate-50 px-2 py-0.5 rounded border text-slate-500 font-semibold max-w-xs truncate">{p.name}</span>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => handleEditGroup(g)} className="mt-4 border border-slate-200 hover:border-blue-300 rounded-xl py-2 text-center text-slate-600 hover:text-blue-600 font-black text-[10px] uppercase tracking-wider transition-all">Manage Role Access</button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* EMPLOYEE ACCESS CONFIGURATION MODAL */}
            {showUserModal && ReactDOM.createPortal(
                <ModalLayout title={`Access Configurations: ${editingUser?.name}`} icon="👤" onClose={() => setShowUserModal(false)} onSave={handleUserSubmit} loading={loading}>
                    <div className="space-y-6">
                        {/* Profile Info & Status Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-slate-200">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={userData.name}
                                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                                    className="w-full border p-2.5 rounded-xl text-xs font-bold outline-none focus:border-slate-800"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-200">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Phone (UID)</label>
                                <input
                                    type="text"
                                    value={userData.phone_number}
                                    onChange={(e) => setUserData({...userData, phone_number: e.target.value})}
                                    className="w-full border p-2.5 rounded-xl text-xs font-bold outline-none focus:border-slate-800"
                                    placeholder="Phone Number"
                                />
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-200">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Security / Password</label>
                                <div className="flex gap-2">
                                    <input type="password" placeholder="New" onChange={(e) => setUserData({...userData, password: e.target.value})} className="w-full border p-2 rounded-xl text-[10px] outline-none focus:border-rose-400" />
                                    <input type="password" placeholder="Confirm" onChange={(e) => setUserData({...userData, confirm_password: e.target.value})} className="w-full border p-2 rounded-xl text-[10px] outline-none focus:border-rose-400" />
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-around gap-2">
                                {['is_active', 'is_staff', 'is_superuser'].map(k => (
                                    <label key={k} className="flex flex-col items-center gap-1 cursor-pointer">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{k.replace('is_', '').replace('_', ' ')}</span>
                                        <input type="checkbox" checked={userData[k]} onChange={(e) => setUserData({...userData, [k]: e.target.checked})} className="w-5 h-5 accent-slate-900 cursor-pointer" />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Dual Listbox : GROUPS ASSIGNMENT */}
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">1. Group / Role Bundles</h4>
                            <TransferComponent
                                titleAvailable="Available Groups"
                                titleChosen="Chosen Groups"
                                availableItems={groups.filter(g => !userData.groups.includes(parseInt(g.id)))}
                                chosenItems={groups.filter(g => userData.groups.includes(parseInt(g.id)))}
                                onAdd={(id) => moveToTarget(id, 'groups', 'user')}
                                onRemove={(id) => removeFromTarget(id, 'groups', 'user')}
                                onAddAll={() => moveAll(groups.filter(g => !userData.groups.includes(parseInt(g.id))), 'groups', 'add', 'user')}
                                onRemoveAll={() => setUserData(prev => ({ ...prev, groups: [] }))}
                                availSearch={availGroupSearch}
                                setAvailSearch={setAvailGroupSearch}
                                chosenSearch={chosenGroupSearch}
                                setChosenSearch={setChosenGroupSearch}
                            />
                        </div>

                        {/* Dual Listbox : INDIVIDUAL PERMISSIONS ASSIGNMENT */}
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">2. Direct Special Permissions <span className="text-slate-400 font-normal">(Overrides group rules)</span></h4>
                            <TransferComponent
                                titleAvailable="Available Permissions List"
                                titleChosen="Chosen Explicit Permissions"
                                availableItems={permissions.filter(p => !userData.user_permissions.includes(parseInt(p.id)))}
                                chosenItems={permissions.filter(p => userData.user_permissions.includes(parseInt(p.id)))}
                                onAdd={(id) => moveToTarget(id, 'user_permissions', 'user')}
                                onRemove={(id) => removeFromTarget(id, 'user_permissions', 'user')}
                                onAddAll={() => moveAll(permissions.filter(p => !userData.user_permissions.includes(parseInt(p.id))), 'user_permissions', 'add', 'user')}
                                onRemoveAll={() => setUserData(prev => ({ ...prev, user_permissions: [] }))}
                                availSearch={availPermSearch}
                                setAvailSearch={setAvailPermSearch}
                                chosenSearch={chosenPermSearch}
                                setChosenSearch={setChosenPermSearch}
                            />
                        </div>
                    </div>
                </ModalLayout>, document.body
            )}

            {/* ROLE / GROUP CREATION AND ACCESS EDIT MODAL */}
            {showGroupModal && ReactDOM.createPortal(
                <ModalLayout title={editingGroup ? `Configure Access: ${editingGroup.name}` : "Create New System Role"} icon="📁" onClose={() => setShowGroupModal(false)} onSave={handleGroupSubmit} saveLabel={editingGroup ? "Update Role Module" : "Create Role Module"} loading={loading}>
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Role Title Designation</label>
                            <input
                                type="text"
                                value={groupData.name}
                                onChange={(e) => setGroupData({...groupData, name: e.target.value})}
                                className="w-full border p-3 rounded-xl font-bold text-sm outline-none bg-slate-50 focus:bg-white"
                                placeholder="e.g. Counter Cashier, Inventory Manager"
                            />
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Bundle Permissions into this Role</h4>
                            <TransferComponent
                                titleAvailable="All Permissions Repository"
                                titleChosen="Bundled Role Permissions"
                                availableItems={permissions.filter(p => !groupData.permissions.includes(parseInt(p.id)))}
                                chosenItems={permissions.filter(p => groupData.permissions.includes(parseInt(p.id)))}
                                onAdd={(id) => moveToTarget(id, 'permissions', 'group')}
                                onRemove={(id) => removeFromTarget(id, 'permissions', 'group')}
                                onAddAll={() => moveAll(permissions.filter(p => !groupData.permissions.includes(parseInt(p.id))), 'permissions', 'add', 'group')}
                                onRemoveAll={() => setGroupData(prev => ({ ...prev, permissions: [] }))}
                                availSearch={availPermSearch}
                                setAvailSearch={setAvailPermSearch}
                                chosenSearch={chosenPermSearch}
                                setChosenSearch={setChosenPermSearch}
                            />
                        </div>
                    </div>
                </ModalLayout>, document.body
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
        </div>
    );
};

export default UserManagement;