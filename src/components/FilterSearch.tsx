/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import LogoSvg from "../../public/Vector.svg";
import Image from "next/image";
import { JobFilters } from "../interface/job";
import { JobFilterProps } from "../interface/job";


const locationOptions = [
  "Remote",
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Chennai"
];

const jobTypeOptions = [
  "Full Time",
  "Part Time",
  "Internship",
  "Contract"
];

export default function FilterSearch({ onFilterChange }: JobFilterProps) {
  // State for form inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Preferred Location");
  const [jobType, setJobType] = useState("Job type");
  const [salary, setSalary] = useState<[number, number]>([20, 80]);

  // Dropdown states
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [jobTypeDropdownOpen, setJobTypeDropdownOpen] = useState(false);

  // Refs for range slider
  const rangeRef = useRef<HTMLDivElement | null>(null);
  const rangeTrackRef = useRef<HTMLDivElement | null>(null);

  // For debouncing filter changes
  const filterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track initial filter values to compare against
  const initialFilters = useRef<JobFilters>({
    searchQuery: "",
    location: null,
    jobType: null,
    salary: [0, 100],
  });

  // Compare current filters with initial filters
  const areFiltersInitial = () => {
    return (
      searchQuery === initialFilters.current.searchQuery &&
      (location === "Preferred Location"
        ? initialFilters.current.location === null
        : location === initialFilters.current.location) &&
      (jobType === "Job type"
        ? initialFilters.current.jobType === null
        : jobType === initialFilters.current.jobType) &&
      salary[0] === initialFilters.current.salary[0] &&
      salary[1] === initialFilters.current.salary[1]
    );
  };

  // Send filter updates to parent component with debounce
  const updateFilters = () => {
    if (areFiltersInitial()) {
      console.log("Skipping updateFilters: Filters are initial");
      return; // Skip if filters haven't changed from initial values
    }

    if (filterDebounceRef.current) {
      clearTimeout(filterDebounceRef.current);
    }

    filterDebounceRef.current = setTimeout(() => {
      console.log("Calling onFilterChange with:", {
        searchQuery,
        location: location === "Preferred Location" ? null : location,
        jobType: jobType === "Job type" ? null : jobType,
        salary,
      });
      onFilterChange({
        searchQuery,
        location: location === "Preferred Location" ? null : location,
        jobType: jobType === "Job type" ? null : jobType,
        salary,
      });
    }, 500);
  };

  // Update filters only when inputs change
  useEffect(() => {
    updateFilters();
    return () => {
      if (filterDebounceRef.current) {
        clearTimeout(filterDebounceRef.current);
      }
    };
  }, [searchQuery, location, jobType, salary]);

  const handleRangeChange = (isMin: boolean, event: MouseEvent) => {
    if (!rangeRef.current) return;
    const container = rangeRef.current.getBoundingClientRect();
    const containerWidth = container.width;

    let position = ((event.clientX - container.left) / containerWidth) * 100;
    position = Math.max(0, Math.min(position, 100));

    const minVal = salary[0];
    const maxVal = salary[1];
    const range = 100; // Range from 0 to 100 (representing 0k to 100k)
    const newValue = Math.round((position / 100) * range);

    // Ensure min doesn't exceed max and vice versa
    if (isMin) {
      setSalary([Math.min(newValue, maxVal - 5), maxVal]);
    } else {
      setSalary([minVal, Math.max(newValue, minVal + 5)]);
    }
  };

  // Mouse move and up event handlers for dragging
  const handleMouseMove = (isMin: boolean, event: MouseEvent) => {
    handleRangeChange(isMin, event);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMinMove);
    document.removeEventListener("mousemove", handleMaxMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMinMove = (event: MouseEvent) => handleMouseMove(true, event);
  const handleMaxMove = (event: MouseEvent) => handleMouseMove(false, event);

  const startDrag =
    (isMin: boolean) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (isMin) {
        document.addEventListener("mousemove", handleMinMove);
      } else {
        document.addEventListener("mousemove", handleMaxMove);
      }

      document.addEventListener("mouseup", handleMouseUp);
    };

  // Update range track position
  useEffect(() => {
    if (rangeTrackRef.current) {
      const minPercent = ((salary[0] - 0) / (100 - 0)) * 100;
      const maxPercent = ((salary[1] - 0) / (100 - 0)) * 100;

      rangeTrackRef.current.style.left = `${minPercent}%`;
      rangeTrackRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [salary]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const locationDropdown = document.getElementById("location-dropdown");
      const jobTypeDropdown = document.getElementById("jobtype-dropdown");

      if (
        locationDropdownOpen &&
        locationDropdown &&
        !locationDropdown.contains(target)
      ) {
        setLocationDropdownOpen(false);
      }

      if (
        jobTypeDropdownOpen &&
        jobTypeDropdown &&
        !jobTypeDropdown.contains(target)
      ) {
        setJobTypeDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [locationDropdownOpen, jobTypeDropdownOpen]);

  return (
  <div className="w-full bg-white shadow-[0px_6px_8px_0px_rgba(0.10,0.10,0.10,0.10)] px-3 py-3">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full ml-5">
          <Search
            className="absolute left-3 top-1/2 text-[#686868] transform -translate-y-1/2 text-"
            size={18}
          />
          <input
            type="text"
            placeholder="Search By Job Title, Role"
            className="w-full pl-10 pr-4 py-4 border-r-2 border-gray-300 focus:outline-none  placeholder-[#686868] text-[#686868] text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative w-full" id="location-dropdown">
          <div
            className="flex items-center w-full px-4 py-4 border-r-2 border-gray-300 cursor-pointer "
            onClick={(e) => {
              e.stopPropagation();
              setLocationDropdownOpen(!locationDropdownOpen);
              setJobTypeDropdownOpen(false);
            }}
          >
            <MapPin size={18} className="text-[#686868] mr-2" />
            <span
              className={`flex-1 text-sm ${
                location === "Preferred Location"
                  ? "text-[#686868]"
                  : "text-[#686868]"
              }`}
            >
              {location}
            </span>
            <ChevronDown size={18} className="text-[#686868]" />
          </div>

          {locationDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              {locationOptions.map((loc, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                  onClick={() => {
                    setLocation(loc);
                    setLocationDropdownOpen(false);
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Job Type Dropdown */}
        <div className="relative w-full" id="jobtype-dropdown">
          <div
            className="flex items-center w-full px-4 py-4 border-r-2 border-gray-300 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setJobTypeDropdownOpen(!jobTypeDropdownOpen);
              setLocationDropdownOpen(false);
            }}
          >
            <Image
              src={LogoSvg}
              alt="Logo"
              className="w-4 h-4 text-[#686868] mr-2"
            />
            <span
              className={`flex-1 text-sm ${
                jobType === "Job type" ? "text-[#686868]" : "text-[#686868]"
              }`}
            >
              {jobType}
            </span>
            <ChevronDown size={18} className="text-[#686868]" />
          </div>

          {jobTypeDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              {jobTypeOptions.map((type, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                  onClick={() => {
                    setJobType(type);
                    setJobTypeDropdownOpen(false);
                  }}
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Salary Range Slider */}
        <div className="w-full px-2 py-2 mb-4 mr-6">
          <div className="flex items-center justify-between text-xs font-medium text-black mb-5">
            <span className="font-medium text-[16px]">Salary Per Month</span>
            <span className="font-medium text-[15px]">
              ₹{salary[0]}k - ₹{salary[1]}k
            </span>
          </div>

          <div
            className="w-[85%] ml-4 relative h-0.5 bg-gray-200 rounded-full cursor-pointer"
            ref={rangeRef}
          >
            {/* Active Range Track */}
            <div
              ref={rangeTrackRef}
              className="absolute top-0 h-0.5 bg-black rounded-full"
            />

            {/* Min Thumb */}
            <div
              className="absolute -top-2 -ml-2 touch-none"
              style={{ left: `${((salary[0] - 0) / (100 - 0)) * 100}%` }}
              onMouseDown={startDrag(true)}
            >
              <div className="w-4 h-4 bg-white border-5 border-black rounded-full cursor-pointer shadow-md"></div>
            </div>

            {/* Max Thumb */}
            <div
              className="absolute -top-2 -ml-2 touch-none"
              style={{ left: `${((salary[1] - 0) / (100 - 0)) * 100}%` }}
              onMouseDown={startDrag(false)}
            >
              <div className="w-4 h-4 bg-white border-5 border-black rounded-full cursor-pointer shadow-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}