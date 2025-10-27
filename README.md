# Product Catalog & Auth API 🚀🛡️

[Read in Portuguese](#versao-em-portugues)

> A robust backend service for managing a product catalog, featuring a complete user authentication system with role-based access control. Built with Node.js, Express, and MongoDB, this project serves as a comprehensive portfolio piece demonstrating secure API design, clean architecture, and modern backend practices.

## ✨ Key Features

This API implements both public-facing and admin-protected functionalities:

- **Complete User Authentication & Identity Management:**
    - Secure registration (`POST /usuarios/cadastro`) with strong password hashing (`bcryptjs`).
    - Standard email/password login (`POST /usuarios/login`) issuing JWTs (`jsonwebtoken`).
    - Email verification flow via confirmation link (`Nodemailer`, `crypto`).
    - Endpoint (`GET /usuarios/verificar-email`) to handle email verification.
    - Robust input validation (`express-validator`) for registration and login data.
    - Rate limiting (`express-rate-limit`) on authentication endpoints to prevent abuse.
- **Product Catalog Management (CRUD):**
    - **Public Access:**
        - List all products (`GET /produtos`) - Supports filtering via query parameters (e.g., `?name=...`, `?category=...`).
        - Get details of a single product by ID (`GET /produtos/:id`).
    - **Admin-Protected Access:**
        - Create new products (`POST /produtos`).
        - Update existing products (`PUT /produtos/:id`).
        - Delete products (`DELETE /produtos/:id`).
- **Role-Based Access Control (RBAC):**
    - User roles defined (`user`, `admin`, `master`).
    - **Reusable Middleware:**
        - `isAuthenticated`: Verifies JWT validity for protected routes.
        - `isAdmin`: Ensures only users with 'admin' or 'master' roles can access specific administrative routes (like product management).
    - Product management endpoints are secured, requiring admin privileges.
- **Clean Architecture & Robustness:**
    - **Controller-Service Pattern:** Clear separation between HTTP handling (Controllers) and business logic (Services).
    - **Centralized Error Handling:** Dedicated error middleware (`errorHandler`) and custom `ApiError` class for consistent and informative error responses (using proper HTTP status codes like `409 Conflict`).

## 🚀 Tech Stack Used

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (with Mongoose ORM)
  - JSON Web Token (JWT - `jsonwebtoken`)
  - Bcrypt.js (`bcryptjs`)
  - Express Validator (`express-validator`)
  - Express Rate Limit (`express-rate-limit`)
  - Nodemailer
  - Dotenv (`dotenv`)
  - Cors
- **Tooling:**
  - Git & GitHub
  - VSCode
  - Nodemon
  - Insomnia / Postman (for testing)

## ⚙️ How to Run Locally

Follow the steps below to run this project on your local machine.

```bash
# 1. Clone this repository
git clone <your-repo-link-here> # Replace with your GitHub repo link

# 2. Navigate to the project folder
cd your-project-folder-name # e.g., cd product-catalog-api

# 3. Install dependencies
npm install

# 4. Create a .env file in the project root
# and add the following environment variables:
# CONNECTION_STRING=YourMongoDBConnectionString
# JWT_SECRET_KEY=YourJWTSecretKey
# EMAIL_USER=YourGmailAddress
# EMAIL_PASS=YourGmailAppPassword
# (Add any other variables you might use, like SESSION_SECRET if needed later)

# 5. Start the server in development mode (with Nodemon)
npm run dev
```
The API will be running on `http://localhost:3000`. Use Insomnia or Postman to interact with the endpoints. Remember to manually set a user's `role` to `admin` or `master` in the database to test protected routes.

## 🔑 API Endpoints Overview

### Authentication (`/usuarios`)
- `POST /cadastro`: Register a new user.
- `GET /verificar-email?token=<token>`: Verify email address.
- `POST /login`: Log in and receive a JWT.

### Product Catalog (`/produtos`)
- `GET /`: List all products (public). Supports query parameters like `?name=...` & `?category=...`.
- `GET /:id`: Get details of a specific product (public).
- `POST /`: Create a new product (Admin only).
- `PUT /:id`: Update a product (Admin only).
- `DELETE /:id`: Delete a product (Admin only).

### Administration (`/admin`) - *If you kept adminRoutes.js*
- `GET /usuarios`: List all users (Admin only).
- `DELETE /usuarios/:id`: Delete a user (Admin/Master only, with hierarchy rules).

## 👨‍💻 Author

**Caio Caetano**

- GitHub: [@dev-caiocaetano](https://github.com/dev-caiocaetano)
- LinkedIn: [Caio Caetano](https://www.linkedin.com/in/caiohenriquecaetano/)

---
<br>

## Versão em Português

> Um serviço de backend robusto para gerenciamento de catálogo de produtos, apresentando um sistema completo de autenticação de usuário com controle de acesso baseado em papéis. Construído com Node.js, Express e MongoDB, este projeto serve como uma peça de portfólio abrangente, demonstrando design seguro de API, arquitetura limpa e práticas modernas de backend.

## ✨ Features Principais

Esta API implementa funcionalidades tanto públicas quanto protegidas para administradores:

- **Autenticação Completa e Gerenciamento de Identidade:**
    - Cadastro seguro (`POST /usuarios/cadastro`) com hashing de senha forte (`bcryptjs`).
    - Login padrão com e-mail/senha (`POST /usuarios/login`) emitindo JWTs (`jsonwebtoken`).
    - Fluxo de verificação de e-mail via link de confirmação (`Nodemailer`, `crypto`).
    - Endpoint (`GET /usuarios/verificar-email`) para lidar com a verificação de e-mail.
    - Validação robusta de entrada (`express-validator`) para dados de cadastro e login.
    - Limitação de taxa (`express-rate-limit`) nos endpoints de autenticação para prevenir abuso.
- **Gerenciamento de Catálogo de Produtos (CRUD):**
    - **Acesso Público:**
        - Listar todos os produtos (`GET /produtos`) - Suporta filtros via query parameters (ex: `?name=...`, `?category=...`).
        - Obter detalhes de um produto específico por ID (`GET /produtos/:id`).
    - **Acesso Restrito a Admins:**
        - Criar novos produtos (`POST /produtos`).
        - Atualizar produtos existentes (`PUT /produtos/:id`).
        - Deletar produtos (`DELETE /produtos/:id`).
- **Controle de Acesso Baseado em Papéis (RBAC):**
    - Papéis de usuário definidos (`user`, `admin`, `master`).
    - **Middlewares Reutilizáveis:**
        - `isAuthenticated`: Verifica a validade do JWT para rotas protegidas.
        - `isAdmin`: Garante que apenas usuários com papéis 'admin' ou 'master' possam acessar rotas administrativas específicas (como o gerenciamento de produtos).
    - Endpoints de gerenciamento de produtos são seguros, exigindo privilégios de administrador.
- **Arquitetura Limpa e Robustez:**
    - **Padrão Controller-Service:** Separação clara entre o tratamento HTTP (Controllers) e a lógica de negócio (Services).
    - **Tratamento de Erros Centralizado:** Middleware de erro dedicado (`errorHandler`) e classe `ApiError` customizada para respostas de erro consistentes e informativas (usando códigos de status HTTP apropriados como `409 Conflict`).

## 🚀 Tecnologias Utilizadas

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (com Mongoose ORM)
  - JSON Web Token (JWT - `jsonwebtoken`)
  - Bcrypt.js (`bcryptjs`)
  - Express Validator (`express-validator`)
  - Express Rate Limit (`express-rate-limit`)
  - Nodemailer
  - Dotenv (`dotenv`)
  - Cors
- **Ferramentas:**
  - Git & GitHub
  - VSCode
  - Nodemon
  - Insomnia / Postman (para testes)

## ⚙️ Como Rodar Localmente

Siga os passos abaixo para executar este projeto na sua máquina.

```bash
# 1. Clone este repositório
git clone <link-do-seu-repo-aqui> # Substitua pelo link do seu repo no GitHub

# 2. Navegue para a pasta do projeto
cd nome-da-pasta-do-projeto # ex: cd product-catalog-api

# 3. Instale as dependências
npm install

# 4. Crie um arquivo .env na raiz do projeto
# e adicione as seguintes variáveis de ambiente:
# CONNECTION_STRING=SuaStringDeConexaoComOMongoDB
# JWT_SECRET_KEY=SuaChaveSecretaParaOJWT
# EMAIL_USER=SeuEmailDoGmail
# EMAIL_PASS=SuaSenhaDeAppDoGmail
# (Adicione outras variáveis que possa usar, como SESSION_SECRET se necessário depois)

# 5. Inicie o servidor em modo de desenvolvimento (com Nodemon)
npm run dev
```
A API estará rodando em `http://localhost:3000`. Use Insomnia ou Postman para interagir com os endpoints. Lembre-se de definir manualmente o `role` de um usuário para `admin` ou `master` no banco de dados para testar as rotas protegidas.

## 🔑 Visão Geral dos Endpoints da API

### Autenticação (`/usuarios`)
- `POST /cadastro`: Registra um novo usuário.
- `GET /verificar-email?token=<token>`: Verifica o endereço de e-mail.
- `POST /login`: Autentica um usuário e retorna um JWT.

### Catálogo de Produtos (`/produtos`)
- `GET /`: Lista todos os produtos (público). Suporta query parameters como `?name=...` & `?category=...`.
- `GET /:id`: Obtém detalhes de um produto específico (público).
- `POST /`: Cria um novo produto (Somente Admin).
- `PUT /:id`: Atualiza um produto (Somente Admin).
- `DELETE /:id`: Deleta um produto (Somente Admin).

### Administração (`/admin`) - *Se manteve o adminRoutes.js*
- `GET /usuarios`: Lista todos os usuários (Somente Admin).
- `DELETE /usuarios/:id`: Deleta um usuário (Somente Admin/Master, com regras de hierarquia).

## 👨‍💻 Autor

**Caio Caetano**

- GitHub: [@dev-caiocaetano](https://github.com/dev-caiocaetano)
- LinkedIn: [Caio Caetano](https://www.linkedin.com/in/caiohenriquecaetano/)
