/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect, useRef } from "react";
import { JobCard } from "./JobCard";

interface JobFilters {
  searchQuery: string;
  location: string | null;
  jobType: string | null;
  salary: [number, number];
}

const backendUrl = 'http://localhost:3000/'

export default function JobListing() {
    const [job, setJob] = useState([
  {
    id: 1,
    title: "Frontend Developer",
    company_name: "TechNova Inc.",
    location: "Bengaluru, India",
    job_type: "Full-Time",
    salary_range: "₹8k - ₹12k",
    description: "Build and maintain user-facing features using React and TypeScript.",
    application_deadline: "2025-07-15",
    created_at: "2025-06-20T10:00:00Z",
    updated_at: "2025-06-25T14:30:00Z"
  },
  {
    id: 2,
    title: "Backend Engineer",
    company_name: "CloudSync Solutions",
    location: "Remote",
    job_type: "Part-Time",
    salary_range: "₹10k - ₹15k",
    description: "Develop scalable APIs using Node.js and MongoDB.",
    application_deadline: "2025-08-01",
    created_at: "2025-06-22T09:45:00Z",
    updated_at: "2025-06-26T12:15:00Z"
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company_name: "Designify Studio",
    location: "Mumbai, India",
    job_type: "Contract",
    salary_range: "₹5k - ₹9k",
    description: "Design intuitive and visually appealing user interfaces.",
    application_deadline: "2025-07-10",
    created_at: "2025-06-21T13:20:00Z",
    updated_at: "2025-06-24T16:00:00Z"
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company_name: "Infrasys Tech",
    location: "Hyderabad, India",
    job_type: "Full-Time",
    salary_range: "₹12k - ₹18k",
    description: "Automate infrastructure and CI/CD pipelines using AWS and Docker.",
    application_deadline: "2025-07-20",
    created_at: "2025-06-23T11:10:00Z",
    updated_at: "2025-06-27T09:40:00Z"
  }
])


  return (
    <div className="min-h-screen p-4 mt-5">
      <div className="container mx-auto">
       

        {job.length === 0 ? (
          <div className="text-center py-10">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">No jobs found</h2>
            <p className="text-gray-600 mt-2 max-w-md mx-auto">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {job.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}