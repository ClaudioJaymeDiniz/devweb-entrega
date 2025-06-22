import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Hospedagem from "../modelos/hospedagem";
import { NomeAcomadacao } from "../enumeracoes/NomeAcomadacao";

export default class CadastroHospedagem extends Processo {
    processar(): void {
        console.log('Iniciando o cadastro de uma nova hospedagem...');

        let nomeCliente = this.entrada.receberTexto('Qual o nome do cliente?');

        // Verificando se o cliente está cadastrado
        let armazem = Armazem.InstanciaUnica;
        let clienteCadastrado = armazem.Clientes.find(cliente => cliente.Nome === nomeCliente);

        if (!clienteCadastrado) {
            console.log('Cliente não cadastrado. Cadastro de hospedagem cancelado.');
            return;
        }
        console.log('acomodacoes disponiveis:');
        console.log('Solteiro Simples , Solteiro Mais, Casal Simples, Familia Simples, Familia Mais, Familia Super');
        let nomeAcomadacao = this.entrada.receberTexto('Qual o nome da acomodação?');
        let entrada = this.entrada.receberData('Qual a data de entrada?');
        let saida = this.entrada.receberData('Qual a data de saída?');

        // Convertendo o nome da acomodação para o enum NomeAcomadacao
        let acomodacaoEnum: NomeAcomadacao;
        switch (nomeAcomadacao.toLowerCase()) {
            case 'solteiro simples':
                acomodacaoEnum = NomeAcomadacao.SolteiroSimples;
                break;
            case 'solteiro mais':
                acomodacaoEnum = NomeAcomadacao.SolteiroMais;
                break;
            case 'casal simples':
                acomodacaoEnum = NomeAcomadacao.CasalSimples;
                break;
            case 'familia simples':
                acomodacaoEnum = NomeAcomadacao.FamilaSimples;
                break;
            case 'familia mais':
                acomodacaoEnum = NomeAcomadacao.FamiliaMais;
                break;
            case 'familia super':
                acomodacaoEnum = NomeAcomadacao.FamiliaSuper;
                break;

            default:
                throw new Error('Nome de acomodação inválido');
        }

        let hospedagem = new Hospedagem(nomeCliente, acomodacaoEnum, entrada, saida);
        armazem.Hospedagem.push(hospedagem);

        console.log('Finalizando o cadastro da hospedagem...');
    }
}