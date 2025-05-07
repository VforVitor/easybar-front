'use client'

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from 'next/navigation';

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

export default function TabDetails() {
  const params = useParams();
  const router = useRouter();
  const [comanda, setComanda] = useState<Comanda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isClosing, setIsClosing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const fetchComanda = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comandas/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch comanda: ${response.status}`);
        }

        const data = await response.json();
        setComanda(data);

        // Fetch user data to get the name
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${data.dono}`, {
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
      } catch (err) {
        console.error('Error fetching comanda:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchComanda();
  }, [params.id]);

  const handleCloseTab = async () => {
    if (!comanda) return;
    
    try {
      setIsClosing(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comandas/${comanda.dono}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 0, // 0 means closed
          _id: comanda.dono
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to close tab: ${response.status}`);
      }

      // Remove from localStorage if it was in closing state
      const closingTabs = JSON.parse(localStorage.getItem('closingTabs') || '[]');
      const updatedClosingTabs = closingTabs.filter((id: string) => id !== comanda._id);
      localStorage.setItem('closingTabs', JSON.stringify(updatedClosingTabs));

      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error closing tab:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsClosing(false);
    }
  };

  const handleConfirmSuccess = () => {
    setShowSuccessDialog(false);
    router.push('/management');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;
  }

  if (!comanda) {
    return <div className="flex items-center justify-center min-h-screen">Comanda não encontrada</div>;
  }

  const subtotal = comanda.produtos.reduce((acc, item) => acc + (item.valor * item.quantidade), 0);
  const tip = subtotal * 0.1; // 10% tip
  const total = subtotal + tip;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Comanda #{comanda._id}</CardTitle>
              <CardDescription>
                Mesa {comanda.mesa} • {userName}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Criada em: {new Date(comanda.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Última atualização: {new Date(comanda.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Itens da Comanda</h2>
          <div className="space-y-4">
            {comanda.produtos.map((item) => (
              <div key={item.produto._id} className="flex items-start justify-between border-b pb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.produto.nome}</h3>
                    <span className="text-sm text-muted-foreground">
                      x{item.quantidade}
                    </span>
                  </div>
                  {item.observacoes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Obs: {item.observacoes}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      item.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'preparando' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'pronto' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ {(item.valor * item.quantidade).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {item.valor.toFixed(2)} un.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Resumo</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxa de Serviço (10%)</span>
              <span>R$ {tip.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {comanda.formaPagamento && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Forma de Pagamento</h2>
            <p className="capitalize">
              {comanda.formaPagamento.replace('_', ' ')}
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Ações</h2>
            <Button 
              onClick={handleCloseTab}
              disabled={isClosing || comanda.status === 0}
              className="bg-[#5f0f40] text-white hover:bg-[#4a0c32]"
            >
              {isClosing ? 'Fechando...' : 'Fechar Comanda'}
            </Button>
          </div>
        </div>
      </div>

      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-2">Comanda Fechada</h2>
            <p className="text-gray-600 mb-6">
              A comanda foi fechada com sucesso. Você será redirecionado para a página de gerenciamento.
            </p>
            <div className="flex justify-end">
              <Button
                className="bg-[#5f0f40] text-white"
                onClick={handleConfirmSuccess}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 