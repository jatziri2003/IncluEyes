// Load navbar component
async function loadNavbar() {
  try {
    const response = await fetch("components/navbar.html", )
    const navbarHTML = await response.text()
    document.getElementById("navbar-container").innerHTML = navbarHTML
  } catch (error) {
    console.error("Error loading navbar:", error)
  }
}

// Initialize navbar when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadNavbar().then(() => {
    // Initialize all functionality after navbar is loaded
    initializeNavbar()
    initDropdownFunctionality()
    setActiveNavItem()
    initSmoothScrolling()
    initNavbarScrollEffect()
    initAnimations()
    animateNumbers()
    initLazyLoading()
    initClickOutside()
    initKeyboardNavigation()
  })

  // Initialize accessibility functionality
  initAccessibilityIntegration()
})

// Initialize navbar functionality
function initializeNavbar() {
  const navLinks = document.querySelectorAll(".nav-links a")
  const navLinksContainer = document.getElementById("navLinks")
  const mobileBtn = document.querySelector(".mobile-menu-btn")

  // Add click listeners to nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinksContainer) {
        navLinksContainer.classList.remove("mobile-open")
      }
      if (mobileBtn) {
        mobileBtn.classList.remove("active")
      }
      // Close dropdowns when clicking nav links
      closeAllDropdowns()
    })
  })
}

// Initialize dropdown functionality
function initDropdownFunctionality() {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle")

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      toggleDropdown(event)
    })
  })
}

// Set active navigation item based on current page
function setActiveNavItem() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".nav-links a[href]")

  navLinks.forEach((link) => {
    const href = link.getAttribute("href")

    // Remove existing active classes
    link.classList.remove("active")

    // Check if this link matches current page
    if (
      href === currentPage ||
      (currentPage === "" && href === "index.html") ||
      (currentPage === "index.html" && href === "/index.html") ||
      href.includes(currentPage)
    ) {
      link.classList.add("active")
    }

    // Special handling for dropdown items
    if (href === "interprete.html" && currentPage === "interprete.html") {
      link.classList.add("active")
      // Also highlight the Services dropdown
      const servicesToggle = document.querySelector(".dropdown-toggle")
      if (servicesToggle) {
        servicesToggle.classList.add("active")
      }
    }

    if (href === "traductor.html" && currentPage === "traductor.html") {
      link.classList.add("active")
      // Also highlight the Services dropdown
      const servicesToggle = document.querySelector(".dropdown-toggle")
      if (servicesToggle) {
        servicesToggle.classList.add("active")
      }
    }
  })
}

// Toggle mobile menu
function toggleMobileMenu() {
  const navLinks = document.getElementById("navLinks")
  const mobileBtn = document.querySelector(".mobile-menu-btn")

  if (navLinks && mobileBtn) {
    navLinks.classList.toggle("mobile-open")
    mobileBtn.classList.toggle("active")

    // Close dropdowns when opening mobile menu
    if (navLinks.classList.contains("mobile-open")) {
      closeAllDropdowns()
    }
  }
}

// Toggle dropdown menu
function toggleDropdown(event) {
  event.preventDefault()
  event.stopPropagation()

  const dropdown = event.target.closest(".dropdown")
  const isActive = dropdown.classList.contains("active")

  // Close all other dropdowns
  closeAllDropdowns()

  // Toggle current dropdown
  if (!isActive) {
    dropdown.classList.add("active")

    // Add animation delay for items
    const items = dropdown.querySelectorAll(".dropdown-item")
    items.forEach((item, index) => {
      item.style.animationDelay = `${(index + 1) * 0.1}s`
    })
  }
}

// Close all dropdowns
function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown")
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("active")
  })
}

// Initialize click outside functionality
function initClickOutside() {
  document.addEventListener("click", (event) => {
    const navbar = document.querySelector(".navbar")
    const navLinks = document.getElementById("navLinks")
    const mobileBtn = document.querySelector(".mobile-menu-btn")

    // Check if click is outside navbar
    if (navbar && !navbar.contains(event.target)) {
      // Close mobile menu
      if (navLinks && navLinks.classList.contains("mobile-open")) {
        navLinks.classList.remove("mobile-open")
        if (mobileBtn) {
          mobileBtn.classList.remove("active")
        }
      }

      // Close dropdowns
      closeAllDropdowns()
    }

    // Close dropdown if clicking outside of it
    const dropdown = event.target.closest(".dropdown")
    if (!dropdown) {
      closeAllDropdowns()
    }
  })
}

// Initialize keyboard navigation
function initKeyboardNavigation() {
  document.addEventListener("keydown", (event) => {
    // Close dropdowns and mobile menu on Escape
    if (event.key === "Escape") {
      closeAllDropdowns()

      const navLinks = document.getElementById("navLinks")
      const mobileBtn = document.querySelector(".mobile-menu-btn")

      if (navLinks && navLinks.classList.contains("mobile-open")) {
        navLinks.classList.remove("mobile-open")
        if (mobileBtn) {
          mobileBtn.classList.remove("active")
        }
      }

      // Close accessibility panel on Escape
      closeAccessibilityPanel()
    }

    // Handle Enter and Space for dropdown toggles
    if (event.key === "Enter" || event.key === " ") {
      const target = event.target
      if (target.classList.contains("dropdown-toggle")) {
        event.preventDefault()
        toggleDropdown(event)
      }
    }
  })
}

// Scroll suave para enlaces de navegación
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href === "#" || href === "#login" || href === "#servicios") {
        e.preventDefault()
        return
      }

      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Efecto de sombra en navbar al hacer scroll
function initNavbarScrollEffect() {
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
        navbar.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      } else {
        navbar.classList.remove("scrolled")
        navbar.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)"
      }
    }
  })
}

// Animaciones de entrada para elementos
function initAnimations() {
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observar estadísticas y tarjetas de características
  document.querySelectorAll(".stat-item, .benefit-card, .tech-card, .mode-card, .feature-item").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// Toggle mode details con funcionalidades mejoradas
function toggleModeDetails(button) {
  const modeCard = button.closest(".mode-card")
  const details = modeCard.querySelector(".mode-details")
  const btnText = button.querySelector(".btn-text")
  const btnIcon = button.querySelector(".btn-icon")

  // Cerrar otros detalles abiertos
  closeOtherModeDetails(button)

  if (details.style.display === "none" || details.style.display === "") {
    // Mostrar detalles
    details.style.display = "block"
    details.classList.remove("hide")
    details.classList.add("show")
    btnText.textContent = "Leer menos"
    btnIcon.textContent = "▲"
    button.classList.add("expanded")

    // Scroll suave hacia la tarjeta expandida
    setTimeout(() => {
      modeCard.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 150)
  } else {
    // Ocultar detalles
    details.classList.remove("show")
    details.classList.add("hide")
    btnText.textContent = "Leer más"
    btnIcon.textContent = "▼"
    button.classList.remove("expanded")

    setTimeout(() => {
      details.style.display = "none"
      details.classList.remove("hide")
    }, 300)
  }
}

// Función para cerrar todos los detalles de modos excepto el actual
function closeOtherModeDetails(currentButton) {
  const allButtons = document.querySelectorAll(".read-more-btn")

  allButtons.forEach((button) => {
    if (button !== currentButton && button.classList.contains("expanded")) {
      const modeCard = button.closest(".mode-card")
      const details = modeCard.querySelector(".mode-details")
      const btnText = button.querySelector(".btn-text")
      const btnIcon = button.querySelector(".btn-icon")

      details.classList.remove("show")
      details.classList.add("hide")
      btnText.textContent = "Leer más"
      btnIcon.textContent = "▼"
      button.classList.remove("expanded")

      setTimeout(() => {
        details.style.display = "none"
        details.classList.remove("hide")
      }, 300)
    }
  })
}

// Función para animar números (contador)
function animateNumbers() {
  const statNumbers = document.querySelectorAll(".stat-number")

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stat = entry.target
        const finalNumber = stat.textContent
        const numericValue = Number.parseInt(finalNumber.replace(/\D/g, ""))
        const suffix = finalNumber.replace(/[\d.]/g, "")

        let currentNumber = 0
        const increment = numericValue / 50

        const timer = setInterval(() => {
          currentNumber += increment
          if (currentNumber >= numericValue) {
            stat.textContent = finalNumber
            clearInterval(timer)
          } else {
            stat.textContent = Math.floor(currentNumber) + suffix
          }
        }, 30)

        observer.unobserve(stat)
      }
    })
  }, observerOptions)

  statNumbers.forEach((stat) => observer.observe(stat))
}

// Función para mostrar notificaciones
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Estilos de la notificación
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  `

  // Colores según el tipo
  const colors = {
    info: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  }

  notification.style.backgroundColor = colors[type] || colors.info

  document.body.appendChild(notification)

  // Mostrar notificación
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Ocultar después de 3 segundos
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Función para validar formularios
function validateForm(formElement) {
  const inputs = formElement.querySelectorAll("input[required], textarea[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "#ef4444"
      input.style.boxShadow = "0 0 0 1px #ef4444"
      isValid = false
    } else {
      input.style.borderColor = "#d1d5db"
      input.style.boxShadow = "none"
    }
  })

  return isValid
}

// Función para lazy loading de imágenes
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Función para manejar el scroll hacia arriba
function initScrollToTop() {
  // Crear botón de scroll to top
  const scrollBtn = document.createElement("button")
  scrollBtn.innerHTML = "↑"
  scrollBtn.className = "scroll-to-top"
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #3b82f6;
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  `

  document.body.appendChild(scrollBtn)

  // Mostrar/ocultar botón según scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.style.opacity = "1"
      scrollBtn.style.visibility = "visible"
    } else {
      scrollBtn.style.opacity = "0"
      scrollBtn.style.visibility = "hidden"
    }
  })

  // Scroll to top al hacer click
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Función para manejar el resize de ventana
function initResponsiveHandlers() {
  let resizeTimer

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      // Cerrar menú móvil si se cambia a desktop
      if (window.innerWidth > 768) {
        const navLinks = document.getElementById("navLinks")
        const mobileBtn = document.querySelector(".mobile-menu-btn")

        if (navLinks && mobileBtn) {
          navLinks.classList.remove("mobile-open")
          mobileBtn.classList.remove("active")
        }
        // Close dropdowns when resizing to desktop
        closeAllDropdowns()
      }
    }, 250)
  })
}

// ===== ACCESSIBILITY INTEGRATION =====

let accessibilityFrame = null

// Initialize accessibility integration
function initAccessibilityIntegration() {
  createAccessibilityStyles()
  setupMessageListener()
  applyStoredAccessibilitySettings()

  console.log("✅ Integración de accesibilidad inicializada - Solo botón del navbar")
}

// Create accessibility styles for the main page
function createAccessibilityStyles() {
  const style = document.createElement("style")
  style.id = "accessibility-styles"
  style.textContent = `
    /* Accessibility Classes */
    body.accessibility-large-menu {
      font-size: 1.2em !important;
    }

    body.accessibility-large-menu .nav-links a,
    body.accessibility-large-menu .tab-btn,
    body.accessibility-large-menu button {
      padding: 15px 20px !important;
      font-size: 1.1em !important;
    }

    body.accessibility-text-small { font-size: 0.9em !important; }
    body.accessibility-text-normal { font-size: 1em !important; }
    body.accessibility-text-large { font-size: 1.3em !important; }
    body.accessibility-text-xlarge { font-size: 1.6em !important; }

    body.accessibility-underline-links a {
      text-decoration: underline !important;
    }

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

    /* Language Classes */
    body.lang-nahuatl { font-family: "Times New Roman", serif !important; }
    body.lang-maya { font-family: "Georgia", serif !important; }
    body.lang-yokotan { font-family: "Palatino", serif !important; }
    body.lang-otomi { font-family: "Book Antiqua", serif !important; }
    body.lang-zapoteco { font-family: "Garamond", serif !important; }
    body.lang-mixteco { font-family: "Baskerville", serif !important; }

    /* Notification */
    .language-notification {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 10002;
      font-size: 0.9rem;
      font-weight: 500;
      animation: slideDown 0.5s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    /* Estilos CORREGIDOS para el botón de accesibilidad en el navbar */
    .help-icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      width: 40px;
      height: 40px;
    }

    .help-icon-btn:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: scale(1.1);
    }

    .help-icon-btn.active {
      background: rgba(255, 107, 107, 0.2) !important;
      transform: scale(1.1);
    }

    /* ESTILOS CORREGIDOS PARA LA IMAGEN */
    .help-icon {
      width: 24px;
      height: 24px;
      object-fit: contain;
      transition: all 0.3s ease;
      /* Remover filtros que pueden ocultar la imagen */
      filter: none !important;
      opacity: 1 !important;
      display: block !important;
    }

    .help-icon-btn:hover .help-icon {
      transform: scale(1.1);
      opacity: 0.8;
    }

    .help-icon-btn.active .help-icon {
      filter: hue-rotate(180deg) brightness(1.2);
    }

    /* Fallback si la imagen no carga */
    .help-icon-btn:not(:has(img)) {
      position: relative;
    }

    .help-icon-btn:not(:has(img))::before {
      content: "♿";
      font-size: 20px;
      color: #667eea;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Responsive para móvil */
    @media (max-width: 768px) {
      .help-icon-btn {
        margin: 10px 0;
        padding: 12px;
        background: rgba(102, 126, 234, 0.1);
        border-radius: 12px;
        width: auto;
        height: auto;
      }
      
      .help-icon {
        width: 20px;
        height: 20px;
      }
    }

    /* Asegurar que la imagen sea visible en todos los casos */
    .help-icon-btn img {
      max-width: 100%;
      max-height: 100%;
      width: 24px !important;
      height: 24px !important;
      object-fit: contain !important;
      display: block !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
  `
  document.head.appendChild(style)
}

// Open accessibility panel in iframe
function openAccessibilityPanel() {
  console.log("🎯 Abriendo panel de accesibilidad desde navbar...")

  if (accessibilityFrame) {
    closeAccessibilityPanel()
    return
  }

  // Create iframe for accessibility panel
  accessibilityFrame = document.createElement("iframe")
  accessibilityFrame.src = "accesibilidad.html"
  accessibilityFrame.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 450px;
    height: 100vh;
    border: none;
    z-index: 10000;
    background: white;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease;
  `

  document.body.appendChild(accessibilityFrame)

  // Update navbar button
  const navbarBtn = document.querySelector(".help-icon-btn")
  if (navbarBtn) {
    navbarBtn.classList.add("active")
    console.log("✅ Botón del navbar marcado como activo")
  }

  // Prevent body scroll
  document.body.style.overflow = "hidden"

  // Auto-open panel when iframe loads
  accessibilityFrame.onload = () => {
    console.log("✅ Panel de accesibilidad cargado en iframe")
    // Wait a bit for the iframe to fully load
    setTimeout(() => {
      try {
        console.log("📨 Enviando mensaje para abrir panel...")
        accessibilityFrame.contentWindow.postMessage({ type: "open-panel" }, "*")
      } catch (error) {
        console.log("⚠️ Error comunicando con iframe:", error)
      }
    }, 200)
  }

  // Fallback: try to open after a delay
  setTimeout(() => {
    try {
      if (accessibilityFrame && accessibilityFrame.contentWindow) {
        console.log("📨 Fallback: Enviando mensaje para abrir panel...")
        accessibilityFrame.contentWindow.postMessage({ type: "open-panel" }, "*")
      }
    } catch (error) {
      console.log("⚠️ Fallback communication failed:", error)
    }
  }, 1000)

  console.log("✅ Panel de accesibilidad iframe creado")
}

// Close accessibility panel
function closeAccessibilityPanel() {
  console.log("🔒 Cerrando panel de accesibilidad...")

  if (accessibilityFrame) {
    document.body.removeChild(accessibilityFrame)
    accessibilityFrame = null
  }

  // Reset navbar button
  const navbarBtn = document.querySelector(".help-icon-btn")
  if (navbarBtn) {
    navbarBtn.classList.remove("active")
    console.log("✅ Botón del navbar resetado")
  }

  // Restore body scroll
  document.body.style.overflow = ""

  console.log("✅ Panel de accesibilidad cerrado")
}

// Setup message listener for iframe communication
function setupMessageListener() {
  window.addEventListener("message", (event) => {
    // Allow messages from same origin or iframe
    if (event.origin !== window.location.origin && event.origin !== "null") return

    const { type, settings } = event.data

    console.log("📨 Mensaje recibido en ventana principal:", type)

    switch (type) {
      case "accessibility-panel-closed":
        closeAccessibilityPanel()
        break

      case "accessibility-settings-changed":
      case "apply-accessibility-settings":
        if (settings) {
          applyAccessibilitySettings(settings)
        }
        break
    }
  })
}

// Apply accessibility settings to the main page
function applyAccessibilitySettings(settings) {
  console.log("🎨 Aplicando configuraciones de accesibilidad:", settings)

  const body = document.body

  // Remove all accessibility classes first
  const classesToRemove = [
    "accessibility-large-menu",
    "accessibility-text-small",
    "accessibility-text-normal",
    "accessibility-text-large",
    "accessibility-text-xlarge",
    "accessibility-underline-links",
    "accessibility-high-contrast",
    "accessibility-dark-mode",
    "accessibility-remove-images",
    "accessibility-large-cursor",
    "accessibility-focus-highlight",
    "lang-nahuatl",
    "lang-maya",
    "lang-yokotan",
    "lang-otomi",
    "lang-zapoteco",
    "lang-mixteco",
  ]

  classesToRemove.forEach((className) => body.classList.remove(className))

  // Apply new settings
  if (settings.largeMenu) body.classList.add("accessibility-large-menu")
  if (settings.textSize) body.classList.add(`accessibility-text-${settings.textSize}`)
  if (settings.underlineLinks) body.classList.add("accessibility-underline-links")
  if (settings.highContrast) body.classList.add("accessibility-high-contrast")
  if (settings.darkMode) body.classList.add("accessibility-dark-mode")
  if (settings.removeImages) body.classList.add("accessibility-remove-images")
  if (settings.largeCursor) body.classList.add("accessibility-large-cursor")
  if (settings.focusHighlight) body.classList.add("accessibility-focus-highlight")

  // Apply language
  if (settings.selectedLanguage && settings.selectedLanguage !== "es") {
    const languageMap = {
      nah: "lang-nahuatl",
      yua: "lang-maya",
      chf: "lang-yokotan",
      otm: "lang-otomi",
      zap: "lang-zapoteco",
      mix: "lang-mixteco",
    }

    if (languageMap[settings.selectedLanguage]) {
      body.classList.add(languageMap[settings.selectedLanguage])
    }
  }

  // Apply line spacing
  if (settings.lineSpacing) {
    const style = document.getElementById("accessibility-line-spacing") || document.createElement("style")
    style.id = "accessibility-line-spacing"
    style.textContent = `* { line-height: ${settings.lineSpacing} !important; }`
    document.head.appendChild(style)
  }

  // Apply letter spacing
  if (settings.letterSpacing) {
    const style = document.getElementById("accessibility-letter-spacing") || document.createElement("style")
    style.id = "accessibility-letter-spacing"
    style.textContent = `* { letter-spacing: ${settings.letterSpacing}px !important; }`
    document.head.appendChild(style)
  }
}

// Apply stored accessibility settings on page load
function applyStoredAccessibilitySettings() {
  try {
    const savedSettings = localStorage.getItem("accessibilitySettings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      applyAccessibilitySettings(settings)
      console.log("✅ Configuraciones guardadas aplicadas")
    }
  } catch (error) {
    console.error("❌ Error loading accessibility settings:", error)
  }
}

// Inicializar scroll to top y handlers responsivos
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    initScrollToTop()
    initResponsiveHandlers()
  }, 1000)
})

// Utility functions for external use
window.NavbarUtils = {
  toggleMobileMenu,
  toggleDropdown,
  closeAllDropdowns,
  setActiveNavItem,
  closeMobileMenu: () => {
    const navLinks = document.getElementById("navLinks")
    const mobileBtn = document.querySelector(".mobile-menu-btn")

    if (navLinks) navLinks.classList.remove("mobile-open")
    if (mobileBtn) mobileBtn.classList.remove("active")
    closeAllDropdowns()
  },
}

// Exportar funciones para uso global
window.IncluyesApp = {
  showNotification,
  validateForm,
  animateNumbers,
  toggleModeDetails,
  loadNavbar,
  toggleDropdown,
  closeAllDropdowns,
  setActiveNavItem,
  openAccessibilityPanel,
  closeAccessibilityPanel,
}

// Debug function
function debugNavbar() {
  console.log("Navbar Debug Info:", {
    currentPage: window.location.pathname.split("/").pop(),
    mobileMenuOpen: document.getElementById("navLinks")?.classList.contains("mobile-open"),
    activeDropdowns: document.querySelectorAll(".dropdown.active").length,
    windowWidth: window.innerWidth,
    accessibilityFrame: !!accessibilityFrame,
  })
}

// Función de utilidad para debugging
function debugLog(message, data = null) {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    console.log(`[InclúYes Debug]: ${message}`, data)
  }
}

// Export for debugging
window.debugNavbar = debugNavbar
window.debugLog = debugLog

// ===== MAKE FUNCTIONS GLOBALLY AVAILABLE =====

// Hacer la función disponible globalmente para el onclick del navbar
window.openAccessibilityPanel = openAccessibilityPanel
window.closeAccessibilityPanel = closeAccessibilityPanel
window.toggleMobileMenu = toggleMobileMenu
window.toggleDropdown = toggleDropdown

console.log("✅ Scripts cargados correctamente - Solo botón del navbar activo")
// ===== VOICE READER FUNCTIONALITY =====
function createAccessibilityVoiceReader() {
  if (window.accessibilityVoiceReader) return;

  window.accessibilityVoiceReader = {
    speechSynthesis: window.speechSynthesis,
    currentUtterance: null,
    isReading: false,
    settings: { voiceSpeed: 1, voicePitch: 1 },

    speak(text, settings = {}) {
      console.log("🗣️ Leyendo texto:", text.substring(0, 50) + "...");
      
      this.speechSynthesis.cancel();
      
      if (text.trim()) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = settings.voiceSpeed || this.settings.voiceSpeed;
        utterance.pitch = settings.voicePitch || this.settings.voicePitch;
        utterance.lang = "es-ES";
        
        utterance.onstart = () => {
          console.log("▶️ Iniciando lectura");
          this.isReading = true;
        };
        
        utterance.onend = () => {
          console.log("⏹️ Lectura terminada");
          this.isReading = false;
        };
        
        utterance.onerror = (error) => {
          console.error("❌ Error en lectura:", error);
          this.isReading = false;
        };
        
        this.currentUtterance = utterance;
        this.speechSynthesis.speak(utterance);
      }
    },

    stop() {
      this.speechSynthesis.cancel();
      this.isReading = false;
    },

    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings };
      console.log("🎛️ Configuraciones de voz actualizadas:", this.settings);
    }
  };

  console.log("✅ Voice Reader creado en ventana principal");
}

// Crear el voice reader cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  createAccessibilityVoiceReader();
});
