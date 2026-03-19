import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import kkfiLogo from "../assets/KKFI LOGO.png";

const HomePage = () => {
  const navigate = useNavigate();

  const programs = [
    {
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
      title: "Tertiary Scholarship Program",
      description: "College scholarship for deserving students pursuing undergraduate degrees in partner universities.",
    },
    {
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop",
      title: "Vocational and Technology Scholarship",
      description: "Skills training programs for technical and vocational courses leading to employment opportunities.",
    },
    {
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=300&fit=crop",
      title: "KKFI Employee-Child Education Grant",
      description: "Educational assistance for children of KKFI employees pursuing their academic goals.",
    },
  ];

  const stats = [
    { value: "75+", label: "Years of Service" },
    { value: "100+", label: "Scholars Supported" },
    { value: "95%", label: "Graduation Rate" },
    { value: "100+", label: "Partner Schools" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop"
            alt="Filipino students graduating"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Applications Open for 2026
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Empowering Dreams Through{" "}
              <span className="text-amber-300">Education</span>
            </h1>
            <p className="text-lg text-white/90 mb-8">
              ISKKOLAR is KKFI's digital platform for managing scholarship applications,
              monitoring academic compliance, and supporting scholars on their journey to success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Apply for Scholarship
              </button>
              <button
                onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=500&fit=crop"
                alt="Students studying together"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 hidden sm:block">
                <div className="flex items-center gap-3">
                  <img src={kkfiLogo} alt="KKFI" className="w-12 h-12 object-contain" />
                  <div>
                    <p className="font-bold text-gray-900">Since 1951</p>
                    <p className="text-sm text-gray-500">Serving Filipino Youth</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
                About Us
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Building Futures Through Education
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Kapatiran-Kaunlaran Foundation, Inc. (KKFI) has been dedicated to providing
                educational opportunities to deserving Filipino youth. Through our scholarship
                programs, we have helped students achieve their dreams and contribute
                to nation-building.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                The ISKKOLAR platform digitalizes our scholarship management process, making it
                easier for applicants to apply, for scholars to submit requirements, and for our
                team to monitor compliance and provide support.
              </p>
              <blockquote className="border-l-4 border-primary pl-4 italic text-gray-700">
                "To provide holistic formation and development programs that empower
                individuals and communities towards self-reliance and social transformation."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Scholarship Programs
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Programs Tailored For Your Success
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive scholarship programs designed to support
              students at different stages of their educational journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{program.description}</p>
                  <button
                    onClick={() => navigate("/signup")}
                    className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
                  >
                    Apply Now
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section id="process" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
              How to Apply
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Application Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to apply for a KKFI scholarship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "1", title: "Create Account", desc: "Register on the ISKKOLAR platform with your email and basic information." },
              { num: "2", title: "Choose Program", desc: "Select the scholarship program that matches your educational level." },
              { num: "3", title: "Submit Documents", desc: "Upload required documents including grades and proof of income." },
              { num: "4", title: "Get Approved", desc: "Wait for evaluation and receive notification via email.", isLast: true },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <div className={`w-10 h-10 ${step.isLast ? "bg-emerald-500" : "bg-primary"} text-white rounded-lg flex items-center justify-center text-lg font-bold mb-3`}>
                    {step.isLast ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : step.num}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
                {!step.isLast && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-gray-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Your Application
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Scholar testimonial"
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white/20"
            />
          </div>
          <blockquote className="text-xl md:text-2xl text-white/95 italic mb-6">
            "The KKFI scholarship changed my life. Without their support, I wouldn't have been able to pursue my dream of becoming an engineer. I'm forever grateful for this opportunity."
          </blockquote>
          <div className="text-white">
            <p className="font-semibold">Juan Dela Cruz</p>
            <p className="text-white/70 text-sm">KKFI Scholar, Batch 2022</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left - Contact Info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
                Contact Us
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-6">
                Have questions about our scholarship programs? We're here to help.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Office Address</h4>
                    <p className="text-gray-600 text-sm">937 Padre Paredes St, Sampaloc, Manila, 1008 Metro Manila</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Us</h4>
                    <p className="text-gray-600 text-sm">kkfi1950@yahoo.com | kkfi1950@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Call Us</h4>
                    <p className="text-gray-600 text-sm">0920 280 7883 | Mon - Fri, 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - FAQ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {[
                  { q: "Who can apply for scholarships?", a: "Filipino students who meet the academic and financial requirements set by KKFI for each program." },
                  { q: "When is the application period?", a: "Applications are typically accepted from January to March each year." },
                  { q: "What documents are required?", a: "Requirements include grades, income documents, and recommendation letters." },
                  { q: "How long does the process take?", a: "The review process typically takes 4-6 weeks after the deadline." },
                ].map((faq, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-gray-900 mb-1">{faq.q}</h4>
                    <p className="text-gray-600 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
