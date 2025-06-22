import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import Cliente from "../../modelos/cliente";
import Dependente from "../../modelos/dependente";
import CadastrarDocumentosDependente from "./cadastoDocumentosDependente";

export default class CadastroClienteDependente extends Processo {
    processar(): void {
        console.log('Iniciando o cadastro de um novo dependente...')

        let nomeTitular = this.entrada.receberTexto('Qual o nome do titular?')
        let titular = this.buscarTitular(nomeTitular)

        if (!titular) {
            console.log('Titular não encontrado!')
            return
        }

        let nome = this.entrada.receberTexto('Qual o nome do novo dependente?')
        let nomeSocial = this.entrada.receberTexto('Qual o nome social do dependente?')
        let dataNascimento = this.entrada.receberData('Qual a data de nascimento?')
        let dependente = new Dependente(nome, nomeSocial, dataNascimento, titular.Nome, titular.Endereco, titular.Telefones, titular.Telefones)

        this.processo = new CadastrarDocumentosDependente(dependente)
        this.processo.processar()

        titular.Dependentes.push(dependente)

        console.log('Finalizando o cadastro do dependente...')
    }

    private buscarTitular(nome: string): Cliente | undefined {
        let armazem = Armazem.InstanciaUnica
        return armazem.Clientes.find(cliente => cliente.Nome === nome)
    }
}