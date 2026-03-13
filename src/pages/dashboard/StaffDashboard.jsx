import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/layout/Sidebar";
import SearchInput from "../../components/common/SearchInput";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { PageSpinner } from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import SettingsPanel from "../../components/settings/SettingsPanel";
import * as accountService from "../../services/accountService";
import { Settings } from "lucide-react";

const SvgIcon = ({ d, sw = 2 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 20, height: 20 }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={d} />
  </svg>
);

// ─── Staff Dashboard Overview ──────────────────────────────────
const DashboardOverview = () => {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return (
    <>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Staff Dashboard</h1>
        <div className="dashboard-date">{today}</div>
      </div>

      <div className="metrics-row">
        <div className="metric-card"><div className="metric-icon scholars-icon"><SvgIcon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></div><div className="metric-details"><span className="metric-value">120</span><span className="metric-label">Total Scholars</span></div></div>
        <div className="metric-card"><div className="metric-icon applicants-icon"><SvgIcon d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></div><div className="metric-details"><span className="metric-value">42</span><span className="metric-label">Total Applicants</span><span className="metric-change neutral">18 pending review</span></div></div>
        <div className="metric-card"><div className="metric-icon renewals-icon"><SvgIcon d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></div><div className="metric-details"><span className="metric-value">23</span><span className="metric-label">Pending Renewals</span><span className="metric-change warning">8 due this week</span></div></div>
        <div className="metric-card"><div className="metric-icon docs-icon"><SvgIcon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></div><div className="metric-details"><span className="metric-value">15</span><span className="metric-label">Documents Pending</span><span className="metric-change neutral">Awaiting verification</span></div></div>
      </div>

      <div className="dashboard-grid">
        {/* Compliance */}
        <div className="dashboard-card">
          <h3 className="card-title">Compliance Status</h3>
          <div className="compliance-donut-container">
            <svg className="donut-chart" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e8eaf6" strokeWidth="10" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#dc3545" strokeWidth="10" strokeDasharray="12.57 251.33" strokeDashoffset="-238.76" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#ffc107" strokeWidth="10" strokeDasharray="18.85 251.33" strokeDashoffset="-219.91" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#28a745" strokeWidth="10" strokeDasharray="219.91 251.33" strokeDashoffset="0" transform="rotate(-90 50 50)" />
            </svg>
            <div className="compliance-center"><span className="compliance-pct">87.5%</span><span className="compliance-label">Compliant</span></div>
          </div>
          <div className="compliance-breakdown">
            <div className="compliance-item compliant"><span className="compliance-dot"></span><span className="compliance-text">Compliant</span><span className="compliance-count">105</span></div>
            <div className="compliance-item at-risk"><span className="compliance-dot"></span><span className="compliance-text">At Risk</span><span className="compliance-count">9</span></div>
            <div className="compliance-item non-compliant"><span className="compliance-dot"></span><span className="compliance-text">Non-Compliant</span><span className="compliance-count">6</span></div>
          </div>
        </div>

        {/* Top Scholars */}
        <div className="dashboard-card">
          <h3 className="card-title">Top Scholars by GWA</h3>
          <div className="scholars-list">
            {[{ rank: 1, i: "MC", n: "Maria Cruz Dela Rosa", p: "BS Computer Science", g: "1.25" },
            { rank: 2, i: "CN", n: "Carlo Navarro Flores", p: "BS Engineering", g: "1.35" },
            { rank: 3, i: "AM", n: "Ana Mendoza Villanueva", p: "BS Nursing", g: "1.45" },
            ].map((s) => (
              <div key={s.rank} className="scholar-row"><span className="scholar-rank">{s.rank}</span><div className="scholar-avatar">{s.i}</div><div className="scholar-info"><span className="scholar-name">{s.n}</span><span className="scholar-program">{s.p}</span></div><span className="scholar-gwa">{s.g}</span></div>
            ))}
          </div>
        </div>

        {/* By Course */}
        <div className="dashboard-card">
          <h3 className="card-title">Scholars by Course</h3>
          <div className="horizontal-bar-chart compact">
            {[{ l: "BS Computer Science", w: "85%", v: 42, c: "dark" }, { l: "BS Engineering", w: "75%", v: 38, c: "" }, { l: "BS Nursing", w: "65%", v: 32, c: "" }, { l: "BS Accountancy", w: "55%", v: 28, c: "light" }, { l: "BS Education", w: "50%", v: 25, c: "light" }].map((b) => (
              <div key={b.l} className="bar-item"><span className="bar-label">{b.l}</span><div className="bar-container"><div className={`bar ${b.c}`} style={{ width: b.w }}></div></div><span className="bar-value">{b.v}</span></div>
            ))}
          </div>
        </div>

        {/* Top Compliant */}
        <div className="dashboard-card wide-card">
          <h3 className="card-title">Top Compliant Students</h3>
          <div className="compliant-list">
            {[{ rank: 1, i: "AR", n: "Ana Reyes Santos", p: "BS Nursing - PLM", s: "100%", b: "Always On Time" },
            { rank: 2, i: "JM", n: "Juan Miguel Garcia", p: "BS Accountancy - PUP", s: "100%", b: "Always On Time" },
            { rank: 3, i: "RL", n: "Roberto Lim Tan", p: "BS Civil Eng - TUP", s: "96%", b: null },
            ].map((s) => (
              <div key={s.rank} className="compliant-row"><span className="compliant-rank">{s.rank}</span><div className="compliant-avatar">{s.i}</div><div className="compliant-info"><span className="compliant-name">{s.n}</span><span className="compliant-program">{s.p}</span></div><div className="compliant-stats"><span className="compliant-score">{s.s}</span>{s.b && <span className="compliant-badge on-time">{s.b}</span>}</div></div>
            ))}
          </div>
        </div>

        {/* Graduation Rate */}
        <div className="dashboard-card">
          <h3 className="card-title">Graduation Rate</h3>
          <div className="graduation-donut-container">
            <svg className="donut-chart" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e8eaf6" strokeWidth="10" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#5b5f97" strokeWidth="10" strokeDasharray="218.69 251.33" strokeDashoffset="0" transform="rotate(-90 50 50)" />
            </svg>
            <div className="graduation-center"><span className="graduation-pct">87%</span><span className="graduation-label">Success Rate</span></div>
          </div>
          <div className="graduation-stats">
            <div className="grad-stat"><span className="grad-stat-value">104</span><span className="grad-stat-label">Graduated</span></div>
            <div className="grad-stat"><span className="grad-stat-value">12</span><span className="grad-stat-label">In Progress</span></div>
            <div className="grad-stat"><span className="grad-stat-value">4</span><span className="grad-stat-label">Discontinued</span></div>
          </div>
        </div>

        {/* By Type */}
        <div className="dashboard-card">
          <h3 className="card-title">Scholars by Type</h3>
          <div className="scholarship-types">
            <div className="type-item"><div className="type-icon tertiary"><SvgIcon d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></div><div className="type-details"><span className="type-name">Tertiary Scholarship</span><span className="type-desc">College & University</span></div><span className="type-count">72</span></div>
            <div className="type-item"><div className="type-icon employee"><SvgIcon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></div><div className="type-details"><span className="type-name">Employee-Child Grant</span><span className="type-desc">Dependents of Employees</span></div><span className="type-count">28</span></div>
            <div className="type-item"><div className="type-icon vocational"><SvgIcon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></div><div className="type-details"><span className="type-name">Vocational Scholarship</span><span className="type-desc">Technical & Skills Training</span></div><span className="type-count">20</span></div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── View Modal ─────────────────────────────────────────────────
const ViewUserModal = ({ isOpen, onClose, user, isApplicant }) => {
  if (!user) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isApplicant ? "Applicant Details" : "Scholar Details"} size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center"><span className="text-white text-lg font-bold">{user.firstName?.[0]}{user.lastName?.[0]}</span></div>
          <div><h3 className="text-lg font-bold text-gray-900">{user.firstName} {user.lastName}</h3><p className="text-sm text-gray-500">{user.email}</p></div>
        </div>
        {[{ l: "Role", v: user.role }, { l: "Type", v: user.scholarshipType || "N/A" }, { l: "Status", v: user.status }].map((f) => (
          <div key={f.l} className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-sm text-gray-500">{f.l}</span><span className="text-sm font-medium text-gray-900 capitalize">{f.v}</span></div>
        ))}
      </div>
      <div className="mt-6"><Button variant="secondary" onClick={onClose} fullWidth>Close</Button></div>
    </Modal>
  );
};



// ─── Main Staff Dashboard ───────────────────────────────────────
const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scholars, setScholars] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, a] = await Promise.all([accountService.getScholars(), accountService.getApplicants()]);
      setScholars(s);
      setApplicants(a);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isApplicants = activeTab === "applicants";
  const currentData = isApplicants ? applicants : scholars;
  const filteredData = currentData.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const statusVariants = { pending: "warning", "under review": "info", approved: "success", rejected: "danger", active: "success", inactive: "default" };

  const sidebarSections = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", active: activeTab === "dashboard", onClick: () => setActiveTab("dashboard"), icon: <SvgIcon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
        { label: "Scholars", active: activeTab === "scholars", onClick: () => setActiveTab("scholars"), icon: <SvgIcon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
        { label: "Applicants", active: activeTab === "applicants", onClick: () => setActiveTab("applicants"), icon: <SvgIcon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
        { label: "Compliance", active: activeTab === "compliance", onClick: () => setActiveTab("compliance"), icon: <SvgIcon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
        { label: "Renewals", active: activeTab === "renewals", onClick: () => setActiveTab("renewals"), icon: <SvgIcon d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /> },
        { label: "Announcements", active: activeTab === "announcements", onClick: () => setActiveTab("announcements"), icon: <SvgIcon d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> },
      ],
    },
    {
      title: "Records",
      items: [
        { label: "Financial", active: activeTab === "financial", onClick: () => setActiveTab("financial"), icon: <SvgIcon d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { label: "Reports", active: activeTab === "reports", onClick: () => setActiveTab("reports"), icon: <SvgIcon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        sections={sidebarSections}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        footerAction={{
          label: "Settings",
          onClick: () => setActiveTab("settings"),
          icon: <Settings size={18} />,
        }}
      />

      <main style={{ flex: 1, marginLeft: 220, padding: 30, minHeight: '100vh', background: '#f8f9fc' }}>
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md" aria-label="Open sidebar">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>

        {activeTab === "dashboard" && <DashboardOverview />}

        {(activeTab === "scholars" || activeTab === "applicants") && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{isApplicants ? "Applicants" : "Scholar Accounts"}</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email..." className="flex-1" />
            </div>
            {loading ? <PageSpinner /> : filteredData.length === 0 ? (
              <div className="text-center py-16"><div className="text-5xl mb-4">📋</div><h3 className="text-lg font-semibold text-gray-900 mb-1">No records found</h3></div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-160">
                  <thead><tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Full Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{isApplicants ? "Application" : "Status"}</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">{filteredData.map((u, i) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"><span className="text-xs font-bold text-primary">{u.firstName?.[0]}{u.lastName?.[0]}</span></div><span className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</span></div></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{u.scholarshipType || "—"}</td>
                      <td className="px-4 py-3"><Badge variant={statusVariants[isApplicants ? u.applicationStatus : u.status] || "default"} label={isApplicants ? u.applicationStatus : u.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setViewUser(u)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors" title="View">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "settings" && <SettingsPanel user={user} onLogout={logout} />}

        {!["dashboard", "scholars", "applicants", "settings"].includes(activeTab) && (
          <div className="text-center py-20"><div className="text-6xl mb-4">🚧</div><h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ textTransform: 'capitalize' }}>{activeTab}</h2><p className="text-gray-500">Coming Soon</p></div>
        )}
      </main>

      <ViewUserModal isOpen={!!viewUser} onClose={() => setViewUser(null)} user={viewUser} isApplicant={isApplicants} />
    </div>
  );
};

export default StaffDashboard;
