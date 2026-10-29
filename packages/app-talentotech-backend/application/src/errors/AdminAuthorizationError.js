export class AdminAuthorizationError extends Error {
  constructor() {
    super("No tienes permisos de administrador para realizar esta acción.");
    this.name = "AdminAuthorizationError";
  }
}
