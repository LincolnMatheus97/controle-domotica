# Frontend - Controle de Domótica

Esta pasta contém todos os arquivos relacionados à interface do usuário (frontend) da aplicação de Controle de Domótica.  
A aplicação é construída com **HTML**, **CSS** e **JavaScript puro**, utilizando uma arquitetura modular para melhor organização e manutenibilidade.

## Como Executar o Frontend

Para que o frontend possa se comunicar com a API do backend sem problemas de CORS (Cross-Origin Resource Sharing) e para que os módulos JavaScript (import/export) funcionem corretamente, ele precisa ser servido por um servidor web local.  
Usaremos o **live-server**, um pacote Node.js simples e eficiente.

### Pré-requisitos

- **Node.js e npm**: Certifique-se de que você tem o Node.js instalado. O npm (Node Package Manager) vem junto com ele.
- **Backend em Execução**: O servidor do backend (Python/FastAPI) deve estar rodando, geralmente em [http://127.0.0.1:8000](http://127.0.0.1:8000).

### Passo a Passo

1. **Instale o live-server**  
   Abra o terminal e execute o comando abaixo para instalar o live-server globalmente:

   ```bash
   npm install -g live-server
   ```

2. **Navegue até a pasta do frontend**  
   Pelo terminal, entre na pasta `frontend` do seu projeto:

   ```bash
   cd caminho/para/seu/projeto/frontend
   ```

3. **Inicie o servidor**  
   Uma vez dentro da pasta `frontend`, execute:

   ```bash
   live-server
   ```

O live-server irá automaticamente:
- Iniciar um servidor web local (geralmente na porta 8080).
- Abrir a sua aplicação no navegador padrão.
- Recarregar a página automaticamente sempre que você salvar uma alteração nos arquivos!

Agora sua aplicação frontend estará rodando e pronta para interagir com a API do backend.

---

## Estrutura de Arquivos

A estrutura do frontend foi organizada para separar as responsabilidades, tornando o código mais limpo e escalável.

```
/frontend/
│
├── index.html              # Arquivo HTML principal da aplicação.
│
└── /assets/                # Pasta para todos os recursos estáticos.
    ├── /css/
    │   └── style.css       # Estilos principais da aplicação.
    │
    └── /js/
        ├── /api/           # Módulos de comunicação com a API.
        │   ├── comodos.js
        │   └── ...
        │
        ├── /ui/            # Módulos de manipulação da interface (DOM).
        │   ├── comodos.js
        │   └── ...
        │
        ├── main.js         # Ponto de entrada, orquestrador da aplicação.
        └── utils.js        # Funções utilitárias reutilizáveis.
```

---

## Arquitetura JavaScript

A lógica do JavaScript foi dividida em módulos com responsabilidades bem definidas para facilitar a manutenção e a adição de novas funcionalidades.

- **/api/**: Contém os módulos que centralizam toda a comunicação com o backend. Cada arquivo é responsável por um recurso da API (ex: `comodos.js` lida com todas as chamadas `fetch` para o endpoint `/comodos`).
- **/ui/**: Contém os módulos responsáveis por toda a manipulação do DOM. Eles recebem os dados vindos da camada de api e os "desenham" na tela, criando, atualizando e removendo elementos HTML, além de lidar com os eventos de interação do usuário.
- **main.js**: É o "maestro" da aplicação. Inicializa o sistema, importa as funções necessárias dos módulos de ui, adiciona os event listeners globais aos elementos da página e chama as funções para carregar os dados iniciais.
- **utils.js**: Um conjunto de ferramentas com funções genéricas e reutilizáveis que podem ser necessárias em várias partes do projeto, como `getById`, `criarElemento`, `mostrarNotificacao` e `abrirModalConfirmacao`