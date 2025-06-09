import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ProjectPlanGenerator from '@/components/ProjectPlanGenerator';
import { getProjectPlanFromShortUrl } from '@/utils/encoding';

const HomePage: React.FC = () => {
  const [initialPlan, setInitialPlan] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a shared plan in the URL (both old and new formats)
    const loadSharedPlan = async () => {
      try {
        const planFromUrl = await getProjectPlanFromShortUrl();
        setInitialPlan(planFromUrl || undefined);
      } catch (error) {
        console.error('Error loading shared plan:', error);
        setInitialPlan(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedPlan();
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

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Modern Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ProjectPlan.ai
                  </h1>
                  <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                    v2.0
                  </span>
                </div>
              </div>
              <nav className="hidden sm:flex items-center gap-6">
                <a
                  href="https://www.npmjs.com/package/create-vibe-code-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg hover:shadow-orange-500/25 transform hover:scale-105"
                >
                  <span>CLI Tool</span>
                  <svg
                    className="w-4 h-4"
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
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8">
          <ProjectPlanGenerator initialPlan={initialPlan} />
        </main>

        {/* Modern Footer */}
        <footer className="bg-white/70 backdrop-blur-xl border-t border-white/20 mt-16 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                    <span className="text-xl">🚀</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ProjectPlan.ai v2.0
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Transform any idea into a comprehensive project plan in
                  seconds. Built for developers who move fast.
                </p>
              </div>

              {/* Links Section */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">Resources</h3>
                <div className="space-y-2">
                  <a
                    href="https://www.npmjs.com/package/create-vibe-code-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    CLI Documentation
                  </a>
                  <a
                    href="https://docs.openai.com/api-reference"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    API Reference
                  </a>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">Features</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    AI-Powered Planning
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    CLI Integration
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    No Sign-up Required
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Instant Sharing
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200/50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <Link
                    href="/privacy"
                    className="hover:text-gray-700 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="hover:text-gray-700 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </div>
                <div className="text-sm text-gray-500">
                  © 2025 ProjectPlan.ai. Built with ❤️ for developers.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
