import Report from '@/components/layouts/report'
import ScanLayout from '@/components/layouts/scan'
import { Button } from '@/components/ui/button'
import Header from '@/components/ui/header'
import { Input } from '@/components/ui/input'
import { GlobeIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import {SSE} from 'sse.js'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const Dashboard = () => {
  const [scanning, setScanning] = useState(false)
  const [url, setUrl] = useState("")
  const [site, setSite] = useState("")
  const [isClosed, setIsClosed] = useState(false)
  const [scanData, setScanData] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [subDomains, setSubDomains] = useState([])
  const [processID, setProcessID] = useState<string>("")
  const baseURL = 'http://159.65.41.182:5005'
  const [dialogOpen, setDialogOpen] = useState(true);
  

  // Inside your Dashboard component
  const navigate = useNavigate()

  const handleScan = () => {
    if (scanning) return;
    let formattedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '')
    formattedUrl = `https://${formattedUrl}`
    setScanning(true)
    navigate(`/report?url=${encodeURIComponent(formattedUrl)}`)
  }

  useEffect(()=>{
    setDialogOpen(true)
  },[])

  return (
    <div className='flex flex-col h-full'>
      {/* <Header /> */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} aria-scribedby='dialog-title'>
        <DialogContent>
          <h1 id='dialog-title'>Hi welcome to site sense please enter the website URL by clicking the scan button</h1>
        </DialogContent>
      </Dialog>
       <ScanLayout>
        {!scanning &&(
          <div className=' h-full flex flex-col flex-1 justify-center items-center'>
            <main className='flex flex-col gap-4 bg-gray-100 p-10 rounded-lg w-1/2 mx-auto justify-center'>
              <h1 className='text-2xl font-bold text-center'>Scan a website</h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleScan();
                }}
                className='flex gap-4'
              >
                <Input
                  type="text"
                  placeholder='Enter a website URL'
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  aria-label='This is a text input for Enter a website URL'
                />
                <Button type="submit">Scan</Button>
              </form>
            </main>
        
          </div>)}
        
      </ScanLayout>
    </div>
  )
}

export default Dashboard