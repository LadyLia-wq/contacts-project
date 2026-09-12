require('dotenv').config();
const { MongoClient } = require('mongodb');

// TODO: replace these with real contacts (classmates or people you know),
// per the assignment instructions.
const contacts = [
  {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    favoriteColor: 'Green',
    birthday: '1995-08-23',
  },
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    favoriteColor: 'Red',
    birthday: '2000-01-30',
  },
  {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    favoriteColor: 'Purple',
    birthday: '1998-11-05',
  },
];

const run = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('contacts').insertMany(contacts);
    console.log(`Inserted ${result.insertedCount} contacts.`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};

run();
