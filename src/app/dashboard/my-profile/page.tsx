import ProfileDetails from '@/components/Dashboard/my-profile/ProfileDetails'
import UserDetails from '@/components/Dashboard/my-profile/UserDetails'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='p-4'>
      {/* topbar */}
      <div className='flex flex-col gap-4 mt-2'>
        {/* route */}
        <div className='flex items-center gap-2'>
            <Link href={'/'} className='text-sm text-[#838894]'>Home  <span>/</span></Link>
            <Link href={'/dashboard/my-profile'} className='text-sm text-[#838894]'>Dashboard   <span>/</span></Link>
            <Link href={''} className='text-base font-semibold text-yellow-600'>My Profile</Link>
        </div>

        {/* title */}
        <h2 className='text-2xl mt-6 font-semibold text-black'>My Profile</h2>

        {/* profile */}
        <div className='flex flex-col gap-4 max-w-md'>
            {/* profile image */}
            <UserDetails />

            {/* profileDetails */}
            <ProfileDetails />
        </div>


      </div>
    </div>
  )
}

export default page
