import { describe, expect, jest, test } from "@jest/globals";
import {
  FirestoreUserRepository,
  normalizeUserProfile,
} from "./FirestoreUserRepository.js";

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

  test("reads user profiles using the Admin SDK document API", async () => {
    const document = {
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({ name: "Admin", role: "admin" }),
      }),
    };
    const firestore = {
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue(document),
      }),
    };

    await expect(
      new FirestoreUserRepository(firestore).getById("admin-1"),
    ).resolves.toEqual({
      uid: "admin-1",
      name: "Admin",
      role: "admin",
    });
    expect(firestore.collection).toHaveBeenCalledWith("users");
  });

  test("creates user profiles with a server timestamp", async () => {
    const document = { set: jest.fn().mockResolvedValue(undefined) };
    const firestore = {
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue(document),
      }),
    };
    const profile = { name: "User", email: "user@example.com", role: "user" };

    await expect(
      new FirestoreUserRepository(firestore).create("user-1", profile),
    ).resolves.toEqual({ uid: "user-1", ...profile });
    expect(document.set).toHaveBeenCalledWith(
      expect.objectContaining({
        ...profile,
        createdAt: expect.anything(),
      }),
    );
  });
});
