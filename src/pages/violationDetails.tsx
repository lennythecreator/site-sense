import ScanLayout from '@/components/layouts/scan';
import { Accordion, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AccordionItem } from '@radix-ui/react-accordion';
import { Link } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const ViolationDetails = () => {
    const location = useLocation();
    const {violation} = location.state || {};
    const navigate = useNavigate();
    useEffect(() => {
        // Retrieve scroll position and violation ID from local storage
        const scrollPosition = localStorage.getItem('scrollPosition');
        const violationId = localStorage.getItem('violationId');
        
        // Restore scroll position
        window.scrollTo(0, scrollPosition);

        // Additional logic to fetch and display violation details based on violationId
    }, []);
    const handleBackToReport = () => {
        // Navigate back to the specific report page using the reportId
        navigate(`/reports/${reportId}`);
    };
  return (
    <div>
        <ScanLayout>
            <div className='p-4'>
            <button
                           onClick={handleBackToReport}
                           className='mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                       >
                           Back to Report
                       </button>
            <Card className='w-2/3 mx-auto p-4'>
                <CardHeader className='flex flex-col'>
                    <CardTitle>{violation.id}</CardTitle>
                    <Badge className='w-14'>{violation.impact}</Badge>
                </CardHeader>

                <CardContent className='space-y-2'>

                    <div>
                        <h1 className='text-xl font-medium'>Description</h1>
                        <p className='text-muted-foreground'>{violation.description}</p>
                    </div>
                    <div>
                        <p className='text-lg font-medium'>Suggestion</p>
                        <p className='text-muted-foreground'>{violation.help}</p>
                    </div>

                    <div className='flex gap-2 items-center'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className='flex items-center'>
                                    <Link size={16}/>
                                    <a href={violation.helpUrl} target='_blank'>Qucik-fix</a>
                                </TooltipTrigger>
                                <TooltipContent>{violation.help}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                    </div>

                    <div>
                        <p className='text-lg font-medium'>Elements affected</p>
                        <Accordion type="single" collapsible>
                            {violation.nodes.map((node, index) => (
                                <AccordionItem key={index} value={`node-${index}`}>
                                    <AccordionTrigger>
                                       Element {index + 1}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div>
                                            <span className='font-medium flex gap-2'>Impact: <p className='text-muted-foreground'>{node.impact}</p></span>
                                            <span className='font-medium flex gap-2'>HTML: <p className='text-muted-foreground'>{node.html}</p></span>
                                            <span className='font-medium flex gap-2'>Target: <p className='text-muted-foreground'>{node.target.join(', ')}</p></span>
                                            {/* Add more properties as needed */}
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
    </div>
  )
}
