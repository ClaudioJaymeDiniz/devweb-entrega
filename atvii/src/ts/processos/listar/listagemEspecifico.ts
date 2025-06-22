import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import ImpressorDependente from "../../impressores/impressorDependente";
import Impressor from "../../interfaces/impressor";
import Cliente from "../../modelos/cliente";
import Dependente from "../../modelos/dependente";

export default class ListagemEspecifico extends Processo {
    private clientes: Cliente[]
    private impressor!: Impressor
    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }
    processar(): void {
        console.clear()
        console.log('Iniciando a listagem dos dependentes de um titular específico...')
        
        let nomeTitular = this.entrada.receberTexto('Qual o nome do titular?')
        let titular = this.buscarTitular(nomeTitular)

        if (!titular) {
            console.log('Titular não encontrado!')
            return
        }

        if (titular.Dependentes.length > 0) {
            titular.Dependentes.forEach(dependente => {
                if (dependente instanceof Dependente) {
                    this.impressor = new ImpressorDependente(dependente)
                    console.log(this.impressor.imprimir())
                } else {
                    console.log('Dependente não é uma instância de Dependente')
                }
            })
        } else {
            console.log('O titular não possui dependentes.')
        }
    }

    private buscarTitular(nome: string): Cliente | undefined {
        return this.clientes.find(cliente => cliente.Nome === nome)
    }
}