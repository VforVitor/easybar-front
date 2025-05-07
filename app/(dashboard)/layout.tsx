'use client'
import { Header } from "@/components/header";
import MenuOption from '../../components/menuOptions';
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getTableNumber } from "@/lib/storage";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const tableNumber = getTableNumber();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

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

        // 3. Check if user has open tab
        if (tableNumber) {
          const checkTabResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comandas/dono/${user.id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });

          // 4. Create new tab if none exists
          if (checkTabResponse.status === 404) {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comandas`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                dono: user.id,
                mesa: tableNumber,
                status: 1,
                valorTotal: 0,
                formaPagamento: null,
                ativo: true
              }),
            });

            // Update table status
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mesas/${tableNumber}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ status: 1 }),
            });
          }
        }
      } catch (error) {
        console.error('Error in handleUserAndTab:', error);
      }
    };

    handleUserAndTab();
  }, [isLoaded, user, tableNumber]);

  return (
    <>
      <Header />
      <div className="h-full lg:flex flex-col items-center justify-center px-4 py-10">
        {isLoaded && user && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Informações do Usuário</h2>
            <div className="space-y-2">
              <p><span className="font-medium">ID:</span> {user.id}</p>
              <p><span className="font-medium">Nome:</span> {user.firstName} {user.lastName}</p>
              <p><span className="font-medium">Email:</span> {user.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>
        )}
        {children}
      </div>
    </>
  );
};

export default DashboardLayout;
