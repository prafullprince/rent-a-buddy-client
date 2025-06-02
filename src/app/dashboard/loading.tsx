import React from 'react'

const loading = () => {
  return (
    <div className="flex justify-center items-center py-6 min-h-screen">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
    </div>
  )
}

export default loading
