import { Grid2X2Icon, SaveAllIcon, Share2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Select, SelectContent, SelectTrigger, SelectValue,SelectItem,SelectGroup, SelectLabel } from '../ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import ViolationCard from '../ui/violationCard'
import { Link } from 'react-router-dom'
import {motion} from 'motion/react'
import { RootState } from '@/state/store'
import { useSelector, useDispatch } from 'react-redux'
type Status ={
  code: number
}
const Report = ({ url, scanData, status,subDomains, currentPage = 1, onPageChange, processID }: {
  url: string, 
  scanData: any, 
  status: Status,
  subDomains: string[],
  currentPage: number,
  processID: string,
  onPageChange: (page: number) => void,
  onDomainChange: (subdomain: string) => void,
}) => {
  const [selectedSubdomain, setSelectedSubdomain] = useState(url)
  const [selectedGroup, setSelectedGroup] = useState('')
  const [data,setData] = useState(scanData)
  const [page, setPage] = useState(currentPage)
  const report = useSelector((state: RootState) => state.savedReports.reports);
  const dispatch = useDispatch();

  // Group subdomains by their base path (e.g., lenny.com/home)
  const groupSubdomains = (subs: string[]) => {
    const groups: { [group: string]: string[] } = {};
    subs.forEach((sub) => {
      // Extract group as the first two segments (domain + first path segment)
      const match = sub.match(/^(https?:\/\/[^\/]+\/[\w-]+)/);
      const group = match ? match[1] : sub;
      if (!groups[group]) groups[group] = [];
      groups[group].push(sub);
    });
    return groups;
  };

  const subDomainList = Object.values(subDomains);
  const grouped = groupSubdomains(subDomainList);
  const groupKeys = Object.keys(grouped);
  console.log('Status:', status);

  // When group changes, only set selectedSubdomain if there are subdomains in the group
  useEffect(() => {
    if (selectedGroup && grouped[selectedGroup] && grouped[selectedGroup].length > 0) {
      setSelectedSubdomain(grouped[selectedGroup][0]);
      setPage(1);
      onPageChange(1);
    } else {
      setSelectedSubdomain(''); // or undefined
    }
  }, [selectedGroup]);
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
  // const initialized = useRef(false); // No longer used

  useEffect(() => {
    if (!scanData || !scanData.info) return;
    const pageIndex = page - 1;
    const updatedData = scanData.info[pageIndex]?.info || {};
    setData(updatedData);
  }, [selectedSubdomain, subDomains, page]);

  // Generate pagination for subdomains in the selected group
  const generatePaginationItems = () => {
    if (!selectedGroup || !grouped[selectedGroup]) return null;
    const groupSubs = grouped[selectedGroup];
    const totalPages = groupSubs.length;
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => {
              setPage(i);
              onPageChange(i);
              handleDomainChange(groupSubs[i - 1]);
            }}
            isActive={page === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
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
      // Dispatch action to update the report in the Redux store
      dispatch({
        type: 'ADD_REPORT',
        payload: {
          id: processID,
          url: url,
          data: result.data,
          createdAt: new Date().toISOString(),
        },
      })
      console.log(report, 'Report saved successfully')
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


  
  // const uniqueSubDomains = Array.from(new Set(subDomains)); // No longer used
  return (
    <div aria-label='report layout' className='grid grid-cols-3'>
      <div className='flex flex-col gap-2 col-span-2  h-full p-5'>
        <div className='flex items-center gap-2 px-3'>
          <p className='flex items-center gap-2 p-2 mr-auto bg-gray-100 rounded-lg'>
            Select Subdomain
          </p>
          <Dialog aria-label='share report dialog'>
            <DialogTrigger>
              <Button onClick={shareReport} className=' bg-orange-200 text text-orange-700 rounded-xl'><Share2Icon/>Share</Button>
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
              <Button onClick={saveReport} className='rounded-xl'><SaveAllIcon/>Save</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{url} Report Saved!</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          
          
          </div>
        <div className='flex items-center gap-2 px-3 mb-4'>
          {/* Group dropdown */}
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger aria-label='select subdomain group' className='w-60 h-7'>
            
            <SelectValue placeholder='Select Group' />
          </SelectTrigger>
            <SelectContent className='p-1'>
              <SelectGroup>
                <SelectLabel>Subdomain Group</SelectLabel>
                {groupKeys.map((group) => (
                  <SelectItem key={group} value={group} className='text-sm h-12 w-96'>
                    {group}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Subdomain dropdown (filtered by group) */}
          <Select value={selectedSubdomain} onValueChange={handleDomainChange}>
          <SelectTrigger aria-label='select subdomain' className='w-60 h-7'>
            <SelectValue placeholder='Select Subdomain' />
          </SelectTrigger>
            <SelectContent className='p-1'>
              <SelectGroup>
                <SelectLabel>Subdomain</SelectLabel>
                {(grouped[selectedGroup] || []).map((sub) => (
                  <SelectItem key={sub} value={sub} className='text-sm h-12 w-96'>
                    {sub}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Pagination className='justify-end'>
            <PaginationContent>
              {(selectedGroup && grouped[selectedGroup] && (grouped[selectedGroup] || []).indexOf(selectedSubdomain) > 0) && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      const prevIdx = (grouped[selectedGroup] || []).indexOf(selectedSubdomain) - 1;
                      if (prevIdx >= 0) {
                        handleDomainChange(grouped[selectedGroup][prevIdx]);
                        setPage(prevIdx + 1);
                        onPageChange(prevIdx + 1);
                      }
                    }}
                  />
                </PaginationItem>
              )}
              {generatePaginationItems()}
              {(selectedGroup && grouped[selectedGroup] && (grouped[selectedGroup] || []).indexOf(selectedSubdomain) < (grouped[selectedGroup] || []).length - 1) && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      const nextIdx = (grouped[selectedGroup] || []).indexOf(selectedSubdomain) + 1;
                      if (nextIdx < (grouped[selectedGroup] || []).length) {
                        handleDomainChange(grouped[selectedGroup][nextIdx]);
                        setPage(nextIdx + 1);
                        onPageChange(nextIdx + 1);
                      }
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>

        <div className='flex-1 w-full rounded-lg'>
          <webview
          tabIndex={-1}
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
      <div className='col-span-1 px-2'>
        <p className='text-lg font-bold pt-3'>Report Data</p>
        
        <Link 
        to={'/datagrid'} 
        target='_blank' 
        className=' flex w-full bg-slate-200 rounded-md p-2 my-2 items-center justify-center gap-2 text-slate-800 hover:bg-slate-300 transition-colors ease-in-out duration-300'
        onClick={() => {
        localStorage.setItem(
          "datagridState",
          JSON.stringify({ data, subDomains, url, processID })
        );}}
        ><Grid2X2Icon/> View Data Grid</Link>

        {data && violations ? (
          <div className='flex flex-col gap-1 p-2'>
            {/* <p className='text-sm font-bold'>Progress</p>
            <Progress value={progress} /> */}

            <div className="mt-4">
              <p className='text-sm font-bold'>Issues</p>
              <ScrollArea className='h-full pr-4 lg:h-[calc(100vh-100px)]'>
                {status?.code === 200 && violations.length > 0 ? (
                  <motion.div variants={container} initial="initial" animate="animate">
                    {violations.map((violation: any, index: number) => (
                      <motion.div
                        tabIndex={index}
                        key={index}
                        variants={child}
                      >
                        <ViolationCard
                        
                          violation={violation}
                          siteLink={data?.info?.url || violation.url || violation.nodes?.[0]?.url || ''}
                          reportId={selectedSubdomain}
                          reportState={{
                            scanData,
                            currentPage,
                            subDomains,
                            url,
                            processID,
                          }}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : status?.code === 500 ? (
                  <div>
                    <p className='text-red-500'>An error occurred while fetching the report data.</p>
                  </div>
                ) :(
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

const container = {
  animate: {
    transition: {
      staggerChildren: 0.15, // 0.15s between each card
    },
  },
};

const child = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};