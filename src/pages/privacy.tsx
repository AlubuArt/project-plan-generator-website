import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - ProjectPlan.ai</title>
        <meta
          name="description"
          content="Privacy Policy for ProjectPlan.ai project plan generator"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center gap-3">
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
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg transform hover:scale-105"
              >
                Back to Generator
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Privacy Policy
            </h1>
            <p className="text-gray-600 mb-8">Last updated: January 1, 2025</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ProjectPlan.ai (&quot;we,&quot; &quot;our,&quot; or
                  &quot;us&quot;) is committed to protecting your privacy. This
                  Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you visit our website and use
                  our AI-powered project planning service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Information We Collect
                </h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Information You Provide
                </h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>
                    <strong>Project Ideas:</strong> The text you input to
                    generate project plans
                  </li>
                  <li>
                    <strong>Template Preferences:</strong> Your selection of
                    Next.js or Vercel AI templates
                  </li>
                  <li>
                    <strong>Generated Plans:</strong> The AI-generated content
                    you choose to share via URLs
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Information Automatically Collected
                </h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <strong>Usage Data:</strong> How you interact with our
                    service
                  </li>
                  <li>
                    <strong>Device Information:</strong> Browser type, operating
                    system, IP address
                  </li>
                  <li>
                    <strong>Analytics Data:</strong> Page views, session
                    duration, referral sources
                  </li>
                  <li>
                    <strong>Error Logs:</strong> Technical information when
                    errors occur
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Generate AI-powered project plans based on your input</li>
                  <li>Provide and maintain our service functionality</li>
                  <li>Improve our AI models and service quality</li>
                  <li>Monitor usage patterns and service performance</li>
                  <li>Troubleshoot technical issues and provide support</li>
                  <li>Comply with legal obligations and protect our rights</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Data Storage and Retention
                </h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Session Data
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your project ideas and generated plans are processed in
                  real-time and are not permanently stored on our servers. Data
                  is only retained in memory during the generation process and
                  is discarded afterward.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Shared Plans
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you create a shareable URL, the plan data is encoded and
                  embedded in the URL itself. We do not store this data on our
                  servers - it travels with the URL and is decoded client-side
                  when accessed.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Analytics and Logs
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We retain anonymized usage analytics and error logs for up to
                  90 days to improve our service. This data cannot be traced
                  back to individual users.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Third-Party Services
                </h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  OpenAI
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use OpenAI&apos;s API to generate project plans. Your
                  project ideas are sent to OpenAI for processing. Please review{' '}
                  <a
                    href="https://openai.com/policies/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    OpenAI&apos;s Privacy Policy
                  </a>{' '}
                  for information about how they handle data.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Vercel
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our service is hosted on Vercel. They may collect standard web
                  server logs and analytics. Please review{' '}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Vercel&apos;s Privacy Policy
                  </a>{' '}
                  for more information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Model Context Protocol (MCP)
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our service supports MCP integration, allowing AI agents to
                  interact with our API. When using MCP:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>AI agents can generate project plans programmatically</li>
                  <li>The same privacy protections apply to MCP requests</li>
                  <li>
                    No additional data is stored beyond normal service usage
                  </li>
                  <li>
                    Session isolation ensures requests from different agents
                    remain separate
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational security
                  measures to protect your information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>HTTPS encryption for all data transmission</li>
                  <li>No persistent storage of sensitive project data</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Limited access to systems and data</li>
                  <li>Secure API communications with third-party services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Your Rights and Choices
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the following rights regarding your information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <strong>Access:</strong> Since we don&apos;t store project
                    data, there&apos;s no stored personal data to access
                  </li>
                  <li>
                    <strong>Deletion:</strong> Your data is automatically
                    deleted after each session
                  </li>
                  <li>
                    <strong>Opt-out:</strong> You can stop using the service at
                    any time
                  </li>
                  <li>
                    <strong>Questions:</strong> Contact us about any privacy
                    concerns
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Children&apos;s Privacy
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our service is not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If you are a parent or guardian and believe
                  your child has provided us with personal information, please
                  contact us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. International Data Transfers
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your information may be transferred to and processed in
                  countries other than your own. We ensure that such transfers
                  comply with applicable data protection laws and that
                  appropriate safeguards are in place.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the &quot;Last updated&quot; date. You
                  are advised to review this Privacy Policy periodically for any
                  changes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  12. Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our
                  privacy practices, please contact us through the support
                  channels available on our website.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PrivacyPolicy;
