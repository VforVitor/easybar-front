'use client'

import { Header } from "@/components/header";
import MenuOption from '../../components/menuOptions';
import Image from "next/image";
import TabMenu from "@/components/tab-menu";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

const TabLayout = ({ children }: Props) => {
  const { user, isLoaded } = useUser();
  const [isWaiter, setIsWaiter] = useState(false);

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
          setIsWaiter(userData.tipo === 'garcom');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    if (isLoaded && user) {
      checkUserRole();
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      {!isWaiter && <TabMenu />}
      {isWaiter && children}
    </>
  );
};

export default TabLayout;
