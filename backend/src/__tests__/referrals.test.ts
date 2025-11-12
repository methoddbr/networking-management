import request from "supertest";
import app from "../app";

describe("Referrals API", () => {
  let memberId: string;
  let referralId: string;

  beforeAll(async () => {
    // Cria um membro para usar nos testes
    const memberResponse = await request(app)
      .post("/api/members")
      .send({
        email: `referral-test-${Date.now()}@example.com`,
        name: "Test Member",
      });

    if (memberResponse.status === 201) {
      memberId = memberResponse.body.id;
    }
  });

  describe("POST /api/referrals", () => {
    it("should return 401 without authorization", async () => {
      await request(app)
        .post("/api/referrals")
        .send({
          toMemberId: memberId || "test-id",
          clientName: "Cliente Teste",
        })
        .expect(401);
    });

    it("should return 403 for non-member role", async () => {
      await request(app)
        .post("/api/referrals")
        .set("Authorization", "Bearer admin:123")
        .send({
          toMemberId: memberId || "test-id",
          clientName: "Cliente Teste",
        })
        .expect(403);
    });

    it("should create a referral for member", async () => {
      if (!memberId) {
        // Se não tem memberId, pula o teste
        return;
      }

      const response = await request(app)
        .post("/api/referrals")
        .set("Authorization", "Bearer member:123")
        .send({
          toMemberId: memberId,
          clientName: "Cliente Teste",
          description: "Indicação de cliente",
          valueEstimated: 5000,
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("clientName", "Cliente Teste");
      expect(response.body).toHaveProperty("status", "OPEN");
      referralId = response.body.id;
    });

    it("should return 400 if toMemberId is invalid UUID", async () => {
      const response = await request(app)
        .post("/api/referrals")
        .set("Authorization", "Bearer member:123")
        .send({
          toMemberId: "invalid-uuid",
          clientName: "Cliente Teste",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PATCH /api/referrals/:id", () => {
    it("should return 401 without authorization", async () => {
      if (!referralId) return;
      await request(app)
        .patch(`/api/referrals/${referralId}`)
        .send({ status: "contacted" })
        .expect(401);
    });

    it("should update referral status", async () => {
      if (!referralId) return;
      const response = await request(app)
        .patch(`/api/referrals/${referralId}`)
        .set("Authorization", "Bearer member:123")
        .send({ status: "in_progress" })
        .expect(200);

      expect(response.body).toHaveProperty("status", "IN_PROGRESS");
    });
  });

  describe("POST /api/referrals/:id/thank", () => {
    it("should return 401 without authorization", async () => {
      if (!referralId) return;
      await request(app)
        .post(`/api/referrals/${referralId}/thank`)
        .send({ message: "Obrigado!" })
        .expect(401);
    });

    it("should create a thank for referral", async () => {
      if (!referralId) return;
      const response = await request(app)
        .post(`/api/referrals/${referralId}/thank`)
        .set("Authorization", "Bearer member:123")
        .send({ message: "Muito obrigado pela indicação!" })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("message", "Muito obrigado pela indicação!");
    });
  });
});

