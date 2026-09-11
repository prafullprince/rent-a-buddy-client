"use client";

import React from "react";
import { ArrowUpRight, Clock3, Mail, MessageCircle } from "lucide-react";
import ContactForm from "@/components/information/ContactForm";

export default function ContactPage() {

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 text-slate-100 sm:px-8 lg:py-20">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
          <MessageCircle size={15} /> We are here to help
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Let&apos;s make your next moment{" "}
          <span className="text-amber-300">better.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
          Have a question about a booking, a profile, or the RentBabe
          experience? Send us a note and our team will be in touch.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="space-y-4">
          <a
            href="mailto:support@rentbabe.com"
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-amber-300/50 hover:bg-white/[0.07]"
          >
            <span className="rounded-xl bg-amber-300/10 p-3 text-amber-300">
              <Mail size={20} />
            </span>
            <span>
              <span className="block text-sm text-slate-400">
                Email our team
              </span>
              <span className="mt-1 block font-medium text-white group-hover:text-amber-300">
                support@rentbabe.com{" "}
                <ArrowUpRight className="ml-1 inline" size={15} />
              </span>
            </span>
          </a>
          <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <span className="rounded-xl bg-teal-300/10 p-3 text-teal-300">
              <Clock3 size={20} />
            </span>
            <span>
              <span className="block text-sm text-slate-400">
                Business hours
              </span>
              <span className="mt-1 block font-medium text-white">
                Mon - Fri, 10:00 - 18:00 IST
              </span>
            </span>
          </div>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}

