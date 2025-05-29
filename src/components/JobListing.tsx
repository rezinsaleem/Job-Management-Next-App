'use client';

import { useState, useEffect } from 'react';
import { JobCard } from './JobCard';
import axios from 'axios';

interface JobFilters {
  searchQuery: string;
  location: string | null;
  jobType: string | null;
  salary: [number, number];
}

const backendUrl = 'https://job-management-nest-server.onrender.com';

export default function JobListing({ filters = {} as JobFilters }) {
  const [job, setJob] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const queryParams = new URLSearchParams();
        console.log('Filters:', filters);
        console.log('Query String:', queryParams.toString());

        if (filters.searchQuery)
          queryParams.append('searchQuery', filters.searchQuery);
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.jobType) queryParams.append('jobType', filters.jobType);
        if (filters.salary) {
          queryParams.append('minSalary', String(filters.salary[0]));
          queryParams.append('maxSalary', String(filters.salary[1]));
        }
        const response = await axios.get(
          `${backendUrl}/jobs?${queryParams.toString()}`
        );
        console.log(response.data)
        setJob(response.data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  return (
    <div className="min-h-screen p-4 mt-5">
      <div className="container mx-auto">
        {loading && (
          <div className="text-center py-2 mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
              Updating results...
            </div>
          </div>
        )}

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
          <div className="grid grid-cols-1 mx-5 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {job.map((job) => (
              <JobCard key={job} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}