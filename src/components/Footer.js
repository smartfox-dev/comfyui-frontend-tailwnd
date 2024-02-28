import React from 'react'

export default function Footer({
  className
}) {
  return (
    <div className={`w-full mt-24 text-white bg-[#454545] text-sm text-center py-3 ${className?className:''}`}>
      Copyright © 2024 Widgets Pty Ltd - All Rights Reserved
    </div>
  )
}