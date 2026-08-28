import { ITerms, termsData } from "@/data/terms";
import React from "react";
import { FileText, ShieldCheck } from "lucide-react";

const page = () => {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 text-slate-100 sm:px-8 lg:py-20">
      <header className="mb-12 flex flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-300"><FileText size={15} /> The fine print</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Terms and conditions</h1>
          <p className="mt-4 text-slate-400">A straightforward guide to using RentBabe thoughtfully and safely.</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-400"><ShieldCheck className="text-teal-300" size={22} /> Your safety matters to us</div>
      </header>

      <div className="mx-auto max-w-4xl divide-y divide-white/10">
        {termsData.map((item: ITerms, index: number) => (
          <section key={index} className="py-7 first:pt-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/80">Section {String(index + 1).padStart(2, "0")}</p>
            <h2 className="mb-3 text-xl font-semibold text-white">{item.title.replace(/^\d+(\.\d+)?\s*/, "")}</h2>
            <p className="text-sm leading-7 text-slate-400">{item.content}</p>
          </section>
        ))}
      </div>
    </main>
  );
};

export default page;
