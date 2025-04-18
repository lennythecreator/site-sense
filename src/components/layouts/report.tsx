import { GlobeIcon, SaveAllIcon, Share2Icon } from 'lucide-react'
import { Select, SelectContent, SelectTrigger, SelectValue,SelectItem,SelectGroup } from '../ui/select'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination'
import { Button } from '../ui/button'
import { Card, CardContent, CardTitle } from '../ui/card'
import { ViolationSummary } from '../ui/volations'
import { Progress } from '../ui/progress'
import { useState } from 'react'
import ViolationCard from '../ui/violationCard'
import { ScrollArea } from '../ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

const Report = ({ url, scanData, progress, subDomains, totalDomains = 0, currentPage = 1, onPageChange }: { 
  url: string, 
  scanData: any, 
  progress: number,
  subDomains: string[],
  totalDomains: number,
  currentPage: number,
  onPageChange: (page: number) => void 
}) => {
  const [selectedSubdomain, setSelectedSubdomain] = useState(url)
  const [data,setData] = useState(scanData)
  const [page, setPage] = useState(currentPage)
  const handleDomainChange = (subdomain:string)=>{
    setSelectedSubdomain(subdomain)
  }
  const violations = scanData?.info[0]?.info?.info?.violations || [];
  const generatePaginationItems = () => {
    const totalPages = subDomains.length; // Use subDomains length instead
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          onClick={() => {
            onPageChange(1);
            handleDomainChange(subDomains[0]); // Update webview for first subdomain
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
                handleDomainChange(subDomains[i - 1]); // Update webview for corresponding subdomain
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
                handleDomainChange(subDomains[i - 1]); // Update webview for corresponding subdomain
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
  
      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink 
              onClick={() => {
                onPageChange(totalPages);
                handleDomainChange(subDomains[totalPages - 1]); // Update webview for last subdomain
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

  
  
  console.log(scanData)
  console.log('violations: ', violations)
  return (
    <div className='grid grid-cols-3'>
      <div className='flex flex-col gap-2 col-span-2  h-full p-5'>
        <div className='flex items-center gap-2 px-3'>
          <p className='flex items-center gap-2 p-2 mr-auto bg-gray-100 rounded-lg'>
            <GlobeIcon/>{url}
          </p>
          <Button><Share2Icon/>Share</Button>
          <Dialog>
            <DialogTrigger>
              <Button><SaveAllIcon/>Save</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Save Report</DialogTitle>
                <DialogDescription>
                  Name your report and Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name"  className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          </div>
        <div className='flex items-center gap-2 px-3 mb-4'>
          <Select onValueChange={handleDomainChange}>
            <SelectTrigger className='w-60 h-7'>
              <SelectValue placeholder="All pages" />
            </SelectTrigger>
            <SelectContent className='p-1'>
              <SelectGroup>
                {subDomains.map((domain, index) => (
                  <SelectItem key={index} value={domain} className='text-sm h-12 w-96'>
                    {domain}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Pagination className='justify-end'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {generatePaginationItems()}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(currentPage + 1)}
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
        {scanData && (
              <div className='flex flex-col gap-1'>
                {/* <p className='text-sm font-bold'>Progress</p>
                <Progress value={progress} /> */}
                {/*violation data */}
                {/* Render violation data here */}
                <div className="mt-4">
                  <p className='text-sm font-bold'>Violations</p>
                  <ScrollArea className='h-[440px] pr-4'>
                    {violations.map((violation, index) => (
                      <ViolationCard violation={violation}/>
                    ))}
                  </ScrollArea>
                  
                </div>
                
              </div>

            )}
      </div>
    </div>
  )
}

export default Report