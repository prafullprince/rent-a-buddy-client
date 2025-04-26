/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { memo } from 'react'
import { FcAbout } from 'react-icons/fc'
import { PiCurrencyInrBold } from 'react-icons/pi'

const Balance = ({wallet}:any) => {
  return (
    <div className='flex items-center gap-4 mt-8'>
        {/* balance */}
        <div className='p-4 bg-white rounded-xl shadow-lg flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
                <h1 className='text-base font-medium text-black/65'>Available Balance</h1>
                <FcAbout className='text-lg' />
            </div>
            <div className='flex items-center gap-1'>
                <PiCurrencyInrBold className='text-2xl text-yellow-600' />
                <p className='text-2xl font-semibold'>{wallet?.balance}</p>
            </div>
        </div>

        {/* income */}
        <div className='p-4 bg-white rounded-xl shadow-lg flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
                <h1 className='text-base font-medium text-black/65'>Total Income</h1>
                <FcAbout className='text-lg' />
            </div>
            <div className='flex items-center gap-1'>
                <PiCurrencyInrBold className='text-2xl text-yellow-600' />
                <p className='text-2xl font-semibold'>{100}</p>
            </div>
        </div>

        {/* expense */}
        <div className='p-4 bg-white rounded-xl shadow-lg flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
                <h1 className='text-base font-medium text-black/65'>Total Expense</h1>
                <FcAbout className='text-lg' />
            </div>
            <div className='flex items-center gap-1'>
                <PiCurrencyInrBold className='text-2xl text-yellow-600' />
                <p className='text-2xl font-semibold'>{100}</p>
            </div>
        </div>

        {/* pending income */}
        <div className='p-4 bg-white rounded-xl shadow-lg flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
                <h1 className='text-base font-medium text-black/65'>Pending Income</h1>
                <FcAbout className='text-lg' />
            </div>
            <div className='flex items-center gap-1'>
                <PiCurrencyInrBold className='text-2xl text-yellow-600' />
                <p className='text-2xl font-semibold'>{wallet?.pending}</p>
            </div>
        </div>

        {/* referalls */}
        <div className='p-4 bg-white rounded-xl shadow-lg flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
                <h1 className='text-base font-medium text-black/65'>Referall Balance</h1>
                <FcAbout className='text-lg' />
            </div>
            <div className='flex items-center gap-1'>
                <PiCurrencyInrBold className='text-2xl text-yellow-600' />
                <p className='text-2xl font-semibold'>{wallet?.referrelBalance}</p>
            </div>
        </div>
    </div>
  )
}

export default memo(Balance)
