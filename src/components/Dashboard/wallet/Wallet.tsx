/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { memo } from 'react'
import Balance from './Balance'
import Buttons from './Buttons'

const Wallet = ({ wallet }:any) => {
  return (
    <div className='p-4 sm:p-6 lg:p-8'>
        {/* heading */}
        <div>
            <h2 className='text-xl font-semibold text-white sm:text-2xl'>Balance overview</h2>
        </div>

        {/* balance */}
        <Balance wallet={wallet} />

        {/* recharge and withdraw */}
        <Buttons />
    </div>
  )
}

export default memo(Wallet)
