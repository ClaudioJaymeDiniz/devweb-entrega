import Menu from "../interfaces/menu";

export default class MenuTipoHospedagem implements Menu {
    mostrar(): void {
        console.clear()
        console.log(`****************************`)
        console.log(`| Qual o tipo do cliente para cadastro? `)
        console.log(`----------------------`)
        console.log(`| 1 - Cadastrar Hospedagem`)
        console.log(`| 2 - Listar Hospedagens`)
        console.log(`| 3 - Check-out`)
        console.log(`----------------------`)
    }
}