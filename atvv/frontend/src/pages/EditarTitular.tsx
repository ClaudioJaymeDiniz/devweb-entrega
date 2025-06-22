'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Titular, Documento, Endereco, Telefone, TipoDocumento } from '../types';
import { titularesApi as api } from '../lib/api';

export default function EditarTitular() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nome, setNome] = useState('');
    const [nomeSocial, setNomeSocial] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [telefones, setTelefones] = useState<Telefone[]>([]);

    const [novoDocumento, setNovoDocumento] = useState<Documento>({
        id: 0,
        tipo: TipoDocumento.CPF,
        numero: '',
        data_emissao: ''
    });

    const [novoEndereco, setNovoEndereco] = useState<Endereco>({
        id: 0,
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
    });

    const [novoTelefone, setNovoTelefone] = useState<Telefone>({
        id: 0,
        ddd: '',
        numero: ''
    });

    useEffect(() => {
        if (id) {
            carregarTitular();
        }
    }, [id]);

    async function carregarTitular() {
        try {
            const titular = await api.getById(Number(id));
            setNome(titular.nome);
            setNomeSocial(titular.nome_social || '');
            setDataNascimento(titular.data_nascimento);
            setDocumentos(titular.documentos || []);
            setEnderecos(titular.enderecos || []);
            setTelefones(titular.telefones || []);
        } catch (error) {
            console.error('Erro ao carregar titular:', error);
            alert('Erro ao carregar dados do titular');
            navigate('/titulares');
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

            // Adicionar documentos, endereços e telefones
            for (const doc of documentos) {
                if (!doc.id) {
                    await api.addDocumento(Number(id), doc);
                }
            }

            for (const end of enderecos) {
                if (!end.id) {
                    await api.addEndereco(Number(id), end);
                }
            }

            for (const tel of telefones) {
                if (!tel.id) {
                    await api.addTelefone(Number(id), tel);
                }
            }

            alert('Titular atualizado com sucesso!');
            navigate('/titulares');
        } catch (error) {
            console.error('Erro ao atualizar titular:', error);
            alert('Erro ao atualizar titular');
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

    const handleAddEndereco = () => {
        if (!novoEndereco.logradouro || !novoEndereco.numero || !novoEndereco.bairro || !novoEndereco.cidade || !novoEndereco.estado || !novoEndereco.cep) {
            alert('Por favor, preencha todos os campos obrigatórios do endereço');
            return;
        }
        setEnderecos([...enderecos, { ...novoEndereco }]);
        setNovoEndereco({
            id: 0,
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: ''
        });
    };

    const handleAddTelefone = () => {
        if (!novoTelefone.ddd || !novoTelefone.numero) {
            alert('Por favor, preencha DDD e número do telefone');
            return;
        }
        setTelefones([...telefones, { ...novoTelefone }]);
        setNovoTelefone({
            id: 0,
            ddd: '',
            numero: ''
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Editar Titular</h1>
                <button
                    onClick={() => navigate('/titulares')}
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

                {/* Endereços */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Endereços</h3>
                    <div className="space-y-2">
                        {enderecos.map((end, index) => (
                            <div key={index} className="p-3 border rounded">
                                <p>Logradouro: {end.logradouro}</p>
                                <p>Número: {end.numero}</p>
                                <p>Complemento: {end.complemento}</p>
                                <p>Bairro: {end.bairro}</p>
                                <p>Cidade: {end.cidade}</p>
                                <p>Estado: {end.estado}</p>
                                <p>CEP: {end.cep}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Logradouro"
                            value={novoEndereco.logradouro}
                            onChange={(e) => setNovoEndereco({ ...novoEndereco, logradouro: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Número"
                            value={novoEndereco.numero}
                            onChange={(e) => setNovoEndereco({ ...novoEndereco, numero: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Complemento"
                            value={novoEndereco.complemento}
                            onChange={(e) => setNovoEndereco({ ...novoEndereco, complemento: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Bairro"
                            value={novoEndereco.bairro}
                            onChange={(e) => setNovoEndereco({ ...novoEndereco, bairro: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Cidade"
                            value={novoEndereco.cidade}
                            onChange={(e) => setNovoEndereco({ ...novoEndereco, cidade: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Estado"
                            value={novoEndereco.estado}
                            onChange={(e) => setNovoEndereco({ ...novoEndereco, estado: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="CEP"
                            value={novoEndereco.cep}
                            onChange={(e) => setNovoEndereco({ ...novoEndereco, cep: e.target.value })}
                            className="border p-2 rounded"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddEndereco}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Adicionar Endereço
                    </button>
                </div>

                {/* Telefones */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Telefones</h3>
                    <div className="space-y-2">
                        {telefones.map((tel, index) => (
                            <div key={index} className="p-3 border rounded">
                                <p>DDD: {tel.ddd}</p>
                                <p>Número: {tel.numero}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="DDD"
                            value={novoTelefone.ddd}
                            onChange={(e) => setNovoTelefone({ ...novoTelefone, ddd: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Número"
                            value={novoTelefone.numero}
                            onChange={(e) => setNovoTelefone({ ...novoTelefone, numero: e.target.value })}
                            className="border p-2 rounded"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddTelefone}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Adicionar Telefone
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