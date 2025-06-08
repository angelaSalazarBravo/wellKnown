<template>
  <Header title="Events" />
  <div class="calendar-app">
    <transition name="fade" mode="out-in">
      <div v-if="!selectedDay" key="calendar-view">
        <div class="calendar-header">
          <button @click="prevMonth">&lt;</button>
          <h2>{{ months[currentMonth] }} {{ currentYear }}</h2>
          <button @click="nextMonth">&gt;</button>
        </div>
        <div class="weekdays">
          <div v-for="day in days" :key="day" class="weekday">{{ day }}</div>
        </div>
        <div class="calendar-grid">
          <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class="empty-day"></div>
          <div
            v-for="day in daysInMonth"
            :key="day"
            class="calendar-day"
            @click="selectDay(day)"
          >
            <div>{{ day }}</div>
            <div
              v-for="event in getEventsForDay(day)"
              :key="event.kind + '-' + event.id"
              class="event-title"
              :class="{ meeting: event.kind === 'meeting' }"
            >
              {{ event.kind === 'meeting' ? `Meeting: ${event.project_name}` : event.title }}
            </div>
          </div>
        </div>
      </div>

      <div v-else key="day-view" class="day-view">
        <div class="day-header">
          <button @click="changeDay(-1)">←</button>
          <h2>{{ selectedDay.name }} - {{ formatDate(selectedDay.date) }}</h2>
          <button @click="changeDay(1)">→</button>
        </div>
        <ul class="appointments">
          <li v-for="(event, index) in selectedDay.events" :key="index">
            <div>
              <div><strong>{{ event.kind === 'meeting' ? `Meeting: ${event.project_name}` : event.title }}</strong></div>
              <div>{{ formatDate(event.start_date) }} - {{ formatDate(event.end_date || event.start_date) }}</div>
              <div>{{ event.description }}</div>
            </div>
          </li>
          <li v-if="selectedDay.events.length === 0">No events</li>
        </ul>
        <div class="button-group">
          <button v-if="isAdmin" @click="openEventModal" class="create-event-button">Add Event</button>
          <button v-if="isAdmin" @click="openMeetingModal" class="add-meeting-button">Add Meeting</button>
          <button @click="selectedDay = null" class="close-button">Close</button>
        </div>
      </div>
    </transition>
  </div>

  <div v-if="showEventModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Add Event</h2>
      <form @submit.prevent="createEventHandler">
        <label>Title:</label>
        <input v-model="newEvent.title" required />

        <label>Description:</label>
        <textarea v-model="newEvent.description" required></textarea>

        <label>Start Date:</label>
        <input class="datetime-local" type="datetime-local" v-model="newEvent.start_date" required />

        <label>End Date:</label>
        <input class="datetime-local" type="datetime-local" v-model="newEvent.end_date" />

        <label>Project:</label>
        <select class="project-selector" v-model="newEvent.project_id" required>
          <option disabled value="">Select a project</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
        <div class="modal-buttons">
          <button type="submit">Create</button>
          <button type="button" @click="showEventModal = false">Cancel</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showMeetingModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Add Meeting</h2>
      <form @submit.prevent="createMeetingHandler">
        <label>Description:</label>
        <textarea v-model="newMeeting.description" required></textarea>

        <label>Date and Time:</label>
        <input type="datetime-local" v-model="newMeeting.date" required />

        <label>Project:</label>
        <select class="project-selector" v-model="newMeeting.project_id" required>
          <option disabled value="">Select a project</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>

        <div class="modal-buttons">
          <button type="submit">Add</button>
          <button type="button" @click="showMeetingModal = false">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCalendarEventsApi } from '~/composables/api/calendar-events'
import { getLoggedUser } from '~/utils/auth'
import { useProjectsApi } from '~/composables/api/projects'
import { useMeetingsApi } from '~/composables/api/meetings'

const { getMeetings, createMeeting } = useMeetingsApi()
const meetingsByDate = ref({})

const { getCalendarEvents, createCalendarEvent } = useCalendarEventsApi()
const route = useRoute()
const user = getLoggedUser()
const isAdmin = user?.role === 'admin'
const { getProjects } = useProjectsApi()
const projects = ref([])

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const selectedDay = ref(null)
const eventsByDate = ref({})
const showEventModal = ref(false)
const showMeetingModal = ref(false)

const projectId = Number(route.params.id)

onMounted(async () => {
  const events = await getCalendarEvents(projectId)
  eventsByDate.value = groupEventsByDate(events)
  const response = await getProjects()
  projects.value = Array.isArray(response) ? response : response.data

  const projectMap = Object.fromEntries(
    projects.value.map(p => [p.id, p.name])
  )

  const meetings = await getMeetings()
  const meetingsWithName = meetings.map(m => ({
    ...m,
    project_name: projectMap[m.project_id] || 'Unknown Project',
    start_date: m.date,
    end_date: m.date,
  }))

  meetingsByDate.value = groupEventsByDate(meetingsWithName)
})

function groupEventsByDate(events) {
  return events.reduce((acc, event) => {
    const date = new Date(event.start_date).toDateString()
    acc[date] = acc[date] || []
    acc[date].push(event)
    return acc
  }, {})
}

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function selectDay(day) {
  const date = new Date(currentYear.value, currentMonth.value, day)
  const dateKey = date.toDateString()
  const events = eventsByDate.value[dateKey] || []
  const meetings = meetingsByDate.value[dateKey] || []

  const taggedEvents = events.map(e => ({ ...e, kind: 'event' }))
  const taggedMeetings = meetings.map(m => ({ ...m, kind: 'meeting' }))

  selectedDay.value = {
    date,
    name: days[date.getDay()],
    events: [...taggedEvents, ...taggedMeetings]
  }
}

function changeDay(change) {
  const newDate = new Date(
    selectedDay.value.date.getFullYear(),
    selectedDay.value.date.getMonth(),
    selectedDay.value.date.getDate() + change
  )
  const dateKey = newDate.toDateString()
  const events = eventsByDate.value[dateKey] || []
  const meetings = meetingsByDate.value[dateKey] || []
  const taggedEvents = events.map(e => ({ ...e, kind: 'event' }))
  const taggedMeetings = meetings.map(m => ({ ...m, kind: 'meeting' }))

  selectedDay.value = {
    date: newDate,
    name: days[newDate.getDay()],
    events: [...taggedEvents, ...taggedMeetings]
  }
}

function formatDate(dateStrOrObj) {
  const date = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj) : dateStrOrObj
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

function getEventsForDay(day) {
  const dateKey = new Date(currentYear.value, currentMonth.value, day).toDateString()
  const events = eventsByDate.value[dateKey] || []
  const meetings = meetingsByDate.value[dateKey] || []

  const taggedEvents = events.map(e => ({ ...e, kind: 'event' }))
  const taggedMeetings = meetings.map(m => ({ ...m, kind: 'meeting' }))

  return [...taggedEvents, ...taggedMeetings]
}

const newEvent = ref({
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  project_id: '',
})

const newMeeting = ref({
  description: '',
  date: '',
  project_id: '',
})


function openEventModal() {
  if (!selectedDay.value) return;

  const date = new Date(selectedDay.value.date)
  date.setHours(9, 0, 0, 0)
  newEvent.value = {
    title: '',
    description: '',
    start_date: date.toISOString().slice(0, 16),
    end_date: '',
    project_id: ''
  }
  showEventModal.value = true
}

function openMeetingModal() {
  if (!selectedDay.value) return;

  const date = new Date(selectedDay.value.date)
  date.setHours(9, 0, 0, 0)
  newMeeting.value = {
    description: '',
    date: date.toISOString().slice(0, 16),
    project_id: ''
  }
  showMeetingModal.value = true
}

async function createEventHandler() {
  try {
    const payload = {
      ...newEvent.value,
      created_by: user.id  
    }

    await createCalendarEvent(payload)
    showEventModal.value = false

    const events = await getCalendarEvents(projectId)
    eventsByDate.value = groupEventsByDate(events)
    if (selectedDay.value) selectDay(selectedDay.value.date.getDate())
  } catch (error) {
    alert('Error creating event')
  }
}


async function createMeetingHandler() {
  try {
    await createMeeting(newMeeting.value)
    showMeetingModal.value = false
    const meetings = await getMeetings()
    const projectMap = Object.fromEntries(projects.value.map(p => [p.id, p.name]))
    const meetingsWithName = meetings.map(m => ({
      ...m,
      project_name: projectMap[m.project_id] || 'Unknown Project',
      start_date: m.date,
      end_date: m.date,
    }))
    meetingsByDate.value = groupEventsByDate(meetingsWithName)
    if (selectedDay.value) selectDay(selectedDay.value.date.getDate())
  } catch (error) {
    alert('Error creating meeting')
  }
}
</script>

<style scoped>
.calendar-app {
  max-width: 60%;
  margin-left:18%;
  margin-top: 2%;
  font-family: 'Arial', sans-serif;
  background-color: #f0f8ff; 
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.calendar-header,
.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #4682B4; 
  color: white; 
  border-radius: 10px 10px 0 0; 
}

.weekdays,
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  padding: 0.5rem;
}

.weekday {
  text-align: center;
  padding: 1rem;
  background-color: #87CEEB;
  color: white; 
  border-radius: 5px;
}
/*
.calendar-day,
.empty-day {
  text-align: center;
  padding: 1rem;
  border: 1px solid #ccc;
  min-height: 60px;
  cursor: pointer;
  transition: background-color 0.3s; 
}
*/
.calendar-day,
.empty-day {
  width: 100%;
  aspect-ratio: 1 / 1; 
  text-align: center;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem;
  box-sizing: border-box;
  overflow: hidden;
}
.calendar-day:hover {
  background-color: #b0e0e6;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: crimson;
  border-radius: 50%;
  margin: 4px auto 0;
}

.day-view {
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.appointments {
  list-style: none;
  padding: 0;
}

.appointments li {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
}

.close-button {
  display: block;
  margin: 2rem auto 0;
  padding: 0.5rem 1rem;
  background: #4682B4; 
  color: white; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s; 
}
.create-event-button {
  display: block;
  margin: 2rem auto 0;
  padding: 0.5rem 1rem;
  background: #4682B4; 
  color: white; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s; 
}
.close-button:hover {
  background: #5a9bd4; 
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.event-title {
  padding: 0.5rem;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #333;
  border-radius: 5px;
  background-color: #69caf0;
  word-wrap: break-word;
}


.project-selector{
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background: #fff;
  padding: 3rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal-content h2 {
  margin-bottom: 1rem;
}

.modal-content label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  gap: 1rem;
}

.modal-buttons button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.modal-buttons button[type='submit'] {
  background-color: #4682B4;
  color: white;
}

.modal-buttons button[type='button'] {
  background-color: #ccc;
  color: #333;
}
.event-title.meeting {
  background-color: #dab6ff; 
  color: #3a004d;
}
.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.add-meeting-button {
  display: block;
  margin: 2rem auto 0;
  padding: 0.5rem 1rem;
  background: #4682B4; 
  color: white; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s; 
}

.add-meeting-button:hover {
  background: #5a9bd4;
}

</style>

