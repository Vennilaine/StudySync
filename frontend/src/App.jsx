import { useState, useEffect } from 'react'
import './App.css'

function App() {

const [addingMemberGroupId, setAddingMemberGroupId] = useState(null)
const [memberEmail, setMemberEmail] = useState('')
const [groupMembers, setGroupMembers] = useState({})

  const [currentUser, setCurrentUser] = useState(null)

const [isRegistering, setIsRegistering] = useState(false)

const [registerUsername, setRegisterUsername] = useState('')


const [loginEmail, setLoginEmail] = useState('')
const [loginPassword, setLoginPassword] = useState('')
const [loginError, setLoginError] = useState('')

const [checkingLogin, setCheckingLogin] = useState(true)

useEffect(() => {
  async function checkLogin() {
    try {
      const response = await fetch('http://localhost:3001/api/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const user = await response.json()
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    } catch (error) {
      console.error('Kirjautumistilan tarkistus epäonnistui:', error)
      setCurrentUser(null)
    } finally {
      setCheckingLogin(false)
    }
  }

  checkLogin()
}, [])

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('studysync-events')
    try {
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
const [groups, setGroups] = useState(() => {
  try {
    const saved = localStorage.getItem('studysync-groups')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
})
useEffect(() => {
  async function loadGroups() {
    try {
      const response = await fetch('http://localhost:3001/api/groups', {
  credentials: 'include'
})

      if (!response.ok) {
        throw new Error('Ryhmien hakeminen epäonnistui')
      }

      const data = await response.json()
      setGroups(data)

    } catch (error) {
      console.error(error)
      alert('Ryhmien hakeminen tietokannasta epäonnistui.')
    }
  }

  if (currentUser) {
    loadGroups()
  }
}, [currentUser])
useEffect(() => {
  async function loadEvents() {
    try {
      const response = await fetch('http://localhost:3001/api/events', {
  credentials: 'include'
})

      if (!response.ok) {
        throw new Error('Tapahtumien hakeminen epäonnistui')
      }

      const data = await response.json()
      setEvents(data)

    } catch (error) {
      console.error(error)
      alert('Tapahtumien hakeminen tietokannasta epäonnistui.')
    }
  }

  if (currentUser) {
    loadEvents()
  }
}, [currentUser])

useEffect(() => {
  if (!currentUser || groups.length === 0) {
    setGroupMembers({})
    return
  }

  let cancelled = false

  async function loadGroupMembers() {
    const membersByGroup = {}

    for (const group of groups) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/groups/${group.id}/members`,
          { credentials: 'include' }
        )

        if (response.ok) {
          membersByGroup[group.id] = await response.json()
        }
      } catch (error) {
        console.error('Jäsenten hakeminen epäonnistui:', error)
      }
    }

    if (!cancelled) {
      setGroupMembers(membersByGroup)
    }
  }

  loadGroupMembers()

  return () => {
    cancelled = true
  }
}, [currentUser?.id, groups])

const [groupName, setGroupName] = useState('')
const [showGroupForm, setShowGroupForm] = useState(false)

async function createGroup(e) {
  e.preventDefault()

  if (!groupName.trim()) return

  try {
   const response = await fetch('http://localhost:3001/api/groups', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({ name: groupName })
})

    if (!response.ok) {
      throw new Error('Ryhmän tallennus epäonnistui')
    }

    const newGroup = await response.json()

    setGroups(previousGroups => [...previousGroups, newGroup])

    setGroupName('')
    setShowGroupForm(false)

  } catch (error) {
    console.error(error)
    alert('Ryhmän tallentaminen epäonnistui.')
  }
}
const [selectedGroupId, setSelectedGroupId] = useState('')
const [meetingDuration, setMeetingDuration] = useState(60)
const [freeTimes, setFreeTimes] = useState([])

function findFreeTimes() {
  if (!selectedGroupId) {
    alert('Valitse ensin ryhmä.')
    return
  }

  const results = []

  // Haetaan valitun ryhmän tapahtumat
  const groupEvents = events.filter(event =>
    (event.groupIds || []).includes(selectedGroupId)
  )

  // Tarkastellaan näkyvän viikon jokaista päivää
  
for (const day of days) {
  const date = dateKey(day)

  const today = dateKey(new Date())
  if (date < today) continue


    const dayEvents = groupEvents
      .filter(event => event.date === date)
      .map(event => ({
        start: event.start,
        end: event.end
      }))
      .sort((a, b) => a.start.localeCompare(b.start))

    // Etsitään vapaita aikoja klo 08–20
    let current = 8 * 60

if (date === today) {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  current = Math.max(current, currentMinutes)
}

    function toMinutes(time) {
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
    }

    function toTime(minutes) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60

      return (
        String(hours).padStart(2, '0') + ':' +
        String(mins).padStart(2, '0')
      )
    }

    for (const event of dayEvents) {
      const start = Math.max(8 * 60, toMinutes(event.start))
      const end = Math.min(20 * 60, toMinutes(event.end))

      if (start - current >= meetingDuration) {
        results.push({
          date,
          start: toTime(current),
          end: toTime(start)
        })
      }

      current = Math.max(current, end)
    }

    if (20 * 60 - current >= meetingDuration) {
      results.push({
        date,
        start: toTime(current),
        end: '20:00'
      })
    }
  }

  setFreeTimes(results)
}
  const [showForm, setShowForm] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)

const [groupWeekOffset, setGroupWeekOffset] = useState(0)


  const [form, setForm] = useState({
    title: '',
    date: '',
    start: '09:00',
    end: '10:00',
    type: 'study',
    groupIds: [],
  })

  const types = {
    work: 'Työ',
    study: 'Opiskelu',
    exam: 'Tentti',
    other: 'Muu'
  }

  const monday = new Date()
  monday.setHours(12, 0, 0, 0)
  monday.setDate(
    monday.getDate() - ((monday.getDay() + 6) % 7)
    + weekOffset * 7
  )

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    return day
  })

const groupMonday = new Date()
groupMonday.setHours(12, 0, 0, 0)
groupMonday.setDate(
  groupMonday.getDate() - ((groupMonday.getDay() + 6) % 7)
  + groupWeekOffset * 7
)

const groupDays = Array.from({ length: 7 }, (_, i) => {
  const day = new Date(groupMonday)
  day.setDate(groupMonday.getDate() + i)
  return day
})


  function dateKey(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-')
  }

 
async function handleLogout() {
  try {
    const response = await fetch('http://localhost:3001/api/logout', {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Uloskirjautuminen epäonnistui')
    }

    setCurrentUser(null)
    setLoginEmail('')
    setLoginPassword('')
    setLoginError('')
    setEvents([])
    setGroups([])
    setGroupMembers({})
    setFreeTimes([])

  } catch (error) {
    console.error(error)
    alert('Uloskirjautuminen epäonnistui.')
  }
}

async function handleRegister(e) {
  e.preventDefault()
  setLoginError('')

  try {
    const response = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: registerUsername.trim(),
        email: loginEmail.trim(),
        password: loginPassword
      })
    })

    const data = await response.json()

    if (!response.ok) {
      setLoginError(data.error || 'Rekisteröityminen epäonnistui.')
      return
    }

    alert('Käyttäjätunnus luotu! Voit nyt kirjautua sisään.')
    setIsRegistering(false)
    setRegisterUsername('')
    setLoginPassword('')

  } catch (error) {
    console.error(error)
    setLoginError('Yhteys palvelimeen epäonnistui.')
  }
}

async function handleLogin(e) {
  e.preventDefault()
  setLoginError('')

  try {
    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword
      })
    })

    const data = await response.json()

    if (!response.ok) {
      setLoginError(data.error || 'Kirjautuminen epäonnistui.')
      return
    }

    setCurrentUser(data)
    setLoginPassword('')

  } catch (error) {
    console.error(error)
    setLoginError('Yhteys palvelimeen epäonnistui.')
  }
}

async function addEvent(e) {
  e.preventDefault()

  if (!form.title.trim() || !form.date) {
    alert('Täytä tapahtuman nimi ja päivämäärä.')
    return
  }

  if (form.end <= form.start) {
    alert('Päättymisajan täytyy olla alkamisajan jälkeen.')
    return
  }

  try {
   
const response = await fetch('http://localhost:3001/api/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify(form)
})


    if (!response.ok) {
      throw new Error('Tapahtuman tallennus epäonnistui')
    }

    const newEvent = await response.json()

    setEvents(previousEvents => [...previousEvents, newEvent])

    setShowForm(false)
    setForm({
      title: '',
      date: '',
      start: '09:00',
      end: '10:00',
      type: 'study',
      groupIds: []
    })

  } catch (error) {
    console.error(error)
    alert('Tapahtuman tallentaminen tietokantaan epäonnistui.')
  }
}


  
async function deleteEvent(id) {
  if (!window.confirm('Poistetaanko tapahtuma?')) return

  try {
   const response = await fetch(`http://localhost:3001/api/events/${id}`, {
  method: 'DELETE',
  credentials: 'include'
})

    if (!response.ok) {
      throw new Error('Tapahtuman poistaminen epäonnistui')
    }

    setEvents(previousEvents =>
      previousEvents.filter(event => event.id !== id)
    )

  } catch (error) {
    console.error(error)
    alert('Tapahtuman poistaminen tietokannasta epäonnistui.')
  }
}


if (checkingLogin) {
  return <p>Tarkistetaan kirjautumista...</p>
}

if (!currentUser) {
  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '20px' }}>
      <h1>StudySync 📅</h1>
      
      <h2>{isRegistering ? 'Rekisteröidy' : 'Kirjaudu sisään'}</h2>

      <form
 onSubmit={isRegistering ? handleRegister : handleLogin}
  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
>
{isRegistering && (
  <label>
    Käyttäjänimi
    <input
      type="text"
      value={registerUsername}
      onChange={e => setRegisterUsername(e.target.value)}
      required
    />
  </label>
)}

        <label>
          Sähköposti
          <input
            type="email"
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Salasana
          <input
            type="password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            required
          />
        </label>

        {loginError && (
          <p style={{ color: 'red' }}>{loginError}</p>
        )}

        <button type="submit">
  {isRegistering ? 'Luo käyttäjätunnus' : 'Kirjaudu sisään'}
</button>
        <button
  type="button"
  onClick={() => setIsRegistering(true)}
>
  Rekisteröidy
</button>
      </form>
    </div>
  )
}

  return (
    <div className="app">
      <header className="header">
        <h1>StudySync 📅</h1>

<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px'
}}>
  <span>Kirjautunut: {currentUser.username}</span>

  <button onClick={handleLogout}>
    Kirjaudu ulos
  </button>
</div>

        <p>Yhdistä työ, opiskelu ja yhteinen aika.</p>
      </header>

      <main>
        <div className="toolbar">
          <h2>Oma viikkokalenteri</h2>

          <button onClick={() => {
            setForm({ ...form, date: dateKey(new Date()) })
            setShowForm(true)
          }}>
            + Lisää tapahtuma
          </button>
        </div>

        <div className="week-navigation">
          <button onClick={() => setWeekOffset(weekOffset - 1)}>
            ← Edellinen
          </button>

          <strong>
            {days[0].toLocaleDateString('fi-FI')}
            {' – '}
            {days[6].toLocaleDateString('fi-FI')}
          </strong>

          <button onClick={() => setWeekOffset(weekOffset + 1)}>
            Seuraava →
          </button>
        </div>

        <div className="calendar">
          {days.map(day => {
            const key = dateKey(day)

            const dayEvents = events
              .filter(event => event.date === key)
              .sort((a, b) => a.start.localeCompare(b.start))

            return (
              <div className="day" key={key}>
                <h3>
                  {day.toLocaleDateString('fi-FI', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'numeric'
                  })}
                </h3>

                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`event ${event.type}`}
                  >
                    <strong>{event.title}</strong>
                    <small>
                      {event.start}–{event.end}
                    </small>
                    <small>{types[event.type]}</small>

                   {event.user_id === currentUser.id && (
  <button
    className="delete-button"
    onClick={() => deleteEvent(event.id)}
    title="Poista tapahtuma"
  >
    ×
  </button>
)}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
<section className="groups-section">
  <div className="toolbar">
    <h2>Omat ryhmät</h2>

    <button onClick={() => setShowGroupForm(true)}>
      + Luo ryhmä
    </button>
  </div>

  {groups.length === 0 ? (
    <p>Et kuulu vielä yhteenkään ryhmään.</p>
  ) : (
    <div className="group-list">
      {groups.map(group => (
    
<div
  className="group-card"
  key={group.id}
  style={{ position: 'relative' }}
>
  <h3>{group.name}</h3>

<button
  type="button"

style={{
  position: 'absolute',
  top: '20px',
  right: '20px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none'
}}

  onClick={async () => {
    const confirmed = window.confirm(
      `Haluatko varmasti poistua ryhmästä "${group.name}"?`
    )

    if (!confirmed) return

    try {
      const response = await fetch(
        `http://localhost:3001/api/groups/${group.id}/members/me`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Ryhmästä poistuminen epäonnistui.')
        return
      }

      setGroups(previousGroups =>
        previousGroups.filter(item => item.id !== group.id)
      )

      setGroupMembers(previous => {
        const updated = { ...previous }
        delete updated[group.id]
        return updated
      })

      alert('Poistuit ryhmästä onnistuneesti!')
    } catch (error) {
      console.error(error)
      alert('Yhteys palvelimeen epäonnistui.')
    }
  }}
>
  Poistu ryhmästä
</button>

  
<button
  type="button"
  onClick={() =>
    setAddingMemberGroupId(
      addingMemberGroupId === group.id ? null : group.id
    )
  }
>
  {addingMemberGroupId === group.id ? 'Peruuta' : 'Lisää jäsen'}
</button>

{addingMemberGroupId === group.id && (
  <div>
    <label>
      Jäsenen sähköposti
      <input
        type="email"
        value={memberEmail}
        onChange={e => setMemberEmail(e.target.value)}
        placeholder="esimerkki@email.com"
      />
    </label>

<button
  type="button"
  onClick={async () => {
    if (!memberEmail.trim()) {
      alert('Anna sähköpostiosoite.')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/groups/${group.id}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            email: memberEmail.trim()
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Jäsenen lisääminen epäonnistui.')
        return
      }

      
alert('Käyttäjä lisättiin ryhmään!')

setGroupMembers(previous => ({
  ...previous,
  [group.id]: [...(previous[group.id] || []), data.user]
}))

setMemberEmail('')
setAddingMemberGroupId(null)

    } catch (error) {
      console.error(error)
      alert('Yhteys palvelimeen epäonnistui.')
    }
  }}
>
  Tallenna jäsen
</button>

  </div>
)}


<h4>
  Ryhmän jäsenet ({groupMembers[group.id]?.length ?? 0})
</h4>


{groupMembers[group.id] ? (
  <ul>
    {groupMembers[group.id].map(member => (
     
<li key={member.id}>
  {member.username}
  {member.id === currentUser.id && ' (sinä)'}
</li>

    ))}
  </ul>
) : (
  <p>Ladataan jäseniä...</p>
)}

  <h4>Jaetut tapahtumat</h4>


  {events.filter(event =>
    (event.groupIds || []).includes(group.id)
  ).length === 0 ? (
    <p>Ei vielä jaettuja tapahtumia.</p>
  ) : (
    events
      .filter(event =>
        (event.groupIds || []).includes(group.id)
      )
      .sort((a, b) =>
        (a.date + a.start).localeCompare(b.date + b.start)
      )
      .map(event => (
        <div className="shared-event" key={event.id}>
          <strong>{event.title}</strong>
          <p>
           {new Date(event.date + 'T12:00:00').toLocaleDateString('fi-FI')}
{' klo '}
{event.start}–{event.end}
          </p>
        </div>
      ))
  )}
</div> 
      ))}
    </div>
  )}
</section>

<section className="group-calendar-section">
  <h2>Ryhmän viikkokalenteri</h2>
  <p>Katso valitulle ryhmälle jaetut tapahtumat viikkokalenterissa.</p>

<div className="availability-controls">
  <label>
    Valitse ryhmä
    <select
      value={selectedGroupId}
      onChange={e => setSelectedGroupId(Number(e.target.value))}
    >
      <option value="">Valitse ryhmä</option>

      {groups.map(group => (
        <option key={group.id} value={group.id}>
          {group.name}
        </option>
      ))}
    </select>
  </label>
</div>

<div className="week-navigation">
  <button onClick={() => setGroupWeekOffset(groupWeekOffset - 1)}>
    ← Edellinen
  </button>

  
<strong>
  {groupDays[0].toLocaleDateString('fi-FI')}
  {' – '}
  {groupDays[6].toLocaleDateString('fi-FI')}
</strong>


  <button onClick={() => setGroupWeekOffset(groupWeekOffset + 1)}>
    Seuraava →
  </button>
</div>

{selectedGroupId && (
  <div className="calendar">
    
{groupDays.map(day => {

      const date = dateKey(day)

      const dayEvents = events
        .filter(event =>
          event.date === date &&
          (event.groupIds || []).includes(selectedGroupId)
        )
        .sort((a, b) => a.start.localeCompare(b.start))

      return (
        <div className="day" key={date}>
          <h3>
            {day.toLocaleDateString('fi-FI', {
              weekday: 'short',
              day: 'numeric',
              month: 'numeric'
            })}
          </h3>

          {dayEvents.map(event => (
            <div
              key={event.id}
              className={`event ${event.type}`}
            >
              <strong>{event.title}</strong>
              <small>{event.start}–{event.end}</small>
            </div>
          ))}
        </div>
      )
    })}
  </div>
)}

</section>

<section className="availability-section">
  <h2>Etsi yhteinen aika</h2>

  <p>
    Valitse ryhmä ja tapaamisen vähimmäiskesto.
    StudySync etsii vapaat ajat näkyvältä viikolta.
  </p>

  <div className="availability-controls">
    <label>
      Ryhmä
      <select
        value={selectedGroupId}
        onChange={e => {
          setSelectedGroupId(Number(e.target.value))
          setFreeTimes([])
        }}
      >
        <option value="">Valitse ryhmä</option>

        {groups.map(group => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
    </label>

    <label>
      Tapaamisen kesto
      <select
        value={meetingDuration}
        onChange={e => {
          setMeetingDuration(Number(e.target.value))
          setFreeTimes([])
        }}
      >
        <option value={30}>30 minuuttia</option>
        <option value={60}>60 minuuttia</option>
        <option value={90}>90 minuuttia</option>
        <option value={120}>120 minuuttia</option>
      </select>
    </label>

    <button onClick={findFreeTimes}>
      Etsi vapaat ajat
    </button>
  </div>

  {freeTimes.length > 0 && (
    <div className="free-times">
      <h3>Löytyneet vapaat ajat</h3>

      {freeTimes.map((time, index) => (
        <div className="free-time" key={index}>
          <strong>
  {new Date(time.date + 'T12:00:00').toLocaleDateString('fi-FI')}
</strong>
          <span>{time.start}–{time.end}</span>
        </div>
      ))}
    </div>
  )}
</section>
{showGroupForm && (
  <div className="modal-backdrop">
    <form className="event-form" onSubmit={createGroup}>
      <h2>Luo uusi ryhmä</h2>

      <label>
        Ryhmän nimi
        <input
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          placeholder="Esim. Ohjelmistoprojekti"
          required
        />
      </label>

      <div className="form-actions">
        <button
          type="button"
          className="secondary"
          onClick={() => setShowGroupForm(false)}
        >
          Peruuta
        </button>

        <button type="submit">
          Luo ryhmä
        </button>
      </div>
    </form>
  </div>
)}
        {showForm && (
          <div className="modal-backdrop">
            <form className="event-form" onSubmit={addEvent}>
              <h2>Lisää tapahtuma</h2>

              <label>
                Tapahtuman nimi
                <input
                  value={form.title}
                  onChange={e => setForm({
                    ...form,
                    title: e.target.value
                  })}
                  placeholder="Esim. Työvuoro"
                  required
                />
              </label>

              <label>
                Päivämäärä
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({
                    ...form,
                    date: e.target.value
                  })}
                  required
                />
              </label>

              <label>
                Alkamisaika
                <input
                  type="time"
                  value={form.start}
                  onChange={e => setForm({
                    ...form,
                    start: e.target.value
                  })}
                  required
                />
              </label>

              <label>
                Päättymisaika
                <input
                  type="time"
                  value={form.end}
                  onChange={e => setForm({
                    ...form,
                    end: e.target.value
                  })}
                  required
                />
              </label>

              <label>
                Tapahtuman tyyppi
                <select
                  value={form.type}
                  onChange={e => setForm({
                    ...form,
                    type: e.target.value
                  })}
                >
                  {Object.entries(types).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
<div className="group-selection">
  <h3>Jaa tapahtuma ryhmille</h3>

  {groups.length === 0 ? (
    <p>Et ole vielä luonut ryhmiä.</p>
  ) : (
    groups.map(group => (
      <label className="group-checkbox" key={group.id}>
        <input
          type="checkbox"
          checked={(form.groupIds || []).includes(group.id)}
          onChange={e => {
            const updated = e.target.checked
              ? [...(form.groupIds || []), group.id]
              : (form.groupIds || []).filter(
                  id => id !== group.id
                )

            setForm({
              ...form,
              groupIds: updated
            })
          }}
        />
        {group.name}
      </label>
    ))
  )}
</div>
              <div className="form-actions">
                <button type="button" className="secondary"
                  onClick={() => setShowForm(false)}>
                  Peruuta
                </button>

                <button type="submit">
                  Tallenna tapahtuma
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default App