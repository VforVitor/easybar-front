'use client'
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"

interface Product {
  _id: string;
  nome: string;
  descricao: string;
  categoria: string;
  valor: number;
  ativo: boolean;
}

// Mapeamento de categorias para imagens
const categoryImages: Record<string, string> = {
  'cervejas': '/cerveja.png',
  'cerveja': '/cerveja.png',
  'doses': '/dose.png',
  'dose': '/dose.png',
  'drinks': '/drinks.png',
  'drink': '/drinks.png',
  'sem álcool': '/sem_alcool.png',
  'sem alcool': '/sem_alcool.png',
  'petiscos': '/petisco.png',
  'petisco': '/petisco.png'
};

export default function ProductDetails() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch product: ${response.status}`);
                }
                
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        setQuantity(prev => prev > 1 ? prev - 1 : 1);
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (error || !product) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">
            Error: {error || 'Product not found'}
        </div>;
    }
    
    // Obter a imagem com base na categoria do produto
    const productImage = categoryImages[product.categoria.toLowerCase().trim()] || '/dose.png';
    
    return (
      <div className="flex flex-col items-center p-4 bg-white min-h-screen">
        <header className="flex items-center justify-between w-full px-4 py-2 border-b">
          <ArrowLeftIcon className="w-6 h-6" />
          <MartiniIcon className="w-6 h-6 text-[#5f0f40]" />
        </header>
        <main className="flex flex-col items-center w-full mt-4">
          <div className="relative w-40 h-80">
            <Image
              src={productImage}
              alt={product.nome}
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center justify-between w-full mt-4 px-4">
            <div>
              <h2 className="text-lg font-semibold">{product.nome}</h2>
              <p className="text-gray-600">R$ {product.valor.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-2">{product.descricao}</p>
            </div>
            <div className="flex items-center">
              <button 
                onClick={handleDecrement}
                className="px-2 py-1 text-lg font-semibold text-gray-700 border rounded"
              >
                -
              </button>
              <span className="px-4 py-1 text-lg font-semibold text-gray-700 border-t border-b">
                {quantity}
              </span>
              <button 
                onClick={handleIncrement}
                className="px-2 py-1 text-lg font-semibold text-gray-700 border rounded"
              >
                +
              </button>
            </div>
          </div>
        </main>
        <footer className="w-full px-4 mt-6">
          <button className="w-full px-4 py-2 text-white bg-[#5f0f40] rounded">
            Adicionar ao Pedido - R$ {(product.valor * quantity).toFixed(2)}
          </button>
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