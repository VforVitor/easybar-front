'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Mesa {
  _id: string;
  numero: number;
  status: number;
  capacidade: number;
  ativo: boolean;
}

interface Comanda {
  _id: string;
  status: 0 | 1 | 2; // 0: fechada, 1: aberta, 2: cancelada
  dono: string; // clerkId reference
  mesa: number;
  valorTotal: number;
  formaPagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | null;
  ativo: boolean;
  produtos: ItemComanda[];
  createdAt: string;
  updatedAt: string;
}

interface ItemComanda {
  _id: string;
  produto: {
    _id: string;
    nome: string;
    preco: number;
  };
  quantidade: number;
  observacao: string;
  status: number;
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

export default function TableView() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [mesa, setMesa] = useState<Mesa | null>(null);
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch table details
        const mesaResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mesas/numero/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!mesaResponse.ok) {
          throw new Error(`Failed to fetch table: ${mesaResponse.status}`);
        }
        
        const mesaData = await mesaResponse.json();
        setMesa(mesaData);

        try {
          // Fetch tabs for this table
          const comandasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comandas/mesa/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          
          if (comandasResponse.ok) {
            const comandasData = await comandasResponse.json();
            setComandas(comandasData.data);
          } else if (comandasResponse.status === 404) {
            // If no comandas found, set empty array
            setComandas([]);
          } else {
            throw new Error(`Failed to fetch tabs: ${comandasResponse.status}`);
          }
        } catch (comandaErr) {
          console.error('Error fetching comandas:', comandaErr);
          // If error fetching comandas, set empty array but don't fail the whole component
          setComandas([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const updateTableStatus = async (newStatus: number) => {
    if (!mesa) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mesas/${mesa._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update table status: ${response.status}`);
      }
      
      setMesa(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error('Error updating table status:', err);
    }
  };

  const handleClick = () => {
    router.push('/management')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
        <header className="flex items-center justify-between w-full p-4 bg-white shadow-md">
          <ArrowLeftIcon onClick={() => handleClick()} className="w-6 h-6 cursor-pointer" />
        </header>
        <main className="flex flex-col items-center w-full p-4">
          <div className="flex items-center justify-center p-4">
            <span className="text-gray-500">Carregando detalhes da mesa...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error || !mesa) {
    return (
      <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
        <header className="flex items-center justify-between w-full p-4 bg-white shadow-md">
          <ArrowLeftIcon onClick={() => handleClick()} className="w-6 h-6 cursor-pointer" />
        </header>
        <main className="flex flex-col items-center w-full p-4">
          <div className="flex items-center justify-center p-4">
            <span className="text-red-500">Erro ao carregar detalhes da mesa: {error}</span>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      <header className="flex items-center justify-between w-full p-4 bg-white shadow-md">
        <ArrowLeftIcon onClick={() => handleClick()} className="w-6 h-6 cursor-pointer" />
      </header>
      <main className="flex flex-col items-center w-full p-4 space-y-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div>
                <CardTitle className="text-lg font-semibold">Mesa #{String(mesa.numero).padStart(2, "0")}</CardTitle>
                <p className={`text-sm ${
                  mesa.status === 0 ? 'text-green-500' : 
                  mesa.status === 1 ? 'text-red-500' : 
                  'text-yellow-500'
                }`}>
                  {getStatusText(mesa.status)}
                </p>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-400">{String(mesa.numero).padStart(2, "0")}</div>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="flex gap-2">
              <button
                onClick={() => updateTableStatus(0)}
                className={`px-4 py-2 rounded-md ${
                  mesa.status === 0 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Disponível
              </button>
              <button
                onClick={() => updateTableStatus(1)}
                className={`px-4 py-2 rounded-md ${
                  mesa.status === 1 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ocupada
              </button>
              <button
                onClick={() => updateTableStatus(2)}
                className={`px-4 py-2 rounded-md ${
                  mesa.status === 2 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Reservada
              </button>
            </div>
          </CardContent>
        </Card>
        <div className="w-full max-w-md space-y-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Comandas Abertas</h2>
          {Array.isArray(comandas) && comandas.length > 0 ? (
            comandas.map((comanda) => (
              <Card 
                key={comanda._id}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => router.push(`/tab/${comanda._id}`)}
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/avatar_placeholder.svg" alt="Avatar" />
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">Comanda: #{comanda._id.slice(-4)}</p>
                    <p className="text-sm text-muted-foreground">
                      R$ {comanda.valorTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-muted-foreground" />
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Não há comandas abertas nesta mesa</p>
          )}
        </div>
      </main>
      <footer className="w-full p-4 text-center text-sm text-muted-foreground">
        Todos os direitos reservados.
      </footer>
    </div>
  )
}

function ArrowLeftIcon(props: any) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

function ChevronRightIcon(props: any) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}