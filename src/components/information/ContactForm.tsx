import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend/email service
    setStatusMessage("Message submitted. We will get back to you soon!");
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 sm:p-8"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-200"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-2 block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-200"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-2 block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-200"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
              className="mt-2 block w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-200 cursor-pointer"
          >
            Send Message <ArrowUpRight size={18} />
          </button>
          {statusMessage && (
            <p className="text-sm text-emerald-300" role="status">
              {statusMessage}
            </p>
          )}
        </form>
  )
}

export default ContactForm
