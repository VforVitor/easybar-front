'use client'
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MenuList() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleProductClick = (id: number) => {
        router.push('/product/${id}')
    }

    const listaProdutos = [
        { id: 1, name: "Cerveja Skol", size: "1 Litro", price: "R$ 8,00", img: "/placeholder.svg?height=64&width=64", category: 'Bebida' },
        { id: 2, name: "Cerveja Bohemia", size: "1 Litro", price: "R$ 7,00", img: "/placeholder.svg?height=64&width=64", category: 'Bebida' },
        { id: 3, name: "Cerveja Brahma", size: "1 Litro", price: "R$ 7,00", img: "/placeholder.svg?height=64&width=64", category: 'Bebida'},
        { id: 4, name: "Cerveja Budweiser", size: "1 Litro", price: "R$ 8,50", img: "/placeholder.svg?height=64&width=64", category: 'Bebida'},
        {
          name: "Cachaça 51",
          size: "Dose 125ml",
          price: "R$ 4,00",
          img: "/placeholder.svg?height=64&width=64",
          category: 'Bebida'
        },
      ]

      const filteredItems = listaProdutos.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 bg-white">
      <header className="flex items-center justify-between w-full px-4 py-2 border-b">
        <div className="flex items-center gap-4">
          <SearchIcon className="text-[#5f0f40] w-6 h-6" />
          <Input 
            type="search" 
            placeholder="Busque seu produto" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} 
            className="pl-8 w-full max-w-md border rounded-md" />
        </div>
      </header>
      <main className="flex flex-col w-full gap-4 p-4">
      {searchQuery ? filteredItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-md">
          <div >
            <h2 className="text-lg font-semibold text-[#5f0f40]">
              {item.name} - {item.size}
            </h2>
            <p className="text-gray-600">{item.price}</p>
          </div>
          <img src="/placeholder.svg" alt={item.name} className="w-16 h-16" />
        </div>
        )) : null}
        {!searchQuery ? listaProdutos.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-md">
            <div onClick={() => handleProductClick(123)}>
              <h2 className="text-lg font-semibold text-[#5f0f40]">
                {item.name} - {item.size}
              </h2>
              <p className="text-gray-600">{item.price}</p>
            </div>
            <img src="/placeholder.svg" alt={item.name} className="w-16 h-16" />
          </div>
        )): null}
      </main>
    </div>
  )
}

function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
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