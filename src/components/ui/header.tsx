import { Bookmark, Eye, Globe, Share } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';


const Header = () => {
  return (
    <div className='flex justify-between items-center p-4 px-10 border-b border-gray-200'>
        <p className='flex gap-2 items-center font-semibold text-xl'><Globe/>Site Sense</p>
        <div className='flex gap-4'>
            <Link to="/scan" className='flex gap-2 items-center'><Eye/>Scan</Link>

            <Link to="/share" className='flex gap-2 items-center'><Share/>Share</Link>
            <Link to="/share" className='flex gap-2 items-center'><Bookmark/>Saved</Link>


        </div>
        <div className='flex gap-4'>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Button variant="outline">Logout</Button>
        </div>
    </div>
  )
}

export default Header;