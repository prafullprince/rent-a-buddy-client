import Sidebar from '@/components/Dashboard/Sidebar'
import React from 'react'

const layout = ({children}: {children:any}) => {
  return (
    <div className='flex gap-2 items-start'>
        <div>
            <Sidebar />
        </div>
        <div className='w-full min-h-screen'>{children}</div>
    </div>
  )
}

export default layout
