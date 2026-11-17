import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const books = [
  {
    title: "The Hobbit",
    author: {
      id: "2eb8860a-5c53-47de-a7bb-18ddfc76679f",
      name: "J. R. R. Tolkien",
      bio: "English writer and philologist, best known for The Hobbit and The Lord of the Rings.",
    },
    description:
      "Bilbo Baggins leaves his quiet life behind when a wizard and a group of dwarves recruit him for a dangerous quest.",
    isbn: "978-0-261-10221-7",
    publishedAt: new Date("1937-09-21T00:00:00.000Z"),
    pages: 310,
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    genre: ["Fantasy", "Adventure"],
  },
  {
    title: "Pride and Prejudice",
    author: {
      id: "2f9fb474-6e39-44e1-a6ed-a3280c99e2a8",
      name: "Jane Austen",
      bio: "English novelist known for her observations of social class and relationships.",
    },
    description:
      "A sharp and witty novel about love, class, and first impressions in Regency-era England.",
    isbn: "978-0-14-143951-8",
    publishedAt: new Date("1813-01-28T00:00:00.000Z"),
    pages: 432,
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
    genre: ["Classic", "Romance"],
  },
  {
    title: "The Alchemist",
    author: {
      id: "be6d0f15-f64c-4c8a-9b89-9d99ac335f9e",
      name: "Paulo Coelho",
      bio: "Brazilian novelist known for philosophical and spiritual themes.",
    },
    description:
      "A shepherd boy follows a mysterious journey toward his personal legend and the meaning of destiny.",
    isbn: "978-0-06-112241-1",
    publishedAt: new Date("1988-01-01T00:00:00.000Z"),
    pages: 208,
    cover:
      "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=800&q=80",
    genre: ["Fiction", "Adventure"],
  },
  {
    title: "The Book Thief",
    author: {
      id: "c727c558-a88c-431c-b278-0098274a4612",
      name: "Markus Zusak",
      bio: "Australian author known for The Book Thief and I Am the Messenger.",
    },
    description:
      "In Nazi Germany, a young girl finds comfort in stealing books and sharing them with others.",
    isbn: "978-0-375-83100-1",
    publishedAt: new Date("2005-09-01T00:00:00.000Z"),
    pages: 552,
    cover:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    genre: ["Historical Fiction", "Drama"],
  },
];

async function main() {
  for (const { author, ...book } of books) {
    // eslint-disable-next-line no-await-in-loop
    const savedAuthor = await prisma.author.upsert({
      where: { id: author.id },
      create: author,
      update: {
        name: author.name,
        bio: author.bio,
      },
    });
    // eslint-disable-next-line no-await-in-loop
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      create: {
        ...book,
        author: { connect: { id: savedAuthor.id } },
      },
      update: {
        ...book,
        author: { connect: { id: savedAuthor.id } },
      },
    });
  }

  console.log(`Seeded ${books.length} books and authors successfully.`);
}

main()
  .catch((error) => {
    console.error("Error seeding books:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
