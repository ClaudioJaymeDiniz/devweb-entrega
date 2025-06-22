import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";

export default class CheckOut extends Processo {
    processar(): void {
        console.log('Iniciando o processo de check-out...');

        let nomeCliente = this.entrada.receberTexto('Qual o nome do cliente?');

        // Verificando se o cliente está hospedado
        let armazem = Armazem.InstanciaUnica;
        let hospedagemIndex = armazem.Hospedagem.findIndex(hospedagem => hospedagem.NomeCliente === nomeCliente);

        if (hospedagemIndex === -1) {
            console.log('Cliente não encontrado ou não está hospedado.');
            return;
        }

        // Removendo a hospedagem
        armazem.Hospedagem.splice(hospedagemIndex, 1);

        console.log('Check-out realizado com sucesso.');
    }
}