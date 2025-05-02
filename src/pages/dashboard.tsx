import Report from '@/components/layouts/report'
import ScanLayout from '@/components/layouts/scan'
import { Button } from '@/components/ui/button'
import Header from '@/components/ui/header'
import { Input } from '@/components/ui/input'
import { GlobeIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import {SSE} from 'sse.js'

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

  const subDomainHelper = (subdomain:Array<string>)=>{
    const output: { [key: string]: number } = {};
    for(let i = 0; i < subdomain.length; i++){
      output[subdomain[i]] = i
    }
    return output
  }

  const handleScan = async () => {
    // Format URL: remove www. and add https:// if needed
    let formattedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '')
    formattedUrl = `https://${formattedUrl}`
    
    setSite(formattedUrl)
    setUrl(formattedUrl)
    setScanning(true)

    try {
      // First API call to get processID and subdomains
      const response = await fetch(`${baseURL}/api/v2/scan`,{method: 'POST',headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ url: formattedUrl, type:'link' })})

      
      const initialData = await response.json()     
      
      if (initialData.status === 'SUCCESS') {
        const processID = initialData.data.processID
        const totalSubdomains = initialData.data.getSubDomains.length
        // Simply set the subdomains directly
        //const subDomainObject = subDomainHelper(initialData.data.getSubDomains)
        setSubDomains(initialData.data.getSubDomains)

        const sse = new SSE(`${baseURL}/api/v2/scan/${processID}?page=1&limit=2`);
        sse.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('SSE Status Update:', data);
          setScanData(data);
          
          // Check if all stages are completed
          // if (totalSubdomains === data.info.totalCount) {
          //   setScanData((prevData) => ({
          //       ...prevData,
          //       results: [...(prevData?.results || []), ...newData.results],
          //   }));
      
          //   sse.close();
          //   //setIsProcessing(false);
          //   // Navigate to the paper page
          //   //navigate(`/paper/${data.document_id._id}`);
          // }
        };
        sse.onerror = (error) => {
          console.error('SSE Error:', error);
          sse.close();
          //setIsProcessing(false);
        };
      }
    } catch (error) {
      console.error('Scan error:', error)
    }
  }

  const changePage = (page: number) => {
    setCurrentPage(page)
  }

  const handleSubdomainChange = async (subdomain: string) => {
    try {
      const response = await fetch(`${baseURL}/api/v2/scan/data?subdomain=${subdomain}`);
      const newData = await response.json();
      setScanData(newData); // Update scan data for the selected subdomain
    } catch (error) {
      console.error("Error fetching data for subdomain:", error);
    }
  };


  
  

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
                onDomainChange={handleSubdomainChange}
                processID={processID}
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