import { FileHistory } from "../entities/file-history.entity"
import { IFile, IUser } from "../common/interfaces/entities.interfaces"
import { IFileRepository } from "../common/interfaces/repos.interfaces"
import { File } from "../entities/file.entity"
import { CreateFileInput } from "../services/file.service"
import { In, IsNull, Not } from "typeorm"

export default class FileRepository implements IFileRepository {
    async findById(id: string): Promise<IFile | null> {
        return File.findOne({
            where: {
                id,
            },
        })
    }
    async findByIds(ids: string[]): Promise<IFile[]> {
        const files = await File.find({
            where: {
                id: In(ids),
            },
        })
        return files
    }
    async create(fileData: CreateFileInput) {
        const file = File.create({
            ...fileData,
            originalName: fileData.originalname,
            mimeType: fileData.mimetype,
        })

        return file.save()
    }

    async findAll(where: any = {}): Promise<IFile[]> {
        return File.find({
            where: {
                ...where,
            },
        })
    }

    async findByKey(key: string): Promise<IFile | null> {
        const file = await File.findOne({
            where: {
                key,
            },
        })
        return file
    }

    async findByKeys(keys: string[]): Promise<IFile[]> {
        const files = await File.find({
            where: {
                key: In(keys),
            },
        })
        return files
    }

    async findHistory(fileId: string) {
        const history = await FileHistory.find({
            where: {
                fileId,
            },
        })

        return history
    }

    async update(file: IFile, update: {}): Promise<IFile> {
        let versionNumber = 1
        const recentHistory = await FileHistory.findOne({
            where: {
                fileId: file.id,
            },
            order: {
                versionNumber: "DESC",
            },
        })

        if (recentHistory) {
            versionNumber = recentHistory.versionNumber + 1
        }

        const fh = FileHistory.create({
            ...file,
            fileId: file.id,
            versionNumber,
            safe: !!file.safe,
        })

        await fh.save()

        Object.assign(file, update)
        return (file as File).save()
    }

    async updateMany(condition: {}, update: {}): Promise<{}> {
        const result = await File.update(condition, update)
        return result
    }
}
