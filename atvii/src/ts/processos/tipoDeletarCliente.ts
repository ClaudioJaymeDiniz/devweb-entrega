import Processo from "../abstracoes/processo";
import MenuTipoAlterarCliente from "../menus/menuTipoAlterarCliente";
import DeletarCliente from "./deletar/deletarCliente";
import DeletarDependente from "./deletar/deletarDependente";


export default class TipoDeletarCliente extends Processo {
    constructor() {
        super()
        this.menu = new MenuTipoAlterarCliente()
    }
    processar(): void {
        this.menu.mostrar()
        this.opcao = this.entrada.receberNumero('Qual opção desejada?')
        
        switch (this.opcao) {
            case 1:
                this.processo = new DeletarCliente()
                this.processo.processar()
                break
            case 2:
                this.processo = new DeletarDependente()
                this.processo.processar()
                break
            default:
                console.log('Opção não entendida :(')
        }
    }
}