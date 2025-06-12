import { GlobeIcon, SaveAllIcon, Share2Icon } from 'lucide-react'
import { Select, SelectContent, SelectTrigger, SelectValue,SelectItem,SelectGroup } from '../ui/select'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination'
import { Button } from '../ui/button'
import { Card, CardContent, CardTitle } from '../ui/card'
import { ViolationSummary } from '../ui/volations'
import { Progress } from '../ui/progress'
import { useEffect, useRef, useState } from 'react'
import ViolationCard from '../ui/violationCard'
import { ScrollArea } from '../ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Link } from 'react-router-dom'

const Report = ({ url, scanData, progress, subDomains, totalDomains = 0, currentPage = 1, onPageChange, processID }: {
  url: string, 
  scanData: any, 
  progress: number,
  subDomains: string[],
  totalDomains: number,
  currentPage: number,
  processID: string,
  onPageChange: (page: number) => void,
  onDomainChange: (subdomain: string) => void,
}) => {
  const [selectedSubdomain, setSelectedSubdomain] = useState(url)
  const [data,setData] = useState(scanData)
  const [page, setPage] = useState(currentPage)
  const baseURL = 'http://sitesense.ceamlsapps.org:5005'
  const handleDomainChange = (subdomain: string) => {
    setSelectedSubdomain(subdomain);
    console.log('Selected subdomain:', subdomain);

    // Find the index of the selected subdomain
    const subDomainKeys = Object.keys(subDomains);
    const subDomainValues = Object.values(subDomains); // Get the actual subdomain URLs
    console.log('Subdomain keys:', subDomainKeys);
    console.log('Subdomain values:', subDomainValues);

    const newPage = subDomainValues.indexOf(subdomain); // Search in values instead of keys
    console.log('New page index:', newPage);
    console.log('Subdomain:', subdomain);
    if (newPage === -1) {
      console.error('Subdomain not found in subDomainValues:', subdomain);
      return; // Exit if subdomain is not found
    }

    setPage(newPage + 1); // Update the current page (1-based index)
    onPageChange(newPage + 1); // Notify parent about the page change
    console.log('newPage:', newPage + 1);

    // Update the scanData for the selected page
    const updatedData = scanData?.info?.[newPage]?.info || {};
    console.log('Updated Data: ', updatedData);
    setData(updatedData); // Update the data state
  }

  const violations = data?.info?.violations || [];
  const initialized = useRef(false);

  useEffect(() => {
    if (!scanData || !scanData.info) return;

    const pageIndex = page - 1;
    const updatedData = scanData.info[pageIndex]?.info || {};
    setData(updatedData);
    if (subDomains && Object.keys(subDomains).length > 0) {
      const firstSubdomain = Object.values(subDomains)[0];
      if (firstSubdomain) {
        setSelectedSubdomain(firstSubdomain);
        //handleDomainChange(firstSubdomain);
        
      }
      
    }
    
  }, [selectedSubdomain, subDomains]);

  const generatePaginationItems = () => {
    const subDomainKeys = Object.keys(subDomains); // Get an array of subdomain URLs
    const totalPages = subDomainKeys.length;
    const items = [];

    // Always show the first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          onClick={() => {
            onPageChange(1);
            handleDomainChange(subDomainKeys[0]); // Update webview for the first subdomain
          }}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 2; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => {
                onPageChange(i);
                handleDomainChange(subDomainKeys[i - 1]); // Update webview for corresponding subdomain
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show ellipsis for many pages
      if (currentPage > 3) {
        items.push(<PaginationEllipsis key="ellipsis-1" />);
      }

      // Show current page and neighbors
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => {
                onPageChange(i);
                handleDomainChange(subDomainKeys[i - 1]); // Update webview for corresponding subdomain
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis-2" />);
      }

      // Always show the last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink 
              onClick={() => {
                onPageChange(totalPages);
                handleDomainChange(subDomainKeys[totalPages - 1]); // Update webview for the last subdomain
              }}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const saveReport = async () => {
    console.log(processID)
    // if (!scanData || !processID) {
    //   console.error('Error: scanData or processID is not available.');
    //   return; // Exit the function early if scanData or processID is missing
    // }
    // console.log('id: ', scanData.violations)
    console.log('url: ', url)
    try {
      const response = await fetch(`${baseURL}/api/v2/scan/save/${processID}`,{method: 'POST'});

      if (!response.ok) {
        throw new Error(`Failed to save report: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Report saved successfully:', result);
      shareReport();
      console.log('Report share successfully');
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  const [shareUrl, setShareUrl] = useState('')

  const shareReport = async () => {
  try {
    const response = await fetch(`${baseURL}/api/v2/scan/generate-report/${processID}`)
    const text = await response.text()

    console.log('Raw response:', text)

    if (response.ok) {
      const data = JSON.parse(text)
      console.log('Report generated successfully:', data)

      if (data?.data) {
        setShareUrl(data.data)
      }
    } else {
      console.error('Fetch request failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Error sharing report:', error)
  }
}


  
  const uniqueSubDomains = Array.from(new Set(subDomains));
  return (
    <div className='grid grid-cols-3'>
      <div className='flex flex-col gap-2 col-span-2  h-full p-5'>
        <div className='flex items-center gap-2 px-3'>
          <p className='flex items-center gap-2 p-2 mr-auto bg-gray-100 rounded-lg'>
            <GlobeIcon/>{url}
          </p>
          <Dialog>
            <DialogTrigger>
              <Button onClick={shareReport}><Share2Icon/>Share</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Report for {url} generated</DialogTitle>
                <DialogDescription>
                  {shareUrl ? (
                    <a href={shareUrl} target="_blank" className="text-blue-600 underline">
                      View the report here
                    </a>
                  ) : (
                    "Generating link..."
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>  
          
          <Dialog>
            <DialogTrigger>
              <Button onClick={saveReport}><SaveAllIcon/>Save</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{url} Report Saved!</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          
          
          </div>
        <div className='flex items-center gap-2 px-3 mb-4'>
          <Select onValueChange={handleDomainChange}>
            <SelectTrigger className='w-60 h-7'>
              <SelectValue placeholder={Object.values(subDomains)[0] || url} value={selectedSubdomain} />
            </SelectTrigger>
            <SelectContent className='p-1'>
              <SelectGroup>
                {Object.entries(subDomains).map(([domain, index]) => (
                  <SelectItem key={index} value={subDomains[domain]} className='text-sm h-12 w-96'>
                    {subDomains[domain]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Pagination className='justify-end'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                   onClick={() => {
                    const previousSubdomain = Object.values(subDomains)[currentPage - 2];
                    handleDomainChange(previousSubdomain);
                    onPageChange(currentPage - 1);
                  }}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {generatePaginationItems()}
              <PaginationItem>
                <PaginationNext 
                   onClick={() => {
                    const nextSubdomain = Object.values(subDomains)[currentPage];
                    handleDomainChange(nextSubdomain);
                    onPageChange(currentPage + 1);
                  }}
                  disabled={currentPage === subDomains.length}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div className='flex-1 w-full rounded-lg'>
          <webview
            src={selectedSubdomain}
            className='w-full h-[calc(100vh-200px)]'
            style={{
              border: "1px solid #ccc",
              borderRadius: "15px",
            }}
            useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            webpreferences="contextIsolation=yes, nodeIntegration=no"
            partition="persist:webviewsession"
          />
        </div>
      </div>
      <div className='col-span-1'>
        <p className='text-lg font-bold'>Report Data</p>
        
        <Link 
        to={'/datagrid'} 
        target='_blank' 
        className='bg-orange-400 rounded-md'
        onClick={() => {
        localStorage.setItem(
          "datagridState",
          JSON.stringify({ data, subDomains, url, processID })
        );}}
        >View Data Grid</Link>

        {data && violations ? (
          <div className='flex flex-col gap-1'>
            {/* <p className='text-sm font-bold'>Progress</p>
            <Progress value={progress} /> */}

            <div className="mt-4">
              <p className='text-sm font-bold'>Violations</p>
              <ScrollArea className='h-[440px] pr-4'>
                {violations.length > 0 ? (
                  violations.map((violation: any, index: number) => (
                    <ViolationCard 
                      violation={violation}
                      reportId={selectedSubdomain} 
                      key={index} 
                      reportState={{
                        scanData,
                        currentPage,
                        subDomains,
                        url,
                        processID,
                      }}
                     />
                  ))
                ) : (
                  <div className='flex justify-center items-center h-40'>
                    <div className='w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin' />
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        ): (
          <div className='flex justify-center items-center h-40'>
            <div className='w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin' />
          </div>
        ) }


      </div>
    </div>
  )
}

export default Report