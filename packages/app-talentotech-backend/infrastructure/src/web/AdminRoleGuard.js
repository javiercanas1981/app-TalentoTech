import { Inject } from "@nestjs/common";
import { FirebaseAuthService } from "./FirebaseAuthService.js";

export class AdminRoleGuard {
  constructor(authService) {
    this.authService = authService;
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    await this.authService.requireAdmin(request.user);
    return true;
  }
}

Inject(FirebaseAuthService)(AdminRoleGuard, undefined, 0);
