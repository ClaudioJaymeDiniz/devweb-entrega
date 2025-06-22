import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import Cliente from "../../modelos/cliente";
import Endereco from "../../modelos/endereco";
import Telefone from "../../modelos/telefone";
import Documento from "../../modelos/documento";
import { TipoDocumento } from "../../enumeracoes/TipoDocumento";

export default class EditarCliente extends Processo {
    private clientes: Cliente[]
    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }

    processar(): void {
        console.clear()
        console.log('Iniciando a edição de um cliente...')

        let nomeCliente = this.entrada.receberTexto('Qual o nome do cliente que deseja editar?')
        let cliente = this.buscarCliente(nomeCliente)

        if (!cliente) {
            console.log('Cliente não encontrado!')
            return
        }

        console.log('Editando os dados do cliente...')
        let novoNome = this.entrada.receberTexto(`Nome (${cliente.Nome}): `)
        if (novoNome) cliente.Nome = novoNome

        let novoNomeSocial = this.entrada.receberTexto(`Nome social (${cliente.NomeSocial}): `)
        if (novoNomeSocial) cliente.NomeSocial = novoNomeSocial

        let novaDataNascimento = this.entrada.receberData(`Data de nascimento (${cliente.DataNascimento.toLocaleDateString()}): `)
        if (novaDataNascimento) cliente.DataNascimento = novaDataNascimento

        console.log('Editando o endereço do cliente...')
        let rua = this.entrada.receberTexto(`Rua (${cliente.Endereco.Rua}): `) || cliente.Endereco.Rua
        let bairro = this.entrada.receberTexto(`Bairro (${cliente.Endereco.Bairro}): `) || cliente.Endereco.Bairro
        let cidade = this.entrada.receberTexto(`Cidade (${cliente.Endereco.Cidade}): `) || cliente.Endereco.Cidade
        let estado = this.entrada.receberTexto(`Estado (${cliente.Endereco.Estado}): `) || cliente.Endereco.Estado
        let pais = this.entrada.receberTexto(`País (${cliente.Endereco.Pais}): `) || cliente.Endereco.Pais
        let codigoPostal = this.entrada.receberTexto(`Código Postal (${cliente.Endereco.CodigoPostal}): `) || cliente.Endereco.CodigoPostal
        cliente.Endereco = new Endereco(rua, bairro, cidade, estado, pais, codigoPostal)

        console.log('Editando os telefones do cliente...')
        let telefones: Telefone[] = []
        cliente.Telefones.forEach((telefone, index) => {
            let novoTelefone = this.entrada.receberTexto(`Telefone ${index + 1} (${telefone.Ddd} ${telefone.Numero}): `)
            if (novoTelefone) {
                let [ddd, numero] = novoTelefone.split(' ')
                telefones.push(new Telefone(ddd, numero))
            } else {
                telefones.push(telefone)
            }
        })
        cliente.Telefones = telefones

        console.log('Editando os documentos do cliente...')
        let documentos: Documento[] = []
        cliente.Documentos.forEach((documento, index) => {
            let novoNumero = this.entrada.receberTexto(`Número do Documento ${index + 1} (${documento.Numero}): `)
            let novoTipo = this.entrada.receberTexto(`Tipo do Documento ${index + 1} (${documento.Tipo}): `)
            let novaDataExpedicao = this.entrada.receberData(`Data de Expedição do Documento ${index + 1} (${documento.DataExpedicao.toLocaleDateString()}): `)
            if (novoNumero && novoTipo && novaDataExpedicao) {
                documentos.push(new Documento(novoNumero, novoTipo as TipoDocumento, novaDataExpedicao))
            } else {
                documentos.push(documento)
            }
        })
        cliente.Documentos = documentos

        console.log(`Cliente ${cliente.Nome} editado com sucesso!`)
    }

    private buscarCliente(nome: string): Cliente | undefined {
        return this.clientes.find(cliente => cliente.Nome === nome)
    }
}