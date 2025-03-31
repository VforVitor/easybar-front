
'use client'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useRouter } from "next/navigation";

export default function AccordionOrder({titleButton}: any) {
  const router = useRouter();
  
  const handleTableClick = (id: number) => {
    router.push('/table/${id}')
  }

  return (
    <div className="flex flex-col items-center w-full bg-gray-100">
      <Accordion type="single" collapsible className="w-full px-4 py-2">
        <AccordionItem value="tables">
          <AccordionTrigger className="flex items-center justify-between w-full px-4 py-2 bg-white rounded-lg shadow-md">
            <span className="text-primary">{titleButton}</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} onClick={() => handleTableClick(index)} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md mt-3">
                  <span className="text-4xl text-gray-300">{String(index + 1).padStart(2, "0")}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

function ChevronDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}