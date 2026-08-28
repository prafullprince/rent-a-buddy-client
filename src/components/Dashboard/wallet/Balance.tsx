/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { memo } from 'react'
import { FcAbout } from 'react-icons/fc'
import { PiCurrencyInrBold } from 'react-icons/pi'

const Balance = ({wallet}:any) => {
  return (
    <div className='mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
        {/* balance */}
        <div className='flex flex-col gap-5 rounded-2xl border border-amber-300/20 bg-amber-300/[0.08] p-4 text-white/70 shadow-lg shadow-amber-300/5 transition-transform hover:-translate-y-1'>
            <div className='flex items-center gap-3'>
                <h1 className='text-base font-medium text-white/90'>Available Balance</h1>
                <FcAbout className='text-lg' />
            </div>
            <div className='flex items-center gap-1'>
                <PiCurrencyInrBold className='text-2xl text-amber-300' />
                <p className='text-2xl font-semibold text-white'>{wallet?.balance ?? 0}</p>
            </div>
        </div>

        {/* income */}
        <div className='flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-white/70 shadow-lg transition-transform hover:-translate-y-1'>
            <div className='flex items-center gap-3'>
                <h1 className='text-base font-medium text-white/90'>Total Income</h1>
                <FcAbout className='text-lg' />
            </div>
            <div className='flex items-center gap-1'>
                <PiCurrencyInrBold className='text-2xl text-teal-300' />
                <p className='text-2xl font-semibold text-white'>{100}</p>
            </div>
        </div>

        {/* expense */}
        <div className='flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-white/70 shadow-lg transition-transform hover:-translate-y-1'>
            <div className='flex items-center gap-3'>
                <h1 className='text-base font-medium text-white/90'>Total Expense</h1>
                <FcAbout className='text-lg' />
            </div>
            <div className='flex items-center gap-1'>
                <PiCurrencyInrBold className='text-2xl text-rose-300' />
                <p className='text-2xl font-semibold text-white'>{100}</p>
            </div>
        </div>

        {/* pending income */}
        <div className='flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-white/70 shadow-lg transition-transform hover:-translate-y-1'>
            <div className='flex items-center gap-3'>
                <h1 className='text-base font-medium text-white/90'>Pending Income</h1>
                <FcAbout className='text-lg' />
            </div>
            <div className='flex items-center gap-1'>
                <PiCurrencyInrBold className='text-2xl text-sky-300' />
                <p className='text-2xl font-semibold text-white'>{wallet?.pending ?? 0}</p>
            </div>
        </div>

        {/* referalls */}
        <div className='flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-white/70 shadow-lg transition-transform hover:-translate-y-1'>
            <div className='flex items-center gap-3'>
                <h1 className='text-base font-medium text-white/90'>Referall Balance</h1>
                <FcAbout className='text-lg' />
            </div>
            <div className='flex items-center gap-1'>
                <PiCurrencyInrBold className='text-2xl text-violet-300' />
                <p className='text-2xl font-semibold text-white'>{wallet?.referrelBalance ?? 0}</p>
            </div>
        </div>
    </div>
  )
}

export default memo(Balance)
