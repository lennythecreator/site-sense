import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'
import Header from '@/components/ui/header'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DataGrid() {
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
    const severityOrder = {
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
            const aVal = severityOrder[a.impact] || 0;
            const bVal = severityOrder[b.impact] || 0;
            return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        });

    // Utility for impact color and icon
    const impactStyles: Record<string, { color: string; icon: string; label: string }> = {
        critical: {
            color: 'bg-[#D73027] text-white border-2 border-[#A50026]', // deep red, color-blind safe
            icon: '⛔',
            label: 'Critical impact',
        },
        serious: {
            color: 'bg-[#FC8D59] text-black border-2 border-[#D73027]', // orange, color-blind safe
            icon: '⚠️',
            label: 'Serious impact',
        },
        moderate: {
            color: 'bg-[#FEE08B] text-black border-2 border-[#FC8D59]', // yellow, color-blind safe
            icon: '●',
            label: 'Moderate impact',
        },
        minor: {
            color: 'bg-[#B0B7C3] text-black border-2 border-[#6C757D]', // neutral gray, not green
            icon: '✖️',
            label: 'Minor impact',
        },
    };

    return (
        <main>
            <Header/>
            <div className='p-10'>
                <h1 className='text-center font-medium text-2xl'>Audit for {url}</h1>
                <div className='p-5 w-96 mx-auto flex gap-4 items-end'>
                    <div>
                        <p>Filter</p>
                        <Select onValueChange={setImpactFilter} value={impactFilter}>
                            <SelectTrigger>
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
                            <SelectTrigger>
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
            <Table>
                <TableHeader>
                    <TableHead>Rule</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Selector</TableHead>
                    <TableHead>Snippet</TableHead>
                    <TableHead>Help</TableHead>
                </TableHeader>
                <TableBody>
                {filteredSortedViolations.map((item: any) => (
                    <TableRow key={`${item.vIdx}-${item.nIdx}`}>
                        <TableCell className='w-40'>{item.id}</TableCell>
                        <TableCell>
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded ${impactStyles[item.impact]?.color || 'bg-gray-200'}`}
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
