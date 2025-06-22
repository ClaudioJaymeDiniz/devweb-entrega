"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Edit, Trash2, Bed, Car, Snowflake, Home } from "lucide-react"
import { acomodacoesApi } from "@/lib/api"
import type { Acomodacao } from "@/types"

export default function AcomodacoesPage() {
  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([])
  const [filteredAcomodacoes, setFilteredAcomodacoes] = useState<Acomodacao[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAcomodacao, setEditingAcomodacao] = useState<Acomodacao | null>(null)
  const [formData, setFormData] = useState({
    nome_acomodacao: "",
    cama_solteiro: 0,
    cama_casal: 0,
    suite: 0,
    climatizacao: false,
    garagem: 0,
  })

  useEffect(() => {
    loadAcomodacoes()
  }, [])

  useEffect(() => {
    const filtered = acomodacoes.filter((acomodacao) =>
      acomodacao.nome_acomodacao.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredAcomodacoes(filtered)
  }, [acomodacoes, searchTerm])

  const loadAcomodacoes = async () => {
    try {
      const data = await acomodacoesApi.getAll()
      setAcomodacoes(data)
      setLoading(false)
    } catch (error) {
      console.error("Erro ao carregar acomodações:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingAcomodacao) {
        await acomodacoesApi.update(editingAcomodacao.id, formData)
      } else {
        await acomodacoesApi.create(formData)
      }
      loadAcomodacoes()
      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Erro ao salvar acomodação:", error)
    }
  }

  const handleEdit = (acomodacao: Acomodacao) => {
    setEditingAcomodacao(acomodacao)
    setFormData({
      nome_acomodacao: acomodacao.nome_acomodacao,
      cama_solteiro: acomodacao.cama_solteiro,
      cama_casal: acomodacao.cama_casal,
      suite: acomodacao.suite,
      climatizacao: acomodacao.climatizacao,
      garagem: acomodacao.garagem,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta acomodação?")) {
      try {
        await acomodacoesApi.delete(id)
        loadAcomodacoes()
      } catch (error) {
        console.error("Erro ao excluir acomodação:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nome_acomodacao: "",
      cama_solteiro: 0,
      cama_casal: 0,
      suite: 0,
      climatizacao: false,
      garagem: 0,
    })
    setEditingAcomodacao(null)
  }

  const handleNewAcomodacao = () => {
    resetForm()
    setDialogOpen(true)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Acomodações</h1>
          <p className="text-gray-600">Gerencie as acomodações do hotel</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewAcomodacao}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Acomodação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingAcomodacao ? "Editar Acomodação" : "Nova Acomodação"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Acomodação</Label>
                <Input
                  id="nome"
                  value={formData.nome_acomodacao}
                  onChange={(e) => setFormData({ ...formData, nome_acomodacao: e.target.value })}
                  placeholder="Ex: STANDARD, DELUXE, SUITE"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cama_solteiro">Camas de Solteiro</Label>
                  <Input
                    id="cama_solteiro"
                    type="number"
                    min="0"
                    value={formData.cama_solteiro}
                    onChange={(e) => setFormData({ ...formData, cama_solteiro: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="cama_casal">Camas de Casal</Label>
                  <Input
                    id="cama_casal"
                    type="number"
                    min="0"
                    value={formData.cama_casal}
                    onChange={(e) => setFormData({ ...formData, cama_casal: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="suite">Suítes</Label>
                  <Input
                    id="suite"
                    type="number"
                    min="0"
                    value={formData.suite}
                    onChange={(e) => setFormData({ ...formData, suite: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="garagem">Vagas de Garagem</Label>
                  <Input
                    id="garagem"
                    type="number"
                    min="0"
                    value={formData.garagem}
                    onChange={(e) => setFormData({ ...formData, garagem: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="climatizacao"
                  checked={formData.climatizacao}
                  onCheckedChange={(checked) => setFormData({ ...formData, climatizacao: checked as boolean })}
                />
                <Label htmlFor="climatizacao">Climatização</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingAcomodacao ? "Atualizar" : "Criar"}</Button>
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
              placeholder="Buscar acomodações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Acomodações */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAcomodacoes.map((acomodacao) => (
          <Card key={acomodacao.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{acomodacao.nome_acomodacao}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(acomodacao)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(acomodacao.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informações das Camas */}
              <div className="space-y-2">
                {acomodacao.cama_solteiro > 0 && (
                  <div className="flex items-center space-x-2">
                    <Bed className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{acomodacao.cama_solteiro} cama(s) de solteiro</span>
                  </div>
                )}
                {acomodacao.cama_casal > 0 && (
                  <div className="flex items-center space-x-2">
                    <Bed className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">{acomodacao.cama_casal} cama(s) de casal</span>
                  </div>
                )}
                {acomodacao.suite > 0 && (
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">{acomodacao.suite} suíte(s)</span>
                  </div>
                )}
              </div>

              {/* Comodidades */}
              <div className="flex flex-wrap gap-2">
                {acomodacao.climatizacao && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Snowflake className="h-3 w-3" />
                    <span>Climatizado</span>
                  </Badge>
                )}
                {acomodacao.garagem > 0 && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Car className="h-3 w-3" />
                    <span>{acomodacao.garagem} vaga(s)</span>
                  </Badge>
                )}
              </div>

              {/* Capacidade Total */}
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">
                  <strong>Capacidade:</strong>{" "}
                  {acomodacao.cama_solteiro + acomodacao.cama_casal * 2 + acomodacao.suite * 2} pessoa(s)
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAcomodacoes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhuma acomodação encontrada</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
