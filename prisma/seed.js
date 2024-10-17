const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.record.createMany({
    data: [
      {
        title: 'Abbey Road',
        artist: 'The Beatles',
        year: 1969,
        label: 'Apple Records',
        genre: 'Rock',
        cover: "/uploads/0cc0c3f86f513822aa99180aadf42e8d",
        rating: 5,
      },
      {
        title: 'Thriller',
        artist: 'Michael Jackson',
        year: 1982,
        label: 'Epic Records',
        genre: 'Pop',
        cover: null,
        rating: 5,
      },
      {
        title: 'Kind of Blue',
        artist: 'Miles Davis',
        year: 1959,
        label: 'Columbia Records',
        genre: 'Jazz',
        cover: null,
        rating: 5,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
