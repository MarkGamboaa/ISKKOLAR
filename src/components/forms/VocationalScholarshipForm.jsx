import React, { useState } from 'react';

const VocationalScholarshipForm = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputClass = "block w-full text-sm text-gray-500 file:cursor-pointer file:mr-4 file:py-3 file:px-4 file:border-0 file:border-r file:border-gray-200 file:text-sm file:font-semibold file:bg-gray-50 file:text-[#5b5f97] hover:file:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none cursor-pointer bg-white";
  const totalSteps = 4;
  const [additionalMembers, setAdditionalMembers] = useState([]);

  const [form, setForm] = useState({
    scholarshipType: 'TESDA',
    fundType: 'KKFI Funded',
    secondarySchool: '',
    strand: 'STEM',
    yearGraduated: '',
    vocationalSchool: '',
    vocationalProgram: '',
    courseDuration: '6',
    completionDate: '',
    fatherName: '',
    fatherStatus: 'Employed',
    fatherOccupation: '',
    fatherIncome: '',
    motherName: '',
    motherStatus: 'Employed',
    motherOccupation: '',
    motherIncome: '',
  });

  const [files, setFiles] = useState({
    reportCard: null,
    cor: null,
    certificateOfIndigency: null,
    birthCertificate: null,
    incomeCertFather: null,
    incomeCertMother: null,
    essay: null,
  });

  const [agreedCertify, setAgreedCertify] = useState(false);
  const [agreedProvide, setAgreedProvide] = useState(false);

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(prev => prev + 1);
  };

  const addFamilyMember = () => setAdditionalMembers([...additionalMembers, { name: '', relationship: 'Child', occupation: '', income: '' }]);
  const removeFamilyMember = (index) => setAdditionalMembers(additionalMembers.filter((_, i) => i !== index));

  const updateFamilyMember = (index, field, value) => {
    const updated = [...additionalMembers];
    updated[index][field] = value;
    setAdditionalMembers(updated);
  };

  const steps = [
    { number: 1, label: "Academic Information" },
    { number: 2, label: "Family Information" },
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
          <h2 className="text-xl font-bold text-[#3d4076]">Vocational and Technology Scholarship</h2>
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
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Scholarship type</label>
                <select required value={form.scholarshipType} onChange={(e) => handleFormChange('scholarshipType', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                  <option>TESDA</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Scholarship Fund type</label>
                <select required value={form.fundType} onChange={(e) => handleFormChange('fundType', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                  <option>KKFI Funded</option>
                  <option>Partner Funded</option>
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
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Report Card</label>
                <input required type="file" onChange={(e) => handleFileChange('reportCard', e.target.files[0])} className={fileInputClass} />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mt-8 mb-4">Vocational / Technical Education</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">School Name</label>
                <input required type="text" value={form.vocationalSchool} onChange={(e) => handleFormChange('vocationalSchool', e.target.value)} placeholder="Enter School Name" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Program</label>
                <input required type="text" value={form.vocationalProgram} onChange={(e) => handleFormChange('vocationalProgram', e.target.value)} placeholder="Enter Program" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Course Duration (months)</label>
                  <select required value={form.courseDuration} onChange={(e) => handleFormChange('courseDuration', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="9">9 months</option>
                    <option value="12">12 months</option>
                    <option value="18">18 months</option>
                    <option value="24">24 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Completion Date</label>
                  <input required type="date" value={form.completionDate} onChange={(e) => handleFormChange('completionDate', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">COR</label>
                <input required type="file" onChange={(e) => handleFileChange('cor', e.target.files[0])} className={fileInputClass} />
              </div>
            </div>

            <button type="submit" className="w-full mt-6 py-4 bg-[#5b5f97] text-white rounded-xl font-semibold hover:bg-[#4a4e7d] transition flex justify-center items-center gap-2">
              Next Step
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        )}

        {/* Step 2: Family Information */}
        {currentStep === 2 && (
          <form onSubmit={handleNext} className="space-y-6">
            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mb-4">Father's Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Father's Name</label>
                <input required type="text" value={form.fatherName} onChange={(e) => handleFormChange('fatherName', e.target.value)} placeholder="Enter Father's Name" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Employment Status</label>
                <select required value={form.fatherStatus} onChange={(e) => handleFormChange('fatherStatus', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                  <option>Employed</option>
                  <option>Unemployed</option>
                  <option>Self-Employed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Occupation</label>
                <input required type="text" value={form.fatherOccupation} onChange={(e) => handleFormChange('fatherOccupation', e.target.value)} placeholder="Enter Occupation" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Monthly Income</label>
                <input required type="text" value={form.fatherIncome} onChange={(e) => handleFormChange('fatherIncome', e.target.value)} placeholder="Enter Monthly Income" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mb-4">Mother's Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Mother's Name</label>
                <input required type="text" value={form.motherName} onChange={(e) => handleFormChange('motherName', e.target.value)} placeholder="Enter Mother's Name" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Employment Status</label>
                <select required value={form.motherStatus} onChange={(e) => handleFormChange('motherStatus', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                  <option>Employed</option>
                  <option>Unemployed</option>
                  <option>Self-Employed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Occupation</label>
                <input required type="text" value={form.motherOccupation} onChange={(e) => handleFormChange('motherOccupation', e.target.value)} placeholder="Enter Occupation" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Monthly Income</label>
                <input required type="text" value={form.motherIncome} onChange={(e) => handleFormChange('motherIncome', e.target.value)} placeholder="Enter Monthly Income" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
            </div>

            {additionalMembers.map((member, index) => (
              <div key={index} className="pt-4 border-t border-gray-100 relative">
                <button type="button" onClick={() => removeFamilyMember(index)} className="absolute top-4 right-0 text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                <label className="block text-sm text-gray-600 font-medium mb-1.5 mt-4">Name</label>
                <input required type="text" value={member.name} onChange={(e) => updateFamilyMember(index, 'name', e.target.value)} placeholder="Enter Guardian's Name" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97] mb-4" />

                <label className="block text-sm text-gray-600 font-medium mb-1.5">Relationship to Applicant</label>
                <select required value={member.relationship} onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97] mb-4">
                  <option>Child</option>
                  <option>Sibling</option>
                  <option>Nephew</option>
                  <option>Niece</option>
                  <option>Guardian</option>
                  <option>Grandparent</option>
                  <option>Other</option>
                </select>

                <label className="block text-sm text-gray-600 font-medium mb-1.5">Occupation</label>
                <input required type="text" value={member.occupation} onChange={(e) => updateFamilyMember(index, 'occupation', e.target.value)} placeholder="Enter Occupation" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97] mb-4" />

                <label className="block text-sm text-gray-600 font-medium mb-1.5">Monthly Income</label>
                <input required type="text" value={member.income} onChange={(e) => updateFamilyMember(index, 'income', e.target.value)} placeholder="Enter Monthly Income" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b5f97]" />
              </div>
            ))}

            <div className="pt-6">
              <button type="button" onClick={addFamilyMember} className="flex items-center gap-2 text-[#5b5f97] font-semibold text-sm hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Family Member
              </button>
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
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Certificate of Indigency Form (Applicant)</label>
                <input required type="file" onChange={(e) => handleFileChange('certificateOfIndigency', e.target.files[0])} className={fileInputClass} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Birth Certificate (Applicant)</label>
                <input required type="file" onChange={(e) => handleFileChange('birthCertificate', e.target.files[0])} className={fileInputClass} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Income Certificate (Father)</label>
                <input required type="file" onChange={(e) => handleFileChange('incomeCertFather', e.target.files[0])} className={fileInputClass} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Income Certificate (Mother)</label>
                <input required type="file" onChange={(e) => handleFileChange('incomeCertMother', e.target.files[0])} className={fileInputClass} />
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
            {/* Scholarship Information */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-md font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-2 mb-3">Scholarship Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Scholarship type</span><span className="font-semibold text-gray-900">{form.scholarshipType}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Scholarship Fund type</span><span className="font-semibold text-gray-900">{form.fundType}</span></div>
              </div>
            </div>

            {/* Secondary Education Information */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-md font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-2 mb-3">Secondary Education Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">School Name</span><span className="font-semibold text-gray-900">{form.secondarySchool || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Strand</span><span className="font-semibold text-gray-900">{form.strand}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Year Graduated</span><span className="font-semibold text-gray-900">{form.yearGraduated || '--'}</span></div>
              </div>
            </div>

            {/* Vocational/Technical Education */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-md font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-2 mb-3">Vocational / Technical Education</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">School Name</span><span className="font-semibold text-gray-900">{form.vocationalSchool || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Program</span><span className="font-semibold text-gray-900">{form.vocationalProgram || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Course Duration</span><span className="font-semibold text-gray-900">{form.courseDuration} months</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Completion Date</span><span className="font-semibold text-gray-900">{form.completionDate || '--'}</span></div>
              </div>
            </div>

            {/* Parents Information */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-md font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-2 mb-3">Parents Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Father's Name</span><span className="font-semibold text-gray-900">{form.fatherName || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Employment Status</span><span className="font-semibold text-gray-900">{form.fatherStatus}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Occupation</span><span className="font-semibold text-gray-900">{form.fatherOccupation || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Monthly Income</span><span className="font-semibold text-gray-900">{form.fatherIncome || '--'}</span></div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between"><span className="text-gray-500">Mother's Name</span><span className="font-semibold text-gray-900">{form.motherName || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Employment Status</span><span className="font-semibold text-gray-900">{form.motherStatus}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Occupation</span><span className="font-semibold text-gray-900">{form.motherOccupation || '--'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Monthly Income</span><span className="font-semibold text-gray-900">{form.motherIncome || '--'}</span></div>
              </div>
              {additionalMembers.length > 0 && additionalMembers.map((member, index) => (
                <div key={index} className="mt-2">
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold text-gray-900">{member.name || '--'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Relationship</span><span className="font-semibold text-gray-900">{member.relationship}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Occupation</span><span className="font-semibold text-gray-900">{member.occupation || '--'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Monthly Income</span><span className="font-semibold text-gray-900">{member.income || '--'}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Supporting Documents */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-md font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-2 mb-3">Supporting Documents</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Certificate of Indigency (Applicant)</span>
                  <span className={files.certificateOfIndigency ? "text-[#21cf81]" : "text-gray-400"}>{files.certificateOfIndigency ? "\u2713" : "\u2014"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Birth Certificate (Applicant)</span>
                  <span className={files.birthCertificate ? "text-[#21cf81]" : "text-gray-400"}>{files.birthCertificate ? "\u2713" : "\u2014"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Income Certificate (Father)</span>
                  <span className={files.incomeCertFather ? "text-[#21cf81]" : "text-gray-400"}>{files.incomeCertFather ? "\u2713" : "\u2014"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Income Certificate (Mother)</span>
                  <span className={files.incomeCertMother ? "text-[#21cf81]" : "text-gray-400"}>{files.incomeCertMother ? "\u2713" : "\u2014"}</span>
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

export default VocationalScholarshipForm;
