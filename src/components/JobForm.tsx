
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ChevronDown, ChevronsRight, ChevronsDown, Calendar, ArrowUpDown } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"
interface FormData {
  jobTitle: string
  companyName: string
  location: string
  jobType: string
  minSalary: string
  maxSalary: string
  applicationDeadline: Date | null
  jobDescription: string
}

type JobFormProps = {
  closeForm: () => void
}

const backendUrl = "https://job-management-nest-server.onrender.com/jobs"
const locationOptions = ['Remote', 'Banglore', 'Hyderabad', 'Chennai', 'Kochi'];
const jobTypeOptions = ['Full-time', 'Part-time', 'Internship', 'Remote'];
const convertJobType = (type: string) => type.toUpperCase()

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
      jobType: "",
      minSalary: "",
      maxSalary: "",
      applicationDeadline: null,
      jobDescription: "",
    },
  })

  const [isSaved, setSaved] = useState(false)
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false)
  const [jobTypeDropdownOpen, setJobTypeDropdownOpen] = useState(false)

  const currentLocation = watch("location")
  const currentJobType = watch("jobType")

  const formValues = watch()
  const hasValue = (fieldName: keyof FormData) => {
    const value = formValues[fieldName]
    if (fieldName === "applicationDeadline") {
      return value !== null
    }
    return value && value.toString().trim() !== ""
  }

  useEffect(() => {
    const savedDraft = localStorage.getItem("jobDraft")
    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft)
      Object.keys(parsedDraft).forEach((key) => {
        if (key === "applicationDeadline" && parsedDraft[key]) {
          setValue(key as keyof FormData, new Date(parsedDraft[key]))
        } else {
          setValue(key as keyof FormData, parsedDraft[key])
        }
      })
    }
  }, [setValue])

  const saveDraft = () => {
    const formData = watch()
    localStorage.setItem("jobDraft", JSON.stringify(formData))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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
      const response = await axios.post(backendUrl, transformedData);

      const result = response.data;
      console.log(result);
      if (result.success) {
        reset();
        toast.success("Job created successfully!");
        localStorage.removeItem("jobDraft");
        closeForm();
      } else {
        throw new Error("Failed to create job");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to create job.");
    }
  };

  return (
    <div className="flex justify-center items-center h-[1000px] p-4">
      <div className="bg-white rounded-xl min-h-[600px] mt-56 shadow-md p-6 w-full max-w-[780px]">
        <h1 className="text-xl font-medium text-center text-black mt-4 mb-10">Create Job Opening</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Job Title</label>
              <input
                className={`w-full py-3.5 border ${
                  errors.jobTitle
                    ? "border-red-500"
                    : hasValue("jobTitle")
                      ? "border-gray-700 ring-1 ring-gray-700"
                      : "border-gray-300"
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
                  errors.companyName
                    ? "border-red-500"
                    : hasValue("companyName")
                      ? "border-gray-700 ring-1 ring-gray-700"
                      : "border-gray-300"
                } rounded-lg p-2 text-sm focus:ring focus:ring-gray-700 text-black`}
                placeholder="Amazon, Microsoft"
                {...register("companyName", {
                  required: "Company name is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                })}
              />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Location</label>
              <div className="relative">
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <div>
                      <div
                        className={`w-full py-3.5 border ${
                          errors.location
                            ? "border-red-500"
                            : hasValue("location")
                              ? "border-gray-700 ring-1 ring-gray-700"
                              : "border-gray-300"
                        } rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-gray-700 text-black cursor-pointer flex justify-between items-center`}
                        onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                      >
                        <span className={currentLocation ? "text-black" : "text-gray-500"}>
                          {currentLocation || "Select location"}
                        </span>
                        <ChevronDown className="text-gray-500 pointer-events-none" size={14} />
                      </div>
                      {locationDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                          {locationOptions.map((location, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                              onClick={() => {
                                field.onChange(location)
                                setLocationDropdownOpen(false)
                              }}
                            >
                              {location}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
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
                    <div>
                      <div
                        className={`w-full py-3.5 border ${
                          errors.jobType
                            ? "border-red-500"
                            : hasValue("jobType")
                              ? "border-gray-700 ring-1 ring-gray-700"
                              : "border-gray-300"
                        } rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-gray-700 text-black cursor-pointer flex justify-between items-center`}
                        onClick={() => setJobTypeDropdownOpen(!jobTypeDropdownOpen)}
                      >
                        <span className={currentJobType ? "text-black" : "text-gray-500"}>
                          {currentJobType || "Full Time"}
                        </span>
                        <ChevronDown className="text-gray-500 pointer-events-none" size={14} />
                      </div>
                      {jobTypeDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                          {jobTypeOptions.map((type, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                              onClick={() => {
                                field.onChange(type)
                                setJobTypeDropdownOpen(false)
                              }}
                            >
                              {type}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
              {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Salary Range</label>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    className={`w-full h-12 border ${
                      errors.minSalary
                        ? 'border-red-500'
                        : hasValue('minSalary')
                        ? 'border-gray-700 ring-1 ring-gray-700'
                        : 'border-gray-300'
                    } rounded-lg pl-10 pr-6 text-sm focus:outline-none focus:ring focus:ring-gray-700 text-black`}
                    placeholder="₹0"
                    {...register('minSalary', {
                      required: 'Min salary is required',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Only numbers allowed',
                      },
                    })}
                  />
                  <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <input
                    className={`w-full h-12 border ${
                      errors.maxSalary
                        ? 'border-red-500'
                        : hasValue('maxSalary')
                        ? 'border-gray-700 ring-1 ring-gray-700'
                        : 'border-gray-300'
                    } rounded-lg pl-10 pr-6 text-sm focus:outline-none focus:ring focus:ring-gray-700 text-black`}
                    placeholder="₹12,00,000"
                    {...register('maxSalary', {
                      required: 'Max salary is required',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Only numbers allowed',
                      },
                      validate: (value) =>
                        Number.parseInt(value) >
                          Number.parseInt(watch('minSalary')) ||
                        'Max salary must be greater than min salary',
                    })}
                  />
                  <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {(errors.minSalary || errors.maxSalary) && (
                <p className="text-red-500 text-xs mt-1">{errors.minSalary?.message || errors.maxSalary?.message}</p>
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
                      className={`w-[359px] py-3.5 pr-10 border ${
                        errors.applicationDeadline
                          ? "border-red-500"
                          : hasValue("applicationDeadline")
                            ? "border-gray-700 ring-1 ring-gray-700"
                            : "border-gray-300"
                      } rounded-lg px-3 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-gray-700 text-black cursor-pointer`}
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
                <p className="text-red-500 text-xs mt-1">{errors.applicationDeadline.message}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Job Description</label>
            <textarea
              rows={7}
              className={`w-full border ${
                errors.jobDescription
                  ? "border-red-500"
                  : hasValue("jobDescription")
                    ? "border-gray-700 ring-1 ring-gray-700"
                    : "border-gray-300"
              } rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-gray-700 text-black`}
              placeholder="Describe the role, requirements, benefits, etc."
              {...register("jobDescription", {
                required: "Job description is required",
                minLength: { value: 10, message: "Min 10 characters required" },
              })}
            />
            {errors.jobDescription && <p className="text-red-500 text-xs mt-1">{errors.jobDescription.message}</p>}
          </div>

          <div className="flex justify-between mt-5 mb-2">
            <button
              type="button"
              onClick={saveDraft}
              className="flex items-center justify-center gap-2 px-4 py-3 w-[180px] border border-gray-700 rounded-lg text-black text-md hover:bg-gray-100"
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
  )
}

export default JobForm