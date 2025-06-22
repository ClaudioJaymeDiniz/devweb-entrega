import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import ImpressorDependente from "../../impressores/impressorDependente";
import Impressor from "../../interfaces/impressor";
import Cliente from "../../modelos/cliente";
import Dependente from "../../modelos/dependente";

export default class ListagemDependentes extends Processo {
    private clientes: Cliente[]
    private impressor!: Impressor
    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }
    processar(): void {
        console.clear()
        console.log('Iniciando a listagem dos dependentes...')
        this.clientes.forEach(cliente => {
            if (cliente.Dependentes.length > 0) {
                cliente.Dependentes.forEach(dependente => {
                    if (dependente instanceof Dependente) {
                        this.impressor = new ImpressorDependente(dependente)
                        console.log(this.impressor.imprimir())
                    } else {
                        console.log('Dependente não é uma instância de Dependente')
                    }
                })
            }
        })
    }
}