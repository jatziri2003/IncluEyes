// JavaScript para el Sistema de Historial Clínico

// Variables globales
let currentPatient = null
let currentTab = "consultas"
let currentAddType = ""

// Datos de ejemplo expandidos
const patientsData = {
  1: {
    id: 1,
    name: "María González López",
    age: 45,
    gender: "Femenino",
    curp: "GOML850315MDFNZR03",
    nss: "12345678901",
    consultations: [
      {
        id: 1,
        date: "2024-01-15",
        doctor: "Dr. Roberto Sánchez",
        reason: "Dolor de cabeza recurrente y mareos",
        examination:
          "Paciente consciente, orientada. Signos vitales estables. No se observan signos neurológicos focales.",
        diagnosis: "Migraña tensional",
        treatment: "Ibuprofeno 400mg cada 8 horas por 5 días. Relajación y técnicas de manejo del estrés.",
        studies: "Tomografía computarizada de cráneo si persisten los síntomas",
      },
    ],
    antecedentes: {
      allergies: ["Penicilina", "Polen de gramíneas"],
      chronicDiseases: ["Hipertensión arterial"],
      medications: ["Losartán 50mg diario"],
      surgeries: ["Apendicectomía (2015)"],
      vaccines: ["COVID-19 (2023)", "Influenza (2023)"],
      familyHistory: ["Diabetes tipo 2 (madre)", "Hipertensión (padre)", "Cáncer de mama (abuela materna)"],
    },
    prescriptions: [
      {
        id: 1,
        date: "2024-01-15",
        doctor: "Dr. Roberto Sánchez",
        patient: "María González López",
        medications: "Ibuprofeno 400mg cada 8 horas por 5 días",
        dose: "400mg",
        instructions: "Tomar con alimentos. Suspender si presenta molestias gástricas.",
      },
    ],
  },
  2: {
    id: 2,
    name: "Juan Carlos Pérez",
    age: 32,
    gender: "Masculino",
    curp: "PECJ900512HDFRRL05",
    nss: "98765432109",
    consultations: [],
    antecedentes: {
      allergies: [],
      chronicDiseases: [],
      medications: [],
      surgeries: [],
      vaccines: [],
      familyHistory: [],
    },
    prescriptions: [],
  },
  3: {
    id: 3,
    name: "Ana Sofía Martínez",
    age: 28,
    gender: "Femenino",
    curp: "MASA950728MDFRTL08",
    nss: "55667788990",
    consultations: [],
    antecedentes: {
      allergies: [],
      chronicDiseases: [],
      medications: [],
      surgeries: [],
      vaccines: [],
      familyHistory: [],
    },
    prescriptions: [],
  },
}

// Funciones de navegación
function showPatientList() {
  hideAllScreens()
  document.getElementById("patient-list-screen").classList.add("active")
}

function viewPatient(patientId) {
  currentPatient = patientsData[patientId]
  if (!currentPatient) return

  // Actualizar información del paciente
  document.getElementById("patient-name").textContent = currentPatient.name
  document.getElementById("patient-age").textContent = `(${currentPatient.age})`
  document.getElementById("patient-gender").textContent = `(${currentPatient.gender})`
  document.getElementById("patient-curp").textContent = `(${currentPatient.curp})`
  document.getElementById("patient-nss").textContent = `(${currentPatient.nss})`

  // Cargar datos del paciente
  loadPatientData()

  // Mostrar pantalla de detalle
  hideAllScreens()
  document.getElementById("patient-detail-screen").classList.add("active")
}

function hideAllScreens() {
  const screens = document.querySelectorAll(".screen")
  screens.forEach((screen) => screen.classList.remove("active"))
}

// Función para cargar datos del paciente
function loadPatientData() {
  if (!currentPatient) return

  loadConsultations()
  loadAntecedentes()
  loadPrescriptions()
  updateCounters()
}

// Función para cargar consultas
function loadConsultations() {
  const consultationsList = document.getElementById("consultations-list")
  consultationsList.innerHTML = ""

  if (currentPatient.consultations && currentPatient.consultations.length > 0) {
    currentPatient.consultations.forEach((consultation) => {
      const consultationElement = createConsultationElement(consultation)
      consultationsList.appendChild(consultationElement)
    })
  } else {
    consultationsList.innerHTML = '<div class="no-data">No hay consultas registradas para este paciente.</div>'
  }
}

// Función para crear elemento de consulta
function createConsultationElement(consultation) {
  const div = document.createElement("div")
  div.className = "consultation-item"

  const date = new Date(consultation.date).toLocaleDateString("es-ES")

  div.innerHTML = `
        <div class="consultation-header">
            <div class="consultation-date">${date}</div>
            <div class="consultation-doctor">${consultation.doctor}</div>
        </div>
        <div class="consultation-details">
            <div class="consultation-expanded">
                <div class="detail-row">
                    <div class="detail-label">Motivo de Consulta:</div>
                    <div class="detail-value">${consultation.reason}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Exploración Física:</div>
                    <div class="detail-value">${consultation.examination || "No registrada"}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Diagnóstico:</div>
                    <div class="detail-value">${consultation.diagnosis}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Tratamiento:</div>
                    <div class="detail-value">${consultation.treatment || "No registrado"}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Estudios Solicitados:</div>
                    <div class="detail-value">${consultation.studies || "Ninguno"}</div>
                </div>
            </div>
        </div>
    `

  return div
}

// Función para cargar antecedentes
function loadAntecedentes() {
  if (!currentPatient.antecedentes) return

  const sections = ["allergies", "chronic-diseases", "medications", "surgeries", "vaccines", "family-history"]
  const dataKeys = ["allergies", "chronicDiseases", "medications", "surgeries", "vaccines", "familyHistory"]

  sections.forEach((section, index) => {
    const container = document.getElementById(section + "-content")
    const data = currentPatient.antecedentes[dataKeys[index]] || []

    container.innerHTML = ""

    if (data.length > 0) {
      data.forEach((item) => {
        const itemDiv = document.createElement("div")
        itemDiv.className = "antecedente-item"
        itemDiv.textContent = item
        container.appendChild(itemDiv)
      })
    }
  })
}

// Función para cargar recetas
function loadPrescriptions() {
  const prescriptionsList = document.getElementById("prescriptions-list")
  prescriptionsList.innerHTML = ""

  if (currentPatient.prescriptions && currentPatient.prescriptions.length > 0) {
    currentPatient.prescriptions.forEach((prescription) => {
      const prescriptionElement = createPrescriptionElement(prescription)
      prescriptionsList.appendChild(prescriptionElement)
    })
  } else {
    prescriptionsList.innerHTML = '<div class="no-data">No hay recetas registradas para este paciente.</div>'
  }
}

// Función para crear elemento de receta
function createPrescriptionElement(prescription) {
  const div = document.createElement("div")
  div.className = "prescription-item"

  const date = new Date(prescription.date).toLocaleDateString("es-ES")

  div.innerHTML = `
        <div class="prescription-header">
            <div class="prescription-date">${date}</div>
            <div class="prescription-doctor">${prescription.doctor}</div>
        </div>
        <div class="prescription-details">
            <div class="detail-row">
                <div class="detail-label">Paciente:</div>
                <div class="detail-value">${prescription.patient}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Medicamentos:</div>
                <div class="detail-value">${prescription.medications}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Dosis:</div>
                <div class="detail-value">${prescription.dose}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Instrucciones:</div>
                <div class="detail-value">${prescription.instructions}</div>
            </div>
        </div>
    `

  return div
}

// Funciones para manejo de pestañas
function showTab(tabName) {
  // Ocultar todas las pestañas
  const tabContents = document.querySelectorAll(".tab-content")
  tabContents.forEach((tab) => tab.classList.remove("active"))

  // Remover clase active de todos los botones
  const tabButtons = document.querySelectorAll(".tab-btn")
  tabButtons.forEach((btn) => btn.classList.remove("active"))

  // Mostrar pestaña seleccionada
  document.getElementById(tabName + "-tab").classList.add("active")

  // Activar botón correspondiente
  event.target.classList.add("active")

  currentTab = tabName
}

// Funciones para modales
function showModal(modalId) {
  document.getElementById(modalId).classList.add("active")
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active")

  // Limpiar formularios
  if (modalId === "consultation-modal") {
    clearConsultationForm()
  } else if (modalId === "prescription-modal") {
    clearPrescriptionForm()
  } else if (modalId === "add-item-modal") {
    document.getElementById("add-item-input").value = ""
  }
}

// Funciones para formularios
function showNewConsultationForm() {
  // Establecer fecha actual
  document.getElementById("consultation-date").value = new Date().toISOString().split("T")[0]

  // Mantener el nombre del doctor si ya se ingresó anteriormente
  const lastDoctor = localStorage.getItem("lastDoctorName")
  if (lastDoctor) {
    document.getElementById("consultation-doctor").value = lastDoctor
  }

  showModal("consultation-modal")
}

function showNewPrescriptionForm() {
  // Establecer fecha actual y nombre del paciente
  document.getElementById("prescription-date").value = new Date().toISOString().split("T")[0]
  document.getElementById("prescription-patient").value = currentPatient.name

  // Mantener el nombre del doctor si ya se ingresó anteriormente
  const lastDoctor = localStorage.getItem("lastDoctorName")
  if (lastDoctor) {
    document.getElementById("prescription-doctor").value = lastDoctor
  }

  showModal("prescription-modal")
}

function showAddModal(type, title) {
  currentAddType = type
  document.getElementById("add-item-title").textContent = title
  document.getElementById("add-item-label").textContent = title + ":"
  showModal("add-item-modal")
}

function clearConsultationForm() {
  const form = document.getElementById("consultation-form")
  form.reset()
}

function clearPrescriptionForm() {
  const form = document.getElementById("prescription-form")
  form.reset()
}

// Funciones para guardar datos
function saveConsultation() {
  if (!currentPatient) return

  const consultation = {
    id: Date.now(),
    date: document.getElementById("consultation-date").value,
    doctor: document.getElementById("consultation-doctor").value,
    reason: document.getElementById("consultation-reason").value,
    examination: document.getElementById("consultation-examination").value,
    diagnosis: document.getElementById("consultation-diagnosis").value,
    treatment: document.getElementById("consultation-treatment").value,
    studies: document.getElementById("consultation-studies").value,
  }

  // Validar campos requeridos
  if (!consultation.date || !consultation.doctor || !consultation.reason || !consultation.diagnosis) {
    alert("Por favor, complete todos los campos requeridos (Fecha, Doctor, Motivo y Diagnóstico).")
    return
  }

  // Agregar consulta al paciente
  if (!currentPatient.consultations) {
    currentPatient.consultations = []
  }

  // Agregar al inicio del array para mostrar las más recientes primero
  currentPatient.consultations.unshift(consultation)

  // Recargar lista de consultas
  loadConsultations()
  updateCounters()

  // Cerrar modal
  closeModal("consultation-modal")

  // Mostrar mensaje de éxito
  showSuccessMessage("Consulta guardada exitosamente")

  // Opcional: Preguntar si desea agregar otra consulta
  setTimeout(() => {
    if (confirm("¿Desea agregar otra consulta para este paciente?")) {
      showNewConsultationForm()
    }
  }, 1000)
}

function savePrescription() {
  if (!currentPatient) return

  const prescription = {
    id: Date.now(),
    date: document.getElementById("prescription-date").value,
    doctor: document.getElementById("prescription-doctor").value,
    patient: document.getElementById("prescription-patient").value,
    medications: document.getElementById("prescription-medications").value,
    dose: document.getElementById("prescription-dose").value,
    instructions: document.getElementById("prescription-instructions").value,
  }

  // Validar campos requeridos
  if (!prescription.date || !prescription.doctor || !prescription.medications || !prescription.dose) {
    alert("Por favor, complete todos los campos requeridos.")
    return
  }

  // Agregar receta al paciente
  if (!currentPatient.prescriptions) {
    currentPatient.prescriptions = []
  }

  // Agregar al inicio del array para mostrar las más recientes primero
  currentPatient.prescriptions.unshift(prescription)

  // Recargar lista de recetas
  loadPrescriptions()
  updateCounters()

  // Cerrar modal
  closeModal("prescription-modal")

  // Mostrar mensaje de éxito
  showSuccessMessage("Receta guardada exitosamente")

  // Opcional: Preguntar si desea agregar otra receta
  setTimeout(() => {
    if (confirm("¿Desea agregar otra receta para este paciente?")) {
      showNewPrescriptionForm()
    }
  }, 1000)
}

// Funciones para acciones rápidas
function duplicateLastConsultation() {
  if (!currentPatient || !currentPatient.consultations || currentPatient.consultations.length === 0) {
    alert("No hay consultas previas para duplicar.")
    return
  }

  const lastConsultation = currentPatient.consultations[0]

  // Prellenar el formulario con los datos de la última consulta
  document.getElementById("consultation-date").value = new Date().toISOString().split("T")[0]
  document.getElementById("consultation-doctor").value = lastConsultation.doctor
  document.getElementById("consultation-reason").value = lastConsultation.reason
  document.getElementById("consultation-examination").value = lastConsultation.examination || ""
  document.getElementById("consultation-diagnosis").value = lastConsultation.diagnosis
  document.getElementById("consultation-treatment").value = lastConsultation.treatment || ""
  document.getElementById("consultation-studies").value = lastConsultation.studies || ""

  showModal("consultation-modal")
}

function duplicateLastPrescription() {
  if (!currentPatient || !currentPatient.prescriptions || currentPatient.prescriptions.length === 0) {
    alert("No hay recetas previas para duplicar.")
    return
  }

  const lastPrescription = currentPatient.prescriptions[0]

  // Prellenar el formulario con los datos de la última receta
  document.getElementById("prescription-date").value = new Date().toISOString().split("T")[0]
  document.getElementById("prescription-doctor").value = lastPrescription.doctor
  document.getElementById("prescription-patient").value = currentPatient.name
  document.getElementById("prescription-medications").value = lastPrescription.medications
  document.getElementById("prescription-dose").value = lastPrescription.dose
  document.getElementById("prescription-instructions").value = lastPrescription.instructions

  showModal("prescription-modal")
}

// Función para consulta rápida (formulario simplificado)
function showQuickConsultation() {
  // Crear modal de consulta rápida
  const quickModal = document.createElement("div")
  quickModal.id = "quick-consultation-modal"
  quickModal.className = "modal active"

  quickModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Consulta Rápida</h3>
                <button class="close-btn" onclick="closeQuickModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Motivo de Consulta:</label>
                    <textarea id="quick-reason" rows="2" placeholder="Motivo principal..." required></textarea>
                </div>
                <div class="form-group">
                    <label>Diagnóstico:</label>
                    <textarea id="quick-diagnosis" rows="2" placeholder="Diagnóstico..." required></textarea>
                </div>
                <div class="form-group">
                    <label>Tratamiento:</label>
                    <textarea id="quick-treatment" rows="2" placeholder="Tratamiento recomendado..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeQuickModal()">Cancelar</button>
                <button class="btn-save" onclick="saveQuickConsultation()">Guardar</button>
                <button class="btn-save" onclick="saveQuickConsultation(true)" style="background: #28a745;">Guardar y Agregar Otra</button>
            </div>
        </div>
    `

  document.body.appendChild(quickModal)
}

function closeQuickModal() {
  const modal = document.getElementById("quick-consultation-modal")
  if (modal) {
    modal.remove()
  }
}

function saveQuickConsultation(addAnother = false) {
  if (!currentPatient) return

  const lastDoctor = localStorage.getItem("lastDoctorName") || "Dr. [Nombre]"

  const consultation = {
    id: Date.now(),
    date: new Date().toISOString().split("T")[0],
    doctor: lastDoctor,
    reason: document.getElementById("quick-reason").value,
    examination: "Pendiente de registro completo",
    diagnosis: document.getElementById("quick-diagnosis").value,
    treatment: document.getElementById("quick-treatment").value,
    studies: "",
  }

  // Validar campos requeridos
  if (!consultation.reason || !consultation.diagnosis) {
    alert("Por favor, complete el motivo y diagnóstico.")
    return
  }

  // Agregar consulta al paciente
  if (!currentPatient.consultations) {
    currentPatient.consultations = []
  }

  currentPatient.consultations.unshift(consultation)
  loadConsultations()
  updateCounters()

  if (addAnother) {
    // Limpiar campos pero mantener modal abierto
    document.getElementById("quick-reason").value = ""
    document.getElementById("quick-diagnosis").value = ""
    document.getElementById("quick-treatment").value = ""
    showSuccessMessage("Consulta guardada. Agregue otra consulta.")
  } else {
    closeQuickModal()
    showSuccessMessage("Consulta rápida guardada exitosamente")
  }
}

// Función para receta rápida
function showQuickPrescription() {
  const quickModal = document.createElement("div")
  quickModal.id = "quick-prescription-modal"
  quickModal.className = "modal active"

  quickModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Receta Rápida</h3>
                <button class="close-btn" onclick="closeQuickPrescriptionModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Medicamento:</label>
                    <input type="text" id="quick-medication" placeholder="Nombre del medicamento" required>
                </div>
                <div class="form-group">
                    <label>Dosis y Frecuencia:</label>
                    <input type="text" id="quick-dose" placeholder="ej. 500mg cada 8 horas" required>
                </div>
                <div class="form-group">
                    <label>Duración:</label>
                    <input type="text" id="quick-duration" placeholder="ej. 7 días" required>
                </div>
                <div class="form-group">
                    <label>Instrucciones:</label>
                    <textarea id="quick-instructions" rows="2" placeholder="Instrucciones especiales..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeQuickPrescriptionModal()">Cancelar</button>
                <button class="btn-save" onclick="saveQuickPrescription()">Guardar</button>
                <button class="btn-save" onclick="saveQuickPrescription(true)" style="background: #28a745;">Guardar y Agregar Otra</button>
            </div>
        </div>
    `

  document.body.appendChild(quickModal)
}

function closeQuickPrescriptionModal() {
  const modal = document.getElementById("quick-prescription-modal")
  if (modal) {
    modal.remove()
  }
}

function saveQuickPrescription(addAnother = false) {
  if (!currentPatient) return

  const lastDoctor = localStorage.getItem("lastDoctorName") || "Dr. [Nombre]"
  const medication = document.getElementById("quick-medication").value
  const dose = document.getElementById("quick-dose").value
  const duration = document.getElementById("quick-duration").value
  const instructions = document.getElementById("quick-instructions").value

  const prescription = {
    id: Date.now(),
    date: new Date().toISOString().split("T")[0],
    doctor: lastDoctor,
    patient: currentPatient.name,
    medications: `${medication} - ${dose} por ${duration}`,
    dose: dose,
    instructions: instructions || "Tomar según indicaciones médicas",
  }

  // Validar campos requeridos
  if (!medication || !dose || !duration) {
    alert("Por favor, complete todos los campos requeridos.")
    return
  }

  // Agregar receta al paciente
  if (!currentPatient.prescriptions) {
    currentPatient.prescriptions = []
  }

  currentPatient.prescriptions.unshift(prescription)
  loadPrescriptions()
  updateCounters()

  if (addAnother) {
    // Limpiar campos pero mantener modal abierto
    document.getElementById("quick-medication").value = ""
    document.getElementById("quick-dose").value = ""
    document.getElementById("quick-duration").value = ""
    document.getElementById("quick-instructions").value = ""
    showSuccessMessage("Receta guardada. Agregue otra receta.")
  } else {
    closeQuickPrescriptionModal()
    showSuccessMessage("Receta rápida guardada exitosamente")
  }
}

// Función para actualizar contadores
function updateCounters() {
  if (!currentPatient) return

  const consultationsCount = currentPatient.consultations ? currentPatient.consultations.length : 0
  const prescriptionsCount = currentPatient.prescriptions ? currentPatient.prescriptions.length : 0

  const consultationsCounter = document.getElementById("consultations-counter")
  const prescriptionsCounter = document.getElementById("prescriptions-counter")

  if (consultationsCounter) {
    consultationsCounter.textContent = `${consultationsCount} consulta${consultationsCount !== 1 ? "s" : ""} registrada${consultationsCount !== 1 ? "s" : ""}`
  }

  if (prescriptionsCounter) {
    prescriptionsCounter.textContent = `${prescriptionsCount} receta${prescriptionsCount !== 1 ? "s" : ""} registrada${prescriptionsCount !== 1 ? "s" : ""}`
  }
}

function addItem() {
  if (!currentPatient || !currentAddType) return

  const value = document.getElementById("add-item-input").value.trim()
  if (!value) {
    alert("Por favor, ingrese la información.")
    return
  }

  // Mapear tipos a claves de datos
  const typeMap = {
    allergies: "allergies",
    "chronic-diseases": "chronicDiseases",
    medications: "medications",
    surgeries: "surgeries",
    vaccines: "vaccines",
    "family-history": "familyHistory",
  }

  const dataKey = typeMap[currentAddType]
  if (!dataKey) return

  // Inicializar antecedentes si no existen
  if (!currentPatient.antecedentes) {
    currentPatient.antecedentes = {
      allergies: [],
      chronicDiseases: [],
      medications: [],
      surgeries: [],
      vaccines: [],
      familyHistory: [],
    }
  }

  // Agregar nuevo item
  if (!currentPatient.antecedentes[dataKey]) {
    currentPatient.antecedentes[dataKey] = []
  }
  currentPatient.antecedentes[dataKey].push(value)

  // Recargar antecedentes
  loadAntecedentes()

  // Cerrar modal
  closeModal("add-item-modal")

  // Mostrar mensaje de éxito
  showSuccessMessage("Información agregada exitosamente")
}

// Función para búsqueda de pacientes
function filterPatients() {
  const searchTerm = document.getElementById("patient-search").value.toLowerCase()
  const tableRows = document.querySelectorAll(".table-row")

  tableRows.forEach((row) => {
    const patientName = row.querySelector(".cell:first-child").textContent.toLowerCase()
    const patientCurp = row.querySelector(".cell:nth-child(2)").textContent.toLowerCase()
    const patientNss = row.querySelector(".cell:nth-child(3)").textContent.toLowerCase()

    if (patientName.includes(searchTerm) || patientCurp.includes(searchTerm) || patientNss.includes(searchTerm)) {
      row.style.display = "grid"
    } else {
      row.style.display = "none"
    }
  })
}

// Función para mostrar mensajes de éxito
function showSuccessMessage(message) {
  // Crear elemento de mensaje
  const messageDiv = document.createElement("div")
  messageDiv.className = "success-message"
  messageDiv.textContent = message
  messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `

  // Agregar animación CSS si no existe
  if (!document.getElementById("success-animation-style")) {
    const style = document.createElement("style")
    style.id = "success-animation-style"
    style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `
    document.head.appendChild(style)
  }

  document.body.appendChild(messageDiv)

  // Remover mensaje después de 3 segundos
  setTimeout(() => {
    messageDiv.remove()
  }, 3000)
}

// Función para guardar el nombre del doctor en localStorage
function saveDoctorName(doctorName) {
  if (doctorName && doctorName.trim()) {
    localStorage.setItem("lastDoctorName", doctorName.trim())
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar pantalla de lista de pacientes por defecto
  showPatientList()

  // Agregar event listener para búsqueda
  const searchInput = document.getElementById("patient-search")
  if (searchInput) {
    searchInput.addEventListener("input", filterPatients)
  }

  // Cerrar modales al hacer clic fuera
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal.id)
      }
    })
  })

  // Event listener para el campo de doctor en consultas
  const consultationDoctorField = document.getElementById("consultation-doctor")
  if (consultationDoctorField) {
    consultationDoctorField.addEventListener("blur", (e) => {
      saveDoctorName(e.target.value)
    })
  }

  // Event listener para el campo de doctor en recetas
  const prescriptionDoctorField = document.getElementById("prescription-doctor")
  if (prescriptionDoctorField) {
    prescriptionDoctorField.addEventListener("blur", (e) => {
      saveDoctorName(e.target.value)
    })
  }
})

// Agregar estilos para elementos sin datos
const additionalStyles = `
    .no-data {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 40px 20px;
        background: #f8fbff;
        border-radius: 8px;
        border: 2px dashed #e0e6ed;
    }
`

// Agregar estilos adicionales al documento
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalStyles
document.head.appendChild(styleSheet)
