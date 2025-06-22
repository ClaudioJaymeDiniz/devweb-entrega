"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, User, Users } from "lucide-react"
import { clientesApi } from "@/lib/api"
import type { Cliente } from "@/types"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClientes()
  }, [])

  useEffect(() => {
    const filtered = clientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cpf.includes(searchTerm) ||
        (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredClientes(filtered)
  }, [clientes, searchTerm])

  const loadClientes = async () => {
    try {
      const data = await clientesApi.getAll()
      setClientes(data)
      setLoading(false)
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await clientesApi.delete(id)
        loadClientes()
      } catch (error) {
        console.error("Erro ao excluir cliente:", error)
      }
    }
  }

  const titulares = filteredClientes.filter((c) => !c.titular_id)
  const dependentes = filteredClientes.filter((c) => c.titular_id)

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie clientes titulares e dependentes</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nome, CPF ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{titulares.length}</p>
                <p className="text-sm text-gray-500">Titulares</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{dependentes.length}</p>
                <p className="text-sm text-gray-500">Dependentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{clientes.length}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes Titulares */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes Titulares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {titulares.map((cliente) => {
              const clienteDependentes = dependentes.filter((d) => d.titular_id === cliente.id)
              return (
                <div key={cliente.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                        <Badge variant="outline">Titular</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>CPF:</strong> {cliente.cpf}
                        </p>
                        {cliente.email && (
                          <p>
                            <strong>Email:</strong> {cliente.email}
                          </p>
                        )}
                        {cliente.data_nascimento && (
                          <p>
                            <strong>Data de Nascimento:</strong>{" "}
                            {new Date(cliente.data_nascimento).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>

                      {/* Dependentes */}
                      {clienteDependentes.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Dependentes ({clienteDependentes.length}):
                          </p>
                          <div className="space-y-1">
                            {clienteDependentes.map((dependente) => (
                              <div
                                key={dependente.id}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded"
                              >
                                <span className="text-sm">{dependente.nome}</span>
                                <div className="flex space-x-1">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDelete(dependente.id)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(cliente.id)}>
                        <Trash2 className="mr-1 h-3 w-3" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {titulares.length === 0 && <div className="text-center py-8 text-gray-500">Nenhum cliente encontrado</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
