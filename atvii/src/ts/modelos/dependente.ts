import Cliente from "./cliente";
import Documento from "./documento";
import Endereco from "./endereco";
import Telefone from "./telefone";

export default class Dependente extends Cliente {
    private nomeTitular: string;
    private telefonesTitular: Telefone[];

    constructor(nome: string, nomeSocial: string, dataNascimento: Date, nomeTitular: string, endereco: Endereco, telefones: Telefone[], telefonesTitular: Telefone[]) {
        super(nome, nomeSocial, dataNascimento);
        this.nomeTitular = nomeTitular;
        this.Endereco = endereco;
        this.Telefones.push(...telefones);
        this.telefonesTitular = telefonesTitular;
    }

    public get NomeTitular() { return this.nomeTitular }
    public get TelefonesTitular() { return this.telefonesTitular }
}