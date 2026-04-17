import express from "express"
import { deleteUserUrl, getAllUserUrls } from "../controller/user.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/urls",authMiddleware, getAllUserUrls)
router.delete("/urls/:urlId", authMiddleware, deleteUserUrl)

export default router