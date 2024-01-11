import { IsArray, IsEnum, IsString } from "class-validator"
import permissions from "../permissions"

export class CreateRoleDTO {
    @IsString()
    name: string

    @IsArray()
    @IsEnum(permissions, {
        each: true,
    })
    permissions: string[]
}

export class CreateRoleParamDTO {
    @IsString()
    companyId: string
}
