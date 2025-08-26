# Documentação da API de Domótica

## Endpoints para Cômodos

### 1. Listar todos os cômodos
- **Method:** `GET`
- **URL:** `/api/comodos`
- **Parâmetros:** Nenhum
- **Corpo da Requisição:** Nenhum
- **Resposta (Sucesso):**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    [
      { "id": 1, "nome": "Sala de Estar" },
      { "id": 2, "nome": "Quarto" }
    ]
    ```

### 2. Criar um novo cômodo
- **Method:** `POST`
- **URL:** `/api/comodos`
- **Corpo da Requisição:**
    ```json
    {
      "nome": "Cozinha"
    }
    ```
- **Resposta (Sucesso):**
  - **Status Code:** `201 Created`
  - **Body:**
    ```json
    {
      "id": 3,
      "nome": "Cozinha"
    }
    ```

### 3. Atualizar um cômodo existente
- **Method:** `PUT`
- **URL:** `/api/comodos/{id}`
- **Parâmetros:** `id` (na URL) - O ID do cômodo a ser atualizado.
- **Corpo da Requisição:**
    ```json
    {
      "nome": "Sala de Jantar"
    }
    ```
- **Resposta (Sucesso):**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "id": 1,
      "nome": "Sala de Jantar"
    }
    ```

### 4. Excluir um cômodo
- **Method:** `DELETE`
- **URL:** `/api/comodos/{id}`
- **Parâmetros:** `id` (na URL) - O ID do cômodo a ser excluído.
- **Resposta (Sucesso):**
  - **Status Code:** `204 No Content`
  - **Body:** Nenhum

---

## Endpoints para Dispositivos
*Como um dispositivo sempre pertence a um cômodo, é uma boa prática refletir isso nas URLs para listar e criar dispositivos.*

### 1. Listar todos os dispositivos de um cômodo
- **Method:** `GET`
- **URL:** `/api/comodos/{comodo_id}/dispositivos`
- **Parâmetros:** `comodo_id` (na URL) - O ID do cômodo.
- **Resposta (Sucesso):**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    [
      { "id": 1, "nome": "Lâmpada Principal", "estado": "desligado", "comodo_id": 1 },
      { "id": 2, "nome": "Ventilador", "estado": "ligado", "comodo_id": 1 }
    ]
    ```

### 2. Adicionar um novo dispositivo a um cômodo
- **Method:** `POST`
- **URL:** `/api/comodos/{comodo_id}/dispositivos`
- **Parâmetros:** `comodo_id` (na URL) - O ID do cômodo.
- **Corpo da Requisição:**
    ```json
    {
      "nome": "Tomada Inteligente",
      "estado": "desligado"
    }
    ```
- **Resposta (Sucesso):**
  - **Status Code:** `201 Created`
  - **Body:**
    ```json
    {
      "id": 3,
      "nome": "Tomada Inteligente",
      "estado": "desligado",
      "comodo_id": 1
    }
    ```

### 3. Atualizar um dispositivo
- **Method:** `PUT`
- **URL:** `/api/dispositivos/{id}`
- **Parâmetros:** `id` (na URL) - O ID do dispositivo a ser atualizado.
- **Corpo da Requisição:**
    ```json
    {
      "nome": "Ventilador de Teto"
    }
    ```
- **Resposta (Sucesso):**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "id": 2,
      "nome": "Ventilador de Teto",
      "estado": "ligado",
      "comodo_id": 1
    }
    ```

### 4. Controlar (ligar/desligar) um dispositivo
- **Method:** `PATCH`
- **URL:** `/api/dispositivos/{id}/estado`
- **Parâmetros:** `id` (na URL) - O ID do dispositivo.
- **Corpo da Requisição:**
    ```json
    {
      "estado": "desligado"
    }
    ```
- **Resposta (Sucesso):**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "id": 2,
      "nome": "Ventilador de Teto",
      "estado": "desligado",
      "comodo_id": 1
    }
    ```

### 5. Excluir um dispositivo
- **Method:** `DELETE`
- **URL:** `/api/dispositivos/{id}`
- **Parâmetros:** `id` (na URL) - O ID do dispositivo.
- **Resposta (Sucesso):**
  - **Status Code:** `204 No Content`
  - **Body:** Nenhum

---

## Endpoints para Cenas

### 1. Listar todas as cenas (e suas ações)
- **Method:** `GET`
- **URL:** `/api/cenas`
- **Resposta (Sucesso):**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    [
      {
        "id": 1,
        "nome": "Modo Cinema",
        "ativa": true,
        "acoes": [
          { "id": 1, "ordem": 1, "dispositivo_id": 1, "acao": "ligar", "intervalo_segundos": 0 },
          { "id": 2, "ordem": 2, "dispositivo_id": 2, "acao": "desligar", "intervalo_segundos": 2 }
        ]
      }
    ]
    ```

### 2. Criar uma nova cena
- **Method:** `POST`
- **URL:** `/api/cenas`
- **Corpo da Requisição:**
    ```json
    {
      "nome": "Sair de Casa",
      "ativa": true
    }
    ```
- **Resposta (Sucesso):**
  - **Status Code:** `201 Created`
  - **Body:**
    ```json
    {
      "id": 2,
      "nome": "Sair de Casa",
      "ativa": true,
      "acoes": []
    }
    ```

### 3. Adicionar uma ação a uma cena
- **Method:** `POST`
- **URL:** `/api/cenas/{cena_id}/acoes`
- **Parâmetros:** `cena_id` (na URL).
- **Corpo da Requisição:**
    ```json
    {
      "dispositivo_id": 1,
      "acao": "desligar",
      "intervalo_segundos": 5,
      "ordem": 1
    }
    ```
- **Resposta (Sucesso):**
  - **Status Code:** `201 Created`
  - **Body:** (Retorna a cena completa e atualizada)

### 4. Excluir uma ação de uma cena
- **Method:** `DELETE`
- **URL:** `/api/acoes/{id}`
- **Parâmetros:** `id` (na URL) - O ID da ação a ser excluída.
- **Resposta (Sucesso):**
  - **Status Code:** `204 No Content`

### 5. Executar uma cena
- **Method:** `POST`
- **URL:** `/api/cenas/{id}/executar`
- **Parâmetros:** `id` (na URL) - O ID da cena a ser executada.
- **Resposta (Sucesso):**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "message": "Cena 'Modo Cinema' executada com sucesso."
    }
    ```