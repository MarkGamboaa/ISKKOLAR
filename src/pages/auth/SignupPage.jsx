import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const [provincesList, setProvincesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [barangaysList, setBarangaysList] = useState([]);

  useEffect(() => {
    // Fetch provinces and Metro Manila (NCR) manually to allow Province dropdown Selection
    fetch("https://psgc.gitlab.io/api/provinces/")
      .then(res => res.json())
      .then(data => {
        // Sort provinces
        let provs = data.sort((a,b) => a.name.localeCompare(b.name));
        // Push NCR as it's not considered a province in PSGC but users expect it in "Province" dropdown
        provs.unshift({ code: "130000000", name: "Metro Manila (NCR)" });
        setProvincesList(provs);
      })
      .catch(console.error);
  }, []);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    birthday: "",
    gender: "",
    civilStatus: "",
    citizenship: "",
    mobileNumber: "",
    email: "",
    facebook: "",
    street: "",
    barangay: "",
    city: "",
    province: "",
    country: "Philippines",
    zipCode: "",
    password: "",
    confirmPassword: "",
    profilePhoto: ""
  });

  const [errors, setErrors] = useState({});
  const [isOtherCitizenship, setIsOtherCitizenship] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Address Handlers
  const handleProvinceChange = (e) => {
    const provName = e.target.value;
    const selectedProv = provincesList.find(p => p.name === provName);
    setForm(prev => ({ ...prev, province: provName, city: "", barangay: "" }));
    clearFieldError("province");
    setCitiesList([]);
    setBarangaysList([]);

    if (selectedProv) {
      if (selectedProv.code === "130000000") {
        fetch(`https://psgc.gitlab.io/api/regions/130000000/cities-municipalities/`)
          .then(res => res.json())
          .then(data => setCitiesList(data.sort((a,b) => a.name.localeCompare(b.name))))
          .catch(console.error);
      } else {
        fetch(`https://psgc.gitlab.io/api/provinces/${selectedProv.code}/cities-municipalities/`)
          .then(res => res.json())
          .then(data => setCitiesList(data.sort((a,b) => a.name.localeCompare(b.name))))
          .catch(console.error);
      }
    }
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    const selectedCity = citiesList.find(c => c.name === cityName);
    setForm(prev => ({ ...prev, city: cityName, barangay: "" }));
    clearFieldError("city");
    setBarangaysList([]);

    if (selectedCity) {
      fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity.code}/barangays/`)
        .then(res => res.json())
        .then(data => setBarangaysList(data.sort((a,b) => a.name.localeCompare(b.name))))
        .catch(console.error);
    }
  };

  const handleBarangayChange = (e) => {
    setForm(prev => ({ ...prev, barangay: e.target.value }));
    clearFieldError("barangay");
  };

  const scrollTop = () => window.scrollTo(0, 0);

  const clearFieldError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const mapServerErrors = (error) => {
    const serverErrors = {};
    if (!Array.isArray(error?.errors)) return serverErrors;
    error.errors.forEach((item) => {
      if (item.field) serverErrors[item.field] = item.message;
    });
    return serverErrors;
  };

  const handleNext = async () => {
    // Only validate for steps 1-3, step 4 is the review page with no validation
    if (step >= 4) {
      return;
    }

    try {
      await authService.validateSignupStep(step, form);
    } catch (error) {
      setErrors(mapServerErrors(error));
      setApiError(error.message || "Please check your inputs and try again.");
      return;
    }

    setErrors({});
    setApiError("");
    setStep((prev) => prev + 1);
    scrollTop();
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    scrollTop();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setForm((prev) => ({ ...prev, profilePhoto: "" }));
      return;
    }
    setForm((prev) => ({ ...prev, profilePhoto: file }));
    clearFieldError("profilePhoto");
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError("");
    setErrors({});
    try {
      await authService.register({ ...form, userType: "applicant" });
      setSuccess(true);
    } catch (err) {
      setErrors(mapServerErrors(err));
      setApiError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold text-[#4F5288] mb-2">Success!</h2>
          <p className="text-gray-500 mb-8">We sent a verification link to your email</p>
          <div className="w-24 h-24 rounded-full border-4 border-[#4F5288] mx-auto flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#4F5288]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <Link to="/" className="block w-full bg-[#5b5f97] text-white py-3 rounded-lg font-medium hover:bg-[#4a4d7d] transition-colors">
            Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-3xl w-full">
        <div className="bg-[#5b5f97] rounded-t-xl p-8 text-white relative">
          <button onClick={() => step > 1 ? handleBack() : navigate("/")} className="absolute top-8 left-8 p-1.5 bg-white/20 rounded-md hover:bg-white/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="ml-12">
            <h1 className="text-3xl font-bold mb-1">Create Account</h1>
            <p className="text-blue-100 text-sm">Join ISKKOLAR today</p>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 p-8">
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-[#5b5f97]' : 'bg-gray-200'}`} />
            ))}
          </div>

          <form
            onSubmit={
              step === 4
                ? handleSubmit
                : async (e) => {
                    e.preventDefault();
                    await handleNext();
                  }
            }
          >
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6 border-l-4 border-[#5b5f97] pl-3 py-1">
                  <div>
                    <h2 className="text-[#5b5f97] font-semibold text-lg leading-tight">Account Setup</h2>
                    <p className="text-gray-400 text-xs">Create your login credentials</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97]" />
                    </div>
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                    <p className="text-xs text-gray-400 mt-1.5">We'll use this to verify your account</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="********" className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97]"  />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                           {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-gray-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                           ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-gray-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                           )}
                        </div>
                      </div>
                      {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
                      <p className="text-xs text-gray-400 mt-1.5">Use 8+ characters with mix of letters, numbers & symbols</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="********" className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97]" />
                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                           {showConfirmPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-gray-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                           ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-gray-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                           )}
                        </div>
                      </div>
                      {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword}</span>}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button type="submit" className="bg-[#5b5f97] text-white px-12 py-3 rounded-lg font-medium hover:bg-[#4a4d7d] transition-colors inline-block w-full">Next Step →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6 border-l-4 border-[#5b5f97] pl-3 py-1">
                  <div>
                    <h2 className="text-[#5b5f97] font-semibold text-lg leading-tight">Personal Details</h2>
                    <p className="text-gray-400 text-xs">Provide your personal details</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                    <label htmlFor="profile-photo-input" className="border border-dashed border-gray-300 rounded-lg p-6 flex justify-center items-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <span className="text-gray-600 text-sm font-medium">
                        {form.profilePhoto ? form.profilePhoto.name : "File Upload"}
                      </span>
                    </label>
                    {errors.profilePhoto && <span className="text-red-500 text-xs mt-1 block">{errors.profilePhoto}</span>}
                    <input
                      id="profile-photo-input"
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Enter First Name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97]"  />
                      {errors.firstName && <span className="text-red-500 text-xs mt-1 block">{errors.firstName}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name (Optional)</label>
                      <input name="middleName" value={form.middleName} onChange={handleChange} placeholder="Enter Middle Name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97]"  />
                      {errors.lastName && <span className="text-red-500 text-xs mt-1 block">{errors.lastName}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Suffix (Optional)</label>
                      <select name="suffix" value={form.suffix} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97] bg-white text-gray-700">
                        <option value="">--</option>
                        <option value="Jr.">Jr.</option>
                        <option value="Sr.">Sr.</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                      <input type="date" name="birthday" value={form.birthday} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97] text-gray-700"  />
                      {errors.birthday && <span className="text-red-500 text-xs mt-1 block">{errors.birthday}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship</label>
                      <select name="citizenship" value={isOtherCitizenship ? "Other" : form.citizenship} onChange={(e) => {const val = e.target.value;
                        if (val === "Other") {setIsOtherCitizenship(true);
                          handleChange({ target: { name: 'citizenship', value: '' } });
                        } else {
                          setIsOtherCitizenship(false);
                          handleChange(e);
                        }
                        }} 
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97] bg-white text-gray-700">
                      <option value="">Select</option>
                      <option value="Filipino">Filipino</option>
                      <option value="Other">Other</option>
                      </select>
                      {isOtherCitizenship && (
                      <div className="mt-2">
                        <input type="text" name="citizenship" placeholder="Please specify citizenship" value={form.citizenship} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97] bg-white text-gray-700" autoFocus />
                        <button type="button" onClick={() => { setIsOtherCitizenship(false); handleChange({ target: { name: 'citizenship', value: 'Filipino' } }); }} className="text-[10px] text-gray-400 underline mt-1">
                          Back to preset options
                        </button>
                      </div>
                      )}
                      {errors.citizenship && <span className="text-red-500 text-xs mt-1 block">{errors.citizenship}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select name="gender" value={form.gender} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97] bg-white text-gray-700" >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errors.gender && <span className="text-red-500 text-xs mt-1 block">{errors.gender}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                      <select name="civilStatus" value={form.civilStatus} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97] bg-white text-gray-700" >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                      </select>
                      {errors.civilStatus && <span className="text-red-500 text-xs mt-1 block">{errors.civilStatus}</span>}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button type="submit" className="bg-[#5b5f97] text-white px-12 py-3 rounded-lg font-medium hover:bg-[#4a4d7d] transition-colors inline-block w-full">Next Step →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6 border-l-4 border-[#5b5f97] pl-3 py-1">
                  <div>
                    <h2 className="text-[#5b5f97] font-semibold text-lg leading-tight">Contact & Background Details</h2>
                    <p className="text-gray-400 text-xs">Provide your contact and background details</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input 
                        type="text"
                        name="mobileNumber" 
                        value={form.mobileNumber} 
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length > 0 && val[0] !== '0') {
                            val = '0' + val.substring(1);
                          }
                          handleChange({ target: { name: 'mobileNumber', value: val.substring(0, 11) } });
                        }} 
                        placeholder="09123456789" 
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97]" 
                      />
                      {errors.mobileNumber && <span className="text-red-500 text-xs mt-1 block">{errors.mobileNumber}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                      <input type="text" name="facebook" value={form.facebook} onChange={handleChange} placeholder="Enter Facebook link"  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97]" />
                      {errors.facebook && <span className="text-red-500 text-xs mt-1 block">{errors.facebook}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-8 mb-4 border-l-4 border-[#5b5f97] pl-3 py-1">
                    <h2 className="text-[#5b5f97] font-semibold text-lg leading-tight">Address Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street/Unit</label>
                      <input type="text" name="street" value={form.street} onChange={handleChange} placeholder="Enter Street/Unit" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97]"  />
                      {errors.street && <span className="text-red-500 text-xs mt-1 block">{errors.street}</span>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                      <select name="province" value={form.province} onChange={handleProvinceChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97] bg-white text-gray-700">
                        <option value="">Select Province</option>
                        {provincesList.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                      </select>
                      {errors.province && <span className="text-red-500 text-xs mt-1 block">{errors.province}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City/Municipality</label>
                      <select name="city" value={form.city} onChange={handleCityChange} disabled={!form.province} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97] bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400">
                        <option value="">Select City/Municipality</option>
                        {citiesList.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                      </select>
                      {errors.city && <span className="text-red-500 text-xs mt-1 block">{errors.city}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
                      <select name="barangay" value={form.barangay} onChange={handleBarangayChange} disabled={!form.city} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97] bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400">
                        <option value="">Select Barangay</option>
                        {barangaysList.map(b => <option key={b.code} value={b.name}>{b.name}</option>)}
                      </select>
                      {errors.barangay && <span className="text-red-500 text-xs mt-1 block">{errors.barangay}</span>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <select name="country" value={form.country} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97] bg-white text-gray-700">
                        <option value="Philippines">Philippines</option>
                      </select>
                      {errors.country && <span className="text-red-500 text-xs mt-1 block">{errors.country}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                      <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="Enter Zip Code" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b5f97]" />
                      {errors.zipCode && <span className="text-red-500 text-xs mt-1 block">{errors.zipCode}</span>}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button type="submit" className="bg-[#5b5f97] text-white px-12 py-3 rounded-lg font-medium hover:bg-[#4a4d7d] transition-colors w-full">Next Step →</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6 border-l-4 border-[#5b5f97] pl-3 py-1">
                  <div>
                    <h2 className="text-[#5b5f97] font-semibold text-lg leading-tight">Review Information</h2>
                    <p className="text-gray-400 text-xs">Check your details</p>
                  </div>
                </div>

                {apiError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{apiError}</div>}

                <div className="text-center mb-8">
                  <p className="text-sm font-medium text-gray-700 mb-3">Profile Photo</p>
                  <div className="w-20 h-20 rounded-full border-2 border-[#e6a87c] mx-auto flex items-center justify-center bg-gray-100 overflow-hidden">
                    {form.profilePhoto ? (
                      <img src={URL.createObjectURL(form.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <h3 className="text-[#5b5f97] font-semibold text-sm mb-4 border-l-2 border-[#5b5f97] pl-2">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm"><span className="text-gray-500">First Name</span><span className="font-medium text-gray-800">{form.firstName || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Middle Name</span><span className="font-medium text-gray-800">{form.middleName || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Last Name</span><span className="font-medium text-gray-800">{form.lastName || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Suffix</span><span className="font-medium text-gray-800">{form.suffix || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Birthday</span><span className="font-medium text-gray-800">{form.birthday || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Gender</span><span className="font-medium text-gray-800">{form.gender || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Civil Status</span><span className="font-medium text-gray-800">{form.civilStatus || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Citizenship</span><span className="font-medium text-gray-800">{form.citizenship || "--"}</span></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <h3 className="text-[#5b5f97] font-semibold text-sm mb-4 border-l-2 border-[#5b5f97] pl-2">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Mobile Number</span><span className="font-medium text-gray-800">{form.mobileNumber || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Email</span><span className="font-medium text-gray-800">{form.email || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Facebook</span><span className="font-medium text-gray-800 truncate max-w-[120px]">{form.facebook || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Street</span><span className="font-medium text-gray-800">{form.street || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Barangay</span><span className="font-medium text-gray-800">{form.barangay || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">City</span><span className="font-medium text-gray-800">{form.city || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Province</span><span className="font-medium text-gray-800">{form.province || "--"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Country</span><span className="font-medium text-gray-800">{form.country || "Philippines"}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Zip Code</span><span className="font-medium text-gray-800">{form.zipCode || "--"}</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                   <button type="submit" disabled={loading} className="bg-[#5b5f97] text-white px-12 py-3 rounded-lg font-medium hover:bg-[#4a4d7d] transition-colors inline-block w-full max-w-sm disabled:opacity-70 disabled:cursor-not-allowed">
                     {loading ? "Registering..." : "Submit Registration"}
                   </button>
                </div>
              </div>
            )}
          </form>

          {step < 4 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account? <Link to="/" className="text-[#5b5f97] font-semibold hover:underline">Login here.</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
