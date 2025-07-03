'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend/email service
    alert('Message submitted. We will get back to you soon!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-10">Contact Us</h1>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>
          <textarea
            name="message"
            rows={5}
            required
            value={form.message}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Send Message
        </button>
      </form>

      {/* Contact Info */}
      <div className="mt-10 text-center text-sm text-gray-600">
        <p>Email: <a href="mailto:support@rentbabe.com" className="text-blue-600 hover:underline">support@rentbabe.com</a></p>
        <p className="mt-1">Business Hours: Monday – Friday, 10:00 AM – 6:00 PM (IST)</p>
      </div>
    </main>
  );
}
