import React from 'react'
import BuilderForm from './BuilderForm'

const EventBuilder = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* heading */}
      <div className="">
        <h2 className="text-xl font-semibold text-slate-700">Create Services</h2>
      </div>

      {/* Builder /> */}
      <BuilderForm />

    </div>
  )
}

export default EventBuilder
