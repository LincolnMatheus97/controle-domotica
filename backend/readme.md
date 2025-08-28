# API de Controle Domótico - Backend

## O que é este projeto?

Este é o **backend** da aplicação de controle domótico.

## Tecnologias Utilizadas

- **Python 3.12+**: Linguagem de programação
- **FastAPI**: Framework web moderno e rápido para criar APIs
- **SQLAlchemy**: ORM (mapeamento objeto-relacional) para banco de dados
- **SQLite**: Banco de dados leve (arquivo `test.db`)
- **Uvicorn**: Servidor ASGI para executar a aplicação

## Como começar (Passo a Passo)

### 1. Verificar se o Python está instalado

Abra o terminal e digite:
```bash
python3 --version
```
Deve mostrar algo como: `Python 3.12.x`

### 2. Navegar até a pasta do backend

```bash
cd controle-domotica/backend
```

### 3. Criar um ambiente virtual 

```bash
# Criar o ambiente virtual
python3 -m venv venv

# Ativar o ambiente virtual (Linux/Mac)
source venv/bin/activate

# Ativar o ambiente virtual (Windows)
venv\Scripts\activate
```

**Como saber se está ativo?**
Você verá `(venv)` no início da linha do terminal.

### 4. Instalar as dependências

```bash
pip install -r requirements.txt
```

### 5. Executar o servidor

```bash
uvicorn app.main:app --reload
```

**O que significa cada parte?**
- `app.main`: Arquivo `main.py` dentro da pasta `app`
- `:app`: Variável `app` dentro do arquivo
- `--reload`: Reinicia automaticamente quando você alterar o código

## Acessar a aplicação

Após executar o comando acima, você verá no terminal:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### URLs importantes:
- **API**: http://127.0.0.1:8000
- **Documentação interativa**: http://127.0.0.1:8000/docs 
- **Documentação alternativa**: http://127.0.0.1:8000/redoc

## Endpoints da API

### URL Base: `http://127.0.0.1:8000/api`

### Cômodos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/comodos` | Listar todos os cômodos |
| POST | `/api/comodos` | Criar um novo cômodo |
| GET | `/api/comodos/{id}` | Buscar cômodo por ID |
| PUT | `/api/comodos/{id}` | Atualizar um cômodo |
| DELETE | `/api/comodos/{id}` | Deletar um cômodo |

### Dispositivos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/dispositivos` | Listar todos os dispositivos |
| POST | `/api/dispositivos` | Criar um novo dispositivo |
| POST | `/api/comodos/{comodo_id}/dispositivos` | Criar dispositivo em um cômodo específico |
| PUT | `/api/dispositivos/{id}` | Atualizar um dispositivo |
| DELETE | `/api/dispositivos/{id}` | Deletar um dispositivo |

### Cenas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/cenas` | Listar todas as cenas |
| POST | `/api/cenas` | Criar uma nova cena |
| PUT | `/api/cenas/{id}` | Atualizar uma cena |
| PUT | `/api/cenas/{id}/inverter` | Ativar/desativar uma cena |
| DELETE | `/api/cenas/{id}` | Deletar uma cena |

### Ações
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/acoes` | Listar todas as ações |
| POST | `/api/acoes` | Criar uma nova ação |
| POST | `/api/cenas/{cena_id}/acoes` | Criar ação em uma cena específica |
| PUT | `/api/acoes/{id}` | Atualizar uma ação |
| DELETE | `/api/acoes/{id}` | Deletar uma ação |

## Formatos de Dados (Schemas)

### Cômodo
```json
{
  "id": 1,
  "nome": "Sala de Estar"
}
```

### Dispositivo
```json
{
  "id": 1,
  "nome": "Lâmpada Principal",
  "estado": true,
  "comodo_id": 1
}
```

### Cena
```json
{
  "id": 1,
  "nome": "Modo Cinema",
  "ativa": false
}
```

### Ação
```json
{
  "id": 1,
  "acao": "ligar",
  "intervalo_segundos": 5,
  "ordem": 1,
  "dispositivo_id": 1,
  "cena_id": 1
}
```

## Como testar a API

### 1. Usando a documentação interativa 

Acesse: http://127.0.0.1:8000/docs

Clique em qualquer endpoint → "Try it out" → Preencha os dados → "Execute"

### 2. Usando curl (linha de comando)

```bash
# Listar cômodos
curl http://127.0.0.1:8000/api/comodos

# Criar um cômodo
curl -X POST http://127.0.0.1:8000/api/comodos \
  -H "Content-Type: application/json" \
  -d '{"nome": "Quarto"}'
```

### 3. Usando JavaScript (fetch)

```javascript
// Listar cômodos
const response = await fetch('http://127.0.0.1:8000/api/comodos');
const comodos = await response.json();

// Criar um cômodo
const novoComodo = await fetch('http://127.0.0.1:8000/api/comodos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ nome: 'Cozinha' })
});
```

## Códigos de Status HTTP

| Código | Significado | Quando acontece |
|--------|-------------|-----------------|
| 200 | OK | Operação realizada com sucesso |
| 201 | Created | Recurso criado com sucesso |
| 404 | Not Found | Recurso não encontrado (ID inválido) |
| 422 | Validation Error | Dados enviados estão incorretos |
| 500 | Internal Server Error | Erro interno do servidor |

## Estrutura do Projeto

```
backend/
├── app/                    # Código principal
│   ├── __init__.py        # Torna a pasta um módulo Python
│   ├── main.py            # Arquivo principal - inicia a aplicação
│   ├── config.py          # Configurações da aplicação
│   ├── api/               # Rotas da API
│   │   └── endpoints/     # Endpoints organizados por entidade
│   ├── models/            # Modelos do banco de dados (SQLAlchemy)
│   ├── schemas/           # Esquemas de validação (Pydantic)
│   ├── services/          # Lógica de negócio
│   └── database/          # Configuração do banco
├── tests/                 # Testes automatizados
├── requirements.txt       # Lista de dependências
└── test.db               # Banco de dados SQLite
```

## Comandos Úteis

```bash
# Ativar ambiente virtual
source venv/bin/activate

# Desativar ambiente virtual
deactivate

# Instalar nova dependência
pip install nome_da_biblioteca

# Atualizar requirements.txt
pip freeze > requirements.txt

# Executar testes
pytest

# Ver logs detalhados
uvicorn app.main:app --reload --log-level debug
```

## Problemas Comuns

### "Command not found: uvicorn"
**Solução**: Certifique-se que o ambiente virtual está ativado e que instalou as dependências.

### "ModuleNotFoundError"
**Solução**: Verifique se está na pasta `backend` e se o ambiente virtual está ativo.

### "Port already in use"
**Solução**: Mude a porta: `uvicorn app.main:app --reload --port 8001`

### Banco de dados não funciona
**Solução**: Delete o arquivo `test.db` e reinicie a aplicação.

## Precisa de Ajuda?

1. Verifique a documentação interativa: http://127.0.0.1:8000/docs
2. Veja os logs no terminal onde executou `uvicorn`
3. Pergunte para a equipe de backend.