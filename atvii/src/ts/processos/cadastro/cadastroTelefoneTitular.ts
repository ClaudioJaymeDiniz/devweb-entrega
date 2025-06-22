import Processo from "../../abstracoes/processo";
import Cliente from "../../modelos/cliente";
import Telefone from "../../modelos/telefone";

export default class CadastroTelefoneTitular extends Processo {
    private cliente: Cliente

    constructor(cliente: Cliente) {
        super()
        this.cliente = cliente
    }

    processar(): void {
        console.log('Coletando os dados do telefone...')
        let ddd = this.entrada.receberTexto('Qual o DDD?')
        let numero = this.entrada.receberTexto('Qual o numero?')
        let telefone = new Telefone(ddd,numero)
        
        this.cliente.Telefones.push(telefone)
    }

}