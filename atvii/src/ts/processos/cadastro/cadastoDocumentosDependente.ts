import Processo from "../../abstracoes/processo";
import MenuTipoDocumento from "../../menus/menuTipoDocumento";
import Dependente from "../../modelos/dependente";
import CadastroCpf from "./cadastroCpf";
import CadastroPassaporte from "./cadastroPassaporte";
import CadastroRg from "./cadastroRg";

export default class CadastroDocumentosDependente extends Processo {
    private dependente: Dependente
    constructor(dependente: Dependente) {
        super()
        this.dependente = dependente
        this.menu = new MenuTipoDocumento()
        this.execucao = true
    }

    processar(): void {
        console.log('Iniciando o cadastro de documentos do dependente...')
        while (this.execucao) {
            this.menu.mostrar()
            this.opcao = this.entrada.receberNumero('Qual opção desejada?')
            switch (this.opcao) {
                case 1:
                    this.processo = new CadastroCpf(this.dependente)
                    this.processo.processar()
                    break
                case 2:
                    this.processo = new CadastroRg(this.dependente)
                    this.processo.processar()
                    break
                case 3:
                    this.processo = new CadastroPassaporte(this.dependente)
                    this.processo.processar()
                    break
                case 0:
                    this.execucao = false
                    break
                default:
                    console.log('Opção não entendida :(')
            }
        }
    }
}