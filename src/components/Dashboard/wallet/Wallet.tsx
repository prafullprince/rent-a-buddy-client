/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { memo } from 'react'
import Balance from './Balance'
import Buttons from './Buttons'

const Wallet = ({wallet}:any) => {
  return (
    <div className='p-6'>
        {/* heading */}
        <div>
            <h1 className='text-4xl font-medium'>Wallet</h1>
        </div>

        {/* balance */}
        <Balance wallet={wallet} />

        {/* recharge and withdraw */}
        <Buttons />
    </div>
  )
}

export default memo(Wallet)
