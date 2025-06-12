import React from 'react';
import { Card, CardContent, CardDescription, CardTitle } from './card';
import { useNavigate } from 'react-router-dom';
import { Badge } from './badge';
import { ArrowRight } from 'lucide-react';

const ViolationCard = ({ violation, reportId , reportState}) => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Save data to localStorage so it can be accessed in the new tab
  const data = {
    violation: violation,
    reportId: reportId,
    reportState: reportState,
  };

  localStorage.setItem('violationData', JSON.stringify(data.violation));
  localStorage.setItem('reportId', data.reportId);
  localStorage.setItem('reportState', JSON.stringify(data.reportState));

  // Send IPC message to main process to open a new window
  window.electronAPI.openViolationWindow(`/violations/${violation.id}`);
  };

  return (
    <Card className="p-4 my-2 cursor-pointer" onClick={handleCardClick}>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1">
          <CardTitle className="text-lg">{capitalize(violation.id)}</CardTitle>
          <CardDescription>{violation.description}</CardDescription>
          <p className='text-sm'>Number of elements affected: <span className='font-bold text-orange-600 text-lg'>{violation.nodes?.length}</span></p>
        </div>
        <Badge>{violation.impact}</Badge>
        <ArrowRight className="text-muted-foreground" />
      </div>
    </Card>
  );
};

export default ViolationCard;
