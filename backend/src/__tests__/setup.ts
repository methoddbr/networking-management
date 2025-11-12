// Setup file for Jest tests
// Configura variáveis de ambiente para testes
process.env.NODE_ENV = "test";
// Usa DATABASE_URL do .env se existir, senão usa a padrão
// Nota: Para testes funcionarem, é necessário ter um banco de dados configurado
if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL não configurada. Alguns testes podem falhar.");
}

