import React from 'react'

const Label = ({labelname}:{labelname:string}) => {
  return (
    <div className='text-sm font-semibold'> 
        {labelname}
    </div>
  )
}

export default Label
