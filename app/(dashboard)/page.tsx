'use client'
import { getTableNumber } from "@/lib/storage";

export default function Home() {
  const tableNumber = getTableNumber();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {tableNumber && (
        <div className="mb-8 p-4 bg-rose-100 rounded-lg">
          <p className="text-rose-900 font-medium">
            Você está na Mesa #{tableNumber}
          </p>
        </div>
      )}
      <div>dashboard content</div>
    </div>
  );
}
