import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getAllBooks,
  addToLibrary,
  getMyBooks,
  removeFromLibrary,
  createBook,
  deleteBook,
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getAllBooks);

router.use(authMiddleware);

router.get("/mine", getMyBooks);
router.post("/", addToLibrary);
router.delete("/mine/:bookId", removeFromLibrary);

router.use(adminMiddleware);

router.post("/catalog", createBook);
router.delete("/catalog/:id", deleteBook);

export default router;
