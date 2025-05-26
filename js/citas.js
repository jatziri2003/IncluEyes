// Sistema de gestión de citas médicas
class AppointmentSystem {
  constructor() {
    this.currentDate = new Date()
    this.selectedDate = null
    this.appointments = this.loadAppointments()
    this.calls = this.loadCalls()
    this.patients = this.loadPatients()
    this.currentAppointment = null
    this.currentCall = null
    this.selectedPatient = null

    this.init()
  }

  init() {
    // Esperar un poco para asegurar que el DOM esté completamente cargado
    setTimeout(() => {
      this.renderCalendar()
      this.renderAppointments()
      this.renderCalls()
      this.setupEventListeners()
      this.setDefaultDate()
    }, 100)
  }

  setupEventListeners() {
    // Calendar navigation
    document.getElementById("prevMonth").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1)
      this.renderCalendar()
    })

    document.getElementById("nextMonth").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1)
      this.renderCalendar()
    })

    // Form submissions
    document.getElementById("appointment-form").addEventListener("submit", (e) => {
      e.preventDefault()
      this.saveAppointment()
    })

    document.getElementById("call-form").addEventListener("submit", (e) => {
      e.preventDefault()
      this.saveCall()
    })

    // Patient search
    document.getElementById("patient-search-input").addEventListener("input", (e) => {
      if (e.target.value.length >= 2) {
        this.searchPatients()
      } else {
        this.closePatientResults()
      }
    })

    // Modality change listeners
    document.querySelectorAll('input[name="modality"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.handleModalityChange(e.target.value)
      })
    })
  }

  setDefaultDate() {
    const today = new Date()
    const dateInput = document.getElementById("appointment-date")
    const callTimeInput = document.getElementById("call-time")

    if (dateInput) {
      dateInput.value = today.toISOString().split("T")[0]
    }

    if (callTimeInput) {
      const currentTime = today.toTimeString().slice(0, 5)
      callTimeInput.value = currentTime
    }
  }

  handleModalityChange(modality) {
    const addressGroup = document.getElementById("address-group")
    const videoLinkGroup = document.getElementById("video-link-group")

    // Hide all conditional fields
    addressGroup.style.display = "none"
    videoLinkGroup.style.display = "none"

    // Show relevant fields based on modality
    switch (modality) {
      case "domiciliaria":
        addressGroup.style.display = "block"
        break
      case "teleconsulta":
        videoLinkGroup.style.display = "block"
        this.generateVideoLink() // Auto-generate video link
        break
    }
  }

  generateVideoLink() {
    // Generate a random meeting ID
    const meetingId = this.generateMeetingId()
    const videoLinkInput = document.getElementById("video-link")
    videoLinkInput.value = `https://meet.incluyes.com/${meetingId}`
  }

  generateMeetingId() {
    const chars = "abcdefghijklmnopqrstuvwxyz"
    const nums = "0123456789"
    let result = ""

    // Generate format: xxx-xxxx-xxx
    for (let i = 0; i < 3; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    result += "-"
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    result += "-"
    for (let i = 0; i < 3; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return result
  }

  searchPatients() {
    const searchTerm = document.getElementById("patient-search-input").value.toLowerCase()
    const resultsContainer = document.getElementById("patient-results")
    const patientsList = document.getElementById("patients-search-list")

    if (searchTerm.length < 2) {
      resultsContainer.style.display = "none"
      return
    }

    const filteredPatients = this.patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.curp.toLowerCase().includes(searchTerm) ||
        patient.nss.includes(searchTerm),
    )

    patientsList.innerHTML = ""

    if (filteredPatients.length === 0) {
      patientsList.innerHTML = `
        <div class="no-results">
          <p>No se encontraron pacientes con ese criterio de búsqueda</p>
        </div>
      `
    } else {
      filteredPatients.forEach((patient) => {
        const patientItem = document.createElement("div")
        patientItem.className = "patient-result-item"
        patientItem.innerHTML = `
          <div class="patient-result-info">
            <div class="patient-result-name">${patient.name}</div>
            <div class="patient-result-details">CURP: ${patient.curp} | NSS: ${patient.nss} | Tel: ${patient.phone}</div>
          </div>
          <button class="select-patient-btn" onclick="appointmentSystem.selectPatient('${patient.id}')">
            Seleccionar
          </button>
        `
        patientsList.appendChild(patientItem)
      })
    }

    resultsContainer.style.display = "block"
  }

  selectPatient(patientId) {
    const patient = this.patients.find((p) => p.id === patientId)
    if (!patient) return

    this.selectedPatient = patient

    // Update UI
    document.getElementById("selected-patient-name").textContent = patient.name
    document.getElementById("selected-patient-curp").textContent = `CURP: ${patient.curp}`
    document.getElementById("selected-patient-phone").textContent = `Tel: ${patient.phone}`

    // Fill hidden fields
    document.getElementById("selected-patient-id").value = patient.id
    document.getElementById("selected-patient-curp-hidden").value = patient.curp

    // Show selected patient info and hide manual entry
    document.getElementById("selected-patient-info").style.display = "block"
    document.getElementById("manual-patient-entry").style.display = "none"

    // Fill form fields
    document.getElementById("patient-name").value = patient.name
    document.getElementById("patient-phone").value = patient.phone

    // Close search results
    this.closePatientResults()
  }

  changePatient() {
    this.selectedPatient = null

    // Show manual entry and hide selected patient info
    document.getElementById("selected-patient-info").style.display = "none"
    document.getElementById("manual-patient-entry").style.display = "block"

    // Clear form fields
    document.getElementById("patient-name").value = ""
    document.getElementById("patient-phone").value = ""
    document.getElementById("patient-search-input").value = ""

    // Clear hidden fields
    document.getElementById("selected-patient-id").value = ""
    document.getElementById("selected-patient-curp-hidden").value = ""
  }

  closePatientResults() {
    document.getElementById("patient-results").style.display = "none"
  }

  renderCalendar() {
    const monthNames = [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ]

    const currentMonthElement = document.getElementById("currentMonth")
    const calendarDaysElement = document.getElementById("calendar-days")

    if (!currentMonthElement || !calendarDaysElement) return

    // Update month display
    currentMonthElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`

    // Clear previous days
    calendarDaysElement.innerHTML = ""

    // Get first day of month and number of days
    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const emptyDay = document.createElement("div")
      emptyDay.className = "calendar-day other-month"
      const prevMonth = new Date(year, month - 1, 0)
      const prevMonthDay = prevMonth.getDate() - (startingDayOfWeek - 1 - i)
      emptyDay.textContent = prevMonthDay
      calendarDaysElement.appendChild(emptyDay)
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayElement = document.createElement("div")
      dayElement.className = "calendar-day"
      dayElement.textContent = day

      // Add classes for styling
      if (this.isToday(date)) {
        dayElement.classList.add("today")
      }

      if (this.selectedDate && this.isSameDay(date, this.selectedDate)) {
        dayElement.classList.add("selected")
      }

      if (this.hasAppointments(date)) {
        dayElement.classList.add("has-appointments")
        const indicator = document.createElement("div")
        indicator.className = "appointment-indicator"
        dayElement.appendChild(indicator)
      }

      // Add click event
      dayElement.addEventListener("click", () => {
        this.selectDate(date)
      })

      calendarDaysElement.appendChild(dayElement)
    }

    // Add days from next month to fill the grid
    const totalCells = calendarDaysElement.children.length
    const remainingCells = 42 - totalCells // 6 rows × 7 days = 42 cells

    for (let day = 1; day <= remainingCells; day++) {
      const nextMonthDay = document.createElement("div")
      nextMonthDay.className = "calendar-day other-month"
      nextMonthDay.textContent = day
      calendarDaysElement.appendChild(nextMonthDay)
    }
  }

  selectDate(date) {
    this.selectedDate = new Date(date)
    this.renderCalendar()
    this.renderAppointments()

    // Update appointment form date
    const appointmentDateInput = document.getElementById("appointment-date")
    if (appointmentDateInput) {
      appointmentDateInput.value = date.toISOString().split("T")[0]
    }
  }

  isToday(date) {
    const today = new Date()
    return this.isSameDay(date, today)
  }

  isSameDay(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  hasAppointments(date) {
    return this.appointments.some((appointment) => this.isSameDay(new Date(appointment.date), date))
  }

  renderAppointments() {
    const appointmentsList = document.getElementById("scheduled-appointments")
    if (!appointmentsList) return

    let appointmentsToShow = this.appointments

    // Filter by selected date if any
    if (this.selectedDate) {
      appointmentsToShow = this.appointments.filter((appointment) =>
        this.isSameDay(new Date(appointment.date), this.selectedDate),
      )
    } else {
      // Show upcoming appointments
      const today = new Date()
      appointmentsToShow = this.appointments.filter((appointment) => new Date(appointment.date) >= today).slice(0, 5)
    }

    appointmentsList.innerHTML = ""

    if (appointmentsToShow.length === 0) {
      appointmentsList.innerHTML = `
        <div class="no-appointments">
          <p>No hay citas programadas${this.selectedDate ? " para esta fecha" : ""}</p>
        </div>
      `
      return
    }

    appointmentsToShow.forEach((appointment) => {
      const appointmentElement = document.createElement("div")
      appointmentElement.className = "appointment-item"
      appointmentElement.innerHTML = `
        <div class="appointment-header">
          <span class="appointment-time">${appointment.time}</span>
          <span class="appointment-type">${this.getModalityLabel(appointment.modality)}</span>
        </div>
        <div class="appointment-patient">${appointment.patientName}</div>
        <div class="appointment-reason">${appointment.reason}</div>
      `

      appointmentElement.addEventListener("click", () => {
        this.showAppointmentDetails(appointment)
      })

      appointmentsList.appendChild(appointmentElement)
    })
  }

  renderCalls() {
    const callsList = document.getElementById("todays-calls")
    if (!callsList) {
      console.log("No se encontró el elemento todays-calls") // Debug
      return
    }

    const today = new Date()
    const todayString = today.toISOString().split("T")[0]

    console.log("Fecha de hoy:", todayString) // Debug
    console.log("Todas las llamadas:", this.calls) // Debug

    // Filtrar solo teleconsultas de hoy
    const todaysTeleconsultas = this.calls.filter((call) => {
      const callDate = call.date
      const isTeleconsulta = call.type === "teleconsulta"
      const isToday = callDate === todayString

      console.log(`Llamada ${call.id}: fecha=${callDate}, esHoy=${isToday}, esTeleconsulta=${isTeleconsulta}`) // Debug

      return isToday && isTeleconsulta
    })

    console.log("Teleconsultas de hoy filtradas:", todaysTeleconsultas) // Debug

    callsList.innerHTML = ""

    if (todaysTeleconsultas.length === 0) {
      callsList.innerHTML = `
      <div class="no-calls">
        <p>No hay teleconsultas programadas para hoy</p>
      </div>
    `
      return
    }

    todaysTeleconsultas.forEach((call) => {
      const callElement = document.createElement("div")
      callElement.className = "simple-call-item"
      callElement.innerHTML = `
      <div class="call-info">
        <div class="call-time-label">Hora: <span class="call-time-value">${call.time}</span></div>
        <div class="call-patient-label">Paciente: <span class="call-patient-value">${call.patientName}</span></div>
      </div>
      <button class="simple-call-btn" onclick="showCallModal('${call.id}')">
        <i class="fas fa-phone"></i>
      </button>
    `

      callsList.appendChild(callElement)
    })

    console.log("Renderizado completado, elementos creados:", todaysTeleconsultas.length) // Debug
  }

  getModalityLabel(modality) {
    const modalities = {
      presencial: "Presencial",
      domiciliaria: "Domiciliaria",
      teleconsulta: "Teleconsulta",
    }
    return modalities[modality] || modality
  }

  saveAppointment() {
    const form = document.getElementById("appointment-form")
    const modality = document.querySelector('input[name="modality"]:checked').value

    const appointment = {
      id: this.currentAppointment ? this.currentAppointment.id : Date.now().toString(),
      patientId: document.getElementById("selected-patient-id").value || null,
      patientName: document.getElementById("patient-name").value,
      phone: document.getElementById("patient-phone").value,
      curp: document.getElementById("selected-patient-curp-hidden").value || null,
      date: document.getElementById("appointment-date").value,
      time: document.getElementById("appointment-time").value,
      modality: modality,
      address: document.getElementById("patient-address").value,
      videoLink: document.getElementById("video-link").value,
      reason: document.getElementById("appointment-reason").value,
      type: document.getElementById("appointment-type").value,
      status: "programada",
      createdAt: this.currentAppointment ? this.currentAppointment.createdAt : new Date().toISOString(),
    }

    if (this.currentAppointment) {
      // Update existing appointment
      const index = this.appointments.findIndex((a) => a.id === this.currentAppointment.id)
      this.appointments[index] = appointment
      window.IncluyesApp.showNotification("Cita actualizada correctamente", "success")
    } else {
      // Add new appointment
      this.appointments.push(appointment)
      window.IncluyesApp.showNotification("Cita agendada correctamente", "success")
    }

    this.saveAppointments()

    // If it's a teleconsulta, automatically create a call AFTER saving the appointment
    if (modality === "teleconsulta") {
      this.createTeleconsultaCall(appointment)
    }

    this.renderCalendar()
    this.renderAppointments()
    this.renderCalls() // Asegurar que se rendericen las llamadas
    this.closeModal("appointment-modal")
    this.resetAppointmentForm()
  }

  createTeleconsultaCall(appointment) {
    console.log("Creando teleconsulta para cita:", appointment) // Debug

    // Verificar si ya existe una llamada para esta cita
    const existingCall = this.calls.find((call) => call.appointmentId === appointment.id)

    if (existingCall) {
      // Actualizar la llamada existente
      const index = this.calls.findIndex((call) => call.appointmentId === appointment.id)
      this.calls[index] = {
        ...existingCall,
        patientName: appointment.patientName,
        phone: appointment.phone,
        date: appointment.date,
        time: appointment.time,
        priority: "alta",
        reason: `Teleconsulta: ${appointment.reason}`,
        notes: `Enlace de videollamada: ${appointment.videoLink}`,
        videoLink: appointment.videoLink,
        status: "programada",
        type: "teleconsulta",
        appointmentId: appointment.id,
      }
      console.log("Teleconsulta actualizada:", this.calls[index]) // Debug
    } else {
      // Crear nueva llamada
      const call = {
        id: `teleconsulta_${appointment.id}`,
        patientName: appointment.patientName,
        phone: appointment.phone,
        date: appointment.date,
        time: appointment.time,
        priority: "alta",
        reason: `Teleconsulta: ${appointment.reason}`,
        notes: `Enlace de videollamada: ${appointment.videoLink}`,
        videoLink: appointment.videoLink,
        status: "programada",
        type: "teleconsulta",
        appointmentId: appointment.id,
        createdAt: new Date().toISOString(),
      }

      this.calls.push(call)
      console.log("Nueva teleconsulta creada:", call) // Debug
    }

    this.saveCalls()

    // Forzar re-renderizado después de un pequeño delay
    setTimeout(() => {
      this.renderCalls()
    }, 100)

    window.IncluyesApp.showNotification("Teleconsulta programada automáticamente", "info")
  }

  saveCall() {
    const call = {
      id: this.currentCall ? this.currentCall.id : Date.now().toString(),
      patientName: document.getElementById("call-patient-name").value,
      phone: document.getElementById("call-patient-phone").value,
      date: new Date().toISOString().split("T")[0],
      time: document.getElementById("call-time").value,
      priority: document.getElementById("call-priority").value,
      reason: document.getElementById("call-reason").value,
      notes: document.getElementById("call-notes").value,
      status: "programada",
      type: "manual",
      createdAt: this.currentCall ? this.currentCall.createdAt : new Date().toISOString(),
    }

    if (this.currentCall) {
      // Update existing call
      const index = this.calls.findIndex((c) => c.id === this.currentCall.id)
      this.calls[index] = call
      window.IncluyesApp.showNotification("Llamada actualizada correctamente", "success")
    } else {
      // Add new call
      this.calls.push(call)
      window.IncluyesApp.showNotification("Llamada programada correctamente", "success")
    }

    this.saveCalls()
    this.renderCalls()
    this.closeModal("call-modal")
    this.resetCallForm()
  }

  showAppointmentDetails(appointment) {
    this.currentAppointment = appointment
    const detailsContent = document.getElementById("appointment-details-content")

    detailsContent.innerHTML = `
      <div class="detail-row">
        <div class="detail-label">Paciente:</div>
        <div class="detail-value">${appointment.patientName}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Teléfono:</div>
        <div class="detail-value">${appointment.phone}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Fecha:</div>
        <div class="detail-value">${this.formatDate(appointment.date)}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Hora:</div>
        <div class="detail-value">${appointment.time}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Modalidad:</div>
        <div class="detail-value">${this.getModalityLabel(appointment.modality)}</div>
      </div>
      ${
        appointment.address
          ? `
      <div class="detail-row">
        <div class="detail-label">Domicilio:</div>
        <div class="detail-value">${appointment.address}</div>
      </div>
      `
          : ""
      }
      ${
        appointment.videoLink
          ? `
      <div class="detail-row">
        <div class="detail-label">Enlace de video:</div>
        <div class="detail-value"><a href="${appointment.videoLink}" target="_blank">${appointment.videoLink}</a></div>
      </div>
      `
          : ""
      }
      <div class="detail-row">
        <div class="detail-label">Tipo:</div>
        <div class="detail-value">${this.getAppointmentTypeLabel(appointment.type)}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Motivo:</div>
        <div class="detail-value">${appointment.reason}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Estado:</div>
        <div class="detail-value">${appointment.status}</div>
      </div>
    `

    this.openModal("appointment-details-modal")
  }

  getAppointmentTypeLabel(type) {
    const types = {
      "consulta-general": "General",
      seguimiento: "Seguimiento",
      urgencia: "Urgencia",
      especialidad: "Especialidad",
    }
    return types[type] || type
  }

  editAppointment() {
    if (!this.currentAppointment) return

    // Fill form with current appointment data
    if (this.currentAppointment.patientId) {
      this.selectPatient(this.currentAppointment.patientId)
    } else {
      document.getElementById("patient-name").value = this.currentAppointment.patientName
      document.getElementById("patient-phone").value = this.currentAppointment.phone
    }

    document.getElementById("appointment-date").value = this.currentAppointment.date
    document.getElementById("appointment-time").value = this.currentAppointment.time
    document.getElementById("patient-address").value = this.currentAppointment.address || ""
    document.getElementById("video-link").value = this.currentAppointment.videoLink || ""
    document.getElementById("appointment-reason").value = this.currentAppointment.reason
    document.getElementById("appointment-type").value = this.currentAppointment.type

    // Set modality
    const modalityRadio = document.getElementById(`modality-${this.currentAppointment.modality}`)
    if (modalityRadio) {
      modalityRadio.checked = true
      this.handleModalityChange(this.currentAppointment.modality)
    }

    this.closeModal("appointment-details-modal")
    this.openModal("appointment-modal")
  }

  cancelAppointment() {
    if (!this.currentAppointment) return

    this.showConfirmation(
      "Cancelar Cita",
      "¿Está seguro de que desea cancelar esta cita?",
      `
        <div class="confirmation-details">
          <p><strong>Paciente:</strong> ${this.currentAppointment.patientName}</p>
          <p><strong>Fecha:</strong> ${this.formatDate(this.currentAppointment.date)}</p>
          <p><strong>Hora:</strong> ${this.currentAppointment.time}</p>
        </div>
      `,
      () => {
        this.appointments = this.appointments.filter((a) => a.id !== this.currentAppointment.id)

        // Also remove associated teleconsulta call if exists
        this.calls = this.calls.filter((c) => c.appointmentId !== this.currentAppointment.id)

        this.saveAppointments()
        this.saveCalls()
        this.renderCalendar()
        this.renderAppointments()
        this.renderCalls()
        this.closeModal("appointment-details-modal")
        this.closeModal("confirmation-modal")
        window.IncluyesApp.showNotification("Cita cancelada correctamente", "success")
      },
    )
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  showConfirmation(title, message, details, onConfirm) {
    document.getElementById("confirmation-title").textContent = title
    document.getElementById("confirmation-message").textContent = message
    document.getElementById("confirmation-details").innerHTML = details

    const confirmBtn = document.getElementById("confirm-action-btn")
    confirmBtn.onclick = onConfirm

    this.openModal("confirmation-modal")
  }

  showCallModal(callId) {
    const call = this.calls.find((c) => c.id === callId)
    if (!call) return

    const callDate = new Date(call.date)
    const formattedDate = callDate.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })

    this.showConfirmation(
      "Llamando a...",
      "",
      `
      <div class="call-modal-content">
        <div class="call-modal-info">
          <p><strong>Paciente:</strong> ${call.patientName}</p>
          <p><strong>Fecha:</strong> ${formattedDate}</p>
          <p><strong>Hora:</strong> ${call.time}</p>
          <p><strong>Teléfono:</strong> ${call.phone}</p>
          <p><strong>Motivo:</strong> ${call.reason}</p>
        </div>
      </div>
    `,
      () => {
        // Confirmar llamada
        this.makeCall(call)
      },
    )

    // Cambiar los textos de los botones
    document.getElementById("confirm-action-btn").textContent = "Confirmar"
    document.querySelector(".btn-cancel").textContent = "Cancelar"
  }

  makeCall(call) {
    // Cerrar modal de confirmación
    this.closeModal("confirmation-modal")

    // Mostrar notificación de llamada iniciada
    window.IncluyesApp.showNotification(`Llamando a ${call.patientName} (${call.phone})...`, "info")

    // Si es teleconsulta, también ofrecer opción de video
    if (call.type === "teleconsulta" && call.videoLink) {
      setTimeout(() => {
        this.showConfirmation(
          "Opciones de Comunicación",
          "¿Desea también unirse a la videollamada?",
          `
          <div class="call-options">
            <p><strong>Enlace de videollamada:</strong></p>
            <p><a href="${call.videoLink}" target="_blank">${call.videoLink}</a></p>
          </div>
        `,
          () => {
            // Abrir videollamada
            window.open(call.videoLink, "_blank", "width=1200,height=800,scrollbars=yes,resizable=yes")
            this.closeModal("confirmation-modal")
            window.IncluyesApp.showNotification("Videollamada iniciada", "success")
          },
        )

        // Cambiar textos de botones
        document.getElementById("confirm-action-btn").textContent = "Abrir Video"
        document.querySelector(".btn-cancel").textContent = "Solo Teléfono"
      }, 1000)
    }

    // Intentar abrir la aplicación de teléfono
    window.location.href = `tel:${call.phone}`

    // Simular finalización de llamada después de un tiempo
    setTimeout(() => {
      window.IncluyesApp.showNotification("Llamada finalizada", "success")
    }, 3000)
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.display = "block"
      document.body.style.overflow = "hidden"
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.display = "none"
      document.body.style.overflow = "auto"
    }
  }

  resetAppointmentForm() {
    document.getElementById("appointment-form").reset()
    this.currentAppointment = null
    this.selectedPatient = null

    // Reset UI state
    document.getElementById("selected-patient-info").style.display = "none"
    document.getElementById("manual-patient-entry").style.display = "block"
    document.getElementById("address-group").style.display = "none"
    document.getElementById("video-link-group").style.display = "none"
    document.getElementById("patient-search-input").value = ""
    this.closePatientResults()

    // Reset modality to presencial
    document.getElementById("modality-presencial").checked = true

    this.setDefaultDate()
  }

  resetCallForm() {
    document.getElementById("call-form").reset()
    this.currentCall = null
    this.setDefaultDate()
  }

  loadPatients() {
    const saved = localStorage.getItem("incluyes_patients")
    if (saved) {
      return JSON.parse(saved)
    }

    // Sample patient data
    return [
      {
        id: "1",
        name: "María González López",
        curp: "GOML850315MDFNZR03",
        nss: "12345678901",
        phone: "555-0123",
        email: "maria.gonzalez@email.com",
        address: "Calle Principal 123, Col. Centro",
        birthDate: "1985-03-15",
        gender: "F",
      },
      {
        id: "2",
        name: "Juan Carlos Pérez",
        curp: "PECJ900512HDFRRL05",
        nss: "98765432109",
        phone: "555-0456",
        email: "juan.perez@email.com",
        address: "Av. Reforma 456, Col. Moderna",
        birthDate: "1990-05-12",
        gender: "M",
      },
      {
        id: "3",
        name: "Ana Sofía Martínez",
        curp: "MASA950728MDFRTL08",
        nss: "55667788990",
        phone: "555-0789",
        email: "ana.martinez@email.com",
        address: "Blvd. Independencia 789, Col. Nueva",
        birthDate: "1995-07-28",
        gender: "F",
      },
      {
        id: "4",
        name: "Roberto Silva Hernández",
        curp: "SIHR880920HDFRLB02",
        nss: "11223344556",
        phone: "555-0321",
        email: "roberto.silva@email.com",
        address: "Calle Morelos 321, Col. Centro",
        birthDate: "1988-09-20",
        gender: "M",
      },
      {
        id: "5",
        name: "Carmen Rodríguez Vega",
        curp: "ROVC920415MDFGMR07",
        nss: "99887766554",
        phone: "555-0654",
        email: "carmen.rodriguez@email.com",
        address: "Av. Juárez 654, Col. Jardines",
        birthDate: "1992-04-15",
        gender: "F",
      },
    ]
  }

  loadAppointments() {
    const saved = localStorage.getItem("incluyes_appointments")
    if (saved) {
      return JSON.parse(saved)
    }

    // Sample data
    return [
      {
        id: "1",
        patientId: "1",
        patientName: "María González López",
        phone: "555-0123",
        date: "2024-05-16",
        time: "10:00",
        modality: "presencial",
        address: "",
        videoLink: "",
        reason: "Consulta de rutina",
        type: "consulta-general",
        status: "programada",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        patientId: "2",
        patientName: "Juan Carlos Pérez",
        phone: "555-0456",
        date: "2024-05-17",
        time: "14:30",
        modality: "teleconsulta",
        address: "",
        videoLink: "https://meet.incluyes.com/abc-defg-hij",
        reason: "Seguimiento de tratamiento",
        type: "seguimiento",
        status: "programada",
        createdAt: new Date().toISOString(),
      },
    ]
  }

  loadCalls() {
    const saved = localStorage.getItem("incluyes_calls")
    if (saved) {
      return JSON.parse(saved)
    }

    // Sample data for today
    const today = new Date().toISOString().split("T")[0]
    return [
      {
        id: "1",
        patientName: "Ana Sofía Martínez",
        phone: "555-0789",
        date: today,
        time: "09:00",
        priority: "alta",
        reason: "Recordatorio de cita",
        notes: "Paciente solicitó confirmación",
        status: "programada",
        type: "manual",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        patientName: "Roberto Silva",
        phone: "555-0321",
        date: today,
        time: "11:30",
        priority: "normal",
        reason: "Consulta de resultados",
        notes: "Resultados de laboratorio listos",
        status: "programada",
        type: "manual",
        createdAt: new Date().toISOString(),
      },
    ]
  }

  saveAppointments() {
    localStorage.setItem("incluyes_appointments", JSON.stringify(this.appointments))
  }

  saveCalls() {
    localStorage.setItem("incluyes_calls", JSON.stringify(this.calls))
  }

  savePatients() {
    localStorage.setItem("incluyes_patients", JSON.stringify(this.patients))
  }
}

// Global functions for modal and actions
function openNewAppointmentModal() {
  appointmentSystem.resetAppointmentForm()
  appointmentSystem.openModal("appointment-modal")
}

function openNewCallModal() {
  appointmentSystem.resetCallForm()
  appointmentSystem.openModal("call-modal")
}

function closeModal(modalId) {
  appointmentSystem.closeModal(modalId)
}

function saveAppointment() {
  appointmentSystem.saveAppointment()
}

function saveCall() {
  appointmentSystem.saveCall()
}

function editAppointment() {
  appointmentSystem.editAppointment()
}

function cancelAppointment() {
  appointmentSystem.cancelAppointment()
}

function searchPatients() {
  appointmentSystem.searchPatients()
}

function closePatientResults() {
  appointmentSystem.closePatientResults()
}

function changePatient() {
  appointmentSystem.changePatient()
}

function generateVideoLink() {
  appointmentSystem.generateVideoLink()
}

function showCallModal(callId) {
  appointmentSystem.showCallModal(callId)
}

function makeCall(phone) {
  // Simulate making a call
  window.IncluyesApp.showNotification(`Iniciando llamada a ${phone}...`, "info")

  // In a real application, this would integrate with a telephony system
  setTimeout(() => {
    window.IncluyesApp.showNotification("Llamada finalizada", "success")
  }, 3000)
}

function cancelCall(callId) {
  appointmentSystem.calls = appointmentSystem.calls.filter((c) => c.id !== callId)
  appointmentSystem.saveCalls()
  appointmentSystem.renderCalls()
  window.IncluyesApp.showNotification("Llamada cancelada", "success")
}

// Initialize the appointment system when the page loads
let appointmentSystem

document.addEventListener("DOMContentLoaded", () => {
  // Wait for the main script to load the navbar
  setTimeout(() => {
    appointmentSystem = new AppointmentSystem()
  }, 1000)
})

// Close modals when clicking outside
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    appointmentSystem.closeModal(event.target.id)
  }
})
