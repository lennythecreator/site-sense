import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import Header from '../components/ui/header';
import { Bug, Globe, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {motion} from 'motion/react';
import { Pagination, PaginationContent, PaginationNext } from '@/components/ui/pagination';

type Report = {
  log_id?: {
    status?: string;
    url?: string;
    link?: string;
    createdAt?: string; // Added createdAt property
    info?: {
      info?: {
        violations?: any[];
      };
    };
  };
  // add other fields as needed
};
type currentPage =number;

const Saved = () => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<currentPage>(1);
  const baseURL = 'http://159.65.41.182:5005';
  const [paginationMetadata, setPaginationMetadata] = useState({
    totalPages: 0,
    currentPage: 1,
    totalItems: 0,
  });

  const  cache: { [key: number]: any[] } = {}
  // const fetchReports = async (currentPage: number) => {
  //     try {
  //       const response = await fetch(`${baseURL}/api/v2/scan/saved-reports?page=${currentPage}&limit=10`);
  //       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  //       const data = await response.json();
  //       console.log('Fetched Reports:', data);
  //       setReportData(data.data?.info || []);
  //       setPaginationMetadata({
  //         totalPages: data.data.totalPages,
  //         currentPage: data.currentPage,
  //         totalItems: data.data.totalCount,
  //       });
  //       console.log('Pagination Metadata:', paginationMetadata);
  //     } catch (error) {
  //       console.error('Error fetching reports:', error);
  //       if (error instanceof Error) {
  //         setError(error.message);
  //       } else {
  //         setError('Unknown error');
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  

const fetchReports = async (currentPage: number) => {
  try {
    // Check if data is cached
    if (cache[currentPage]) {
      console.log('Returning cached data for page', currentPage);
      setReportData(cache[currentPage]);
      return;
    }

    const response = await fetch(`${baseURL}/api/v2/scan/saved-reports?page=${currentPage}&limit=10`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('Fetched Reports:', data);

    // Cache the data
    cache[currentPage] = data.data?.info || [];

    // Prefetch adjacent pages
    if (currentPage < paginationMetadata.totalPages) {
      const nextPage = currentPage + 1;
      await fetchReports(nextPage); // Prefetch next page
    }
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      await fetchReports(previousPage); // Prefetch previous page
    }

    setReportData(data.data?.info || []);
    setPaginationMetadata({
      totalPages: data.data.totalPages,
      currentPage: data.currentPage,
      totalItems: data.data.totalCount,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('Unknown error');
    }
  } finally {
    setLoading(false);
  }
};

  const reports:Report[] = reportData || [];

  const filteredReports = reports.filter((report) =>
    report.log_id?.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchReports(currentPage);
  }, []);

  return (
    <div>
      <Header />
      <div className='flex flex-col items-center px-24'>
        <div className='flex flex-col items-center pt-8 gap-3 w-full'>
          <h1 className='text-5xl font-semibold'>Let's help you find what you are looking for</h1>
          <p className='text-lg text-muted-foreground'>Search for reports by name to get started.</p>
          <span 
          tabIndex={0}
          className='flex flex-row gap-3 w-[50vw] items-center border-2 border-gray-200 bg-slate-50 p-1 mt-8 rounded-full'>
            <Search className='text-gray-500 mx-2' />
            <Input
              placeholder='Search for report by name.'
              className='border-0 rounded-full outline-none focus:ring-0 focus:border-0 focus:outline-none bg-slate-50'
              value={searchTerm}
              
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className='rounded-full'>Search</Button>
          </span>
        </div>

        <div className='flex flex-col gap-2 w-full px-8 py-10'>
          <Pagination>
            <PaginationContent>
              {Array.from({ length: paginationMetadata.totalPages }, (_, i) => (
                <Button key={i + 1}
                className=' bg-white text-slate-400 border-slate-200 border-2 hover:bg-slate-100'
                onClick={()=> {fetchReports(i + 1); setLoading(true)}
                }>{i + 1}</Button>
              ))}
              <PaginationNext/>
            </PaginationContent>
          </Pagination>
          {loading ? (
            <div className="flex justify-center">
              <p>Loading reports...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center">
              <p className="text-red-500">Error loading reports: {error}</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex justify-center">
              <p>No reports found.</p>
            </div>
          ) : (
            <motion.div variants={container} initial="initial" animate="animate" className='flex flex-wrap gap-4 mx-auto justify-center '>
              
                {
                  filteredReports.map((report, index) => (
                    <>
                    
                    <motion.div
                    key={index}
                    variants={child}
                    whileHover={{scale: 1.07, transition:{duration:0.5}}}
                    >
                      <Card
                        key={index}
                        className='flex flex-row gap-4 rounded-lg justify-center items-center p-4 cursor-pointer     hover:border-zinc-600 w-72'
                        
                      >
                        <div className='flex flex-col gap-2 w-full'>
                          
                          {/* <img src='/Image1.png' alt="Report Image" className='w-40 h-48 rounded-md'/> */}
                          <span className='flex flex-row gap-2'>
                            <img src="/camera-globe-icon.svg" alt="Site-sense icon" className='w-14 h-14 border-[1px] bg-slate-50 rounded-md p-2' />
                            <span className='flex flex-col gap-1'>
                              <h1 className='text-lg flex items-start justify-start gap-2 font-medium'>
                                {/* <Globe className='w-4 h-4 inline' size={24}/>   */}
                                {(report.log_id?.url || 'No URL available').replace(/^https?:\/\//, '')}
                              </h1>
                              <p className='text-sm text-gray-500'>
                                {new Date(report.log_id?.createdAt ?? '').toLocaleString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                })}
                              </p>
                            </span>
                          </span>
                          
                          <div className='flex flex-col gap-2'>
                            
                            
                            <span className='flex felx-row items-center justify-center gap-1 text-sm mr-auto'>
                              <Bug size={16} strokeWidth={1} color='orange'/>{report?.log_id?.info?.info?.violations?.length}  
                              <p>Violations found</p>
                            </span>
                            <Badge className='bg-orange-100 text-orange-600 w-fit mr-auto'>{report.log_id?.status}</Badge>
                            <Dialog>
                              <DialogTrigger>
                                <Button className='mt-4 w-full rounded-lg'>View</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogTitle className='text-xl capitalize'>{(report.log_id?.url ?? 'No URL').replace(/^https?:\/\//, '')}</DialogTitle>
                                <a href={report.log_id?.link} target='_blank' className='bg-orange-500 text-white px-2 py-1 rounded-md w-fit ml-auto cursor-pointer'>View full report</a>
                                <ScrollArea className='h-[calc(100vh-200px)]'>
                                  {report?.log_id?.info?.info?.violations?.map((violation: any, index: number) => (
                                  
                                  <div key={index} className='border border-gray-200 p-4 rounded-md mb-2'>
                                    <p className='text-lg font-medium'>{violation.id}</p>
                                    <p>{violation.description}</p>
                                    {(() => {
                                      let badgeClass = '';
                                      switch (violation.impact) {
                                        case 'critical':
                                          badgeClass = 'bg-red-100 text-red-900';
                                          break;
                                        case 'serious':
                                          badgeClass = 'bg-orange-100 text-orange-900';
                                          break;
                                        case 'moderate':
                                          badgeClass = 'bg-yellow-100 text-yellow-900';
                                          break;
                                        case 'minor':
                                          badgeClass = 'bg-green-100 text-green-900';
                                          break;
                                        default:
                                          badgeClass = 'bg-gray-100 text-gray-900';
                                      }
                                      return <Badge className={badgeClass}>{violation.impact}</Badge>;
                                    })()}
                                    <p className='text-sm'>Number of elements affected: <span className='font-bold text-orange-600 text-lg'>{violation.nodes?.length}</span></p>
                                  </div>

                                
                                  
                                ))}
                                </ScrollArea>
                                
                                
                                {/* <p> Number of violations:{JSON.stringify(report.log_id.info.info.url)}</p> */}
                              </DialogContent>
                              
                            </Dialog>
                            
                          </div>
                          
                        </div>
                      </Card>
                    </motion.div>
                    </>
                  ))
                  
                }
              
            </motion.div>
            
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;

const container ={
  animate:{
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  }
}

const child ={
  initial:{scale:0, opacity: 0},
  animate:{scale:1, opacity: 1, transition: {duration: 0.5}},
  
}