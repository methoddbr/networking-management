# Backend - Networking Management API

## 🚀 Início Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados

**Opção A: Docker (recomendado)**
```bash
docker-compose up -d
```

**Opção B: PostgreSQL local**
- Crie um banco de dados PostgreSQL
- Configure a `DATABASE_URL` no `.env`

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do backend:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/networking?schema=public"
PORT=4000
NODE_ENV=development
```

### 4. Rodar migrações
```bash
npx prisma migrate dev
```

### 5. Iniciar servidor
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:4000`

## 📚 Documentação da API

A documentação OpenAPI está em `openapi.yaml`. Você pode visualizá-la em:
- https://editor.swagger.io (cole o conteúdo do arquivo)

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

## 🔐 Autenticação (Mock)

Enquanto a autenticação real não está implementada, use o formato:
- `Authorization: Bearer admin:123` - Para role admin
- `Authorization: Bearer member:123` - Para role member
- `Authorization: Bearer guest:123` - Para role guest

## 📡 Endpoints Disponíveis

### Intents (Intenções)
- `POST /api/intents` - Criar intenção (público)
- `GET /api/intents/admin` - Listar intenções (admin)
- `POST /api/intents/admin/:id/accept` - Aceitar intenção (admin)

### Members (Membros)
- `GET /api/members` - Listar membros
- `POST /api/members` - Criar membro

### Meetings (Reuniões)
- `GET /api/meetings` - Listar reuniões (auth)
- `POST /api/meetings` - Criar reunião (admin)
- `POST /api/meetings/:id/checkin` - Fazer check-in (member)
- `GET /api/meetings/:id/attendance` - Listar presenças (admin)

### Referrals (Indicações)
- `POST /api/referrals` - Criar indicação (member)
- `PATCH /api/referrals/:id` - Atualizar indicação (member)
- `POST /api/referrals/:id/thank` - Agradecer indicação (member)

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia servidor em modo desenvolvimento
- `npm test` - Roda testes
- `npm run test:watch` - Roda testes em modo watch
- `npm run test:coverage` - Gera relatório de cobertura

## 📝 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Lógica de negócio
│   ├── routes/          # Definição de rotas
│   ├── schemas/         # Validação Zod
│   ├── middlewares/     # Middlewares (auth, error)
│   ├── lib/            # Utilitários (Prisma)
│   └── __tests__/      # Testes
├── prisma/
│   ├── schema.prisma   # Schema do banco
│   └── migrations/     # Migrações
└── openapi.yaml        # Documentação OpenAPI
```

