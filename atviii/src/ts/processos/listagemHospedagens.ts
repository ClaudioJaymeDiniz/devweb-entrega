import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import ImpressorHospedagem from "../impressores/impressorHospedagem";

export default class ListagemHospedagens extends Processo {
    processar(): void {
        console.log('Listando todas as hospedagens...');

        let armazem = Armazem.InstanciaUnica;
        let hospedagens = armazem.Hospedagem;

        if (hospedagens.length === 0) {
            console.log('Nenhuma hospedagem encontrada.');
            return;
        }

        hospedagens.forEach(hospedagem => {
            let impressor = new ImpressorHospedagem(hospedagem);
            console.log(impressor.imprimir());
        });

        console.log('Fim da listagem de hospedagens.');
    }
}