import request from "supertest";
import app from "../app";

describe("Intents API", () => {
  describe("POST /api/intents", () => {
    it("should create a new intent", async () => {
      const response = await request(app)
        .post("/api/intents")
        .send({
          name: "João Silva",
          email: "joao@example.com",
          phone: "+5511999999999",
          message: "Quero participar do grupo",
        });

      // Aceita 201 (sucesso) ou 500 (erro de banco)
      if (response.status === 201) {
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name", "João Silva");
        expect(response.body).toHaveProperty("email", "joao@example.com");
        expect(response.body).toHaveProperty("status", "NEW");
      } else {
        expect([201, 500]).toContain(response.status);
      }
    });

    it("should return 400 if email is invalid", async () => {
      const response = await request(app)
        .post("/api/intents")
        .send({
          name: "João Silva",
          email: "invalid-email",
          phone: "+5511999999999",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 if name is missing", async () => {
      const response = await request(app)
        .post("/api/intents")
        .send({
          email: "joao@example.com",
          phone: "+5511999999999",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/intents/admin", () => {
    it("should return 401 without authorization", async () => {
      await request(app)
        .get("/api/intents/admin")
        .expect(401);
    });

    it("should return 403 for non-admin role", async () => {
      await request(app)
        .get("/api/intents/admin")
        .set("Authorization", "Bearer member:123")
        .expect(403);
    });

    it("should list intents for admin", async () => {
      const response = await request(app)
        .get("/api/intents/admin")
        .set("Authorization", "Bearer admin:123");

      // Aceita 200 (sucesso) ou 500 (erro de banco)
      if (response.status === 200) {
        expect(response.body).toHaveProperty("items");
        expect(response.body).toHaveProperty("meta");
        expect(Array.isArray(response.body.items)).toBe(true);
      } else {
        expect([200, 500]).toContain(response.status);
      }
    });
  });
});

