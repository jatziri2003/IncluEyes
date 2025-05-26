// Archivo: js/accessibility-functions.js
// Maneja la comunicación entre la página principal y el iframe del panel de accesibilidad

class AccessibilityManager {
  constructor() {
    this.iframe = null
    this.isOpen = false
    this.settings = this.loadSettings()

    this.init()
  }

  init() {
    console.log("🚀 AccessibilityManager inicializado")
    this.createAccessibilityButton()
    this.setupMessageListener()
    this.applyStoredSettings()
  }

  createAccessibilityButton() {
    // Crear botón de accesibilidad si no existe
    if (!document.querySelector(".accessibility-trigger")) {
      const button = document.createElement("button")
      button.className = "accessibility-trigger"
     button.innerHTML = '<img src="img/accesibilidad.png" alt="Accesibilidad" style="width: 70%; height: auto;">';
      button.title = "Abrir Panel de Accesibilidad"
      button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
      `

      button.addEventListener("click", () => this.togglePanel())
      button.addEventListener("mouseenter", () => {
        button.style.transform = "scale(1.1)"
        button.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)"
      })
      button.addEventListener("mouseleave", () => {
        button.style.transform = "scale(1)"
        button.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)"
      })

      document.body.appendChild(button)
      console.log("✅ Botón de accesibilidad creado")
    }
  }

  togglePanel() {
    if (this.isOpen) {
      this.closePanel()
    } else {
      this.openPanel()
    }
  }

  openPanel() {
    console.log("🎯 Abriendo panel de accesibilidad")

    if (!this.iframe) {
      this.createIframe()
    }

    this.iframe.style.display = "block"
    this.isOpen = true

    // Enviar mensaje al iframe para abrir el panel
    setTimeout(() => {
      if (this.iframe.contentWindow) {
        this.iframe.contentWindow.postMessage({ type: "open-panel" }, "*")
      }
    }, 100)
  }

  closePanel() {
    console.log("🔒 Cerrando panel de accesibilidad")

    if (this.iframe) {
      this.iframe.style.display = "none"
    }
    this.isOpen = false
  }

  createIframe() {
    console.log("📱 Creando iframe del panel de accesibilidad")

    this.iframe = document.createElement("iframe")
    this.iframe.src = "accesibilidad.html"
    this.iframe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      z-index: 10000;
      background: transparent;
      pointer-events: none;
      display: none;
    `

    this.iframe.onload = () => {
      console.log("✅ Iframe del panel de accesibilidad cargado")
      this.iframe.style.pointerEvents = "auto"
    }

    document.body.appendChild(this.iframe)
  }

  setupMessageListener() {
    window.addEventListener("message", (event) => {
      console.log("📨 Mensaje recibido en página principal:", event.data)

      if (event.data.type === "accessibility-panel-closed") {
        this.closePanel()
      } else if (event.data.type === "accessibility-settings-changed") {
        this.handleSettingsChange(event.data.settings)
      } else if (event.data.type === "apply-accessibility-settings") {
        this.applySettings(event.data.settings)
      }
    })
  }

  handleSettingsChange(settings) {
    console.log("⚙️ Aplicando configuraciones recibidas:", settings)
    this.settings = settings
    this.saveSettings()
    this.applySettings(settings)
  }

  applySettings(settings) {
    // Aplicar configuraciones de accesibilidad
    this.applyTextSize(settings.textSize)
    this.applyVisualSettings(settings)
    this.applyVoiceSettings(settings)
    this.applyLanguageSettings(settings)
  }

  applyTextSize(size) {
    const body = document.body

    // Remover clases anteriores
    body.classList.remove(
      "accessibility-text-small",
      "accessibility-text-normal",
      "accessibility-text-large",
      "accessibility-text-xlarge",
    )

    // Aplicar nueva clase
    if (size && size !== "normal") {
      body.classList.add(`accessibility-text-${size}`)
    }
  }

  applyVisualSettings(settings) {
    const body = document.body

    // Alto contraste
    body.classList.toggle("accessibility-high-contrast", settings.highContrast)

    // Modo oscuro
    body.classList.toggle("accessibility-dark-mode", settings.darkMode)

    // Subrayar enlaces
    body.classList.toggle("accessibility-underline-links", settings.underlineLinks)

    // Quitar imágenes
    body.classList.toggle("accessibility-remove-images", settings.removeImages)

    // Cursor grande
    body.classList.toggle("accessibility-large-cursor", settings.largeCursor)

    // Resaltado de enfoque
    body.classList.toggle("accessibility-focus-highlight", settings.focusHighlight)

    // Menú grande
    body.classList.toggle("accessibility-large-menu", settings.largeMenu)

    // Aplicar espaciado de líneas
    this.applyLineSpacing(settings.lineSpacing)

    // Aplicar espaciado de letras
    this.applyLetterSpacing(settings.letterSpacing)
  }

  applyLineSpacing(spacing) {
    let style = document.getElementById("accessibility-line-spacing")

    if (!style) {
      style = document.createElement("style")
      style.id = "accessibility-line-spacing"
      document.head.appendChild(style)
    }

    if (spacing && spacing !== 1.4) {
      // Usar selectores específicos para evitar conflictos
      style.textContent = `
        body.accessibility-line-spacing-active p,
        body.accessibility-line-spacing-active h1,
        body.accessibility-line-spacing-active h2,
        body.accessibility-line-spacing-active h3,
        body.accessibility-line-spacing-active h4,
        body.accessibility-line-spacing-active h5,
        body.accessibility-line-spacing-active h6,
        body.accessibility-line-spacing-active li,
        body.accessibility-line-spacing-active div,
        body.accessibility-line-spacing-active span {
          line-height: ${spacing} !important;
        }
      `
      document.body.classList.add("accessibility-line-spacing-active")
    } else {
      style.textContent = ""
      document.body.classList.remove("accessibility-line-spacing-active")
    }
  }

  applyLetterSpacing(spacing) {
    let style = document.getElementById("accessibility-letter-spacing")

    if (!style) {
      style = document.createElement("style")
      style.id = "accessibility-letter-spacing"
      document.head.appendChild(style)
    }

    if (spacing && spacing !== 0) {
      // Usar selectores específicos para evitar conflictos
      style.textContent = `
        body.accessibility-letter-spacing-active p,
        body.accessibility-letter-spacing-active h1,
        body.accessibility-letter-spacing-active h2,
        body.accessibility-letter-spacing-active h3,
        body.accessibility-letter-spacing-active h4,
        body.accessibility-letter-spacing-active h5,
        body.accessibility-letter-spacing-active h6,
        body.accessibility-letter-spacing-active li,
        body.accessibility-letter-spacing-active div,
        body.accessibility-letter-spacing-active span,
        body.accessibility-letter-spacing-active a,
        body.accessibility-letter-spacing-active button {
          letter-spacing: ${spacing}px !important;
        }
      `
      document.body.classList.add("accessibility-letter-spacing-active")
    } else {
      style.textContent = ""
      document.body.classList.remove("accessibility-letter-spacing-active")
    }
  }

  applyVoiceSettings(settings) {
    // Crear el objeto de voz en la ventana principal
    if (!window.accessibilityVoiceReader) {
      window.accessibilityVoiceReader = {
        speechSynthesis: window.speechSynthesis,
        speak: function (text, voiceSettings = {}) {
          console.log("🗣️ Leyendo en ventana principal:", text.substring(0, 50) + "...")

          this.speechSynthesis.cancel()

          if (text.trim()) {
            const utterance = new SpeechSynthesisUtterance(text.trim())
            utterance.rate = voiceSettings.voiceSpeed || 1
            utterance.pitch = voiceSettings.voicePitch || 1
            utterance.lang = "es-ES"

            utterance.onstart = () => console.log("▶️ Iniciando lectura en ventana principal")
            utterance.onend = () => console.log("⏹️ Lectura terminada en ventana principal")
            utterance.onerror = (e) => console.log("❌ Error en lectura:", e)

            this.speechSynthesis.speak(utterance)
          }
        },
      }
    }

    // Aplicar funciones de voz y resaltado
    if (settings.voiceReading) {
      this.addVoiceReading(settings)
    } else {
      this.removeVoiceReading()
    }

    if (settings.hoverHighlight) {
      this.addHoverHighlight(settings)
    } else {
      this.removeHoverHighlight()
    }
  }

  addVoiceReading(settings) {
    console.log("🎤 Activando lectura por voz en página principal")

    this.removeVoiceReading()

    const readableElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, button, a, label, span, div")
    let addedCount = 0

    readableElements.forEach((element) => {
      const text = (element.textContent || element.innerText || "").trim()

      if (text.length < 3) return
      if (element.hasAttribute("data-voice-reading")) return
      if (element.closest("iframe")) return // Evitar elementos dentro del iframe
      if (element.closest(".accessibility-trigger")) return // Evitar el botón de accesibilidad

      const clickHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()

        console.log("🖱️ Click para lectura:", text.substring(0, 30) + "...")

        if (window.accessibilityVoiceReader) {
          window.accessibilityVoiceReader.speak(text, {
            voiceSpeed: settings.voiceSpeed,
            voicePitch: settings.voicePitch,
          })
        }
      }

      element.addEventListener("click", clickHandler, { capture: true })
      element.setAttribute("data-voice-reading", "true")
      element.classList.add("accessibility-voice-enabled")

      addedCount++
    })

    console.log(`✅ Lectura por voz activada en ${addedCount} elementos`)
  }

  removeVoiceReading() {
    console.log("🔇 Desactivando lectura por voz en página principal")

    const elements = document.querySelectorAll('[data-voice-reading="true"]')

    elements.forEach((element) => {
      const newElement = element.cloneNode(true)
      element.parentNode.replaceChild(newElement, element)

      newElement.removeAttribute("data-voice-reading")
      newElement.classList.remove("accessibility-voice-enabled")
    })

    if (window.accessibilityVoiceReader) {
      window.accessibilityVoiceReader.speechSynthesis.cancel()
    }

    console.log(`✅ Lectura por voz desactivada en ${elements.length} elementos`)
  }

  addHoverHighlight(settings) {
    console.log("✨ Activando resaltado al hover en página principal")

    this.removeHoverHighlight()

    const readableElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, button, a, label, span, div")
    let addedCount = 0

    readableElements.forEach((element) => {
      const text = (element.textContent || element.innerText || "").trim()

      if (text.length < 3) return
      if (element.hasAttribute("data-hover-highlight")) return
      if (element.closest("iframe")) return
      if (element.closest(".accessibility-trigger")) return // Evitar el botón de accesibilidad

      const hoverHandler = () => {
        console.log("✨ Resaltando elemento:", text.substring(0, 30) + "...")

        // Aplicar efecto de resaltado
        element.style.backgroundColor = "rgba(255, 235, 59, 0.4)" // Amarillo translúcido
        element.style.boxShadow = "0 0 15px rgba(255, 235, 59, 0.6)"
        element.style.borderLeft = "4px solid #FFD700"
        element.style.paddingLeft = "12px"
        element.style.transform = "scale(1.02)"
        element.style.zIndex = "100"
        element.style.position = "relative"
      }

      const leaveHandler = () => {
        // Remover efecto de resaltado
        element.style.backgroundColor = ""
        element.style.boxShadow = ""
        element.style.borderLeft = ""
        element.style.paddingLeft = ""
        element.style.transform = ""
        element.style.zIndex = ""
        element.style.position = ""
      }

      element.addEventListener("mouseenter", hoverHandler)
      element.addEventListener("mouseleave", leaveHandler)
      element.setAttribute("data-hover-highlight", "true")
      element.classList.add("accessibility-hover-highlight-enabled")

      addedCount++
    })

    console.log(`✅ Resaltado al hover activado en ${addedCount} elementos`)
  }

  removeHoverHighlight() {
    console.log("🚫 Desactivando resaltado al hover en página principal")

    const elements = document.querySelectorAll('[data-hover-highlight="true"]')

    elements.forEach((element) => {
      const newElement = element.cloneNode(true)
      element.parentNode.replaceChild(newElement, element)

      newElement.removeAttribute("data-hover-highlight")
      newElement.classList.remove("accessibility-hover-highlight-enabled")

      // Limpiar estilos de resaltado
      newElement.style.backgroundColor = ""
      newElement.style.boxShadow = ""
      newElement.style.borderLeft = ""
      newElement.style.paddingLeft = ""
      newElement.style.transform = ""
      newElement.style.zIndex = ""
      newElement.style.position = ""
    })

    console.log(`✅ Resaltado al hover desactivado en ${elements.length} elementos`)
  }

  applyLanguageSettings(settings) {
    // Aplicar configuraciones de idioma si es necesario
    if (settings.selectedLanguage) {
      console.log("🌐 Aplicando idioma:", settings.selectedLanguage)
      // Aquí puedes agregar lógica para cambiar idiomas
    }
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem("accessibilitySettings")
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  }

  saveSettings() {
    try {
      localStorage.setItem("accessibilitySettings", JSON.stringify(this.settings))
    } catch (error) {
      console.error("❌ Error guardando configuraciones:", error)
    }
  }

  applyStoredSettings() {
    if (Object.keys(this.settings).length > 0) {
      console.log("📋 Aplicando configuraciones guardadas:", this.settings)
      this.applySettings(this.settings)
    }
  }
}

// Función global para abrir el panel (para compatibilidad)
function openAccessibilityPanel() {
  if (window.accessibilityManager) {
    window.accessibilityManager.openPanel()
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  window.accessibilityManager = new AccessibilityManager()
  console.log("✅ AccessibilityManager inicializado y listo")
})

// Agregar estilos CSS para las clases de accesibilidad con selectores específicos
const accessibilityStyles = document.createElement("style")
accessibilityStyles.textContent = `
  /* Clases de accesibilidad para la página principal - Selectores específicos */
  body.accessibility-text-small { font-size: 0.9em !important; }
  body.accessibility-text-normal { font-size: 1em !important; }
  body.accessibility-text-large { font-size: 1.3em !important; }
  body.accessibility-text-xlarge { font-size: 1.6em !important; }
  
  body.accessibility-underline-links a { text-decoration: underline !important; }
  
  body.accessibility-dark-mode {
    filter: invert(1) hue-rotate(180deg) !important;
    background: #000 !important;
  }
  
  body.accessibility-dark-mode img,
  body.accessibility-dark-mode video,
  body.accessibility-dark-mode iframe {
    filter: invert(1) hue-rotate(180deg) !important;
  }
  
  body.accessibility-high-contrast {
    filter: contrast(150%) brightness(120%) !important;
  }
  
  body.accessibility-remove-images img {
    display: none !important;
  }
  
  body.accessibility-large-cursor {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><polygon points="0,0 0,24 8,18 12,26 16,24 12,16 20,16" fill="black" stroke="white" stroke-width="2"/></svg>'), auto !important;
  }
  
  body.accessibility-large-cursor * {
    cursor: inherit !important;
  }
  
  body.accessibility-focus-highlight *:focus {
    outline: 3px solid #ff6b6b !important;
    outline-offset: 2px !important;
  }
  
  body.accessibility-large-menu {
    font-size: 1.2em !important;
  }
  
  body.accessibility-large-menu .nav-links a,
  body.accessibility-large-menu .btn,
  body.accessibility-large-menu button {
    padding: 15px 20px !important;
    font-size: 1.1em !important;
  }

  /* Estilos específicos para elementos con funciones de voz */
  .accessibility-voice-enabled {
    cursor: pointer !important;
    transition: all 0.3s ease !important;
  }

  .accessibility-voice-enabled:hover {
    background-color: rgba(102, 126, 234, 0.1) !important;
    transform: scale(1.02) !important;
  }

  .accessibility-hover-highlight-enabled {
    transition: all 0.3s ease !important;
    cursor: pointer !important;
  }

  .accessibility-hover-highlight-enabled:hover {
    background-color: rgba(255, 235, 59, 0.4) !important;
    box-shadow: 0 0 15px rgba(255, 235, 59, 0.6) !important;
    border-left: 4px solid #FFD700 !important;
    padding-left: 12px !important;
    transform: scale(1.02) !important;
    z-index: 100 !important;
    position: relative !important;
  }

  /* Asegurar que el botón de accesibilidad no se vea afectado */
  .accessibility-trigger {
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    z-index: 10001 !important;
  }
`
document.head.appendChild(accessibilityStyles)
