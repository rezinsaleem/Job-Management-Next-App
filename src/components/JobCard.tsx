import Image from 'next/image';

interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  salary_range: string;
  description: string;
  application_deadline: string;
  created_at: string;
  updated_at: string;
}

export function JobCard({ job }: { job: Job }) {
  const descriptionLines: string[] = job.description
    .split('\n')
    .filter((line: string): boolean => line.trim() !== '');

  const postedTime = (() => {
    try {
      const createdDate = new Date(job.created_at);
      const now = new Date();
      const diffHours = Math.floor(
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60)
      );

      if (diffHours < 1) {
        return 'Recently';
      } else if (diffHours < 24) {
        return `${diffHours}h Ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d Ago`;
      }
    } catch {
      return 'Recently';
    }
  })();

  const formattedSalary = (() => {
    const salaryInLakhs = parseInt(job.salary_range) / 100000;
    return `${salaryInLakhs}LPA`;
  })();

  const locationTypeDisplay =
    job.location.toLowerCase() === 'remote' ? 'Remote' : 'Onsite';

  return (
    <div className=" rounded-lg overflow-hidden flex flex-col shadow-[0_0_6px_rgba(0,0,0,0.08)]">
      <div className="rounded-xl shadow-sm max-w-sm w-full p-5 space-y-4 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div className="bg-gradient-to-t from-[#f1f1f1] to-white p-3 border-2 border-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
            <div className="rounded-full w-12 h-12 flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="Amazon Logo"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="bg-[#b0d9ff] text-black px-3 py-1 rounded-lg text-sm font-medium">
              {postedTime}
            </div>
          </div>
          <div className="space-y-3 flex-grow">
            <div>
              <h2 className="text-2xl font-bold text-black">{job.title}</h2>
            </div>

            <div className="flex justify-between text-gray-600 w-full">
              <div className="flex items-center space-x-1">
                <Image
                  src="/Experience.svg"
                  alt=""
                  width={5}
                height={5}
                className="w-5 h-5"
              />
              <span className="text-sm">1-3 yr Exp</span>
            </div>
            <div className="flex items-center space-x-1">
              <Image
                src="/Onsite.svg"
                alt=""
                width={5}
                height={5}
                className="w-5 h-5"
              />
              <span>{locationTypeDisplay}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Image
                src="/Salary.svg"
                alt=""
                width={5}
                height={5}
                className="w-5 h-5"
              />
              <span>{formattedSalary}</span>
            </div>
          </div>

          <ul className="list-disc pl-5 space-y-0.5 text-gray-600 text-sm h-12 overflow-hidden">
            {descriptionLines.slice(0, 2).map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>

        <button className="w-full bg-[#00aaff] text-white font-medium py-3 px-4 rounded-lg transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );
}