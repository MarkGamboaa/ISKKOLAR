import { PROGRAMS } from "./programData";

const ApplicantHomeTab = ({ onSelectProgram }) => {
  return (
    <section>
      <div className="text-center mb-6">
        <h1 className="text-[42px] font-extrabold mt-2 tracking-[0.8px] text-[#4f568e]">SCHOLARSHIPS PROGRAMS</h1>
      </div>

      <div className="grid gap-[18px] grid-cols-[repeat(auto-fit,minmax(270px,1fr))]">
        {PROGRAMS.map((program) => (
          <article
            key={program.title}
            onClick={() => onSelectProgram(program)}
            className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_22px_rgba(27,36,63,0.1)] border border-[#eceff6] transition-transform duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(27,36,63,0.15)]"
          >
            <div
              className="bg-cover bg-center min-h-[180px] p-6 flex items-end"
              style={{ backgroundImage: `linear-gradient(rgba(37, 54, 79, 0.0), rgba(37, 54, 79, 0.9)), url('${program.image}')` }}
            >
              <h3 className="text-white m-0 font-extrabold text-2xl leading-[1.2]">{program.title}</h3>
            </div>
            <div className="py-5 px-6">
              <div className="flex justify-between items-baseline gap-3">
                <p className="font-extrabold text-[17px] m-0 text-[#253056]">{program.support}</p>
                <span className="text-[13px] text-[#8a8f9e]">{program.tag}</span>
              </div>
              <p className="my-2.5 text-sm text-[#70778a]">{program.requirement}</p>
              <p className="m-0 text-sm text-[#70778a] leading-[1.6] mb-2">{program.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ApplicantHomeTab;
