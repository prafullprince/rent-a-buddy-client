import React from 'react'
import BuilderForm from './BuilderForm'

const EventBuilder = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* heading */}
      <div className="">
        <h2 className="text-2xl font-semibold text-gray-500">Create Services</h2>
      </div>

      {/* Builder /> */}
      <BuilderForm />

    </div>
  )
}

export default EventBuilder
