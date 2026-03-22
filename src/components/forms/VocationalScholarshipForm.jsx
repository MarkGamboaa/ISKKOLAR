import React, { useState } from 'react';
import {
  validateVocationalStep,
  submitVocationalApplication,
} from '../../services/vocationalService';

const VocationalScholarshipForm = ({ onBack, onSubmitted }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputClass = "block w-full text-sm text-gray-500 file:cursor-pointer file:mr-4 file:py-3 file:px-4 file:border-0 file:border-r file:border-gray-200 file:text-sm file:font-semibold file:bg-gray-50 file:text-[#5b5f97] hover:file:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none cursor-pointer bg-white";
  const documentFileAccept = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
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
    courseDuration: '6 months',
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
    gradeReport: null,
    cor: null,
    certificateOfIndigency: null,
    birthCertificate: null,
    incomeCertFather: null,
    incomeCertMother: null,
    recommendationLetter: null,
    essay: null,
  });

  const [agreedCertify, setAgreedCertify] = useState(false);
  const [agreedProvide, setAgreedProvide] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const requiresWorkInfo = (status) => status === 'Employed' || status === 'Self-Employed';

  const normalizeErrors = (error) => {
    const map = {};
    if (Array.isArray(error?.errors) && error.errors.length > 0) {
      error.errors.forEach(({ field, message }) => {
        if (!field) {
          map._general = message;
          return;
        }

        const normalizedField = field.replace(/\[(\d+)\]/g, '.$1');
        const familyMatch = normalizedField.match(/^family_members\.(\d+)\.(.+)$/);
        if (familyMatch) {
          const idx = parseInt(familyMatch[1], 10);
          const sub = familyMatch[2];
          const prefix = idx === 0 ? 'father' : idx === 1 ? 'mother' : `additional_${idx - 2}`;
          map[`${prefix}_${sub}`] = message;
        } else {
          map[normalizedField] = message;
        }
      });
    }

    if (Object.keys(map).length === 0) {
      map._general = error?.message || 'Request failed. Please try again.';
    }
    return map;
  };

  const FieldError = ({ name }) => {
    const msg = fieldErrors[name];
    return msg ? <p className="mt-1 text-xs text-red-500">{msg}</p> : null;
  };

  const inputBorder = (field) =>
    fieldErrors[field]
      ? 'border-red-400 focus:border-red-500'
      : 'border-gray-200 focus:border-[#5b5f97]';

  const toNumberOrNull = (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const buildFamilyMembers = () => ([
    {
      role: 'father',
      full_name: form.fatherName,
      employment_status: form.fatherStatus,
      occupation: form.fatherOccupation || null,
      monthly_income: toNumberOrNull(form.fatherIncome),
    },
    {
      role: 'mother',
      full_name: form.motherName,
      employment_status: form.motherStatus,
      occupation: form.motherOccupation || null,
      monthly_income: toNumberOrNull(form.motherIncome),
    },
    ...additionalMembers.map((member) => ({
      role: 'other',
      full_name: member.name,
      employment_status: member.status,
      occupation: member.occupation || null,
      monthly_income: toNumberOrNull(member.income),
    })),
  ]);

  const buildStep1Payload = () => ({
    scholarship_type: form.scholarshipType,
    fund_type: form.fundType,
    secondary_school: form.secondarySchool,
    strand: form.strand,
    year_graduated: form.yearGraduated,
    vocational_school: form.vocationalSchool,
    vocational_program: form.vocationalProgram,
    course_duration: form.courseDuration,
    completion_date: form.completionDate,
  });

  const buildStep2Payload = () => ({
    family_members: buildFamilyMembers(),
  });

  const buildStep3Payload = () => ({});

  const buildStep1FilesPayload = () => ({
    grade_report: files.gradeReport,
    cor: files.cor,
  });

  const buildSubmitPayload = () => ({
    ...buildStep1Payload(),
    ...buildStep2Payload(),
  });

  const buildFilesPayload = () => ({
    grade_report: files.gradeReport,
    cor: files.cor,
    certificate_of_indigency: files.certificateOfIndigency,
    birth_certificate: files.birthCertificate,
    income_cert_father: files.incomeCertFather,
    income_cert_mother: files.incomeCertMother,
    recommendation_letter: files.recommendationLetter,
    essay: files.essay,
  });

  const formErrorFieldMap = {
    scholarshipType: 'scholarship_type',
    secondarySchool: 'secondary_school',
    strand: 'strand',
    yearGraduated: 'year_graduated',
    vocationalSchool: 'vocational_school',
    vocationalProgram: 'vocational_program',
    courseDuration: 'course_duration',
    completionDate: 'completion_date',
    fatherName: 'father_full_name',
    fatherStatus: 'father_employment_status',
    fatherOccupation: 'father_occupation',
    fatherIncome: 'father_monthly_income',
    motherName: 'mother_full_name',
    motherStatus: 'mother_employment_status',
    motherOccupation: 'mother_occupation',
    motherIncome: 'mother_monthly_income',
  };

  const fileErrorFieldMap = {
    gradeReport: 'grade_report',
    cor: 'cor',
    certificateOfIndigency: 'certificate_of_indigency',
    birthCertificate: 'birth_certificate',
    incomeCertFather: 'income_cert_father',
    incomeCertMother: 'income_cert_mother',
    recommendationLetter: 'recommendation_letter',
    essay: 'essay',
  };

  const clearFieldErrors = (...keys) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      keys.forEach((key) => {
        if (key && next[key]) delete next[key];
      });
      return next;
    });
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'fatherStatus' && !requiresWorkInfo(value)) {
        next.fatherOccupation = '';
        next.fatherIncome = '';
      }
      if (field === 'motherStatus' && !requiresWorkInfo(value)) {
        next.motherOccupation = '';
        next.motherIncome = '';
      }
      return next;
    });

    clearFieldErrors(
      formErrorFieldMap[field],
      field === 'fatherOccupation' ? 'family_members.0.occupation' : null,
      field === 'fatherIncome' ? 'family_members.0.monthly_income' : null,
      field === 'motherOccupation' ? 'family_members.1.occupation' : null,
      field === 'motherIncome' ? 'family_members.1.monthly_income' : null
    );

    if (field === 'fatherStatus' && !requiresWorkInfo(value)) {
      clearFieldErrors('father_occupation', 'father_monthly_income', 'family_members.0.occupation', 'family_members.0.monthly_income');
    }

    if (field === 'motherStatus' && !requiresWorkInfo(value)) {
      clearFieldErrors('mother_occupation', 'mother_monthly_income', 'family_members.1.occupation', 'family_members.1.monthly_income');
    }
  };

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
    if (file) clearFieldErrors(fileErrorFieldMap[field]);
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setServerMessage('');

    try {
      if (currentStep === 1) await validateVocationalStep(1, buildStep1Payload(), buildStep1FilesPayload());
      else if (currentStep === 2) await validateVocationalStep(2, buildStep2Payload());
      else if (currentStep === 3) await validateVocationalStep(3, buildStep3Payload(), buildFilesPayload());

      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      setFieldErrors(normalizeErrors(error));
    }
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    setFieldErrors({});
    setServerMessage('');
    setSubmitSuccess(false);

    try {
      const response = await submitVocationalApplication(buildSubmitPayload(), buildFilesPayload());
      setSubmitSuccess(true);
      setServerMessage(response?.message || 'Application submitted successfully.');
      if (typeof onSubmitted === 'function') {
        onSubmitted(response?.data);
      }
    } catch (error) {
      setFieldErrors(normalizeErrors(error));
      setServerMessage(error?.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFamilyMember = () => setAdditionalMembers([...additionalMembers, { name: '', status: 'Employed', occupation: '', income: '' }]);
  const removeFamilyMember = (index) => setAdditionalMembers(additionalMembers.filter((_, i) => i !== index));

  const updateFamilyMember = (index, field, value) => {
    const updated = [...additionalMembers];
    updated[index][field] = value;

    if (field === 'status' && !requiresWorkInfo(value)) {
      updated[index].occupation = '';
      updated[index].income = '';
    }

    setAdditionalMembers(updated);

    const errorKeyMap = {
      name: 'full_name',
      status: 'employment_status',
      occupation: 'occupation',
      income: 'monthly_income',
    };

    clearFieldErrors(
      `additional_${index}_${errorKeyMap[field]}`,
      `family_members.${index + 2}.${errorKeyMap[field]}`
    );

    if (field === 'status' && !requiresWorkInfo(value)) {
      clearFieldErrors(
        `additional_${index}_occupation`,
        `additional_${index}_monthly_income`,
        `family_members.${index + 2}.occupation`,
        `family_members.${index + 2}.monthly_income`
      );
    }
  };

  const steps = [
    { number: 1, label: 'Academic Information' },
    { number: 2, label: 'Family Information' },
    { number: 3, label: 'Supporting Documents' },
    { number: 4, label: 'Review Information' },
  ];

  return (
    <div className="bg-white rounded-2xl w-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="p-6 border-b border-gray-100 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={currentStep > 1 ? () => setCurrentStep((prev) => prev - 1) : onBack}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-[#3d4076]">Vocational and Technology Scholarship</h2>
        </div>

        <div className="flex gap-2 mb-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div key={idx} className={`h-1.5 flex-1 rounded-full ${idx < currentStep ? 'bg-[#21cf81]' : 'bg-gray-200'}`} />
          ))}
        </div>
        <p className="text-sm text-[#3d4076] font-semibold">{steps[currentStep - 1].label}</p>
      </div>

      <div className="px-8 pb-8">
        {(submitSuccess || fieldErrors._general || (serverMessage && Object.keys(fieldErrors).filter((k) => k !== '_general').length === 0)) && (
          <div className={`mb-6 rounded-lg border p-3 text-sm ${submitSuccess ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
            {serverMessage && <p className="font-semibold">{serverMessage}</p>}
            {fieldErrors._general && <p className="mt-1">{fieldErrors._general}</p>}
          </div>
        )}

        {currentStep === 1 && (
          <form onSubmit={handleNext} noValidate className="space-y-6">
            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mb-4">Academic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Scholarship type</label>
                <select value={form.scholarshipType} onChange={(e) => handleFormChange('scholarshipType', e.target.value)} className={`w-full p-3 bg-white border rounded-lg text-sm text-gray-700 focus:outline-none ${inputBorder('scholarship_type')}`}>
                  <option>TESDA</option>
                </select>
                <FieldError name="scholarship_type" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Scholarship Fund type</label>
                <select value={form.fundType} onChange={(e) => handleFormChange('fundType', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#5b5f97]">
                  <option>KKFI Funded</option>
                  <option>Partner Funded</option>
                </select>
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mt-8 mb-4">Secondary Education</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">School Name</label>
                <input type="text" value={form.secondarySchool} onChange={(e) => handleFormChange('secondarySchool', e.target.value)} placeholder="Enter School Name" className={`w-full p-3 border rounded-lg text-sm focus:outline-none ${inputBorder('secondary_school')}`} />
                <FieldError name="secondary_school" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Strand</label>
                  <select value={form.strand} onChange={(e) => handleFormChange('strand', e.target.value)} className={`w-full p-3 bg-white border rounded-lg text-sm text-gray-700 focus:outline-none ${inputBorder('strand')}`}>
                    <option>STEM</option>
                    <option>ABM</option>
                    <option>HUMSS</option>
                    <option>GAS</option>
                    <option>TVL</option>
                  </select>
                  <FieldError name="strand" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Year Graduated</label>
                  <input type="number" value={form.yearGraduated} onChange={(e) => handleFormChange('yearGraduated', e.target.value)} placeholder="YYYY" min="1950" max="2099" className={`w-full p-3 border rounded-lg text-sm text-gray-700 focus:outline-none ${inputBorder('year_graduated')}`} />
                  <FieldError name="year_graduated" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Grade Report</label>
                <input type="file" accept={documentFileAccept} onChange={(e) => handleFileChange('gradeReport', e.target.files[0])} className={fileInputClass} />
                <FieldError name="grade_report" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mt-8 mb-4">Vocational / Technical Education</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">School Name</label>
                <input type="text" value={form.vocationalSchool} onChange={(e) => handleFormChange('vocationalSchool', e.target.value)} placeholder="Enter School Name" className={`w-full p-3 border rounded-lg text-sm focus:outline-none ${inputBorder('vocational_school')}`} />
                <FieldError name="vocational_school" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Program</label>
                <input type="text" value={form.vocationalProgram} onChange={(e) => handleFormChange('vocationalProgram', e.target.value)} placeholder="Enter Program" className={`w-full p-3 border rounded-lg text-sm focus:outline-none ${inputBorder('vocational_program')}`} />
                <FieldError name="vocational_program" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Course Duration</label>
                  <select value={form.courseDuration} onChange={(e) => handleFormChange('courseDuration', e.target.value)} className={`w-full p-3 bg-white border rounded-lg text-sm text-gray-700 focus:outline-none ${inputBorder('course_duration')}`}>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="9 months">9 months</option>
                    <option value="12 months">12 months</option>
                    <option value="18 months">18 months</option>
                    <option value="24 months">24 months</option>
                  </select>
                  <FieldError name="course_duration" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Completion Date</label>
                  <input type="date" value={form.completionDate} onChange={(e) => handleFormChange('completionDate', e.target.value)} className={`w-full p-3 border rounded-lg text-sm text-gray-700 focus:outline-none ${inputBorder('completion_date')}`} />
                  <FieldError name="completion_date" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">COR</label>
                <input type="file" accept={documentFileAccept} onChange={(e) => handleFileChange('cor', e.target.files[0])} className={fileInputClass} />
                <FieldError name="cor" />
              </div>
            </div>

            <button type="submit" className="w-full mt-6 py-4 bg-[#5b5f97] text-white rounded-xl font-semibold hover:bg-[#4a4e7d] transition flex justify-center items-center gap-2">
              Next Step
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleNext} noValidate className="space-y-6">
            {fieldErrors.family_members && <p className="text-xs text-red-500">{fieldErrors.family_members}</p>}
            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mb-4">Father's Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Father's Name</label>
                <input type="text" value={form.fatherName} onChange={(e) => handleFormChange('fatherName', e.target.value)} placeholder="Enter Father's Name" className={`w-full p-3 border rounded-lg text-sm focus:outline-none ${inputBorder('father_full_name')}`} />
                <FieldError name="father_full_name" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Employment Status</label>
                <select value={form.fatherStatus} onChange={(e) => handleFormChange('fatherStatus', e.target.value)} className={`w-full p-3 bg-white border rounded-lg text-sm text-gray-700 focus:outline-none ${inputBorder('father_employment_status')}`}>
                  <option>Employed</option>
                  <option>Unemployed</option>
                  <option>Self-Employed</option>
                  <option>Deceased</option>
                </select>
                <FieldError name="father_employment_status" />
              </div>
              {requiresWorkInfo(form.fatherStatus) && (
                <>
                  <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1.5">Occupation</label>
                    <input type="text" value={form.fatherOccupation} onChange={(e) => handleFormChange('fatherOccupation', e.target.value)} placeholder="Enter Occupation" className={`w-full p-3 border rounded-lg text-sm focus:outline-none ${inputBorder('father_occupation')}`} />
                    <FieldError name="father_occupation" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1.5">Monthly Income</label>
                    <input type="text" value={form.fatherIncome} onChange={(e) => handleFormChange('fatherIncome', e.target.value)} placeholder="Enter Monthly Income" className={`w-full p-3 border rounded-lg text-sm focus:outline-none ${inputBorder('father_monthly_income')}`} />
                    <FieldError name="father_monthly_income" />
                  </div>
                </>
              )}
            </div>

            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mb-4">Mother's Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Mother's Name</label>
                <input type="text" value={form.motherName} onChange={(e) => handleFormChange('motherName', e.target.value)} placeholder="Enter Mother's Name" className={`w-full p-3 border rounded-lg text-sm focus:outline-none ${inputBorder('mother_full_name')}`} />
                <FieldError name="mother_full_name" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Employment Status</label>
                <select value={form.motherStatus} onChange={(e) => handleFormChange('motherStatus', e.target.value)} className={`w-full p-3 bg-white border rounded-lg text-sm text-gray-700 focus:outline-none ${inputBorder('mother_employment_status')}`}>
                  <option>Employed</option>
                  <option>Unemployed</option>
                  <option>Self-Employed</option>
                  <option>Deceased</option>
                </select>
                <FieldError name="mother_employment_status" />
              </div>
              {requiresWorkInfo(form.motherStatus) && (
                <>
                  <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1.5">Occupation</label>
                    <input type="text" value={form.motherOccupation} onChange={(e) => handleFormChange('motherOccupation', e.target.value)} placeholder="Enter Occupation" className={`w-full p-3 border rounded-lg text-sm focus:outline-none ${inputBorder('mother_occupation')}`} />
                    <FieldError name="mother_occupation" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1.5">Monthly Income</label>
                    <input type="text" value={form.motherIncome} onChange={(e) => handleFormChange('motherIncome', e.target.value)} placeholder="Enter Monthly Income" className={`w-full p-3 border rounded-lg text-sm focus:outline-none ${inputBorder('mother_monthly_income')}`} />
                    <FieldError name="mother_monthly_income" />
                  </div>
                </>
              )}
            </div>

            {additionalMembers.map((member, index) => (
              <div key={index} className="pt-4 border-t border-gray-100 relative">
                <button type="button" onClick={() => removeFamilyMember(index)} className="absolute top-4 right-0 text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                <label className="block text-sm text-gray-600 font-medium mb-1.5 mt-4">Family Member Name</label>
                <input type="text" value={member.name} onChange={(e) => updateFamilyMember(index, 'name', e.target.value)} placeholder="Enter Name" className={`w-full p-3 border rounded-lg text-sm focus:outline-none mb-1 ${inputBorder(`additional_${index}_full_name`)}`} />
                <FieldError name={`additional_${index}_full_name`} />

                <label className="block text-sm text-gray-600 font-medium mb-1.5 mt-3">Employment Status</label>
                <select value={member.status} onChange={(e) => updateFamilyMember(index, 'status', e.target.value)} className={`w-full p-3 bg-white border rounded-lg text-sm text-gray-700 focus:outline-none mb-1 ${inputBorder(`additional_${index}_employment_status`)}`}>
                  <option>Employed</option>
                  <option>Unemployed</option>
                  <option>Self-Employed</option>
                  <option>Deceased</option>
                </select>
                <FieldError name={`additional_${index}_employment_status`} />

                {requiresWorkInfo(member.status) && (
                  <>
                    <label className="block text-sm text-gray-600 font-medium mb-1.5 mt-3">Occupation</label>
                    <input type="text" value={member.occupation} onChange={(e) => updateFamilyMember(index, 'occupation', e.target.value)} placeholder="Enter Occupation" className={`w-full p-3 border rounded-lg text-sm focus:outline-none mb-1 ${inputBorder(`additional_${index}_occupation`)}`} />
                    <FieldError name={`additional_${index}_occupation`} />

                    <label className="block text-sm text-gray-600 font-medium mb-1.5 mt-3">Monthly Income</label>
                    <input type="text" value={member.income} onChange={(e) => updateFamilyMember(index, 'income', e.target.value)} placeholder="Enter Monthly Income" className={`w-full p-3 border rounded-lg text-sm focus:outline-none ${inputBorder(`additional_${index}_monthly_income`)}`} />
                    <FieldError name={`additional_${index}_monthly_income`} />
                  </>
                )}
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

        {currentStep === 3 && (
          <form onSubmit={handleNext} noValidate className="space-y-6">
            <h3 className="text-lg font-bold text-[#5b5f97] border-l-4 border-[#5b5f97] pl-3 mb-4">Supporting Documents</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Certificate of Indigency Form (Applicant)</label>
                <input type="file" accept={documentFileAccept} onChange={(e) => handleFileChange('certificateOfIndigency', e.target.files[0])} className={fileInputClass} />
                <FieldError name="certificate_of_indigency" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Birth Certificate (Applicant)</label>
                <input type="file" accept={documentFileAccept} onChange={(e) => handleFileChange('birthCertificate', e.target.files[0])} className={fileInputClass} />
                <FieldError name="birth_certificate" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Income Certificate (Father)</label>
                <input type="file" accept={documentFileAccept} onChange={(e) => handleFileChange('incomeCertFather', e.target.files[0])} className={fileInputClass} />
                <FieldError name="income_cert_father" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Income Certificate (Mother)</label>
                <input type="file" accept={documentFileAccept} onChange={(e) => handleFileChange('incomeCertMother', e.target.files[0])} className={fileInputClass} />
                <FieldError name="income_cert_mother" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Recommendation Letter Form (Optional)</label>
                <input type="file" accept={documentFileAccept} onChange={(e) => handleFileChange('recommendationLetter', e.target.files[0])} className={fileInputClass} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Essay</label>
                <input type="file" accept={documentFileAccept} onChange={(e) => handleFileChange('essay', e.target.files[0])} className={fileInputClass} />
                <FieldError name="essay" />
              </div>
            </div>

            <button type="submit" className="w-full mt-6 py-4 bg-[#5b5f97] text-white rounded-xl font-semibold hover:bg-[#4a4e7d] transition flex justify-center items-center gap-2">
              Next Step
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
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
              type="button"
              onClick={handleSubmitApplication}
              disabled={isSubmitting || !agreedCertify || !agreedProvide}
              className={`w-full mt-6 py-4 rounded-xl font-semibold transition ${isSubmitting || !agreedCertify || !agreedProvide ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#5b5f97] text-white hover:bg-[#4a4e7d]'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocationalScholarshipForm;
