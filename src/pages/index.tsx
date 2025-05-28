/* eslint-disable @typescript-eslint/no-unused-vars */
import FilterSearch from "@/components/FilterSearch";
import Navigation from "@/components/Navigation";
import { JobFilters } from "@/interface/job";
import { useCallback, useState } from "react";
import { isEqual } from "lodash";


export default function Home() {
  const [filters, setFilters] = useState<JobFilters>({
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <FilterSearch onFilterChange={handleFilterChange} />
    </div>
  );
}
