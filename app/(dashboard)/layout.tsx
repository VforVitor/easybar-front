'use client'
import { Header } from "@/components/header";
import MenuOption from '../../components/menuOptions';
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getTableNumber } from "@/lib/storage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Order {
  _id: string;
  status: 0 | 1 | 2 | 3; // 0: pendente, 1: em preparo, 2: pronto, 3: entregue
  valor: number;
  quantidade: number;
  produto: {
    nome: string;
    valor: number;
  };
  comanda: string;
  dono: string;
  observacoes: string;
  createdAt: string;
  updatedAt: string;
}

const DashboardLayout = () => {
  const { user, isLoaded } = useUser();
  const tableNumber = getTableNumber();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter orders for current user
        const userOrders = data.filter((order: Order) => order.dono === user.id);
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Handle user initialization and tab setup
  useEffect(() => {
    const handleUserAndTab = async () => {
      if (!isLoaded || !user) return;

      try {
        // 1. Check if user exists in backend
        const checkUserResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${user.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        // 2. Create user if doesn't exist
        if (checkUserResponse.status === 404) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              nome: `${user.firstName} ${user.lastName}`.trim(),
              clerkId: user.id,
              email: user.emailAddresses[0]?.emailAddress,
              tipo: 'cliente',
              ativo: true
            }),
          });
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Error in handleUserAndTab:', error);
      }
    };

    handleUserAndTab();
  }, [isLoaded, user]);

  // Fetch orders when user is initialized and set up polling
  useEffect(() => {
    if (!isInitialized || !user) return;

    // Initial fetch
    fetchOrders();

    // Set up polling every 10 seconds
    const pollInterval = setInterval(fetchOrders, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(pollInterval);
  }, [isInitialized, user]);

  // Group orders by status
  const ordersByStatus = {
    pending: orders.filter(order => order.status === 0),
    inPreparation: orders.filter(order => order.status === 1),
    delivered: orders.filter(order => order.status === 3),
  };

  return (
    <>
      <Header />
      <div className="h-full lg:flex flex-col items-center justify-center px-4 py-10">
        {isLoaded && user && (
          <div className="w-full max-w-4xl space-y-6">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">
                  Bem-vindo(a), {user.firstName}!
                </CardTitle>
                <CardDescription className="text-lg">
                  Estamos felizes em tê-lo(a) aqui. Aproveite sua experiência!
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Table Information Card */}
            {tableNumber && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                        <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                        <path d="M12 3v6" />
                      </svg>
                    </div>
                    Mesa {tableNumber}
                  </CardTitle>
                  <CardDescription>
                    Sua mesa está pronta para receber seus pedidos
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Orders Accordion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  Seus Pedidos
                </CardTitle>
                <CardDescription>
                  Acompanhe o status dos seus pedidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {/* In Preparation Orders */}
                  <AccordionItem value="preparation">
                    <AccordionTrigger className="flex items-center justify-between w-full px-4 py-2 bg-white rounded-lg shadow-sm">
                      <span className="text-primary">Pedidos em Preparo ({ordersByStatus.inPreparation.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col space-y-4">
                        {ordersByStatus.inPreparation.length === 0 ? (
                          <div className="text-center text-gray-400 py-4">Nenhum pedido em preparo.</div>
                        ) : (
                          ordersByStatus.inPreparation.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                              <div className="flex flex-col">
                                <span className="font-medium">{order.produto.nome} x{order.quantidade}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(order.createdAt).toLocaleTimeString()} - Pedido #{order._id.slice(-4)}
                                </span>
                                {order.observacoes && (
                                  <span className="text-sm text-gray-600 italic">Obs: {order.observacoes}</span>
                                )}
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge variant="default" className="bg-blue-500 text-white">
                                  Em Preparo
                                </Badge>
                                <span className="text-sm font-medium mt-1">R$ {order.valor.toFixed(2)}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Pending Orders */}
                  <AccordionItem value="pending">
                    <AccordionTrigger className="flex items-center justify-between w-full px-4 py-2 bg-white rounded-lg shadow-sm">
                      <span className="text-primary">Pedidos Pendentes ({ordersByStatus.pending.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col space-y-4">
                        {ordersByStatus.pending.length === 0 ? (
                          <div className="text-center text-gray-400 py-4">Nenhum pedido pendente.</div>
                        ) : (
                          ordersByStatus.pending.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                              <div className="flex flex-col">
                                <span className="font-medium">{order.produto.nome} x{order.quantidade}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(order.createdAt).toLocaleTimeString()} - Pedido #{order._id.slice(-4)}
                                </span>
                                {order.observacoes && (
                                  <span className="text-sm text-gray-600 italic">Obs: {order.observacoes}</span>
                                )}
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge variant="default" className="bg-yellow-500 text-white">
                                  Pendente
                                </Badge>
                                <span className="text-sm font-medium mt-1">R$ {order.valor.toFixed(2)}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Delivered Orders */}
                  <AccordionItem value="delivered">
                    <AccordionTrigger className="flex items-center justify-between w-full px-4 py-2 bg-white rounded-lg shadow-sm">
                      <span className="text-primary">Pedidos Entregues ({ordersByStatus.delivered.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col space-y-4">
                        {ordersByStatus.delivered.length === 0 ? (
                          <div className="text-center text-gray-400 py-4">Nenhum pedido entregue.</div>
                        ) : (
                          ordersByStatus.delivered.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                              <div className="flex flex-col">
                                <span className="font-medium">{order.produto.nome} x{order.quantidade}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(order.createdAt).toLocaleTimeString()} - Pedido #{order._id.slice(-4)}
                                </span>
                                {order.observacoes && (
                                  <span className="text-sm text-gray-600 italic">Obs: {order.observacoes}</span>
                                )}
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge variant="default" className="bg-gray-500 text-white">
                                  Entregue
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
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardLayout;
