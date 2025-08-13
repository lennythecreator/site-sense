import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, AlertTriangle, CircleAlert, InfoIcon, OctagonAlert } from 'lucide-react';

type DataGridProps = {
  site: string;
  gridData: object[];
};

type Impact = 'critical' | 'serious' | 'moderate' | 'minor';

const DataGrid: React.FC<DataGridProps> = () => {
    const location = useLocation()
    const [impactFilter, setImpactFilter] = useState<string | undefined>();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    let { data, subDomains, url, processID } = location.state || {};

    if (!data) {
        // Try to load from localStorage if state is missing (e.g., opened in new tab)
        const saved = localStorage.getItem("datagridState");
        if (saved) {
            ({ data, subDomains, url, processID } = JSON.parse(saved));
        }
    }

    console.log("DataGrid location state:", { data, subDomains, url, processID });

    // Severity order for sorting
    const severityOrder: Record<Impact, number> = {
        critical: 4,
        serious: 3,
        moderate: 2,
        minor: 1,
    };

    // Flatten violations for easier filtering/sorting
    const flattenedViolations = data?.info?.violations
        ? data.info.violations.flatMap((violation: any, vIdx: number) =>
            violation.nodes.map((node: any, nIdx: number) => ({
                ...violation,
                node,
                vIdx,
                nIdx,
            }))
        ) : [];

    // Apply filter and sort
    const filteredSortedViolations = flattenedViolations
        .filter((item: any) => !impactFilter || item.impact === impactFilter)
        .sort((a: any, b: any) => {
            const aVal = severityOrder[a.impact as Impact] || 0;
            const bVal = severityOrder[b.impact as Impact] || 0;
            return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        });

    // Utility for impact color and icon
    const impactStyles: Record<string, { color: string; icon: string; label: string }> = {
        critical: {
            color: 'bg-red-300 text-[#1E1E1E] border-[1px] border-red-300', // deep red, color-blind safe
            icon: '‼️',
            label: 'Critical impact',
        },
        serious: {
            color: 'bg-orange-300 text-[#1E1E1E] border-2 border-orange-200', // orange, color-blind safe
            icon: '⚠️',
            label: 'Serious impact',
        },
        moderate: {
            color: 'bg-yellow-300 text-[#1E1E1E] border-2 border-yellow-200', // yellow, color-blind safe
            icon: '●',
            label: 'Moderate impact',
        },
        minor: {
            color: 'bg-blue-300 text-[#1E1E1E] border-2 border-blue-200', // neutral gray, not green
            icon: '✖️',
            label: 'Minor impact',
        },
    };

    // Calculate counts for each impact type
    const impactCounts = flattenedViolations.reduce(
    (acc: Record<string, number>, item: any) => {
        acc[item.impact] = (acc[item.impact] || 0) + 1;
        return acc;
    },
    {}
    );

    return (
        <main className='p-10'>
            
            <div className=''>
                <h1 className='text-left font-semibold text-4xl'>Audit for <span className='text-indigo-600'>{url}</span></h1>
                <p className='text-sm text-gray-500 py-2'>Here's a summary of the violations found from your scan.</p>
                <div className="flex gap-4 my-4 justify-evenly">
                    {Object.keys(severityOrder).map((impact) => (
                        <>
                            <div
                                key={impact}
                                className={`flex items-center gap-3 w-96 p-3 rounded-md font-semibold ${impactStyles[impact]?.color || 'bg-gray-200'}`}
                                aria-label={`${impact} count`}
                            >
                                <span
                                className=' flex flex-col text-sm font-semibold capitalize'>
                                    {impact.charAt(0).toUpperCase() + impact.slice(1)} 
                                    <span
                                    className='text-2xl font-bold'>
                                        {impactCounts[impact] || 0}
                                    </span>    
                                </span>
                                
                                <ImpactIcon impact={impact as Impact} />
                                <br/>
                                
                            </div>
                            
                        </>
                    ))}
                </div>

                <div className='w-full mx-auto flex gap-4 items-end'>
                    <div>
                        <p>Filter</p>
                        <Select onValueChange={setImpactFilter} value={impactFilter}>
                            <SelectTrigger className='w-[40vw]'>
                                <SelectValue placeholder="Select Impact"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Impact</SelectLabel>
                                    <SelectItem value="critical">Critical</SelectItem>
                                    <SelectItem value="serious">Serious</SelectItem>
                                    <SelectItem value="moderate">Moderate</SelectItem>
                                    <SelectItem value="minor">Minor</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <p>Sort</p>
                        <Select onValueChange={v => setSortOrder(v as 'asc' | 'desc')} value={sortOrder}>
                            <SelectTrigger className='w-[40vw]'>
                                <SelectValue placeholder="Sort by Impact"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Order</SelectLabel>
                                    <SelectItem value="desc">High → Low</SelectItem>
                                    <SelectItem value="asc">Low → High</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <button
                        className="ml-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                        onClick={() => {
                            setImpactFilter(undefined);
                            setSortOrder('desc');
                        }}
                        type="button"
                    >
                        Reset
                    </button>
                </div> 
            </div>
            <Table className='mt-10'>
                <TableHeader className='bg-slate-50 rounded-t-md font-bold'>
                    <TableHead className='text-slate-700 font-semibold'>Rule</TableHead>
                    <TableHead className='text-slate-700 font-semibold'>Impact</TableHead>
                    <TableHead className='text-slate-700 font-semibold'>Selector</TableHead>
                    <TableHead className='text-slate-700 font-semibold'>Snippet</TableHead>
                    <TableHead className='text-slate-700 font-semibold'>Help</TableHead>
                </TableHeader>
                <TableBody>
                {filteredSortedViolations.map((item: any) => (
                    <TableRow key={`${item.vIdx}-${item.nIdx}`}>
                        <TableCell className='w-40'>{item.id}</TableCell>
                        <TableCell>
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${impactStyles[item.impact]?.color || 'bg-gray-200'}`}
                                aria-label={impactStyles[item.impact]?.label || item.impact}
                            >
                                <span aria-hidden="true">{impactStyles[item.impact]?.icon || '●'}</span>
                                <span className="font-semibold capitalize">{item.impact}</span>
                            </span>
                        </TableCell>
                        <TableCell className='text-xs'>
                        {item.node.target && item.node.target.length > 0
                            ? item.node.target.join(', ')
                            : ''}
                        </TableCell>
                        <TableCell>
                        <pre className="whitespace-pre-wrap text-xs">
                            {item.node.html}
                        </pre>
                        </TableCell>
                        <TableCell>
                        <a
                            href={item.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500"
                        >
                            Help
                        </a>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
                <TableCaption>{url} Data Grid</TableCaption>
            </Table>
        </main>
    );
}

const ImpactIcon: React.FC<{ impact: Impact }> = ({ impact }) => {
    if (impact === 'critical') {
        return <OctagonAlert className="text-black ml-auto" size={28} />;
    } else if (impact === 'serious'){
        return <AlertTriangle className="text-black ml-auto" size={28} />;
    } else if (impact === 'moderate') {
        return <AlertCircle className="text-black ml-auto" size={28} />;
    } else {
        return <InfoIcon className="text-black ml-auto" size={28} />;
    }   
}
export default DataGrid;

