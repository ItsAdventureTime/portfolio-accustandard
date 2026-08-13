'use client';

import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  ShieldCheck,
  Clock,
  User,
  Plus,
  Edit,
  Lock,
  X,
  CheckCircle2,
  AlertTriangle,
  Save,
  ShieldAlert,
  Eye,
} from 'lucide-react';

interface SystemAuditTrailProps {
  auditLogs: any[];
  viewAsRole?: string;
  onShowNotification?: (msg: string) => void;
  onAddAuditLog?: (action: string) => void;
  onOpenStartupImportModal?: () => void;
}

const ALL_AVAILABLE_MODULE_VIEWS = [
  'Executive Overview',
  'Inventory',
  'Sales',
  'SOA',
  'Purchasing',
  'RFP',
  'User & Audit Logs',
];

export const SystemAuditTrail: React.FC<SystemAuditTrailProps> = ({
  auditLogs,
  viewAsRole = 'Admin',
  onShowNotification,
  onAddAuditLog,
  onOpenStartupImportModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'AUDIT' | 'USERS'>('USERS');
  const [filterQuery, setFilterQuery] = useState('');

  const canEditUsers = ['Admin', 'Chairman (DCS)'].includes(viewAsRole);

  // Initial Registered System Users & RBAC Permissions Matrix
  const [userList, setUserList] = useState([
    { id: 'usr-1', name: 'Chairman (DCS)', role: 'Chairman (DCS)', allowedViews: ['Executive Overview', 'Inventory', 'Sales', 'SOA', 'Purchasing', 'RFP', 'User & Audit Logs'], status: 'ACTIVE' },
    { id: 'usr-2', name: 'Karen (General Manager)', role: 'General Manager', allowedViews: ['Executive Overview', 'Inventory', 'Sales', 'SOA', 'Purchasing', 'RFP', 'User & Audit Logs'], status: 'ACTIVE' },
    { id: 'usr-3', name: 'Aila (Bookkeeper)', role: 'Bookkeeper', allowedViews: ['Executive Overview', 'SOA', 'Purchasing', 'RFP'], status: 'ACTIVE' },
    { id: 'usr-4', name: 'Marie (Warehouse)', role: 'Warehouse', allowedViews: ['Inventory Control', 'Purchasing & Receiving (RR Input)'], status: 'ACTIVE' },
    { id: 'usr-5', name: 'RMT Katherine (Marketing)', role: 'Marketing', allowedViews: ['Executive Overview', 'Sales Quotation Generator'], status: 'ACTIVE' },
    { id: 'usr-6', name: 'Mark (Sales Officer)', role: 'Sales', allowedViews: ['Sales Quotation Generator'], status: 'ACTIVE' },
  ]);

  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Sales');

  // Modal Editing State
  const [editingUserModal, setEditingUserModal] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editViews, setEditViews] = useState<string[]>([]);

  const handleOpenEditUser = (usr: any) => {
    setEditingUserModal(usr);
    setEditName(usr.name);
    setEditRole(usr.role);
    setEditViews(usr.allowedViews || []);
  };

  const handleToggleModuleView = (viewName: string) => {
    setEditViews((prev) =>
      prev.includes(viewName) ? prev.filter((v) => v !== viewName) : [...prev, viewName]
    );
  };

  const handleSaveUserPermissions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditUsers) {
      if (onShowNotification) onShowNotification(`Permission Denied: Role [${viewAsRole}] cannot modify user permissions.`);
      return;
    }

    setUserList((prev) =>
      prev.map((usr) => {
        if (usr.id === editingUserModal.id) {
          return {
            ...usr,
            name: editName.trim() || usr.name,
            role: editRole,
            allowedViews: editViews,
          };
        }
        return usr;
      })
    );

    if (onShowNotification) onShowNotification(`Updated system user profile & permissions for ${editName}!`);
    if (onAddAuditLog) onAddAuditLog(`Updated user permissions matrix for ${editName} (Role: ${editRole})`);
    setEditingUserModal(null);
  };

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(
      (log) =>
        log.user.toLowerCase().includes(filterQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
        log.time.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [auditLogs, filterQuery]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      if (onShowNotification) onShowNotification('Please enter a full name for the new system user.');
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      role: newUserRole,
      allowedViews: newUserRole === 'Warehouse' ? ['Inventory Control', 'Purchasing & Receiving (RR Input)'] : ['Executive Overview', 'Sales Quotation Generator'],
      status: 'ACTIVE',
    };

    setUserList((prev) => [...prev, newUser]);
    if (onShowNotification) onShowNotification(`Registered user ${newUserName} as ${newUserRole}.`);
    if (onAddAuditLog) onAddAuditLog(`Registered new system user ${newUserName} with role ${newUserRole}`);
    setNewUserName('');
  };

  return (
    <div className="feature-module space-y-6 text-slate-900">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-900" />
            User setup &amp; audit log
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            User Setup &amp; Module Access Matrix &bull; COSO Internal Control Supervision &bull; Active Role: [{viewAsRole}]
          </p>
        </div>

        {/* Tab Switcher & Startup Import Action */}
        <div className="flex items-center gap-3 flex-wrap">
          {onOpenStartupImportModal && (
            <button
              type="button"
              onClick={onOpenStartupImportModal}
              className="px-4 py-2.5 bg-blue-950 hover:bg-blue-900 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Execute Startup Cutover Data Import</span>
            </button>
          )}

          <div className="bg-slate-200/70 p-1.5 rounded-2xl flex gap-1.5 shrink-0 border border-slate-300/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveSubTab('USERS')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                activeSubTab === 'USERS' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-300/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>User &amp; Role Setup ({userList.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('AUDIT')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                activeSubTab === 'AUDIT' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-300/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Audit Action Stream ({auditLogs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'USERS' ? (
        /* User & Allowed View Setup Matrix */
        <div className="space-y-4">
          {/* Add User Form */}
          <form onSubmit={handleAddUser} className="wayfinding-card p-5 space-y-3">
            <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-800" />
              Register New System User &amp; Assign Role
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">User Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Santos"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned System Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="Admin">Admin (Bridge)</option>
                  <option value="Chairman (DCS)">Chairman (DCS)</option>
                  <option value="General Manager">General Manager</option>
                  <option value="Bookkeeper">Bookkeeper</option>
                  <option value="Warehouse">Warehouse (Receiving Access)</option>
                  <option value="Marketing">Marketing (Reviewer)</option>
                  <option value="Sales">Sales Officer</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm rounded-lg transition shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add System User</span>
                </button>
              </div>
            </div>
          </form>

          {/* User Access Matrix Table */}
          <div className="wayfinding-card overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                  User Access &amp; Allowed Module View Permissions
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {canEditUsers ? 'Click any user row or card to modify assigned role and module permissions' : 'Read-only view (Only Admin and DCS Chairman can edit user access)'}
                </p>
              </div>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full w-fit ${canEditUsers ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                {canEditUsers ? '✓ Admin controls available' : '🔒 Read-only mode'}
              </span>
            </div>

            {/* Mobile Card List Layout for User Access Matrix */}
            <div className="block sm:hidden p-3.5 space-y-3 bg-slate-50/50">
              {userList.map((usr) => (
                <div
                  key={usr.id}
                  onClick={() => handleOpenEditUser(usr)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 active:scale-[0.99] transition cursor-pointer"
                >
                  <div className="flex justify-between items-center gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 text-blue-900 rounded-xl">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-sm text-slate-900">{usr.name}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-950 border border-blue-200 font-extrabold text-xs">
                      {usr.role}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                      Allowed Module Views ({usr.allowedViews.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {usr.allowedViews.map((v) => (
                        <span
                          key={v}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-extrabold"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500">
                    <span className="text-emerald-700 flex items-center gap-1 font-extrabold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active &bull; COSO Verified
                    </span>
                    <span className="text-blue-700 font-extrabold flex items-center gap-1 text-[11px]">
                      Edit Access <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block table-responsive-wrapper">
              <table className="wayfinding-grid w-full text-left text-sm border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
                  <tr>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Allowed Module Views</th>
                    <th className="p-4 text-center">Account Security</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                  {userList.map((usr) => (
                    <tr
                      key={usr.id}
                      onClick={() => handleOpenEditUser(usr)}
                      className="hover:bg-blue-50/50 transition cursor-pointer group"
                    >
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditUser(usr);
                          }}
                          className="font-extrabold text-blue-950 bg-blue-50/90 border border-blue-200/90 hover:bg-blue-900 hover:text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs group cursor-pointer"
                          title="Click to inspect and edit user role & access permissions"
                        >
                          <User className="w-4 h-4 text-blue-700 group-hover:text-blue-200 shrink-0" />
                          <span>{usr.name}</span>
                          <Eye className="w-3.5 h-3.5 text-blue-600 group-hover:text-white shrink-0 ml-0.5 opacity-80 group-hover:opacity-100" />
                        </button>
                      </td>
                      <td className="p-4 font-black text-blue-950 text-sm">{usr.role}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {usr.allowedViews.map((v) => (
                            <span key={v} className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 text-xs font-extrabold shadow-2xs">
                              {v}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          Active &bull; COSO Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Audit Log Stream */
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Filter audit logs by user, timestamp, or action description..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-800" />
                Audit Action Log Records
              </h3>
              <span className="text-xs font-mono font-bold text-slate-500">{filteredLogs.length} Log Entries</span>
            </div>

            <div className="divide-y divide-slate-200 text-xs sm:text-sm">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50 transition flex items-start gap-3">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-xl shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-slate-500" />
                        {log.user}
                      </span>
                      <span className="font-mono text-xs text-slate-500 font-semibold">{log.time}</span>
                    </div>
                    <p className="text-slate-800 font-semibold">{log.action}</p>
                  </div>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="p-8 text-center text-slate-500 font-bold">
                  No audit log entries matching &quot;{filterQuery}&quot;.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit User Permissions Modal Overlay */}
      {editingUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-slate-900 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out text-slate-900 text-sm">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-wider">
                    User Access Matrix: {editingUserModal.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">Assigned System Role &amp; Module Permissions</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUserModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Permission Restriction Notice for Non-Admin/DCS */}
            {!canEditUsers && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-950 flex items-start gap-3 font-semibold text-xs sm:text-sm">
                <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900 text-sm">Role Modification Restricted</span>
                  <span>
                    Your active role <strong>[{viewAsRole}]</strong> has read-only access to this user profile. Only <strong>Admin</strong> and <strong>Chairman (DCS)</strong> roles can modify system roles and module view permissions.
                  </span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveUserPermissions} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">User Full Name *</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    disabled={!canEditUsers}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-extrabold rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600 disabled:opacity-75 disabled:bg-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Assigned System Role *</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    disabled={!canEditUsers}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600 disabled:opacity-75 disabled:bg-slate-100 cursor-pointer"
                  >
                    <option value="Admin">Admin (Bridge)</option>
                    <option value="Chairman (DCS)">Chairman (DCS)</option>
                    <option value="General Manager">General Manager</option>
                    <option value="Bookkeeper">Bookkeeper</option>
                    <option value="Warehouse">Warehouse (Receiving Access)</option>
                    <option value="Marketing">Marketing (Reviewer)</option>
                    <option value="Sales">Sales Officer</option>
                  </select>
                </div>
              </div>

              {/* Module View Permissions Checkboxes */}
              <div>
                <label className="font-bold text-slate-700 block mb-2 text-xs uppercase tracking-wider">
                  Allowed Module View Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  {ALL_AVAILABLE_MODULE_VIEWS.map((viewName) => {
                    const isChecked = editViews.includes(viewName);
                    return (
                      <label
                        key={viewName}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm font-extrabold cursor-pointer transition ${
                          isChecked
                            ? 'bg-blue-50 border-blue-300 text-blue-950 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        } ${!canEditUsers ? 'cursor-not-allowed opacity-80' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleModuleView(viewName)}
                          disabled={!canEditUsers}
                          className="w-4 h-4 rounded text-blue-900 focus:ring-blue-500"
                        />
                        <span>{viewName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 flex justify-between items-center border-t border-slate-200 gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUserModal(null)}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
                >
                  Cancel
                </button>

                {canEditUsers && (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save User Access Matrix</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
