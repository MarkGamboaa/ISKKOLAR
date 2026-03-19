import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import kkfiLogo from "../../assets/KKFI LOGO.png";
import * as profileService from "../../services/profileService";

const ScholarHomeTab = ({ user }) => (
  <>
    <div className="hero-banner">
      <div className="hero-content">
        <div className="hero-greeting">
          <span className="greeting-label">Good day,</span>
          <h1>{user?.firstName} {user?.lastName}</h1>
          <span className="status-badge active">Active Scholar</span>
        </div>
      </div>
      <div className="hero-illustration">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z"/>
          <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z"/>
          <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z"/>
        </svg>
      </div>
    </div>

    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-icon purple">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        </div>
        <div className="stat-info"><h3>3rd Year</h3><p>BS Computer Science</p></div>
      </div>
      <div className="stat-card">
        <div className="stat-icon green">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div className="stat-info"><h3>1.75</h3><p>Current GWA</p></div>
      </div>
      <div className="stat-card">
        <div className="stat-icon blue">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <div className="stat-info"><h3>5</h3><p>Activities Done</p></div>
      </div>
      <div className="stat-card">
        <div className="stat-icon purple">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        </div>
        <div className="stat-info"><h3>2nd</h3><p>Current Term</p></div>
      </div>
    </div>

    <div className="section-header"><h2 className="section-title">Quick Links</h2></div>
    <div className="quick-links-grid">
      <div className="quick-link-card">
        <div className="quick-link-icon green">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
        </div>
        <span>Grade Compliance</span>
      </div>
      <div className="quick-link-card">
        <div className="quick-link-icon orange">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>
        </div>
        <span>Financial Records</span>
      </div>
      <div className="quick-link-card">
        <div className="quick-link-icon purple">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
        <span>My Profile</span>
      </div>
      <div className="quick-link-card">
        <div className="quick-link-icon blue">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <span>Activities</span>
      </div>
    </div>

    <div className="section-header"><h2 className="section-title">Scholar Services</h2><span className="section-link cursor-pointer hover:underline text-[#5b5f97]">View All</span></div>
    <div className="services-grid">
      <div className="service-card">
        <div className="service-icon purple">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </div>
        <div className="service-info"><h3>Scholarship Renewal</h3><p>Renew for AY 2026-2027</p></div>
        <div className="service-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </div>
      </div>
      <div className="service-card">
        <div className="service-icon blue">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
        </div>
        <div className="service-info"><h3>Board Exam Assistance</h3><p>Up to ₱12,000 support</p></div>
        <div className="service-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </div>
      </div>
    </div>
  </>
);

const ProfileTab = ({ user, logout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "" });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [changingPw, setChangingPw] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      const p = await profileService.getProfile();
      setProfile(p);
      setForm({ firstName: p?.firstName || "", lastName: p?.lastName || "" });
    } catch (err) { 
      console.error(err);
      if (user) {
        setProfile(user);
        setForm({ firstName: user.firstName, lastName: user.lastName });
      }
    }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await profileService.updateProfile(form);
      setProfile(updated);
      setEditing(false);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    setPwError("");
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError("Passwords do not match."); return; }
    if (pwForm.newPassword.length < 6) { setPwError("Password must be at least 6 characters."); return; }
    setPwSaving(true);
    try {
      await profileService.changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwSuccess("Password changed successfully!");
      setChangingPw(false);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPwSuccess(""), 3000);
    } catch (err) { setPwError(err.message); }
    finally { setPwSaving(false); }
  };

  const initials = profile ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() : "??";

  if (loading) return <div className="text-center p-[60px]"><div className="text-[40px]">⏳</div><p className="text-[#888]">Loading profile...</p></div>;
  if (!profile && !user) return <div className="text-center p-[60px]"><p>Profile could not be loaded.</p><button onClick={logout} className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl border border-red-500 bg-white text-red-500 text-[15px] font-semibold cursor-pointer mb-5 transition-all duration-200 hover:bg-red-50">Sign Out</button></div>;

  const currentProfile = profile || user;

  return (
    <div className="max-w-[640px] mx-auto">
      {successMsg && <div className="py-3 px-4 bg-[#dcfce7] text-[#16a34a] rounded-lg text-sm font-medium mb-4 text-center">{successMsg}</div>}
      {pwSuccess && <div className="py-3 px-4 bg-[#dcfce7] text-[#16a34a] rounded-lg text-sm font-medium mb-4 text-center">{pwSuccess}</div>}

      <div className="bg-white rounded-2xl p-6 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-5">
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#5b5f97] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-2xl shrink-0">{initials}</div>
          <div>
            <h2 className="text-xl font-bold text-[#1a1a2e] m-0">{currentProfile.firstName} {currentProfile.lastName}</h2>
            <p className="text-sm text-[#888] my-1">{currentProfile.email}</p>
            <span className="inline-block py-[3px] px-3 rounded-xl bg-[#ede9fe] text-[#5b5f97] text-xs font-semibold capitalize">{currentProfile.role || currentProfile.userType || "Scholar"}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-[#1a1a2e] m-0">Account Information</h3>
          {!editing && <button onClick={() => setEditing(true)} className="py-1.5 px-4 rounded-lg border border-[#5b5f97] bg-transparent text-[#5b5f97] text-[13px] font-medium cursor-pointer hover:bg-[#5b5f97] hover:text-white transition-colors">Edit</button>}
        </div>
        {editing ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#555]">First Name</label>
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="py-2.5 px-3.5 border border-[#e0e0e0] rounded-lg text-sm outline-none transition-colors duration-200 focus:border-[#5b5f97]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#555]">Last Name</label>
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="py-2.5 px-3.5 border border-[#e0e0e0] rounded-lg text-sm outline-none transition-colors duration-200 focus:border-[#5b5f97]" />
            </div>
            <div className="flex gap-3 mt-1">
              <button onClick={handleSave} disabled={saving} className="py-2.5 px-6 rounded-lg border-none bg-[#5b5f97] text-white text-sm font-semibold cursor-pointer disabled:opacity-50 hover:bg-[#4a4e7d] transition-colors">{saving ? "Saving..." : "Save Changes"}</button>
              <button onClick={() => { setEditing(false); setForm({ firstName: currentProfile.firstName, lastName: currentProfile.lastName }); }} className="py-2.5 px-6 rounded-lg border border-[#ddd] bg-white text-[#666] text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            <div className="flex justify-between items-center py-3 border-b border-[#f3f4f6]"><span className="text-sm text-[#888]">First Name</span><span className="text-sm font-medium text-[#1a1a2e]">{currentProfile.firstName}</span></div>
            <div className="flex justify-between items-center py-3 border-b border-[#f3f4f6]"><span className="text-sm text-[#888]">Last Name</span><span className="text-sm font-medium text-[#1a1a2e]">{currentProfile.lastName}</span></div>
            <div className="flex justify-between items-center py-3 border-b border-[#f3f4f6]"><span className="text-sm text-[#888]">Email</span><span className="text-sm font-medium text-[#1a1a2e]">{currentProfile.email}</span></div>
            <div className="flex justify-between items-center py-3 border-b border-[#f3f4f6]"><span className="text-sm text-[#888]">Role</span><span className="text-sm font-medium text-[#1a1a2e] capitalize">{currentProfile.role || currentProfile.userType || "Scholar"}</span></div>
            <div className="flex justify-between items-center py-3 border-b border-[#f3f4f6]"><span className="text-sm text-[#888]">Scholarship Type</span><span className="text-sm font-medium text-[#1a1a2e]">{currentProfile.scholarshipType || "N/A"}</span></div>
            <div className="flex justify-between items-center py-3 border-b border-[#f3f4f6]"><span className="text-sm text-[#888]">Status</span><span className={`text-sm font-medium capitalize ${currentProfile.status === 'active' ? 'text-[#16a34a]' : 'text-[#888]'}`}>{currentProfile.status || "active"}</span></div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-[#1a1a2e] m-0">Security</h3>
          {!changingPw && <button onClick={() => setChangingPw(true)} className="py-1.5 px-4 rounded-lg border border-[#5b5f97] bg-transparent text-[#5b5f97] text-[13px] font-medium cursor-pointer hover:bg-[#5b5f97] hover:text-white transition-colors">Change Password</button>}
        </div>
        {changingPw ? (
          <div className="flex flex-col gap-4">
            {pwError && <div className="py-3 px-4 bg-[#fee2e2] text-[#dc2626] rounded-lg text-sm font-medium">{pwError}</div>}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#555]">Current Password</label>
              <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="py-2.5 px-3.5 border border-[#e0e0e0] rounded-lg text-sm outline-none transition-colors duration-200 focus:border-[#5b5f97]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#555]">New Password</label>
              <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="py-2.5 px-3.5 border border-[#e0e0e0] rounded-lg text-sm outline-none transition-colors duration-200 focus:border-[#5b5f97]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#555]">Confirm New Password</label>
              <input type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} className="py-2.5 px-3.5 border border-[#e0e0e0] rounded-lg text-sm outline-none transition-colors duration-200 focus:border-[#5b5f97]" />
            </div>
            <div className="flex gap-3 mt-1">
              <button onClick={handleChangePassword} disabled={pwSaving} className="py-2.5 px-6 rounded-lg border-none bg-[#5b5f97] text-white text-sm font-semibold cursor-pointer disabled:opacity-50 hover:bg-[#4a4e7d] transition-colors">{pwSaving ? "Updating..." : "Update Password"}</button>
              <button onClick={() => { setChangingPw(false); setPwError(""); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }} className="py-2.5 px-6 rounded-lg border border-[#ddd] bg-white text-[#666] text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-[#888] text-sm m-0">Your password is securely stored. Click "Change Password" to update it.</p>
        )}
      </div>

      <button onClick={logout} className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl border border-red-500 bg-white text-red-500 text-[15px] font-semibold cursor-pointer mb-5 transition-all duration-200 hover:bg-red-50">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        Sign Out
      </button>
    </div>
  );
};

const ScholarDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "??";

  const navItems = [
    { key: "home", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { key: "activities", label: "Activities", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { key: "application", label: "Application", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { key: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-[100px]">
      {/* Top Header */}
      <header className="flex items-center justify-between py-[15px] px-[30px] bg-white border-b border-[#eee] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-[45px] h-[45px] rounded-full overflow-hidden bg-[#f8f9fc] flex items-center justify-center">
            <img src={kkfiLogo} alt="KKFI Logo" className="w-10 h-10 rounded-full object-cover" />
          </div>
          <span className="font-bold text-base text-[#5b5f97] tracking-[0.5px]">ISKKOLAR</span>
        </div>
        <div className="flex items-center gap-[15px]">
          <button onClick={() => setActiveTab("notification")} className="w-10 h-10 rounded-full border-none bg-[#f8f9fc] cursor-pointer flex items-center justify-center text-[#666] relative hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[22px] h-[22px]">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#e8315b] rounded-full"></span>
          </button>
          <div className="flex items-center gap-2.5 cursor-pointer py-1.5 pr-3 pl-1.5 rounded-[25px] transition-colors hover:bg-gray-100" onClick={() => setActiveTab("profile")}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5b5f97] to-[#8b5cf6] flex items-center justify-center text-white font-semibold text-[13px]">{initials}</div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#333]">{user?.firstName} {user?.lastName}</span>
              <span className="text-[11px] text-[#888]">Active Scholar</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-[25px] px-[30px] max-w-[1200px] mx-auto">
        {activeTab === "home" && <ScholarHomeTab user={user} />}
        {activeTab === "profile" && <ProfileTab user={user} logout={logout} />}
        {(activeTab === "activities" || activeTab === "application") && (
          <div className="text-center pt-[60px]">
            <div className="text-[56px]">🚧</div>
            <h2 className="text-[22px] font-bold text-[#1a1a2e] mt-3 capitalize">{activeTab}</h2>
            <p className="text-[#888]">Coming Soon</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <nav className="flex justify-around items-center bg-[#5b5f97] rounded-[20px] py-2.5 px-7 gap-6 shadow-[0_8px_30px_rgba(91,95,151,0.35)] pointer-events-auto min-w-[360px] max-w-[480px]">
          {navItems.map((item) => {
            const isActive = item.key === activeTab;
            return (
              <div 
                key={item.key} 
                onClick={() => setActiveTab(item.key)} 
                className={`flex flex-col items-center gap-1 cursor-pointer no-underline text-[11px] text-white transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
              >
                <div className={`flex items-center justify-center w-[38px] h-[38px] rounded-xl transition-colors duration-200 ${isActive ? 'bg-white/20' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                {isActive && <span className="font-semibold text-[11px]">{item.label}</span>}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default ScholarDashboard;

