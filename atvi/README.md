# 💻 Atividade da Faculdade: [ATVI / Tecnicas de Programação 2]

## 🚀 Guia de Uso

Este guia detalha os passos necessários para configurar, compilar e executar o projeto em seu ambiente local.

### 📋 Pré-requisitos

Certifique-se de ter o seguinte software instalado em sua máquina:

- **Node.js (e npm):** Versão recomendada (ex: v18.x ou superior).
- **Git:** Para clonar o repositório.

### 🛠️ Configuração e Instalação

Siga os passos abaixo no seu terminal, começando pelo diretório raiz do projeto:

1.  **Clone o Repositório** (Se ainda não o fez):
    ```bash
    git clone https://github.com/ClaudioJaymeDiniz/devweb-entrega.git
    cd devweb-entrega/atvi
    ```
2.  **Instale as Dependências:**
    O projeto utiliza o `npm` para gerenciar as dependências.
    ```bash
    npm install
    ```
    _(Este comando irá baixar todas as bibliotecas e módulos necessários listados no `package.json`.)_

### ▶️ Execução da Atividade

Após a instalação, utilize os scripts do `package.json` para compilar e executar o projeto de forma simplificada:

1.  **Compilar o TypeScript (Build):**

    ```bash
    npm run build
    ```

    _(Este comando executa o `tsc`, transformando o código TypeScript em JavaScript na pasta de saída, `src/js/`.)_

2.  **Executar o Projeto (Start):**
    ```bash
    npm start
    ```
    _(Este comando executa o arquivo principal `src/js/teste/index.js` utilizando o Node.js.)_

A saída do projeto, que é o resultado da atividade, será exibida **diretamente no terminal**.

---
