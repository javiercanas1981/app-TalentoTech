import { Inject, UnauthorizedException } from "@nestjs/common";
import { AdminAuthorizationUseCase } from "../../../application/src/use-cases/AdminAuthorizationUseCase.js";

export class AdminRoleGuard {
  constructor(adminAuthorizationUseCase) {
    this.adminAuthorizationUseCase = adminAuthorizationUseCase;
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    if (!request.user?.uid) {
      throw new UnauthorizedException("Se requiere una sesión válida.");
    }

    await this.adminAuthorizationUseCase.execute(request.user.uid);
    return true;
  }
}

Inject(AdminAuthorizationUseCase)(AdminRoleGuard, undefined, 0);
