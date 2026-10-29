import { afterEach, describe, expect, test, vi } from "vitest";
import { register, signIn } from "./AuthService";

function mockResponse(body, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    statusText: "Request failed",
    text: vi.fn().mockResolvedValue(JSON.stringify(body)),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AuthService", () => {
  test("submits email and password to backend login and registration endpoints", async () => {
    const session = {
      user: { uid: "user-1", email: "person@example.com" },
      idToken: "firebase-id-token",
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(mockResponse(session))
      .mockResolvedValueOnce(mockResponse(session));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      signIn("person@example.com", "password123"),
    ).resolves.toEqual(session);
    await expect(
      register("person@example.com", "password123"),
    ).resolves.toEqual(session);

    const expectedRequest = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "person@example.com",
        password: "password123",
      }),
    };
    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/auth/login", expectedRequest);
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/auth/register", expectedRequest);
  });
});
