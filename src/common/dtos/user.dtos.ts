import { IsEmail, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDTO {
    @IsEmail()
    email!: string

    @IsStrongPassword()
    password!: string

    @IsString()
    firstName!: string

    @IsString()
    lastName!: string

    @IsString()
    roleId: string
}

export class CreateSuperAdminDTO {
    @IsEmail()
    email!: string

    @IsStrongPassword()
    password!: string

    @IsString()
    firstName!: string

    @IsString()
    lastName!: string

    @IsString()
    companyName: string
}
