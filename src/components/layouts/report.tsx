import { GlobeIcon, SaveAllIcon, Share2Icon } from 'lucide-react'
import { Select, SelectContent, SelectTrigger, SelectValue,SelectItem,SelectGroup } from '../ui/select'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { ViolationSummary } from '../ui/volations'
import { Progress } from '../ui/progress'

const Report = ({ url, scanData, progress, subDomains, totalDomains = 0, currentPage = 1, onPageChange }: { 
  url: string, 
  scanData: any, 
  progress: number,
  subDomains: string[],
  totalDomains: number,
  currentPage: number,
  onPageChange: (page: number) => void 
}) => {
  const generatePaginationItems = () => {
    const totalPages = subDomains.length; // Use subDomains length instead
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          onClick={() => onPageChange(1)}
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
              onClick={() => onPageChange(i)}
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
              onClick={() => onPageChange(i)}
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
              onClick={() => onPageChange(totalPages)}
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

  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className='flex flex-col gap-2 col-span-2  h-full p-5'>
        <div className='flex items-center gap-2 px-3'>
          <p className='flex items-center gap-2 p-2 mr-auto bg-gray-100 rounded-lg'>
            <GlobeIcon/>{url}
          </p>
          <Button><Share2Icon/>Share</Button>
          <Button><SaveAllIcon/>Save</Button>
          </div>
        <div className='flex items-center gap-2 px-3 mb-4'>
          <Select>
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
            src={url}
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
      <div className='col-span-1 p-4'>
        <p className='text-lg font-bold'>Report Data</p>
        <Card className='p-0'>
          <CardContent>
            {scanData && (
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-bold'>Progress</p>
                <Progress value={progress} />
              </div>
            )}
            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Report