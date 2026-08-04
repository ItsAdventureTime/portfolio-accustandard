'use client';

import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  ShieldCheck,
  Clock,
  User,
  Plus,
} from 'lucide-react';

interface SystemAuditTrailProps {
  auditLogs: any[];
  onShowNotification?: (msg: string) => void;
  onAddAuditLog?: (action: string) => void;
}

export const SystemAuditTrail: React.FC<SystemAuditTrailProps> = ({
  auditLogs,
  onShowNotification,
  onAddAuditLog,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'AUDIT' | 'USERS'>('USERS');
  const [filterQuery, setFilterQuery] = useState('');

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
      allowedViews: newUserRole === 'Warehouse' ? ['Inventory Control', 'Purchasing & Receiving'] : ['Executive Overview', 'Sales Quotation Generator'],
      status: 'ACTIVE',
    };

    setUserList((prev) => [...prev, newUser]);
    if (onShowNotification) onShowNotification(`Successfully registered user ${newUserName} as ${newUserRole}!`);
    if (onAddAuditLog) onAddAuditLog(`Registered new system user ${newUserName} with role ${newUserRole}`);
    setNewUserName('');
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-900" />
            Admin Administration &amp; System Audit Trail
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            User Setup &amp; Module Access Matrix &bull; COSO Internal Control Supervision &bull; Action Log Stream
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-200 p-1.5 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('USERS')}
            className={`px-4 py-2 rounded-lg font-extrabold text-xs sm:text-sm transition ${
              activeSubTab === 'USERS' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            User &amp; Role Setup ({userList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('AUDIT')}
            className={`px-4 py-2 rounded-lg font-extrabold text-xs sm:text-sm transition ${
              activeSubTab === 'AUDIT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Audit Action Stream ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'USERS' ? (
        /* User & Allowed View Setup Matrix */
        <div className="space-y-4">
          {/* Add User Form */}
          <form onSubmit={handleAddUser} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                User Access &amp; Allowed Module View Permissions
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
                  <tr>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Allowed Module Views</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                  {userList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-bold text-slate-900">{usr.name}</td>
                      <td className="p-4 font-extrabold text-blue-900">{usr.role}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {usr.allowedViews.map((v) => (
                            <span key={v} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold">
                              {v}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                          ACTIVE
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
    </div>
  );
};
