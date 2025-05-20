'use client'
import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { setTableNumber } from "@/lib/storage";
import { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table');
  const redirectUrl = searchParams.get('redirect_url');

  useEffect(() => {
    // Try to get table number from direct URL first
    if (tableNumber) {
      setTableNumber(tableNumber);
    } 
    // If not found, try to get it from redirect_url
    else if (redirectUrl) {
      try {
        const url = new URL(redirectUrl);
        const tableFromRedirect = url.searchParams.get('table');
        if (tableFromRedirect) {
          setTableNumber(tableFromRedirect);
        }
      } catch (error) {
        console.error('Error parsing redirect URL:', error);
      }
    }
  }, [tableNumber, redirectUrl]);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl">Bem-vindo de volta!</h1>
          <p className="text-base">
            Faça seu login ou crie sua conta para acessar o easyBar!
          </p>
          {(tableNumber || redirectUrl) && (
            <p className="text-sm text-muted-foreground">
              Mesa #{tableNumber || new URL(redirectUrl!).searchParams.get('table')}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignIn path="/sign-in" afterSignInUrl="/" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="animated-spin text-muted-foreground" />
          </ClerkLoading>
        </div>
      </div>
      <div className="h-full bg-[#5c0c44] hidden lg:flex items-center justify-center">
        <Image src="/logo.svg" height={100} width={100} alt="Logo" />
      </div>
    </div>
  );
}
