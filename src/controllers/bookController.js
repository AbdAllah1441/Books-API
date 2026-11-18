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
      status: status || "WANT_TO_READ",
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

const removeFromLibrary = async (req, res) => {
  const { bookId } = req.params;

  const entry = await prisma.userBook.findUnique({
    where: {
      userId_bookId: {
        userId: req.user.id,
        bookId,
      },
    },
  });
  if (!entry) {
    return res.status(404).json({ message: "Book not in your library" });
  }

  await prisma.userBook.delete({
    where: { id: entry.id },
  });

  res.json({ message: "Book removed from library" });
};

const createBook = async (req, res) => {
  const {
    title,
    description,
    isbn,
    publishedAt,
    pages,
    cover,
    genre,
    authorIds,
  } = req.body;

  if (!title) {
    return res.status(400).json({ message: "title is required" });
  }

  if (authorIds?.length) {
    const authors = await prisma.author.findMany({
      where: { id: { in: authorIds } },
      select: { id: true },
    });
    if (authors.length !== authorIds.length) {
      return res.status(400).json({ message: "One or more authorIds are invalid" });
    }
  }

  const book = await prisma.book.create({
    data: {
      title,
      description: description || undefined,
      isbn: isbn || undefined,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      pages: pages === "" || pages == null ? undefined : Number(pages),
      cover: cover || undefined,
      genre: genre?.length ? genre : [],
      ...(authorIds?.length
        ? { author: { connect: authorIds.map((id) => ({ id })) } }
        : {}),
    },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

  res.status(201).json({
    message: "Book added to catalog",
    book,
  });
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  await prisma.book.delete({ where: { id } });

  res.json({ message: "Book deleted from catalog" });
};

export {
  getAllBooks,
  addToLibrary,
  getMyBooks,
  removeFromLibrary,
  createBook,
  deleteBook,
};
