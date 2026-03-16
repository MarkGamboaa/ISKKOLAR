import React, { useState } from 'react';

const StaffEducationalForm = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [termType, setTermType] = useState('Semester');
  const fileInputClass = "block w-full text-sm text-gray-500 file:cursor-pointer file:mr-4 file:py-3 file:px-4 file:border-0 file:border-r file:border-gray-200 file:text-sm file:font-semibold file:bg-gray-50 file:text-[#5b5f97] hover:file:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none cursor-pointer bg-white";
  const totalSteps = 4;

  const [form, setForm] = useState({
    fundType: 'KKFI Funded',
    incomingFreshman: 'No',
    secondarySchool: '',
    strand: 'STEM',
    yearGraduated: '',
    tertiarySchool: '',
    program: '',
    gradeScale: '1.0 - 5.00 Grading System',
    yearLevel: '1st',
    term: '1st',
    staffId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    position: 'Human Resource',
  });

  const [files, setFiles] = useState({
    gradeReport: null,
    cor: null,
    currentTermReport: null,
    certificateOfEmployment: null,
    birthCertificate: null,
    recommendationLetter: null,
    essay: null,
  });

  const [agreedCertify, setAgreedCertify] = useState(false);
  const [agreedProvide, setAgreedProvide] = useState(false);

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'termType') setTermType(value);
  };

  const handleFileChange = (field, file) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(prev => prev + 1);
  };

  const steps = [
    { number: 1, label: "Academic Information" },
    { number: 2, label: "Staff Information" },
    { number: 3, label: "Supporting Documents" },
    { number: 4, label: "Review Information" },
  ];

  return (
    <div className="bg-white rounded-2xl w-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={currentStep > 1 ? () => setCurrentStep(prev => prev - 1) : onBack}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-[#3d4076]">Staff Educational Assistance</h2>
        </div>

        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full ${idx < currentStep ? 'bg-[#21cf81]' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <p className="text-sm text-[#3d4076] font-semibold">{steps[currentStep - 1].label}</p>
      </div>

      <div className="px-8 pb-8">
        {/* Step 1: Academic Information */}
        {currentStep === 1 && (
          <form onSubmit={handleNext} className="space-y-6">
            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mb-4">Academic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Scholarship Fund type</label>
                <select required value={form.fundType} onChange={(e) => handleFormChange('fundType', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                  <option>KKFI Funded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Incoming Freshman?</label>
                <select required value={form.incomingFreshman} onChange={(e) => handleFormChange('incomingFreshman', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mt-8 mb-4">Secondary Education</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">School Name</label>
                <input required type="text" value={form.secondarySchool} onChange={(e) => handleFormChange('secondarySchool', e.target.value)} placeholder="Enter School Name" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Strand</label>
                  <select required value={form.strand} onChange={(e) => handleFormChange('strand', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                    <option>STEM</option>
                    <option>ABM</option>
                    <option>HUMSS</option>
                    <option>GAS</option>
                    <option>TVL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Year Graduated</label>
                  <input required type="number" value={form.yearGraduated} onChange={(e) => handleFormChange('yearGraduated', e.target.value)} placeholder="YYYY" min="1950" max="2099" className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Grade Report</label>
                <input required type="file" onChange={(e) => handleFileChange('gradeReport', e.target.files[0])} className={fileInputClass} />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mt-8 mb-4">Current Tertiary Education</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">University / College Name</label>
                <input required type="text" value={form.tertiarySchool} onChange={(e) => handleFormChange('tertiarySchool', e.target.value)} placeholder="Enter School Name" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Program</label>
                <input required type="text" value={form.program} onChange={(e) => handleFormChange('program', e.target.value)} placeholder="Enter Program" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Term Type</label>
                <select required
                  value={termType}
                  onChange={(e) => { setTermType(e.target.value); handleFormChange('termType', e.target.value); }}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]"
                >
                  <option>Semester</option>
                  <option>Trimester</option>
                  <option>Quarter System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Grade Scale</label>
                <select required value={form.gradeScale} onChange={(e) => handleFormChange('gradeScale', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                  <option>1.0 - 5.00 Grading System</option>
                  <option>4.00 GPA System</option>
                  <option>Percentage System</option>
                  <option>Letter Grade System</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Year Level</label>
                  <select required value={form.yearLevel} onChange={(e) => handleFormChange('yearLevel', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                    <option>1st</option>
                    <option>2nd</option>
                    <option>3rd</option>
                    <option>4th</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Term</label>
                  <select required value={form.term} onChange={(e) => handleFormChange('term', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                    <option>1st</option>
                    <option>2nd</option>
                    {(termType === 'Trimester' || termType === 'Quarter System') && <option>3rd</option>}
                    {termType === 'Quarter System' && <option>4th</option>}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">COR</label>
                <input required type="file" onChange={(e) => handleFileChange('cor', e.target.files[0])} className={fileInputClass} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Current Term Report Card</label>
                <input required type="file" onChange={(e) => handleFileChange('currentTermReport', e.target.files[0])} className={fileInputClass} />
              </div>
            </div>

            <button type="submit" className="w-full mt-6 py-4 bg-[#5b5f97] text-white rounded-xl font-semibold hover:bg-[#4a4e7d] transition flex justify-center items-center gap-2">
              Next Step
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        )}

        {/* Step 2: Staff Information */}
        {currentStep === 2 && (
          <form onSubmit={handleNext} className="space-y-6">
            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mb-4">Staff Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Staff ID</label>
                <input required type="text" value={form.staffId} onChange={(e) => handleFormChange('staffId', e.target.value)} placeholder="Enter Staff ID" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">First Name</label>
                <input required type="text" value={form.firstName} onChange={(e) => handleFormChange('firstName', e.target.value)} placeholder="Enter First Name" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Middle Name (Optional)</label>
                <input type="text" value={form.middleName} onChange={(e) => handleFormChange('middleName', e.target.value)} placeholder="Enter Middle Name" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Last Name</label>
                <input required type="text" value={form.lastName} onChange={(e) => handleFormChange('lastName', e.target.value)} placeholder="Enter Last Name" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Suffix (Optional)</label>
                <input type="text" value={form.suffix} onChange={(e) => handleFormChange('suffix', e.target.value)} placeholder="e.g. Jr., Sr., III" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Position</label>
                <select required value={form.position} onChange={(e) => handleFormChange('position', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                  <option>Human Resource</option>
                  <option>Finance</option>
                  <option>Operations</option>
                  <option>Administration</option>
                  <option>Programs</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full mt-6 py-4 bg-[#5b5f97] text-white rounded-xl font-semibold hover:bg-[#4a4e7d] transition flex justify-center items-center gap-2">
              Next Step
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        )}

        {/* Step 3: Supporting Documents */}
        {currentStep === 3 && (
          <form onSubmit={handleNext} className="space-y-6">
            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mb-4">Supporting Documents</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Certificate of Employment</label>
                <input required type="file" onChange={(e) => handleFileChange('certificateOfEmployment', e.target.files[0])} className={fileInputClass} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Birth Certificate (Applicant)</label>
                <input required type="file" onChange={(e) => handleFileChange('birthCertificate', e.target.files[0])} className={fileInputClass} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Recommendation Letter Form (Optional)</label>
                <input type="file" onChange={(e) => handleFileChange('recommendationLetter', e.target.files[0])} className={fileInputClass} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Essay</label>
                <input required type="file" onChange={(e) => handleFileChange('essay', e.target.files[0])} className={fileInputClass} />
              </div>
            </div>

            <button type="submit" className="w-full mt-6 py-4 bg-[#5b5f97] text-white rounded-xl font-semibold hover:bg-[#4a4e7d] transition flex justify-center items-center gap-2">
              Next Step
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        )}

        {/* Step 4: Review Information */}
        {currentStep === 4 && (
          <div className="space-y-4">
            {/* Secondary Education Information */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-md font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-2 mb-3">Secondary Education Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">School Name</span><span className="font-semibold text-gray-900">{form.secondarySchool || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Strand</span><span className="font-semibold text-gray-900">{form.strand}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Year Graduated</span><span className="font-semibold text-gray-900">{form.yearGraduated || '--'}</span></div>
              </div>
            </div>

            {/* Tertiary Education Information */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-md font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-2 mb-3">Tertiary Education Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">School Name</span><span className="font-semibold text-gray-900">{form.tertiarySchool || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Program</span><span className="font-semibold text-gray-900">{form.program || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Year Level</span><span className="font-semibold text-gray-900">{form.yearLevel}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Term</span><span className="font-semibold text-gray-900">{form.term}</span></div>
              </div>
            </div>

            {/* Staff Information */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-md font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-2 mb-3">Staff Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Staff ID</span><span className="font-semibold text-gray-900">{form.staffId || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">First Name</span><span className="font-semibold text-gray-900">{form.firstName || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Middle Name</span><span className="font-semibold text-gray-900">{form.middleName || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Last Name</span><span className="font-semibold text-gray-900">{form.lastName || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Suffix</span><span className="font-semibold text-gray-900">{form.suffix || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Position</span><span className="font-semibold text-gray-900">{form.position}</span></div>
              </div>
            </div>

            {/* Supporting Documents */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-md font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-2 mb-3">Supporting Documents</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Certificate of Employment</span>
                  <span className={files.certificateOfEmployment ? "text-[#21cf81]" : "text-gray-400"}>{files.certificateOfEmployment ? "\u2713" : "\u2014"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Birth Certificate (Applicant)</span>
                  <span className={files.birthCertificate ? "text-[#21cf81]" : "text-gray-400"}>{files.birthCertificate ? "\u2713" : "\u2014"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recommendation Letter (Optional)</span>
                  <span className={files.recommendationLetter ? "text-[#21cf81]" : "text-gray-400"}>{files.recommendationLetter ? "\u2713" : "\u2014"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Essay</span>
                  <span className={files.essay ? "text-[#21cf81]" : "text-gray-400"}>{files.essay ? "\u2713" : "\u2014"}</span>
                </div>
              </div>
            </div>

            {/* Declaration and Agreement */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-md font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-2 mb-3">Declaration and Agreement</h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreedCertify} onChange={(e) => setAgreedCertify(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-[#5b5f97] focus:ring-[#5b5f97] accent-[#5b5f97] flex-shrink-0" />
                  <span className="text-sm text-gray-600">I certify that all information provided in this application is true and correct to the best of my knowledge. I understand that any false or misleading information may result in the denial or revocation of any scholarship granted.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreedProvide} onChange={(e) => setAgreedProvide(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-[#5b5f97] focus:ring-[#5b5f97] accent-[#5b5f97] flex-shrink-0" />
                  <span className="text-sm text-gray-600">I agree to provide any additional documentation requested by KKFI and to comply with all scholarship terms and conditions.</span>
                </label>
              </div>
            </div>

            <button
              disabled={!agreedCertify || !agreedProvide}
              className={`w-full mt-6 py-4 rounded-xl font-semibold transition ${agreedCertify && agreedProvide ? 'bg-[#5b5f97] text-white hover:bg-[#4a4e7d]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Submit Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffEducationalForm;
