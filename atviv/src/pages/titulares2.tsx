// 'use client';

// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Titular, Documento, Endereco, Telefone, TipoDocumento } from '../types';
// import { titularesApi as api } from '../lib/api';

// export default function Titulares() {
//     const navigate = useNavigate();
//     const [titulares, setTitulares] = useState<Titular[]>([]);
//     const [nome, setNome] = useState('');
//     const [nomeSocial, setNomeSocial] = useState('');
//     const [dataNascimento, setDataNascimento] = useState('');
//     const [etapaCadastro, setEtapaCadastro] = useState(1);
//     const [titularAtual, setTitularAtual] = useState<Titular | null>(null);

//     useEffect(() => {
//         loadTitulares();
//     }, []);

//     async function loadTitulares() {
//         try {
//             const response = await api.getAll();
//             if (Array.isArray(response)) {
//                 setTitulares(response);
//             } else {
//                 console.error('Resposta da API não é um array:', response);
//                 setTitulares([]);
//             }
//         } catch (error) {
//             console.error('Erro ao carregar titulares:', error);
//             setTitulares([]);
//             alert('Erro ao carregar a lista de titulares. Por favor, tente novamente.');
//         }
//     }

//     async function handleSubmitDadosBasicos(e: React.FormEvent) {
//         e.preventDefault();

//         if (!nome) {
//             alert('Por favor, preencha o nome do titular.');
//             return;
//         }

//         if (!dataNascimento) {
//             alert('Por favor, selecione a data de nascimento.');
//             return;
//         }

//         try {
//             const dataFormatada = new Date(dataNascimento).toISOString().split('T')[0];
//             const titularData = {
//                 nome,
//                 nome_social: nomeSocial,
//                 data_nascimento: dataFormatada,
//                 enderecos: [],
//                 telefones: [],
//                 documentos: [],
//                 dependentes: []
//             };
//             const novoTitular = await api.create(titularData);
//             setTitularAtual(novoTitular);
//             setEtapaCadastro(2);
//             alert('Dados básicos salvos com sucesso! Continue o cadastro.');
//         } catch (error) {
//             console.error('Erro ao processar titular:', error);
//             let errorMessage = 'Erro ao processar titular. ';
//             if (error instanceof Error) {
//                 errorMessage += error.message;
//             } else {
//                 errorMessage += 'Verifique se todos os campos obrigatórios foram preenchidos.';
//             }
//             alert(errorMessage);
//         }
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-2xl font-bold mb-6">
//                 {etapaCadastro === 1 ? 'Cadastro de Titular - Dados Básicos' : 'Cadastro de Titular - Informações Adicionais'}
//             </h1>

//             {etapaCadastro === 1 ? (
//                 <form onSubmit={handleSubmitDadosBasicos} className="space-y-6">
//                     <div className="grid md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block mb-1 font-medium">Nome:</label>
//                             <input
//                                 type="text"
//                                 value={nome}
//                                 onChange={(e) => setNome(e.target.value)}
//                                 className="border p-2 rounded w-full"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-1 font-medium">Nome Social:</label>
//                             <input
//                                 type="text"
//                                 value={nomeSocial}
//                                 onChange={(e) => setNomeSocial(e.target.value)}
//                                 className="border p-2 rounded w-full"
//                             />
//                         </div>
//                         <div className="md:col-span-2">
//                             <label className="block mb-1 font-medium">Data de Nascimento:</label>
//                             <input
//                                 type="date"
//                                 value={dataNascimento}
//                                 onChange={(e) => setDataNascimento(e.target.value)}
//                                 className="border p-2 rounded w-full"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     <button
//                         type="submit"
//                         className="bg-blue-500 text-white px-6 py-3 rounded text-lg mt-6"
//                     >
//                         Próximo
//                     </button>
//                 </form>
//             ) : (
//                 <div>
//                     <p className="mb-4">ID do Titular: {titularAtual?.id}</p>
//                     <button
//                         onClick={() => navigate(`/editar-titular/${titularAtual?.id}`)}
//                         className="bg-green-500 text-white px-6 py-3 rounded text-lg"
//                     >
//                         Continuar Cadastro
//                     </button>
//                 </div>
//             )}

//             {/* Lista de Titulares */}
//             <h2 className="text-xl font-bold mb-4 mt-12">Lista de Titulares</h2>
//             <div className="space-y-4">
//                 {titulares && titulares.length > 0 ? titulares.map((titular) => (
//                     <div key={titular.id} className="border p-4 rounded">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <h3 className="font-bold">{titular.nome}</h3>
//                                 {titular.nome_social && <p>Nome Social: {titular.nome_social}</p>}
//                                 <p>Data de Nascimento: {titular.data_nascimento}</p>
//                             </div>
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => navigate(`/editar-titular/${titular.id}`)}
//                                     className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                                 >
//                                     Editar
//                                 </button>
//                                 <button
//                                     onClick={async () => {
//                                         if (window.confirm('Tem certeza que deseja excluir este titular?')) {
//                                             try {
//                                                 await api.delete(titular.id);
//                                                 loadTitulares();
//                                             } catch (error) {
//                                                 console.error('Erro ao excluir titular:', error);
//                                                 alert('Erro ao excluir titular');
//                                             }
//                                         }
//                                     }}
//                                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                                 >
//                                     Excluir
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )) : (
//                     <p className="text-gray-500 italic">Nenhum titular cadastrado.</p>
//                 )}
//             </div>
//         </div>
//     );
// }
