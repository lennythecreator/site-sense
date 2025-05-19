import React from 'react';
import { Card, CardContent, CardDescription, CardTitle } from './card';
import { useNavigate } from 'react-router-dom';
import { Badge } from './badge';
import { ArrowRight } from 'lucide-react';

const ViolationCard = ({ violation, reportId , reportState}) => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const navigate = useNavigate();

  const handleCardClick = () => {
    // ✅ Store scroll position and violation data
    localStorage.setItem('scrollPosition', window.scrollY.toString());
    localStorage.setItem('violationData', JSON.stringify(violation)); // Important for fallback

    // ✅ Navigate with state
    navigate(`/violations/${violation.id}`, {
      state: { violation, reportId, reportState },
    });
  };

  return (
    <Card className="p-4 my-2 cursor-pointer" onClick={handleCardClick}>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1">
          <CardTitle className="text-lg">{capitalize(violation.id)}</CardTitle>
          <CardDescription>{violation.description}</CardDescription>
          <p>number of elements affected {violation.nodes?.length}</p>
        </div>
        <Badge>{violation.impact}</Badge>
        <ArrowRight className="text-muted-foreground" />
      </div>
    </Card>
  );
};

export default ViolationCard;
