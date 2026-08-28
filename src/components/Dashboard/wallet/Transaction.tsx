import React from 'react'
import TransationTabs from './TransationTabs'

const Transaction = () => {
  return (
    <div className='p-4 sm:p-6 lg:p-8'>
        {/* heading */}
        <div>
            <h2 className='text-xl font-semibold tracking-tight text-white sm:text-2xl'>Transaction history</h2>
        </div>

        {/* tabs */}
        <TransationTabs />
    </div>
  )
}

export default Transaction
