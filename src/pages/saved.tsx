import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import Header from '../components/ui/header';
import { log } from 'console';
import { Globe, Globe2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ViolationCard from '@/components/ui/violationCard';
import { ScrollArea } from '@/components/ui/scroll-area';

const Saved = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const baseURL = 'http://159.65.41.182:5005';

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${baseURL}/api/v2/scan/saved-reports?page=1&limit=10`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched Reports:', data);
        setReportData(data.data?.info || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError(error.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const reports = reportData || [];

  const filteredReports = reports.filter((report) =>
    report.log_id?.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleCardClick = (report: any) => {
    const violation = report.value;
    const violationId = violation?.any?.[0]?.id || 'violation';
    const siteUrl = report.siteUrl || '';

    // Save violation in localStorage
    localStorage.setItem('violationData', JSON.stringify(violation));
    localStorage.setItem('scrollPosition', '0');

    // Navigate to details
    navigate(`/violations/${violationId}`, {
      state: {
        violation,
        reportId: siteUrl,
      },
    });
  };

  return (
    <div>
      <Header />
      <div className='flex flex-col items-center px-24'>
        <div className='flex flex-col items-center pt-4 gap-3'>
          <h1 className='text-2xl font-semibold'>Let's help you find what you are looking for</h1>
          <span className='flex gap-3 w-full'>
            <Input
              placeholder='Search for report by name.'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button>Search</Button>
          </span>
        </div>

        <div className='flex flex-col gap-3 w-full px-10 py-10'>
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
            <div className='flex flex-wrap gap-4'>
                
                {
                  filteredReports.map((report, index) => (
                    <>
                    
                    
                    <Card
                      key={index}
                      className='flex flex-row gap-4 items-center p-4 cursor-pointer hover:bg-gray-100 w-96'
                      
                    >
                      <div className='flex gap-2'>
                        {/* <iframe src={report.log_id?.url} frameborder="0" className='w-40 h-48 rounded-md' ></iframe> */}
                        {/* <webview
                          src={report.log_id?.url}
                          className='w-52 h-[calc(100vh-200px)]'
                          style={{
                            transformOrigin: 'top left',
                            overflow: 'hidden',
                            pointerEvents: 'none',
                            border: 'none',
                          }}
                          disablewebsecurity
                          webpreferences='contextIsolation'
                        /> */}
                        <img src='/Image1.png' alt="Report Image" className='w-40 h-48 rounded-md'/>
                        <div className='flex flex-col gap-2'>
                          
                          <h1 className='text-lg flex items-center justify-center gap-2 font-medium'>
                            <Globe className='w-4 h-4 inline' size={24}/>  
                            {(report.log_id?.url || 'No URL available').replace(/^https?:\/\//, '')}
                          </h1>
                          <p className='text-sm text-gray-500'>
                            {new Date(report.log_id?.createdAt).toLocaleString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                          </p>
                          <Badge className='bg-orange-100 text-orange-600 w-fit'>{report.log_id?.status}</Badge>
                          <Dialog>
                            <DialogTrigger>
                              <Button className='mt-10'>View</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogTitle className='text-xl'>{(report.log_id?.url).replace(/^https?:\/\//, '')}</DialogTitle>
                              <a href={report.log_id?.link} target='_blank' className='bg-orange-500 text-white px-2 py-1 rounded-md w-fit ml-auto cursor-pointer'>View full report</a>
                              <ScrollArea className='h-[calc(100vh-200px)]'>
                                {report?.log_id?.info?.info?.violations?.map((violation: any, index: number) => (
                                
                                <div key={index} className='border border-gray-200 p-4 rounded-md mb-2'>
                                  <p className='text-lg font-medium'>{violation.id}</p>
                                  
                                  <p>{violation.description}</p>
                                  <Badge>{violation.impact}</Badge>
                                  <p>Number of elements affected: {violation.nodes?.length}</p>
                                </div>

                               
                                
                              ))}
                              </ScrollArea>
                              
                              
                              {/* <p> Number of violations:{JSON.stringify(report.log_id.info.info.url)}</p> */}
                            </DialogContent>
                            
                          </Dialog>
                          
                        </div>
                        
                      </div>
                    </Card>
                    </>
                  ))
                  
                }
            </div>
            
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;
