const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hash the password for admin123
  const hashedPassword = await bcrypt.hash('123', 10);

  // Create the admin user
  const user = await prisma.user.create({
    data: {
      email: 'admin123@gmail.com',
      password: hashedPassword,
    },
  });

  // List of 20 well-known albums
  const albums = [
    { title: 'Thriller', artist: 'Michael Jackson', year: 1982, label: 'Epic', genre: 'Pop', rating: 5 },
    { title: 'Back in Black', artist: 'AC/DC', year: 1980, label: 'Atlantic', genre: 'Rock', rating: 4 },
    { title: 'The Dark Side of the Moon', artist: 'Pink Floyd', year: 1973, label: 'Harvest', genre: 'Rock', rating: 5 },
    { title: 'The Wall', artist: 'Pink Floyd', year: 1979, label: 'Harvest', genre: 'Rock', rating: 5 },
    { title: 'Abbey Road', artist: 'The Beatles', year: 1969, label: 'Apple', genre: 'Rock', rating: 5 },
    { title: 'Hotel California', artist: 'Eagles', year: 1976, label: 'Asylum', genre: 'Rock', rating: 4 },
    { title: 'Led Zeppelin IV', artist: 'Led Zeppelin', year: 1971, label: 'Atlantic', genre: 'Rock', rating: 5 },
    { title: 'Rumours', artist: 'Fleetwood Mac', year: 1977, label: 'Warner Bros.', genre: 'Rock', rating: 4 },
    { title: 'Purple Rain', artist: 'Prince', year: 1984, label: 'Warner Bros.', genre: 'Pop', rating: 4 },
    { title: 'Born in the U.S.A.', artist: 'Bruce Springsteen', year: 1984, label: 'Columbia', genre: 'Rock', rating: 4 },
    { title: 'The Joshua Tree', artist: 'U2', year: 1987, label: 'Island', genre: 'Rock', rating: 5 },
    { title: '21', artist: 'Adele', year: 2011, label: 'XL', genre: 'Pop', rating: 4 },
    { title: 'Nevermind', artist: 'Nirvana', year: 1991, label: 'DGC', genre: 'Grunge', rating: 5 },
    { title: 'Appetite for Destruction', artist: 'Guns N\' Roses', year: 1987, label: 'Geffen', genre: 'Rock', rating: 4 },
    { title: 'Bad', artist: 'Michael Jackson', year: 1987, label: 'Epic', genre: 'Pop', rating: 4 },
    { title: 'Sgt. Pepper\'s Lonely Hearts Club Band', artist: 'The Beatles', year: 1967, label: 'Parlophone', genre: 'Rock', rating: 5 },
    { title: 'Goodbye Yellow Brick Road', artist: 'Elton John', year: 1973, label: 'MCA', genre: 'Pop', rating: 4 },
    { title: 'The Eminem Show', artist: 'Eminem', year: 2002, label: 'Aftermath', genre: 'Hip-Hop', rating: 5 },
    { title: '25', artist: 'Adele', year: 2015, label: 'XL', genre: 'Pop', rating: 4 },
    { title: 'Hybrid Theory', artist: 'Linkin Park', year: 2000, label: 'Warner Bros.', genre: 'Nu Metal', rating: 4 },
  ];

  // Add albums to the user
  for (const album of albums) {
    await prisma.record.create({
      data: {
        ...album,
        userId: user.id, // Associate each album with the admin user
      },
    });
  }

  console.log('Database seeded with user admin123 and 20 albums');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
