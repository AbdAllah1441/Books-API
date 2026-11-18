import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getAllAuthors,
  createAuthor,
  deleteAuthor,
} from "../controllers/authorController.js";

const router = express.Router();

router.get("/", getAllAuthors);

router.use(authMiddleware, adminMiddleware);

router.post("/", createAuthor);
router.delete("/:id", deleteAuthor);

export default router;
