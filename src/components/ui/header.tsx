import { Bookmark, Eye, Globe, HelpCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';


const Header = () => {
  return (
    <div className='flex justify-between items-center p-4 px-10 border-b border-gray-200'>
        <p className='flex gap-2 items-center font-semibold text-xl'><Globe/>Site Sense</p>
        <div className='flex gap-4'>
            <Link to="/dashboard" className='flex gap-2 items-center'><Eye/>Scan</Link>
            <Link to="/saved" className='flex gap-2 items-center'><Bookmark/>Saved</Link>


        </div>
        <div className='flex gap-4 align-center items-center'>
          <HelpCircleIcon className='mx-4'/>
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