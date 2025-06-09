import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ProjectPlanGenerator from '@/components/ProjectPlanGenerator';
import { getProjectPlanFromUrl } from '@/utils/encoding';

const HomePage: React.FC = () => {
  const [initialPlan, setInitialPlan] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a shared plan in the URL
    const planFromUrl = getProjectPlanFromUrl();
    setInitialPlan(planFromUrl || undefined);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          Project Plan Generator - Create plans for create-vibe-code-app CLI
        </title>
        <meta
          name="description"
          content="Generate comprehensive project plans optimized for create-vibe-code-app CLI tool. Choose Next.js or Vercel AI templates and get ready-to-use commands."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph tags for social sharing */}
        <meta
          property="og:title"
          content="Project Plan Generator for create-vibe-code-app"
        />
        <meta
          property="og:description"
          content="Generate project plans with CLI integration for instant project creation"
        />
        <meta property="og:type" content="website" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Project Plan Generator for create-vibe-code-app"
        />
        <meta
          name="twitter:description"
          content="Generate project plans with CLI integration for instant project creation"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">🚀</div>
                <h1 className="text-xl font-bold text-gray-900">
                  ProjectPlan.ai
                </h1>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  v2.0
                </span>
              </div>
              <nav className="hidden sm:flex space-x-6">
                <a
                  href="https://www.npmjs.com/package/create-vibe-code-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
                >
                  <span>CLI Tool</span>
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Examples
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8">
          <ProjectPlanGenerator initialPlan={initialPlan} />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="text-lg">🚀</div>
                <span className="text-gray-600">ProjectPlan.ai v2.0</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>Built for AI-driven development</span>
                <a
                  href="https://www.npmjs.com/package/create-vibe-code-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-700 transition-colors"
                >
                  CLI Tool
                </a>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Terms
                </a>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-400">
              <p>
                Generate project plans and create projects instantly with the
                CLI tool. Perfect for rapid prototyping and AI-driven
                development.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
