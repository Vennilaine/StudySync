const express = require('express')
const cors = require('cors')
const db = require('./database/db')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const crypto = require('node:crypto')
const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
const PORT = 3001

// Mahdollistaa JSON-muotoisten tietojen vastaanottamisen
app.use(express.json())

app.use(session({
  name: 'studysync.sid',
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}))


// Palvelimen ensimmäinen testireitti
app.get('/api', (req, res) => {
  res.json({
    message: 'StudySync backend toimii!'
  })
})

// Käynnistetään palvelin
app.get('/api/database-test', (req, res) => {
  try {
    const result = db.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).all()

    res.json({
      message: 'Tietokantayhteys toimii!',
      tables: result.map(table => table.name)
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Tietokantayhteydessä tapahtui virhe'
    })
  }
})
 // Hae kaikki ryhmät

app.get('/api/groups', (req, res) => {
  const userId = req.session.userId

  if (!userId) {
    return res.status(401).json({
      error: 'Kirjaudu sisään nähdäksesi ryhmäsi.'
    })
  }

  try {
    const groups = db.prepare(`
      SELECT g.id, g.name
      FROM groups g
      JOIN group_members gm ON gm.group_id = g.id
      WHERE gm.user_id = ?
      ORDER BY g.id DESC
    `).all(userId)

    res.json(groups)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Ryhmien hakeminen epäonnistui.'
    })
  }
})


// Luo uusi ryhmä

app.post('/api/groups', (req, res) => {
  const userId = req.session.userId

  if (!userId) {
    return res.status(401).json({
      error: 'Kirjaudu sisään luodaksesi ryhmän.'
    })
  }

  const name = req.body.name?.trim()

  if (!name) {
    return res.status(400).json({
      error: 'Ryhmän nimi puuttuu.'
    })
  }

  try {
    const group = db.transaction(() => {
      const result = db.prepare(`
        INSERT INTO groups (name, created_by)
        VALUES (?, ?)
      `).run(name, userId)

      db.prepare(`
        INSERT INTO group_members (group_id, user_id)
        VALUES (?, ?)
      `).run(result.lastInsertRowid, userId)

      return {
        id: Number(result.lastInsertRowid),
        name
      }
    })()

    res.status(201).json(group)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Ryhmän luominen epäonnistui.'
    })
  }
})

app.post('/api/groups/:id/members', (req, res) => {
  const userId = req.session.userId

  if (!userId) {
    return res.status(401).json({
      error: 'Kirjaudu sisään lisätäksesi jäseniä.'
    })
  }

  const groupId = Number(req.params.id)
  const email = req.body.email?.trim().toLowerCase()

  if (!Number.isSafeInteger(groupId) || groupId <= 0 || !email) {
    return res.status(400).json({
      error: 'Ryhmän tunnus tai sähköposti puuttuu.'
    })
  }

  try {
    const membership = db.prepare(`
      SELECT 1 FROM group_members
      WHERE group_id = ? AND user_id = ?
    `).get(groupId, userId)

    if (!membership) {
      return res.status(403).json({
        error: 'Et kuulu tähän ryhmään.'
      })
    }

    const user = db.prepare(`
      SELECT id, username FROM users WHERE email = ?
    `).get(email)

    if (!user) {
      return res.status(404).json({
        error: 'Käyttäjää ei löytynyt.'
      })
    }

    const existing = db.prepare(`
      SELECT 1 FROM group_members
      WHERE group_id = ? AND user_id = ?
    `).get(groupId, user.id)

    if (existing) {
      return res.status(409).json({
        error: 'Käyttäjä kuuluu jo ryhmään.'
      })
    }

    db.prepare(`
      INSERT INTO group_members (group_id, user_id)
      VALUES (?, ?)
    `).run(groupId, user.id)

    res.status(201).json({
      message: 'Käyttäjä lisätty ryhmään.',
      user: {
        id: user.id,
        username: user.username
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Jäsenen lisääminen epäonnistui.'
    })
  }
})

//ryhmän jäsenten hakeminen

app.get('/api/groups/:id/members', (req, res) => {
  const userId = req.session.userId

  if (!userId) {
    return res.status(401).json({
      error: 'Kirjaudu sisään nähdäksesi jäsenet.'
    })
  }

  const groupId = Number(req.params.id)

  if (!Number.isSafeInteger(groupId) || groupId <= 0) {
    return res.status(400).json({
      error: 'Virheellinen ryhmän tunnus.'
    })
  }

  try {
    const membership = db.prepare(`
      SELECT 1 FROM group_members
      WHERE group_id = ? AND user_id = ?
    `).get(groupId, userId)

    if (!membership) {
      return res.status(403).json({
        error: 'Et kuulu tähän ryhmään.'
      })
    }

    const members = db.prepare(`
      SELECT u.id, u.username
      FROM users u
      JOIN group_members gm ON gm.user_id = u.id
      WHERE gm.group_id = ?
      ORDER BY u.username
    `).all(groupId)

    res.json(members)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Jäsenten hakeminen epäonnistui.'
    })
  }
})

// ryhmästä poistuminen

app.delete('/api/groups/:id/members/me', (req, res) => {
  const userId = req.session.userId

  if (!userId) {
    return res.status(401).json({
      error: 'Kirjaudu sisään poistuaksesi ryhmästä.'
    })
  }

  const groupId = Number(req.params.id)

  if (!Number.isSafeInteger(groupId) || groupId <= 0) {
    return res.status(400).json({
      error: 'Virheellinen ryhmän tunnus.'
    })
  }

  try {
    const result = db.prepare(`
      DELETE FROM group_members
      WHERE group_id = ? AND user_id = ?
    `).run(groupId, userId)

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Et kuulu tähän ryhmään.'
      })
    }

    res.json({
      message: 'Poistuit ryhmästä onnistuneesti.'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Ryhmästä poistuminen epäonnistui.'
    })
  }
})



app.post('/api/events', (req, res) => {
  try {
    const { title, date, start, end, type, groupIds = [] } = req.body

    if (!title?.trim() || !date || !start || !end || !type) {
      return res.status(400).json({
        error: 'Tapahtuman tiedot puuttuvat'
      })
    }

    if (end <= start) {
      return res.status(400).json({
        error: 'Päättymisajan täytyy olla alkamisajan jälkeen'
      })
    }

    if (
      !Array.isArray(groupIds) ||
      !groupIds.every(id => Number.isInteger(id) && id > 0)
    ) {
      return res.status(400).json({
        error: 'Virheelliset ryhmätunnukset'
      })
    }

    const userId = req.session.userId

if (!userId) {
  return res.status(401).json({
    error: 'Kirjaudu sisään lisätäksesi tapahtuman.'
  })
}

const checkMembership = db.prepare(`
  SELECT 1
  FROM group_members
  WHERE group_id = ? AND user_id = ?
`)

for (const groupId of new Set(groupIds)) {
  const membership = checkMembership.get(groupId, userId)

  if (!membership) {
    return res.status(403).json({
      error: 'Et kuulu johonkin valituista ryhmistä.'
    })
  }
}

    const saveEvent = db.transaction(() => {
      const result = db.prepare(`
        INSERT INTO events (user_id, title, date, start, end, type)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(userId, title.trim(), date, start, end, type)

      const eventId = Number(result.lastInsertRowid)

      const insertGroup = db.prepare(`
        INSERT INTO event_groups (event_id, group_id)
        VALUES (?, ?)
      `)

      for (const groupId of new Set(groupIds)) {
        insertGroup.run(eventId, groupId)
      }

      return eventId
    })

    const eventId = saveEvent()

    res.status(201).json({
      id: eventId,
      user_id: userId,
      title: title.trim(),
      date,
      start,
      end,
      type,
      groupIds: [...new Set(groupIds)]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Tapahtuman tallentaminen epäonnistui'
    })
  }
})

app.get('/api/events', (req, res) => {
  try {
    const userId = req.session.userId

if (!userId) {
  return res.status(401).json({
    error: 'Kirjaudu sisään nähdäksesi tapahtumasi.'
  })
}

    
const events = db.prepare(`
  SELECT DISTINCT
    e.id, e.user_id, e.title, e.date,
    e.start, e.end, e.type
  FROM events e
  WHERE e.user_id = ?
     OR EXISTS (
       SELECT 1
       FROM event_groups eg
       JOIN group_members gm
         ON gm.group_id = eg.group_id
       WHERE eg.event_id = e.id
         AND gm.user_id = ?
     )
  ORDER BY e.date, e.start
`).all(userId, userId)


    const getEventGroups = db.prepare(`
      SELECT group_id
      FROM event_groups
      WHERE event_id = ?
    `)

    const eventsWithGroups = events.map(event => ({
      ...event,
      groupIds: getEventGroups
        .all(event.id)
        .map(group => group.group_id)
    }))

    res.json(eventsWithGroups)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Tapahtumien hakeminen epäonnistui'
    })
  }
})

app.delete('/api/events/:id', (req, res) => {
  try {
    const eventId = Number(req.params.id)
   const userId = req.session.userId

if (!userId) {
  return res.status(401).json({
    error: 'Kirjaudu sisään poistaaksesi tapahtuman.'
  })
}

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        error: 'Virheellinen tapahtumatunnus'
      })
    }

    const deleteEventFromDb = db.transaction(() => {
      const event = db.prepare(`
        SELECT id FROM events
        WHERE id = ? AND user_id = ?
      `).get(eventId, userId)

      if (!event) return false

      db.prepare(`
        DELETE FROM event_groups WHERE event_id = ?
      `).run(eventId)

      db.prepare(`
        DELETE FROM events
        WHERE id = ? AND user_id = ?
      `).run(eventId, userId)

      return true
    })

    const deleted = deleteEventFromDb()

    if (!deleted) {
      return res.status(404).json({
        error: 'Tapahtumaa ei löytynyt'
      })
    }

    res.json({ message: 'Tapahtuma poistettu' })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Tapahtuman poistaminen epäonnistui'
    })
  }
})

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        error: 'Anna käyttäjänimi, sähköposti ja vähintään 8 merkin salasana.'
      })
    }

    const cleanUsername = username.trim()
    const cleanEmail = email.trim().toLowerCase()

    const existingUser = db.prepare(`
      SELECT id FROM users
      WHERE username = ? OR email = ?
    `).get(cleanUsername, cleanEmail)

    if (existingUser) {
      return res.status(409).json({
        error: 'Käyttäjänimi tai sähköposti on jo käytössä.'
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const result = db.prepare(`
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `).run(cleanUsername, cleanEmail, passwordHash)

    res.status(201).json({
      id: result.lastInsertRowid,
      username: cleanUsername,
      email: cleanEmail
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Rekisteröityminen epäonnistui.'
    })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: 'Anna sähköposti ja salasana.'
      })
    }

    const user = db.prepare(`
      SELECT id, username, email, password_hash
      FROM users
      WHERE email = ?
    `).get(email.trim().toLowerCase())

    if (!user) {
      return res.status(401).json({
        error: 'Virheellinen sähköposti tai salasana.'
      })
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!passwordCorrect) {
      return res.status(401).json({
        error: 'Virheellinen sähköposti tai salasana.'
      })
    }

    
req.session.regenerate((error) => {
  if (error) {
    console.error(error)
    return res.status(500).json({
      error: 'Kirjautumisistunnon luominen epäonnistui.'
    })
  }

  req.session.userId = user.id

  req.session.save((error) => {
    if (error) {
      console.error(error)
      return res.status(500).json({
        error: 'Kirjautumisistunnon tallentaminen epäonnistui.'
      })
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email
    })
  })
})


  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Kirjautuminen epäonnistui.'
    })
  }
})

app.get('/api/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      error: 'Et ole kirjautunut sisään.'
    })
  }

  const user = db.prepare(`
    SELECT id, username, email
    FROM users
    WHERE id = ?
  `).get(req.session.userId)

  if (!user) {
    return res.status(401).json({
      error: 'Käyttäjää ei löytynyt.'
    })
  }

  res.json(user)
})

app.post('/api/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error)
      return res.status(500).json({
        error: 'Uloskirjautuminen epäonnistui.'
      })
    }

    res.clearCookie('studysync.sid')
    res.json({
      message: 'Uloskirjautuminen onnistui.'
    })
  })
})

app.listen(PORT, () => {
  console.log(`StudySync backend käynnissä: http://localhost:${PORT}`)
})