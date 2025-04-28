# Projeto Backend - Sistema de Upload e Extração de Leituras

## Descrição

Este é um projeto de backend desenvolvido com **Node.js**, **Express**, **TypeScript** e **Prisma ORM**, que permite:

- Upload de imagens
- Extração de valores via integração com API externa (Gemini)
- Armazenamento de medições em banco de dados
- Confirmação de medições
- Listagem de medições por cliente e tipo

> Este projeto foi estruturado seguindo boas práticas de separação de responsabilidades (Controllers, Services, Utils, Middleware e Error Handling).

---

## Tecnologias Utilizadas

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL (Docker)
- Multer (Upload de imagens)
- Jest + ts-jest (Testes unitários)
- Docker e Docker Compose
- API externa Gemini (para OCR de imagem)

---

## Estrutura de Pastas

```plaintext
src/
 |-- controllers/
 |-- constants
 |-- services/
 |-- routes/
 |-- utils/
 |-- errors/
 |-- middleware/
 |-- integrations/
 |-- libs/
 |-- types/
 |-- __tests__/
public/uploads/
```

---

## Configuração do Ambiente

1. **Clone o repositório:**

```bash
git clone https://github.com/NickolasFchinni/prj_backend_shopper_shopper_nickolas.git
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure o arquivo `.env`** (baseie-se no `.env.example`):

```plaintext
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/readings_db
GEMINI_API_KEY=sua-chave-api-gemini
BASE_URL=http://localhost:3000
PORT=3000
```
> Observação: O usuário, senha e banco de dados acima já estão configurados no docker-compose.yml, garantindo que o backend conectará automaticamente ao banco ao subir os containers.

4. **Suba o ambiente com Docker:**

```bash
docker-compose up --build
```

(O banco de dados PostgreSQL será iniciado automaticamente)

5. **Rode as migrações do Prisma:**

```bash
npx prisma migrate dev
```

6. **Inicie o servidor:**

```bash
npm run dev
```

---

## Endpoints Disponíveis

### Upload de Imagem

- **POST** `/upload`
- Faz upload de uma imagem, extrai valor e salva medição.

Exemplo de chamada (Postman):

![Upload Endpoint](./docs/assets/post_route.png)

### Listar Medidas

- **GET** `/:customer_code/list?measure_type=WATER|ENERGY`
- Lista medições de um cliente filtrando por tipo de medida.

### Confirmar Leitura

- **PATCH** `/confirm`
- Confirma o valor de uma medição com base no UUID.

Exemplo de chamada (Postman):

![Patch Endpoint](./docs/assets/patch_route.png)


---

## Testes

1. **Rodar todos os testes unitários:**

```bash
npx jest
```

- Cobertura atual: Controllers, Services, Utils.
- Mocks aplicados para Prisma e integrações externas.

---

## Scripts Disponíveis

```json
"scripts": {
  "dev": "ts-node-dev --respawn src/app.ts",
  "build": "tsc",
  "start": "node dist/app.js",
  "test": "jest"
}
```

- `npm run dev` → Inicia servidor em modo desenvolvimento
- `npm run build` → Compila TypeScript para JavaScript
- `npm start` → Roda servidor compilado
- `npx jest` → Executa testes unitários

---

## Observações Importantes

- A pasta `public/uploads/` é onde as imagens enviadas serão armazenadas.
- A integração com a API Gemini é simulada nos testes via mocks.
- Todos os erros seguem o padrão da classe `ApiError`.
- Banco de dados, usuário e senha são definidos no docker-compose.yml e devem ser mantidos alinhados com o .env.

---

> Projeto desenvolvido para fins de demonstração em processo seletivo.

---

## Autor

Desenvolvido por Nickolas Alexandre Faquini - nulleyson@gmail.com - [[LinkedIn]](https://www.linkedin.com/in/nickolasfaquini/)

