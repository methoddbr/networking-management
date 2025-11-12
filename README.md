# Plataforma de Gestão para Grupos de Networking

Projeto criado para o teste técnico — Plataforma para gerenciar membros, reuniões, indicações e mensalidades.

## Objetivo

Implementar arquitetura e funcionalidades essenciais para gestão de grupos de networking.

## Estrutura inicial

- Backend: Node.js + TypeScript
- Frontend: Next.js (React)
- DB: PostgreSQL

## Como rodar (desenvolvimento)

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior)
- Docker (versão 20.10 ou superior)

### Backend

1. **Instalar dependências:**

   ```bash
   cd backend
   npm install
   ```

2. **Configurar variáveis de ambiente:**

   ```bash
   cp .env.example .env
   ```

3. **Configurar banco de dados:**

   ```bash
   docker-compose up -d
   ```

4. **Rodar migrações:**

   ```bash
   npx prisma migrate dev
   ```

5. **Iniciar servidor:**

   ```bash
   npm run dev
   ```

   O servidor estará rodando em `http://localhost:4000`

6. **Testar API:**
   ```bash
   npm test
   ```

### Endpoints principais

- `POST /api/intents` - Criar intenção de participação (público)
- `GET /api/intents/admin` - Listar intenções (admin)
- `POST /api/intents/admin/:id/accept` - Aceitar intenção (admin)
- `GET /api/members` - Listar membros
- `POST /api/members` - Criar membro
- `GET /api/meetings` - Listar reuniões (auth)
- `POST /api/meetings` - Criar reunião (admin)
- `POST /api/meetings/:id/checkin` - Fazer check-in (member)
- `GET /api/meetings/:id/attendance` - Listar presenças (admin)
- `POST /api/referrals` - Criar indicação (member)
- `PATCH /api/referrals/:id` - Atualizar indicação (member)
- `POST /api/referrals/:id/thank` - Agradecer indicação (member)

### Autenticação (Mock)

Enquanto a autenticação real não está implementada, use o formato:

- `Authorization: Bearer admin:123` - Para role admin
- `Authorization: Bearer member:123` - Para role member
- `Authorization: Bearer guest:123` - Para role guest

### Documentação

A documentação OpenAPI está em `backend/openapi.yaml`. Você pode visualizá-la em https://editor.swagger.io

### Frontend

1. **Instalar dependências:**

   ```bash
   cd ../frontend
   npm install
   ```

2. **Configurar variáveis de ambiente:**

   ```bash
   cp .env.example .env.local
   ```

3. **Iniciar servidor:**

   ```bash
   npm run dev
   ```

   O servidor estará rodando em `http://localhost:4000`

---

## Como acessar

### Home

A página inicial da aplicação pode ser acessada diretamente no endereço `http://localhost:3000`.

### Dashboard

Para acessar o dashboard, você precisa estar autenticado como um usuário com o papel de admin. Você pode fazer login no sistema e acessar a página do dashboard através do endereço `http://localhost:3000/admin`.

---

## Contato

Leonardo Prestes
