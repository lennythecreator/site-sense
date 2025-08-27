import { Bookmark, Bug, BugIcon, Eye, HelpCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { Dialog, DialogContent, DialogTrigger, DialogOverlay, DialogClose } from '@radix-ui/react-dialog';
import { motion } from 'motion/react';

const Header = () => {
  return (
    <div role='navigation' aria-label='nav bar' className='flex justify-between items-center p-4 px-10 border-b border-gray-200'>
        <div className='flex flex-col gap-2 items-center'>
          {/* <p className='flex gap-2 items-center font-semibold text-base'><Globe/>Site Sense</p> */}
          <img src="SiteSense.png" alt="Site Sense Logo" className='h-10 w-56'/>
        </div>
        
        <div aria-label='navigation-pages' className='flex gap-4'>
            <Link to="/dashboard" className='flex gap-1 items-center hover:text-orange-600'><Eye/>Scan</Link>
            <Link to="/saved" className='flex gap-1 items-center hover:text-orange-600'><Bookmark/>Saved</Link>
        </div>
        
        <div className='flex gap-4 align-center items-center'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className='h-8 rounded-full hover:bg-red-300  hover:text-red-600'>
                <BugIcon/> Report Bug
              </Button>
            </DialogTrigger>
            
            <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
            
            <DialogContent className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[520px] bg-white border-2 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto z-50'>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}>
                  <form
                    action="https://formspree.io/f/xanblevb"
                    method="POST"
                    className="flex flex-col gap-4 p-6 relative"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-semibold text-orange-700">Report a Bug</h2>
                      <DialogClose asChild>
                        <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-100">
                          ×
                        </Button>
                      </DialogClose>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Your email: <span className="text-red-500">*</span>
                        <input 
                          type="email" 
                          name="email" 
                          required 
                          className="h-10 px-3 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition" 
                          placeholder="you@email.com" 
                        />
                      </label>
                      
                      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Your name:
                        <input 
                          type="text" 
                          name="name" 
                          className="h-10 px-3 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition" 
                          placeholder="Your full name" 
                        />
                      </label>
                    </div>

                    {/* Bug Classification */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Bug type: <span className="text-red-500">*</span>
                        <select 
                          name="bug_type" 
                          required
                          className="h-10 px-3 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition bg-white"
                        >
                          <option value="">Select bug type</option>
                          <option value="ui-visual">UI/Visual Issue</option>
                          <option value="functionality">Functionality Problem</option>
                          <option value="performance">Performance Issue</option>
                          <option value="data">Data/Content Issue</option>
                          <option value="accessibility">Accessibility Problem</option>
                          <option value="mobile">Mobile Specific</option>
                          <option value="other">Other</option>
                        </select>
                      </label>
                      
                      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Priority:
                        <select 
                          name="priority" 
                          className="h-10 px-3 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition bg-white"
                        >
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </label>
                    </div>

                    {/* Page Information */}
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                      Page/URL where bug occurred:
                      <input 
                        type="url" 
                        name="page_url" 
                        className="h-10 px-3 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition" 
                        placeholder="https://example.com/page or Home Page" 
                      />
                    </label>

                    {/* Browser/Device Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Browser:
                        <select 
                          name="browser" 
                          className="h-10 px-3 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition bg-white"
                        >
                          <option value="">Select browser</option>
                          <option value="chrome">Google Chrome</option>
                          <option value="firefox">Mozilla Firefox</option>
                          <option value="safari">Safari</option>
                          <option value="edge">Microsoft Edge</option>
                          <option value="opera">Opera</option>
                          <option value="other">Other</option>
                        </select>
                      </label>
                      
                      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Device:
                        <select 
                          name="device" 
                          className="h-10 px-3 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition bg-white"
                        >
                          <option value="desktop">Desktop</option>
                          <option value="laptop">Laptop</option>
                          <option value="tablet">Tablet</option>
                          <option value="mobile">Mobile Phone</option>
                        </select>
                      </label>
                    </div>

                    {/* Bug Description */}
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                      Bug summary: <span className="text-red-500">*</span>
                      <input 
                        type="text" 
                        name="bug_summary" 
                        required
                        className="h-10 px-3 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition" 
                        placeholder="Brief description of the issue" 
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                      Steps to reproduce: <span className="text-red-500">*</span>
                      <textarea 
                        name="steps_to_reproduce" 
                        required 
                        rows={3} 
                        className="px-3 py-2 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition resize-none" 
                        placeholder="1. Go to...&#10;2. Click on...&#10;3. Notice that..." 
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                      Expected behavior:
                      <textarea 
                        name="expected_behavior" 
                        rows={2} 
                        className="px-3 py-2 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition resize-none" 
                        placeholder="What should happen instead?" 
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                      Actual behavior: <span className="text-red-500">*</span>
                      <textarea 
                        name="actual_behavior" 
                        required 
                        rows={3} 
                        className="px-3 py-2 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition resize-none" 
                        placeholder="What actually happens? Include any error messages..." 
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                      Additional information:
                      <textarea 
                        name="additional_info" 
                        rows={2} 
                        className="px-3 py-2 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition resize-none" 
                        placeholder="Screenshots, console errors, or any other relevant details..." 
                      />
                    </label>

                    <div className="flex gap-3 mt-4">
                      <button 
                        type="submit" 
                        className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-md font-semibold hover:bg-orange-700 transition"
                      >
                        Submit Bug Report
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center">
                      <span className="text-red-500">*</span> Required fields
                    </p>
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