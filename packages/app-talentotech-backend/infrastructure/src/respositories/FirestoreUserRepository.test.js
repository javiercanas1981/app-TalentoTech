import { describe, expect, test } from "@jest/globals";
import { normalizeUserProfile } from "./FirestoreUserRepository.js";

describe("FirestoreUserRepository", () => {
  test("maps the legacy rol field to the application role property", async () => {
    expect(normalizeUserProfile("admin-1", { name: "Admin", rol: "admin" })).toEqual({
      uid: "admin-1",
      name: "Admin",
      rol: "admin",
      role: "admin",
    });
  });

  test("defaults profiles without a role to a regular user", () => {
    expect(normalizeUserProfile("user-1", { name: "User" })).toEqual({
      uid: "user-1",
      name: "User",
      role: "user",
    });
  });
});
