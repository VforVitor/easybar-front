import { useRouter } from "next/navigation"

export default function ProductDetails() {
    
    return (
      <div className="flex flex-col items-center p-4 bg-white min-h-screen">
        <header className="flex items-center justify-between w-full px-4 py-2 border-b">
          <ArrowLeftIcon className="w-6 h-6" />
          <MartiniIcon className="w-6 h-6 text-[#5f0f40]" />
        </header>
        <main className="flex flex-col items-center w-full mt-4">
          <img
            src="/placeholder.svg"
            alt="Cerveja Brahma"
            className="w-40 h-80 object-cover"
            width="150"
            height="300"
            style={{ aspectRatio: "150/300", objectFit: "cover" }}
          />
          <div className="flex items-center justify-between w-full mt-4 px-4">
            <div>
              <h2 className="text-lg font-semibold">Cerveja Skol - 1 Litro</h2>
              <p className="text-gray-600">R$ 8,50</p>
            </div>
            <div className="flex items-center">
              <button className="px-2 py-1 text-lg font-semibold text-gray-700 border rounded">-</button>
              <span className="px-4 py-1 text-lg font-semibold text-gray-700 border-t border-b">1</span>
              <button className="px-2 py-1 text-lg font-semibold text-gray-700 border rounded">+</button>
            </div>
          </div>
        </main>
        <footer className="w-full px-4 mt-6">
          <button className="w-full px-4 py-2 text-white bg-[#5f0f40] rounded">Order Product</button>
        </footer>
      </div>
    )
  }
  
  function ArrowLeftIcon(props: any) {
    const router = useRouter();

    const handleClickBack = () => {
        router.push('/menu');
    }

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
        onClick={() => handleClickBack()}
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
    )
  }
  
  
  function MartiniIcon(props: any) {
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
        <path d="M8 22h8" />
        <path d="M12 11v11" />
        <path d="m19 3-7 8-7-8Z" />
      </svg>
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