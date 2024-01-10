import { UserRole } from "../../entities/user.entity"

export interface IUser {
    id: string
    email: string
    firstName: string
    lastName: string
    password?: string
    dateJoined: Date

    role: UserRole

    save(): Promise<IUser>
}

export interface IFile {
    id: string
    originalName: string
    mimeType: string
    size: number
    location: string
    deletedAt: Date
    key: string
    createdAt: Date

    safe: Boolean
}

export interface IFileHistory {
    id: string
    originalName: string
    versionNumber: number
    fileId: string
    file?: IFile
    size: number
    location: string
    deletedAt: Date
    key: string
    createdAt: Date

    safe: Boolean
}

export interface IFolder {
    id: string
    name: string
    files: IFile[]
}

export interface IReview {
    id: string
    file: IFile
    fileId: string
    reviewerId: string
    reviewer: IUser
    comment?: string
    safe: boolean
    deletedAt: Date
    createdAt: Date
}
