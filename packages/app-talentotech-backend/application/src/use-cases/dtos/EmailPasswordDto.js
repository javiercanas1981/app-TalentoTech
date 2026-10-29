import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class EmailPasswordDto {}

const prototype = EmailPasswordDto.prototype;

ApiProperty({ type: String, format: "email" })(prototype, "email");
IsEmail()(prototype, "email");

ApiProperty({ type: String, minLength: 6 })(prototype, "password");
IsString()(prototype, "password");
IsNotEmpty()(prototype, "password");
MinLength(6)(prototype, "password");
