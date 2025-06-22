import Impressor from "../interfaces/impressor";
import Cliente from "../modelos/cliente";
import ImpressorDependentes from "./impressorDependentes";
import ImpressorDocumentos from "./impressorDocumentos";
import ImpressorEndereco from "./impressorEndereco";
import ImpressorTelefone from "./impressorTelefone";

export default class ImpressorCliente implements Impressor {
    private cliente: Cliente
    private impressor!: Impressor

    constructor(cliente: Cliente) {
        this.cliente = cliente
    }

    imprimir(): string {
        let impressao = `****************************\n`
            + `| Nome: ${this.cliente.Nome}\n`
            + `| Nome social: ${this.cliente.NomeSocial}\n`
            + `| Data de nascimento: ${this.cliente.DataNascimento.toLocaleDateString()}\n`
            + `| Data de cadastro: ${this.cliente.DataCadastro.toLocaleDateString()}`

        if (this.cliente.Telefones.length > 0) {
            this.impressor = new ImpressorTelefone(this.cliente.Telefones[0])
            impressao = impressao + `\n${this.impressor.imprimir()}`
        }

        this.impressor = new ImpressorEndereco(this.cliente.Endereco)
        impressao = impressao + `\n${this.impressor.imprimir()}`

        this.impressor = new ImpressorDocumentos(this.cliente.Documentos)
        impressao = impressao + `\n${this.impressor.imprimir()}`

        if (this.cliente.Dependentes.length > 0) {
            this.impressor = new ImpressorDependentes(this.cliente.Dependentes)
            impressao = impressao + `\n${this.impressor.imprimir()}`
        }

        impressao = impressao + `\n****************************`
        return impressao
    }
}