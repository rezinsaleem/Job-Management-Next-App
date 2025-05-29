
import FilterSearch from "@/components/FilterSearch";
import Navbar from "@/components/Navbar";
import { JobFilters } from "@/interface/job";
import { useCallback, useState } from "react";
import { isEqual } from "lodash";
import JobListing from "@/components/JobListing";


export default function Home() {
  const [, setFilters] = useState<JobFilters>({
    searchQuery: "",
    location: null,
    jobType: null,
    salary: [20, 80],
  });

  // Memoized handler for filter changes to prevent unnecessary re-renders
  const handleFilterChange = useCallback((newFilters: JobFilters): void => {
    console.log("Filters changed:", newFilters);
    setFilters((prev) => {
      if (isEqual(prev, newFilters)) {
        return prev; // Prevent update if filters are unchanged
      }
      return newFilters;
    });
  }, []);
  return (
    <div className="min-h-screen bg-[#FBFBFF]">
      <Navbar />
      <FilterSearch onFilterChange={handleFilterChange} />
      <JobListing />
    </div>
  );
}
