'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Documento, TipoDocumento } from '../types';
import { dependentesApi as api } from '../lib/api';

export default function EditarDependente() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nome, setNome] = useState('');
    const [nomeSocial, setNomeSocial] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [documentos, setDocumentos] = useState<Documento[]>([]);

    const [novoDocumento, setNovoDocumento] = useState<Documento>({
        id: 0,
        tipo: TipoDocumento.CPF,
        numero: '',
        data_emissao: ''
    });

    useEffect(() => {
        if (id) {
            carregarDependente();
        }
    }, [id]);

    async function carregarDependente() {
        try {
            const dependente = await api.getById(Number(id));
            setNome(dependente.nome);
            setNomeSocial(dependente.nome_social || '');
            setDataNascimento(dependente.data_nascimento);
            setDocumentos(dependente.documentos || []);
        } catch (error) {
            console.error('Erro ao carregar dependente:', error);
            alert('Erro ao carregar dados do dependente');
            navigate('/dependentes');
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !dataNascimento) {
            alert('Por favor, preencha nome e data de nascimento');
            return;
        }

        try {
            await api.update(Number(id), {
                nome,
                nome_social: nomeSocial,
                data_nascimento: dataNascimento
            });

            // Adicionar documentos
            for (const doc of documentos) {
                if (!doc.id) {
                    await api.addDocumento(Number(id), doc);
                }
            }

            alert('Dependente atualizado com sucesso!');
            navigate('/dependentes');
        } catch (error) {
            console.error('Erro ao atualizar dependente:', error);
            alert('Erro ao atualizar dependente');
        }
    };

    const handleAddDocumento = () => {
        if (!novoDocumento.numero || !novoDocumento.data_emissao) {
            alert('Por favor, preencha todos os campos do documento');
            return;
        }
        setDocumentos([...documentos, { ...novoDocumento }]);
        setNovoDocumento({
            id: 0,
            tipo: TipoDocumento.CPF,
            numero: '',
            data_emissao: ''
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Editar Dependente</h1>
                <button
                    onClick={() => navigate('/dependentes')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Voltar
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados Básicos */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome Social</label>
                        <input
                            type="text"
                            value={nomeSocial}
                            onChange={(e) => setNomeSocial(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                        <input
                            type="date"
                            value={dataNascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Documentos */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Documentos</h3>
                    <div className="space-y-2">
                        {documentos.map((doc, index) => (
                            <div key={index} className="p-3 border rounded">
                                <p>Tipo: {doc.tipo}</p>
                                <p>Número: {doc.numero}</p>
                                <p>Data de Emissão: {doc.data_emissao}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <select
                            value={novoDocumento.tipo}
                            onChange={(e) => setNovoDocumento({ ...novoDocumento, tipo: e.target.value as TipoDocumento })}
                            className="border p-2 rounded"
                        >
                            {Object.values(TipoDocumento).map((tipo) => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Número"
                            value={novoDocumento.numero}
                            onChange={(e) => setNovoDocumento({ ...novoDocumento, numero: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="date"
                            value={novoDocumento.data_emissao}
                            onChange={(e) => setNovoDocumento({ ...novoDocumento, data_emissao: e.target.value })}
                            className="border p-2 rounded"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddDocumento}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Adicionar Documento
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}