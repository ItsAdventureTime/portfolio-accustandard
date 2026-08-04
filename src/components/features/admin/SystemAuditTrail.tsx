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
  const [filterQuery, setFilterQuery] = useState('');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(
      (log) =>
        log.user.toLowerCase().includes(filterQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
        log.time.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [auditLogs, filterQuery]);

  return (
    <div className="space-y-6">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-slate-700" />
            System Audit Trail &amp; Control Log Stream
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Immutable User Action Log &bull; COSO Internal Audit Trail &bull; Admin Supervision
          </p>
        </div>
      </div>

      {/* Filter Bar */}
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
      </div>
    </div>
  );
};
