import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export class RegisterDto {}

const prototype = RegisterDto.prototype;

ApiProperty({ type: String, format: "email" })(prototype, "email");
IsEmail()(prototype, "email");

ApiProperty({ type: String, minLength: 6 })(prototype, "password");
IsString()(prototype, "password");
IsNotEmpty()(prototype, "password");
MinLength(6)(prototype, "password");

ApiProperty({ type: String, minLength: 1 })(prototype, "name");
IsString()(prototype, "name");
IsNotEmpty()(prototype, "name");
Matches(/\S/, { message: "name must not be blank" })(prototype, "name");
