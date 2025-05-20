'use client'

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AccordionOrder from "./orderAccordion"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Product {
  _id: string;
  nome: string;
  preco: number;
}

interface Order {
  _id: string;
  status: 0 | 1 | 2 | 3; // 0: pendente, 1: em preparo, 2: pronto, 3: entregue
  valor: number;
  quantidade: number;
  produto: Product;
  comanda: string; // Bill ID
  dono: string; // clerkId
  observacoes: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersList() {
  const { user, isLoaded } = useUser();
  const [view, setView] = useState<'cliente' | 'garcom'>('cliente');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGarcom, setIsGarcom] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const firstTitle = 'Pedidos Prontos'
  const secondTitle = 'Pedidos em preparo'
  const thirdTitle = 'Pedidos entregues'

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.tipo === 'garcom') {
            setIsGarcom(true);
            setView('garcom'); // Always set to garcom for waiters
          }
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    if (isLoaded && user) {
      checkUserRole();
    }
  }, [user, isLoaded]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders?.length > 0 ? orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If it's client view, only show their orders
    if (view === 'cliente') {
      return matchesSearch && order.dono === user?.id;
    }
    
    // If it's waiter view, show all orders
    return matchesSearch;
  }) : [];

  // Group orders by status for the accordion sections
  const ordersByStatus = {
    ready: filteredOrders.filter(order => order.status === 2), // pronto
    inPreparation: filteredOrders.filter(order => order.status === 1), // em preparo
    delivered: filteredOrders.filter(order => order.status === 3), // entregue
    pending: filteredOrders.filter(order => order.status === 0), // pendente
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Pendente';
      case 1: return 'Em preparo';
      case 2: return 'Pronto';
      case 3: return 'Entregue';
      default: return 'Desconhecido';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-yellow-500';
      case 1: return 'bg-blue-500';
      case 2: return 'bg-green-500';
      case 3: return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: 0 | 1 | 2 | 3) => {
    if (!isGarcom) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pedidos/${orderId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error('Failed to update order status');

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      <main className="flex flex-col items-center w-full p-4 space-y-4">
        <div className="w-full flex justify-between items-center mb-4">
          <div className="flex items-center gap-4 flex-1">
            <SearchIcon className="text-[#5f0f40] w-6 h-6" />
            <Input 
              type="search" 
              placeholder="Busque seu pedido" 
              className="pl-8 w-full max-w-md border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isGarcom && (
            <div className="flex gap-2">
              {/* No buttons needed */}
            </div>
          )}
        </div>

        <div className="w-full p-4 bg-white rounded-md shadow">
          <h2 className="mb-2 text-lg font-semibold">
            {view === 'cliente' ? 'Meus Pedidos' : 'Todos os Pedidos'}
          </h2>
          <ul className="space-y-2">
            {filteredOrders.map((order) => (
              <li key={order._id} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {order.produto.nome} x{order.quantidade}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString()} - Pedido #{order._id.slice(-4)}
                  </span>
                  {order.observacoes && (
                    <span className="text-sm text-gray-600 italic">
                      Obs: {order.observacoes}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {isGarcom ? (
                    <Select
                      value={order.status.toString()}
                      onValueChange={(value: string) => handleStatusChange(order._id, parseInt(value) as 0 | 1 | 2 | 3)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue>
                          <Badge 
                            variant="default" 
                            className={`${getStatusColor(order.status)} text-white`}
                          >
                            {getStatusText(order.status)}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Pendente</SelectItem>
                        <SelectItem value="1">Em preparo</SelectItem>
                        <SelectItem value="2">Pronto</SelectItem>
                        <SelectItem value="3">Entregue</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge 
                      variant="default" 
                      className={`${getStatusColor(order.status)} text-white`}
                    >
                      {getStatusText(order.status)}
                    </Badge>
                  )}
                  <span className="text-sm font-medium">
                    R$ {order.valor.toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      {isGarcom && (
        <>
          <AccordionOrder titleButton={firstTitle} orders={ordersByStatus.ready} />
          <AccordionOrder titleButton={secondTitle} orders={ordersByStatus.inPreparation} />
          <AccordionOrder titleButton={thirdTitle} orders={ordersByStatus.delivered} />
        </>
      )}
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