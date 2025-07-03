import { ITerms, termsData } from "@/data/terms";
import React from "react";

const page = () => {
  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-12 text-start text-black bg-slate-200 px-4 py-8">
        <p className="max-w-4xl mx-auto">Terms and Conditions</p>
      </h1>

      <div className="flex flex-col gap-4 justify-start items-start max-w-4xl mx-auto mt-12">
        {termsData.map((item: ITerms, index: number) => (
          <section key={index} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-sm">{item.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default page;
