import { NomeAcomadacao } from "../enumeracoes/NomeAcomadacao"

export default class Hospedagem {
    private nomeCliente: string;
    private nomeAcomadacao: NomeAcomadacao;
    private entrada: Date;
    private saida: Date;

    constructor(nomeCliente: string, nomeAcomadacao: NomeAcomadacao, entrada: Date, saida: Date) {
        this.nomeCliente = nomeCliente;
        this.nomeAcomadacao = nomeAcomadacao;
        this.entrada = entrada;
        this.saida = saida;
    }

    public get NomeCliente() { return this.nomeCliente; }
    public get NomeAcomadacao() { return this.nomeAcomadacao; }
    public get Entrada() { return this.entrada; }
    public get Saida() { return this.saida; }
}