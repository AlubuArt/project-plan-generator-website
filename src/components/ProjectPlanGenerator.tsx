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
  const [showCliCopySuccess, setShowCliCopySuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    'next' | 'vercel-ai'
  >('next');
  const [projectName, setProjectName] = useState('my-project');

  const characterCount = idea.length;
  const isNearLimit = characterCount > 800;
  const isAtLimit = characterCount >= 1000;

  // Generate CLI-compatible URLs and commands
  const getCliUrl = () => {
    if (!generatedPlan) return '';
    const shareableUrl = createShareableUrl(
      generatedPlan,
      window.location.origin + window.location.pathname
    );
    // Extract the encoded part and create a raw API URL
    const urlParts = shareableUrl.split('#/p=');
    if (urlParts.length === 2) {
      return `${window.location.origin}/api/plan/${urlParts[1]}`;
    }
    return '';
  };

  const getCliCommand = () => {
    const url = getCliUrl();
    if (!url) return '';

    return `npx create-vibe-code-app ${projectName} ${url} --template ${selectedTemplate}`;
  };

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
        body: JSON.stringify({
          idea,
          template: selectedTemplate,
        }),
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

  const handleCopyCliCommand = async () => {
    const command = getCliCommand();
    if (!command) return;

    try {
      await copyToClipboard(command);
      setShowCliCopySuccess(true);
      setTimeout(() => setShowCliCopySuccess(false), 3000);
    } catch (err) {
      setError('Failed to copy CLI command');
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
    setProjectName('my-project');
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {!generatedPlan ? (
        <div className="space-y-10">
          {/* Modern Hero Section */}
          <div className="text-center space-y-6 py-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full text-sm text-blue-700 font-medium mb-4">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              AI-Powered Project Planning
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
              Turn any idea into a
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                project plan
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Generate comprehensive, structured project plans in under 60
              seconds. Seamlessly integrate with{' '}
              <code className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg text-blue-700 font-semibold">
                create-vibe-code-app
              </code>{' '}
              for instant project creation.
            </p>

            {/* Floating elements for visual interest */}
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-20 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          {/* Modern Template Selection */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-2xl shadow-blue-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Choose Your Project Template
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="group cursor-pointer">
                  <input
                    type="radio"
                    name="template"
                    value="next"
                    checked={selectedTemplate === 'next'}
                    onChange={e =>
                      setSelectedTemplate(e.target.value as 'next')
                    }
                    className="sr-only"
                  />
                  <div
                    className={`relative p-6 border-2 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      selectedTemplate === 'next'
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg shadow-blue-500/25'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                        <span className="text-2xl">📦</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          Next.js
                        </h4>
                        <span className="text-sm text-blue-600 font-medium">
                          Default Choice
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Modern Next.js 14 with TypeScript, Tailwind CSS, and AI
                      assistant configuration. Perfect for web applications.
                    </p>
                    {selectedTemplate === 'next' && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                <label className="group cursor-pointer">
                  <input
                    type="radio"
                    name="template"
                    value="vercel-ai"
                    checked={selectedTemplate === 'vercel-ai'}
                    onChange={e =>
                      setSelectedTemplate(e.target.value as 'vercel-ai')
                    }
                    className="sr-only"
                  />
                  <div
                    className={`relative p-6 border-2 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      selectedTemplate === 'vercel-ai'
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg shadow-purple-500/25'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          Vercel AI
                        </h4>
                        <span className="text-sm text-purple-600 font-medium">
                          AI-Powered
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Next.js + Vercel AI SDK with chat interface, OpenAI
                      integration, and streaming responses. Ideal for AI
                      applications.
                    </p>
                    {selectedTemplate === 'vercel-ai' && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Modern Input Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-2xl shadow-gray-500/10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <label
                    htmlFor="idea"
                    className="text-xl font-bold text-gray-900"
                  >
                    Describe your project idea
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    id="idea"
                    value={idea}
                    onChange={e => setIdea(e.target.value)}
                    placeholder="e.g., A mobile app for tracking daily habits with reminders, progress visualization, and social sharing features..."
                    className={`w-full p-6 border-2 rounded-2xl focus:ring-4 focus:border-transparent resize-none transition-all duration-300 text-lg text-gray-900 placeholder-gray-500 ${
                      isAtLimit
                        ? 'border-red-400 focus:ring-red-200 bg-red-50'
                        : isNearLimit
                          ? 'border-yellow-400 focus:ring-yellow-200 bg-yellow-50'
                          : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500 bg-white/50'
                    }`}
                    rows={6}
                    maxLength={1000}
                    disabled={isLoading}
                  />

                  {/* Character count with modern styling */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isAtLimit
                          ? 'bg-red-100 text-red-700'
                          : isNearLimit
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {characterCount}/1000
                    </div>
                  </div>
                </div>

                {isNearLimit && (
                  <div
                    className={`flex items-center gap-2 text-sm font-medium ${
                      isAtLimit ? 'text-red-600' : 'text-yellow-600'
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {isAtLimit
                      ? 'Character limit reached'
                      : 'Approaching character limit'}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !idea.trim() || idea.length < 20}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Generating your project plan...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Project Plan
                </div>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Modern Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-between items-center bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-xl">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              Your Project Plan
            </h1>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopyLink}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 font-medium shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
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
                Copy Link
              </button>

              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 font-medium shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
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
                Download .md
              </button>

              <button
                onClick={handleNewPlan}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-2 font-medium shadow-lg hover:shadow-gray-500/25 transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
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
                New Plan
              </button>
            </div>
          </div>

          {/* Enhanced CLI Integration Section */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 border border-purple-200/50 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-purple-900">
                Create Project with CLI Tool
              </h3>
            </div>

            <p className="text-purple-800 mb-8 text-lg leading-relaxed">
              Use this plan directly with{' '}
              <code className="px-3 py-1 bg-white/60 border border-purple-200 rounded-lg text-purple-900 font-bold">
                create-vibe-code-app
              </code>{' '}
              to instantly generate your project with all configurations ready.
            </p>

            <div className="space-y-6">
              {/* Project Name Input */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                <label className="block text-lg font-bold text-purple-900 mb-3">
                  Project Name:
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={e =>
                    setProjectName(
                      e.target.value.replace(/[^a-zA-Z0-9-_]/g, '')
                    )
                  }
                  placeholder="my-awesome-project"
                  className="w-full md:w-80 px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 bg-white/80 text-lg font-medium text-gray-900 placeholder-gray-500 transition-all duration-300"
                />
              </div>

              {/* CLI Command */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                <label className="block text-lg font-bold text-purple-900 mb-3">
                  Command to run:
                </label>
                <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-base overflow-x-auto border-2 border-gray-700 shadow-inner">
                  <code>{getCliCommand()}</code>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={handleCopyCliCommand}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                  >
                    📋 Copy Command
                  </button>
                  <a
                    href="https://www.npmjs.com/package/create-vibe-code-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg hover:shadow-orange-500/25 transform hover:scale-105"
                  >
                    📚 CLI Documentation
                  </a>
                </div>
              </div>

              {/* Template Info */}
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-200/50 shadow-sm">
                <span className="text-purple-800 font-medium">
                  <strong>Selected Template:</strong>{' '}
                  {selectedTemplate === 'next' ? '📦 Next.js' : '🤖 Vercel AI'}
                  {selectedTemplate === 'vercel-ai' && (
                    <span className="ml-3 text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                      Requires OpenAI API Key
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Modern Success Messages */}
          {showCopySuccess && (
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-2xl shadow-lg animate-fade-in">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-green-800 font-bold text-lg">
                    ✅ Share link copied to clipboard!
                  </p>
                </div>
              </div>
            </div>
          )}

          {showCliCopySuccess && (
            <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-2xl shadow-lg animate-fade-in">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-purple-800 font-bold text-lg">
                    ✅ CLI command copied! Run it in your terminal to create the
                    project.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Generated Plan with modern styling */}
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-2xl">
            <MarkdownViewer content={generatedPlan} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPlanGenerator;
