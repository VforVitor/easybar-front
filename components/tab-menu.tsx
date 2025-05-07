'use client'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

interface Produto {
  _id: string;
  nome: string;
  descricao: string;
  categoria: string;
  valor: number;
}

interface ItemComanda {
  produto: Produto;
  quantidade: number;
  valor: number;
  observacoes: string;
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue';
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

interface ApiResponse {
  success: boolean;
  data: Comanda[];
}

export default function TabMenu() {
  const { user, isLoaded } = useUser();
  const [comanda, setComanda] = useState<Comanda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseTab = () => {
    if (!comanda) return;
    setIsClosing(true);
    // Get existing closing tabs
    const existingClosingTabs = JSON.parse(localStorage.getItem('closingTabs') || '[]');
    // Add this tab to the list
    const updatedClosingTabs = Array.from(new Set([...existingClosingTabs, comanda._id]));
    localStorage.setItem('closingTabs', JSON.stringify(updatedClosingTabs));
  };

  useEffect(() => {
    const fetchComanda = async () => {
      if (!isLoaded || !user) return;

      try {
        // First fetch user data to get the name
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserName(userData.nome);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comandas/dono/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch comanda: ${response.status}`);
        }
        
        const apiResponse: ApiResponse = await response.json();
        
        if (!apiResponse.success) {
          throw new Error('Failed to fetch comanda data');
        }

        // Find the open comanda (status === 1)
        const openComanda = apiResponse.data.find((comanda: Comanda) => comanda.status === 1);
        if (openComanda) {
          setComanda(openComanda);
        } else {
          setError('No open comanda found');
        }
      } catch (err) {
        console.error('Error fetching comanda:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchComanda();
    }
  }, [user, isLoaded]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;
  }

  if (!comanda) {
    return <div className="flex items-center justify-center min-h-screen">No open comanda found</div>;
  }

  const subtotal = comanda.produtos.reduce((acc, item) => acc + (item.valor * item.quantidade), 0);
  const tip = subtotal * 0.1; // 10% tip
  const total = subtotal + tip;

  return (
    <div className="flex flex-col w-full min-h-screen bg-white p-4">
      <main className="flex flex-col gap-4 p-4">
        <div className="h-full lg:flex flex-col items-center justify-center">
        <Card className="w-full max-w-md h-full">
          <CardHeader className="flex items-center gap-4">
            <ClipboardIcon className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-lg font-bold text-primary">Tab</CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground">#{comanda._id}</CardDescription>
              <p className="text-sm text-muted-foreground">{userName}</p>
            </div>
          </CardHeader>
        </Card>
        </div>
        <div className="space-y-4">
          {comanda.produtos.map((item) => (
            <div key={item.produto._id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.produto.nome}</p>
                <p className="text-xs text-muted-foreground">
                  Qtd. <span className="text-primary">{item.quantidade}</span>
                </p>
                {item.observacoes && (
                  <p className="text-xs text-muted-foreground italic">Obs: {item.observacoes}</p>
                )}
                <p className="text-xs text-muted-foreground">Status: {item.status}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">R$ {(item.valor * item.quantidade).toFixed(2)}</p>
                <button className="flex items-center justify-center w-6 h-6">
                  <EllipsisVerticalIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t my-4" />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-primary">Subtotal</p>
            <p className="text-sm font-medium">R$ {subtotal.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Tip</p>
            <p className="text-sm font-medium">R$ {tip.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-primary">Total</p>
            <p className="text-sm font-medium">R$ {total.toFixed(2)}</p>
          </div>
        </div>
      </main>
      <footer className="p-4">
        {isClosing ? (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md text-center mb-4">
            Solicitação enviada ao garçom. Aguarde na mesa.
          </div>
        ) : (
          <Button 
            className="w-full bg-[#5f0f40] text-white py-2"
            onClick={handleCloseTab}
          >
            Fechar Comanda
          </Button>
        )}
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


function ClipboardIcon(props: any) {
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
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}


function EllipsisVerticalIcon(props: any) {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}


function MartiniIcon(props: any) {
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
      <path d="M8 22h8" />
      <path d="M12 11v11" />
      <path d="m19 3-7 8-7-8Z" />
    </svg>
  )
}