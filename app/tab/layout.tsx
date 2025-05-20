'use client'

import { Header } from "@/components/header";
import MenuOption from '../../components/menuOptions';
import Image from "next/image";
import TabMenu from "@/components/tab-menu";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Props = {
  children: React.ReactNode;
};

const TabLayout = ({ children }: Props) => {
  const { user, isLoaded } = useUser();
  const [isWaiter, setIsWaiter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setIsWaiter(userData.tipo === 'garcom');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded && user) {
      checkUserRole();
    }
  }, [user, isLoaded]);

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto p-4">
          <Card className="p-8 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-[#5f0f40] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4">
        {!isWaiter && <TabMenu />}
        {isWaiter && (
          <Card className="p-6">
            {children}
          </Card>
        )}
      </div>
    </div>
  );
};

export default TabLayout;
