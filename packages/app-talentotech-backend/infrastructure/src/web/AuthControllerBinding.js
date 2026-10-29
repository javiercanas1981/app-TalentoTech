import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { EmailPasswordDto } from "../../../application/src/use-cases/dtos/EmailPasswordDto.js";
import { RegisterDto } from "../../../application/src/use-cases/dtos/RegisterDto.js";
import { AuthController } from "./AuthController.js";
import { FirebaseAuthGuard } from "../guards/FirebaseAuthGuard.js";
import { FirebaseAuthService } from "../services/FirebaseAuthService.js";

const prototype = AuthController.prototype;

Controller("auth")(AuthController);
ApiTags("Authentication")(AuthController);
Inject(FirebaseAuthService)(AuthController, undefined, 0);

for (const [name, path, operation, dto] of [
  ["login", "login", "Sign in with email and password", EmailPasswordDto],
  ["register", "register", "Create an account with email and password", RegisterDto],
]) {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
  Post(path)(prototype, name, descriptor);
  Body()(prototype, name, 0);
  ApiOperation({ summary: operation })(prototype, name, descriptor);
  ApiBody({ type: dto })(prototype, name, descriptor);
  ApiResponse({
    status: 200,
    description: "Authenticated Firebase user and ID token",
  })(prototype, name, descriptor);
  ApiResponse({ status: 400, description: "Invalid credentials format" })(
    prototype,
    name,
    descriptor,
  );
  Reflect.defineMetadata(
    "design:paramtypes",
    [dto],
    prototype,
    name,
  );
}

const sessionDescriptor = Object.getOwnPropertyDescriptor(
  prototype,
  "session",
);
Get("session")(prototype, "session", sessionDescriptor);
Req()(prototype, "session", 0);
UseGuards(FirebaseAuthGuard)(prototype, "session", sessionDescriptor);
ApiBearerAuth()(prototype, "session", sessionDescriptor);
ApiOperation({ summary: "Verify the current Firebase ID token" })(
  prototype,
  "session",
  sessionDescriptor,
);
ApiResponse({ status: 200, description: "Authenticated user" })(
  prototype,
  "session",
  sessionDescriptor,
);
ApiResponse({ status: 401, description: "Invalid or expired ID token" })(
  prototype,
  "session",
  sessionDescriptor,
);
Reflect.defineMetadata("design:paramtypes", [Object], prototype, "session");

export { AuthController };
