import Cliente from "../modelos/cliente";
import Endereco from "../modelos/endereco";
import Telefone from "../modelos/telefone";

let cliente = new Cliente();
cliente.nome = `Pedro de Alcântara João Carlos Leopoldo Salvador`;
cliente.nomeSocial = `Dom Pedro II`;
cliente.dataCadastro = new Date(1840, 6, 23);
cliente.dataNascimento = new Date(1825, 11, 2);
cliente.dependentes = []; // Inicializar dependentes como uma lista vazia

let endereco = new Endereco();
endereco.rua = `R. do Catete`;
endereco.bairro = `Copacabana`;
endereco.cidade = `Rio de Janeiro`;
endereco.estado = `Rio de Janeiro`;
endereco.pais = `Brasil`;
endereco.codigoPostal = `22220-000`;
cliente.endereco = endereco;

let telefone = new Telefone();
telefone.ddd = `21`;
telefone.numero = `99999-9999`;
cliente.telefones = [telefone];

let dependente = new Cliente();
dependente.nome = `Isabel Cristina Leopoldina Augusta Micaela`;
dependente.nomeSocial = `Princesa Isabel`;
dependente.dataCadastro = new Date(1921, 10, 14);
dependente.dataNascimento = new Date(1846, 6, 29);

// Clone do endereço e telefone do titular
dependente.endereco = cliente.endereco.clonar() as Endereco;
dependente.telefones = cliente.telefones.map(tel => tel.clonar() as Telefone);

// Associar titular e adicionar dependente
dependente.titular = cliente;
cliente.dependentes.push(dependente);

console.log(cliente);
console.log(dependente);

// Teste para verificar se o clonar funcionou
console.log("\n=== TESTE DO CLONAR ===");
console.log("Telefone do titular:", cliente.telefones[0]);
console.log("Telefone do dependente:", dependente.telefones[0]);

// Modificar o telefone do dependente
dependente.telefones[0].numero = "88888-8888";

console.log("\nApós modificar o dependente:");
console.log("Telefone do titular:", cliente.telefones[0]);
console.log("Telefone do dependente:", dependente.telefones[0]);

if (cliente.telefones[0].numero !== dependente.telefones[0].numero) {
    console.log("✅ SUCESSO: O clonar funcionou! Os objetos são independentes.");
} else {
    console.log("❌ ERRO: O clonar não funcionou. Os objetos são o mesmo.");
}
