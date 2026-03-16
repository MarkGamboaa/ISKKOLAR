const APPLICATION_STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "approved", label: "Approved" },
];

const ApplicationEmpty = ({ onBrowse }) => (
  <div className="flex flex-col items-center justify-center pt-16 pb-8">
    <div className="w-24 h-24 rounded-full bg-[#f0eef9] flex items-center justify-center mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#5b5f97" className="w-11 h-11">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Nothing to see here... Yet!</h2>
    <p className="text-gray-500 text-sm text-center max-w-sm mb-8 leading-relaxed">
      You haven't submitted a scholarship application. Start your application now to be considered for the KKFI scholarship program.
    </p>
    <button
      onClick={onBrowse}
      className="py-3 px-8 bg-[#5b5f97] text-white rounded-xl font-semibold hover:bg-[#4a4e7d] transition-colors cursor-pointer border-none"
    >
      Browse Scholarships
    </button>
  </div>
);

const ApplicationCard = ({ application }) => {
  const currentStepIndex = APPLICATION_STEPS.findIndex(s => s.key === application.status);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      {/* Card Header */}
      <div
        className="p-6 flex items-end min-h-[120px]"
        style={{
          backgroundImage: `linear-gradient(rgba(37, 54, 79, 0.3), rgba(91, 95, 151, 0.95)), url('${application.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium backdrop-blur-sm mb-2">
            {application.tag}
          </span>
          <h3 className="text-white text-lg font-bold m-0">{application.title}</h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Your scholarship application is currently in progress. Please wait for further updates.
        </p>

        {/* Status Tracker */}
        <div className="flex items-center justify-between mb-3">
          {APPLICATION_STEPS.map((step, i) => {
            const isCompleted = i <= currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors
                    ${isCompleted ? "bg-[#5b5f97] text-white" : "bg-gray-200 text-gray-400"}`}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-xs font-medium ${isCurrent ? "text-[#5b5f97]" : isCompleted ? "text-[#3d4076]" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#5b5f97] rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / APPLICATION_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const ApplicationTab = ({ onBrowse }) => {
  // Mock data — replace with real data when backend is ready
  const applications = [];

  if (applications.length === 0) {
    return <ApplicationEmpty onBrowse={onBrowse} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[#4f568e] mb-6">My Applications</h1>
      <div className="space-y-4">
        {applications.map((app, i) => (
          <ApplicationCard key={i} application={app} />
        ))}
      </div>
    </div>
  );
};

export default ApplicationTab;
