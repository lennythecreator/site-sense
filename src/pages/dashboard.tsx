import Report from '@/components/layouts/report'
import ScanLayout from '@/components/layouts/scan'
import { Button } from '@/components/ui/button'
import Header from '@/components/ui/header'
import { Input } from '@/components/ui/input'
import { GlobeIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const Dashboard = () => {
  const [scanning, setScanning] = useState(false)
  const [url, setUrl] = useState("")
  const [site, setSite] = useState("")
  const [isClosed, setIsClosed] = useState(false)
  const [scanData, setScanData] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [subDomains, setSubDomains] = useState<string[]>([])
  const baseURL = 'http://159.65.41.182:5005'

  const handleScan = async () => {
    // Format URL: remove www. and add https:// if needed
    let formattedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '')
    formattedUrl = `https://${formattedUrl}`
    
    setSite(formattedUrl)
    setUrl(formattedUrl)
    setScanning(true)

    try {
      // First API call to get processID and subdomains
      const response = await fetch(`${baseURL}/api/v2/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formattedUrl, type: 'link' }),
      })
      const initialData = await response.json()
      console.log(initialData.data.processID)
      console.log(`${baseURL}/api/v2/scan/status?processID=${initialData.data.processID}?page=1&limit=1`)
      if (initialData.status === 'SUCCESS') {
        const processID = initialData.data.processID
        const totalSubdomains = initialData.data.getSubDomains.length
        // Simply set the subdomains directly
        setSubDomains(initialData.data.getSubDomains)

        // Set up SSE connection
        const eventSource = new EventSource(`${baseURL}/api/v2/scan/${processID}?page=1&limit=1`)
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data)
          setScanData(data)
          console.log(data)
          console.log(totalSubdomains)
          // Calculate progress
          if (data.totalCount) {
            setProgress((data.currentCount / totalSubdomains) * 100)
          }

          // Close connection when scan is complete or timeout
          if (data.currentCount === totalSubdomains || data.status === 'timeout') {
            eventSource.close()
          }
        }

        eventSource.onerror = (error) => {
          console.error('SSE Error:', error)
          eventSource.close()
        }

        // Timeout after 300 seconds
        setTimeout(() => {
          eventSource.close()
        }, 300000)
      }
    } catch (error) {
      console.error('Scan error:', error)
    }
  }

  const changePage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className='flex flex-col h-full'>
       <ScanLayout>
        {!scanning ?(
          <div className=' h-full flex flex-col flex-1 justify-center items-center'>
            <div className='flex flex-col gap-4 bg-gray-100 p-10 rounded-lg w-1/2 mx-auto justify-center'>
              <h1 className='text-2xl font-bold text-center'>Scan a website</h1>
              <div className='flex gap-4'>
                <Input 
                  type="text" 
                  placeholder='Enter a website URL' 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleScan()
                    }
                  }}
                />
                <Button onClick={handleScan}>Scan</Button>
              </div>
            </div>
        
          </div>):(
            <>
              <div className='flex justify-between items-center px-10 py-2 border-b border-gray-200'>
                <p className='flex items-center gap-2 text-orange-400 bg-orange-200 p-2 text-sm rounded-lg'><GlobeIcon/>{site}</p>
                <Button
                className='h-8'
                onClick={() => setIsClosed(true)}>Close</Button>
              </div>
              <Report 
                url={url}
                scanData={scanData}
                progress={progress}
                totalDomains={scanData?.getSubDomains?.length || 0}
                currentPage={currentPage}
                onPageChange={changePage}
                subDomains={subDomains}
              />
            </>
        )}
        
        {isClosed && (
          <div className=' h-full flex flex-col flex-1 justify-center items-center'>
            <div className='flex flex-col gap-4 bg-gray-100 p-10 rounded-lg w-1/2 mx-auto justify-center'>
              <h1 className='text-2xl font-bold text-center'>Scan a website</h1>
              <div className='flex gap-4'>
                <Input type="text" placeholder='Enter a website URL' value={url} onChange={(e) => setUrl(e.target.value)} />
                <Button onClick={() => {setScanning(true); setIsClosed(false)}}>Scan</Button>
              </div>
            </div>
          </div>
        )}
        
      </ScanLayout>
    </div>
  )
}

export default Dashboard