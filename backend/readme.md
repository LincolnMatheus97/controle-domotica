# API de Controle Domótico - Backend

Sistema backend com **FastAPI** e **SQLAlchemy**.

## Execução

```bash
uvicorn app.main:app --reload
```

API: `http://127.0.0.1:8000`  
Documentação: `http://127.0.0.1:8000/docs`

## Endpoints

### Base URL: `http://127.0.0.1:8000/api`

#### Cômodos
- `GET /api/comodos` - Listar todos
- `POST /api/comodos` - Criar novo
- `GET /api/comodos/{id}` - Buscar por ID
- `PUT /api/comodos/{id}` - Atualizar
- `DELETE /api/comodos/{id}` - Deletar

#### Dispositivos
- `GET /api/dispositivos` - Listar todos
- `POST /api/dispositivos` - Criar
- `POST /api/comodos/{comodo_id}/dispositivos` - Criar em cômodo
- `PUT /api/dispositivos/{id}` - Atualizar
- `DELETE /api/dispositivos/{id}` - Deletar

#### Cenas
- `GET /api/cenas` - Listar todas
- `POST /api/cenas` - Criar nova
- `PUT /api/cenas/{id}` - Atualizar
- `PUT /api/cenas/{id}/inverter` - Ativar/desativar
- `DELETE /api/cenas/{id}` - Deletar

#### Ações
- `GET /api/acoes` - Listar todas
- `POST /api/acoes` - Criar
- `POST /api/cenas/{cena_id}/acoes` - Criar em cena
- `PUT /api/acoes/{id}` - Atualizar
- `DELETE /api/acoes/{id}` - Deletar

## Schemas

### Cômodo
```json
{
  "id": 1,
  "nome": "string"
}
```

### Dispositivo
```json
{
  "id": 1,
  "nome": "string",
  "estado": boolean,
  "comodo_id": 1
}
```

### Cena
```json
{
  "id": 1,
  "nome": "string",
  "ativa": boolean
}
```

### Ação
```json
{
  "id": 1,
  "acao": "string",
  "intervalo_segundos": integer,
  "ordem": integer,
  "dispositivo_id": 1,
  "cena_id": 1
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `404` - Not Found
- `422` - Validation Error