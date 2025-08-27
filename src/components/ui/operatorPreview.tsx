import { useEffect, useState } from "react";
import { Button } from "./button";
import { Card, CardDescription, CardHeader } from "./card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from 'motion/react';

type Violation = { 
  id: number; 
  name: string; 
  time: string; 
  vio?: string[]; // Made optional to handle undefined cases
};

// Updated: Changed to accept a single violation instead of an array
const OperatorPreview = ({ violation }: { violation?: Violation }): JSX.Element => {
  const [currentViolation, setCurrentViolation] = useState<Violation | null>(null);
  
  useEffect(() => {
    if (violation) {
      setCurrentViolation(violation);
    }
  }, [violation]);

  if (!violation || !currentViolation) {
    return (
      <div className="w-full max-w-[500px] h-[calc(100vh - 500px)] p-4 rounded-lg border shadow-md overflow-hidden">
        <p className="text-sm text-muted-foreground">No violation selected.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[500px] h-[calc(100vh - 500px)] p-4 rounded-lg border shadow-md overflow-hidden">
      {/* Image */}
      <img
        src="Image2.png"
        alt="Site Image"
        className="w-full max-h-[300px] rounded-md object-cover"
      />

      {/* Site info */}
      <div className="mt-3">
        <h3 className="font-medium">{currentViolation.name}</h3>
        <p className="text-xs text-muted-foreground mb-3">{currentViolation.time}</p>
      </div>

      {/* Actions */}
      <div className="mt-3">
        <Button>View full report</Button>
      </div>

      {/* Issues list container with fixed height */}
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium">
          Issues ({currentViolation.vio?.length || 0})
        </p>

        {/* Updated: Display individual violations from the vio array */}
        <ScrollArea className="h-40 w-full bg-transparent rounded-md">
          <div className="space-y-2">
            {currentViolation.vio && currentViolation.vio.length > 0 ? (
              currentViolation.vio.map((violationType, index) => (
                <motion.div
                  key={`${currentViolation.id}-${index}`}
                  whileTap={{ scale: 0.98, transition: { duration: 0.2 } }}
                >
                  <Card className="w-full p-4">
                    <CardHeader className="p-0">
                      <h4 className="font-medium text-sm">
                        {violationType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                    </CardHeader>
                    <CardDescription>
                      <p className="text-xs text-muted-foreground">
                        {getViolationDescription(violationType)}
                      </p>
                    </CardDescription>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground p-2">No violations found.</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

// Helper function to provide descriptions for violation types
const getViolationDescription = (violationType: string): string => {
  const descriptions: { [key: string]: string } = {
    'heading-too-big': 'Heading text size exceeds recommended limits',
    'heading-too-small': 'Heading text is too small for accessibility',
    'bad-alt-text': 'Images missing or have poor alternative text',
    'missing-form-labels': 'Form elements lack proper labels',
    'low-contrast-text': 'Text has insufficient color contrast',
    'broken-links': 'Links are not functional or lead to errors',
    'improper-focus-order': 'Tab order does not follow logical sequence',
    'missing-skip-links': 'No skip navigation links provided',
    'missing-aria-labels': 'Elements lack ARIA labels for screen readers',
    'color-contrast-issues': 'Colors do not meet WCAG contrast requirements',
    'keyboard-navigation': 'Site not fully navigable by keyboard',
    'missing-landmarks': 'Page structure lacks ARIA landmarks',
  };
  
  return descriptions[violationType] || 'Accessibility issue detected';
};

export default OperatorPreview;