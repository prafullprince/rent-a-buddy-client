import React from 'react'
import { FaStar } from 'react-icons/fa';

const RatingStars = ({ rating, totalRating, className }: { rating: number, totalRating: number, className: any }) => {
  return (
    <div className='flex items-start gap-2'>
        <FaStar className='text-yellow-500 text-xl' />
        <div className='flex items-center gap-1'>
            <p className='text-white/90 font-semibold'>{rating.toFixed(1)}</p>
            <p className='text-white/90 font-semibold'>({totalRating})</p>
        </div>
    </div>
  )
}

export default RatingStars
