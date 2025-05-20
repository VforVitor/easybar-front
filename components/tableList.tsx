'use client'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Mesa {
  _id: string;
  numero: number;
  status: number; // 0: livre, 1: ocupada, 2: reservada
  capacidade: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Comanda {
  _id: string;
  status: number; // 0: fechada, 1: aberta, 2: cancelada
  mesa: {
    _id: string;
    numero: number;
  };
}

const getStatusText = (status: number): string => {
  switch (status) {
    case 0:
      return 'Disponível';
    case 1:
      return 'Ocupada';
    case 2:
      return 'Reservada';
    default:
      return 'Status Desconhecido';
  }
}

const getStatusColor = (status: number): string => {
  switch (status) {
    case 0:
      return 'text-green-500';
    case 1:
      return 'text-red-500';
    case 2:
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
}

export default function TableList() {
  const router = useRouter();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar mesas
        const mesasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mesas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!mesasResponse.ok) {
          throw new Error(`Failed to fetch mesas: ${mesasResponse.status}`);
        }
        
        const mesasData = await mesasResponse.json();
        
        // Buscar comandas
        const comandasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comandas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!comandasResponse.ok) {
          throw new Error(`Failed to fetch comandas: ${comandasResponse.status}`);
        }
        
        const comandasData = await comandasResponse.json();
        
        // Atualizar o status das mesas com base nas comandas
        const updatedMesas = mesasData.map((mesa: Mesa) => {
          // Verificar se existe uma comanda aberta para esta mesa
          const comandaAberta = comandasData.find(
            (comanda: Comanda) => 
              comanda.mesa._id === mesa._id && 
              comanda.status === 1 // Status 1 = aberta
          );
          
          // Se existe uma comanda aberta, atualizar o status da mesa para ocupada
          if (comandaAberta) {
            return {
              ...mesa,
              status: 1 // Status 1 = ocupada
            };
          }
          
          return mesa;
        });
        
        setMesas(updatedMesas);
        setComandas(comandasData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTableClick = (mesa: Mesa) => {
    router.push(`/table/${mesa.numero}`);
  }

  if (loading) {
    return (
      <div className="w-full">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="tables" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 bg-[#5f0f40] text-white hover:bg-[#4a0c32] transition-colors">
              <span className="text-lg font-semibold">Mesas</span>
            </AccordionTrigger>
            <AccordionContent className="bg-white p-4">
              <div className="flex items-center justify-center p-4">
                <span className="text-gray-500">Carregando mesas...</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="tables" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 bg-[#5f0f40] text-white hover:bg-[#4a0c32] transition-colors">
              <span className="text-lg font-semibold">Mesas</span>
            </AccordionTrigger>
            <AccordionContent className="bg-white p-4">
              <div className="flex items-center justify-center p-4">
                <span className="text-red-500">Erro ao carregar mesas: {error}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="tables" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 bg-[#5f0f40] text-white hover:bg-[#4a0c32] transition-colors">
            <span className="text-lg font-semibold">Mesas</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mesas.map((mesa) => (
                <div 
                  key={mesa._id} 
                  onClick={() => handleTableClick(mesa)} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200"
                >
                  <div className="flex flex-col">
                    <span className="text-[#5f0f40] font-medium">Mesa #{String(mesa.numero).padStart(2, "0")}</span>
                    <span className={`text-sm ${getStatusColor(mesa.status)}`}>
                      {getStatusText(mesa.status)} • {mesa.capacidade} lugares
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-[#5f0f40] opacity-50">
                    {String(mesa.numero).padStart(2, "0")}
                  </div>
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