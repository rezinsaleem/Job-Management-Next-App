export interface Job {
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
export interface JobFilters {
  searchQuery: string;
  location: string | null;
  jobType: string | null;
  salary: [number, number];
}
export type FormData = {
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  minSalary: string;
  maxSalary: string;
  applicationDeadline: Date | null;
  jobDescription: string;
};
export type JobOpeningFormProps = {
  closeForm: () => void;
};

export interface JobFilterProps {
  onFilterChange: (filters: JobFilters) => void;
}
