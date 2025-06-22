'use client';

import { useEffect, useState } from 'react';
import { Acomodacao, Titular, Hospedagem } from '../types';
import { hospedagensApi as api, titularesApi, acomodacoesApi } from '../lib/api';

export default function Hospedagens() {
    const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);
    const [titulares, setTitulares] = useState<Titular[]>([]);
    const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([]);
    const [titularId, setTitularId] = useState('');
    const [acomodacaoId, setAcomodacaoId] = useState('');
    const [dataEntrada, setDataEntrada] = useState('');
    const [dataSaida, setDataSaida] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const [hospedagensResponse, clientesResponse, acomodacoesResponse] = await Promise.all([
            api.getAll(),
      titularesApi.getAll(),
      acomodacoesApi.getAll()
        ]);

        setHospedagens(hospedagensResponse);
        setTitulares(clientesResponse);
        setAcomodacoes(acomodacoesResponse);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            const data = {
                cliente_id: parseInt(titularId),
                acomodacao_id: parseInt(acomodacaoId),
                entrada: dataEntrada,
                saida: dataSaida
            };

            console.log('Tentando criar hospedagem:', data);
            await api.create(data);
            console.log('Hospedagem criada com sucesso');

            setTitularId('');
            setAcomodacaoId('');
            setDataEntrada('');
            setDataSaida('');

            loadData();
        } catch (error) {
            console.error('Erro ao criar hospedagem:', error);
            alert('Erro ao criar hospedagem: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Cadastro de Hospedagens</h1>

            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                <div>
                    <label className="block mb-2">Titular:</label>
                    <select
                        value={titularId}
                        onChange={(e) => setTitularId(e.target.value)}
                        className="border p-2 w-full"
                        required
                    >
                        <option value="">Selecione um titular</option>
                        {titulares.map((titular) => (
                            <option key={titular.id} value={titular.id}>
                                {titular.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2">Acomodação:</label>
                    <select
                        value={acomodacaoId}
                        onChange={(e) => setAcomodacaoId(e.target.value)}
                        className="border p-2 w-full"
                        required
                    >
                        <option value="">Selecione uma acomodação</option>
                        {acomodacoes.map((acomodacao) => (
                            <option key={acomodacao.id} value={acomodacao.id}>
                                {acomodacao.nome_acomodacao} 
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2">Data de Entrada:</label>
                    <input
                        type="date"
                        value={dataEntrada}
                        onChange={(e) => setDataEntrada(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Data de Saída:</label>
                    <input
                        type="date"
                        value={dataSaida}
                        onChange={(e) => setDataSaida(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Cadastrar Hospedagem
                </button>
            </form>

            <h2 className="text-xl font-bold mb-4">Lista de Hospedagens</h2>
            <div className="space-y-4">
                {hospedagens.map((hospedagem) => {
                    const titular = titulares.find(t => t.id === hospedagem.cliente_id);
                    const acomodacao = acomodacoes.find(a => a.id === hospedagem.acomodacao_id);

                    return (
                        <div key={hospedagem.id} className="border p-4 rounded">
                            <h3 className="font-bold">Hospedagem #{hospedagem.id}</h3>
                            <p>Titular: {titular?.nome}</p>
                            <p>Acomodação: {acomodacao?.nome_acomodacao}</p>
                            <p>Data de Entrada: {hospedagem.entrada}</p>
                            <p>Data de Saída: {hospedagem.saida}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
