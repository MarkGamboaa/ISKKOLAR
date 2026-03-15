import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import kkfiLogo from "../../assets/KKFI LOGO.png";
import * as profileService from "../../services/profileService";
import TertiaryScholarshipForm from "../../components/forms/TertiaryScholarshipForm";

const ApplicantHomeTab = ({ onSelectProgram }) => {
  const programs = [
    {
      title: "TERTIARY SCHOLARSHIP PROGRAM",
      support: "Up to P30,000/year",
      tag: "Full Academic Year",
      requirement: "GWA: 85% and above",
      desc: "Support for Filipino state university students to empower future leaders across the regions.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600&h=300",
      gradient: "linear-gradient(135deg, #4f6d7a, #25364f)",
    },
    {
      title: "KKFI EMPLOYEE-CHILD EDUCATION GRANT",
      support: "Up to P30,000/year",
      tag: "Tuition Support",
      requirement: "Staff and Family",
      desc: "Educational support for regular KKFI employees, a slot for personal professional growth or a relative's studies.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600&h=300",
      gradient: "linear-gradient(135deg, #3f5871, #324158)",
    },
    {
      title: "VOCATIONAL AND TECHNOLOGY SCHOLARSHIP",
      support: "Up to P65,000",
      tag: "Skill Development",
      requirement: "Certification",
      desc: "Practical skills-based scholarship for Filipinos, to fast-track employment and sustainable livelihoods.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=300",
      gradient: "linear-gradient(135deg, #5f738d, #2e3f57)",
    },
  ];

  return (
    <section>
      <div className="text-center mb-6">
        <h1 className="text-[42px] font-extrabold mt-2 tracking-[0.8px] text-[#4f568e]">SCHOLARSHIPS PROGRAMS</h1>
      </div>

      <div className="grid gap-[18px] grid-cols-[repeat(auto-fit,minmax(270px,1fr))]">
        {programs.map((program) => (
          <article 
            key={program.title} 
            onClick={() => {
              if (program.title === "TERTIARY SCHOLARSHIP PROGRAM") {
                onSelectProgram(program);
              }
            }}
            className={`bg-white rounded-2xl overflow-hidden shadow-[0_10px_22px_rgba(27,36,63,0.1)] border border-[#eceff6] transition-transform duration-200 ${program.title === "TERTIARY SCHOLARSHIP PROGRAM" ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(27,36,63,0.15)]' : 'cursor-default opacity-80'}`}
          >
            <div 
              className="bg-cover bg-center min-h-[180px] p-6 flex items-end"
              style={{ backgroundImage: `linear-gradient(rgba(37, 54, 79, 0.0), rgba(37, 54, 79, 0.9)), url('${program.image}')` }}
            >
              <h3 className="text-white m-0 font-extrabold text-2xl leading-[1.2]">{program.title}</h3>
            </div>
            <div className="py-5 px-6">
              <div className="flex justify-between items-baseline gap-3">
                <p className="font-extrabold text-[17px] m-0 text-[#253056]">{program.support}</p>
                <span className="text-[13px] text-[#8a8f9e]">{program.tag}</span>
              </div>
              <p className="my-2.5 text-sm text-[#70778a]">{program.requirement}</p>
              <p className="m-0 text-sm text-[#70778a] leading-[1.6] mb-2">{program.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

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
            <span className="inline-block py-[3px] px-3 rounded-xl bg-[#ede9fe] text-[#5b5f97] text-xs font-semibold capitalize">{currentProfile.role || currentProfile.userType || "Applicant"}</span>
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
            <div className="flex justify-between items-center py-3 border-b border-[#f3f4f6]"><span className="text-sm text-[#888]">Role</span><span className="text-sm font-medium text-[#1a1a2e] capitalize">{currentProfile.role || currentProfile.userType || "Applicant"}</span></div>
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

const ApplicantDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "??";

  const navItems = [
    { key: "home", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { key: "application", label: "Application", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { key: "notification", label: "Notification", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { key: "profile", label: "Account", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#e8315b] rounded-full"></span>
          </button>
          <div className="flex items-center gap-2.5 cursor-pointer py-1.5 pr-3 pl-1.5 rounded-[25px] transition-colors hover:bg-gray-100" onClick={() => setActiveTab("profile")}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5b5f97] to-[#8b5cf6] flex items-center justify-center text-white font-semibold text-[13px]">{initials}</div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#333]">{user?.firstName} {user?.lastName}</span>
              <span className="text-[11px] text-[#888]">Applicant</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-[25px] px-[30px] max-w-[1200px] mx-auto">
        {activeTab === "home" && !selectedProgram && (
          <ApplicantHomeTab onSelectProgram={setSelectedProgram} />
        )}

        {activeTab === "home" && selectedProgram && (
          <div className="max-w-4xl mx-auto space-y-6">
            {!isApplying && (
              <>
                {/* Program Header */}
                <div 
                  className="relative rounded-2xl overflow-hidden h-48 md:h-64 flex items-end p-8"
                  style={{ backgroundImage: `linear-gradient(rgba(91, 95, 151, 0.2), rgba(91, 95, 151, 0.9)), url('${selectedProgram.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <button 
                    onClick={() => {
                      setSelectedProgram(null);
                      setIsApplying(false);
                    }}
                    className="absolute top-6 left-6 text-white font-medium flex items-center gap-2 hover:underline cursor-pointer bg-transparent border-none p-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Scholarships
                  </button>
                  
                  <div>
                    <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-3">{selectedProgram.title}</h1>
                    <span className="inline-block px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                      {selectedProgram.tag}
                    </span>
                  </div>
                </div>

                {/* Overview content */}
                <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <h2 className="text-xl font-bold text-[#3d4076] border-b border-gray-100 pb-4 mb-6">Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#f8f9fc] p-5 rounded-xl">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Grant Amount</span>
                      <p className="text-[#3d4076] font-bold mt-1">{selectedProgram.support}</p>
                    </div>
                    <div className="bg-[#f8f9fc] p-5 rounded-xl">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration</span>
                      <p className="text-[#3d4076] font-bold mt-1">1 Academic Year</p>
                    </div>
                    <div className="bg-[#f8f9fc] p-5 rounded-xl">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Application Deadline</span>
                      <p className="text-[#3d4076] font-bold mt-1">March 31, 2026</p>
                    </div>
                    <div className="bg-[#f8f9fc] p-5 rounded-xl">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
                      <p className="text-[#5b5f97] font-bold mt-1">Open for Application</p>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-8">{selectedProgram.desc} This program aims to provide financial assistance to deserving students who demonstrate academic excellence and commitment to community service.</p>

                  <h2 className="text-xl font-bold text-[#3d4076] border-b border-gray-100 pb-4 mb-6">Requirements</h2>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-[#21cf81] mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                      </span>
                      <span className="text-gray-600">Must be a Filipino citizen</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#21cf81] mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                      </span>
                      <span className="text-gray-600">{selectedProgram.requirement}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#21cf81] mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                      </span>
                      <span className="text-gray-600">Currently enrolled in a state university or college</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#21cf81] mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                      </span>
                      <span className="text-gray-600">Proof of family income (not exceeding ₱250,000 annually)</span>
                    </li>
                  </ul>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setIsApplying(true)}
                      className="py-3.5 px-8 bg-[#5b5f97] text-white rounded-xl font-semibold hover:bg-[#4a4e7d] transition-colors cursor-pointer border-none"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </>
            )}

            {isApplying && (
              <div className="w-full">
                <TertiaryScholarshipForm onBack={() => setIsApplying(false)} />
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && <ProfileTab user={user} logout={logout} />}
        {(activeTab === "application" || activeTab === "notification") && (
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

export default ApplicantDashboard;
