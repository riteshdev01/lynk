import wrapAsync from "../utils/tryCatchWrapper.js"
import { deleteUserUrlByIdDao, getAllUserUrlsDao } from "../dao/user.dao.js"
import { NotFoundError } from "../utils/errorHandler.js"

export const getAllUserUrls = wrapAsync(async (req, res) => {
    const {_id} = req.user
    const urls = await getAllUserUrlsDao(_id)
    res.status(200).json({message:"success",urls})
})

export const deleteUserUrl = wrapAsync(async (req, res) => {
    const { _id } = req.user
    const { urlId } = req.params

    const deletedUrl = await deleteUserUrlByIdDao(urlId, _id)
    if (!deletedUrl) {
        throw new NotFoundError("URL not found")
    }

    res.status(200).json({ message: "URL deleted" })
})