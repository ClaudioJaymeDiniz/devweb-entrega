import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import Cliente from "../../modelos/cliente";
import Dependente from "../../modelos/dependente";
import Documento from "../../modelos/documento";
import { TipoDocumento } from "../../enumeracoes/TipoDocumento";

export default class EditarDependente extends Processo {
    private clientes: Cliente[]
    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }

    processar(): void {
        console.clear()
        console.log('Iniciando a edição de um dependente...')

        let nomeTitular = this.entrada.receberTexto('Qual o nome do titular?')
        let titular = this.buscarTitular(nomeTitular)

        if (!titular) {
            console.log('Titular não encontrado!')
            return
        }

        let nomeDependente = this.entrada.receberTexto('Qual o nome do dependente que deseja editar?')
        let dependente = this.buscarDependente(titular, nomeDependente)

        if (!dependente) {
            console.log('Dependente não encontrado!')
            return
        }

        console.log('Editando os dados do dependente...')
        let novoNome = this.entrada.receberTexto(`Nome (${dependente.Nome}): `)
        if (novoNome) dependente.Nome = novoNome

        let novoNomeSocial = this.entrada.receberTexto(`Nome social (${dependente.NomeSocial}): `)
        if (novoNomeSocial) dependente.NomeSocial = novoNomeSocial

        let novaDataNascimento = this.entrada.receberData(`Data de nascimento (${dependente.DataNascimento.toLocaleDateString()}): `)
        if (novaDataNascimento) dependente.DataNascimento = novaDataNascimento

        console.log('Editando os documentos do dependente...')
        let documentos: Documento[] = []
        dependente.Documentos.forEach((documento, index) => {
            let novoNumero = this.entrada.receberTexto(`Número do Documento ${index + 1} (${documento.Numero}): `)
            let novoTipo = this.entrada.receberTexto(`Tipo do Documento ${index + 1} (${documento.Tipo}): `)
            let novaDataExpedicao = this.entrada.receberData(`Data de Expedição do Documento ${index + 1} (${documento.DataExpedicao.toLocaleDateString()}): `)
            if (novoNumero && novoTipo && novaDataExpedicao) {
                documentos.push(new Documento(novoNumero, novoTipo as TipoDocumento, novaDataExpedicao))
            } else {
                documentos.push(documento)
            }
        })
        dependente.Documentos = documentos

        console.log(`Dependente ${dependente.Nome} editado com sucesso!`)
    }

    private buscarTitular(nome: string): Cliente | undefined {
        return this.clientes.find(cliente => cliente.Nome === nome)
    }

    private buscarDependente(titular: Cliente, nome: string): Dependente | undefined {
        return titular.Dependentes.find(dependente => dependente.Nome === nome) as Dependente
    }
}