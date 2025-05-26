// Variables globales
let isPatientRecording = false
let isDoctorRecording = false
let isCameraActive = false
let isMicrophoneActive = false
let currentStream = null
let handDetectionActive = false
const translationInterval = null
const speechSynthesis = window.speechSynthesis
let recognition = null
const liveMessageElement = null
const $ = window.jQuery // Declare the jQuery variable

// Elementos del DOM
const cameraVideo = document.getElementById("cameraVideo")
const cameraPlaceholder = document.getElementById("cameraPlaceholder")
const handDetection = document.getElementById("handDetection")
const chatMessages = document.getElementById("chatMessages")
const translationText = document.getElementById("translationText")
const loadingOverlay = document.getElementById("loadingOverlay")

// Botones de control
const cameraBtn = document.getElementById("cameraBtn")
const settingsBtn = document.getElementById("settingsBtn")
const micToggle = document.getElementById("micToggle")
const testVoice = document.getElementById("testVoice")

// Nuevos botones de grabación
const patientRecordBtn = document.getElementById("patientRecordBtn")
const doctorRecordBtn = document.getElementById("doctorRecordBtn")

// Controles de voz
const speechRate = document.getElementById("speechRate")
const speechVolume = document.getElementById("speechVolume")
const audioLevel = document.getElementById("audioLevel")

// Simulación de traducciones LSM médicas
const medicalTranslations = [
  "Buenos días, doctor",
  "Me duele la cabeza desde ayer",
  "¿Qué medicamento debo tomar?",
  "Tengo náuseas y mareos",
  "¿Cuándo debo regresar?",
  "No entiendo las instrucciones",
  "¿Puede repetir por favor?",
  "Gracias por su ayuda",
  "¿Es grave mi condición?",
  "Necesito una receta médica",
]

// Respuestas médicas simuladas
const medicalResponses = {
  "Buenos días, doctor": "¡Buenos días! ¿Cómo se siente hoy?",
  "Me duele la cabeza desde ayer": "¿El dolor es constante o intermitente? ¿Ha tomado algún analgésico?",
  "¿Qué medicamento debo tomar?": "Le recetaré paracetamol 500mg cada 8 horas. ¿Es alérgico a algún medicamento?",
  "Tengo náuseas y mareos": "¿Desde cuándo presenta estos síntomas? ¿Ha vomitado?",
  "¿Cuándo debo regresar?": "Regrese en una semana para evaluación. Si empeora, venga antes.",
  "No entiendo las instrucciones": "Le explico nuevamente: tome el medicamento con alimentos, cada 8 horas.",
  "¿Puede repetir por favor?": "Por supuesto. ¿Qué parte necesita que le aclare?",
  "Gracias por su ayuda": "De nada. Siga las indicaciones y cuídese mucho.",
  "¿Es grave mi condición?": "Su condición es tratable. Con el tratamiento adecuado mejorará.",
  "Necesito una receta médica": "Sí, le daré la receta. ¿Tiene seguro médico?",
}

// Inicialización con jQuery
$(() => {
  initializeApp()
  setupEventListeners()
  setupTabNavigation()
  setupCameraAccess()
  setupRecordingButtons()
})

// Configurar botones de grabación
function setupRecordingButtons() {
  // Botón del paciente
  if (patientRecordBtn) {
    patientRecordBtn.addEventListener("click", () => {
      togglePatientRecording()
    })
  }

  // Botón del doctor
  if (doctorRecordBtn) {
    doctorRecordBtn.addEventListener("click", () => {
      toggleDoctorRecording()
    })
  }

  console.log("Botones de grabación configurados")
}

// Alternar grabación del paciente
function togglePatientRecording() {
  console.log("Toggle paciente - Estado actual:", isPatientRecording)

  if (!isPatientRecording) {
    startRecording("patient")
  } else {
    stopRecording("patient")
  }
}

// Alternar grabación del doctor
function toggleDoctorRecording() {
  console.log("Toggle doctor - Estado actual:", isDoctorRecording)

  if (!isDoctorRecording) {
    startRecording("doctor")
  } else {
    stopRecording("doctor")
  }
}

// Iniciar grabación
async function startRecording(speaker) {
  console.log("Iniciando grabación para:", speaker)

  try {
    // Solicitar permisos de micrófono
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((track) => track.stop()) // Solo para permisos

    // Verificar soporte de reconocimiento de voz
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      addSystemMessage("Su navegador no soporta reconocimiento de voz. Pruebe con Chrome o Edge.")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "es-ES"

    let liveMessageId = ""

    recognition.onstart = () => {
      if (speaker === "patient") {
        isPatientRecording = true
        patientRecordBtn.classList.add("recording")
      } else {
        isDoctorRecording = true
        doctorRecordBtn.classList.add("recording")
      }

      liveMessageId = createLiveMessage(speaker)
      translationText.textContent = "Micrófono activo - Hable ahora"

      // Simular nivel de audio
      simulateAudioLevel()

      addSystemMessage(`Grabación ${speaker === "patient" ? "del paciente" : "del doctor"} iniciada. Hable ahora...`)
    }

    recognition.onresult = (event) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      const displayText = finalTranscript + interimTranscript
      updateLiveMessage(liveMessageId, displayText, false)

      if (finalTranscript.trim()) {
        updateLiveMessage(liveMessageId, finalTranscript.trim(), true)

        // Leer automáticamente
        setTimeout(() => speakText(finalTranscript.trim()), 500)

        // Crear nuevo mensaje en tiempo real
        setTimeout(() => {
          if ((speaker === "patient" && isPatientRecording) || (speaker === "doctor" && isDoctorRecording)) {
            liveMessageId = createLiveMessage(speaker)
          }
        }, 100)
      }
    }

    recognition.onerror = (event) => {
      console.error("Error en reconocimiento de voz:", event.error)
      addSystemMessage("Error en reconocimiento de voz: " + event.error)
      stopRecording(speaker)
    }

    recognition.onend = () => {
      if ((speaker === "patient" && isPatientRecording) || (speaker === "doctor" && isDoctorRecording)) {
        setTimeout(() => {
          try {
            recognition.start()
          } catch (error) {
            console.error("Error al reiniciar reconocimiento:", error)
            stopRecording(speaker)
          }
        }, 100)
      }
    }

    recognition.start()
  } catch (error) {
    console.error("Error al acceder al micrófono:", error)
    addSystemMessage("Error al acceder al micrófono. Verifique los permisos.")
  }
}

// Detener grabación
function stopRecording(speaker) {
  console.log("Deteniendo grabación para:", speaker)

  if (recognition) {
    recognition.stop()
  }

  if (speaker === "patient") {
    isPatientRecording = false
    patientRecordBtn.classList.remove("recording")
  } else {
    isDoctorRecording = false
    doctorRecordBtn.classList.remove("recording")
  }

  // Limpiar mensajes en vivo
  const liveMessages = document.querySelectorAll(".message.live-message")
  liveMessages.forEach((msg) => msg.remove())

  translationText.textContent = "Esperando entrada..."
  audioLevel.style.width = "0%"

  addSystemMessage(`Grabación ${speaker === "patient" ? "del paciente" : "del doctor"} detenida.`)
}

// Crear mensaje en tiempo real
function createLiveMessage(speaker) {
  const timestamp = getCurrentTimestamp()
  const speakerText = speaker === "patient" ? "Paciente (dictado):" : "Doctor (dictado):"

  const messageHtml = `
        <div class="message ${speaker} live-message" id="live-${Date.now()}">
            <span class="timestamp">[${timestamp}]</span>
            <span class="speaker">${speakerText}</span>
            <span class="text live-text">🎤 Escuchando...</span>
            <div class="live-indicator">●</div>
        </div>
    `

  chatMessages.insertAdjacentHTML("beforeend", messageHtml)
  const newMessage = chatMessages.lastElementChild
  chatMessages.scrollTop = chatMessages.scrollHeight

  return newMessage.id
}

// Actualizar mensaje en tiempo real
function updateLiveMessage(messageId, text, isFinal = false) {
  const messageElement = document.getElementById(messageId)
  if (!messageElement) return

  const textElement = messageElement.querySelector(".live-text")
  const indicator = messageElement.querySelector(".live-indicator")

  if (isFinal) {
    textElement.textContent = text
    textElement.classList.remove("live-text")
    messageElement.classList.remove("live-message")
    if (indicator) indicator.remove()

    // Agregar botón de lectura
    const readBtn = document.createElement("button")
    readBtn.className = "read-btn"
    readBtn.innerHTML = "🔊"
    readBtn.onclick = () => speakText(text)
    messageElement.appendChild(readBtn)
  } else {
    textElement.textContent = text || "🎤 Escuchando..."
  }

  chatMessages.scrollTop = chatMessages.scrollHeight
}

// Simular nivel de audio
function simulateAudioLevel() {
  if (!isPatientRecording && !isDoctorRecording) return

  const level = Math.random() * 100
  audioLevel.style.width = level + "%"

  setTimeout(() => {
    if (isPatientRecording || isDoctorRecording) {
      simulateAudioLevel()
    }
  }, 100)
}

// Configurar acceso a cámara (tu código integrado y mejorado)
function setupCameraAccess() {
  var video = document.getElementById("cameraVideo")

  var getCameraAccess = () => {
    showLoading("Iniciando cámara...")

    // Función para manejar diferentes APIs de navegador
    var getUserMedia =
      navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

    if (getUserMedia) {
      // Usar la API antigua si está disponible
      getUserMedia.call(
        navigator,
        { video: true, audio: false }, // Options
        (localMediaStream) => {
          // Success
          try {
            // Compatibilidad con diferentes navegadores
            if (window.webkitURL) {
              video.src = window.webkitURL.createObjectURL(localMediaStream)
            } else if (window.URL) {
              video.src = window.URL.createObjectURL(localMediaStream)
            } else {
              video.srcObject = localMediaStream
            }

            currentStream = localMediaStream

            video.onloadedmetadata = () => {
              video.play()
              video.classList.add("active")
              cameraPlaceholder.classList.add("hidden")
              isCameraActive = true

              updateCameraStatus(true)
              cameraBtn.classList.add("active")
              cameraBtn.querySelector(".btn-text").textContent = "Desactivar Cámara"

              hideLoading()
              addSystemMessage("Cámara activada. Listo para detectar señas LSM.")
            }
          } catch (error) {
            console.error("Error al configurar el video:", error)
            fallbackToModernAPI()
          }
        },
        (err) => {
          // Failure
          console.log("getUserMedia failed: Code " + err.code)
          hideLoading()
          addSystemMessage("Error: No se pudo acceder a la cámara (Código: " + err.code + ")")

          // Intentar con API moderna como fallback
          fallbackToModernAPI()
        },
      )
    } else {
      // Si no hay API antigua, usar la moderna
      fallbackToModernAPI()
    }
  }

  // Función fallback para API moderna
  var fallbackToModernAPI = async () => {
    try {
      showLoading("Intentando con API moderna...")

      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      }

      currentStream = await navigator.mediaDevices.getUserMedia(constraints)
      video.srcObject = currentStream

      video.onloadedmetadata = () => {
        video.play()
        video.classList.add("active")
        cameraPlaceholder.classList.add("hidden")
        isCameraActive = true

        updateCameraStatus(true)
        cameraBtn.classList.add("active")
        cameraBtn.querySelector(".btn-text").textContent = "Desactivar Cámara"

        hideLoading()
        addSystemMessage("Cámara activada con API moderna. Listo para detectar señas LSM.")
      }
    } catch (error) {
      console.error("Error con API moderna:", error)
      hideLoading()
      addSystemMessage("Error: No se pudo acceder a la cámara. Verifique los permisos.")
    }
  }

  // Función para detener la cámara
  var stopCameraAccess = () => {
    if (currentStream) {
      // Detener todas las pistas del stream
      currentStream.getTracks().forEach((track) => {
        track.stop()
      })
      currentStream = null
    }

    // Limpiar el video
    video.src = ""
    video.srcObject = null
    video.classList.remove("active")
    cameraPlaceholder.classList.remove("hidden")
    isCameraActive = false

    updateCameraStatus(false)
    cameraBtn.classList.remove("active")
    cameraBtn.querySelector(".btn-text").textContent = "Activar Cámara"

    stopHandDetection()

    addSystemMessage("Cámara desactivada.")
  }

  // Event listener para el botón de cámara
  $("#cameraBtn").on("click", () => {
    if (!isCameraActive) {
      getCameraAccess()
    } else {
      stopCameraAccess()
    }
  })

  // También mantener compatibilidad con el evento click directo
  if (cameraBtn) {
    cameraBtn.addEventListener("click", () => {
      // Ya manejado por jQuery arriba
    })
  }
}

// Configurar event listeners
function setupEventListeners() {
  // Usar jQuery para mejor compatibilidad
  $("#settingsBtn").on("click", openSettings)
  $("#micToggle").on("click", toggleMicrophone)
  $("#testVoice").on("click", testSpeechSynthesis)

  $("#speechRate").on("input", updateSpeechSettings)
  $("#speechVolume").on("input", updateSpeechSettings)

  // Controles de voz
  if (settingsBtn) settingsBtn.addEventListener("click", openSettings)
  if (micToggle) micToggle.addEventListener("click", toggleMicrophone)
  if (testVoice) testVoice.addEventListener("click", testSpeechSynthesis)
}

// Configurar navegación de pestañas
function setupTabNavigation() {
  $(".tab-btn").on("click", function () {
    const targetTab = $(this).attr("data-tab")

    // Remover clase active de todos los botones y contenidos
    $(".tab-btn").removeClass("active")
    $(".tab-content").removeClass("active")

    // Agregar clase active al botón y contenido seleccionado
    $(this).addClass("active")
    $("#" + targetTab).addClass("active")
  })
}

// Inicializar aplicación
function initializeApp() {
  console.log("Inicializando intérprete de LSM...")
  updateCameraStatus(false)

  setTimeout(() => {
    addSystemMessage("Sistema de intérprete LSM iniciado. Use los botones azules para grabar.")
  }, 1000)

  // Verificar compatibilidad de navegador
  checkBrowserCompatibility()
}

// Verificar compatibilidad del navegador
function checkBrowserCompatibility() {
  var hasGetUserMedia = !!(
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  )

  if (!hasGetUserMedia) {
    addSystemMessage("Advertencia: Su navegador no soporta acceso a cámara.")
    return false
  }

  // Verificar HTTPS (requerido para cámara en navegadores modernos)
  if (location.protocol !== "https:" && location.hostname !== "localhost") {
    addSystemMessage("Advertencia: Se requiere HTTPS para acceso a cámara en producción.")
  }

  return true
}

// Alternar micrófono
function toggleMicrophone() {
  isMicrophoneActive = !isMicrophoneActive

  if (isMicrophoneActive) {
    startMicrophone()
  } else {
    stopMicrophone()
  }
}

// Iniciar micrófono
function startMicrophone() {
  $("#micToggle").addClass("active")
  $("#micToggle .mic-status").text("Micrófono Activo")

  simulateAudioLevel()
  addSystemMessage("Micrófono activado para respuesta por voz.")
}

// Detener micrófono
function stopMicrophone() {
  $("#micToggle").removeClass("active")
  $("#micToggle .mic-status").text("Activar Micrófono")

  $("#audioLevel").css("width", "0%")
  addSystemMessage("Micrófono desactivado.")
}

// Iniciar detección de manos
function startHandDetection() {
  handDetectionActive = true
  $(handDetection).addClass("active")
  animateHandDetection()
}

// Detener detección de manos
function stopHandDetection() {
  handDetectionActive = false
  $(handDetection).removeClass("active")
}

// Animar detección de manos
function animateHandDetection() {
  if (!handDetectionActive) return

  const detectionBox = $(".detection-box")[0]
  if (!detectionBox) return

  const maxX = handDetection.offsetWidth - 150
  const maxY = handDetection.offsetHeight - 150

  const randomX = Math.random() * maxX
  const randomY = Math.random() * maxY

  $(detectionBox).css({
    left: randomX + "px",
    top: randomY + "px",
  })

  setTimeout(() => {
    if (handDetectionActive) {
      animateHandDetection()
    }
  }, 2000)
}

// Síntesis de voz
function speakText(text) {
  if (!speechSynthesis) return

  speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "es-ES"
  utterance.rate = Number.parseFloat($("#speechRate").val() || 1)
  utterance.volume = Number.parseFloat($("#speechVolume").val() || 0.8)

  speechSynthesis.speak(utterance)
}

// Probar síntesis de voz
function testSpeechSynthesis() {
  const testText = "Esta es una prueba del sistema de síntesis de voz para el intérprete de LSM."
  speakText(testText)
}

// Actualizar configuración de voz
function updateSpeechSettings() {
  console.log("Configuración de voz actualizada:", {
    rate: $("#speechRate").val(),
    volume: $("#speechVolume").val(),
  })
}

// Agregar mensaje del sistema
function addSystemMessage(text) {
  const timestamp = getCurrentTimestamp()
  addMessage("system", "Sistema:", text, timestamp)
}

// Agregar mensaje al chat
function addMessage(type, speaker, text, timestamp) {
  const messageHtml = `
        <div class="message ${type}">
            <span class="timestamp">[${timestamp}]</span>
            <span class="speaker">${speaker}</span>
            <span class="text">${text}</span>
        </div>
    `

  $("#chatMessages").append(messageHtml)
  $("#chatMessages")[0].scrollTop = $("#chatMessages")[0].scrollHeight
}

// Obtener timestamp actual
function getCurrentTimestamp() {
  const now = new Date()
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")
  return `${minutes}:${seconds}`
}

// Actualizar estado de la cámara
function updateCameraStatus(active) {
  const $statusIndicator = $(".status-indicator")
  const $statusText = $(".status-text")

  if (active) {
    $statusIndicator.addClass("active")
    $statusText.text("Cámara activa")
  } else {
    $statusIndicator.removeClass("active")
    $statusText.text("Cámara inactiva")
  }
}

// Abrir configuración
function openSettings() {
  alert("Panel de configuración - Próximamente disponible")
}

// Mostrar loading
function showLoading(text) {
  text = text || "Cargando..."
  $(".loading-text").text(text)
  $("#loadingOverlay").addClass("show")
}

// Ocultar loading
function hideLoading() {
  $("#loadingOverlay").removeClass("show")
}

// Manejo de errores
window.addEventListener("error", (e) => {
  console.error("Error en la aplicación:", e.error)
  addSystemMessage("Error: Se produjo un problema en la aplicación.")
})

// Cleanup al cerrar la página
$(window).on("beforeunload", () => {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => {
      track.stop()
    })
  }
})

// Detectar cambios de visibilidad de la página
$(document).on("visibilitychange", () => {
  if (document.hidden && (isPatientRecording || isDoctorRecording)) {
    if (isPatientRecording) stopRecording("patient")
    if (isDoctorRecording) stopRecording("doctor")
    addSystemMessage("Grabación pausada: pestaña no visible.")
  }
})
