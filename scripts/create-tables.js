const { Client } = require('pg');

require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const createUser = `
  CREATE TABLE IF NOT EXISTS Users (
    username  VARCHAR PRIMARY KEY  NOT NULL,
    rank      INTEGER,
    credits   INTEGER NOT NULL DEFAULT 0,
    votes     INTEGER NOT NULL DEFAULT 0,
    optout    BOOL NOT NULL DEFAULT FALSE,
    createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
    updatedAt DATE NOT NULL DEFAULT CURRENT_DATE
  )
`

const createVote = `
  CREATE TABLE IF NOT EXISTS Votes (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username  VARCHAR NOT NULL,
    votes     INT NOT NULL DEFAULT 0,
    votedBy   VARCHAR NOT NULL,
    createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
    updatedAt DATE NOT NULL DEFAULT CURRENT_DATE
  )
`

const listTables = `
     SELECT table_schema,table_name 
     FROM information_schema.tables where table_name in ($1, $2, $3, $4)`;
const values = ['SequelizeMeta', 'Session', 'Users', 'Votes']

client.connect();

async function createTables () {
  let res = await client.query(createUser)
  res = await client.query(createVote)
  const { rows } = await client.query(listTables, values)
  console.log(rows)
}


createTables()
  .then(() => console.log('done'))
  .catch(e => console.log(e))
  .finally(() => client.end())
