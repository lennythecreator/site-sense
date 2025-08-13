import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScanLayout from '@/components/layouts/scan';
import { Accordion, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { AccordionItem } from '@radix-ui/react-accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy, Globe, Link as LinkIcon } from 'lucide-react';
import {motion} from 'motion/react'
interface ViolationNode {
  url?: string;
  impact?: string;
  html?: string;
  target?: string[];
  // Add other properties as needed
}

export const ViolationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { violation:stateViolation, reportId } = location.state || {};
  const [violation, setViolation] = useState(stateViolation);
  useEffect(() => {
    const scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
    }

    // Fallback: load from localStorage if state was not passed
    if (!stateViolation) {
      const stored = localStorage.getItem('violationData');
      if (stored) {
        setViolation(JSON.parse(stored));
      } else {
        navigate('/dashboard'); // If nothing is found, redirect
      }
    }
    // Log all possible sources for the site URL
    console.log('Violation Details:', violation);
    console.log('Site URL:', violation?.url || violation?.siteLink || violation?.nodes?.[0]?.url || 'No URL');
  }, []);


   const handleBackToReport = () => {
  if (reportId) {
    navigate(`/report?url=${encodeURIComponent(reportId)}`);
  } else {
    navigate('/report');
  }
};

  
  if (!violation) {
    return (
      <ScanLayout>
        <div className="p-4 text-center text-muted-foreground">
          <p>Violation data not found.</p>
          <button
            onClick={handleBackToReport}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back
          </button>
        </div>
      </ScanLayout>
    );
  }

  return (
    <ScanLayout>
      <div className="p-4">
        <button
          onClick={handleBackToReport}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Report
        </button>

        <Card className="w-2/3 mx-auto p-4 shadow-md ">
          <h1 className='flex items-center gap-1 font-medium px-4 text-muted-foreground'>
            <Globe/>
            {(() => {
              const url = violation.url || violation.siteLink || violation.nodes?.[0]?.url || '';
              if (!url) return 'No URL available';
              try {
                const domain = new URL(url).hostname;
                return domain;
              } catch {
                // fallback: try to extract domain manually
                const match = url.match(/^(?:https?:\/\/)?([^\/]+)/);
                return match ? match[1] : url;
              }
            })()}
          </h1>
          <CardHeader className="flex flex-row gap-2 items-center">
            <CardTitle>{violation.id}</CardTitle>
            <Badge className="text-xs w-fit capitalize">{violation.impact}</Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h1 className="text-base font-medium">Description</h1>
              <p className=" text-sm text-muted-foreground">{violation.description}</p>
            </div>

            <div>
              <p className="text-base font-medium">Suggestion</p>
              <p className=" text-sm text-muted-foreground">{violation.help}</p>
            </div>

            {violation.helpUrl && (
              <div className="flex gap-2 items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.a
                        href={violation.helpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600"
                        whileHover={{ scale: 1.05, textDecoration: 'underline' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LinkIcon size={16} />
                        Quick-fix
                      </motion.a>
                    </TooltipTrigger>
                    <TooltipContent>{violation.help}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            <div>
              <p className="text-lg font-medium">Elements Affected</p>
              <Accordion type="single" collapsible >
                {violation.nodes?.map((node: ViolationNode, index:number) => (
                  <AccordionItem key={index} value={`node-${index}`} className='border-[1.5px] rounded-lg px-4 my-2'>
                    <AccordionTrigger className=''>Element {index + 1}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="font-medium flex gap-2">
                          Impact: <p className="text-muted-foreground">{node.impact}</p>
                        </div>
                        <div className="font-medium flex gap-2 w-full">
                          HTML: <p className="text-blue-700 bg-blue-100 rounded-md p-2 break-all">{node.html}</p>
                          <motion.div
                            className="cursor-pointer"
                            initial={{color: 'gray'}}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95, color:'green' }}
                            onClick={() => {
                              navigator.clipboard.writeText(node.html || '');
                              alert('HTML copied to clipboard!');
                            }}>
                            <Copy size={16} className="text-gray-500 hover:text-gray-700" />
                            </motion.div>
                          
                        </div>
                        <div className="font-medium flex gap-2">
                          Target:{' '}
                          <p className="text-muted-foreground">{node.target?.join(', ')}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScanLayout>
  );
};
