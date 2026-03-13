import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Badge from "../common/Badge";

const SettingsPanel = ({ user, onLogout }) => {
  const isAdmin = user?.role === "admin";
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  return (
    <div>
      <div className="dashboard-header mb-6">
        <h1 className="dashboard-title text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          {isAdmin ? "Admin Profile" : "Staff Profile"}
        </h3>

        <div className="flex gap-8">
          {/* Avatar Column */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-24 h-24 rounded-full bg-[#5b5f97] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
            <button className="px-4 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">
              Change Photo
            </button>
          </div>

          {/* Fields Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-700 transition-colors ${isEditingProfile ? 'border-gray-300 bg-white focus:outline-none focus:border-[#5b5f97]' : 'border-gray-200 bg-gray-50'}`} 
                defaultValue={user?.firstName || (isAdmin ? "Juan" : "Maria")} 
                readOnly={!isEditingProfile} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-700 transition-colors ${isEditingProfile ? 'border-gray-300 bg-white focus:outline-none focus:border-[#5b5f97]' : 'border-gray-200 bg-gray-50'}`} 
                defaultValue={user?.lastName || (isAdmin ? "Dela Cruz" : "Santos")} 
                readOnly={!isEditingProfile} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-700 transition-colors ${isEditingProfile ? 'border-gray-300 bg-white focus:outline-none focus:border-[#5b5f97]' : 'border-gray-200 bg-gray-50'}`} 
                defaultValue={user?.email || (isAdmin ? "admin@kkfi.org" : "staff@kkfi.org")} 
                readOnly={!isEditingProfile} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-700 transition-colors ${isEditingProfile ? 'border-gray-300 bg-white focus:outline-none focus:border-[#5b5f97]' : 'border-gray-200 bg-gray-50'}`} 
                defaultValue={isAdmin ? "+63 912 345 6789" : "+63 912 000 1023"} 
                readOnly={!isEditingProfile} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50" defaultValue={isAdmin ? "System Administrator" : "Authorized Staff"} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
              <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50" defaultValue={isAdmin ? "Jan 15, 2026 at 9:30 AM" : "Jan 15, 2026 at 10:15 AM"} readOnly />
            </div>
          </div>
        </div>

        {/* Actions Layer */}
        <div className="flex justify-end mt-6 gap-3">
          {isEditingProfile ? (
            <>
              <button 
                className="px-5 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                onClick={() => setIsEditingProfile(false)}
              >
                Cancel
              </button>
              <Button style={{ background: '#5b5f97', color: 'white' }} onClick={() => setIsEditingProfile(false)}>Save Profile Changes</Button>
            </>
          ) : (
            <Button style={{ background: '#5b5f97', color: 'white' }} onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
          )}
        </div>
      </div>

      <div className="dashboard-card mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="card-title text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">Security Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#5b5f97] mb-1">Current Password</label>
            <input className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#5b5f97]" type="password" placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5b5f97] mb-1">New Password</label>
            <input className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#5b5f97]" type="password" placeholder="Enter new password" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5b5f97] mb-1">Confirm New Password</label>
            <input className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#5b5f97]" type="password" placeholder="Confirm new password" />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button style={{ background: '#6b7280', color: 'white' }}>Update Password</Button>
        </div>
      </div>

      <div className="dashboard-card mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="card-title text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">Notification Preferences</h3>
        <div className="mt-2 space-y-3 text-sm text-gray-700">
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-[#5b5f97] rounded border-gray-300 focus:ring-[#5b5f97]" /> <span className="font-medium">Email notifications for new applications</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-[#5b5f97] rounded border-gray-300 focus:ring-[#5b5f97]" /> <span className="font-medium">Email notifications for compliance alerts</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-[#5b5f97] rounded border-gray-300 focus:ring-[#5b5f97]" /> <span className="font-medium">Email notifications for renewal submissions</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-[#5b5f97] rounded border-gray-300 focus:ring-[#5b5f97]" /> <span className="font-medium">SMS notifications for urgent matters</span></label>
        </div>
        <div className="flex justify-end mt-4">
          <Button style={{ background: '#5b5f97', color: 'white' }}>Save Preferences</Button>
        </div>
      </div>

      {isAdmin && (
        <>
          <div className="dashboard-card mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="card-title text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">System Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Minimum GPA Requirement" value="2.5" />
              <Input label="Required Events per Year" value="3" />
              <Input label="Income Threshold Limit" value="15,000" />
            </div>
            <div className="flex justify-end mt-4">
              <Button style={{ background: '#5b5f97', color: 'white' }}>Update System Settings</Button>
            </div>
          </div>

          <div className="dashboard-card mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="card-title text-lg font-semibold text-gray-800">Manage Admin Users</h3>
              <Button style={{ background: '#5b5f97', color: 'white' }}>+ Add New Admin User</Button>
            </div>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-gray-900 font-medium">Juan Dela Cruz</td>
                    <td className="px-4 py-4 text-gray-600">admin@kkfi.org</td>
                    <td className="px-4 py-4 text-gray-600">System Administrator</td>
                    <td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active</span></td>
                    <td className="px-4 py-4"><button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 text-xs font-medium">Edit</button></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-gray-900 font-medium">Maria Santos</td>
                    <td className="px-4 py-4 text-gray-600">maria.santos@kkfi.org</td>
                    <td className="px-4 py-4 text-gray-600">Authorized Staff</td>
                    <td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active</span></td>
                    <td className="px-4 py-4"><button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 text-xs font-medium">Edit</button></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-gray-900 font-medium">Pedro Reyes</td>
                    <td className="px-4 py-4 text-gray-600">pedro.reyes@kkfi.org</td>
                    <td className="px-4 py-4 text-gray-600">Authorized Staff</td>
                    <td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active</span></td>
                    <td className="px-4 py-4"><button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 text-xs font-medium">Edit</button></td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        </>
      )}

      <div className="flex justify-end mt-12 mb-8">
        <button onClick={onLogout} className="px-8 py-2.5 border border-red-200 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors">Logout</button>
      </div>
    </div>
  );
};

export default SettingsPanel;
