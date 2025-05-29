/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown, ChevronsRight,ChevronsDown, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { FormData, JobFormProps } from "@/interface/job";


const backendUrl = "http://localhost:3000";
const locationOptions = ["Bangalore", "Hyderabad", "Chennai", "Remote"];
const jobTypeOptions = ["FullTime", "PartTime", "Internship", "Contract"];
const convertJobType = (type: string) => type.toUpperCase();

// Simulate a Zustand store or any state management logic
const useJobStore = {
  getState: () => ({
    createJob: (data: any) => console.log("Job added to store", data),
  }),
};

const JobForm: React.FC<JobFormProps> = ({ closeForm }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      jobTitle: "",
      companyName: "",
      location: "",
      jobType: "FullTime",
      minSalary: "",
      maxSalary: "",
      applicationDeadline: null,
      jobDescription: "",
    },
  });

  const [isSaved, setSaved] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem("jobDraft");
    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft);
      Object.keys(parsedDraft).forEach((key) => {
        if (key === "applicationDeadline" && parsedDraft[key]) {
          setValue(key as keyof FormData, new Date(parsedDraft[key]));
        } else {
          setValue(key as keyof FormData, parsedDraft[key]);
        }
      });
    }
  }, [setValue]);

  const saveDraft = () => {
    const formData = watch();
    localStorage.setItem("jobDraft", JSON.stringify(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onSubmit = async (data: FormData) => {
    const transformedData = {
      title: data.jobTitle,
      company_name: data.companyName,
      location: data.location,
      job_type: convertJobType(data.jobType),
      salary_range: Number(data.maxSalary),
      description: data.jobDescription,
      application_deadline: data.applicationDeadline,
    };

    try {
      const response = await fetch(`${backendUrl}/create-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedData),
      });

      const result = await response.json();

      if (result.success) {
        useJobStore.getState().createJob(result.data);
        reset();
        toast.success("Job created successfully!");
        localStorage.removeItem("jobDraft");
        closeForm();
      } else {
        throw new Error("Failed to create job");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create job.");
    }
  };

  return (
    <div className="flex justify-center items-center h-[1000px] p-4">
      <div className="bg-white rounded-xl min-h-[600px] mt-56 shadow-md p-6 w-full max-w-[780px]">
        <h1 className="text-xl font-medium text-center text-black mt-4 mb-10">Create Job Opening</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Job Title & Company Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Job Title</label>
              <input
                className={`w-full py-3.5 border ${
                  errors.jobTitle ? "border-red-500" : "border-gray-300"
                } rounded-lg p-2 text-sm focus:ring focus:ring-gray-700 text-black`}
                placeholder="Full Stack Developer"
                {...register("jobTitle", {
                  required: "Job title is required",
                  minLength: { value: 3, message: "Min 3 characters" },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters allowed",
                  },
                })}
              />
              {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Company Name</label>
              <input
                className={`w-full py-3.5 border ${
                  errors.companyName ? "border-red-500" : "border-gray-300"
                } rounded-lg p-2 text-sm  focus:ring focus:ring-gray-700 text-black`}
                placeholder="Amazon, Microsoft"
                {...register("companyName", {
                  required: "Company name is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                })}
              />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
            </div>
          </div>

          {/* Location & Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Location</label>
              <div className="relative">
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "location is required" }}
                  render={({ field }) => (
                    <select
                      className={`w-full py-3.5 border ${
                        errors.jobType ? "border-red-500" : "border-gray-300"
                      } rounded-lg p-2 text-sm appearance-none focus:outline-none focus:ring focus:ring-gray-700 text-black`}
                      {...field}
                    >
                      {locationOptions.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  )}
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
              </div>
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Job Type</label>
              <div className="relative">
                <Controller
                  name="jobType"
                  control={control}
                  rules={{ required: "Job type is required" }}
                  render={({ field }) => (
                    <select
                      className={`w-full py-3.5 border ${
                        errors.jobType ? "border-red-500" : "border-gray-300"
                      } rounded-lg p-2 text-sm appearance-none focus:outline-none focus:ring focus:ring-gray-700 text-black`}
                      {...field}
                    >
                      {jobTypeOptions.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  )}
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
              </div>
              {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType.message}</p>}
            </div>
          </div>

          {/* Salary and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Salary Range</label>
              <div className="flex gap-2">
                <input
                  className={`w-full py-3.5 border ${
                    errors.minSalary ? "border-red-500" : "border-gray-300"
                  } rounded-lg p-2 pl-6 text-sm focus:outline-none focus:ring focus:ring-gray-700 text-black`}
                  placeholder="Min"
                  {...register("minSalary", {
                    required: "Min salary is required",
                    pattern: {
                      value: /^\d+$/,
                      message: "Only numbers allowed",
                    },
                  })}
                />
                <input
                  className={`w-full py-3.5 border ${
                    errors.maxSalary ? "border-red-500" : "border-gray-300"
                  } rounded-lg p-2 pl-6 text-sm focus:outline-none focus:ring focus:ring-gray-700 text-black`}
                  placeholder="Max"
                  {...register("maxSalary", {
                    required: "Max salary is required",
                    pattern: {
                      value: /^\d+$/,
                      message: "Only numbers allowed",
                    },
                    validate: (value) =>
                      parseInt(value) > parseInt(watch("minSalary")) ||
                      "Max salary must be greater than min salary",
                  })}
                />
              </div>
              {(errors.minSalary || errors.maxSalary) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.minSalary?.message || errors.maxSalary?.message}
                </p>
              )}
            </div>

           <div>
  <label className="block text-gray-700 font-medium mb-1">Application Deadline</label>
  <Controller
    name="applicationDeadline"
    control={control}
    rules={{ required: "Application deadline is required" }}
    render={({ field }) => (
      <div className="relative">
        <DatePicker
          className="w-[359px] py-3.5 pr-10 border border-gray-300 rounded-lg px-3 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-gray-700 text-black cursor-pointer"
          selected={field.value}
          onChange={(date) => field.onChange(date)}
          minDate={new Date()}
          placeholderText="Select a date"
          dateFormat="dd/MM/yyyy"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
          <Calendar size={16} />
        </div>
      </div>
    )}
  />
  {errors.applicationDeadline && (
    <p className="text-red-500 text-xs mt-1">
      {errors.applicationDeadline.message}
    </p>
  )}
</div>

          </div>

          {/* Job Description */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Job Description</label>
            <textarea
              rows={7}
              className={`w-full border ${
                errors.jobDescription ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-gray-700 text-black`}
              placeholder="Describe the role, requirements, benefits, etc."
              {...register("jobDescription", {
                required: "Job description is required",
                minLength: { value: 10, message: "Min 10 characters required" },
              })}
            />
            {errors.jobDescription && (
              <p className="text-red-500 text-xs mt-1">{errors.jobDescription.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-5 mb-2">
            <button
              type="button"
              onClick={saveDraft}
              className="flex items-center justify-center gap-2 px-4 py-3 w-[180px] border-2 border-gray-700 rounded-lg text-black text-md hover:bg-gray-100"
            >
             
              {isSaved ? "Draft Saved" : "Save Draft"}
               <ChevronsDown size={16} />
            </button>
            <button
              type="submit"
              className="flex items-center justify-center font-medium gap-2 px-4 py-3 w-[180px] bg-[#00aaff] text-white text-md rounded-lg hover:bg-blue-700"
            >
              Publish
              <ChevronsRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
