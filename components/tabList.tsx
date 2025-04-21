'use client'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Comanda {
  _id: string;
  status: number; // 0: fechada, 1: aberta, 2: cancelada
  dono: {
    _id: string;
    nome: string;
  };
  mesa: {
    _id: string;
    numero: number;
  };
  valorTotal: number;
  formaPagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

const getStatusText = (status: number): string => {
  switch (status) {
    case 0:
      return 'Fechada';
    case 1:
      return 'Aberta';
    case 2:
      return 'Cancelada';
    default:
      return 'Status Desconhecido';
  }
}

const getStatusColor = (status: number): string => {
  switch (status) {
    case 0:
      return 'text-green-500';
    case 1:
      return 'text-blue-500';
    case 2:
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

const getFormaPagamentoText = (forma: string | null): string => {
  if (!forma) return 'Não definido';
  
  switch (forma) {
    case 'dinheiro':
      return 'Dinheiro';
    case 'cartao_credito':
      return 'Cartão de Crédito';
    case 'cartao_debito':
      return 'Cartão de Débito';
    case 'pix':
      return 'PIX';
    default:
      return 'Não definido';
  }
}

export default function TabList() {
  const router = useRouter();
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComandas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comandas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch comandas: ${response.status}`);
        }
        
        const data = await response.json();
        setComandas(data);
      } catch (err) {
        console.error('Error fetching comandas:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchComandas();
  }, []);

  const handleTabClick = (id: string) => {
    router.push(`/tab/${id}`);
  }

  const updateTableStatus = async (tableId: string, status: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mesas/${tableId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update table status: ${response.status}`);
      }
      
      // Atualizar a lista de comandas após atualizar o status da mesa
      const updatedComandas = comandas.map(comanda => {
        if (comanda.mesa._id === tableId) {
          // Atualizar o status da mesa na comanda localmente
          return {
            ...comanda,
            mesa: {
              ...comanda.mesa,
              status: status
            }
          };
        }
        return comanda;
      });
      
      setComandas(updatedComandas);
    } catch (err) {
      console.error('Error updating table status:', err);
    }
  };

  // Função para abrir uma nova comanda
  const openNewBill = async (tableId: string, userId: string) => {
    try {
      // Primeiro, atualizar o status da mesa para ocupada (1)
      await updateTableStatus(tableId, 1);
      
      // Depois, criar uma nova comanda
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comandas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          mesa: tableId,
          dono: userId,
          status: 1, // Aberta
          valorTotal: 0
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create bill: ${response.status}`);
      }
      
      const newBill = await response.json();
      
      // Adicionar a nova comanda à lista
      setComandas(prevComandas => [...prevComandas, newBill]);
      
      // Redirecionar para a página da comanda
      router.push(`/tab/${newBill._id}`);
    } catch (err) {
      console.error('Error creating new bill:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="tabs" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 bg-[#5f0f40] text-white hover:bg-[#4a0c32] transition-colors">
              <span className="text-lg font-semibold">Comandas</span>
            </AccordionTrigger>
            <AccordionContent className="bg-white p-4">
              <div className="flex items-center justify-center p-4">
                <span className="text-gray-500">Carregando comandas...</span>
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
          <AccordionItem value="tabs" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 bg-[#5f0f40] text-white hover:bg-[#4a0c32] transition-colors">
              <span className="text-lg font-semibold">Comandas</span>
            </AccordionTrigger>
            <AccordionContent className="bg-white p-4">
              <div className="flex items-center justify-center p-4">
                <span className="text-red-500">Erro ao carregar comandas: {error}</span>
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
        <AccordionItem value="tabs" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 bg-[#5f0f40] text-white hover:bg-[#4a0c32] transition-colors">
            <span className="text-lg font-semibold">Comandas</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {comandas.map((comanda) => (
                <div 
                  key={comanda._id} 
                  onClick={() => handleTabClick(comanda._id)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200"
                >
                  <div className="flex flex-col">
                    <span className="text-[#5f0f40] font-medium">
                      Mesa #{String(comanda.mesa.numero).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col text-sm">
                      <span className={getStatusColor(comanda.status)}>
                        {getStatusText(comanda.status)}
                      </span>
                      <span className="text-gray-500">
                        {comanda.dono.nome} • R$ {comanda.valorTotal.toFixed(2)}
                      </span>
                      {comanda.formaPagamento && (
                        <span className="text-gray-500">
                          {getFormaPagamentoText(comanda.formaPagamento)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-[#5f0f40] opacity-50">
                    {String(comanda.mesa.numero).padStart(2, "0")}
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