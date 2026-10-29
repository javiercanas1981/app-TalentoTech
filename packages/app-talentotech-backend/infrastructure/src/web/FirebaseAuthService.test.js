import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { UnauthorizedException } from "@nestjs/common";
import { FirebaseAuthService } from "./FirebaseAuthService.js";

const originalApiKey = process.env.API_KEY;

afterEach(() => {
  if (originalApiKey === undefined) {
    delete process.env.API_KEY;
  } else {
    process.env.API_KEY = originalApiKey;
  }
  jest.restoreAllMocks();
});

describe("FirebaseAuthService", () => {
  test("signs in through Firebase Authentication and returns a user session", async () => {
    process.env.API_KEY = "web-api-key";
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        localId: "user-1",
        email: "person@example.com",
        idToken: "firebase-id-token",
      }),
    });
    jest.spyOn(globalThis, "fetch").mockImplementation(fetchMock);

    await expect(
      new FirebaseAuthService().signIn({
        email: " person@example.com ",
        password: "password123",
      }),
    ).resolves.toEqual({
      user: {
        uid: "user-1",
        email: "person@example.com",
        displayName: "",
      },
      idToken: "firebase-id-token",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=web-api-key",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "person@example.com",
          password: "password123",
          returnSecureToken: true,
        }),
      }),
    );
  });

  test("rejects invalid ID tokens when verifying the session", async () => {
    process.env.API_KEY = "web-api-key";
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({
        error: { message: "INVALID_ID_TOKEN" },
      }),
    });

    await expect(
      new FirebaseAuthService().verifyIdToken("expired-token"),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  test("saves new user profiles with a non-admin default role", async () => {
    process.env.API_KEY = "web-api-key";
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        localId: "user-2",
        email: "person@example.com",
        idToken: "firebase-id-token",
      }),
    });
    const service = new FirebaseAuthService({});
    service.saveUserProfile = jest.fn().mockResolvedValue(undefined);

    await expect(
      service.register({
        email: "person@example.com",
        password: "password123",
        name: "Person Example",
        role: "admin",
      }),
    ).resolves.toMatchObject({
      user: {
        uid: "user-2",
        email: "person@example.com",
        displayName: "Person Example",
      },
    });

    expect(service.saveUserProfile).toHaveBeenCalledWith("user-2", {
      name: "Person Example",
      email: "person@example.com",
      role: "user",
    });
  });
});
