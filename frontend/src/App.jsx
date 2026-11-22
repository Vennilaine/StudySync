import { useState } from 'react'
import './App.css'

function App() {
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

const [groupName, setGroupName] = useState('')
const [showGroupForm, setShowGroupForm] = useState(false)

function createGroup(e) {
  e.preventDefault()

  if (!groupName.trim()) return

  const newGroup = {
    id: crypto.randomUUID(),
    name: groupName.trim()
  }

  const updated = [...groups, newGroup]

  setGroups(updated)
  localStorage.setItem('studysync-groups', JSON.stringify(updated))

  setGroupName('')
  setShowGroupForm(false)
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

    const dayEvents = groupEvents
      .filter(event => event.date === date)
      .map(event => ({
        start: event.start,
        end: event.end
      }))
      .sort((a, b) => a.start.localeCompare(b.start))

    // Etsitään vapaita aikoja klo 08–20
    let current = 8 * 60

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

  function dateKey(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-')
  }

  function addEvent(e) {
    e.preventDefault()

    if (!form.title.trim() || !form.date) {
      alert('Täytä tapahtuman nimi ja päivämäärä.')
      return
    }

    if (form.end <= form.start) {
      alert('Päättymisajan täytyy olla alkamisajan jälkeen.')
      return
    }

    const updated = [
      ...events,
      { ...form, id: crypto.randomUUID() }
    ]

    setEvents(updated)
    localStorage.setItem('studysync-events', JSON.stringify(updated))

    setShowForm(false)
    setForm({
      title: '',
      date: '',
      start: '09:00',
      end: '10:00',
      type: 'study',
      groupIds: [],
    })
  }

  function deleteEvent(id) {
    if (!window.confirm('Poistetaanko tapahtuma?')) return

    const updated = events.filter(event => event.id !== id)
    setEvents(updated)
    localStorage.setItem('studysync-events', JSON.stringify(updated))
  }

  return (
    <div className="app">
      <header className="header">
        <h1>StudySync 📅</h1>
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

                    <button
                      className="delete-button"
                      onClick={() => deleteEvent(event.id)}
                      title="Poista tapahtuma"
                    >
                      ×
                    </button>
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
      <div className="group-card" key={group.id}>
  <h3>{group.name}</h3>

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
          setSelectedGroupId(e.target.value)
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
<div className="group-selection">
  <h3>Jaa tapahtuma ryhmille</h3>

  {groups.length === 0 ? (
    <p>Et ole vielä luonut ryhmiä.</p>
  ) : (
    groups.map(group => (
      <label className="group-checkbox" key={group.id}>
        <input
          type="checkbox"
          checked={form.groupIds.includes(group.id)}
          onChange={e => {
            const updated = e.target.checked
              ? [...form.groupIds, group.id]
              : form.groupIds.filter(id => id !== group.id)

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