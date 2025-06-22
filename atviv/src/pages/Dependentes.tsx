'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Titular, Dependente } from '../types';
import { titularesApi, dependentesApi as api } from '../lib/api';

export default function Dependentes() {
    const navigate = useNavigate();
    const [titulares, setTitulares] = useState<Titular[]>([]);
    const [dependentes, setDependentes] = useState<Dependente[]>([]);
    const [nome, setNome] = useState('');
    const [nomeSocial, setNomeSocial] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [titularId, setTitularId] = useState('');
    const [etapaCadastro, setEtapaCadastro] = useState(1);
    const [dependenteAtual, setDependenteAtual] = useState<Dependente | null>(null);

    useEffect(() => {
        loadTitulares();
        loadDependentes();
    }, []);

    async function loadTitulares() {
        try {
            const response = await titularesApi.getAll();
            if (Array.isArray(response)) {
                setTitulares(response);
            } else {
                console.error('Resposta da API não é um array:', response);
                setTitulares([]);
            }
        } catch (error) {
            console.error('Erro ao carregar titulares:', error);
            setTitulares([]);
            alert('Erro ao carregar a lista de titulares. Por favor, tente novamente.');
        }
    }

    async function loadDependentes() {
        try {
            const response = await api.getAll();
            if (Array.isArray(response)) {
                setDependentes(response);
            } else {
                console.error('Resposta da API não é um array:', response);
                setDependentes([]);
            }
        } catch (error) {
            console.error('Erro ao carregar dependentes:', error);
            setDependentes([]);
            alert('Erro ao carregar a lista de dependentes. Por favor, tente novamente.');
        }
    }

    async function handleSubmitDadosBasicos(e: React.FormEvent) {
        e.preventDefault();

        if (!nome) {
            alert('Por favor, preencha o nome do dependente.');
            return;
        }

        if (!dataNascimento) {
            alert('Por favor, selecione a data de nascimento.');
            return;
        }

        if (!titularId) {
            alert('Por favor, selecione um titular.');
            return;
        }

        try {
            const dataFormatada = new Date(dataNascimento).toISOString().split('T')[0];
            const dependenteData = {
                nome,
                nome_social: nomeSocial,
                data_nascimento: dataFormatada,
                titular_id: parseInt(titularId),
                documentos: []
            };
            const novoDependente = await api.create(dependenteData);
            setDependenteAtual(novoDependente);
            setEtapaCadastro(2);
            alert('Dados básicos salvos com sucesso! Continue o cadastro.');
        } catch (error) {
            console.error('Erro ao processar dependente:', error);
            let errorMessage = 'Erro ao processar dependente. ';
            if (error instanceof Error) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Verifique se todos os campos obrigatórios foram preenchidos.';
            }
            alert(errorMessage);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">
                {etapaCadastro === 1 ? 'Cadastro de Dependente - Dados Básicos' : 'Cadastro de Dependente - Informações Adicionais'}
            </h1>

            {etapaCadastro === 1 ? (
                <form onSubmit={handleSubmitDadosBasicos} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Nome:</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="border p-2 rounded w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Nome Social:</label>
                            <input
                                type="text"
                                value={nomeSocial}
                                onChange={(e) => setNomeSocial(e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Data de Nascimento:</label>
                            <input
                                type="date"
                                value={dataNascimento}
                                onChange={(e) => setDataNascimento(e.target.value)}
                                className="border p-2 rounded w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Titular:</label>
                            <select
                                value={titularId}
                                onChange={(e) => setTitularId(e.target.value)}
                                className="border p-2 rounded w-full"
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
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Próximo
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="bg-gray-100 p-4 rounded">
                        <p>ID do Dependente: {dependenteAtual?.id}</p>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => navigate(`/editar-dependente/${dependenteAtual?.id}`)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Continuar Cadastro
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Lista de Dependentes</h2>
                <div className="grid gap-4">
                    {dependentes.map((dependente) => (
                        <div key={dependente.id} className="border p-4 rounded">
                            <h3 className="font-bold">{dependente.nome}</h3>
                            {dependente.nome_social && (
                                <p className="text-gray-600">Nome Social: {dependente.nome_social}</p>
                            )}
                            <p className="text-gray-600">
                                Data de Nascimento: {new Date(dependente.data_nascimento).toLocaleDateString()}
                            </p>
                            <div className="mt-2 space-x-2">
                                <button
                                    onClick={() => navigate(`/editar-dependente/${dependente.id}`)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={async () => {
                                        if (window.confirm('Tem certeza que deseja excluir este dependente?')) {
                                            try {
                                                await api.delete(dependente.id);
                                                loadDependentes();
                                                alert('Dependente excluído com sucesso!');
                                            } catch (error) {
                                                console.error('Erro ao excluir dependente:', error);
                                                alert('Erro ao excluir dependente. Por favor, tente novamente.');
                                            }
                                        }
                                    }}
                                    className="text-red-500 hover:underline"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}