import Impressor from "../interfaces/impressor";
import Cliente from "../modelos/cliente";

export default class ImpressorDependentes implements Impressor {
    private dependentes: Cliente[]

    constructor(dependentes: Cliente[]) {
        this.dependentes = dependentes
    }

    imprimir(): string {
        let impressao = `| Dependentes:\n`
        this.dependentes.forEach(dependente => {
            impressao += `- ${dependente.Nome} ${dependente.DataNascimento.toLocaleDateString()}\n`
        })
        return impressao
    }
}