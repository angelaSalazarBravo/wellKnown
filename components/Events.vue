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
            <div v-if="hasEvents(day)" class="event-title">
                {{ getFirstEventTitle(day) }}
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
              <div><strong>{{ event.title }}</strong></div>
              <div>{{ formatDate(event.start_date) }} - {{ formatDate(event.end_date) }}</div>
              <div>{{ event.description }}</div>
            </div>
          </li>
          <li v-if="selectedDay.events.length === 0">No events</li>
        </ul>
        <button @click="selectedDay = null" class="close-button">Close</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCalendarEventsApi } from '~/composables/api/calendar-events'

// APIs
const { getCalendarEvents } = useCalendarEventsApi()
const route = useRoute()

// Date constants
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// State
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const selectedDay = ref(null)
const eventsByDate = ref({})

// Fetch project ID from route
const projectId = Number(route.params.id)

// Load events
onMounted(async () => {
  const events = await getCalendarEvents(projectId)
  eventsByDate.value = groupEventsByDate(events)
})

function groupEventsByDate(events) {
  return events.reduce((acc, event) => {
    const date = new Date(event.start_date).toDateString()
    acc[date] = acc[date] || []
    acc[date].push(event)
    return acc
  }, {})
}

// Computed
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

// Methods
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

function hasEvents(day) {
  const date = new Date(currentYear.value, currentMonth.value, day).toDateString()
  return !!eventsByDate.value[date]
}

function selectDay(day) {
  const date = new Date(currentYear.value, currentMonth.value, day)
  const events = eventsByDate.value[date.toDateString()] || []

  selectedDay.value = {
    date,
    name: days[date.getDay()],
    events
  }
}

function changeDay(change) {
  const newDate = new Date(
    selectedDay.value.date.getFullYear(),
    selectedDay.value.date.getMonth(),
    selectedDay.value.date.getDate() + change
  )
  selectedDay.value = {
    date: newDate,
    name: days[newDate.getDay()],
    events: eventsByDate.value[newDate.toDateString()] || []
  }
}

function formatDate(dateStrOrObj) {
  const date = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj) : dateStrOrObj
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

function getFirstEventTitle(day) {
  const date = new Date(currentYear.value, currentMonth.value, day).toDateString()
  const events = eventsByDate.value[date] || []
  return events.length > 0 ? events[0].title : ''
}

</script>


<style scoped>
.calendar-app {
  max-width: 90%;
  margin: 5%;
  font-family: 'Arial', sans-serif;
  background-color: #f0f8ff; /* Light background for contrast */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.calendar-header,
.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #4682B4; /* Header background */
  color: white; /* Text color */
  border-radius: 10px 10px 0 0; /* Rounded top corners */
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
  background-color: #87CEEB; /* Weekday background */
  color: white; /* Text color */
  border-radius: 5px; /* Rounded corners */
}

.calendar-day,
.empty-day {
  text-align: center;
  padding: 1rem;
  border: 1px solid #ccc;
  min-height: 60px;
  cursor: pointer;
  transition: background-color 0.3s; /* Smooth transition */
}

.calendar-day:hover {
  background-color: #b0e0e6; /* Light hover effect */
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
  background-color: #ffffff; /* Day view background */
  border-radius: 10px; /* Rounded bottom corners */
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
  background: #4682B4; /* Close button background */
  color: white; /* Text color */
  border: none;
  border-radius: 5px; /* Rounded corners */
  cursor: pointer;
  transition: background-color 0.3s; /* Smooth transition */
}

.close-button:hover {
  background: #5a9bd4; /* Darker shade on hover */
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.event-title {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 5px;
  background-color: #69caf0; /* Event title background */
}

</style>

