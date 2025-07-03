'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Privacy Policy
      </h1>

      {/* 1. Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
        <p>
          RentBabe is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share your data when you use our website or services. By accessing RentBabe, you agree to the practices outlined here.
        </p>
      </section>

      {/* 2. Information We Collect */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Personal Information:</strong> Name, age, contact details, and identification documents (where required).</li>
          <li><strong>Account Data:</strong> Username, profile photos, preferences, and communication history.</li>
          <li><strong>Payment Data:</strong> Payment confirmations (via third-party payment processors, we do not store card info).</li>
          <li><strong>Usage Data:</strong> IP address, device type, browser type, and interaction logs.</li>
        </ul>
      </section>

      {/* 3. How We Use Your Data */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Data</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>To provide our services and connect users safely.</li>
          <li>To process payments and manage credits.</li>
          <li>To verify identities and reduce fraud or misuse.</li>
          <li>To improve user experience and optimize the platform.</li>
          <li>To send important service updates or account-related information.</li>
        </ul>
      </section>

      {/* 4. Sharing of Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">4. Sharing of Information</h2>
        <p>
          We do not sell your personal data. However, we may share it:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>With third-party vendors (e.g., payment processors, analytics providers).</li>
          <li>With law enforcement if required by law or to prevent harm or fraud.</li>
          <li>Between users in limited and necessary contexts (e.g., during confirmed bookings).</li>
        </ul>
      </section>

      {/* 5. Cookies and Tracking */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5. Cookies and Tracking</h2>
        <p>
          We use cookies and tracking technologies to understand user behavior, improve functionality, and analyze traffic. You can control cookie preferences through your browser settings.
        </p>
      </section>

      {/* 6. Data Security */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">6. Data Security</h2>
        <p>
          We implement technical and organizational measures to secure your data. However, no system is 100% secure, so we encourage users to practice safe online behavior.
        </p>
      </section>

      {/* 7. Your Rights */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">7. Your Rights</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Access, edit, or delete your personal information.</li>
          <li>Request data portability or object to certain uses of your data.</li>
          <li>Deactivate your account at any time by contacting support.</li>
        </ul>
      </section>

      {/* 8. Third-Party Links */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">8. Third-Party Links</h2>
        <p>
          Our platform may contain links to third-party websites. We are not responsible for the privacy practices of those sites. Please review their policies separately.
        </p>
      </section>

      {/* 9. Children's Privacy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">9. Childrens Privacy</h2>
        <p>
          RentBabe is not intended for individuals under 18. We do not knowingly collect data from minors. If we become aware of such data, we will delete it promptly.
        </p>
      </section>

      {/* 10. Changes to This Policy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Significant changes will be communicated via email or on-platform notifications. Continued use of the platform constitutes acceptance of the updated policy.
        </p>
      </section>

      {/* 11. Contact Us */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">11. Contact Us</h2>
        <p>
          For any privacy-related questions or concerns, please reach out via our official support channel or email.
        </p>
      </section>

      <footer className="text-sm text-gray-500 text-center mt-12">
        Last updated: June 30, 2025
      </footer>
    </main>
  );
}
