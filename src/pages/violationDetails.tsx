import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ScanLayout from '@/components/layouts/scan';
import { Accordion, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { AccordionItem } from '@radix-ui/react-accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link as LinkIcon } from 'lucide-react';

export const ViolationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // fallback if needed
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

        <Card className="w-2/3 mx-auto p-4">
          <CardHeader className="flex flex-col">
            <CardTitle>{violation.id}</CardTitle>
            <Badge className="w-fit capitaliz ">{violation.impact}</Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h1 className="text-xl font-medium">Description</h1>
              <p className="text-muted-foreground">{violation.description}</p>
            </div>

            <div>
              <p className="text-lg font-medium">Suggestion</p>
              <p className="text-muted-foreground">{violation.help}</p>
            </div>

            {violation.helpUrl && (
              <div className="flex gap-2 items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={violation.helpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 underline"
                      >
                        <LinkIcon size={16} />
                        Quick-fix
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{violation.help}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            <div>
              <p className="text-lg font-medium">Elements Affected</p>
              <Accordion type="single" collapsible>
                {violation.nodes?.map((node, index) => (
                  <AccordionItem key={index} value={`node-${index}`}>
                    <AccordionTrigger>Element {index + 1}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="font-medium flex gap-2">
                          Impact: <p className="text-muted-foreground">{node.impact}</p>
                        </div>
                        <div className="font-medium flex gap-2">
                          HTML: <p className="text-muted-foreground">{node.html}</p>
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
