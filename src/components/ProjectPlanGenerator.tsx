import React, { useState, useEffect } from 'react';
import MarkdownViewer from './MarkdownViewer';
import { createShareableUrl } from '@/utils/encoding';
import { downloadMarkdownFile, copyToClipboard } from '@/utils/markdown';

interface ProjectPlanGeneratorProps {
  initialPlan?: string;
}

const ProjectPlanGenerator: React.FC<ProjectPlanGeneratorProps> = ({
  initialPlan,
}) => {
  const [idea, setIdea] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(initialPlan || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const characterCount = idea.length;
  const isNearLimit = characterCount > 800;
  const isAtLimit = characterCount >= 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idea.trim()) {
      setError('Please enter your project idea');
      return;
    }

    if (idea.length < 20) {
      setError(
        'Please provide more details about your idea (at least 20 characters)'
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate plan');
      }

      const data = await response.json();
      setGeneratedPlan(data.plan);

      // Update URL with encoded plan
      const shareableUrl = createShareableUrl(
        data.plan,
        window.location.origin + window.location.pathname
      );
      window.history.pushState({}, '', shareableUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!generatedPlan) return;

    try {
      const shareableUrl = createShareableUrl(
        generatedPlan,
        window.location.origin + window.location.pathname
      );
      await copyToClipboard(shareableUrl);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
    } catch (err) {
      setError('Failed to copy link to clipboard');
    }
  };

  const handleDownload = () => {
    if (!generatedPlan) return;
    downloadMarkdownFile(generatedPlan);
  };

  const handleNewPlan = () => {
    setIdea('');
    setGeneratedPlan('');
    setError(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!generatedPlan ? (
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Turn any idea into a project plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get a comprehensive, structured project plan in under 60 seconds.
              No sign-up required.
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="idea"
                className="block text-sm font-medium text-gray-700"
              >
                Describe your project idea
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={e => setIdea(e.target.value)}
                placeholder="e.g., A mobile app for tracking daily habits with reminders, progress visualization, and social sharing features..."
                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  isAtLimit
                    ? 'border-red-500'
                    : isNearLimit
                      ? 'border-yellow-500'
                      : 'border-gray-300'
                }`}
                rows={6}
                maxLength={1000}
                disabled={isLoading}
              />
              <div className="flex justify-between items-center text-sm">
                <span
                  className={`${isAtLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-gray-500'}`}
                >
                  {characterCount}/1000 characters
                </span>
                {isNearLimit && (
                  <span className="text-yellow-600">
                    {isAtLimit
                      ? 'Character limit reached'
                      : 'Approaching character limit'}
                  </span>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !idea.trim() || idea.length < 20}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating your project plan...</span>
                </div>
              ) : (
                'Generate Project Plan'
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Your Project Plan
            </h1>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Copy Link</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Download .md</span>
              </button>

              <button
                onClick={handleNewPlan}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>New Plan</span>
              </button>
            </div>
          </div>

          {/* Success Message */}
          {showCopySuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                ✅ Share link copied to clipboard!
              </p>
            </div>
          )}

          {/* Generated Plan */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <MarkdownViewer content={generatedPlan} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPlanGenerator;
