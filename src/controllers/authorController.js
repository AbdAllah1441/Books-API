import { prisma } from "../config/db.js";

const getAllAuthors = async (_req, res) => {
  const authors = await prisma.author.findMany({
    select: {
      id: true,
      name: true,
      bio: true,
    },
    orderBy: { name: "asc" },
  });

  res.json({ authors });
};

const createAuthor = async (req, res) => {
  const { name, bio, userId } = req.body;

  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ message: "userId is invalid" });
    }

    const existingProfile = await prisma.author.findUnique({
      where: { userId },
    });
    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "User already has an author profile" });
    }
  }

  const author = await prisma.author.create({
    data: {
      name,
      bio: bio || undefined,
      ...(userId ? { userId } : {}),
    },
  });

  res.status(201).json({
    message: "Author created",
    author,
  });
};

const deleteAuthor = async (req, res) => {
  const { id } = req.params;

  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  await prisma.author.delete({ where: { id } });

  res.json({ message: "Author deleted" });
};

export { getAllAuthors, createAuthor, deleteAuthor };
