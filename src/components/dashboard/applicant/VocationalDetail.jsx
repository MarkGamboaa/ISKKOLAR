import { CheckIcon, SectionIcon } from "./Icons";

const VocationalDetail = ({ onApply }) => (
  <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
    <span className="inline-block px-3 py-1 bg-[#ede9fe] text-[#5b5f97] rounded-full text-xs font-semibold mb-4">TESDA-Accredited Pathways</span>

    <h2 className="text-xl font-bold text-[#3d4076] border-b border-gray-100 pb-4 mb-6">Background</h2>
    <p className="text-gray-600 leading-relaxed mb-8">
      Designed for individuals seeking employment-ready skills, we partner with TESDA-accredited institutions to provide National Certificates (NC I, NC II) that are highly valued in the labor market.
    </p>

    <h2 className="text-xl font-bold text-[#3d4076] border-b border-gray-100 pb-4 mb-6">Eligibility</h2>
    <ul className="space-y-4 mb-8">
      {[
        "Filipino Citizen (Ages 18 Above)",
        "High School Graduate (or equivalent)",
        "Family Income < \u20B120,000/month",
      ].map((req, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-[#21cf81] mt-0.5"><CheckIcon /></span>
          <span className="text-gray-600">{req}</span>
        </li>
      ))}
    </ul>

    <h2 className="text-xl font-bold text-[#3d4076] border-b border-gray-100 pb-4 mb-6">Eligible Tracks (Not Limited To)</h2>
    <div className="flex flex-wrap gap-2 mb-8">
      {["Automotive", "Cookery", "Bookkeeping", "Agriculture", "ICT Servicing", "Caregiving"].map((track) => (
        <span key={track} className="px-4 py-2 bg-[#f8f9fc] rounded-full text-sm text-[#3d4076] font-medium border border-gray-200">{track}</span>
      ))}
    </div>

    <h2 className="text-xl font-bold text-[#3d4076] border-b border-gray-100 pb-4 mb-6">How to Apply</h2>
    <div className="space-y-4 mb-8">
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

    {/* Download Forms */}
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#5b5f97]"><SectionIcon d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></span>
        <h2 className="text-lg font-bold text-[#3d4076] m-0">Download Forms</h2>
      </div>
      <div className="space-y-3">
        {[
          { name: "Certificate of Indigency Form", label: "Download Form" },
          { name: "Income Certificate Form", label: "Download Form" },
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

    <div className="flex justify-end items-center gap-3">
      <span className="text-xs text-gray-400">Make sure you've downloaded the forms first</span>
      <button onClick={onApply} className="py-3.5 px-8 bg-[#5b5f97] text-white rounded-xl font-semibold hover:bg-[#4a4e7d] transition-colors cursor-pointer border-none">
        Apply Now!
      </button>
    </div>
  </div>
);

export default VocationalDetail;
