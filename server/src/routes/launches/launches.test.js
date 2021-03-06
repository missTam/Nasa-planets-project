const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => { // we group describe blocks to add a setup step

  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  })

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200); // making a request on a passed in app server
    });
  });

  describe("Test POST /launch", () => {
    const launchData = {
      mission: "Runaway",
      rocket: "My fancy rocket",
      target: "Kepler-62 f",
      launchDate: "September 25, 2090",
    };

    const launchDataWithoutDate = {
      mission: "Runaway",
      rocket: "My fancy rocket",
      target: "Kepler-62 f",
    };

    const launchDataWithInvalidDate = {
      mission: "Runaway",
      rocket: "My fancy rocket",
      target: "Kepler-62 f",
      launchDate: "invalid date",
    };

    test("It should respond with 201 success", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(launchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(requestDate).toBe(responseDate);

      // partial object match
      expect(response.body).toMatchObject(launchDataWithoutDate); // because dates format don't match, one is JS Date, the other string
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      // exact object match assertion
      expect(response.body).toStrictEqual({
        error: "Missing required launch properties",
      });
    });

    test("It should catch invalid date values", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
