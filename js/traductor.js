// Variables globales
let isPatientRecording = false
let isDoctorRecording = false
let currentPatientLanguage = "nahuatl"
let currentDoctorLanguage = "spanish"
const speechSynthesis = window.speechSynthesis
let patientRecognition = null
let doctorRecognition = null
const sessionStartTime = Date.now()
let messagesCount = 0
let translationsCount = 0

// Elementos del DOM
const patientConversation = document.getElementById("patientConversation")
const doctorConversation = document.getElementById("doctorConversation")
const patientInput = document.getElementById("patientInput")
const doctorInput = document.getElementById("doctorInput")
const patientSendBtn = document.getElementById("patientSendBtn")
const doctorSendBtn = document.getElementById("doctorSendBtn")
const patientLanguageSelect = document.getElementById("patientLanguage")
const doctorLanguageSelect = document.getElementById("doctorLanguage")
const patientRecordBtn = document.getElementById("patientRecordBtn")
const doctorRecordBtn = document.getElementById("doctorRecordBtn")
const loadingOverlay = document.getElementById("loadingOverlay")
const notificationContainer = document.getElementById("notificationContainer")

// Botones de micrófono unificados
const patientMicBtn = document.getElementById("patientMicBtn")
const doctorMicBtn = document.getElementById("doctorMicBtn")

// Elementos de controles de voz
const patientSpeechRate = document.getElementById("patientSpeechRate")
const patientSpeechVolume = document.getElementById("patientSpeechVolume")
const doctorSpeechRate = document.getElementById("doctorSpeechRate")
const doctorSpeechVolume = document.getElementById("doctorSpeechVolume")
const patientRateValue = document.getElementById("patientRateValue")
const patientVolumeValue = document.getElementById("patientVolumeValue")
const doctorRateValue = document.getElementById("doctorRateValue")
const doctorVolumeValue = document.getElementById("doctorVolumeValue")
const patientAutoSpeak = document.getElementById("patientAutoSpeak")
const doctorAutoSpeak = document.getElementById("doctorAutoSpeak")
const patientTestVoice = document.getElementById("patientTestVoice")
const doctorTestVoice = document.getElementById("doctorTestVoice")

// Diccionarios de traducción médica
const medicalTranslations = {
  nahuatl: {
    "Buenos días": "Cualli tonalli",
    "Buenas tardes": "Cualli teotlac",
    Hola: "Niltze",
    Gracias: "Tlazohcamati",
    "Por favor": "Nimitztlatlauhtia",
    "Me duele": "Nicococoa",
    Cabeza: "Cuaitl",
    Estómago: "Itetl",
    Medicina: "Pahtli",
    Doctor: "Ticitl",
    Agua: "Atl",
    Comida: "Tlacualli",
    Sí: "Quema",
    No: "Amo",
    "¿Cómo se siente?": "¿Quen timitzmahuilia?",
    "Tome este medicamento": "Xicui inin pahtli",
    "Regrese en una semana": "Xihualla ce chicueyilhuitl",
    "Dolor de cabeza": "Cuaitl cococqui",
    Fiebre: "Totonqui",
    Náuseas: "Elcicihuiliztli",
    Hospital: "Cocoxcacalli",
    Enfermero: "Tepahtiani",
  },
  maya: {
    "Buenos días": "Ma'alob k'iin",
    "Buenas tardes": "Ma'alob ak'ab",
    Hola: "Ba'ax ka wa'alik",
    Gracias: "Dios bo'otik",
    "Por favor": "Meentik a wich",
    "Me duele": "Yaan in k'iinam",
    Cabeza: "Pool",
    Estómago: "Nak'",
    Medicina: "Ts'ak",
    Doctor: "H-men",
    Agua: "Ha'",
    Comida: "Hanal",
    Sí: "He'e",
    No: "Ma'",
    "¿Cómo se siente?": "Bix a wilik?",
    "Tome este medicamento": "A k'amik le ts'ako'",
    "Regrese en una semana": "Ko'ox tu jun semana",
    "Dolor de cabeza": "K'iinam ich pool",
    Fiebre: "K'ak'as iknal",
    Náuseas: "Taak",
    Hospital: "Klinika",
    Enfermero: "Ts'akab",
  },
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  setupTabNavigation()
  setupVoiceControls()
  setupPhraseButtons()
  setupUnifiedRecordingButtons()
  checkBrowserCompatibility()
})

// Inicializar aplicación
function initializeApp() {
  console.log("Inicializando traductor de lenguas nativas...")
  clearConversationPlaceholders()
  updateLanguageDisplay()

  setTimeout(() => {
    addSystemMessage("Sistema de traducción de lenguas nativas iniciado.")
    addSystemMessage(`Lengua nativa seleccionada: ${getLanguageName(currentPatientLanguage)}`)
  }, 1000)
}

// Configurar event listeners
function setupEventListeners() {
  // Botones de envío
  patientSendBtn.addEventListener("click", () => sendMessage("patient"))
  doctorSendBtn.addEventListener("click", () => sendMessage("doctor"))

  // Enter en textarea
  patientInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage("patient")
    }
  })

  doctorInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage("doctor")
    }
  })

  // Selectores de idioma
  patientLanguageSelect.addEventListener("change", (e) => {
    currentPatientLanguage = e.target.value
    addSystemMessage(`Lengua nativa cambiada a: ${getLanguageName(currentPatientLanguage)}`)
    updateLanguageDisplay()
  })

  doctorLanguageSelect.addEventListener("change", (e) => {
    currentDoctorLanguage = e.target.value
    addSystemMessage(`Idioma del médico cambiado a: ${getLanguageName(currentDoctorLanguage)}`)
    updateLanguageDisplay()
  })
}

// Configurar navegación de pestañas
function setupTabNavigation() {
  const tabBtns = document.querySelectorAll(".tab-btn")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab")
      const panel = btn.getAttribute("data-panel")

      // Remover clase active de todos los botones del panel
      const panelBtns = document.querySelectorAll(`[data-panel="${panel}"] .tab-btn`)
      const panelContents = document.querySelectorAll(`#${panel}-traductor, #${panel}-lectura, #${panel}-microfono`)

      panelBtns.forEach((b) => b.classList.remove("active"))
      panelContents.forEach((c) => c.classList.remove("active"))

      // Agregar clase active al botón y contenido seleccionado
      btn.classList.add("active")
      document.getElementById(`${panel}-${targetTab}`).classList.add("active")
    })
  })
}

// Configurar controles de voz
function setupVoiceControls() {
  // Controles del paciente
  if (patientSpeechRate) {
    patientSpeechRate.addEventListener("input", function () {
      patientRateValue.textContent = Number.parseFloat(this.value).toFixed(1)
    })
  }

  if (patientSpeechVolume) {
    patientSpeechVolume.addEventListener("input", function () {
      patientVolumeValue.textContent = Number.parseFloat(this.value).toFixed(1)
    })
  }

  // Controles del doctor
  if (doctorSpeechRate) {
    doctorSpeechRate.addEventListener("input", function () {
      doctorRateValue.textContent = Number.parseFloat(this.value).toFixed(1)
    })
  }

  if (doctorSpeechVolume) {
    doctorSpeechVolume.addEventListener("input", function () {
      doctorVolumeValue.textContent = Number.parseFloat(this.value).toFixed(1)
    })
  }

  // Botones de prueba
  if (patientTestVoice) {
    patientTestVoice.addEventListener("click", () => {
      const testText = getTestText(currentPatientLanguage)
      speakText(testText, "patient")
    })
  }

  if (doctorTestVoice) {
    doctorTestVoice.addEventListener("click", () => {
      const testText = getTestText(currentDoctorLanguage)
      speakText(testText, "doctor")
    })
  }
}

// Configurar botones de frases comunes
function setupPhraseButtons() {
  const vocabButtons = document.querySelectorAll(".vocab-btn")

  vocabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const phrase = btn.getAttribute("data-phrase")
      const target = btn.getAttribute("data-target")

      if (target === "patient") {
        patientInput.value = phrase
        sendMessage("patient")
      } else {
        doctorInput.value = phrase
        sendMessage("doctor")
      }
    })
  })
}

// Configurar botones de grabación unificados
function setupUnifiedRecordingButtons() {
  // Botón unificado del paciente (en input y en pestaña micrófono)
  if (patientMicBtn) {
    patientMicBtn.addEventListener("click", () => {
      toggleUnifiedRecording("patient")
    })
  }

  if (patientRecordBtn) {
    patientRecordBtn.addEventListener("click", () => {
      toggleUnifiedRecording("patient")
    })
  }

  // Botón unificado del doctor (en input y en pestaña micrófono)
  if (doctorMicBtn) {
    doctorMicBtn.addEventListener("click", () => {
      toggleUnifiedRecording("doctor")
    })
  }

  if (doctorRecordBtn) {
    doctorRecordBtn.addEventListener("click", () => {
      toggleUnifiedRecording("doctor")
    })
  }

  console.log("Botones de grabación unificados configurados")
}

// Función unificada para alternar grabación/dictado
function toggleUnifiedRecording(speaker) {
  console.log("Toggle unificado para:", speaker)

  const isCurrentlyRecording = speaker === "patient" ? isPatientRecording : isDoctorRecording

  if (!isCurrentlyRecording) {
    startUnifiedRecording(speaker)
  } else {
    stopUnifiedRecording(speaker)
  }
}

// Iniciar grabación unificada
async function startUnifiedRecording(speaker) {
  console.log("Iniciando grabación unificada para:", speaker)

  try {
    // Solicitar permisos de micrófono
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((track) => track.stop()) // Solo para permisos

    // Verificar soporte de reconocimiento de voz
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      showNotification("Su navegador no soporta reconocimiento de voz. Pruebe con Chrome o Edge.", "error")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang =
      speaker === "patient" ? getLanguageCode(currentPatientLanguage) : getLanguageCode(currentDoctorLanguage)

    let liveMessageId = ""

    recognition.onstart = () => {
      if (speaker === "patient") {
        isPatientRecording = true
        updatePatientRecordingUI(true)
        patientRecognition = recognition
      } else {
        isDoctorRecording = true
        updateDoctorRecordingUI(true)
        doctorRecognition = recognition
      }

      liveMessageId = createLiveMessage(speaker)
      simulateAudioLevel(speaker)
      showNotification(`Grabación iniciada para ${speaker === "patient" ? "paciente" : "médico"}.`, "success")
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

      // Actualizar el input correspondiente
      if (speaker === "patient") {
        patientInput.value = displayText
      } else {
        doctorInput.value = displayText
      }

      if (finalTranscript.trim()) {
        updateLiveMessage(liveMessageId, finalTranscript.trim(), true)

        // Auto-enviar después de una pausa
        setTimeout(() => {
          const currentInput = speaker === "patient" ? patientInput.value : doctorInput.value
          if (currentInput.trim() === finalTranscript.trim()) {
            sendMessage(speaker)
          }
        }, 2000)

        // Crear nuevo mensaje en tiempo real
        setTimeout(() => {
          const isStillRecording = speaker === "patient" ? isPatientRecording : isDoctorRecording
          if (isStillRecording) {
            liveMessageId = createLiveMessage(speaker)
          }
        }, 100)
      }
    }

    recognition.onerror = (event) => {
      console.error("Error en reconocimiento de voz:", event.error)
      stopUnifiedRecording(speaker)

      let errorMessage = "Error en reconocimiento de voz: "
      switch (event.error) {
        case "no-speech":
          errorMessage += "No se detectó voz. Intente hablar más cerca del micrófono."
          break
        case "audio-capture":
          errorMessage += "No se pudo capturar audio. Verifique su micrófono."
          break
        case "not-allowed":
          errorMessage += "Permisos de micrófono denegados."
          break
        case "network":
          errorMessage += "Error de red. Verifique su conexión a internet."
          break
        default:
          errorMessage += event.error
      }

      showNotification(errorMessage, "error")
    }

    recognition.onend = () => {
      const isStillRecording = speaker === "patient" ? isPatientRecording : isDoctorRecording
      if (isStillRecording) {
        setTimeout(() => {
          try {
            recognition.start()
          } catch (error) {
            console.error("Error al reiniciar reconocimiento:", error)
            stopUnifiedRecording(speaker)
          }
        }, 100)
      }
    }

    recognition.start()
  } catch (error) {
    console.error("Error al acceder al micrófono:", error)

    let errorMessage = "Error al acceder al micrófono: "
    if (error.name === "NotAllowedError") {
      errorMessage += "Permisos denegados. Por favor, permita el acceso al micrófono."
    } else if (error.name === "NotFoundError") {
      errorMessage += "No se encontró ningún micrófono."
    } else if (error.name === "NotReadableError") {
      errorMessage += "El micrófono está siendo usado por otra aplicación."
    } else {
      errorMessage += error.message
    }

    showNotification(errorMessage, "error")
  }
}

// Detener grabación unificada
function stopUnifiedRecording(speaker) {
  console.log("Deteniendo grabación unificada para:", speaker)

  if (speaker === "patient") {
    if (patientRecognition) {
      patientRecognition.stop()
    }
    isPatientRecording = false
    updatePatientRecordingUI(false)
  } else {
    if (doctorRecognition) {
      doctorRecognition.stop()
    }
    isDoctorRecording = false
    updateDoctorRecordingUI(false)
  }

  // Limpiar mensajes en vivo
  const liveMessages = document.querySelectorAll(".message.live-message")
  liveMessages.forEach((msg) => msg.remove())

  showNotification(`Grabación detenida para ${speaker === "patient" ? "paciente" : "médico"}.`, "info")
}

// Actualizar UI de grabación del paciente
function updatePatientRecordingUI(isRecording) {
  const micBtn = patientMicBtn
  const recordBtn = patientRecordBtn
  const statusElement = document.getElementById("patientRecordingStatus")
  const audioLevelElement = document.getElementById("patientAudioLevel")

  if (isRecording) {
    // Botón en input
    if (micBtn) {
      micBtn.classList.add("recording")
      micBtn.querySelector(".mic-text").textContent = "Detener"
    }

    // Botón en pestaña micrófono
    if (recordBtn) {
      recordBtn.classList.add("recording")
      recordBtn.querySelector(".btn-label").textContent = "Detener"
    }

    // Estado
    if (statusElement) {
      statusElement.classList.add("active")
      statusElement.querySelector(".status-text").textContent = "🎤 Escuchando..."
    }
  } else {
    // Botón en input
    if (micBtn) {
      micBtn.classList.remove("recording")
      micBtn.querySelector(".mic-text").textContent = "Dictar"
    }

    // Botón en pestaña micrófono
    if (recordBtn) {
      recordBtn.classList.remove("recording")
      recordBtn.querySelector(".btn-label").textContent = "Grabar"
    }

    // Estado
    if (statusElement) {
      statusElement.classList.remove("active")
      statusElement.querySelector(".status-text").textContent = "Micrófono inactivo"
    }

    // Nivel de audio
    if (audioLevelElement) {
      audioLevelElement.style.width = "0%"
    }
  }
}

// Actualizar UI de grabación del doctor
function updateDoctorRecordingUI(isRecording) {
  const micBtn = doctorMicBtn
  const recordBtn = doctorRecordBtn
  const statusElement = document.getElementById("doctorRecordingStatus")
  const audioLevelElement = document.getElementById("doctorAudioLevel")

  if (isRecording) {
    // Botón en input
    if (micBtn) {
      micBtn.classList.add("recording")
      micBtn.querySelector(".mic-text").textContent = "Detener"
    }

    // Botón en pestaña micrófono
    if (recordBtn) {
      recordBtn.classList.add("recording")
      recordBtn.querySelector(".btn-label").textContent = "Detener"
    }

    // Estado
    if (statusElement) {
      statusElement.classList.add("active")
      statusElement.querySelector(".status-text").textContent = "🎤 Escuchando..."
    }
  } else {
    // Botón en input
    if (micBtn) {
      micBtn.classList.remove("recording")
      micBtn.querySelector(".mic-text").textContent
      micBtn.classList.remove("recording")
      micBtn.querySelector(".mic-text").textContent = "Dictar"
    }

    // Botón en pestaña micrófono
    if (recordBtn) {
      recordBtn.classList.remove("recording")
      recordBtn.querySelector(".btn-label").textContent = "Grabar"
    }

    // Estado
    if (statusElement) {
      statusElement.classList.remove("active")
      statusElement.querySelector(".status-text").textContent = "Micrófono inactivo"
    }

    // Nivel de audio
    if (audioLevelElement) {
      audioLevelElement.style.width = "0%"
    }
  }
}

// Crear mensaje en tiempo real
function createLiveMessage(speaker) {
  const conversationArea = speaker === "patient" ? patientConversation : doctorConversation
  const timestamp = getCurrentTimestamp()
  const speakerText = speaker === "patient" ? "Paciente (dictado):" : "Médico (dictado):"

  // Limpiar placeholder si existe
  const placeholder = conversationArea.querySelector(".conversation-placeholder")
  if (placeholder) {
    placeholder.style.display = "none"
  }

  const messageHtml = `
        <div class="message live-message" id="live-${Date.now()}">
            <span class="timestamp">[${timestamp}]</span>
            <span class="speaker">${speakerText}</span>
            <span class="text live-text">🎤 Escuchando...</span>
            <div class="live-indicator">●</div>
        </div>
    `

  conversationArea.insertAdjacentHTML("beforeend", messageHtml)
  const newMessage = conversationArea.lastElementChild
  conversationArea.scrollTop = conversationArea.scrollHeight

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
    readBtn.onclick = () => {
      const speaker = messageElement.closest("#patientConversation") ? "patient" : "doctor"
      speakText(text, speaker)
    }
    messageElement.appendChild(readBtn)
  } else {
    textElement.textContent = text || "🎤 Escuchando..."
  }

  const conversationArea = messageElement.closest(".conversation-area")
  conversationArea.scrollTop = conversationArea.scrollHeight
}

// Simular nivel de audio
function simulateAudioLevel(speaker) {
  const isRecording = speaker === "patient" ? isPatientRecording : isDoctorRecording
  if (!isRecording) return

  const level = Math.random() * 100
  const audioLevelElement = document.getElementById(`${speaker}AudioLevel`)
  if (audioLevelElement) {
    audioLevelElement.style.width = level + "%"
  }

  setTimeout(() => {
    if (isRecording) {
      simulateAudioLevel(speaker)
    }
  }, 100)
}

// Verificar compatibilidad del navegador
async function checkBrowserCompatibility() {
  // Verificar síntesis de voz
  if (!speechSynthesis) {
    showNotification("Advertencia: Síntesis de voz no disponible.", "warning")
  }

  // Verificar reconocimiento de voz
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    showNotification("Nota: Para usar dictado por voz, se recomienda Chrome o Edge.", "info")
  }

  // Verificar permisos de micrófono
  try {
    const result = await navigator.permissions.query({ name: "microphone" })
    if (result.state === "denied") {
      showNotification(
        "Los permisos de micrófono están denegados. Puede habilitarlos en la configuración del navegador.",
        "warning",
      )
    }
  } catch (error) {
    console.log("No se pudo verificar permisos de micrófono:", error)
  }

  // Verificar HTTPS
  if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    showNotification("Advertencia: Se requiere HTTPS para acceso a micrófono en producción.", "warning")
  }
}

// Enviar mensaje
function sendMessage(sender) {
  const input = sender === "patient" ? patientInput : doctorInput
  const text = input.value.trim()

  if (!text) return

  const language = sender === "patient" ? currentPatientLanguage : currentDoctorLanguage
  const timestamp = getCurrentTimestamp()

  // Agregar mensaje original
  addMessage(sender, text, language, "original", timestamp)

  // Actualizar estadísticas
  messagesCount++

  // Limpiar input
  input.value = ""

  // Auto-traducir si es necesario
  setTimeout(() => {
    if (sender === "patient") {
      autoTranslate(text, currentPatientLanguage, "spanish", "doctor")
    } else {
      autoTranslate(text, currentDoctorLanguage, currentPatientLanguage, "patient")
    }
  }, 500)
}

// Auto-traducir mensaje
function autoTranslate(text, fromLang, toLang, targetPanel) {
  showLoading("Traduciendo...")

  setTimeout(
    () => {
      const translatedText = translateText(text, fromLang, toLang)
      const timestamp = getCurrentTimestamp()

      addMessage(targetPanel, translatedText, toLang, "translated", timestamp)

      // Actualizar estadísticas
      translationsCount++

      hideLoading()

      // Leer automáticamente la traducción
      const autoSpeakElement = targetPanel === "patient" ? patientAutoSpeak : doctorAutoSpeak
      if (autoSpeakElement && autoSpeakElement.checked) {
        setTimeout(() => speakText(translatedText, targetPanel), 500)
      }

      // Reproducir sonido de notificación
      playNotificationSound()
    },
    1000 + Math.random() * 1000,
  ) // Simular tiempo de traducción
}

// Traducir texto
function translateText(text, fromLang, toLang) {
  // Buscar en diccionarios médicos
  if (fromLang === "spanish" && medicalTranslations[toLang]) {
    // Traducir de español a lengua nativa
    for (const [spanish, native] of Object.entries(medicalTranslations[toLang])) {
      if (text.toLowerCase().includes(spanish.toLowerCase())) {
        return text.replace(new RegExp(spanish, "gi"), native)
      }
    }
  } else if (toLang === "spanish" && medicalTranslations[fromLang]) {
    // Traducir de lengua nativa a español
    for (const [spanish, native] of Object.entries(medicalTranslations[fromLang])) {
      if (text.toLowerCase().includes(native.toLowerCase())) {
        return text.replace(new RegExp(native, "gi"), spanish)
      }
    }
  }

  // Traducción simulada genérica
  const simulatedTranslations = {
    spanish_to_native: `[${getLanguageName(toLang)}] ${text}`,
    native_to_spanish: `[Traducido del ${getLanguageName(fromLang)}] ${text}`,
  }

  if (fromLang === "spanish") {
    return simulatedTranslations.spanish_to_native
  } else {
    return simulatedTranslations.native_to_spanish
  }
}

// Síntesis de voz
function speakText(text, speaker) {
  if (!speechSynthesis) return

  speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  const rateElement = document.getElementById(`${speaker}SpeechRate`)
  const volumeElement = document.getElementById(`${speaker}SpeechVolume`)

  utterance.lang =
    speaker === "patient" ? getLanguageCode(currentPatientLanguage) : getLanguageCode(currentDoctorLanguage)
  utterance.rate = rateElement ? Number.parseFloat(rateElement.value) : 1
  utterance.volume = volumeElement ? Number.parseFloat(volumeElement.value) : 0.8

  utterance.onstart = () => {
    showNotification("🔊 Reproduciendo...", "info")
  }

  utterance.onerror = (event) => {
    console.error("Error en síntesis de voz:", event.error)
    showNotification("Error en la síntesis de voz.", "error")
  }

  speechSynthesis.speak(utterance)
}

// Agregar mensaje
function addMessage(panel, text, language, type, timestamp) {
  const conversationArea = panel === "patient" ? patientConversation : doctorConversation

  // Limpiar placeholder si existe
  const placeholder = conversationArea.querySelector(".conversation-placeholder")
  if (placeholder) {
    placeholder.style.display = "none"
  }

  const messageHtml = `
        <div class="message ${type}">
            <span class="timestamp">[${timestamp}]</span>
            <span class="speaker">${panel === "patient" ? "Paciente" : "Médico"}:</span>
            <span class="text">${text}</span>
            <span class="language-tag">${getLanguageName(language)}</span>
            <button class="read-btn" onclick="speakText('${text.replace(/'/g, "\\'")}', '${panel}')">🔊</button>
        </div>
    `

  conversationArea.insertAdjacentHTML("beforeend", messageHtml)
  conversationArea.scrollTop = conversationArea.scrollHeight
}

// Agregar mensaje del sistema
function addSystemMessage(text) {
  const timestamp = getCurrentTimestamp()
  const messageHtml = `
        <div class="message system">
            <span class="timestamp">[${timestamp}]</span>
            <span class="speaker">Sistema:</span>
            <span class="text">${text}</span>
        </div>
    `

  // Agregar a ambas conversaciones
  patientConversation.insertAdjacentHTML("beforeend", messageHtml)
  doctorConversation.insertAdjacentHTML("beforeend", messageHtml)

  patientConversation.scrollTop = patientConversation.scrollHeight
  doctorConversation.scrollTop = doctorConversation.scrollHeight
}

// Limpiar placeholders de conversación
function clearConversationPlaceholders() {
  const placeholders = document.querySelectorAll(".conversation-placeholder")
  placeholders.forEach((placeholder) => {
    placeholder.style.display = "none"
  })
}

// Actualizar visualización de idiomas
function updateLanguageDisplay() {
  // Actualizar placeholders
  patientInput.placeholder = `Escriba en ${getLanguageName(currentPatientLanguage).toLowerCase()}...`
  doctorInput.placeholder = `Escriba en ${getLanguageName(currentDoctorLanguage).toLowerCase()}...`
}

// Obtener nombre del idioma
function getLanguageName(code) {
  const names = {
    nahuatl: "Náhuatl",
    maya: "Maya",
    mixteco: "Mixteco",
    zapoteco: "Zapoteco",
    yokoon: "Yoko'on",
    otomi: "Otomí",
    totonaco: "Totonaco",
    huichol: "Huichol",
    tarahumara: "Tarahumara",
    purepecha: "Purépecha",
    spanish: "Español",
    english: "English",
  }
  return names[code] || code
}

// Obtener código de idioma para síntesis de voz
function getLanguageCode(code) {
  const codes = {
    nahuatl: "es-MX", // Fallback a español mexicano
    maya: "es-MX",
    mixteco: "es-MX",
    zapoteco: "es-MX",
    yokoon: "es-MX",
    otomi: "es-MX",
    totonaco: "es-MX",
    huichol: "es-MX",
    tarahumara: "es-MX",
    purepecha: "es-MX",
    spanish: "es-ES",
    english: "en-US",
  }
  return codes[code] || "es-ES"
}

// Obtener texto de prueba
function getTestText(language) {
  const testTexts = {
    nahuatl: "Niltze, cualli tonalli. Nica niticitl.",
    maya: "Ba'ax ka wa'alik, ma'alob k'iin. Teen h-men.",
    mixteco: "Nduku, nuu savi. Nuu tay yuku.",
    zapoteco: "Naa, guela'a'. Rini' doctoor.",
    yokoon: "Jach, jach ki. Yaan poxinel.",
    spanish: "Hola, buenos días. Soy doctor.",
    english: "Hello, good morning. I am a doctor.",
  }
  return testTexts[language] || "Texto de prueba para síntesis de voz."
}

// Obtener timestamp actual
function getCurrentTimestamp() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

// Reproducir sonido de notificación
function playNotificationSound() {
  const audio = document.getElementById("notificationSound")
  if (audio) {
    audio.currentTime = 0
    audio.play().catch((e) => console.log("No se pudo reproducir sonido:", e))
  }
}

// Mostrar loading
function showLoading(text = "Cargando...") {
  document.querySelector(".loading-text").textContent = text
  loadingOverlay.classList.add("show")
}

// Ocultar loading
function hideLoading() {
  loadingOverlay.classList.remove("show")
}

// Sistema de notificaciones
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Hacer clic para cerrar
  notification.addEventListener("click", () => {
    notification.remove()
  })

  notificationContainer.appendChild(notification)

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 5000)
}

// Cleanup al cerrar la página
window.addEventListener("beforeunload", () => {
  if (patientRecognition) patientRecognition.stop()
  if (doctorRecognition) doctorRecognition.stop()
  if (speechSynthesis && speechSynthesis.speaking) {
    speechSynthesis.cancel()
  }
})

// Detectar cambios de visibilidad de la página
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (isPatientRecording) stopUnifiedRecording("patient")
    if (isDoctorRecording) stopUnifiedRecording("doctor")
    showNotification("Grabación pausada: pestaña no visible.", "info")
  }
})

// Detectar cambios de conexión
window.addEventListener("online", () => {
  showNotification("Conexión a internet restaurada.", "success")
})

window.addEventListener("offline", () => {
  showNotification("Sin conexión a internet. Funcionando en modo offline.", "warning")
})
