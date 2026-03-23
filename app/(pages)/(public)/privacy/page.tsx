import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-slate-500 font-medium mb-12">
          Last updated: March 23, 2026
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-600 leading-relaxed">
              Welcome to Resume2Apply. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We collect personal information that you voluntarily provide to us when registering on the platform, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Personal Data:</strong> Name, email address, password, and professional history (for resume generation).</li>
              <li><strong>Credentials:</strong> If you connect your Gmail or Outlook account, we store necessary OAuth tokens to send emails on your behalf. These tokens are stored securely.</li>
              <li><strong>Usage Data:</strong> Information about your interactions with the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We use the information we collect or receive:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>To facilitate account creation and logon process.</li>
              <li>To provide the core services of the platform, such as resume generation and email scheduling.</li>
              <li>To manage user accounts and provide support.</li>
              <li>To monitor the performance and security of our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Storage and Security</h2>
            <p className="text-slate-600 leading-relaxed">
              Your data is stored in your own MongoDB instance if you are self-hosting, or in our secure cloud database if using the hosted version. We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Third-Party Services</h2>
            <p className="text-slate-600 leading-relaxed">
              Our platform integrates with third-party services like Google, Microsoft (Outlook), and Sanity. These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
            <p className="text-slate-600 leading-relaxed">
              Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. You can manage most of your data directly through the platform dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Changes to This Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
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
