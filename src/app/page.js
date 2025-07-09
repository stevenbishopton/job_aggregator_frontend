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
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 15;
  const [selectedJob, setSelectedJob] = useState(null);

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

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  // Reset to page 1 if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, datePosted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10121a] to-[#181a2b] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Project Description Section */}
        <div className="mb-8 p-6 bg-[#181a2b] border border-blue-800/60 rounded-xl text-blue-100 text-center shadow-lg backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-2 text-blue-200">Job Aggregator</h2>
          <p className="text-base text-blue-300">
            Discover the latest remote jobs from around the world. Our job aggregator collects listings from various reputable sources, all up-to-date and all authentic!. 
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
          <input
            type="text"
            placeholder="Search jobs, companies, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-[#161926] text-blue-100 border border-blue-800 focus:border-blue-400 transition placeholder:text-blue-400 focus:outline-none shadow"
          />
          <select
            value={datePosted}
            onChange={(e) => setDatePosted(e.target.value)}
            className="w-48 px-4 py-2 rounded-lg bg-[#161926] text-blue-100 border border-blue-800 focus:border-blue-400 transition focus:outline-none shadow"
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredJobs.length === 0 ? (
                <div className="col-span-full text-center text-blue-300 text-lg">
                  {jobs.length === 0 
                    ? "Give it a moment, we're fetching jobs for you..."
                    : search || datePosted 
                      ? `No jobs found matching your filters. Try adjusting your search or date range.`
                      : "No jobs available at the moment."
                  }
                </div>
              ) : (
                paginatedJobs.map((job) => {
                  const maxTags = 4;
                  const tags = Array.isArray(job.tags)
                    ? job.tags
                    : job.tags && job.tags.split
                      ? job.tags.split(",")
                      : [];
                  const visibleTags = tags.slice(0, maxTags);
                  const extraTags = tags.length - maxTags;
                  return (
                    <div key={job.job_id} className="glass-card border border-blue-500/60 rounded-2xl p-6 flex flex-col min-h-[220px] max-h-[340px] shadow-lg bg-[#181a2b]/80 hover:border-blue-400 transition-all">
                      <h2 className="text-lg font-bold mb-1 text-blue-200 line-clamp-2">
                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-300 hover:text-blue-400 transition-colors duration-200">{job.title}</a>
                      </h2>
                      <div className="text-blue-100 mb-1 font-semibold tracking-wide truncate">
                        <span>{job.company_name}</span> &middot; <span className="text-blue-400">{job.location}</span>
                      </div>
                      <div className="text-blue-400 text-xs mb-2">Posted: <span className="text-blue-200">{formatDate(job.publication_date)}</span></div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {visibleTags.map((tag, idx) => (
                          <span key={tag + idx} className="bg-blue-900/60 text-blue-200 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border border-blue-700 truncate">{tag}</span>
                        ))}
                        {extraTags > 0 && (
                          <span className="bg-blue-900/60 text-blue-200 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border border-blue-700 cursor-pointer" title="View all tags in details">
                            +{extraTags} more
                          </span>
                        )}
                      </div>
                      <div className="text-base font-semibold text-blue-300 truncate mb-2">{job.salary}</div>
                      <div className="flex flex-row flex-wrap gap-2 mb-2">
                        {job.job_type && (
                          <span className="bg-[#1a1a2e] text-blue-200 px-3 py-1 rounded text-xs font-bold border border-blue-800">{job.job_type}</span>
                        )}
                        {job.source && (
                          <span className="bg-[#181a2b] text-blue-400 px-3 py-1 rounded text-xs font-bold border border-blue-900">{job.source}</span>
                        )}
                      </div>
                      <button
                        className="mt-auto px-4 py-2 bg-blue-700 text-blue-100 rounded-lg hover:bg-blue-600 transition text-sm font-semibold border border-blue-800 shadow"
                        onClick={() => setSelectedJob(job)}
                      >
                        View Details
                      </button>
                    </div>
                  );
                })
              )}
            </div>
            {/* Modal for job details */}
            {selectedJob && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelectedJob(null)}>
                <div className="bg-[#181a2b] border border-blue-700 rounded-2xl shadow-2xl max-w-xl w-full p-8 relative text-blue-100 backdrop-blur-md" onClick={e => e.stopPropagation()}>
                  <button
                    className="absolute top-3 right-3 text-blue-400 hover:text-blue-200 text-2xl font-bold"
                    onClick={() => setSelectedJob(null)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2 className="text-2xl font-bold mb-2 text-blue-200">{selectedJob.title}</h2>
                  <div className="mb-2 text-blue-300 font-semibold">{selectedJob.company_name} &middot; <span className="text-blue-400">{selectedJob.location}</span></div>
                  <div className="mb-2 text-blue-400 text-sm">Posted: <span className="text-blue-200">{formatDate(selectedJob.publication_date)}</span></div>
                  <div className="mb-4">
                    <a href={selectedJob.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-400 hover:text-blue-200">View Original Posting</a>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedJob.tags && selectedJob.tags.split
                      ? selectedJob.tags.split(",").map((tag, idx) => (
                          <span key={tag + idx} className="bg-blue-900/60 text-blue-200 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border border-blue-700">{tag}</span>
                        ))
                      : Array.isArray(selectedJob.tags)
                        ? selectedJob.tags.map((tag, idx) => (
                            <span key={tag + idx} className="bg-blue-900/60 text-blue-200 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border border-blue-700">{tag}</span>
                          ))
                        : null}
                  </div>
                  <div className="mb-4 text-base font-semibold text-blue-300">{selectedJob.salary}</div>
                  <div className="flex gap-3 mb-4">
                    {selectedJob.job_type && (
                      <span className="bg-[#1a1a2e] text-blue-200 px-3 py-1 rounded text-xs font-bold border border-blue-800">{selectedJob.job_type}</span>
                    )}
                    {selectedJob.source && (
                      <span className="bg-[#181a2b] text-blue-400 px-3 py-1 rounded text-xs font-bold border border-blue-900">{selectedJob.source}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Pagination Controls */}
            {filteredJobs.length > jobsPerPage && (
              <div className="flex justify-center mt-10 gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-900 text-blue-100 rounded-lg disabled:opacity-50 border border-blue-800 shadow"
                >
                  Previous
                </button>
                <span className="text-blue-200 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-900 text-blue-100 rounded-lg disabled:opacity-50 border border-blue-800 shadow"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* Footer */}
      <footer className="mt-16 py-6 bg-[#181a2b] border-t border-blue-800/60 text-center text-blue-200 text-sm shadow-inner">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <span>
            <span className="font-semibold">Email:</span> <a href="mailto:kelechibishopton11@gmail.com" className="underline hover:text-blue-400">kelechibishopton11@gmail.com</a>
          </span>
          <span className="hidden md:inline">|</span>
          <span>
            <span className="font-semibold">Phone:</span> <a href="tel:+23408083685286" className="underline hover:text-blue-400">+23408083685286</a>
          </span>
        </div>
        <div className="mt-2 text-blue-400">&copy; {new Date().getFullYear()} Job Aggregator</div>
      </footer>
    </div>
  );
}
