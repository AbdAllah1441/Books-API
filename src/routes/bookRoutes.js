import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAllBooks,
  addToLibrary,
  getMyBooks,
  removeFromLibrary,
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getAllBooks);

router.use(authMiddleware);

router.get("/mine", getMyBooks);
router.post("/", addToLibrary);
router.delete("/mine/:bookId", removeFromLibrary);

export default router;
