"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const FAQItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`rounded-2xl border transition-colors ${
        isOpen ? "border-amber-300/30 bg-white/[0.07]" : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-medium text-white transition hover:text-amber-300 cursor-pointer"
      >
        {title}
        <span className="shrink-0 rounded-full bg-white/10 p-1 text-amber-300 text-xl">{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="space-y-4 px-5 pb-6 text-sm leading-7 text-slate-400"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const Faq = () => {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12 text-slate-100 sm:px-8 lg:py-20">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">Help centre</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Refunds &amp; disputes, made clear.</h1>
        <p className="mt-4 text-slate-400">The essentials on cancellations, meet-ups, and how we review a dispute.</p>
      </div>

      <section className="space-y-3">
        <FAQItem title="Request Order in Dispute">
          <p>
            When a client makes a secure upfront payment, the credits are held
            in escrow. If the client requests a refund and the provider
            declines, the order enters <strong>“In Dispute”</strong> status. Our
            team will review the case based on the evidence submitted.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Use platform messaging for transparency and proper documentation.
            </li>
            <li>
              Off-platform conversations must be supported with valid recorded
              evidence.
            </li>
            <li>
              If no proof is available, decisions will rely on platform data
              alone.
            </li>
            <li>
              We are not liable for missing or incomplete external evidence.
            </li>
          </ul>
          <p className="font-semibold">
            No Refund Guarantee After Contact Exchange:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Once contact details (phone number, username, etc.) are exchanged,
              automatic refund eligibility is void.
            </li>
            <li>
              Off-platform deals or misuse of E-Meet services violates our
              terms.
            </li>
          </ul>
          <p>
            All refunds are issued as <strong>RentBabe credits</strong>. Our
            decisions are final.
          </p>
        </FAQItem>

        <FAQItem title="Refunds for Scheduled Meet-Ups">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>100% Refund:</strong> Cancel within 5 days of the order or
              if the date cancels or fails to show up.
            </li>
            <li>
              <strong>50% Refund:</strong> Cancel less than 6 hours before the
              meet-up.
            </li>
            <li>
              <strong>Late Arrivals:</strong>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Up to 15 minutes late: Session extended accordingly.</li>
                <li>
                  Over 30 minutes late: You may cancel and receive a full
                  refund.
                </li>
              </ul>
            </li>
            <li>
              <strong>No-Show:</strong> 100% refund and the service provider may
              face penalties.
            </li>
          </ul>
        </FAQItem>

        <FAQItem title="Refunds for Online Meet-Ups & Gaming Services">
          <p>
            E-Meets are for connection-building, friendships, and respectful
            virtual experiences.
          </p>
          <p className="font-semibold">
            No Refund Guarantee After Contact Exchange:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Exchanging contact info removes refund guarantees.</li>
            <li>
              Refunds in these cases require time for investigation and may be
              denied based on intent.
            </li>
            <li>
              Misuse of E-Meet sessions (e.g., to get contact info or go
              off-platform) violates our terms.
            </li>
          </ul>
          <p className="font-semibold">No Refunds Will Be Issued For:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Mismatch in age, height, weight, or physical appearance.</li>
            <li>Service providers relationship status or location.</li>
            <li>
              Using the session for unrelated purposes (e.g., casual talks
              instead of paid advice).
            </li>
            <li>Dissatisfaction due to unmet subjective expectations.</li>
          </ul>
          <p>
            All refunds are in the form of <strong>RentBabe credits</strong>,
            and RentBabes decision is final.
          </p>
        </FAQItem>
      </section>
    </main>
  );
};

export default Faq;
