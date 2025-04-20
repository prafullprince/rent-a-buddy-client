import React, { memo } from 'react'
import Balance from './Balance'
import { TbRecharging } from 'react-icons/tb'
import { PiHandWithdraw } from 'react-icons/pi'
import Buttons from './Buttons'

const Wallet = ({wallet}:any) => {
  return (
    <div className='p-6'>
        {/* heading */}
        <div>
            <h1 className='text-5xl font-medium'>Wallet</h1>
        </div>

        {/* balance */}
        <Balance wallet={wallet} />

        {/* recharge and withdraw */}
        <Buttons />
    </div>
  )
}

export default memo(Wallet)
