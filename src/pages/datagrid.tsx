import { useLocation } from 'react-router-dom'
import Header from '@/components/ui/header'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function DataGrid() {
    const location = useLocation()
    
    let { data, subDomains, url, processID } = location.state || {};

  if (!data) {
    // Try to load from localStorage if state is missing (e.g., opened in new tab)
    const saved = localStorage.getItem("datagridState");
    if (saved) {
      ({ data, subDomains, url, processID } = JSON.parse(saved));
    }
  }

  console.log("DataGrid location state:", { data, subDomains, url, processID });

  return (
    <div>
        <Header/>
        <div className='p-10'>
            <h1 className='text-center font-medium text-2xl'>Audit for {url}</h1>
            <Table>
                
                <TableHeader>
                    <TableHead>Rule</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Selector</TableHead>
                    <TableHead>Snippet</TableHead>
                    <TableHead>Help</TableHead>
                </TableHeader>
                {/* <TableBody>
                    {data.info.violations.nodes.map((violation: any, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{violation.any.id}</TableCell>
                            <TableCell>{violation.impact}</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell><a href={violation.helpUrl} target='_blank' className='text-orange-500'>Help</a></TableCell>
                        </TableRow>
                    ))}
                </TableBody> */}
                <TableBody>
                {data.info.violations.map((violation: any, vIdx: number) =>
                    violation.nodes.map((node: any, nIdx: number) => (
                    <TableRow key={`${vIdx}-${nIdx}`}>
                        <TableCell>{violation.id}</TableCell>
                        <TableCell>{violation.impact}</TableCell>
                        <TableCell className='text-xs'>
                        {node.target && node.target.length > 0
                            ? node.target.join(', ')
                            : ''}
                        </TableCell>
                        <TableCell>
                        <pre className="whitespace-pre-wrap text-xs">
                            {node.html}
                        </pre>
                        </TableCell>
                        <TableCell>
                        <a
                            href={violation.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500"
                        >
                            Help
                        </a>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
                <TableCaption>{url} Data Grid</TableCaption>
            </Table>
        </div>
    </div>
  )
}
