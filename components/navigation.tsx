"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { NavButton } from "./nav-button";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/tab",
    label: "Comanda",
  },
  {
    href: "/menu",
    label: "Cardápio",
  },
  {
    href: "/order",
    label: "Pedidos",
  },
  {
    href: "/management",
    label: "Area do Funcionário",
  },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 1024px)", false);
  const { user, isLoaded } = useUser();

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
          setUserType(userData.tipo);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    if (isLoaded && user) {
      checkUserRole();
    }
  }, [user, isLoaded]);

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const filteredRoutes = routes.filter(route => {
    if (route.href === '/management') {
      return userType === 'garcom' || userType === 'admin';
    }
    if (route.href === '/tab') {
      return userType === 'cliente';
    }
    return true;
  });

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="px-2" side="left">
          <nav className="flex flex-col gap-y-2 pt-6">
            {filteredRoutes.map((route) => (
              <Button
                key={route.href}
                variant={route.href === pathname ? "secondary" : "ghost"}
                onClick={() => onClick(route.href)}
                className="w-full justify-start"
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {filteredRoutes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
};
