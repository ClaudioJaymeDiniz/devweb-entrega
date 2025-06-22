import Impressor from "../interfaces/impressor";
import Hospedagem from "../modelos/hospedagem";

export default class ImpressorHospedagem implements Impressor {
    private hospedagem: Hospedagem;

    constructor(hospedagem: Hospedagem) {
        this.hospedagem = hospedagem;
    }

    imprimir(): string {
        let descricao = `Nome do Cliente: ${this.hospedagem.NomeCliente}\n`
            + `Nome da Acomodação: ${this.hospedagem.NomeAcomadacao.toString()}\n`
            + `Data de Entrada: ${this.hospedagem.Entrada.toLocaleDateString()}\n`
            + `Data de Saída: ${this.hospedagem.Saida.toLocaleDateString()}\n`;
        return descricao;
    }
}