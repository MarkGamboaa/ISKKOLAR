import { CheckIcon, SectionIcon } from "./Icons";

const TertiaryProgramDetail = ({ onApply }) => (
  <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
    <span className="inline-block px-3 py-1 bg-[#ede9fe] text-[#5b5f97] rounded-full text-xs font-semibold mb-4">KKFI Tertiary Program</span>

    {/* Background */}
    <div className="border-l-4 border-[#5b5f97] pl-5 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#5b5f97]"><SectionIcon d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></span>
        <h2 className="text-lg font-bold text-[#3d4076] m-0">Background</h2>
      </div>
      <p className="text-gray-600 leading-relaxed m-0">
        Supporting students across the Philippines to overcome financial barriers and achieve their dreams of higher education in public state universities
      </p>
    </div>

    {/* Eligibility */}
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#5b5f97]"><SectionIcon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></span>
        <h2 className="text-lg font-bold text-[#3d4076] m-0">Eligibility</h2>
      </div>
      <ul className="space-y-3">
        {[
          "Filipino Citizen",
          "Incoming or Current College Student",
          "GWA 85% or 2.25 Above",
          "Public State University",
          "Family Income should not exceed Thirty Thousand Pesos (₱30,000)",
        ].map((req, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-[#21cf81] mt-0.5"><CheckIcon /></span>
            <span className="text-gray-600">{req}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* How to Apply */}
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#5b5f97]"><SectionIcon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></span>
        <h2 className="text-lg font-bold text-[#3d4076] m-0">How to Apply</h2>
      </div>
      <div className="space-y-4">
        {[
          { step: 1, text: "Download Required Forms" },
          { step: 2, text: "Fill Out & Have Forms Signed" },
          { step: 3, text: "Submit Application Online" },
          { step: 4, text: "Wait for Review" },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#5b5f97] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{step}</div>
            <span className="text-gray-600">{text}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Download Forms */}
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#5b5f97]"><SectionIcon d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></span>
        <h2 className="text-lg font-bold text-[#3d4076] m-0">Download Forms</h2>
      </div>
      <div className="space-y-3">
        {[
          { name: "Certificate of Indigency Form", label: "Download Form" },
          { name: "Recommendation Letter Form", label: "Download Form" },
          { name: "Essay Template", label: "Download Template" },
        ].map(({ name, label }) => (
          <div key={name} className="flex items-center justify-between p-4 bg-[#f8f9fc] rounded-xl border border-gray-200">
            <span className="text-sm text-gray-700 font-medium">{name}</span>
            <button className="py-2 px-4 bg-[#5b5f97] text-white rounded-lg text-xs font-semibold hover:bg-[#4a4e7d] transition-colors cursor-pointer border-none">
              {label}
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* Apply Now */}
    <div className="flex justify-end items-center gap-3">
      <span className="text-xs text-gray-400">Make sure you've downloaded the forms first</span>
      <button onClick={onApply} className="py-3.5 px-8 bg-[#5b5f97] text-white rounded-xl font-semibold hover:bg-[#4a4e7d] transition-colors cursor-pointer border-none">
        Apply Now
      </button>
    </div>
  </div>
);

export default TertiaryProgramDetail;
