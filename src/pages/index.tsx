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
          Project Plan Generator - Turn any idea into a project plan in 60
          seconds
        </title>
        <meta
          name="description"
          content="Transform your ideas into comprehensive project plans instantly. No sign-up required. Get structured plans with goals, milestones, and risk assessments."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content="Project Plan Generator" />
        <meta
          property="og:description"
          content="Turn any idea into a project plan in 60 seconds"
        />
        <meta property="og:type" content="website" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Project Plan Generator" />
        <meta
          name="twitter:description"
          content="Turn any idea into a project plan in 60 seconds"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">📋</div>
                <h1 className="text-xl font-bold text-gray-900">
                  ProjectPlan.ai
                </h1>
              </div>
              <nav className="hidden sm:flex space-x-6">
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  How it works
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
                <div className="text-lg">📋</div>
                <span className="text-gray-600">ProjectPlan.ai</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>Built with AI • No sign-up required</span>
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
                Transform any idea into a comprehensive project plan in seconds.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
