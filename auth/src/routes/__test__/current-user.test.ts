import request from "supertest";
import { app } from "../../app";

it("signout gracefully", async () => {
  const cookie = await global.signin()

  if (!cookie) {
    throw new Error("Cookie not set after signup");
  }
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("random2@gmail.com");
});

it("respond with null when user is not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});