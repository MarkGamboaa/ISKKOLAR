import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import kkfiLogo from "../../assets/KKFI LOGO.png";
import * as profileService from "../../services/profileService";

const ApplicantHomeTab = () => {
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
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, margin: "8px 0 0", letterSpacing: 0.8, color: "#4f568e" }}>SCHOLARSHIPS PROGRAMS</h1>
      </div>

      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))" }}>
        {programs.map((program) => (
          <article key={program.title} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 22px rgba(27, 36, 63, 0.1)", border: "1px solid #eceff6" }}>
            <div style={{ backgroundImage: `linear-gradient(rgba(37, 54, 79, 0.0), rgba(37, 54, 79, 0.9)), url('${program.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 180, padding: 24, display: "flex", alignItems: "flex-end" }}>
              <h3 style={{ color: "#fff", margin: 0, fontWeight: 800, fontSize: 24, lineHeight: 1.2 }}>{program.title}</h3>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <p style={{ fontWeight: 800, fontSize: 17, margin: 0, color: "#253056" }}>{program.support}</p>
                <span style={{ fontSize: 13, color: "#8a8f9e" }}>{program.tag}</span>
              </div>
              <p style={{ margin: "10px 0 14px", fontSize: 14, color: "#70778a" }}>{program.requirement}</p>
              <p style={{ margin: 0, fontSize: 14, color: "#70778a", lineHeight: 1.6 }}>{program.desc}</p>
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

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 40 }}>⏳</div><p style={{ color: '#888' }}>Loading profile...</p></div>;
  if (!profile && !user) return <div style={{ textAlign: 'center', padding: 60 }}><p>Profile could not be loaded.</p><button onClick={logout} style={ps.logoutBtn}>Sign Out</button></div>;

  const currentProfile = profile || user;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {successMsg && <div style={ps.successBanner}>{successMsg}</div>}
      {pwSuccess && <div style={ps.successBanner}>{pwSuccess}</div>}

      <div style={ps.profileCard}>
        <div style={ps.profileHeader}>
          <div style={ps.avatarLarge}>{initials}</div>
          <div>
            <h2 style={ps.profileName}>{currentProfile.firstName} {currentProfile.lastName}</h2>
            <p style={ps.profileEmail}>{currentProfile.email}</p>
            <span style={ps.roleBadge}>{currentProfile.role || currentProfile.userType || "Applicant"}</span>
          </div>
        </div>
      </div>

      <div style={ps.sectionCard}>
        <div style={ps.sectionHeader}>
          <h3 style={ps.sectionTitle}>Account Information</h3>
          {!editing && <button onClick={() => setEditing(true)} style={ps.editBtn}>Edit</button>}
        </div>
        {editing ? (
          <div style={ps.formGrid}>
            <div style={ps.formGroup}>
              <label style={ps.label}>First Name</label>
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={ps.input} />
            </div>
            <div style={ps.formGroup}>
              <label style={ps.label}>Last Name</label>
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={ps.input} />
            </div>
            <div style={ps.btnRow}>
              <button onClick={handleSave} disabled={saving} style={ps.saveBtn}>{saving ? "Saving..." : "Save Changes"}</button>
              <button onClick={() => { setEditing(false); setForm({ firstName: currentProfile.firstName, lastName: currentProfile.lastName }); }} style={ps.cancelBtn}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={ps.infoGrid}>
            <div style={ps.infoRow}><span style={ps.infoLabel}>First Name</span><span style={ps.infoValue}>{currentProfile.firstName}</span></div>
            <div style={ps.infoRow}><span style={ps.infoLabel}>Last Name</span><span style={ps.infoValue}>{currentProfile.lastName}</span></div>
            <div style={ps.infoRow}><span style={ps.infoLabel}>Email</span><span style={ps.infoValue}>{currentProfile.email}</span></div>
            <div style={ps.infoRow}><span style={ps.infoLabel}>Role</span><span style={{ ...ps.infoValue, textTransform: 'capitalize' }}>{currentProfile.role || currentProfile.userType || "Applicant"}</span></div>
          </div>
        )}
      </div>

      <div style={ps.sectionCard}>
        <div style={ps.sectionHeader}>
          <h3 style={ps.sectionTitle}>Security</h3>
          {!changingPw && <button onClick={() => setChangingPw(true)} style={ps.editBtn}>Change Password</button>}
        </div>
        {changingPw ? (
          <div style={ps.formGrid}>
            {pwError && <div style={ps.errorBanner}>{pwError}</div>}
            <div style={ps.formGroup}>
              <label style={ps.label}>Current Password</label>
              <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} style={ps.input} />
            </div>
            <div style={ps.formGroup}>
              <label style={ps.label}>New Password</label>
              <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} style={ps.input} />
            </div>
            <div style={ps.formGroup}>
              <label style={ps.label}>Confirm New Password</label>
              <input type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} style={ps.input} />
            </div>
            <div style={ps.btnRow}>
              <button onClick={handleChangePassword} disabled={pwSaving} style={ps.saveBtn}>{pwSaving ? "Updating..." : "Update Password"}</button>
              <button onClick={() => { setChangingPw(false); setPwError(""); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }} style={ps.cancelBtn}>Cancel</button>
            </div>
          </div>
        ) : (
          <p style={{ color: '#888', fontSize: 14, margin: 0 }}>Your password is securely stored. Click "Change Password" to update it.</p>
        )}
      </div>

      <button onClick={logout} style={ps.logoutBtn}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        Sign Out
      </button>
    </div>
  );
};

const ps = {
  profileCard: { background: '#fff', borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  profileHeader: { display: 'flex', alignItems: 'center', gap: 20 },
  avatarLarge: { width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #5b5f97 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 24, flexShrink: 0 },
  profileName: { fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  profileEmail: { fontSize: 14, color: '#888', margin: '4px 0 8px' },
  roleBadge: { display: 'inline-block', padding: '3px 12px', borderRadius: 12, background: '#ede9fe', color: '#5b5f97', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' },
  sectionCard: { background: '#fff', borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 600, color: '#1a1a2e', margin: 0 },
  editBtn: { padding: '6px 16px', borderRadius: 8, border: '1px solid #5b5f97', background: 'transparent', color: '#5b5f97', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: 0 },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
  infoLabel: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 14, fontWeight: 500, color: '#1a1a2e' },
  formGrid: { display: 'flex', flexDirection: 'column', gap: 16 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: '#555' },
  input: { padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'border-color 0.2s' },
  btnRow: { display: 'flex', gap: 12, marginTop: 4 },
  saveBtn: { padding: '10px 24px', borderRadius: 8, border: 'none', background: '#5b5f97', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  cancelBtn: { padding: '10px 24px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', color: '#666', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  logoutBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 24px', borderRadius: 12, border: '1px solid #ef4444', background: '#fff', color: '#ef4444', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 20, transition: 'all 0.2s' },
  successBanner: { padding: '12px 16px', background: '#dcfce7', color: '#16a34a', borderRadius: 10, fontSize: 14, fontWeight: 500, marginBottom: 16, textAlign: 'center' },
  errorBanner: { padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: 10, fontSize: 14, fontWeight: 500 },
};

const ApplicantDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
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
    <div style={{ minHeight: '100vh', background: '#f8f9fc', paddingBottom: 100 }}>
      {/* Top Header */}
      <header style={styles.topbar}>
        <div style={styles.brandWrap}>
          <div style={styles.brandLogo}>
            <img src={kkfiLogo} alt="KKFI Logo" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <span style={styles.brandText}>ISKKOLAR</span>
        </div>
        <div style={styles.topbarRight}>
          <button onClick={() => setActiveTab("notification")} style={styles.notificationBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 22, height: 22 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span style={styles.notificationBadge}></span>
          </button>
          <div style={styles.userMenu} onClick={() => setActiveTab("profile")}>
            <div style={styles.userAvatar}>{initials}</div>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{user?.firstName} {user?.lastName}</span>
              <span style={styles.userRole}>Applicant</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {activeTab === "home" && <ApplicantHomeTab />}
        {activeTab === "profile" && <ProfileTab user={user} logout={logout} />}
        {(activeTab === "application" || activeTab === "notification") && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 56 }}>🚧</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginTop: 12, textTransform: 'capitalize' }}>{activeTab}</h2>
            <p style={{ color: '#888' }}>Coming Soon</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div style={styles.bottomNavWrapper}>
        <nav style={styles.bottomNav}>
          {navItems.map((item) => {
            const isActive = item.key === activeTab;
            return (
              <div key={item.key} onClick={() => setActiveTab(item.key)} style={{ ...styles.navItem, opacity: isActive ? 1 : 0.7 }}>
                <div style={{ ...styles.navIcon, ...(isActive ? styles.navIconActive : {}) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 20, height: 20 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                {isActive && <span style={styles.navLabel}>{item.label}</span>}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

const styles = {
  topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 30px', background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 50 },
  brandWrap: { display: 'flex', alignItems: 'center', gap: 12 },
  brandLogo: { width: 45, height: 45, borderRadius: '50%', overflow: 'hidden', background: '#f8f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandText: { fontWeight: 700, fontSize: 16, color: '#5b5f97', letterSpacing: 0.5 },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 15 },
  notificationBtn: { width: 40, height: 40, borderRadius: '50%', border: 'none', background: '#f8f9fc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', position: 'relative' },
  notificationBadge: { position: 'absolute', top: 6, right: 8, width: 8, height: 8, background: '#e8315b', borderRadius: '50%' },
  userMenu: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 12px 6px 6px', borderRadius: 25, transition: 'background 0.2s' },
  userAvatar: { width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #5b5f97 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 13 },
  userInfo: { display: 'flex', flexDirection: 'column' },
  userName: { fontSize: 13, fontWeight: 600, color: '#333' },
  userRole: { fontSize: 11, color: '#888' },
  mainContent: { padding: '25px 30px', maxWidth: 1200, margin: '0 auto' },
  bottomNavWrapper: { position: 'fixed', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 50, pointerEvents: 'none' },
  bottomNav: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: '#5b5f97', borderRadius: 20, padding: '10px 28px', gap: 24, boxShadow: '0 8px 30px rgba(91,95,151,0.35)', pointerEvents: 'auto', minWidth: 360, maxWidth: 480 },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', textDecoration: 'none', fontSize: 11, color: '#fff', transition: 'all 0.2s' },
  navIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, transition: 'background 0.2s' },
  navIconActive: { background: 'rgba(255,255,255,0.2)' },
  navLabel: { fontWeight: 600, fontSize: 11 },
};

export default ApplicantDashboard;
