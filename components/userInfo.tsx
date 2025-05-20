'use client'
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserInfo {
  _id: string;
  clerkId: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  ativo: boolean;
}

export default function UserInfo() {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    tipo: ''
  });
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setAllUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        setUserInfo(data);
        setFormData({
          nome: data.nome,
          telefone: data.telefone,
          tipo: data.tipo
        });
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // First update the user type
      const tipoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${user.id}/tipo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ tipo: formData.tipo }),
      });

      if (!tipoResponse.ok) {
        throw new Error('Failed to update user type');
      }

      // Then update other user information
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          nome: formData.nome,
          telefone: formData.telefone
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user info');
      }

      const updatedData = await response.json();
      setUserInfo(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating user info:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUserTypeChange = async (clerkId: string, newType: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${clerkId}/tipo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ tipo: newType }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user type');
      }

      // Update the users list to reflect the change
      setAllUsers(prev => prev.map(user => 
        user.clerkId === clerkId ? { ...user, tipo: newType } : user
      ));
    } catch (err) {
      console.error('Error updating user type:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="user-info" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 bg-[#5f0f40] text-white hover:bg-[#4a0c32] transition-colors">
              <span className="text-lg font-semibold">Informações do Usuário</span>
            </AccordionTrigger>
            <AccordionContent className="bg-white p-4">
              <div className="flex items-center justify-center p-4">
                <span className="text-gray-500">Carregando informações...</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="user-info" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 bg-[#5f0f40] text-white hover:bg-[#4a0c32] transition-colors">
              <span className="text-lg font-semibold">Informações do Usuário</span>
            </AccordionTrigger>
            <AccordionContent className="bg-white p-4">
              <div className="flex items-center justify-center p-4">
                <span className="text-red-500">Erro: {error}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="user-info" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 bg-[#5f0f40] text-white hover:bg-[#4a0c32] transition-colors">
            <span className="text-lg font-semibold">Informações do Usuário</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white p-4">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Input
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-[#5f0f40] hover:bg-[#4a0c32]">
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                  <p className="text-lg">{userInfo?.nome}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-lg">{userInfo?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                  <p className="text-lg">{userInfo?.telefone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                  <p className="text-lg">{userInfo?.tipo}</p>
                </div>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#5f0f40] hover:bg-[#4a0c32]"
                >
                  Editar Informações
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="all-users" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 bg-[#5f0f40] text-white hover:bg-[#4a0c32] transition-colors">
            <span className="text-lg font-semibold">Todos os Usuários</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white p-4">
            {isLoadingUsers ? (
              <div className="flex items-center justify-center p-4">
                <span className="text-gray-500">Carregando usuários...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-4">
                <span className="text-red-500">Erro: {error}</span>
              </div>
            ) : (
              <div className="space-y-4">
                {allUsers.map((user) => (
                  <div key={user.clerkId} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{user.nome}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm text-gray-500">Telefone: {user.telefone}</p>
                      </div>
                      <Select
                        value={user.tipo}
                        onValueChange={(value) => handleUserTypeChange(user.clerkId, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cliente">Cliente</SelectItem>
                          <SelectItem value="garcom">Garçom</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 