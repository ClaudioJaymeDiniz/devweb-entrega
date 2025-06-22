import Processo from "../abstracoes/processo";
import MenuTipoHospedagem from "../menus/menuTipoHospedagem";
import CadastroHospedagem from "./cadastroHospedagem";
import CheckOut from "./checkOut";
import ListagemHospedagens from "./listagemHospedagens";

export default class TipoHospedagem extends Processo {
    constructor() {
        super()
        this.menu = new MenuTipoHospedagem()
    }
    processar(): void {
        this.menu.mostrar()
        this.opcao = this.entrada.receberNumero('Qual opção desejada?')
        
        switch (this.opcao) {
            case 1:
                this.processo = new CadastroHospedagem()
                this.processo.processar()
                break
            case 2:
                this.processo = new ListagemHospedagens()
                this.processo.processar()
                break
            case 3:
                this.processo = new CheckOut()
                this.processo.processar()
                break
            default:
                console.log('Opção não entendida :(')
        }
    }
}