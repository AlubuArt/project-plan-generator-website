import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const TermsOfService: React.FC = () => {
  return (
    <>
      <Head>
        <title>Terms of Service - ProjectPlan.ai</title>
        <meta
          name="description"
          content="Terms of Service for ProjectPlan.ai project plan generator"
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
              Terms of Service
            </h1>
            <p className="text-gray-600 mb-8">Last updated: January 1, 2025</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By accessing and using ProjectPlan.ai (the
                  &quot;Service&quot;), you accept and agree to be bound by the
                  terms and provision of this agreement. If you do not agree to
                  abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Description of Service
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ProjectPlan.ai is a web-based project planning tool that uses
                  artificial intelligence to generate comprehensive project
                  plans from user-provided ideas. The service includes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>AI-powered project plan generation</li>
                  <li>Support for Next.js and Vercel AI templates</li>
                  <li>Shareable project plans via URL encoding</li>
                  <li>CLI tool integration with create-vibe-code-app</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Use License
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Permission is granted to temporarily use ProjectPlan.ai for
                  personal and commercial project planning purposes. This is the
                  grant of a license, not a transfer of title, and under this
                  license you may not:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Use the service for illegal or harmful purposes</li>
                  <li>
                    Attempt to reverse engineer or extract proprietary
                    algorithms
                  </li>
                  <li>
                    Overload the service with excessive automated requests
                  </li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. User Content
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You retain ownership of any project ideas or content you
                  submit to the service. By using the service, you grant us a
                  non-exclusive, worldwide license to process your content for
                  the purpose of generating project plans. We do not store or
                  retain your project ideas beyond the session required to
                  generate your plan.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Privacy and Data Protection
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your privacy is important to us. Our Privacy Policy explains
                  how we collect, use, and protect your information when you use
                  our service. By using ProjectPlan.ai, you agree to the
                  collection and use of information in accordance with our
                  Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. AI-Generated Content
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ProjectPlan.ai uses artificial intelligence to generate
                  project plans. While we strive for accuracy and usefulness,
                  AI-generated content may contain errors, inaccuracies, or
                  biases. You should:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Review and validate all generated content</li>
                  <li>
                    Use the plans as starting points, not final specifications
                  </li>
                  <li>Apply your own judgment and expertise</li>
                  <li>
                    Not rely solely on AI-generated recommendations for critical
                    decisions
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Disclaimer of Warranties
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The service is provided &quot;as is&quot; without any
                  representations or warranties, express or implied.
                  ProjectPlan.ai makes no representations or warranties in
                  relation to this service or the information and materials
                  provided on this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In no event shall ProjectPlan.ai, nor its directors,
                  employees, partners, agents, suppliers, or affiliates, be
                  liable for any indirect, incidental, special, consequential,
                  or punitive damages, including without limitation, loss of
                  profits, data, use, goodwill, or other intangible losses,
                  resulting from your use of the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Service Modifications
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We reserve the right to modify or discontinue, temporarily or
                  permanently, the service (or any part thereof) with or without
                  notice. You agree that we shall not be liable to you or to any
                  third party for any modification, suspension, or
                  discontinuance of the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Governing Law
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These terms and conditions are governed by and construed in
                  accordance with the laws of the jurisdiction in which the
                  service operator is located, and you irrevocably submit to the
                  exclusive jurisdiction of the courts in that state or
                  location.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Contact Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please
                  contact us through the support channels available on our
                  website.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TermsOfService;
