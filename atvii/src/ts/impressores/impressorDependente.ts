import Impressor from "../interfaces/impressor";
import Dependente from "../modelos/dependente";
import ImpressorDocumentos from "./impressorDocumentos";
import ImpressorEndereco from "./impressorEndereco";
import ImpressorTelefone from "./impressorTelefone";

export default class ImpressorDependente implements Impressor {
    private dependente: Dependente
    private impressor!: Impressor

    constructor(dependente: Dependente) {
        this.dependente = dependente
    }

    imprimir(): string {
        let impressao = `****************************\n`
            + `| Nome: ${this.dependente.Nome}\n`
            + `| Nome Social: ${this.dependente.NomeSocial}\n`
            + `| Data de nascimento: ${this.dependente.DataNascimento.toLocaleDateString()}\n`
            + `| Data de cadastro: ${this.dependente.DataCadastro.toLocaleDateString()}\n`
            + `| Titular: ${this.dependente.NomeTitular}`

        if (this.dependente.TelefonesTitular.length > 0) {
            this.impressor = new ImpressorTelefone(this.dependente.TelefonesTitular[0])
            impressao = impressao + `\n${this.impressor.imprimir()}`
        }

      
        this.impressor = new ImpressorEndereco(this.dependente.Endereco)
        impressao = impressao + `\n${this.impressor.imprimir()}`

        this.impressor = new ImpressorDocumentos(this.dependente.Documentos)
        impressao = impressao + `\n${this.impressor.imprimir()}`

        impressao = impressao + `\n****************************`
        return impressao
    }
}