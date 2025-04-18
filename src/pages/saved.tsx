import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Header from '@/components/ui/header'
import { Input } from '@/components/ui/input'
import React from 'react'

const Saved = () => {
    const reportData = [
        {
          name: "Lings Cars Report 1",
          dateCreated: "2023-10-01",
          image:"https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/79f59926-84af-4697-88f6-6caf00f6d5d4/Lings-Homepage-min.png",
          siteName: "lingscars.com"
        },
        {
          name: "Lings Cars Report 2",
          dateCreated: "2023-10-02",
          image:"https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/79f59926-84af-4697-88f6-6caf00f6d5d4/Lings-Homepage-min.png",
          siteName: "lingscars.com"
        },
        {
          name: "Lings Cars Report 3",
          dateCreated: "2023-10-03",
          image:"https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/79f59926-84af-4697-88f6-6caf00f6d5d4/Lings-Homepage-min.png",
          siteName: "lingscars.com"
        }
      ];

  return (
    <div>
        <Header/>
        <div className='flex flex-col items-center px-24'>
            <div className='flex flex-col items-center pt-4 gap-3'>
                <h1 className='text-2xl font-semibold'>Let's help you find what you are looking for</h1>
                <span className='flex gap-3 w-full'>
                    <Input placeholder='Search for report by name.'/>
                    <Button>Search</Button>
                </span>
            </div>
            <div className='flex flex-col gap-3 w-full px-10 py-10'>
                {reportData.map((report,index)=>(
                    <Card className='flex flex-row gap-4 items-center'>
                    <img src={report.image} alt="" className='w-28 h-40' />
                    <div>
                        <h1 className='font-medium text-lg'>{report.name}</h1>
                        <p className='text-secondary-foreground'>Site Name: {report.siteName}</p>
                        <p className='text-sm'>Date Created: {report.dateCreated}</p>
                    </div>
                    </Card>
                ))}
            </div>
            
            
        </div>
    </div>
  )
}

export default Saved