import request from "supertest";
import app from "../app";

describe("Meetings API", () => {
  let meetingId: string;

  describe("POST /api/meetings", () => {
    it("should return 401 without authorization", async () => {
      await request(app)
        .post("/api/meetings")
        .send({
          title: "Reunião Mensal",
          date: "2025-12-01T19:00:00Z",
        })
        .expect(401);
    });

    it("should return 403 for non-admin role", async () => {
      await request(app)
        .post("/api/meetings")
        .set("Authorization", "Bearer member:123")
        .send({
          title: "Reunião Mensal",
          date: "2025-12-01T19:00:00Z",
        })
        .expect(403);
    });

    it("should create a meeting for admin", async () => {
      const response = await request(app)
        .post("/api/meetings")
        .set("Authorization", "Bearer admin:123")
        .send({
          title: "Reunião Mensal",
          description: "Reunião de networking",
          date: "2025-12-01T19:00:00Z",
          location: "Sala de Reuniões",
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("title", "Reunião Mensal");
      meetingId = response.body.id;
    });

    it("should return 400 if title is missing", async () => {
      const response = await request(app)
        .post("/api/meetings")
        .set("Authorization", "Bearer admin:123")
        .send({
          date: "2025-12-01T19:00:00Z",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/meetings", () => {
    it("should return 401 without authorization", async () => {
      await request(app).get("/api/meetings").expect(401);
    });

    it("should list meetings", async () => {
      const response = await request(app)
        .get("/api/meetings")
        .set("Authorization", "Bearer admin:123")
        .expect(200);

      expect(response.body).toHaveProperty("items");
      expect(response.body).toHaveProperty("meta");
      expect(Array.isArray(response.body.items)).toBe(true);
    });
  });

  describe("POST /api/meetings/:id/checkin", () => {
    it("should return 401 without authorization", async () => {
      if (!meetingId) {
        // Se não tem meetingId, pula o teste
        return;
      }
      await request(app)
        .post(`/api/meetings/${meetingId}/checkin`)
        .expect(401);
    });

    it("should return 403 for non-member role", async () => {
      if (!meetingId) return;
      await request(app)
        .post(`/api/meetings/${meetingId}/checkin`)
        .set("Authorization", "Bearer admin:123")
        .expect(403);
    });

    it("should register check-in for member", async () => {
      if (!meetingId) return;
      const response = await request(app)
        .post(`/api/meetings/${meetingId}/checkin`)
        .set("Authorization", "Bearer member:123")
        .send({ status: "present" })
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("status", "PRESENT");
    });
  });
});

