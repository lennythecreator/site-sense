import { Button } from '@/components/ui/button'
import { Card, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
    <header className =" flex">
       


        
    </header>
    <div className=' my-auto p-10 flex justify-center items-center w-full'>
                <Card className='p-10 w-1/2 flex flex-col gap-4' aria-description='Login to your account by clicking the login button below.'>
                
                <h1 className='flex items-center gap-2 text-2xl font-bold mx-auto'><Globe/> Site Sense</h1>
                <img src="SiteSense.png" alt="Site Sense" className='h-20 w-64 mx-auto' />

                <Input type="email" placeholder="Email"  className='p-6'/>
                <Input type="password" placeholder="Password"  className='p-6'/>
                <Link to="/dashboard">
                    <Button className='w-full h-12'>Login</Button> 
                </Link>
                

                <CardFooter className='flex flex-col gap-1 align-middle'>
                    <p className=''>Don't have an account? <Link to="/signup" className='bg-gray-300 text-white px-2 py-1 rounded-full'>Sign up</Link></p>
                    <p className='text-sm text-gray-500'>Create an account</p>
                </CardFooter> 


            </Card>
            

        </div>
    </div>

  )
}

export default Login