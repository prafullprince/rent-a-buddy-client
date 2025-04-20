import React from 'react'
import TransationTabs from './TransationTabs'

const Transaction = () => {
  return (
    <div className='p-6'>
        {/* heading */}
        <div>
            <h1 className='text-xl text-gray-700 font-semibold tracking-wider'>Transaction History</h1>
        </div>

        {/* tabs */}
        <TransationTabs />
    </div>
  )
}

export default Transaction
