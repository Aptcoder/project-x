import { CreateFileInput } from "src/services/file.service"
import { AuthUserDto, CreateUserDTO } from "../dtos/user.dtos"
import { IFile, IFileHistory, IFolder, IUser } from "./entities.interfaces"
import { CreateFolderDTO } from "../dtos/file.dtos"

export interface IUserService {
    createUser(createUserDto: CreateUserDTO): Promise<IUser>
    getUsers(): Promise<IUser[]>
    auth(
        authUserDto: AuthUserDto
    ): Promise<{ accessToken: string; user: Omit<IUser, "password"> }>
    logoutUser(userId: string): Promise<void>
}

export interface IFileService {
    createFile(input: CreateFileInput): Promise<IFile>
    getFiles(): Promise<IFile[]>
    getFile(id: string): Promise<IFile>
    getHistory(id: string): Promise<IFileHistory[]>
    markUnsafe(
        fileId: string,
        reviewerId: string,
        comment?: string
    ): Promise<IFile>
    update(
        fileId: string,
        update: {
            originalName: string
        }
    ): Promise<IFile>
}

export interface IFolderService {
    createFolder(input: CreateFolderDTO): Promise<IFolder>
    getFolders(): Promise<IFolder[]>
    addFiles(folderId: string, fileIds: string[]): Promise<IFolder>
    removeFile(folderId: string, fileId: string): Promise<IFolder>
    // getFolder(key: string): Promise<IFile>
}

export interface ILogger {
    info(msg: string): ILogger
    warn(msg: string): ILogger
    error(msg: string, meta?: {}): ILogger
}
