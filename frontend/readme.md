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

A estrutura do frontend foi organizada para separar as responsabilidades, tornando o código mais limpo e fácil de entender.

```
/frontend/
│
├── index.html          # O único arquivo HTML, a "casca" da aplicação.
│
├── /assets/            # Pasta para todos os recursos estáticos.
│   ├── /css/
│   │   └── style.css   # Folha de estilos principal.
│   ├── /js/
│   │   ├── main.js     # Ponto de entrada, orquestra a aplicação.
│   │   ├── api.js      # Centraliza toda a comunicação com o backend.
│   │   └── ui.js       # Responsável por manipular o HTML (DOM).
│   └── /images/        # Para futuras imagens e ícones.
```

---

## Arquitetura JavaScript

- **api.js**: Responsável por fazer as chamadas `fetch` para a API do backend. Exporta funções como `getComodos()`, `createComodo(nome)`, etc. Se a URL da API mudar, basta alterar neste arquivo.
- **ui.js**: Responsável por toda a manipulação do DOM. Recebe os dados da `api.js` e os "desenha" na tela, criando, atualizando e removendo elementos HTML.
- **main.js**: É o "maestro" da aplicação. Importa as funções necessárias, adiciona os event listeners (eventos de clique, etc.) aos elementos da página e chama as funções iniciais para carregar os dados quando a