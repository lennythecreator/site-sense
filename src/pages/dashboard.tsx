import ScanLayout from '@/components/layouts/scan'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {AnimatePresence, motion} from 'motion/react'
import { ScrollArea } from '@/components/ui/scroll-area'

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

const Dashboard = () => {
  const [scanning, setScanning] = useState(false)
  const [url, setUrl] = useState("")
  // Show dialog only for first-time users
  const [dialogOpen, setDialogOpen] = useState(() => {
    return !localStorage.getItem('hasSeenStarterDialog');
  });
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const openModal = (modalContent: any) => {
  setModalContent(modalContent);
  setReportModalOpen(true);
};

const closeModal = () => {
  setReportModalOpen(false);
  setModalContent(null);
};
  const [reportData, setReportData] = useState<Report[]>([])
  const [error, setError] = useState<string | null>(null);

  const baseURL = 'http://159.65.41.182:5005'
  // Inside your Dashboard component
  const navigate = useNavigate()

  const handleScan = () => {
    if (scanning) return;
    let formattedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '')
    formattedUrl = `https://${formattedUrl}`
    setScanning(true)
    navigate(`/report?url=${encodeURIComponent(formattedUrl)}`)
  }

  useEffect(()=>{
    // No longer force dialog open on mount
    const hasSeenDialog = localStorage.getItem('hasSeenStarterDialog');
    if (!hasSeenDialog) {
      setDialogOpen(true);
    }

    const fetchReports = async () => {
      try {
        const response = await fetch(`${baseURL}/api/v2/scan/saved-reports?page=1&limit=3`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched Reports:', data);
        setReportData(data.data?.info || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unknown error');
        }
      } 
    };

    fetchReports();
  },[])


  return (
    
      <div className='flex flex-col h-full'>
      {/* <Header /> */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}  aria-scribedby='dialog-title'>
        <DialogContent>
          <h1 id='dialog-title' className='font-medium'>Hi! Thank you for choosing Site Sense.</h1>
          <p id='dialog-body'>On the next screen, please enter the website URL <br/>(eg. https://google.com), then click the ‘Scan’ button to perform your first accessibility scan.</p>
          <Button
            className='w-52 mx-auto'
            onClick={() => {
              localStorage.setItem('hasSeenStarterDialog', 'true');
              setDialogOpen(false);
            }}
          >Got it</Button>
        </DialogContent>
      </Dialog>
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent>
          <DialogTitle>Report Details</DialogTitle>
          {modalContent && (
            <div className="space-y-3">
              
              <div className='text-3xl text-indigo-600 font-bold'>
                <p>{modalContent.url || 'N/A'}</p>
              </div>
              <div>
                <strong>Created At:</strong> {
                  modalContent.createdAt 
                    ? new Date(modalContent.createdAt).toLocaleString()
                    : 'N/A'
                }
              </div>
              <div className=''>
                <strong>Violations:</strong>
                <ScrollArea className='h-96'>
                  
                  {modalContent.violations.map((violation,index)=>(
                    <div tabIndex={0} key={index} className='flex flex-col gap-2 border my-4 p-4 min-h-32 rounded-2xl hover:shadow-md transition duration-300 ease-in-out'>
                      <p className='font-semibold'>{violation.id}</p>
                      <p className='text-sm textgray-800'>{violation.description}</p>
                      <Badge className='w-fit bg-orange-200 text-orange-800'>{violation.impact}</Badge>
                    </div>
                  ))}
                </ScrollArea>
              </div>
              <Button onClick={closeModal} className="mt-4">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1 } }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className='flex flex-col h-full'>
   
          <ScanLayout>
          {!scanning &&(
            <div className=' h-full flex flex-col flex-1 justify-center items-center bg-[#f8fafc]'>
              
              <h1 className='text-5xl font-bold py-16'>Site-Sense</h1>
              <main className='flex flex-col gap-4 shadow-md p-10 rounded-xl w-1/2 mx-auto justify-center bg-white'>
                <h1 className='text-xl font-bold text-center'>Scan a website</h1>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleScan();
                  }}
                  className='flex gap-4 border-2 rounded-full p-1'
                >
                  <Input
                  className='border-0 rounded-full outline-none focus:ring-0 focus:border-0 focus:outline-none '
                    type="text"
                    placeholder='Enter a website URL'
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    aria-label='This is a text input for Enter a website URL'
                  />
                  <Button type="submit" className='rounded-full'>Scan</Button>
                </form>
              </main>
              
              <div className='px-8 mx-auto py-6 '>
                <h1 className='font-semibold text-lg'>Recent saved reports</h1>
                
                <div className='flex flex-wrap gap-8 w-full py-5'>
                  {error ? (
                    <p className="text-red-500 text-xl">Error loading reports!</p>
                  ) : reportData.length > 0 ? (
                    reportData.map((report, index) => (
                      <motion.div
                      initial={{scale: 0}}
                      animate={{
                        scale:1, 
                        transition: { duration: 0.75 }}}
                      whileHover={{
                        scale: 1.05,
                        transition:{duration:0.5}}}
                      >
                          <Card key={index} className='flex flex-col gap-3 bg-white p-4 rounded-lg shadow-md w-72'>
                            <div className='flex gap-2'>
                              <img src='/camera-globe-icon.svg' alt='Site sense logo' className='h-12 w-12 p-2 bg-slate-50 rounded-full '/>
                              <span>
                                <h2 className='text-lg font-medium'>{(report.log_id?.url ?? 'No URL').replace(/^https?:\/\//, '')}</h2>
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
                              
                            </div>
                            
                            <Button
                              className='bg-slate-300 text-slate-900 rounded-lg'
                              onClick={() => {
                                const reportData = {
                                  reportId: report.log_id?.status,
                                  url: report.log_id?.url,
                                  createdAt: report.log_id?.createdAt,
                                  violations: report.log_id?.info?.info?.violations,
                                };
                                console.log('pressed',reportData);
                                openModal(reportData); // ✅ Pass the data directly
                              }}
                            >
                              View Report
                            </Button>
                          </Card>
                      </motion.div>
                      
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}</div>

              </div>
            </div>)}
          
          </ScanLayout>
      </motion.div>
      </AnimatePresence>
      
       
    </div>
    
  )
}

interface ReportModalProps {
  data: any;
}

const ReportModal: React.FC<ReportModalProps> = ({ data }) => {
  return (
    <Dialog>
      <DialogContent>
        <h2>Report Data</h2>
        <ul>
          <li>Report ID: {data.reportId}</li>
          <li>URL: {data.url}</li>
          <li>Created At: {data.createdAt}</li>
          <li>Violations: {data.violations}</li>
          {/* add other fields as needed */}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
export default Dashboard