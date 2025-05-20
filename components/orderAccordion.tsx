'use client'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge"

export default function AccordionOrder({ titleButton, orders = [] }: { titleButton: string, orders: any[] }) {
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
              {orders.length === 0 ? (
                <div className="text-center text-gray-400 py-4">Nenhum pedido nesta categoria.</div>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md mt-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.produto.nome} x{order.quantidade}</span>
                      <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()} - Pedido #{order._id.slice(-4)}</span>
                      {order.observacoes && (
                        <span className="text-sm text-gray-600 italic">Obs: {order.observacoes}</span>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="default" className={`text-white ${
                        order.status === 0 ? 'bg-yellow-500' :
                        order.status === 1 ? 'bg-blue-500' :
                        order.status === 2 ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}>
                        {order.status === 0 ? 'Pendente' :
                         order.status === 1 ? 'Em preparo' :
                         order.status === 2 ? 'Pronto' :
                         'Entregue'}
                      </Badge>
                      <span className="text-sm font-medium mt-1">R$ {order.valor.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
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