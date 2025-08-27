import ScanLayout from "@/components/layouts/scan"
import OperatorPreview from "@/components/ui/operatorPreview"
import { Pagination, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { selectViolation } from "@/state/operatorViolationSlice"
import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const operatorView = () => {
  const selectedViolation = useSelector((state:any)=> state.operatorViolation.selectedViolation);
  const dispatch = useDispatch();
    
  const handleCardClick = (violation:any) => {
    // Fixed: Remove the array wrapping, just pass the violation object
    dispatch(selectViolation(violation));
  }
  
  //placeholder data - Updated structure to match what OperatorPreview expects
  const operatorData = [
    { 
      id: 1, 
      name: "Lingscars.com", 
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toLocaleString(), 
      vio: ['heading-too-big', 'heading-too-small', 'bad-alt-text'] 
    },
    { 
      id: 2, 
      name: "Lingscars.com", 
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toLocaleString(), 
      vio: ['missing-form-labels', 'low-contrast-text', 'broken-links'] 
    },
    { 
      id: 3, 
      name: "Lingscars.com", 
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toLocaleString(), 
      vio: ['improper-focus-order', 'missing-skip-links'] 
    },
    { 
      id: 4, 
      name: "Lingscars.com", 
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toLocaleString(), 
      vio: ['heading-too-big', 'missing-aria-labels'] 
    },
    { 
      id: 5, 
      name: "Lingscars.com", 
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toLocaleString(), 
      vio: ['bad-alt-text', 'color-contrast-issues', 'keyboard-navigation'] 
    },
    { 
      id: 6, 
      name: "Lingscars.com", 
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toLocaleString(), 
      vio: ['heading-too-small', 'missing-landmarks'] 
    },
  ]

  useEffect(() => {
    if (operatorData.length > 0 && !selectedViolation) {
      dispatch(selectViolation(operatorData[0]));
    }
  }, [dispatch, selectedViolation]); // Removed operatorData from dependencies since it's static
  
  return (
    <div className="h-full flex flex-col">
      <ScanLayout>
        <div className="h-full flex p-4">
          <div className="w-full flex flex-col">
            <div className="flex flex-col">
              <h1 className="font-medium">Operator View</h1>
              <Pagination>
                <PaginationPrevious className="bg-slate-200 text-slate-900 rounded-lg w-24 list-none">
                  Previous
                </PaginationPrevious>

                {/* Map through operator data to create pagination items */}
                <div className="flex flex-row items-center px-3 gap-2">
                  {operatorData.map((item) => (
                    <PaginationItem key={item.id} className="list-none">
                      <PaginationLink tabIndex={item.id}>{item.id}</PaginationLink>
                    </PaginationItem>
                  ))}
                </div>
                
                <PaginationNext className="bg-slate-200 text-slate-900 rounded-lg w-24">
                  Next
                </PaginationNext>
              </Pagination>
            </div>
            
            <div className="h-full flex flex-wrap gap-4 p-1 justify-start">
              {/* Map through operator data to display cards */}
              {operatorData.map((items, index) => (
                <motion.div
                  whileHover={{ scale: 1.03, color: "#f86b1a", transition: { duration: 0.3 } }}
                  onClick={() => handleCardClick(items)}
                  className={`h-52 w-40 border rounded-lg shadow-md m-4 cursor-pointer ${
                    selectedViolation?.id === items.id ? 'border-orange-500 border-2' : ''
                  }`} 
                  key={index}
                >
                  <img src="Image2.png" alt="Snapshot" className="h-full w-full rounded-lg"/>
                  <p>{items.name}</p>
                  <p className="text-xs">{items.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Fixed: Add null check and pass selectedViolation directly */}
          {selectedViolation && <OperatorPreview violation={selectedViolation} />}
        </div>
      </ScanLayout>
    </div>
  )
}

export default operatorView