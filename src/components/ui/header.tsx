import { Bookmark, Bug, BugIcon, Eye, HelpCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { motion } from 'motion/react';

const Header = () => {
  return (
    <div role='navigation' aria-label='nav bar' className='flex justify-between items-center p-4 px-10 border-b border-gray-200'>
        <div className='flex flex-col gap-2 items-center'>
          {/* <p className='flex gap-2 items-center font-semibold text-base'><Globe/>Site Sense</p> */}
          <img src="SiteSense.png" alt="Site Sense Logo" className='h-10 w-56'/>
        </div>
        
        <div aria-label='navigation-pages' className='flex gap-4'>
            <Link to="/dashboard" className='flex gap-2 items-center hover:text-orange-600'><Eye/>Scan</Link>
            <Link to="/saved" className='flex gap-2 items-center hover:text-orange-600'><Bookmark/>Saved</Link>


        </div>
        <div className='flex gap-4 align-center items-center'>
          <Dialog>
            <DialogTrigger>
              <Button variant="outline" className='h-8 rounded-full hover:bg-red-300  hover:text-red-600'>
                <BugIcon/> Report Bug
              </Button>
            </DialogTrigger>
            <DialogContent className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[440px] bg-white  border-2 rounded-lg backdrop-blur-sm shadow-lg'>
              <div className="fixed inset-0 bg-white bg-opacity-60 z-40" style={{pointerEvents: 'none'}}></div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}>
                  <form
                    action="https://formspree.io/f/xanblevb"
                    method="POST"
                    className="flex flex-col gap-4 p-6 z-50 relative"
                  >
                    <h2 className="text-xl font-semibold mb-2 text-center text-orange-700">Report a Bug</h2>
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                      Your email:
                      <input type="email" name="email" required className="h-10 px-3 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition" placeholder="you@email.com" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                      Your message:
                      <textarea name="message" required rows={4} className="px-3 py-2 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition resize-none" placeholder="Describe the issue..." />
                    </label>
                    <button type="submit" className="mt-2 py-2 px-4 bg-orange-600 text-white rounded-md font-semibold hover:bg-orange-700 transition">Send</button>
                  </form>
              </motion.div>
              
            </DialogContent>
          </Dialog>
          
          <HelpCircleIcon className='mx-4'/>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png"  alt='profile image'/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Button variant="outline">Logout</Button>
        </div>
    </div>
  )
}

export default Header;