import { motion } from "motion/react";

export default function Privacy() {
  return (
    <div className="bg-stone-50 min-h-screen py-24 px-6">
      <div className="mx-auto max-w-3xl bg-white p-8 md:p-16 rounded-[3rem] border border-stone-200 shadow-sm">
        <h1 className="text-4xl font-bold mb-8 tracking-tight">Privacy Policy</h1>
        <div className="prose prose-stone max-w-none space-y-6 text-stone-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">1. Information We Collect</h2>
            <p>At DraftMeter, we prioritize your privacy. We do not store the text you paste into the editor on our servers unless you explicitly use a feature that requires storage. We may collect minimal usage data (such as page views or button clicks) to improve the application.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">2. Cookies and Tracking</h2>
            <p>We use cookies to enhance your experience and for analytics. We also use third-party services like Google AdSense, which may use cookies to serve ads based on your prior visits to our website or other websites on the Internet.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">3. Google AdSense</h2>
            <p>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-stone-900 underline">Ads Settings</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">4. Data Security</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">5. Contact Us</h2>
            <p>If you have any questions regarding this privacy policy, you may contact us using the information on our contact page.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
