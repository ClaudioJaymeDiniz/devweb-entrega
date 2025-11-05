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

let telefone2 = new Telefone();
telefone2.ddd = `21`;
telefone2.numero = `1111-1111`;
cliente.telefones.push(telefone2);

let listaTelefones = new Array<Telefone>();
listaTelefones.push(telefone);
listaTelefones.push(telefone2);
cliente.telefones = listaTelefones;

let dependente = new Cliente();
dependente.nome = `Isabel Cristina Leopoldina Augusta Micaela`;
dependente.nomeSocial = `Princesa Isabel`;
dependente.dataCadastro = new Date(1921, 10, 14);
dependente.dataNascimento = new Date(1846, 6, 29);

// Clone do endereço e telefone do titular
dependente.endereco = cliente.endereco.clonar() as Endereco;
dependente.telefones = cliente.telefones.map((tel) => tel.clonar() as Telefone);

// Associar titular e adicionar dependente
dependente.titular = cliente;
cliente.dependentes.push(dependente);

console.log(cliente);
console.log(dependente);


// Modificar o telefone do dependente para provar a clonagem
dependente.telefones[0].numero = "88888-8888"; // <-- Certifique-se de que esta linha está descomentada

console.log("\n=== RESULTADO DA CLONAGEM (Todos os Telefones) ===");

// Função auxiliar para exibir a lista de telefones
const exibirTelefones = (nome: string, telefones: Telefone[]) => {
  console.log(`\nTelefones de ${nome}:`);
  telefones.forEach((tel, index) => {
    console.log(`  [${index + 1}] (${tel.ddd}) ${tel.numero}`);
  });
};

// 1. Exibir todos os telefones
exibirTelefones("Titular (Cliente)", cliente.telefones);
exibirTelefones("Dependente (Modificado)", dependente.telefones);

// 2. Teste de Independência (Checa apenas o primeiro telefone, que foi modificado)
if (cliente.telefones[0].numero !== dependente.telefones[0].numero) {
  console.log(
    "\n✅ SUCESSO: O clonar funcionou! O telefone [1] do Titular e do Dependente são independentes."
  );
} else {
  console.log(
    "\n❌ ERRO: O clonar não funcionou. O telefone [1] do Titular e do Dependente são o mesmo objeto."
  );
}
