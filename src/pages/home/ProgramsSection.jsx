import { useState } from "react";
import { mockPrograms } from "../../utils/mockData";
import ProgramDetailModal from "./ProgramDetailModal";

const programIcons = ["🎓", "🔧", "🤝", "📝"];
const programColors = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600",
  "from-purple-500 to-purple-600",
  "from-amber-500 to-amber-600",
];

const ProgramsSection = ({ onApplyClick }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);

  return (
    <section id="programs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Programs
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Our Scholarship Programs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the right scholarship program for you. KKFI offers four distinct programs
            tailored to different educational needs and career paths.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockPrograms.map((program, index) => (
            <div
              key={program.id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${programColors[index]} p-5`}>
                <span className="text-4xl">{programIcons[index]}</span>
              </div>
              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{program.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                  {program.description.substring(0, 120)}...
                </p>
                <button
                  onClick={() => setSelectedProgram(program)}
                  className="w-full py-2.5 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Detail Modal */}
      <ProgramDetailModal
        isOpen={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
        program={selectedProgram}
        onApplyClick={() => {
          setSelectedProgram(null);
          onApplyClick?.();
        }}
      />
    </section>
  );
};

export default ProgramsSection;
