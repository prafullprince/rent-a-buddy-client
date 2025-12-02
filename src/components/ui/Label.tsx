import React from 'react'

const Label = ({labelname}:{labelname:string}) => {
  return (
    <div className='text-sm font-semibold text-white/70'> 
        {labelname}
    </div>
  )
}

export default Label
