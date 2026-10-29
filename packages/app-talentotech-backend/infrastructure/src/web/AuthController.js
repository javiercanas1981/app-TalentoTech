export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login(credentials) {
    return this.authService.signIn(credentials);
  }

  register(credentials) {
    return this.authService.register(credentials);
  }

  session(request) {
    return { user: request.user };
  }
}
