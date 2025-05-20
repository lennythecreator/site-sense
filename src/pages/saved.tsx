import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import Header from '../components/ui/header';

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
        setReportData(data.data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reportData.filter((report) =>
    report.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <p>No saved reports found.</p>
            </div>
          ) : (
            // filteredReports.map((report, index) => (
            //   <Card
            //     key={index}
            //     className='flex flex-row gap-4 items-center p-4 cursor-pointer hover:bg-gray-100'
            //     onClick={() => handleCardClick(report)}
            //   >
            //     <img
            //       src={report.image || '/placeholder-image.png'}
            //       alt={`${report.name || 'Report'} thumbnail`}
            //       className='w-28 h-40 object-cover'
            //       onError={(e) => {
            //         e.currentTarget.src = '/placeholder-image.png';
            //         console.log('Image failed to load for report:', report.name);
            //       }}
            //     />
            //     <div className="flex flex-col gap-2">
            //       <h1 className='font-medium text-lg'>{report.name || 'Untitled Report'}</h1>
            //       <p className='text-secondary-foreground'>Site Name: {report.siteName || 'N/A'}</p>
            //       <p className='text-sm'>Date Created: {new Date(report.dateCreated).toLocaleDateString() || 'N/A'}</p>
            //     </div>
            //   </Card>
            // ))
            <p>{reportData}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;
