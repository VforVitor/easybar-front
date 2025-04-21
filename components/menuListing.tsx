'use client'
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Product {
  _id: string;
  nome: string;
  descricao: string;
  categoria: string;
  valor: number;
  ativo: boolean;
}

interface GroupedProducts {
  [key: string]: Product[];
}

export default function MenuList() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Fetched products:', data); // Debug log
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err); // Debug log
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (product: Product) => {
        // Redirecionar para a página de visualização do produto com o ID do produto
        router.push(`/product/${product._id}`);
    }

    // Group products by category
    const groupedProducts = products.reduce((acc: GroupedProducts, product) => {
        const category = product.categoria || 'Outros';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    // Filter products based on search query
    const filteredProducts = searchQuery 
        ? products.filter(item => 
            item.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.categoria.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : products;

    // Group filtered products
    const groupedFilteredProducts = filteredProducts.reduce((acc: GroupedProducts, product) => {
        const category = product.categoria || 'Outros';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;
    }

    // Function to render product cards
    const renderProductCards = (products: Product[], category: string) => {
        return products.map((item) => (
            <div 
                key={item._id} 
                className="flex flex-col p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleProductClick(item)}
            >
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium bg-[#5f0f40] text-white px-2 py-1 rounded-full">
                        {category}
                    </span>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-[#5f0f40]">
                        {item.nome}
                    </h2>
                    <p className="text-gray-600 text-sm">{item.descricao}</p>
                    <p className="text-gray-800 font-medium mt-2">R$ {item.valor.toFixed(2)}</p>
                </div>
            </div>
        ));
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen p-4 bg-white">
            <header className="flex items-center justify-between w-full px-4 py-2 border-b">
                <div className="flex items-center gap-4">
                    <Input 
                        type="search" 
                        placeholder="Busque seu produto" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)} 
                        className="w-full max-w-md border rounded-md" />
                </div>
            </header>
            <main className="flex flex-col w-full gap-6 p-4">
                {Object.entries(searchQuery ? groupedFilteredProducts : groupedProducts).map(([category, categoryProducts]) => (
                    <div key={category} className="w-full">
                        <h2 className="text-xl font-bold text-[#5f0f40] mb-4 border-b pb-2">
                            {category}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {renderProductCards(categoryProducts, category)}
                        </div>
                    </div>
                ))}
            </main>
        </div>
    )
}