import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import Cliente from "../../modelos/cliente";
import Dependente from "../../modelos/dependente";

export default class DeletarDependente extends Processo {
    private clientes: Cliente[]
    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }

    processar(): void {
        console.clear()
        console.log('Iniciando a exclusão de um dependente...')

        let nomeTitular = this.entrada.receberTexto('Qual o nome do titular?')
        let titular = this.buscarTitular(nomeTitular)

        if (!titular) {
            console.log('Titular não encontrado!')
            return
        }

        let nomeDependente = this.entrada.receberTexto('Qual o nome do dependente que deseja deletar?')
        let dependente = this.buscarDependente(titular, nomeDependente)

        if (!dependente) {
            console.log('Dependente não encontrado!')
            return
        }

        // Remove o dependente da lista de dependentes do titular
        const index = titular.Dependentes.indexOf(dependente);
        if (index > -1) {
            titular.Dependentes.splice(index, 1);
            console.log(`Dependente ${dependente.Nome} deletado com sucesso!`)
        } else {
            console.log('Erro ao tentar deletar o dependente!')
        }
    }

    private buscarTitular(nome: string): Cliente | undefined {
        return this.clientes.find(cliente => cliente.Nome === nome)
    }

    private buscarDependente(titular: Cliente, nome: string): Dependente | undefined {
        return titular.Dependentes.find(dependente => dependente.Nome === nome) as Dependente
    }
}