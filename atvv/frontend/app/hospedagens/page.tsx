"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Calendar, User, Building } from "lucide-react"
import { hospedagensApi, clientesApi, acomodacoesApi } from "@/lib/api"
import type { Hospedagem, Cliente, Acomodacao, CreateHospedagem } from "@/types"

export default function HospedagensPage() {
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([])
  const [filteredHospedagens, setFilteredHospedagens] = useState<Hospedagem[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHospedagem, setEditingHospedagem] = useState<Hospedagem | null>(null)
  const [formData, setFormData] = useState<CreateHospedagem>({
    cliente_id: 0,
    acomodacao_id: 0,
    entrada: "",
    saida: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const filtered = hospedagens.filter(
      (hospedagem) =>
        hospedagem.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospedagem.acomodacao?.nome_acomodacao.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredHospedagens(filtered)
  }, [hospedagens, searchTerm])

  const loadData = async () => {
    try {
      const [hospedagensData, clientesData, acomodacoesData] = await Promise.all([
        hospedagensApi.getAll(),
        clientesApi.getAll(),
        acomodacoesApi.getAll(),
      ])

      setHospedagens(hospedagensData)
      setClientes(clientesData)
      setAcomodacoes(acomodacoesData)
      setLoading(false)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingHospedagem) {
        await hospedagensApi.update(editingHospedagem.id, formData)
      } else {
        await hospedagensApi.create(formData)
      }
      loadData()
      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Erro ao salvar hospedagem:", error)
    }
  }

  const handleEdit = (hospedagem: Hospedagem) => {
    setEditingHospedagem(hospedagem)
    setFormData({
      cliente_id: hospedagem.cliente_id,
      acomodacao_id: hospedagem.acomodacao_id,
      entrada: hospedagem.entrada,
      saida: hospedagem.saida,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta hospedagem?")) {
      try {
        await hospedagensApi.delete(id)
        loadData()
      } catch (error) {
        console.error("Erro ao excluir hospedagem:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      cliente_id: 0,
      acomodacao_id: 0,
      entrada: "",
      saida: "",
    })
    setEditingHospedagem(null)
  }

  const handleNewHospedagem = () => {
    resetForm()
    setDialogOpen(true)
  }

  const getStatusHospedagem = (hospedagem: Hospedagem) => {
    const hoje = new Date()
    const entrada = new Date(hospedagem.entrada)
    const saida = new Date(hospedagem.saida)

    if (hoje < entrada) return "agendada"
    if (hoje >= entrada && hoje <= saida) return "ativa"
    return "finalizada"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendada":
        return "bg-blue-100 text-blue-800"
      case "ativa":
        return "bg-green-100 text-green-800"
      case "finalizada":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "agendada":
        return "Agendada"
      case "ativa":
        return "Ativa"
      case "finalizada":
        return "Finalizada"
      default:
        return "Desconhecido"
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospedagens</h1>
          <p className="text-gray-600">Gerencie as hospedagens do hotel</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewHospedagem}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Hospedagem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingHospedagem ? "Editar Hospedagem" : "Nova Hospedagem"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Select
                  value={formData.cliente_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, cliente_id: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes
                      .filter((c) => !c.titular_id)
                      .map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          {cliente.nome} - {cliente.cpf}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="acomodacao">Acomodação</Label>
                <Select
                  value={formData.acomodacao_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, acomodacao_id: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma acomodação" />
                  </SelectTrigger>
                  <SelectContent>
                    {acomodacoes.map((acomodacao) => (
                      <SelectItem key={acomodacao.id} value={acomodacao.id.toString()}>
                        {acomodacao.nome_acomodacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entrada">Data de Entrada</Label>
                  <Input
                    id="entrada"
                    type="date"
                    value={formData.entrada}
                    onChange={(e) => setFormData({ ...formData, entrada: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="saida">Data de Saída</Label>
                  <Input
                    id="saida"
                    type="date"
                    value={formData.saida}
                    onChange={(e) => setFormData({ ...formData, saida: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingHospedagem ? "Atualizar" : "Criar"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de Pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por cliente ou acomodação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredHospedagens.filter((h) => getStatusHospedagem(h) === "agendada").length}
                </p>
                <p className="text-sm text-gray-500">Agendadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredHospedagens.filter((h) => getStatusHospedagem(h) === "ativa").length}
                </p>
                <p className="text-sm text-gray-500">Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredHospedagens.filter((h) => getStatusHospedagem(h) === "finalizada").length}
                </p>
                <p className="text-sm text-gray-500">Finalizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{filteredHospedagens.length}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Hospedagens */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Hospedagens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHospedagens.map((hospedagem) => {
              const status = getStatusHospedagem(hospedagem)
              return (
                <div key={hospedagem.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(status)}>{getStatusLabel(status)}</Badge>
                        <span className="text-sm text-gray-500">#{hospedagem.id}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {hospedagem.cliente?.nome || `Cliente ID: ${hospedagem.cliente_id}`}
                            </p>
                            <p className="text-sm text-gray-500">{hospedagem.cliente?.cpf}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {hospedagem.acomodacao?.nome_acomodacao || `Acomodação ID: ${hospedagem.acomodacao_id}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {new Date(hospedagem.entrada).toLocaleDateString("pt-BR")} -{" "}
                              {new Date(hospedagem.saida).toLocaleDateString("pt-BR")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {Math.ceil(
                                (new Date(hospedagem.saida).getTime() - new Date(hospedagem.entrada).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )}{" "}
                              dia(s)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(hospedagem)}>
                        <Edit className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(hospedagem.id)}>
                        <Trash2 className="mr-1 h-3 w-3" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredHospedagens.length === 0 && (
              <div className="text-center py-8 text-gray-500">Nenhuma hospedagem encontrada</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
