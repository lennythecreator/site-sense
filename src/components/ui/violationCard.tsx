import React from 'react'
import { Card, CardContent, CardDescription, CardTitle } from './card'
import {useNavigate} from 'react-router-dom'
import { Badge } from './badge';
import { ArrowRight } from 'lucide-react';

const ViolationCard = ({violation}) => {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const history = useNavigate();
    const handleCardClick = () => {
        // Store scroll position and state in local storage
        localStorage.setItem('scrollPosition', window.scrollY.toString());
        localStorage.setItem('violationId', violation.id);
        console.log(violation)
        history(`/violations/${violation.id}`,{state: {violation}})
    }
  return (
    <Card className='p-4 my-2' onClick={handleCardClick}>
        <div className='flex flex-row items-center gap-2'>
            <div className='flex-1'>
                <CardTitle className='text-lg'>{capitalize(violation.id)}</CardTitle>
                <CardDescription>{violation.description}</CardDescription>
                <Badge>{violation.impact}</Badge>
                <p className='text-sm'>number of elements affected: {violation.nodes.length}</p>
            </div>
            <div className='ml-auto justify-end'>
                <ArrowRight className='' size={24}/>
            </div>
            
        </div>
        
        
        
    </Card>
  )
}

export default ViolationCard