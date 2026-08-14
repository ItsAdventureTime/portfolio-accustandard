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
  ChevronDown,
} from 'lucide-react';
import { AccessibleModal } from '@/components/common/AccessibleModal';
import type { NotificationInput } from '@/components/common/NotificationCenter';
import {
  canUseOperation,
  canManageUsers,
  DEFAULT_ROLE,
  getAllowedModuleViews,
  normalizeRole,
  ROLE_OPTIONS,
  TAB_LABELS,
  type Role,
} from '@/lib/permissions';

interface SystemAuditTrailProps {
  auditLogs: any[];
  viewAsRole?: Role;
  onShowNotification?: (notification: NotificationInput) => void;
  onAddAuditLog?: (action: string, actorRole?: Role) => void;
  onOpenStartupImportModal?: () => void;
}

const ALL_AVAILABLE_MODULE_VIEWS = Object.values(TAB_LABELS);

export const SystemAuditTrail: React.FC<SystemAuditTrailProps> = ({
  auditLogs,
  viewAsRole = 'Admin',
  onShowNotification,
  onAddAuditLog,
  onOpenStartupImportModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'AUDIT' | 'USERS'>('USERS');
  const [filterQuery, setFilterQuery] = useState('');

  const canEditUsers = canManageUsers(viewAsRole);

  // Initial Registered System Users & RBAC Permissions Matrix
  const [userList, setUserList] = useState([
    { id: 'usr-1', name: 'Chairman (DCS)', role: 'Chairman (DCS)', allowedViews: getAllowedModuleViews('Chairman (DCS)'), status: 'ACTIVE' },
    { id: 'usr-2', name: 'Karen (General Manager)', role: 'General Manager', allowedViews: getAllowedModuleViews('General Manager'), status: 'ACTIVE' },
    { id: 'usr-3', name: 'Aila (Bookkeeper)', role: 'Bookkeeper', allowedViews: getAllowedModuleViews('Bookkeeper'), status: 'ACTIVE' },
    { id: 'usr-4', name: 'Marie (Warehouse)', role: 'Warehouse', allowedViews: getAllowedModuleViews('Warehouse'), status: 'ACTIVE' },
    { id: 'usr-5', name: 'RMT Katherine (Marketing)', role: 'Marketing', allowedViews: getAllowedModuleViews('Marketing'), status: 'ACTIVE' },
    { id: 'usr-6', name: 'Mark (Sales Officer)', role: 'Sales', allowedViews: getAllowedModuleViews('Sales'), status: 'ACTIVE' },
  ]);

  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('Sales');

  // Modal Editing State
  const [editingUserModal, setEditingUserModal] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<Role>(DEFAULT_ROLE);

  const handleOpenEditUser = (usr: any) => {
    setEditingUserModal(usr);
    setEditName(usr.name);
    setEditRole(normalizeRole(usr.role));
  };

  const handleSaveUserPermissions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditUsers) {
      if (onShowNotification) onShowNotification({ severity: 'info', title: 'Access restricted', message: `Role [${viewAsRole}] cannot modify user permissions.` });
      return;
    }

    if (!editingUserModal) return;
    const canonicalViews = getAllowedModuleViews(editRole);
    const intendedName = editName.trim() || editingUserModal.name;
    setUserList((prev) =>
      prev.map((usr) => {
        if (usr.id === editingUserModal.id) {
          return {
            ...usr,
            name: intendedName,
            role: editRole,
            allowedViews: canonicalViews,
          };
        }
        return usr;
      })
    );

    if (onShowNotification) onShowNotification({ severity: 'success', title: 'User access updated', message: `Updated the system user profile and permissions for ${intendedName}.` });
    if (onAddAuditLog) onAddAuditLog(`Updated user permissions matrix for ${intendedName} (Role: ${editRole})`, viewAsRole);
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
    if (!canEditUsers) {
      if (onShowNotification) onShowNotification({ severity: 'info', title: 'Access restricted', message: `Role [${viewAsRole}] cannot create users.` });
      return;
    }
    if (!newUserName.trim()) {
      if (onShowNotification) onShowNotification({ severity: 'warning', title: 'User name required', message: 'Enter a full name for the new system user.' });
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      role: newUserRole,
      allowedViews: getAllowedModuleViews(newUserRole),
      status: 'ACTIVE',
    };

    setUserList((prev) => [...prev, newUser]);
    if (onShowNotification) onShowNotification({ severity: 'success', title: 'User registered', message: `Registered ${newUserName} as ${newUserRole}.` });
    if (onAddAuditLog) onAddAuditLog(`Registered new system user ${newUserName} with role ${newUserRole}`, viewAsRole);
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
            User setup and module access matrix &bull; COSO internal control supervision &bull; Active role: [{viewAsRole}]
          </p>
        </div>

        {/* Tab Switcher & Startup Import Action */}
        <div className="flex items-center gap-3 flex-wrap">
          {onOpenStartupImportModal && canUseOperation(viewAsRole, 'import') && canEditUsers && (
            <details className="action-disclosure relative">
              <summary>
                <span>More actions</span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </summary>
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 flex min-w-[16rem] flex-col gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <button
                  type="button"
                  onClick={onOpenStartupImportModal}
                  className="action-quiet w-full justify-start text-left text-xs sm:text-sm"
                >
                  <Plus className="w-4 h-4 text-blue-700" />
                  <span>Startup cutover data import</span>
                </button>
              </div>
            </details>
          )}

          <div className="bg-slate-200/70 p-1.5 rounded-2xl flex gap-1.5 shrink-0 border border-slate-300/80 shadow-2xs">
            <button
              type="button"
              role="tab"
              onClick={() => setActiveSubTab('USERS')}
                aria-selected={activeSubTab === 'USERS'}
                className="action-segment flex items-center gap-2 text-xs sm:text-sm"
            >
              <User className="w-4 h-4" />
              <span>User &amp; role setup ({userList.length})</span>
            </button>
            <button
              type="button"
              role="tab"
              onClick={() => setActiveSubTab('AUDIT')}
                aria-selected={activeSubTab === 'AUDIT'}
                className="action-segment flex items-center gap-2 text-xs sm:text-sm"
            >
              <Clock className="w-4 h-4" />
              <span>Audit action stream ({auditLogs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'USERS' ? (
        /* User & Allowed View Setup Matrix */
        <div className="space-y-4">
          {/* Add User Form */}
          <form onSubmit={handleAddUser} className="wayfinding-card p-5 space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Plus className="w-4 h-4 text-blue-800" />
              Register New System User &amp; Assign Role
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <label className="mb-1 block font-medium text-slate-700">User full name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Santos"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  disabled={!canEditUsers}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-normal text-slate-900 focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700">Assigned system role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(normalizeRole(e.target.value))}
                  disabled={!canEditUsers}
                  className="w-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-normal text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  {ROLE_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={!canEditUsers}
                  className="action-primary w-full rounded-lg text-xs sm:text-sm"
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
                <h3 className="text-sm font-semibold text-slate-900">
                  User access and allowed module view permissions
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {canEditUsers ? 'Click any user row or card to modify assigned role and module permissions' : 'Read-only view (Only Admin and DCS Chairman can edit user access)'}
                </p>
              </div>
              <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${canEditUsers ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                {canEditUsers ? '✓ Admin controls available' : '🔒 Read-only mode'}
              </span>
            </div>

            {/* Mobile Card List Layout for User Access Matrix */}
            <div className="block sm:hidden p-3.5 space-y-3 bg-slate-50/50">
              {userList.map((usr) => (
                <div
                  key={usr.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex justify-between items-center gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 text-blue-900 rounded-xl">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{usr.name}</span>
                    </div>
                    <span className="rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-950">
                      {usr.role}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-medium tracking-wider text-slate-500">
                      Allowed module views ({usr.allowedViews.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {usr.allowedViews.map((v) => (
                        <span
                          key={v}
                          className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active &bull; COSO Verified
                    </span>
                    <button type="button" onClick={() => handleOpenEditUser(usr)} className="action-quiet min-h-[44px] px-2 py-1 text-[11px] text-blue-700">
                      Edit access <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block table-responsive-wrapper">
              <table className="wayfinding-grid w-full text-left text-sm border-collapse">
                <caption className="sr-only">System users and role-derived module access</caption>
                <thead className="border-b border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700">
                  <tr>
                    <th scope="col" className="p-4">User Name</th>
                    <th scope="col" className="p-4">Role</th>
                    <th scope="col" className="p-4">Allowed Module Views</th>
                    <th scope="col" className="p-4 text-center">Account Security</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {userList.map((usr) => (
                    <tr
                      key={usr.id}
                      className="hover:bg-blue-50/50 transition group"
                    >
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditUser(usr);
                          }}
                          className="flex items-center gap-1.5 rounded-xl border border-blue-200/90 bg-blue-50/90 px-3 py-1.5 text-xs font-semibold text-blue-950 transition-all shadow-2xs group hover:bg-blue-900 hover:text-white sm:text-sm"
                          title="Click to inspect and edit user role & access permissions"
                        >
                          <User className="w-4 h-4 text-blue-700 group-hover:text-blue-200 shrink-0" />
                          <span>{usr.name}</span>
                          <Eye className="w-3.5 h-3.5 text-blue-600 group-hover:text-white shrink-0 ml-0.5 opacity-80 group-hover:opacity-100" />
                        </button>
                      </td>
                      <td className="p-4 text-sm font-semibold text-blue-950">{usr.role}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {usr.allowedViews.map((v) => (
                            <span key={v} className="rounded-xl border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs">
                              {v}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-900 shadow-2xs">
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
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Filter audit logs by user, timestamp, or action description..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-blue-800" />
                Audit Action Log Records
              </h3>
              <span className="font-mono text-xs font-medium text-slate-500">{filteredLogs.length} log entries</span>
            </div>

            <div className="divide-y divide-slate-200 text-xs sm:text-sm">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50 transition flex items-start gap-3">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-xl shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 font-semibold text-blue-900">
                        <User className="w-4 h-4 text-slate-500" />
                        {log.user}
                      </span>
                      <span className="font-mono text-xs text-slate-500 font-semibold">{log.time}</span>
                    </div>
                    <p className="font-medium text-slate-800">{log.action}</p>
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
        <AccessibleModal
          isOpen={Boolean(editingUserModal)}
          onClose={() => setEditingUserModal(null)}
          title={`User access matrix: ${editingUserModal.name}`}
          description="Review role-derived module access for this user."
          size="lg"
          contentClassName="text-slate-900"
        >
          <div className="modal-panel gap-6 p-6 text-slate-900 text-sm sm:p-8">
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
                    onChange={(e) => setEditRole(normalizeRole(e.target.value))}
                    disabled={!canEditUsers}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600 disabled:opacity-75 disabled:bg-slate-100 cursor-pointer"
                  >
                    {ROLE_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              </div>

              {/* Module View Permissions Checkboxes */}
              <div>
                <label className="font-bold text-slate-700 block mb-2 text-xs uppercase tracking-wider">
                   Role-derived module view permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  {ALL_AVAILABLE_MODULE_VIEWS.map((viewName) => {
                     const isChecked = getAllowedModuleViews(editRole).includes(viewName);
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
                          disabled
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
        </AccessibleModal>
      )}
    </div>
  );
};
