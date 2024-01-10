import {
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
    IsStrongPassword,
    IsUUID,
} from "class-validator"
import { UserRole } from "../../entities/user.entity"

export class CreateUserDTO {
    @IsEmail()
    email!: string

    @IsStrongPassword()
    password!: string

    @IsString()
    firstName!: string

    @IsString()
    lastName!: string

    role?: UserRole
}

export class AuthUserDto {
    @IsEmail()
    email!: string

    @IsString()
    password!: string
}
