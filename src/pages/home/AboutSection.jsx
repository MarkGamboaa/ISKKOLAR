const stats = [
  { icon: "👥", value: "35", label: "Employees", color: "bg-blue-50 text-blue-600" },
  { icon: "🎓", value: "118", label: "Active Scholars", color: "bg-green-50 text-green-600" },
  { icon: "📚", value: "4", label: "Scholarship Programs", color: "bg-purple-50 text-purple-600" },
  { icon: "🏛️", value: "Est. 1950", label: "Founding Year", color: "bg-amber-50 text-amber-600" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-6">
              Empowering Filipino Youth Through Education
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                <strong className="text-gray-900">Kapatiran-Kaunlaran Foundation, Inc. (KKFI)</strong> is a 
                non-profit organization founded in 1950, dedicated to improving the lives of 
                underprivileged Filipino communities through education, livelihood programs, 
                and social development initiatives.
              </p>
              <p>
                Based in the Philippines, KKFI has been providing scholarship grants and 
                educational assistance for over seven decades. Through the ISKKOLAR platform, 
                the foundation modernizes its scholarship management process — from application 
                submission to compliance monitoring and record management.
              </p>
              <p>
                With <strong className="text-gray-900">118 active scholars</strong> and 
                <strong className="text-gray-900"> 4 scholarship programs</strong>, KKFI continues to 
                nurture the potential of deserving Filipino students.
              </p>
            </div>
          </div>

          {/* Right: Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 text-center transition-all duration-300 hover:-translate-y-1 border border-gray-50"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.color} rounded-xl text-2xl mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
