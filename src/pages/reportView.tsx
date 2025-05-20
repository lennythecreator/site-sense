import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SSE } from 'sse.js'
import Report from '@/components/layouts/report'
import { GlobeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/ui/header'
import { Dialog } from '@radix-ui/react-dialog'
import { DialogContent, DialogTitle } from '@/components/ui/dialog'

const ReportView = () => {
  const [searchParams] = useSearchParams()
  const urlParam = searchParams.get("url")

  const [url, setUrl] = useState("")
  const [site, setSite] = useState("")
  const [scanning, setScanning] = useState(false)
  const [scanData, setScanData] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [subDomains, setSubDomains] = useState<{ [key: string]: number }>({})
  const [processID, setProcessID] = useState("")
  const [dialogOpen, setDialogOpen] = useState(true);
  
  const baseURL = 'http://10.253.54.214:5005'

  const subDomainHelper = (subdomain: string[]) => {
    const output: { [key: string]: number } = {}
    subdomain.forEach((s, i) => output[s] = i)
    return output
  }

  useEffect(() => {
    if (urlParam) {
      const formattedUrl = `https://${urlParam.replace(/^(https?:\/\/)?(www\.)?/, '')}`
      setUrl(formattedUrl)
      setSite(formattedUrl)
      startScan(formattedUrl)
    } else {
      // Try restoring from localStorage
      const storedUrl = localStorage.getItem('url')
      const storedData = localStorage.getItem('scanDataLive') || localStorage.getItem('scanData')
      const storedProcessID = localStorage.getItem('processID')
      const storedSubDomains = localStorage.getItem('subDomains')
      const storedPage = localStorage.getItem('currentPage')

      if (storedUrl && storedData && storedSubDomains && storedProcessID) {
        setUrl(storedUrl)
        setSite(storedUrl)
        setProcessID(storedProcessID)
        setScanData(JSON.parse(storedData))
        setSubDomains(JSON.parse(storedSubDomains))
        setCurrentPage(parseInt(storedPage || '1'))
        setScanning(true)
      }
    }
  }, [urlParam])

  useEffect(()=>{
    setDialogOpen(true)
  },[])

  const startScan = async (formattedUrl: string) => {
    setScanning(true)

    try {
      const response = await fetch(`${baseURL}/api/v2/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formattedUrl, type: 'link' })
      })

      const initialData = await response.json()
      if (initialData.status === 'SUCCESS') {
        const processID = initialData.data.processID
        setProcessID(processID)
        const totalSubDomains = initialData.data.getSubdomains.length
        const subDomainObject = subDomainHelper(initialData.data.getSubDomains)
        setSubDomains(subDomainObject)

        // Save to localStorage
        localStorage.setItem('url', formattedUrl)
        localStorage.setItem('processID', processID)
        localStorage.setItem('subDomains', JSON.stringify(subDomainObject))
        localStorage.setItem('currentPage', '1')

        const sse = new SSE(`${baseURL}/api/v2/scan/${processID}?page=1&limit=${totalSubDomains}`)
        sse.onmessage = (event) => {
          const data = JSON.parse(event.data);
          // Optional: Log to debug
            console.log('SSE incoming:', data);

            // ✅ Only update if data.info is non-empty
            if (Array.isArray(data.info) && data.info.length > 0) {
                setScanData(data);
                localStorage.setItem('scanDataLive', JSON.stringify(data));
            }
        }

        sse.onerror = (error) => {
          console.error('SSE Error:', error)
          sse.close()
        }
      }
    } catch (error) {
      console.error('Scan error:', error)
    }
  }

  const changePage = (page: number) => {
    setCurrentPage(page)
    localStorage.setItem('currentPage', String(page))
  }

  const handleSubdomainChange = async (subdomain: string) => {
    try {
      const response = await fetch(`${baseURL}/api/v2/scan/data?subdomain=${subdomain}`)
      const newData = await response.json()
      setScanData(newData)
      localStorage.setItem('scanDataLive', JSON.stringify(newData))
    } catch (error) {
      console.error("Error fetching data for subdomain:", error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header/>  
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
            <DialogTitle>Site Sense Guide</DialogTitle>
            <h1 className='text-lg font-medium'>Page 1</h1>
            <p>When you enter in a url you will see the web preview on the left side of the screen.</p>
            <Button className='w-52 ml-auto'>Next</Button>
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-center px-10 py-2 border-b border-gray-200">
        <p className="flex items-center gap-2 text-orange-400 bg-orange-200 p-2 text-sm rounded-lg">
          <GlobeIcon /> {site || "Scanning..."}
        </p>
        <Button className="h-8" onClick={() => window.location.href = '/dashboard'}>Close</Button>
      </div>

      {scanning &&(
        <Report
          url={url}
          scanData={scanData}
          progress={progress}
          totalDomains={Object.keys(subDomains).length}
          currentPage={currentPage}
          onPageChange={changePage}
          subDomains={Object.keys(subDomains)}
          onDomainChange={handleSubdomainChange}
          processID={processID}
        />
      ) }
    </div>
  )
}

export default ReportView
