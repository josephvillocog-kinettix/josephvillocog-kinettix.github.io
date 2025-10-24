import React, { useState } from 'react';
import { createPoll } from '../services/votingService';

interface AdminPageProps {
  onPollCreated: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onPollCreated }) => {
  const [pollTitle, setPollTitle] = useState('');
  const [candidatesString, setCandidatesString] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = pollTitle.trim();
    if (!trimmedTitle) {
      setError('Poll title cannot be empty.');
      return;
    }

    const finalCandidates = candidatesString
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);
      
    if (finalCandidates.length < 2) {
      setError('You must provide at least two valid candidate names.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPoll(trimmedTitle, finalCandidates);
      onPollCreated();
    } catch (err) {
      setError('Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/20 z-0"></div>

      <div className="relative max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">Poll Creation</h2>
          <p className="mt-4 text-xl text-gray-400">Craft the next big question.</p>
        </div>

        <div className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-xl border border-indigo-500/20 shadow-[0_0_35px_rgba(99,102,241,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="poll-title" className="block text-sm font-medium text-gray-300 mb-2 tracking-wider">
                Poll Title / Question
              </label>
              <input
                type="text"
                id="poll-title"
                value={pollTitle}
                onChange={(e) => setPollTitle(e.target.value)}
                className="w-full px-4 py-3 text-white bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out"
                placeholder="e.g., Who should be the team mascot?"
                required
              />
            </div>

            <div>
              <label htmlFor="candidates-list" className="block text-sm font-medium text-gray-300 mb-2 tracking-wider">
                Candidates (Comma-Separated)
              </label>
              <textarea
                  id="candidates-list"
                  rows={4}
                  value={candidatesString}
                  onChange={(e) => setCandidatesString(e.target.value)}
                  className="w-full px-4 py-3 text-white bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out"
                  placeholder="e.g., Captain Comet, Star Blazer, Galactic Guardian"
                  required
              />
              <p className="mt-2 text-sm text-gray-500">
                  Enter candidate names separated by commas.
              </p>
            </div>

            {error && <p className="text-red-400 text-center">{error}</p>}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg hover:shadow-indigo-500/30 disabled:bg-gray-500 disabled:shadow-none disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center"
              >
                {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Poll...
                </>
              ) : 'Launch Poll'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
