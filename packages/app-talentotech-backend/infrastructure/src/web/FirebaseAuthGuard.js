import { Inject, UnauthorizedException } from "@nestjs/common";
import { FirebaseAuthService } from "./FirebaseAuthService.js";

export class FirebaseAuthGuard {
  constructor(authService) {
    this.authService = authService;
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization ?? "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);

    if (!match) {
      throw new UnauthorizedException("Se requiere una sesión válida.");
    }

    request.user = await this.authService.verifyIdToken(match[1]);
    return true;
  }
}

Inject(FirebaseAuthService)(FirebaseAuthGuard, undefined, 0);
