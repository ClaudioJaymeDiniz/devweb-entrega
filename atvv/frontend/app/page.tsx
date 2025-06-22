"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building, Calendar, CheckCircle, XCircle, Clock } from "lucide-react"
import { clientesApi, acomodacoesApi, hospedagensApi } from "@/lib/api"
import type { Acomodacao, Hospedagem } from "@/types"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalAcomodacoes: 0,
    hospedagensAtivas: 0,
    checkoutsHoje: 0,
  })
  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([])
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([])
  const [checkoutsHoje, setCheckoutsHoje] = useState<Hospedagem[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [clientes, acomodacoesData, hospedagensData] = await Promise.all([
        clientesApi.getAll(),
        acomodacoesApi.getAll(),
        hospedagensApi.getAll(),
      ])

      const hoje = new Date().toISOString().split("T")[0]
      const hospedagensAtivas = hospedagensData.filter(
        (h) => new Date(h.entrada) <= new Date(hoje) && new Date(h.saida) >= new Date(hoje),
      )
      const checkouts = hospedagensData.filter((h) => h.saida === hoje)

      setStats({
        totalClientes: clientes.length,
        totalAcomodacoes: acomodacoesData.length,
        hospedagensAtivas: hospedagensAtivas.length,
        checkoutsHoje: checkouts.length,
      })

      setAcomodacoes(acomodacoesData)
      setHospedagens(hospedagensData)
      setCheckoutsHoje(checkouts)
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    }
  }

  const getAcomodacaoStatus = (acomodacao: Acomodacao) => {
    const hoje = new Date().toISOString().split("T")[0]
    const hospedagemAtiva = hospedagens.find(
      (h) =>
        h.acomodacao_id === acomodacao.id &&
        new Date(h.entrada) <= new Date(hoje) &&
        new Date(h.saida) >= new Date(hoje),
    )
    return hospedagemAtiva ? "ocupada" : "disponivel"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de hospedagem</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClientes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acomodações</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAcomodacoes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospedagens Ativas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hospedagensAtivas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checkouts Hoje</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkoutsHoje}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status das Acomodações */}
        <Card>
          <CardHeader>
            <CardTitle>Status das Acomodações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {acomodacoes.map((acomodacao) => {
                const status = getAcomodacaoStatus(acomodacao)
                return (
                  <div key={acomodacao.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{acomodacao.nome_acomodacao}</p>
                      <p className="text-sm text-gray-500">
                        {acomodacao.cama_casal > 0 && `${acomodacao.cama_casal} cama casal`}
                        {acomodacao.cama_solteiro > 0 && ` ${acomodacao.cama_solteiro} cama solteiro`}
                        {acomodacao.suite > 0 && ` ${acomodacao.suite} suíte`}
                      </p>
                    </div>
                    <Badge
                      variant={status === "ocupada" ? "destructive" : "default"}
                      className={status === "ocupada" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                    >
                      {status === "ocupada" ? (
                        <>
                          <XCircle className="mr-1 h-3 w-3" />
                          Ocupada
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Disponível
                        </>
                      )}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Checkouts de Hoje */}
        <Card>
          <CardHeader>
            <CardTitle>Checkouts de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            {checkoutsHoje.length === 0 ? (
              <p className="text-gray-500">Nenhum checkout programado para hoje</p>
            ) : (
              <div className="space-y-3">
                {checkoutsHoje.map((hospedagem) => (
                  <div key={hospedagem.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">
                        {hospedagem.cliente?.nome || `Cliente ID: ${hospedagem.cliente_id}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {hospedagem.acomodacao?.nome_acomodacao || `Acomodação ID: ${hospedagem.acomodacao_id}`}
                      </p>
                    </div>
                    <Badge variant="outline">
                      <Clock className="mr-1 h-3 w-3" />
                      Checkout
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Ocupação */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Ocupação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {acomodacoes.filter((a) => getAcomodacaoStatus(a) === "disponivel").length}
              </div>
              <p className="text-sm text-gray-500">Disponíveis</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {acomodacoes.filter((a) => getAcomodacaoStatus(a) === "ocupada").length}
              </div>
              <p className="text-sm text-gray-500">Ocupadas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {acomodacoes.length > 0
                  ? Math.round(
                      (acomodacoes.filter((a) => getAcomodacaoStatus(a) === "ocupada").length / acomodacoes.length) *
                        100,
                    )
                  : 0}
                %
              </div>
              <p className="text-sm text-gray-500">Taxa de Ocupação</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
