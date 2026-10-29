import {
  Inject,
  ServiceUnavailableException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FIRESTORE } from "./tokens.js";

const IDENTITY_TOOLKIT_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts";

const getFirebaseErrorCode = (responseBody) =>
  responseBody?.error?.message?.split(/\s|:/, 1)[0] ?? "";

const getAuthError = (code, operation) => {
  if (
    code === "EMAIL_NOT_FOUND" ||
    code === "INVALID_PASSWORD" ||
    code === "INVALID_LOGIN_CREDENTIALS" ||
    code === "USER_DISABLED"
  ) {
    return new UnauthorizedException("Correo o contraseña incorrectos.");
  }
  if (code === "EMAIL_EXISTS") {
    return new ConflictException("Ya existe una cuenta con ese correo.");
  }
  if (code === "INVALID_EMAIL" || code === "MISSING_EMAIL") {
    return new BadRequestException("Ingresa un correo electrónico válido.");
  }
  if (code === "WEAK_PASSWORD") {
    return new BadRequestException("La contraseña debe tener al menos 6 caracteres.");
  }
  if (code === "TOO_MANY_ATTEMPTS_TRY_LATER") {
    return new HttpException(
      "Demasiados intentos. Espera un momento e inténtalo nuevamente.",
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
  if (
    code === "INVALID_ID_TOKEN" ||
    code === "TOKEN_EXPIRED" ||
    code === "USER_NOT_FOUND"
  ) {
    return new UnauthorizedException("La sesión no es válida o ha expirado.");
  }
  if (code === "OPERATION_NOT_ALLOWED") {
    return new ServiceUnavailableException(
      "Email y contraseña no están habilitados en Firebase Authentication.",
    );
  }
  if (
    code === "API_KEY_INVALID" ||
    code === "CONFIGURATION_NOT_FOUND" ||
    code === "PROJECT_NOT_FOUND"
  ) {
    return new ServiceUnavailableException(
      "Firebase Authentication no está configurado correctamente.",
    );
  }

  if (operation === "verify") {
    return new UnauthorizedException("La sesión no es válida o ha expirado.");
  }

  return new ServiceUnavailableException(
    "Firebase Authentication no pudo completar la solicitud.",
  );
};

export class FirebaseAuthService {
  constructor(firestore) {
    this.firestore = firestore;
  }

  async request(endpoint, body, operation) {
    const apiKey = process.env.API_KEY ?? process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      throw new ServiceUnavailableException(
        "Firebase no está configurado en el backend. Define API_KEY en su archivo .env.",
      );
    }

    let response;
    try {
      response = await fetch(
        `${IDENTITY_TOOLKIT_URL}:${endpoint}?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
    } catch (error) {
      throw new ServiceUnavailableException(
        "No se pudo conectar con Firebase Authentication.",
        { cause: error },
      );
    }

    let responseBody;
    try {
      responseBody = await response.json();
    } catch (error) {
      throw new ServiceUnavailableException(
        "Firebase Authentication devolvió una respuesta inválida.",
        { cause: error },
      );
    }

    if (!response.ok) {
      throw getAuthError(getFirebaseErrorCode(responseBody), operation);
    }

    return responseBody;
  }

  async signIn({ email, password }) {
    const result = await this.request(
      "signInWithPassword",
      { email: email.trim(), password, returnSecureToken: true },
      "login",
    );
    return this.toSession(result);
  }

  async register({ email, password, name }) {
    const result = await this.request(
      "signUp",
      { email: email.trim(), password, returnSecureToken: true },
      "register",
    );
    try {
      await this.saveUserProfile(result.localId, {
        name: name.trim(),
        email: result.email,
        role: "user",
      });
    } catch (error) {
      try {
        await this.request(
          "delete",
          { idToken: result.idToken },
          "delete",
        );
      } catch (rollbackError) {
        console.error(
          "No se pudo revertir la cuenta de Firebase tras fallar el perfil de Firestore:",
          rollbackError,
        );
      }

      throw new ServiceUnavailableException(
        "No se pudo completar el registro ni guardar el perfil en Firestore.",
        { cause: error },
      );
    }

    return this.toSession(result, name.trim());
  }

  saveUserProfile(uid, profile) {
    return setDoc(doc(this.firestore, "users", uid), {
      ...profile,
      createdAt: serverTimestamp(),
    });
  }

  async verifyIdToken(idToken) {
    const result = await this.request(
      "lookup",
      { idToken },
      "verify",
    );
    const firebaseUser = result.users?.[0];
    if (!firebaseUser) {
      throw new UnauthorizedException("La sesión no es válida o ha expirado.");
    }

    return {
      uid: firebaseUser.localId,
      email: firebaseUser.email ?? "",
      displayName: firebaseUser.displayName ?? "",
    };
  }

  toSession(result, displayName = result.displayName ?? "") {
    return {
      user: {
        uid: result.localId,
        email: result.email,
        displayName,
      },
      idToken: result.idToken,
    };
  }
}

Inject(FIRESTORE)(FirebaseAuthService, undefined, 0);
