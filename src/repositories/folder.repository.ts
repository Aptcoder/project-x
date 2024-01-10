import { IFile, IFolder, IUser } from "../common/interfaces/entities.interfaces"
import { IFolderRepository } from "../common/interfaces/repos.interfaces"
import { File } from "../entities/file.entity"
import { Folder } from "../entities/folder.entity"

export default class FolderRepository implements IFolderRepository {
    findById(id: string): Promise<IFolder | null> {
        return Folder.findOne({
            where: {
                id,
            },
            relations: ["files"],
        })
    }
    async create(name: string, files?: IFile[]) {
        const folder = Folder.create({
            name,
        })

        if (files) {
            folder.files = files as File[]
        }

        return folder.save()
    }

    async addFiles(files: IFile[], folder: IFolder) {
        folder.files = folder.files ? folder.files : []
        folder.files = folder.files.concat(files)
        return (folder as Folder).save()
    }

    async removeFile(fileId: string, folder: IFolder) {
        if (!folder.files) {
            return folder
        }

        folder.files = folder.files.filter((file) => {
            return file.id != fileId
        })
        return (folder as Folder).save()
    }

    async findAll(): Promise<IFolder[]> {
        return Folder.find({
            relations: ["files"],
        })
    }

    async findByName(name: string) {
        return Folder.findOne({
            where: {
                name,
            },
        })
    }
}
