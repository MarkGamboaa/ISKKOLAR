import { useState, useEffect, useCallback } from "react";
import * as profileService from "../../services/profileService";

const ProfileTab = ({ user, logout, defaultRoleLabel = "Applicant", extraAccountFields }) => {
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

  if (loading) return <div className="text-center p-[60px]"><div className="text-[40px]">&#x23F3;</div><p className="text-[#888]">Loading profile...</p></div>;
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
            <span className="inline-block py-[3px] px-3 rounded-xl bg-[#ede9fe] text-[#5b5f97] text-xs font-semibold capitalize">{currentProfile.role || currentProfile.userType || defaultRoleLabel}</span>
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
            <div className="flex justify-between items-center py-3 border-b border-[#f3f4f6]"><span className="text-sm text-[#888]">Role</span><span className="text-sm font-medium text-[#1a1a2e] capitalize">{currentProfile.role || currentProfile.userType || defaultRoleLabel}</span></div>
            {extraAccountFields && extraAccountFields(currentProfile)}
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

export default ProfileTab;
