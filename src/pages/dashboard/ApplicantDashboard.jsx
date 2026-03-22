import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import kkfiLogo from "../../assets/KKFI LOGO.png";
import ErrorModal from "../../components/common/ErrorModal";
import { hasOngoingScholarshipApplication } from "../../services/vocationalService";

// Forms
import TertiaryScholarshipForm from "../../components/forms/TertiaryScholarshipForm";
import StaffEducationalForm from "../../components/forms/StaffEducationalForm";
import VocationalScholarshipForm from "../../components/forms/VocationalScholarshipForm";

// Dashboard components
import ProfileTab from "../../components/dashboard/ProfileTab";
import { PROGRAMS } from "../../components/dashboard/applicant/programData";
import ApplicantHomeTab from "../../components/dashboard/applicant/ApplicantHomeTab";
import TertiaryProgramDetail from "../../components/dashboard/applicant/TertiaryProgramDetail";
import EmployeeChildDetail from "../../components/dashboard/applicant/EmployeeChildDetail";
import VocationalDetail from "../../components/dashboard/applicant/VocationalDetail";
import ApplicationTab from "../../components/dashboard/applicant/ApplicationTab";

const VALID_TABS = ["home", "application", "notification", "profile"];

const ApplicantDashboard = () => {
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawTab = searchParams.get("tab") || "home";
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : "home";
  const programSlug = searchParams.get("program");
  const selectedProgram = programSlug ? PROGRAMS.find(p => p.slug === programSlug) || null : null;
  const isApplying = searchParams.get("view") === "apply" && selectedProgram !== null;
  const [applyError, setApplyError] = useState("");

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "??";

  const navItems = [
    { key: "home", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { key: "application", label: "Application", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { key: "notification", label: "Notification", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { key: "profile", label: "Account", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  const renderFormForProgram = () => {
    const handleSubmitted = () => setSearchParams({ tab: "application" });

    switch (programSlug) {
      case "tertiary":
        return <TertiaryScholarshipForm onBack={() => setSearchParams({ program: programSlug })} onSubmitted={handleSubmitted} />;
      case "employee-child":
        return <StaffEducationalForm onBack={() => setSearchParams({ program: programSlug })} />;
      case "vocational":
        return <VocationalScholarshipForm onBack={() => setSearchParams({ program: programSlug })} onSubmitted={handleSubmitted} />;
      default:
        return null;
    }
  };

  const renderDetailForProgram = () => {
    const handleApply = async () => {
      try {
        const { hasOngoing, ongoingApplication } = await hasOngoingScholarshipApplication();

        if (hasOngoing) {
          const applicationType = String(ongoingApplication?.application_type || "scholarship").replaceAll("_", " ");
          const status = String(ongoingApplication?.status || "pending").replaceAll("_", " ");
          setApplyError(`You already have an ongoing ${applicationType} application (${status}). Please wait until it is completed before applying again.`);
          return;
        }

        setSearchParams({ program: programSlug, view: "apply" });
      } catch {
        setApplyError("Unable to check your current applications right now. Please try again.");
      }
    };

    switch (programSlug) {
      case "tertiary":
        return <TertiaryProgramDetail onApply={handleApply} />;
      case "employee-child":
        return <EmployeeChildDetail onApply={handleApply} />;
      case "vocational":
        return <VocationalDetail onApply={handleApply} />;
      default:
        return null;
    }
  };

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
          <button onClick={() => setSearchParams({ tab: "notification" })} className="w-10 h-10 rounded-full border-none bg-[#f8f9fc] cursor-pointer flex items-center justify-center text-[#666] relative hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[22px] h-[22px]">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#e8315b] rounded-full"></span>
          </button>
          <div className="flex items-center gap-2.5 cursor-pointer py-1.5 pr-3 pl-1.5 rounded-[25px] transition-colors hover:bg-gray-100" onClick={() => setSearchParams({ tab: "profile" })}>
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
          <ApplicantHomeTab onSelectProgram={(program) => setSearchParams({ program: program.slug })} />
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
                    onClick={() => setSearchParams({})}
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

                {renderDetailForProgram()}
              </>
            )}

            {isApplying && (
              <div className="w-full">
                {renderFormForProgram()}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && <ProfileTab user={user} logout={logout} />}
        {activeTab === "application" && (
          <ApplicationTab onBrowse={() => setSearchParams({})} />
        )}
        {activeTab === "notification" && (
          <div className="text-center pt-[60px]">
            <div className="text-[56px]">&#x1F6A7;</div>
            <h2 className="text-[22px] font-bold text-[#1a1a2e] mt-3 capitalize">Notification</h2>
            <p className="text-[#888]">Coming Soon</p>
          </div>
        )}
      </main>

      <ErrorModal
        isOpen={Boolean(applyError)}
        onClose={() => setApplyError("")}
        title="Application Blocked"
        message={applyError}
      />

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <nav className="flex justify-around items-center bg-[#5b5f97] rounded-[20px] py-2.5 px-7 gap-6 shadow-[0_8px_30px_rgba(91,95,151,0.35)] pointer-events-auto min-w-[360px] max-w-[480px]">
          {navItems.map((item) => {
            const isActive = item.key === activeTab && !selectedProgram;
            return (
              <div
                key={item.key}
                onClick={() => setSearchParams(item.key === "home" ? {} : { tab: item.key })}
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
