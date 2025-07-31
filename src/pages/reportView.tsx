import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SSE } from 'sse.js'
import Report from '@/components/layouts/report'
import { GlobeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/ui/header'
import { Dialog } from '@radix-ui/react-dialog'
import { DialogContent, DialogTitle } from '@/components/ui/dialog'

//import { console } from 'inspector'

const ReportView = () => {
  const [searchParams] = useSearchParams()
  const urlParam = searchParams.get("url")
  const [status, setStatus] = useState({ code: 0 })// Initialize status with a default object
  const [url, setUrl] = useState("")
  const [site, setSite] = useState("")
  const [scanning, setScanning] = useState(false)
  const [scanData, setScanData] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [subDomains, setSubDomains] = useState<{ [key: string]: number }>({})
  const [processID, setProcessID] = useState("")
  const [dialogOpen, setDialogOpen] = useState(true);
  const hasStartedScan = useRef(false)
  //Have this be in a environment variable
  const baseURL = 'http://sitesense.ceamlsapps.org:5005'

  const subDomainHelper = (subdomain: string[]) => {
    const output: { [key: string]: number } = {}
    subdomain.forEach((s, i) => output[s] = i)
    return output
  }

  useEffect(() => {
    if (hasStartedScan.current || scanning) return;

    if (urlParam && !scanning) {
      const formattedUrl = `https://${urlParam.replace(/^(https?:\/\/)?(www\.)?/, '')}`
      console.log('Calling startScan with URL:', formattedUrl)
      setUrl(formattedUrl)
      setSite(formattedUrl)
      startScan(formattedUrl)
      setScanning(true)
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
  }, [])

  useEffect(()=>{
    setDialogOpen(true)
  },[])

  const startScan = async (formattedUrl: string) => {
    console.log('Starting scan for URL:', formattedUrl)
    setScanning(true)

    try {
      const response = await fetch(`${baseURL}/api/v2/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formattedUrl, type: 'link' })
      })

      const initialData = await response.json()
      console.log('Initial scan response:', initialData.status)
      if (initialData.status === 'SUCCESS') {
        
        console.log(status, 'Scan started successfully')
        const processID = initialData.data.processID
        setProcessID(processID)
        const totalSubDomains = initialData.data.getSubDomains.length
        console.log('Total subdomains:', totalSubDomains)
        const subDomainObject = subDomainHelper(initialData.data.getSubDomains)
        console.log('Subdomain object:', subDomainObject)
        setSubDomains(subDomainObject)

        // Save to localStorage
        localStorage.setItem('url', formattedUrl)
        localStorage.setItem('processID', processID)
        localStorage.setItem('subDomains', JSON.stringify(subDomainObject))
        localStorage.setItem('currentPage', '1')

        const sse = new SSE(`${baseURL}/api/v2/scan/${processID}?page=1&limit=${totalSubDomains}`)
        sse.onmessage = (event) => {
          const data = JSON.parse(event.data);
          //set code to 200
          //status.code = 200
          // Optional: Log to debug
            console.log('SSE incoming:', data);
            setStatus({ code: 200 });
            // ✅ Only update if data.info is non-empty
            if (Array.isArray(data.info) && data.info.length > 0) {
                setScanData(data);
                
                localStorage.setItem('scanDataLive', JSON.stringify(data));
                //sse.close();
            }
            
            if (data.info.length === totalSubDomains){
              console.log('Scan complete, closing SSE');
              sse.close()
            }
            
        }
        
        sse.onerror = (error) => {
          console.error('SSE Error:', error)
          setStatus({ code: 500 });
          sse.close()
        }
      }
    } catch (error) {
      console.error('Scan error:', error)
    }
    console.log('status code:', status.code)
  }

  const changePage = (page: number) => {
    setCurrentPage(page)
    localStorage.setItem('currentPage', String(page))
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
          status = {status}
          currentPage={currentPage}
          onPageChange={changePage}
          subDomains={Object.keys(subDomains)}
          processID={processID}
          onDomainChange={(subdomain: string) => {
            // You can implement domain change logic here if needed
            // For now, just log or leave empty
            console.log("Domain changed to:", subdomain);
          }}
        />
      ) }
    </div>
  )
}

export default ReportView
