import React from 'react'
import Header from '../ui/header'

const ScanLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
    <Header/>
    <main className='flex-1'>{children}</main>
    </>
  )
}

export default ScanLayout