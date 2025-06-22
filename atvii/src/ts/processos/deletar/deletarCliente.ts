import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import Cliente from "../../modelos/cliente";

export default class DeletarCliente extends Processo {
    private clientes: Cliente[]
    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }

    processar(): void {
        console.clear()
        console.log('Iniciando a exclusão de um cliente...')

        let nomeCliente = this.entrada.receberTexto('Qual o nome do cliente que deseja deletar?')
        let cliente = this.buscarCliente(nomeCliente)

        if (!cliente) {
            console.log('Cliente não encontrado!')
            return
        }

        // Remove o cliente da lista de clientes no Armazem
        const index = this.clientes.indexOf(cliente);
        if (index > -1) {
            this.clientes.splice(index, 1);
            console.log(`Cliente ${cliente.Nome} deletado com sucesso!`)
        } else {
            console.log('Erro ao tentar deletar o cliente!')
        }
    }

    private buscarCliente(nome: string): Cliente | undefined {
        return this.clientes.find(cliente => cliente.Nome === nome)
    }
}