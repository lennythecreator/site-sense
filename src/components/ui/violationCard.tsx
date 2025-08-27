import { Card, CardDescription, CardTitle } from './card';
import { Badge } from './badge';
import { ArrowRight } from 'lucide-react';

// Define types for props
interface ViolationNode {
  impact?: string;
  html?: string;
  target?: string[];
  // Add other properties as needed
}

interface Violation {
  id: string;
  description?: string;
  url?: string;
  impact?: string;
  nodes?: ViolationNode[];
  // Add other properties as needed
}

interface ViolationCardProps {
  violation: Violation;
  siteLink?: string; // Optional link to the site
  reportId: string;
  reportState: any;
}

const ViolationCard: React.FC<ViolationCardProps> = ({ violation, reportId, reportState, siteLink, tabIndex }) => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleCardClick = () => {
    let violationWithUrl = { ...violation };
    if (!violationWithUrl.url && siteLink) {
      violationWithUrl.url = siteLink;
    }
    const data = {
      violation: violationWithUrl,
      reportId: reportId,
      reportState: reportState,
    };
    localStorage.setItem('violationData', JSON.stringify(data.violation));
    localStorage.setItem('reportId', data.reportId);
    localStorage.setItem('reportState', JSON.stringify(data.reportState));

    // Send IPC message to main process to open a new window
    (window.electronAPI as any)?.openViolationWindow?.(`/violations/${violation.id}`);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };
  // Set badge color based on impact
  let badgeClass = '';
  switch (violation.impact) {
    case 'critical':
      badgeClass = 'bg-red-200 text-red-800';
      break;
    case 'serious':
      badgeClass = 'bg-orange-200 text-orange-800';
      break;
    case 'moderate':
      badgeClass = 'bg-yellow-200 text-yellow-800';
      break;
    case 'minor':
      badgeClass = 'bg-green-200 text-green-800';
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-600';
  }

  return (
    <Card className="p-4 my-2 cursor-pointer rounded-xl" role='button' onClick={handleCardClick} onKeyDown={handleKeyDown} tabIndex={tabIndex ?? 0}>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1">
          <CardTitle className="text-lg">{capitalize(violation.id)}</CardTitle>
          <CardDescription>{violation.description}</CardDescription>
          <p className='text-sm'>Number of elements affected: <span className='font-bold text-orange-600 text-lg'>{violation.nodes?.length}</span></p>
        </div>
        <Badge className={badgeClass}>{violation.impact}</Badge>
        <ArrowRight className="text-muted-foreground" />
      </div>
    </Card>
  );
};

export default ViolationCard;


