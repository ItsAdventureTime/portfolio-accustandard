'use client';

import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  ShieldCheck,
  Clock,
  User,
  Filter,
} from 'lucide-react';

interface SystemAuditTrailProps {
  auditLogs: any[];
}

export const SystemAuditTrail: React.FC<SystemAuditTrailProps> = ({ auditLogs }) => {
  const [activeSubTab, setActiveSubTab] = useState<'AUDIT' | 'USERS'>('AUDIT');
  const [filterQuery, setFilterQuery] = useState('');

  // Initial Registered System Users & RBAC Permissions Matrix
  const [userList, setUserList] = useState([
    { id: 'usr-1', name: 'Dr. DCS (Chairman)', role: 'Chairman (DCS)', allowedViews: ['Overview', 'Inventory', 'Sales', 'SOA', 'Purchasing', 'RFP', 'Audit Trail'], status: 'ACTIVE' },
    { id: 'usr-2', name: 'Karen (General Manager)', role: 'General Manager', allowedViews: ['Overview', 'Inventory', 'Sales', 'SOA', 'Purchasing', 'RFP', 'Audit Trail'], status: 'ACTIVE' },
    { id: 'usr-3', name: 'Aila (Bookkeeper)', role: 'Bookkeeper', allowedViews: ['Overview', 'SOA', 'Purchasing', 'RFP'], status: 'ACTIVE' },
    { id: 'usr-4', name: 'Marie (Warehouse)', role: 'Warehouse', allowedViews: ['Inventory', 'Purchasing & Receiving'], status: 'ACTIVE' },
    { id: 'usr-5', name: 'RMT Katherine (Marketing)', role: 'Marketing', allowedViews: ['Overview', 'Sales Quotations'], status: 'ACTIVE' },
    { id: 'usr-6', name: 'Mark (Sales Officer)', role: 'Sales', allowedViews: ['Sales Quotations'], status: 'ACTIVE' },
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
    if (!newUserName.trim()) return;

    const newUser = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      role: newUserRole,
      allowedViews: newUserRole === 'Warehouse' ? ['Inventory', 'Purchasing & Receiving'] : ['Overview', 'Sales Quotations'],
      status: 'ACTIVE',
    };

    setUserList((prev) => [...prev, newUser]);
    setNewUserName('');
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-slate-700" />
            Admin Administration &amp; System Audit Trail
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            User Setup &amp; Allowed View Permissions &bull; Immutable Audit Logs &bull; COSO Security
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveSubTab('AUDIT')}
            className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition ${
              activeSubTab === 'AUDIT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Log Stream ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('USERS')}
            className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition ${
              activeSubTab === 'USERS' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            User &amp; Role Setup ({userList.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'USERS' ? (
        /* User & Allowed View Setup Matrix */
        <div className="space-y-4">
          {/* Add User Form */}
          <form onSubmit={handleAddUser} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
              Register New System User &amp; Assign Role
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">User Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Alex Santos"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
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
                  className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-lg transition"
                >
                  + Add System User
                </button>
              </div>
            </div>
          </form>

          {/* User Access Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                User Access &amp; Allowed Module View Permissions
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Allowed Module Views</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {userList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-slate-900">{usr.name}</td>
                      <td className="p-3 font-semibold text-blue-900">{usr.role}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {usr.allowedViews.map((v) => (
                            <span key={v} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {v}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black">
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
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter audit logs by user, timestamp, or action description..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

      {/* Audit Log Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            Audit Action Records
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">{filteredLogs.length} Log Entries</span>
        </div>

        <div className="divide-y divide-slate-200 text-xs">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-3.5 hover:bg-slate-50 transition flex items-start gap-3">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-xl shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    {log.user}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 font-semibold">{log.time}</span>
                </div>
                <p className="text-slate-800 font-medium">{log.action}</p>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-medium">
              No audit log entries matching &quot;{filterQuery}&quot;.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
