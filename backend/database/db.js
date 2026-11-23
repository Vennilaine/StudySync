
const Database = require('better-sqlite3')
const path = require('path')

// Tietokanta tallennetaan database-kansioon
const db = new Database(
  path.join(__dirname, 'studysync.db')
)

// Otetaan viiteavainten tarkistus käyttöön
db.pragma('foreign_keys = ON')

// Käyttäjät
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  )
`)

// Ryhmät
db.exec(`
  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )
`)

// Ryhmien jäsenet
db.exec(`
  CREATE TABLE IF NOT EXISTS group_members (
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`)

// Kalenteritapahtumat
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    start TEXT NOT NULL,
    end TEXT NOT NULL,
    type TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`)

// Tapahtumien jakaminen ryhmille
db.exec(`
  CREATE TABLE IF NOT EXISTS event_groups (
    event_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    PRIMARY KEY (event_id, group_id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
  )
`)

console.log('StudySync-tietokanta valmis!')

module.exports = db
