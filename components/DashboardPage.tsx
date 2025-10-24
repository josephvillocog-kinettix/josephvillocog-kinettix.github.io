
import React, { useState, useEffect, useMemo } from 'react';
import { Candidate, Poll } from '../types';
import { getResults, getActivePoll } from '../services/votingService';
import ResultsChart from './ResultsChart';

const DashboardPage: React.FC = () => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anonymizeAll, setAnonymizeAll] = useState(true);

  useEffect(() => {
    const fetchAndSetResults = async () => {
      try {
        const activePoll = await getActivePoll();
        setPoll(activePoll);

        if (activePoll) {
          const data = await getResults();
          setResults(data.slice(0, 5)); // Only show top 5
        }

        setError(null);
      } catch (err) {
        setError('Failed to load results. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetResults(); // Initial fetch

    const intervalId = setInterval(fetchAndSetResults, 3000); // Refresh every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const chartData = useMemo(() => {
    if (!anonymizeAll) {
      return results;
    }
    // Anonymize all candidates in the list
    return results.map((candidate, index) => {
      return {
        ...candidate,
        name: `Candidate ${String.fromCharCode(65 + index)}`, // A, B, C, D, E
      };
    });
  }, [results, anonymizeAll]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="text-center p-8 mt-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <h2 className="mt-6 text-3xl font-extrabold text-white">No Active Poll</h2>
        <p className="mt-2 text-lg text-gray-300">Create a poll from the Admin page to see results here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Kinettix Poll Dashboard</h2>
        <p className="mt-4 text-lg text-gray-300">
          Showing results for: <span className="font-bold text-indigo-400">{poll.title}</span>
        </p>
      </div>
      
      <div className="flex items-center justify-center my-6">
        <label htmlFor="anonymize-checkbox" className="flex items-center space-x-3 cursor-pointer text-gray-300 hover:text-white transition-colors">
            <input
                id="anonymize-checkbox"
                type="checkbox"
                checked={anonymizeAll}
                onChange={(e) => setAnonymizeAll(e.target.checked)}
                className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-600"
            />
            <span className="font-medium">Anonymize All Candidates</span>
        </label>
      </div>

      {error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <ResultsChart data={chartData} />
      )}
    </div>
  );
};

export default DashboardPage;