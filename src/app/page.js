"use client";

import { useState, useEffect, useRef } from "react";

// Function to format the date in YYYY-MM-DD format
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to get the date after a certain number of days ago

function getDateAfter(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

// Function to build the query string for the API request

function buildQuery({ search }) {
  const params = [];
  if (search) params.push(`query=${encodeURIComponent(search)}`);
  return params.length ? `?${params.join("&")}` : "";
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showContact, setShowContact] = useState(false);
  const contactRef = useRef(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    function handleClickOutside(event) {
      if (contactRef.current && !contactRef.current.contains(event.target)) {
        setShowContact(false);
      }
    }
    if (showContact) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showContact]);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError("");
      try {
        const query = buildQuery({ search });
        const res = await fetch(`${apiUrl}/jobs${query}`);
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError("Could not fetch jobs. [500] Internal server error");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [search, apiUrl]);

 
  const filteredJobs = jobs.filter((job) => {
    if (!datePosted) return true;
    const jobDate = new Date(job.publication_date);
    if (datePosted === "24h") {
      return jobDate >= getDateAfter(1);
    } else if (datePosted === "7d") {
      return jobDate >= getDateAfter(7);
    } else if (datePosted === "30d") {
      return jobDate >= getDateAfter(30);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10121a] to-[#181a2b] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-8 relative" ref={contactRef}>
          <button
            onClick={() => setShowContact((v) => !v)}
            className="bg-blue-900 text-blue-100 px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition border border-blue-800 focus:outline-none"
          >
            Contact Me
          </button>
          {showContact && (
            <div className="absolute right-0 mt-2 w-64 bg-[#181a2b] border border-blue-900 rounded-lg shadow-lg p-4 z-10 text-sm text-blue-200">
              <div className="mb-2">
                <span className="font-semibold">Email:</span> <a href="mailto:your@email.com" className="underline hover:text-blue-400">kelechibishopton11@gmail.com</a>
              </div>
              <div>
                <span className="font-semibold">Phone:</span> <a href="tel:+1234567890" className="underline hover:text-blue-400">+23408083685286</a>
              </div>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-10 text-center text-blue-200 tracking-widest">Job Aggregator</h1>
        <div className="flex flex-col sm:flex-row gap-6 mb-14 flex-wrap">
          <input
            type="text"
            placeholder="Search jobs, companies, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-[#181a2b] text-white border border-blue-900 focus:border-blue-400 transition placeholder:text-blue-200 focus:outline-none"
          />
          <select
            value={datePosted}
            onChange={(e) => setDatePosted(e.target.value)}
            className="w-48 px-4 py-2 rounded bg-[#181a2b] text-white border border-blue-900 focus:border-blue-400 transition focus:outline-none"
          >
            <option value="">Any time</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
        {loading ? (
          <div className="text-center text-blue-300 text-lg">Loading jobs...</div>
        ) : error ? (
          <div className="text-center text-red-400 text-lg">{error}</div>
        ) : (
          <div className="grid gap-14">
            {filteredJobs.length === 0 ? (
              <div className="text-center text-blue-300 text-lg">
                {jobs.length === 0 
                  ? "No jobs found. Please check if the backend is running."
                  : search || datePosted 
                    ? `No jobs found matching your filters. Try adjusting your search or date range.`
                    : "No jobs available at the moment."
                }
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.job_id} className="glass-card border border-blue-900 rounded-xl p-8 flex flex-col sm:flex-row gap-8 items-start shadow-md transition hover:border-blue-400 bg-[#161926]/80">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2 text-blue-200">
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-300 hover:text-blue-400 transition-colors duration-200">{job.title}</a>
                    </h2>
                    <div className="text-blue-100 mb-2 font-semibold tracking-wide">
                      <span>{job.company_name}</span> &middot; <span className="text-blue-300">{job.location}</span>
                    </div>
                    <div className="text-blue-400 text-sm mb-3">Posted: <span className="text-blue-200">{formatDate(job.publication_date)}</span></div>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {job.tags && job.tags.split
                        ? job.tags.split(",").map((tag, idx) => (
                            <span key={tag + idx} className="bg-blue-900/40 text-blue-200 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-wider border border-blue-800">{tag}</span>
                          ))
                        : Array.isArray(job.tags)
                          ? job.tags.map((tag, idx) => (
                              <span key={tag + idx} className="bg-blue-900/40 text-blue-200 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-wider border border-blue-800">{tag}</span>
                            ))
                          : null}
                    </div>
                    <div className="text-base font-semibold text-blue-300">{job.salary}</div>
                  </div>
                  <div className="flex flex-col items-end gap-3 min-w-[120px]">
                    {job.job_type && (
                      <span className="bg-[#1a1a2e] text-blue-200 px-3 py-1 rounded text-xs font-bold border border-blue-800">{job.job_type}</span>
                    )}
                    {job.source && (
                      <span className="bg-[#181a2b] text-blue-400 px-3 py-1 rounded text-xs font-bold border border-blue-900">{job.source}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
