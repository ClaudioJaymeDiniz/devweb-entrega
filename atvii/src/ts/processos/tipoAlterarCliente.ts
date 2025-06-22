import Processo from "../abstracoes/processo";
import MenuTipoAlterarCliente from "../menus/menuTipoAlterarCliente";
import EditarCliente from "./editar/editarCliente";
import EditarDependente from "./editar/editarDependente";

export default class TipoAlterarCliente extends Processo {
    constructor() {
        super()
        this.menu = new MenuTipoAlterarCliente()
    }
    processar(): void {
        this.menu.mostrar()
        this.opcao = this.entrada.receberNumero('Qual opção desejada?')
        
        switch (this.opcao) {
            case 1:
                this.processo = new EditarCliente()
                this.processo.processar()
                break
            case 2:
                this.processo = new EditarDependente()
                this.processo.processar()
                break
            default:
                console.log('Opção não entendida :(')
        }
    }
}