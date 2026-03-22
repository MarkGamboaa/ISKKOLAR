import React from "react";
import Badge from "../../common/Badge";
import { PageSpinner } from "../../common/Spinner";

const ApplicantsTable = ({ users, loading: isLoading, onView }) => {
  if (isLoading) return <PageSpinner />;
  if (!users || users.length === 0) {
    return (<div className="text-center py-16"><div className="text-5xl mb-4">📋</div><h3 className="text-lg font-semibold text-gray-900 mb-1">No applicants found</h3><p className="text-sm text-gray-500">There are no applicants to display yet.</p></div>);
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-160">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Full Name</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date Applied</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u, i) => {
            const dateApplied = u.applicationStatus === 'for review' && u.applicationSubmittedAt
              ? new Date(u.applicationSubmittedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
              : "—";
            const statusVariantMap = {
              pending: "default",
              "for review": "warning",
              approved: "success",
              rejected: "danger",
            };
            const statusKey = (u.applicationStatus || "").toLowerCase();
            const badgeVariant = statusVariantMap[statusKey] ?? "default";

            const statusLabel = u.applicationStatus
              ? u.applicationStatus.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
              : "Pending";
            return (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"><span className="text-xs font-bold text-primary">{u.firstName?.[0]}{u.lastName?.[0]}</span></div><span className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</span></div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{dateApplied}</td>
                <td className="px-4 py-3"><Badge variant={badgeVariant} label={statusLabel} /></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onView(u)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors" title="View">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantsTable;
