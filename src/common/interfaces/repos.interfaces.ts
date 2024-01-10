import { CreateFileInput } from "src/services/file.service"
import { CreateUserDTO } from "../dtos/user.dtos"
import {
    IFile,
    IFileHistory,
    IFolder,
    IReview,
    IUser,
} from "./entities.interfaces"

export interface IUserRepository {
    create(createUserDto: CreateUserDTO): Promise<IUser>
    findAll(): Promise<IUser[]>
    findByEmail(email: string): Promise<IUser | null>
}

export interface IFileRepository {
    create(fileInput: CreateFileInput): Promise<IFile>
    findAll(where?: {}): Promise<IFile[]>
    findById(id: string): Promise<IFile | null>
    findByIds(ids: string[]): Promise<IFile[]>
    findByKey(key: string): Promise<IFile | null>
    findByKeys(keys: string[]): Promise<IFile[]>
    update(file: IFile, update: {}): Promise<IFile>
    findHistory(fileId: string): Promise<IFileHistory[]>
    updateMany(condition: Partial<IFile>, update: Partial<IFile>): Promise<{}>
}

export interface IFolderRepository {
    findAll(): Promise<IFolder[]>
    findById(id: string): Promise<IFolder | null>
    findByName(name: string): Promise<IFolder | null>
    create(name: string, files?: IFile[]): Promise<IFolder>
    addFiles(files: IFile[], folder: IFolder): Promise<IFolder>
    removeFile(fileId: string, folder: IFolder): Promise<IFolder>
}

export interface IReviewRepository {
    findOne(where: Partial<IReview>): Promise<IReview | null>
    findMany(where: Partial<IReview>): Promise<IReview[]>
    create(input: {
        comment?: string
        fileId: string
        reviewerId: string
    }): Promise<IReview>
    getFilesReviewedMoreThanTimes(times: number): Promise<{ fileId: string }[]>
}
