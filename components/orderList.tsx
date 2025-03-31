import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AccordionOrder from "./orderAccordion"

export default function OrdersList() {
  const firstTitle = 'Pedidos Prontos'
  const secondTitle = 'Pedidos em preparo'
  const thirdTitle = 'Pedidos entregues'

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      <main className="flex flex-col items-center w-full p-4 space-y-4">
        <div className="w-full">
        <div className="flex items-center gap-4">
          <SearchIcon className="text-[#5f0f40] w-6 h-6" />
          <Input 
            type="search" 
            placeholder="Busque seu pedido" 
            className="pl-8 w-full max-w-md border rounded-md" />
        </div>
        </div>
        <div className="w-full p-4 bg-white rounded-md shadow">
          <h2 className="mb-2 text-lg font-semibold">Last releases</h2>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span>17:57 - Order #0017</span>
              <Badge variant="default" className="bg-green-500 text-white">
                Ready
              </Badge>
            </li>
            <li className="flex items-center justify-between">
              <span>17:48 - Order #0012</span>
              <Badge variant="default" className="bg-blue-500 text-white">
                In preparation
              </Badge>
            </li>
            <li className="flex items-center justify-between">
              <span>17:34 - Order #0016</span>
              <Badge variant="default" className="bg-orange-500 text-white">
                Delivered
              </Badge>
            </li>
            <li className="flex items-center justify-between">
              <span>17:27 - Order #0023</span>
              <Badge variant="default" className="bg-green-500 text-white">
                Ready
              </Badge>
            </li>
          </ul>
        </div>
      </main>
      <AccordionOrder titleButton={firstTitle} />
      <AccordionOrder titleButton={secondTitle} />
      <AccordionOrder titleButton={thirdTitle} />
      <footer className="py-4 text-sm text-center text-muted-foreground">Todos os direitos reservados.</footer>
    </div>
  )
}

function SearchIcon(props: any) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}