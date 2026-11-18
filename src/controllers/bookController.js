import { prisma } from "../config/db.js";

const getAllBooks = async (_req, res) => {
  const books = await prisma.book.findMany({
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ books });
};

const addToLibrary = async (req, res) => {
  const { bookId, status } = req.body;

  if (!bookId) {
    return res.status(400).json({ message: "bookId is required" });
  }

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const alreadyAdded = await prisma.userBook.findUnique({
    where: {
      userId_bookId: {
        userId: req.user.id,
        bookId,
      },
    },
  });
  if (alreadyAdded) {
    return res.status(400).json({ message: "Book already in your library" });
  }

  const entry = await prisma.userBook.create({
    data: {
      userId: req.user.id,
      bookId,
      status: status ?? "WANT_TO_READ",
    },
    include: { book: true },
  });

  res.status(201).json({
    message: "Book added to library",
    book: entry.book,
    library: {
      id: entry.id,
      status: entry.status,
      rating: entry.rating,
      notes: entry.notes,
      currentPage: entry.currentPage,
    },
  });
};

const getMyBooks = async (req, res) => {
  const library = await prisma.userBook.findMany({
    where: { userId: req.user.id },
    include: {
      book: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    books: library.map(
      ({ book, userId, bookId, createdAt, updatedAt, ...libraryEntry }) => ({
        ...book,
        library: libraryEntry,
      }),
    ),
  });
};

export { getAllBooks, addToLibrary, getMyBooks };
