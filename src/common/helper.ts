import { Response } from "express"

export default class Helper {
    static formatResponse(
        res: Response,
        message: string,
        data?: any,
        status: number = 200
    ) {
        return res.status(status).send({
            status: "success",
            message,
            data,
        })
    }

    // static handleError(res: Response, error: any) {
    //     console.log("error", error)
    //     if (error.status) {
    //         return res.status(error.status).send({
    //             status: "failed",
    //             message: error.message,
    //             data: {},
    //         })
    //     }
    //     return res.status(500).send({
    //         status: "failed",
    //         message: error.message,
    //         data: {},
    //     })
    // }
}
