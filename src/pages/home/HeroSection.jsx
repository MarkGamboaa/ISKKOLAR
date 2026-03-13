const HeroSection = ({ onApplyClick, onLearnMoreClick }) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-light">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-2.957l2.4 1.028a3 3 0 002.8 0l4.8-2.057v3.362c0 1.09-.42 2.093-1.124 2.842A7.014 7.014 0 0012 18.573 7.013 7.013 0 009.3 16.573z" />
            </svg>
            Kapatiran-Kaunlaran Foundation, Inc.
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Empowering Scholars,{" "}
            <span className="text-blue-200">Simplifying Scholarship Management</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100 leading-relaxed mb-10 max-w-2xl mx-auto">
            ISKKOLAR is KKFI's digital platform for managing scholarship applications,
            compliance monitoring, and scholar records — accessible anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onApplyClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              Apply for Scholarship
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <button
              onClick={onLearnMoreClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Learn More
            </button>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: "118+", label: "Active Scholars" },
              { value: "4", label: "Programs" },
              { value: "35", label: "Employees" },
              { value: "74+", label: "Years of Service" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 50L48 45.8C96 41.7 192 33.3 288 29.2C384 25 480 25 576 33.3C672 41.7 768 58.3 864 62.5C960 66.7 1056 58.3 1152 50C1248 41.7 1344 33.3 1392 29.2L1440 25V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="#F8FAFC" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
