import { CheckIcon } from "./Icons";

const EmployeeChildDetail = ({ onApply }) => (
  <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
    <span className="inline-block px-3 py-1 bg-[#ede9fe] text-[#5b5f97] rounded-full text-xs font-semibold mb-4">KKFI Staff Program</span>

    <h2 className="text-xl font-bold text-[#3d4076] border-b border-gray-100 pb-4 mb-6">Background</h2>
    <p className="text-gray-600 leading-relaxed mb-8">
      KKFI believes the growth of its personnel is central to its mission. The Staff and Dependents Educational Assistance (SDEA) empowers staff to enhance their skills while supporting the educational aspirations of their families.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Option 1 */}
      <div className="border border-gray-200 rounded-2xl p-6">
        <span className="inline-block px-3 py-1 bg-[#dbeafe] text-[#3b82f6] rounded-full text-xs font-semibold mb-3">Option 1</span>
        <h3 className="text-lg font-bold text-[#3d4076] mb-3">Self-Advancement</h3>
        <ul className="space-y-3 mb-6">
          {[
            "Must be a regular employee of KKFI at the time of application",
            "Personal educational advancement or professional development",
            "Maintain good academic standing",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#21cf81] mt-0.5"><CheckIcon /></span>
              <span className="text-sm text-gray-600">{item}</span>
            </li>
          ))}
        </ul>
        <button onClick={onApply} className="w-full py-3 bg-[#5b5f97] text-white rounded-xl font-semibold hover:bg-[#4a4e7d] transition-colors cursor-pointer border-none">
          Apply Now!
        </button>
      </div>

      {/* Option 2 */}
      <div className="border border-gray-200 rounded-2xl p-6">
        <span className="inline-block px-3 py-1 bg-[#fce7f3] text-[#ec4899] rounded-full text-xs font-semibold mb-3">Option 2</span>
        <h3 className="text-lg font-bold text-[#3d4076] mb-3">Child Designation</h3>
        <ul className="space-y-3 mb-6">
          {[
            "May designate benefit to a qualified relative (child)",
            "Limited to one slot only for the duration of employment",
            "Assistance automatically ends if the KKFI staff member resigns",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#21cf81] mt-0.5"><CheckIcon /></span>
              <span className="text-sm text-gray-600">{item}</span>
            </li>
          ))}
        </ul>
        <button onClick={onApply} className="w-full py-3 bg-[#e8315b] text-white rounded-xl font-semibold hover:bg-[#d1284f] transition-colors cursor-pointer border-none">
          Apply Now!
        </button>
      </div>
    </div>
  </div>
);

export default EmployeeChildDetail;
