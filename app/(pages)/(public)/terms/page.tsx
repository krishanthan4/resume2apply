import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 md:py-5">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          Terms & Conditions
        </h1>
        <p className="text-slate-500 font-medium mb-12">
          Last updated: March 23, 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing or using Resume2Apply, you agree to be bound by these Terms and Conditions. If you do disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Resume2Apply provides an open-source platform for resume generation, career tracking (Kanban), and automated email scheduling for job applications.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Resume Generation:</strong> Tools to create and customize rich PDF CVs.</li>
              <li><strong>Kanban Board:</strong> Visual tool for tracking job applications.</li>
              <li><strong>Email Scheduling:</strong> Integration with Gmail/Outlook for scheduling applications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Responsibility</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              You are responsible for the information you provide and how you use the platform.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Accuracy:</strong> All job application and resume data you enter is your sole responsibility.</li>
              <li><strong>Credentials:</strong> If you connect your email, you are responsible for managing your connection securely.</li>
              <li><strong>Local Environment:</strong> If you choose to host Resume2Apply yourself, you are responsible for the security of your local deployment.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Prohibited Uses</h2>
            <p className="text-slate-600 leading-relaxed">
              You may not use the platform for any illegal activities, spamming, or violating the terms of third-party platforms (Google, Microsoft, Sanity).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed">
              Resume2Apply is open-source under the MIT License. You are free to clone, mutate, and use the code as permitted by that license. However, the Resume2Apply brand and website content remain the property of its creators.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Disclaimer of Warranties</h2>
            <p className="text-slate-600 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTIES OF ACCURACY, RELIABILITY, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              IN NO EVENT SHALL RESUME2APPLY OR ITS CREATORS BE LIABLE FOR ANY DAMAGES WHATSOEVER (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, BUSINESS INTERRUPTION, LOSS OF INFORMATION) ARISING OUT OF THE USE OF OR INABILITY TO USE THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Termination</h2>
            <p className="text-slate-600 leading-relaxed">
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Resume2Apply. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
