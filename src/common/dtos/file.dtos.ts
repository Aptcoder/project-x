import { IsArray, IsOptional, IsString, IsUUID } from "class-validator"

export class KeyDTO {
    @IsString()
    key: string
}
export class FileIdDTO {
    @IsString()
    @IsUUID("all")
    fileId: string
}

export class CreateFolderDTO {
    @IsString()
    name: string

    @IsArray()
    @IsOptional()
    files: string[] = []
}

export class AddFileToFolderBodyDTO {
    @IsArray()
    files: string
}

export class FolderParamDTO {
    @IsString()
    @IsUUID("all")
    folderId: string
}

export class RemoveFileParam extends FolderParamDTO {
    @IsString()
    @IsUUID("all")
    fileId: string
}

export class ReviewFileDTO {
    @IsString()
    @IsOptional()
    comment: string
}

export class UpdateFileDTO {
    @IsString()
    originalName: string
}
